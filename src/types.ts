// Minimal Home Assistant frontend typings — enough for this card, without
// pulling in custom-card-helpers as a dependency.

export interface HassEntityAttributes {
  friendly_name?: string;
  device_class?: string;
  brightness?: number;
  current_position?: number;
  [key: string]: unknown;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: HassEntityAttributes;
  last_changed?: string;
  last_updated?: string;
}

/** Entity registry entry (hass.entities[entity_id]). */
export interface RegistryEntity {
  entity_id?: string;
  area_id?: string | null;
  device_id?: string | null;
  hidden_by?: string | null;
  disabled_by?: string | null;
}

/** Device registry entry (hass.devices[device_id]). */
export interface RegistryDevice {
  id?: string;
  area_id?: string | null;
}

/** Area registry entry (hass.areas[area_id]). */
export interface Area {
  area_id: string;
  name: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, RegistryEntity>;
  devices?: Record<string, RegistryDevice>;
  areas?: Record<string, Area>;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>
  ): Promise<unknown>;
}

export interface RoomConfig {
  name: string;
  entities: string[];
}

export interface ActiveNowConfig {
  type: string;
  title?: string;
  group_by?: 'area' | 'manual';
  rooms?: RoomConfig[];
  fans?: string[];
  blinds?: string[];
  garage?: string | string[];
  accent_color?: string;
  show_brightness?: boolean;
}

export type DeviceKind = 'light' | 'fan' | 'blind' | 'door';

export interface DeviceItem {
  entity_id: string;
  name: string;
  kind: DeviceKind;
  /** lights only */
  brightnessPct?: number;
  /** doors only */
  isGarage?: boolean;
}

export interface RoomGroup {
  name: string;
  lights: DeviceItem[];
  fans: DeviceItem[];
}

export interface Counts {
  lights: number;
  fans: number;
  blinds: number;
  doors: number;
  total: number;
}

export interface ResolvedModel {
  /** Open garage / regular doors — surfaced as the urgent banner. */
  doors: DeviceItem[];
  /** Lights + fans grouped by room. */
  rooms: RoomGroup[];
  /** Open blinds / curtains — the dedicated zone. */
  blinds: DeviceItem[];
  counts: Counts;
}

export type FilterKey = 'all' | 'lights' | 'blinds' | 'fans' | 'doors';
