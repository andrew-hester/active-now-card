import {
  ActiveNowConfig,
  Counts,
  DeviceItem,
  HassEntity,
  HomeAssistant,
  ResolvedModel,
  RoomGroup,
} from './types';

const BLIND_CLASSES = ['blind', 'curtain', 'shade', 'window', 'awning', 'shutter'];
const DOOR_CLASSES = ['garage', 'door'];
const OTHER_ROOM = 'Other';

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value.slice() : [value];
}

export function friendlyName(hass: HomeAssistant, entityId: string): string {
  const e = hass.states[entityId];
  const name = e?.attributes?.friendly_name;
  if (name) return name;
  // Fall back to a humanized entity id.
  return entityId
    .split('.')
    .pop()!
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Resolve an entity's area name via the entity registry, falling back to its device. */
export function areaName(hass: HomeAssistant, entityId: string): string | null {
  const reg = hass.entities?.[entityId];
  let areaId = reg?.area_id ?? null;
  if (!areaId && reg?.device_id) {
    areaId = hass.devices?.[reg.device_id]?.area_id ?? null;
  }
  if (!areaId) return null;
  return hass.areas?.[areaId]?.name ?? null;
}

export function brightnessPct(entity: HassEntity): number {
  const b = entity.attributes?.brightness;
  if (typeof b === 'number') return Math.round((b / 255) * 100);
  return 100; // on but no brightness attribute
}

/** A cover is "open" if state is open or it reports a position above 0. */
export function isCoverOpen(entity: HassEntity | undefined): boolean {
  if (!entity) return false;
  if (entity.state === 'open') return true;
  const pos = entity.attributes?.current_position;
  return typeof pos === 'number' && pos > 0;
}

function lightItem(hass: HomeAssistant, id: string, e: HassEntity): DeviceItem {
  return {
    entity_id: id,
    name: friendlyName(hass, id),
    kind: 'light',
    brightnessPct: brightnessPct(e),
  };
}

function fanItem(hass: HomeAssistant, id: string): DeviceItem {
  return { entity_id: id, name: friendlyName(hass, id), kind: 'fan' };
}

/**
 * Turn the live `hass` object + card config into the structured model the UI
 * renders from: urgent doors, room groups (lights + fans), and the blinds zone.
 */
export function resolveModel(hass: HomeAssistant, config: ActiveNowConfig): ResolvedModel {
  const states = hass.states || {};
  const manual = config.group_by === 'manual' && Array.isArray(config.rooms);

  const explicitFans = toArray(config.fans);
  const explicitBlinds = toArray(config.blinds);
  const explicitGarage = toArray(config.garage);

  // ---- Doors / garage (urgent banner) ----
  const doors: DeviceItem[] = [];
  const doorIds = new Set<string>();
  const doorCandidates = explicitGarage.length
    ? explicitGarage
    : Object.keys(states).filter(
        (id) =>
          id.startsWith('cover.') &&
          DOOR_CLASSES.includes(String(states[id]?.attributes?.device_class))
      );
  for (const id of doorCandidates) {
    const e = states[id];
    if (!e) continue;
    if (isCoverOpen(e)) {
      doors.push({
        entity_id: id,
        name: friendlyName(hass, id),
        kind: 'door',
        isGarage: explicitGarage.includes(id) || e.attributes?.device_class === 'garage',
      });
      doorIds.add(id);
    }
  }

  // ---- Blinds & curtains (dedicated zone) ----
  const blinds: DeviceItem[] = [];
  const blindCandidates = explicitBlinds.length
    ? explicitBlinds
    : Object.keys(states).filter(
        (id) =>
          id.startsWith('cover.') &&
          BLIND_CLASSES.includes(String(states[id]?.attributes?.device_class)) &&
          !doorIds.has(id)
      );
  for (const id of blindCandidates) {
    const e = states[id];
    if (!e || doorIds.has(id)) continue;
    if (isCoverOpen(e)) {
      blinds.push({ entity_id: id, name: friendlyName(hass, id), kind: 'blind' });
    }
  }

  // ---- Active fans ----
  const fanCandidates = explicitFans.length
    ? explicitFans
    : Object.keys(states).filter((id) => id.startsWith('fan.'));
  const activeFans = fanCandidates.filter((id) => states[id]?.state === 'on');

  // ---- Rooms (lights + fans) ----
  const rooms: RoomGroup[] = [];

  if (manual) {
    const placedFans = new Set<string>();
    for (const rc of config.rooms!) {
      const group: RoomGroup = { name: rc.name, lights: [], fans: [] };
      for (const id of rc.entities || []) {
        const e = states[id];
        if (!e) continue;
        if (id.startsWith('light.') && e.state === 'on') {
          group.lights.push(lightItem(hass, id, e));
        } else if (id.startsWith('fan.') && e.state === 'on') {
          group.fans.push(fanItem(hass, id));
          placedFans.add(id);
        }
      }
      if (group.lights.length || group.fans.length) rooms.push(group);
    }
    // Any active (explicitly listed) fan not assigned to a room lands in "Other".
    const leftover = activeFans.filter((id) => !placedFans.has(id));
    if (leftover.length) {
      rooms.push({ name: OTHER_ROOM, lights: [], fans: leftover.map((id) => fanItem(hass, id)) });
    }
  } else {
    const map = new Map<string, RoomGroup>();
    const group = (name: string): RoomGroup => {
      let g = map.get(name);
      if (!g) {
        g = { name, lights: [], fans: [] };
        map.set(name, g);
      }
      return g;
    };

    for (const id of Object.keys(states)) {
      if (!id.startsWith('light.')) continue;
      const e = states[id];
      if (e.state !== 'on') continue;
      group(areaName(hass, id) || OTHER_ROOM).lights.push(lightItem(hass, id, e));
    }
    for (const id of activeFans) {
      group(areaName(hass, id) || OTHER_ROOM).fans.push(fanItem(hass, id));
    }

    // Alphabetical, with "Other" pinned last.
    const names = [...map.keys()].sort((a, b) => {
      if (a === OTHER_ROOM) return 1;
      if (b === OTHER_ROOM) return -1;
      return a.localeCompare(b);
    });
    for (const n of names) rooms.push(map.get(n)!);
  }

  const counts: Counts = {
    lights: rooms.reduce((n, r) => n + r.lights.length, 0),
    fans: rooms.reduce((n, r) => n + r.fans.length, 0),
    blinds: blinds.length,
    doors: doors.length,
    total: 0,
  };
  counts.total = counts.lights + counts.fans + counts.blinds + counts.doors;

  return { doors, rooms, blinds, counts };
}

/** Build the summary-chip second line: "1 garage door open · 15 lights · …". */
export function buildSummary(model: ResolvedModel): string {
  const c = model.counts;
  const parts: string[] = [];

  if (c.doors) {
    const noun = model.doors.every((d) => d.isGarage) ? 'garage door' : 'door';
    parts.push(`${c.doors} ${noun}${c.doors !== 1 ? 's' : ''} open`);
  }
  if (c.lights) parts.push(`${c.lights} light${c.lights !== 1 ? 's' : ''}`);
  if (c.blinds) parts.push(`${c.blinds} blind${c.blinds !== 1 ? 's' : ''} open`);
  if (c.fans) parts.push(`${c.fans} fan${c.fans !== 1 ? 's' : ''} running`);

  if (!parts.length) return 'Nothing is on — your home is buttoned up';
  return parts.join(' · ') + ' — tap to manage';
}
