import { LitElement, html, css, nothing, svg, SVGTemplateResult, TemplateResult } from 'lit';
import { HassEntity, HomeAssistant } from './types';
import { resolveModel, friendlyName } from './entities';

/* ============================ icons (MDI) ============================ */
const PATHS: Record<string, string> = {
  home: 'M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z',
  bulb: 'M9 21h6v-1H9v1zm0-2h6v-1.5H9V19zm3-17a7 7 0 0 0-4.9 12 1 1 0 0 0 .9.6h8a1 1 0 0 0 .9-.6A7 7 0 0 0 12 2z',
  fan: 'M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.88,18.03 15.09,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.87 2,15.08 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.69 9.22,10.88C9.41,10.41 9.72,9.99 10.11,9.67C8.11,5.97 8.9,2 12.5,2Z',
  blinds: 'M19,19V3H5V19H3V21H21V19H19M7,5H17V7H7V5M7,9H17V11H7V9M7,13H17V15H7V13M7,17H17V18H7V17Z',
  garage: 'M22,9V20H19V11H5V20H2V9L12,5L22,9M18,12H6V13H18V12M18,14H6V15H18V14M18,16H6V17H18V16M18,18H6V19H18V18Z',
  thermometer: 'M15,13V5A3,3 0 0,0 9,5V13A5,5 0 1,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z',
  music: 'M21,3V15.5A3.5,3.5 0 0,1 17.5,19A3.5,3.5 0 0,1 14,15.5A3.5,3.5 0 0,1 17.5,12C18.04,12 18.55,12.12 19,12.34V6.47L9,8.6V17.5A3.5,3.5 0 0,1 5.5,21A3.5,3.5 0 0,1 2,17.5A3.5,3.5 0 0,1 5.5,14C6.04,14 6.55,14.12 7,14.34V6L21,3Z',
  wand: 'M7.5,5.6L10,7L8.6,4.5L10,2L7.5,3.4L5,2L6.4,4.5L5,7L7.5,5.6M19.5,15.4L22,14L20.6,16.5L22,19L19.5,17.6L17,19L18.4,16.5L17,14L19.5,15.4M22,2L20.6,4.5L22,7L19.5,5.6L17,7L18.4,4.5L17,2L19.5,3.4L22,2M13.34,12.78L15.78,10.34L13.66,8.22L11.22,10.66L13.34,12.78M14.37,7.29L16.71,9.63C17.1,10 17.1,10.65 16.71,11.04L5.04,22.71C4.65,23.1 4,23.1 3.63,22.71L1.29,20.37C0.9,20 0.9,19.35 1.29,18.96L12.96,7.29C13.35,6.9 14,6.9 14.37,7.29Z',
  grid: 'M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3',
  door: 'M8,3C6.89,3 6,3.89 6,5V21H4V23H20V21H18V5C18,3.89 17.11,3 16,3H8M9,12A1,1 0 0,1 10,13A1,1 0 0,1 9,14A1,1 0 0,1 8,13A1,1 0 0,1 9,12Z',
  play: 'M8,5.14V19.14L19,12.14L8,5.14Z',
  pause: 'M14,19H18V5H14M6,19H10V5H6V19Z',
  plus: 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z',
  minus: 'M19,13H5V11H19V13Z',
  power: 'M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13',
  close: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
  check: 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z',
  back: 'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z',
  battery: 'M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z',
  fridge: 'M7,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V4A2,2 0 0,1 7,2M7,4V9H17V4H7M7,11V20H17V11H7M8,5H10V8H8V5M8,12H10V16H8V12Z',
  sw: 'M8,18A6,6 0 0,1 2,12A6,6 0 0,1 8,6H16A6,6 0 0,1 22,12A6,6 0 0,1 16,18H8M16,16A4,4 0 0,0 20,12A4,4 0 0,0 16,8A4,4 0 0,0 12,12A4,4 0 0,0 16,16Z',
  sun: 'M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z',
  moon: 'M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95Z',
  cloud: 'M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z',
  rain: 'M12,3.25C12,3.25 6,10 6,14A6,6 0 0,0 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25Z',
  bolt: 'M11,15H6L13,1V9H18L11,23V15Z',
  bed: 'M19,7H11V14H3V5H1V20H3V17H21V20H23V11A4,4 0 0,0 19,7M7,13A3,3 0 0,0 10,10A3,3 0 0,0 7,7A3,3 0 0,0 4,10A3,3 0 0,0 7,13Z',
};
function icon(name: string): SVGTemplateResult {
  return svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${PATHS[name] || ''}"></path></svg>`;
}
function weatherIcon(cond: string): string {
  if (cond === 'sunny') return 'sun';
  if (cond === 'clear-night') return 'moon';
  if (/rain|pour|hail|snow/.test(cond)) return 'rain';
  if (/light/.test(cond)) return 'bolt';
  return 'cloud';
}
function condText(cond: string): string {
  return (cond || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ============================ palette ============================ */
const ACCENT: Record<string, string> = {
  amber: '#FFB23E', blue: '#5BA8F2', teal: '#35D6C6', red: '#F4595B',
  green: '#7CD992', violet: '#b794f6', neutral: '#9aa3b4',
};

type CatKey = 'active' | 'climate' | 'media' | 'scenes' | 'rooms' | 'batteries' | 'refrigeration';
interface CatMeta { title: string; icon: string; accent: keyof typeof ACCENT; dots: (keyof typeof ACCENT)[]; }
const CATS: Record<CatKey, CatMeta> = {
  active: { title: 'Active Now', icon: 'home', accent: 'amber', dots: ['amber', 'blue'] },
  climate: { title: 'Climate', icon: 'thermometer', accent: 'red', dots: ['red'] },
  scenes: { title: 'Scenes & Routines', icon: 'wand', accent: 'teal', dots: ['teal'] },
  rooms: { title: 'Rooms', icon: 'grid', accent: 'blue', dots: ['blue', 'amber', 'teal'] },
  media: { title: 'Media', icon: 'music', accent: 'violet', dots: ['violet'] },
  batteries: { title: 'Batteries', icon: 'battery', accent: 'green', dots: ['green', 'amber', 'red'] },
  refrigeration: { title: 'Refrigeration', icon: 'fridge', accent: 'blue', dots: ['blue'] },
};
const DEFAULT_CATS: CatKey[] = ['active', 'climate', 'scenes', 'rooms', 'media', 'batteries', 'refrigeration'];

interface HomeDashConfig {
  type: string;
  name?: string;
  categories?: CatKey[];
  accent_color?: string;
  show_brightness?: boolean;
  weather_entity?: string;
}

type Filter = [string, string, keyof typeof ACCENT, number];

/* ============================ helpers ============================ */
const byDomain = (hass: HomeAssistant, d: string): HassEntity[] =>
  Object.values(hass.states).filter((e) => e.entity_id.startsWith(d + '.'));
const fname = (hass: HomeAssistant, e: HassEntity): string =>
  e.attributes.friendly_name || friendlyName(hass, e.entity_id);
const briPct = (e: HassEntity): number =>
  typeof e.attributes.brightness === 'number' ? Math.round((e.attributes.brightness / 255) * 100) : 100;
/** A light can be dimmed if it advertises a color mode beyond on/off (or already reports brightness). */
function lightDimmable(e: HassEntity): boolean {
  const modes = e.attributes.supported_color_modes as string[] | undefined;
  if (Array.isArray(modes)) return modes.some((m) => m !== 'onoff');
  if (typeof e.attributes.brightness === 'number') return true;
  return (Number(e.attributes.supported_features) & 1) === 1; // legacy SUPPORT_BRIGHTNESS
}
/** A fan supports a variable speed if it advertises SET_SPEED or reports a percentage. */
function fanHasSpeed(e: HassEntity): boolean {
  if ((Number(e.attributes.supported_features) & 1) === 1) return true; // SET_SPEED
  return e.attributes.percentage != null || e.attributes.percentage_step != null;
}
/** Current fan speed as a 0–100 percentage. */
function fanPct(e: HassEntity): number {
  const p = e.attributes.percentage;
  if (typeof p === 'number') return Math.round(p);
  return e.state === 'on' ? 100 : 0;
}
function tempUnit(hass: HomeAssistant): string {
  const u = (hass as unknown as { config?: { unit_system?: { temperature?: string } } }).config;
  return u?.unit_system?.temperature || '°';
}
function weatherEntity(hass: HomeAssistant, cfg: HomeDashConfig): HassEntity | undefined {
  if (cfg.weather_entity) return hass.states[cfg.weather_entity];
  const all = byDomain(hass, 'weather');
  return all.find((e) => /home|forecast/i.test(e.entity_id)) || all[0];
}
function batteryEntities(hass: HomeAssistant): HassEntity[] {
  return byDomain(hass, 'sensor')
    .filter((e) => e.attributes.device_class === 'battery' && !isNaN(parseFloat(e.state)))
    .sort((a, b) => parseFloat(a.state) - parseFloat(b.state));
}
function fridgeEntities(hass: HomeAssistant): HassEntity[] {
  return byDomain(hass, 'sensor').filter((e) =>
    e.attributes.device_class === 'temperature' && /freez|fridge|refriger/i.test((e.attributes.friendly_name || '') + e.entity_id));
}
function battColor(v: number): keyof typeof ACCENT {
  return v < 20 ? 'red' : v < 50 ? 'amber' : 'green';
}
function inAreaFn(hass: HomeAssistant, areaId: string) {
  return (id: string) => {
    const reg = hass.entities?.[id];
    let a = reg?.area_id ?? null;
    if (!a && reg?.device_id) a = hass.devices?.[reg.device_id]?.area_id ?? null;
    return a === areaId;
  };
}

interface ForecastDay { datetime?: string; condition?: string; temperature?: number; templow?: number; }

/* ===========================================================================
 * Modal element — portalled to <body>.
 * ======================================================================== */
class HomeDashboardModal extends LitElement {
  private _hass!: HomeAssistant;
  config!: HomeDashConfig;
  category: CatKey | string = 'active';
  private _filter = 'all';
  get filter(): string { return this._filter; }
  set filter(v: string) { this._filter = v; }
  private _removing = new Set<string>();
  private _prevOverflow = '';
  private _forecast: ForecastDay[] | null = null;
  private _forecastFor = '';
  /** Sliders currently being dragged → keep their value from being reset by live hass updates. */
  private _dragging = new Set<string>();
  private _dragValue = new Map<string, number>();
  private _slideThrottle = new Map<string, number>();

  set hass(h: HomeAssistant) {
    this._hass = h;
    if (this._removing.size) {
      for (const id of [...this._removing]) {
        const e = h.states[id];
        if (!e || (e.state !== 'on' && e.state !== 'open')) this._removing.delete(id);
      }
    }
    this.requestUpdate();
  }
  get hass(): HomeAssistant { return this._hass; }

  override connectedCallback(): void {
    super.connectedCallback();
    this._prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', this._onKey);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.body.style.overflow = this._prevOverflow;
    window.removeEventListener('keydown', this._onKey);
  }
  private _onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') this._close(); };
  private _close(): void { this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true })); }

  private _call(domain: string, service: string, data: Record<string, unknown>): void {
    this._hass.callService(domain, service, data);
  }
  private _removeRow(id: string): void {
    this._removing.add(id);
    this.requestUpdate();
    window.setTimeout(() => { if (this._removing.delete(id)) this.requestUpdate(); }, 2200);
  }
  private _goto(cat: string): void { this.category = cat; this._filter = 'all'; this.requestUpdate(); }
  /** Ask the card (which lives in HA's DOM tree) to open the entity more-info dialog. */
  private _moreInfo(id: string): void {
    if (id) this.dispatchEvent(new CustomEvent('hd-more-info', { detail: { entityId: id } }));
  }

  /* -------------------- render shell -------------------- */
  override render() {
    if (!this._hass || !this.config) return nothing;
    const accent = this.config.accent_color || ACCENT.amber;
    const isRoom = String(this.category).startsWith('room:');
    const built = this._build();
    return html`
      <div class="root" style="--accent:${accent}">
        <div class="scrim" @click=${this._close}></div>
        <div class="modal" role="dialog" aria-modal="true" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mhead">
            <div class="mtop">
              ${isRoom ? html`<button class="backbtn" aria-label="Back to rooms" @click=${() => this._goto('rooms')}>${icon('back')}</button>` : nothing}
              <div>
                <div class="mtitle">${built.title}</div>
                <div class="msub">${built.sub}</div>
              </div>
              <div class="mactions">
                ${built.action ?? nothing}
                <button class="closeX" aria-label="Close" @click=${this._close}>${icon('close')}</button>
              </div>
            </div>
            ${built.filters ? this._renderFilters(built.filters) : nothing}
          </div>
          <div class="mbody">${built.body}</div>
        </div>
      </div>
    `;
  }

  private _renderFilters(filters: Filter[]): TemplateResult {
    return html`<div class="filters">
      ${filters.map(([k, label, color, n]) => html`
        <button class="fchip ${this._filter === k ? 'active' : ''}" @click=${() => { this._filter = k; this.requestUpdate(); }}>
          <span class="fdot" style="background:${ACCENT[color]}"></span>${label}<span class="fcount">${n}</span>
        </button>`)}
    </div>`;
  }

  private _build(): { title: string; sub: string; action?: TemplateResult; filters?: Filter[]; body: TemplateResult | typeof nothing; } {
    const c = String(this.category);
    if (c.startsWith('room:')) return this._buildRoom(c.slice(5));
    switch (this.category as CatKey | 'weather') {
      case 'active': return this._buildActive();
      case 'climate': return this._buildClimate();
      case 'media': return this._buildMedia();
      case 'scenes': return this._buildScenes();
      case 'rooms': return this._buildRooms();
      case 'batteries': return this._buildBatteries();
      case 'refrigeration': return this._buildRefrigeration();
      case 'weather': return this._buildWeather();
      default: return { title: '', sub: '', body: nothing };
    }
  }

  // ---- Active Now ----
  private _buildActive() {
    const m = resolveModel(this._hass, { type: '', group_by: 'area', show_brightness: this.config.show_brightness });
    const live = <T extends { entity_id: string }>(a: T[]) => a.filter((x) => !this._removing.has(x.entity_id));
    const lights = m.rooms.reduce((n, r) => n + live(r.lights).length, 0);
    const fans = m.rooms.reduce((n, r) => n + live(r.fans).length, 0);
    const blinds = live(m.blinds).length;
    const doors = live(m.doors).length;
    const total = lights + fans + blinds + doors;
    const f = this._filter;
    const showLights = f === 'all' || f === 'lights';
    const showFans = f === 'all' || f === 'fans';
    const roomCards = m.rooms.map((r) => {
      const ls = showLights ? r.lights : [];
      const fs = showFans ? r.fans : [];
      if (!ls.length && !fs.length) return null;
      const n = live(ls).length + live(fs).length;
      return html`<div class="gcard"><div class="ghead"><div class="gname">${r.name}</div><div class="pill">${n} on</div>
        <button class="link" @click=${() => this._offMany([...r.lights, ...r.fans], 'light')}>Turn off</button></div>
        ${ls.map((l) => this._lightRowOff(l.entity_id, l.name, l.brightnessPct ?? 100))}
        ${fs.map((fn) => { const fe = this._hass.states[fn.entity_id]; return fe ? this._fanRow(fe, true) : nothing; })}</div>`;
    }).filter(Boolean);
    const blindsZone = (f === 'all' || f === 'blinds') && m.blinds.length ? html`
      <div class="wide"><div class="ghead"><div class="rchip c-blue">${icon('blinds')}</div>
        <div class="gname">Blinds &amp; Curtains <span class="pill">${blinds} open</span></div>
        <button class="link" style="color:${ACCENT.blue}" @click=${() => this._offMany(m.blinds, 'cover')}>Close all</button></div>
        <div class="wgrid">${m.blinds.map((b) => this._toggleRow(b.entity_id, 'blinds', 'blue', b.name, 'Open', () => this._off(b.entity_id, 'cover')))}</div></div>` : nothing;
    const banner = (f === 'all' || f === 'doors') && doors ? html`
      <div class="banner"><div class="rchip c-red">${icon('garage')}</div>
        <div class="btext"><div class="btitle">${doors === 1 ? 'A door is open' : `${doors} doors are open`}</div>
          <div class="bsub">${live(m.doors).map((d) => d.name).join(', ')}</div></div>
        <button class="bbtn" @click=${() => this._offMany(live(m.doors), 'cover')}>Close</button></div>` : nothing;
    const showRooms = f === 'all' || f === 'lights' || f === 'fans';
    const body = total === 0 ? this._empty('All clear', 'Nothing is on. Your home is buttoned up.')
      : html`${banner}${showRooms && roomCards.length ? html`<div class="cols">${roomCards}</div>` : nothing}${blindsZone}`;
    return {
      title: 'Active Now', sub: `${total} thing${total !== 1 ? 's' : ''} on`,
      action: lights >= 1 && (f === 'all' || f === 'lights')
        ? html`<button class="ghost amber" @click=${() => this._offMany(m.rooms.flatMap((r) => r.lights), 'light')}>${icon('bulb')} Turn off all lights</button>` : undefined,
      filters: [['all', 'All', 'neutral', total], ['lights', 'Lights', 'amber', lights], ['blinds', 'Blinds', 'blue', blinds], ['fans', 'Fans', 'teal', fans], ['doors', 'Doors', 'red', doors]] as Filter[],
      body,
    };
  }

  // ---- Climate ----
  private _buildClimate() {
    const u = tempUnit(this._hass);
    const zones = byDomain(this._hass, 'climate').filter((e) => e.state !== 'unavailable' && e.state !== 'off');
    const rows = zones.map((e) => this._climateRow(e, u));
    return { title: 'Climate', sub: `${zones.length} active zone${zones.length !== 1 ? 's' : ''}`,
      body: zones.length ? html`<div class="wide">${rows}</div>` : this._empty('No active zones', 'Every thermostat is off.') };
  }
  private _climateRow(e: HassEntity, u: string): TemplateResult {
    const cur = e.attributes.current_temperature, target = e.attributes.temperature;
    return html`<div class="row" @click=${() => this._moreInfo(e.entity_id)}><div class="rchip c-red">${icon('thermometer')}</div>
      <div class="rtext"><div class="rname">${fname(this._hass, e)}</div>
        <div class="rsub">${cur != null ? `Now ${Math.round(Number(cur))}${u} · ` : ''}${e.state}${target != null ? ` to ${Math.round(Number(target))}${u}` : ''}</div></div>
      <div class="stepper"><button @click=${(ev: Event) => { ev.stopPropagation(); this._setTemp(e, -1); }}>${icon('minus')}</button>
        <span class="temp">${target != null ? Math.round(Number(target)) + u : '—'}</span>
        <button @click=${(ev: Event) => { ev.stopPropagation(); this._setTemp(e, 1); }}>${icon('plus')}</button></div></div>`;
  }

  // ---- Media ----
  private _buildMedia() {
    const players = byDomain(this._hass, 'media_player').filter((e) => e.state !== 'unavailable');
    const active = players.filter((e) => e.state === 'playing' || e.state === 'paused');
    const idle = players.filter((e) => e.state !== 'playing' && e.state !== 'paused');
    const playingN = players.filter((e) => e.state === 'playing').length;
    const line = (e: HassEntity) => {
      const t = e.attributes.media_title as string | undefined, a = e.attributes.media_artist as string | undefined;
      return t ? (a ? `${t} · ${a}` : t) : e.state.charAt(0).toUpperCase() + e.state.slice(1);
    };
    return { title: 'Media', sub: `${playingN} playing`,
      body: html`
        ${active.length ? html`<div class="wide"><div class="ghead"><div class="gname">Now playing</div><div class="pill">${active.length}</div></div>
          ${active.map((e) => this._toggleRow(e.entity_id, e.state === 'playing' ? 'pause' : 'play', 'violet', fname(this._hass, e), line(e), () => this._call('media_player', 'media_play_pause', { entity_id: e.entity_id }), e.state === 'playing'))}</div>` : nothing}
        ${idle.length ? html`<div class="wide" style="margin-top:14px"><div class="ghead"><div class="gname">Idle</div><div class="pill">${idle.length}</div></div>
          ${idle.map((e) => html`<div class="row off" @click=${() => this._moreInfo(e.entity_id)}><div class="rchip c-neutral">${icon('play')}</div>
            <div class="rtext"><div class="rname">${fname(this._hass, e)}</div><div class="rsub">${e.state}</div></div></div>`)}</div>` : nothing}
        ${players.length === 0 ? this._empty('No players', 'No media players found.') : nothing}` };
  }

  // ---- Scenes & routines ----
  private _scriptLabel(e: HassEntity): string { return fname(this._hass, e); }
  private _meaningfulScripts(): HassEntity[] {
    return byDomain(this._hass, 'script').filter((e) =>
      !/helper|duplicate|resync|test|tilt/i.test(e.entity_id + (e.attributes.friendly_name || '')));
  }
  private _scriptById(id: string): HassEntity | undefined { return this._hass.states['script.' + id]; }

  private _quickActions(): { label: string; ic: string; accent: keyof typeof ACCENT; run: () => void }[] {
    const h = this._hass, hr = new Date().getHours();
    const onLights = byDomain(h, 'light').filter((e) => e.state === 'on').map((e) => e.entity_id);
    const blinds = byDomain(h, 'cover').filter((e) => ['blind', 'curtain', 'shade', 'window'].includes(String(e.attributes.device_class)));
    const garageOpen = byDomain(h, 'cover').filter((e) => e.attributes.device_class === 'garage' && (e.state === 'open' || Number(e.attributes.current_position) > 0));
    const A: { label: string; ic: string; accent: keyof typeof ACCENT; run: () => void }[] = [];
    const script = (id: string, label: string, ic: string, accent: keyof typeof ACCENT) => {
      if (this._scriptById(id)) A.push({ label, ic, accent, run: () => this._call('script', 'turn_on', { entity_id: 'script.' + id }) });
    };
    const morning = hr >= 5 && hr < 11, evening = hr >= 17 && hr < 22, night = hr >= 22 || hr < 5;
    if (morning) { script('morning_wake_up', 'Morning Wake Up', 'sun', 'amber'); script('open_all_blinds', 'Open blinds', 'blinds', 'blue'); }
    if (evening || night) { script('close_all_blinds', 'Close blinds', 'blinds', 'blue'); }
    if (night) { script('bedtime', 'Bedtime', 'bed', 'violet'); script('nightly_house_check', 'House check', 'check', 'teal'); }
    if (onLights.length) A.push({ label: 'All lights off', ic: 'bulb', accent: 'amber', run: () => this._call('light', 'turn_off', { entity_id: onLights }) });
    if (garageOpen.length) A.push({ label: 'Close garage', ic: 'garage', accent: 'red', run: () => this._call('cover', 'close_cover', { entity_id: garageOpen.map((e) => e.entity_id) }) });
    if (!night && !morning) script('close_all_blinds', 'Close blinds', 'blinds', 'blue');
    if (blinds.length && !A.some((a) => a.label === 'Close blinds')) A.push({ label: 'Close all blinds', ic: 'blinds', accent: 'blue', run: () => this._call('cover', 'close_cover', { entity_id: blinds.map((e) => e.entity_id) }) });
    return A.slice(0, 6);
  }

  private _buildScenes() {
    const h = this._hass;
    const quick = this._quickActions();
    const scripts = this._meaningfulScripts();
    const mode = h.states['input_select.home_mode'];
    return { title: 'Scenes & Routines', sub: `${quick.length} quick · ${scripts.length} routines`,
      body: html`
        ${quick.length ? html`<div class="wide"><div class="ghead"><div class="gname">Quick actions</div><div class="pill">now</div></div>
          <div class="scenes" style="margin-top:8px">${quick.map((q) => html`<div class="scene" @click=${(ev: Event) => { this._flash(ev); q.run(); }}>
            <div class="rchip c-${q.accent}">${icon(q.ic)}</div><div class="snm">${q.label}</div></div>`)}</div></div>` : nothing}
        ${mode ? html`<div class="wide" style="margin-top:14px"><div class="ghead"><div class="gname">Home mode</div><div class="pill">${mode.state}</div></div>
          <div class="chiprow">${(mode.attributes.options as string[] || []).map((o) => html`<button class="modechip ${mode.state === o ? 'on' : ''}" @click=${() => this._call('input_select', 'select_option', { entity_id: 'input_select.home_mode', option: o })}>${o}</button>`)}</div></div>` : nothing}
        <div class="wide" style="margin-top:14px"><div class="ghead"><div class="gname">Routines</div><div class="pill">${scripts.length}</div></div>
          <div class="scenes" style="margin-top:8px">${scripts.map((e) => html`<div class="scene" @click=${(ev: Event) => { this._flash(ev); this._call('script', 'turn_on', { entity_id: e.entity_id }); }}>
            <div class="rchip c-teal">${icon('wand')}</div><div class="snm">${this._scriptLabel(e)}</div></div>`)}</div></div>` };
  }

  // ---- Rooms grid ----
  private _buildRooms() {
    const areas = Object.values(this._hass.areas || {});
    const tiles = areas.map((a) => {
      const n = this._roomDeviceCount(a.area_id);
      return html`<div class="scene" style="min-height:92px" @click=${() => this._goto(`room:${a.area_id}`)}>
        <div class="rchip c-blue">${icon('grid')}</div><div class="snm">${a.name}</div>
        <div class="rsub" style="font-size:12px">${n} control${n !== 1 ? 's' : ''}</div></div>`;
    });
    return { title: 'Rooms', sub: `${areas.length} room${areas.length !== 1 ? 's' : ''}`,
      body: areas.length ? html`<div class="scenes" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr))">${tiles}</div>`
        : this._empty('No areas', 'Assign devices to areas to see rooms here.') };
  }
  private _roomDeviceCount(areaId: string): number {
    const inA = inAreaFn(this._hass, areaId);
    return ['light', 'switch', 'fan', 'cover', 'climate', 'media_player']
      .reduce((n, d) => n + byDomain(this._hass, d).filter((e) => inA(e.entity_id)).length, 0);
  }

  // ---- Single room (ALL controls) ----
  private _buildRoom(areaId: string) {
    const area = (this._hass.areas || {})[areaId];
    const inA = inAreaFn(this._hass, areaId);
    const u = tempUnit(this._hass);
    const get = (d: string) => byDomain(this._hass, d).filter((e) => inA(e.entity_id) && e.state !== 'unavailable');
    const lights = get('light'), switches = get('switch'), fans = get('fan');
    const covers = get('cover'), climate = get('climate'), media = get('media_player');
    const onN = lights.filter((e) => e.state === 'on').length + switches.filter((e) => e.state === 'on').length + fans.filter((e) => e.state === 'on').length;
    const total = lights.length + switches.length + fans.length + covers.length + climate.length + media.length;
    const group = (title: string, rows: TemplateResult[]) => rows.length ? html`<div class="wide" style="margin-top:14px"><div class="ghead"><div class="gname">${title}</div><div class="pill">${rows.length}</div></div>${rows}</div>` : nothing;
    return {
      title: area?.name || 'Room', sub: `${total} control${total !== 1 ? 's' : ''} · ${onN} on`,
      action: html`<button class="ghost" @click=${() => this._goto('rooms')}>${icon('grid')} All rooms</button>`,
      body: total === 0 ? this._empty('Nothing here', 'No controllable devices are assigned to this room.') : html`
        ${lights.length ? html`<div class="wide"><div class="ghead"><div class="gname">Lights</div><div class="pill">${lights.filter((e) => e.state === 'on').length} on</div>
          ${lights.some((e) => e.state === 'on') ? html`<button class="link" @click=${() => this._call('light', 'turn_off', { entity_id: lights.map((l) => l.entity_id) })}>All off</button>` : nothing}</div>
          ${lights.map((e) => this._roomLight(e))}</div>` : nothing}
        ${group('Switches', switches.map((e) => this._twoRow(e, 'sw', 'teal', 'switch', e.state === 'on', e.state === 'on' ? 'On' : 'Off')))}
        ${group('Fans', fans.map((e) => this._fanRow(e, false)))}
        ${group('Shades', covers.map((e) => this._coverRow(e)))}
        ${climate.length ? html`<div class="wide" style="margin-top:14px"><div class="ghead"><div class="gname">Climate</div><div class="pill">${climate.length}</div></div>${climate.map((e) => this._climateRow(e, u))}</div>` : nothing}
        ${media.length ? html`<div class="wide" style="margin-top:14px"><div class="ghead"><div class="gname">Media</div><div class="pill">${media.length}</div></div>
          ${media.map((e) => this._twoRow(e, e.state === 'playing' ? 'pause' : 'play', 'violet', 'media_player', e.state === 'playing', e.attributes.media_title as string || e.state, 'media_play_pause'))}</div>` : nothing}`,
    };
  }

  // ---- Batteries ----
  private _buildBatteries() {
    const all = batteryEntities(this._hass);
    const f = this._filter;
    const low = all.filter((e) => parseFloat(e.state) < 20);
    const list = (f === 'low' ? low : all);
    const row = (e: HassEntity) => {
      const v = Math.round(parseFloat(e.state));
      const col = battColor(v);
      return html`<div class="row" @click=${() => this._moreInfo(e.entity_id)}><div class="rchip c-${col}">${icon('battery')}</div>
        <div class="rtext"><div class="rname">${fname(this._hass, e)}</div>
          <div class="bar" style="margin-top:6px"><div class="fill" style="width:${v}%;background:${ACCENT[col]}"></div></div></div>
        <div class="bval" style="color:${ACCENT[col]}">${v}%</div></div>`;
    };
    return { title: 'Batteries', sub: `${all.length} tracked · ${low.length} low`,
      filters: [['all', 'All', 'neutral', all.length], ['low', 'Low', 'red', low.length]] as Filter[],
      body: list.length ? html`<div class="wide">${list.map(row)}</div>` : this._empty('All charged', 'No batteries to worry about.') };
  }

  // ---- Refrigeration ----
  private _isFreezer(e: HassEntity): boolean { return /freez/i.test((e.attributes.friendly_name || '') + e.entity_id); }
  private _fridgeStatus(e: HassEntity): { ok: boolean; label: string } {
    const t = parseFloat(e.state);
    const limit = this._isFreezer(e) ? 10 : 42;
    const ok = isNaN(t) ? true : t <= limit;
    return { ok, label: ok ? 'Normal' : 'Warm' };
  }
  private _matchBattery(e: HassEntity): HassEntity | undefined {
    const base = (e.attributes.friendly_name || '').replace(/temperature/i, '').trim();
    return batteryEntities(this._hass).find((b) => (b.attributes.friendly_name || '').toLowerCase().startsWith(base.toLowerCase().slice(0, 10)) && base.length > 4);
  }
  private _buildRefrigeration() {
    const units = fridgeEntities(this._hass);
    const u = tempUnit(this._hass);
    const warm = units.filter((e) => !this._fridgeStatus(e).ok);
    const row = (e: HassEntity) => {
      const st = this._fridgeStatus(e);
      const col = st.ok ? 'blue' : 'red';
      const batt = this._matchBattery(e);
      return html`<div class="row" @click=${() => this._moreInfo(e.entity_id)}>
          <div class="rchip c-${col}">${icon('fridge')}</div>
          <div class="rtext"><div class="rname">${fname(this._hass, e).replace(/ temperature/i, '')}</div>
            <div class="rsub">${this._isFreezer(e) ? 'Freezer' : 'Fridge'} · ${st.label}${batt ? ` · battery ${Math.round(parseFloat(batt.state))}%` : ''}</div></div>
          <div class="bval" style="color:${ACCENT[col]}">${Math.round(parseFloat(e.state))}${u}</div></div>`;
    };
    return { title: 'Refrigeration', sub: `${units.length} unit${units.length !== 1 ? 's' : ''} · ${warm.length ? `${warm.length} warm` : 'all normal'}`,
      body: units.length ? html`<div class="wide">${units.map(row)}</div>` : this._empty('No sensors', 'No refrigeration temperature sensors found.') };
  }

  // ---- Weather ----
  private async _ensureForecast(entityId: string): Promise<void> {
    if (this._forecastFor === entityId) return;
    this._forecastFor = entityId;
    try {
      const r = await (this._hass.callService as unknown as (d: string, s: string, data?: unknown, t?: unknown, n?: boolean, rr?: boolean) => Promise<{ response?: Record<string, { forecast?: ForecastDay[] }> }>)(
        'weather', 'get_forecasts', { type: 'daily' }, { entity_id: entityId }, false, true);
      this._forecast = (r && r.response && r.response[entityId] && r.response[entityId].forecast) || [];
    } catch { this._forecast = []; }
    this.requestUpdate();
  }
  private _buildWeather() {
    const w = weatherEntity(this._hass, this.config);
    if (!w) return { title: 'Weather', sub: '', body: this._empty('No weather', 'No weather entity found.') };
    const u = w.attributes.temperature_unit || tempUnit(this._hass);
    void this._ensureForecast(w.entity_id);
    const stat = (label: string, val: unknown) => val != null ? html`<div class="wstat"><span>${label}</span><b>${val}</b></div>` : nothing;
    const days = (this._forecast || []).slice(0, 7);
    return { title: condText(w.state), sub: `${Math.round(Number(w.attributes.temperature))}${u} now · ${fname(this._hass, w)}`,
      body: html`
        <div class="wide"><div class="wnow"><div class="rchip c-blue" style="width:54px;height:54px">${icon(weatherIcon(w.state))}</div>
          <div class="wbig">${Math.round(Number(w.attributes.temperature))}${u}</div>
          <div class="wgridstats">${stat('Humidity', w.attributes.humidity != null ? w.attributes.humidity + '%' : null)}
            ${stat('Wind', w.attributes.wind_speed != null ? `${Math.round(Number(w.attributes.wind_speed))} ${w.attributes.wind_speed_unit || ''}` : null)}
            ${stat('UV', w.attributes.uv_index)}${stat('Clouds', w.attributes.cloud_coverage != null ? w.attributes.cloud_coverage + '%' : null)}</div></div></div>
        ${days.length ? html`<div class="wide" style="margin-top:14px"><div class="ghead"><div class="gname">7-day forecast</div></div>
          <div class="fc">${days.map((d) => html`<div class="fcd"><div class="fcday">${d.datetime ? new Date(d.datetime).toLocaleDateString(undefined, { weekday: 'short' }) : ''}</div>
            <div class="rchip c-blue" style="width:34px;height:34px;margin:6px auto">${icon(weatherIcon(d.condition || ''))}</div>
            <div class="fchi">${d.temperature != null ? Math.round(d.temperature) + '°' : ''}</div>
            <div class="fclo">${d.templow != null ? Math.round(d.templow) + '°' : ''}</div></div>`)}</div></div>`
          : html`<div class="wide" style="margin-top:14px"><div class="rsub" style="text-align:center;padding:8px">Forecast unavailable for this entity.</div></div>`}` };
  }

  /* -------------------- row atoms -------------------- */
  /**
   * A draggable level slider (brightness / fan speed). Lives inside `.rtext`.
   * Drags fire `commit(pct)` (throttled live, plus a final on release). While a
   * slider is being dragged we ignore the live hass-driven value so the thumb
   * doesn't jump under the finger.
   */
  private _slider(id: string, pct: number, color: string, commit: (pct: number) => void): TemplateResult {
    const shown = this._dragging.has(id) ? (this._dragValue.get(id) ?? pct) : pct;
    const track = (p: number) => `linear-gradient(90deg,${color} ${p}%,rgba(255,255,255,.10) ${p}%)`;
    const stop = (e: Event) => e.stopPropagation();
    const begin = (e: Event) => { this._dragging.add(id); this._dragValue.set(id, shown); e.stopPropagation(); };
    const onInput = (e: Event) => {
      const el = e.target as HTMLInputElement;
      const p = Number(el.value);
      this._dragging.add(id);
      this._dragValue.set(id, p);
      el.style.setProperty('--track', track(p)); // live fill without a full re-render
      const now = Date.now();
      if (now - (this._slideThrottle.get(id) ?? 0) > 180) { this._slideThrottle.set(id, now); commit(p); }
    };
    const onChange = (e: Event) => {
      const p = Number((e.target as HTMLInputElement).value);
      this._slideThrottle.set(id, Date.now());
      commit(p);
      this._dragging.delete(id);
      this._dragValue.delete(id);
    };
    return html`<input class="slider" type="range" min="0" max="100" step="1" aria-label="Level"
      .value=${String(shown)} style="--track:${track(shown)};--thumb:${color}"
      @click=${stop} @pointerdown=${begin} @touchstart=${begin}
      @input=${onInput} @change=${onChange} />`;
  }

  /** Fan row with an optional speed slider. `removeOnOff` animates the row out (Active Now). */
  private _fanRow(e: HassEntity, removeOnOff: boolean): TemplateResult {
    const id = e.entity_id;
    const on = e.state === 'on';
    const speed = fanHasSpeed(e);
    const pct = fanPct(e);
    const removing = this._removing.has(id);
    const sub = on ? (speed ? `Running · ${pct}%` : 'Running') : 'Off';
    const showSlider = speed && on;
    return html`<div class="row ${on ? '' : 'off'} ${removing ? 'removing' : ''}" @click=${() => this._moreInfo(id)}>
      <div class="rchip c-teal">${icon('fan')}</div>
      <div class="rtext"><div class="rname">${fname(this._hass, e)}</div><div class="rsub">${sub}</div>
        ${showSlider ? this._slider(id, pct, ACCENT.teal, (p) => { this._setFan(id, p); if (p <= 0 && removeOnOff) this._removeRow(id); }) : nothing}</div>
      <div class="toggle ${on ? 'on' : ''}" style=${on ? `background:${ACCENT.teal}` : ''}
        @click=${(ev: Event) => { ev.stopPropagation(); if (on && removeOnOff) this._removeRow(id); this._call('fan', on ? 'turn_off' : 'turn_on', { entity_id: id }); }}><span class="knob"></span></div></div>`;
  }

  private _lightRowOff(id: string, name: string, pct: number): TemplateResult {
    const removing = this._removing.has(id);
    const e = this._hass.states[id];
    const livePct = e ? briPct(e) : pct;
    const showBar = this.config.show_brightness !== false;
    const dimmable = e ? lightDimmable(e) : true;
    return html`<div class="row ${removing ? 'removing' : ''}" @click=${() => this._moreInfo(id)}>
      <div class="rchip c-amber">${icon('bulb')}</div>
      <div class="rtext"><div class="rname">${name}</div><div class="rsub">On${dimmable ? ` · ${livePct}%` : ''}</div>
        ${showBar && dimmable ? this._slider(id, livePct, ACCENT.amber, (p) => { this._setLight(id, p); if (p <= 0) this._removeRow(id); }) : nothing}</div>
      <div class="toggle on" style="background:${ACCENT.amber}" @click=${(ev: Event) => { ev.stopPropagation(); this._off(id, 'light'); }}><span class="knob"></span></div></div>`;
  }
  private _roomLight(e: HassEntity): TemplateResult {
    const on = e.state === 'on', pct = on ? briPct(e) : 0;
    const dimmable = lightDimmable(e);
    const showSlider = this.config.show_brightness !== false && on && dimmable;
    return html`<div class="row ${on ? '' : 'off'}" @click=${() => this._moreInfo(e.entity_id)}>
      <div class="rchip c-amber">${icon('bulb')}</div>
      <div class="rtext"><div class="rname">${fname(this._hass, e)}</div><div class="rsub">${on ? `On${dimmable ? ` · ${pct}%` : ''}` : 'Off'}</div>
        ${showSlider ? this._slider(e.entity_id, pct, ACCENT.amber, (p) => this._setLight(e.entity_id, p)) : nothing}</div>
      <div class="toggle ${on ? 'on' : ''}" style=${on ? `background:${ACCENT.amber}` : ''} @click=${(ev: Event) => { ev.stopPropagation(); this._call('light', on ? 'turn_off' : 'turn_on', { entity_id: e.entity_id }); }}><span class="knob"></span></div></div>`;
  }
  private _twoRow(e: HassEntity, ic: string, accent: keyof typeof ACCENT, domain: string, on: boolean, sub: string, service?: string): TemplateResult {
    const act = (ev: Event) => {
      ev.stopPropagation();
      if (service) this._call(domain, service, { entity_id: e.entity_id });
      else this._call(domain, on ? 'turn_off' : 'turn_on', { entity_id: e.entity_id });
    };
    return html`<div class="row ${on ? '' : 'off'}" @click=${() => this._moreInfo(e.entity_id)}>
      <div class="rchip c-${accent}">${icon(ic)}</div>
      <div class="rtext"><div class="rname">${fname(this._hass, e)}</div><div class="rsub">${sub}</div></div>
      <div class="toggle ${on ? 'on' : ''}" style=${on ? `background:${ACCENT[accent]}` : ''} @click=${act}><span class="knob"></span></div></div>`;
  }
  private _coverRow(e: HassEntity): TemplateResult {
    const pos = Number(e.attributes.current_position);
    const open = e.state === 'open' || pos > 0;
    const sub = open ? (!isNaN(pos) ? `Open · ${pos}%` : 'Open') : 'Closed';
    return html`<div class="row ${open ? '' : 'off'}" @click=${() => this._moreInfo(e.entity_id)}>
      <div class="rchip c-blue">${icon('blinds')}</div>
      <div class="rtext"><div class="rname">${fname(this._hass, e)}</div><div class="rsub">${sub}</div></div>
      <div class="toggle ${open ? 'on' : ''}" style=${open ? `background:${ACCENT.blue}` : ''} @click=${(ev: Event) => { ev.stopPropagation(); this._call('cover', open ? 'close_cover' : 'open_cover', { entity_id: e.entity_id }); }}><span class="knob"></span></div></div>`;
  }
  private _toggleRow(id: string, ic: string, accent: keyof typeof ACCENT, name: string, sub: string, action: () => void, on = true): TemplateResult {
    const removing = this._removing.has(id);
    return html`<div class="row ${removing ? 'removing' : ''}" @click=${() => this._moreInfo(id)}>
      <div class="rchip c-${accent}">${icon(ic)}</div>
      <div class="rtext"><div class="rname">${name}</div><div class="rsub">${sub}</div></div>
      <div class="toggle ${on ? 'on' : ''}" style=${on ? `background:${ACCENT[accent]}` : ''} @click=${(e: Event) => { e.stopPropagation(); action(); }}><span class="knob"></span></div></div>`;
  }
  private _empty(title: string, sub: string): TemplateResult {
    return html`<div class="empty"><div class="eico">${icon('check')}</div><h3>${title}</h3><p>${sub}</p></div>`;
  }
  private _flash(ev: Event): void {
    const el = ev.currentTarget as HTMLElement;
    el.style.background = 'rgba(255,255,255,.16)';
    window.setTimeout(() => (el.style.background = ''), 220);
  }

  /* -------------------- actions -------------------- */
  private _off(id: string, domain: string): void {
    this._removeRow(id);
    this._call(domain, domain === 'cover' ? 'close_cover' : 'turn_off', { entity_id: id });
  }
  private _offMany(items: { entity_id: string }[], domain: string): void {
    const ids = items.filter((i) => !this._removing.has(i.entity_id)).map((i) => i.entity_id);
    if (!ids.length) return;
    ids.forEach((id) => this._removeRow(id));
    this._call(domain, domain === 'cover' ? 'close_cover' : 'turn_off', { entity_id: ids });
  }
  private _setLight(id: string, pct: number): void {
    if (pct <= 0) this._call('light', 'turn_off', { entity_id: id });
    else this._call('light', 'turn_on', { entity_id: id, brightness_pct: pct });
  }
  private _setFan(id: string, pct: number): void {
    if (pct <= 0) this._call('fan', 'turn_off', { entity_id: id });
    else this._call('fan', 'set_percentage', { entity_id: id, percentage: pct });
  }
  private _setTemp(e: HassEntity, delta: number): void {
    const cur = Number(e.attributes.temperature ?? e.attributes.current_temperature ?? 70);
    this._call('climate', 'set_temperature', { entity_id: e.entity_id, temperature: cur + delta });
  }

  static override styles = css`
    :host { position: fixed; inset: 0; z-index: 2147483000; font-family: -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif; }
    .root { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
    .scrim { position: absolute; inset: 0; background: rgba(6,8,14,.62); -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px); animation: fade .18s ease; }
    .modal { position: relative; width: min(1080px,95vw); height: min(880px,90vh); display: flex; flex-direction: column; border-radius: 26px;
      background: linear-gradient(150deg,#191e2c,#1b1830 60%,#241a36); border: 1px solid rgba(255,255,255,.09);
      box-shadow: 0 40px 120px -30px rgba(0,0,0,.75); overflow: hidden; animation: pop .22s cubic-bezier(.2,.9,.3,1.05); }
    @keyframes fade { from { opacity: 0; } }
    @keyframes pop { from { opacity: 0; transform: translateY(10px) scale(.985); } }
    .mhead { flex: 0 0 auto; padding: 22px 26px 14px; background: linear-gradient(180deg,#1b2030,#1a1c2e); border-bottom: 1px solid rgba(255,255,255,.06); }
    .mtop { display: flex; align-items: flex-start; gap: 14px; }
    .backbtn { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08); color: #cfd6e6; display: flex; align-items: center; justify-content: center; cursor: pointer; flex: 0 0 auto; }
    .backbtn:hover { background: rgba(255,255,255,.12); } .backbtn svg { width: 22px; height: 22px; fill: currentColor; }
    .mtitle { font-size: 25px; font-weight: 800; letter-spacing: -.5px; color: #F2F5FB; }
    .msub { font-size: 13.5px; color: #8A93A6; margin-top: 3px; }
    .mactions { margin-left: auto; display: flex; align-items: center; gap: 10px; }
    .closeX { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08); color: #cfd6e6; display: flex; align-items: center; justify-content: center; cursor: pointer; flex: 0 0 auto; }
    .closeX:hover { background: rgba(255,255,255,.12); } .closeX svg { width: 20px; height: 20px; fill: currentColor; }
    .ghost { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: 1px solid rgba(255,255,255,.12); color: #cfd6e6; border-radius: 10px; padding: 7px 12px; font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; white-space: nowrap; }
    .ghost svg { width: 15px; height: 15px; fill: currentColor; } .ghost:hover { background: rgba(255,255,255,.06); }
    .ghost.amber { color: var(--accent); border-color: rgba(255,178,62,.4); background: rgba(255,178,62,.08); }
    .filters { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
    .fchip { display: inline-flex; align-items: center; gap: 7px; padding: 7px 13px; border-radius: 999px; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; background: transparent; border: 1px solid rgba(255,255,255,.08); color: #8A93A6; }
    .fchip.active { background: rgba(255,255,255,.10); border-color: rgba(255,255,255,.18); color: #EEF1F7; }
    .fdot { width: 8px; height: 8px; border-radius: 50%; } .fcount { opacity: .85; }
    .mbody { flex: 1 1 auto; overflow-y: auto; padding: 20px 26px 30px; }
    .mbody::-webkit-scrollbar { width: 9px; } .mbody::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 999px; }
    .cols { column-count: 3; column-gap: 16px; }
    @media (max-width: 1080px) { .cols { column-count: 2; } }
    @media (max-width: 720px) { .cols { column-count: 1; } }
    .gcard { break-inside: avoid; margin-bottom: 16px; background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.07); border-radius: 18px; padding: 14px; }
    .wide { background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.07); border-radius: 18px; padding: 16px; }
    .ghead { display: flex; align-items: center; gap: 9px; margin-bottom: 2px; }
    .gname { font-size: 15.5px; font-weight: 700; color: #EEF1F7; display: flex; align-items: center; gap: 8px; }
    .pill { font-size: 11.5px; font-weight: 600; color: #aab3c5; background: rgba(255,255,255,.06); padding: 2px 8px; border-radius: 999px; }
    .ghead .link { margin-left: auto; background: none; border: none; color: #8A93A6; font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; }
    .ghead .link:hover { color: #EEF1F7; }
    .row { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,.04); border-radius: 13px; padding: 10px 12px; margin-top: 8px; cursor: pointer; min-height: 44px; transition: opacity .26s ease, transform .26s ease, background .15s ease; }
    .row:hover { background: rgba(255,255,255,.075); } .row.removing { opacity: 0; transform: scale(.95); pointer-events: none; }
    .row.off .rchip { opacity: .45; }
    .row::after { content: ''; flex: 0 0 auto; width: 15px; height: 15px; margin-left: -2px; background-color: #8A93A6; opacity: .26; transition: opacity .15s;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M8.6 16.6 13.2 12 8.6 7.4 10 6l6 6-6 6z'/%3E%3C/svg%3E") center/contain no-repeat;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M8.6 16.6 13.2 12 8.6 7.4 10 6l6 6-6 6z'/%3E%3C/svg%3E") center/contain no-repeat; }
    .row:hover::after { opacity: .5; }
    .rchip { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex: 0 0 auto; }
    .rchip svg { width: 19px; height: 19px; fill: currentColor; }
    .rtext { flex: 1; min-width: 0; } .rname { font-size: 14.5px; font-weight: 600; color: #EEF1F7; overflow-wrap: anywhere; }
    .rsub { font-size: 12px; color: #8A93A6; margin-top: 1px; }
    .bval { font-size: 15px; font-weight: 700; flex: 0 0 auto; }
    .bar { height: 6px; border-radius: 999px; background: rgba(255,255,255,.09); margin-top: 7px; overflow: hidden; } .bar .fill { height: 100%; border-radius: 999px; }
    .slider { -webkit-appearance: none; appearance: none; display: block; width: 100%; height: 22px; margin: 8px 0 1px; background: transparent; cursor: pointer; touch-action: none; }
    .slider:focus { outline: none; }
    .slider::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: var(--track); }
    .slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; margin-top: -5px; border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.45); border: 1.5px solid var(--thumb, #fff); }
    .slider::-moz-range-track { height: 6px; border-radius: 999px; background: rgba(255,255,255,.10); }
    .slider::-moz-range-progress { height: 6px; border-radius: 999px; background: var(--thumb, #fff); }
    .slider::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.45); border: 1.5px solid var(--thumb, #fff); }
    .slider:active::-webkit-slider-thumb { transform: scale(1.15); } .slider:active::-moz-range-thumb { transform: scale(1.15); }
    .toggle { width: 48px; height: 28px; border-radius: 999px; position: relative; flex: 0 0 auto; background: rgba(255,255,255,.14); }
    .toggle .knob { position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.3); transition: left .18s; }
    .toggle.on .knob { left: 23px; }
    .c-amber { background: rgba(255,178,62,.14); color: #FFB23E; } .c-blue { background: rgba(91,168,242,.14); color: #5BA8F2; }
    .c-teal { background: rgba(53,214,198,.14); color: #35D6C6; } .c-red { background: rgba(244,89,91,.16); color: #F4595B; }
    .c-green { background: rgba(124,217,146,.14); color: #7CD992; } .c-violet { background: rgba(183,148,246,.14); color: #b794f6; }
    .c-neutral { background: rgba(154,163,180,.14); color: #9aa3b4; }
    .stepper { display: flex; align-items: center; gap: 10px; flex: 0 0 auto; }
    .stepper button { width: 30px; height: 30px; border-radius: 9px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.04); color: #EEF1F7; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .stepper button svg { width: 16px; height: 16px; fill: currentColor; } .stepper button:hover { background: rgba(255,255,255,.1); }
    .stepper .temp { font-size: 18px; font-weight: 700; min-width: 48px; text-align: center; color: #F2F5FB; }
    .scenes { display: grid; grid-template-columns: repeat(auto-fill,minmax(150px,1fr)); gap: 10px; }
    .scene { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 14px; padding: 14px; cursor: pointer; display: flex; flex-direction: column; gap: 10px; transition: background .15s, transform .12s; }
    .scene:hover { background: rgba(255,255,255,.08); } .scene:active { transform: scale(.97); } .scene .snm { font-size: 14px; font-weight: 600; color: #EEF1F7; }
    .chiprow { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .modechip { padding: 7px 14px; border-radius: 999px; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; background: transparent; border: 1px solid rgba(255,255,255,.1); color: #8A93A6; }
    .modechip.on { background: rgba(255,178,62,.16); border-color: rgba(255,178,62,.5); color: #FFB23E; }
    .wgrid { display: grid; grid-template-columns: repeat(auto-fill,minmax(225px,1fr)); gap: 10px; margin-top: 8px; } .wgrid .row { margin-top: 0; }
    .banner { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: 16px; margin-bottom: 18px; background: linear-gradient(120deg,rgba(244,89,91,.17),rgba(244,89,91,.06)); border: 1px solid rgba(244,89,91,.34); animation: pulse 2.8s ease-in-out infinite; }
    .btext { flex: 1; min-width: 0; } .btitle { font-size: 15px; font-weight: 700; color: #FFDADB; } .bsub { font-size: 12.5px; color: #E79C9D; margin-top: 2px; }
    .bbtn { margin-left: auto; background: #F4595B; color: #fff; border: none; border-radius: 11px; padding: 10px 16px; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
    @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(244,89,91,0); } 50% { box-shadow: 0 0 0 6px rgba(244,89,91,.1); } }
    .wnow { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .wbig { font-size: 40px; font-weight: 800; color: #F2F5FB; letter-spacing: -1px; }
    .wgridstats { display: grid; grid-template-columns: repeat(auto-fill,minmax(90px,1fr)); gap: 10px; flex: 1; min-width: 200px; }
    .wstat { background: rgba(255,255,255,.04); border-radius: 11px; padding: 8px 10px; } .wstat span { display: block; font-size: 11.5px; color: #8A93A6; } .wstat b { font-size: 15px; color: #EEF1F7; }
    .fc { display: grid; grid-template-columns: repeat(7,1fr); gap: 8px; margin-top: 8px; } @media(max-width:620px){ .fc{ grid-template-columns: repeat(4,1fr); } }
    .fcd { background: rgba(255,255,255,.04); border-radius: 12px; padding: 10px 4px; text-align: center; } .fcday { font-size: 12px; color: #8A93A6; font-weight: 600; }
    .fchi { font-size: 14px; font-weight: 700; color: #EEF1F7; } .fclo { font-size: 12.5px; color: #8A93A6; }
    .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 70px 20px; }
    .eico { width: 64px; height: 64px; border-radius: 50%; background: rgba(53,214,198,.14); color: #35D6C6; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    .eico svg { width: 32px; height: 32px; fill: currentColor; }
    .empty h3 { font-size: 19px; font-weight: 700; color: #EEF1F7; margin: 0; } .empty p { font-size: 13.5px; color: #8A93A6; margin: 6px 0 0; }
  `;
}

/* ===========================================================================
 * Card element — the home scene.
 * ======================================================================== */
class HomeDashboardCard extends LitElement {
  static getStubConfig(): Partial<HomeDashConfig> {
    return { type: 'custom:home-dashboard-card', name: '', categories: DEFAULT_CATS };
  }
  private _hass!: HomeAssistant;
  private _config!: HomeDashConfig;
  private _modal?: HomeDashboardModal;
  private _restore?: { category: string; filter: string };
  private _dialogClosed?: (e: Event) => void;

  setConfig(config: HomeDashConfig): void {
    if (!config) throw new Error('Invalid configuration');
    this._config = { categories: DEFAULT_CATS, show_brightness: true, ...config };
    if (this._modal) this._modal.config = this._config;
    this.requestUpdate();
  }
  set hass(h: HomeAssistant) { this._hass = h; if (this._modal) this._modal.hass = h; this.requestUpdate(); }
  get hass(): HomeAssistant { return this._hass; }
  getCardSize(): number { return 12; }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._closeModal();
    if (this._dialogClosed) { window.removeEventListener('dialog-closed', this._dialogClosed); this._dialogClosed = undefined; }
  }

  private _open(cat: string): void {
    if (this._modal) return;
    const el = document.createElement('home-dashboard-modal') as HomeDashboardModal;
    el.config = this._config; el.category = cat; el.hass = this._hass;
    el.addEventListener('close', this._closeModal);
    el.addEventListener('hd-more-info', this._onMoreInfo as EventListener);
    document.body.appendChild(el);
    this._modal = el;
  }
  private _closeModal = (): void => {
    if (this._modal) {
      this._modal.removeEventListener('close', this._closeModal);
      this._modal.removeEventListener('hd-more-info', this._onMoreInfo as EventListener);
      this._modal.remove();
      this._modal = undefined;
    }
  };
  private _onMoreInfo = (e: Event): void => {
    const id = (e as CustomEvent).detail?.entityId as string | undefined;
    if (!id) return;
    // Remember where we are so we can return here after the device dialog closes.
    if (this._modal) this._restore = { category: String(this._modal.category), filter: this._modal.filter };
    this._closeModal();
    if (this._restore) {
      const handler = (ev: Event): void => {
        const tag = (ev as CustomEvent).detail?.dialog;
        if (tag && tag !== 'ha-more-info-dialog') return; // ignore nested dialogs
        window.removeEventListener('dialog-closed', handler);
        this._dialogClosed = undefined;
        this._reopen();
      };
      this._dialogClosed = handler;
      window.addEventListener('dialog-closed', handler);
    }
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true }));
  };
  private _reopen(): void {
    if (this._modal || !this._restore) return;
    const el = document.createElement('home-dashboard-modal') as HomeDashboardModal;
    el.config = this._config;
    el.category = this._restore.category;
    el.filter = this._restore.filter;
    el.hass = this._hass;
    el.addEventListener('close', this._closeModal);
    el.addEventListener('hd-more-info', this._onMoreInfo as EventListener);
    document.body.appendChild(el);
    this._modal = el;
    this._restore = undefined;
  }

  private _summary(cat: CatKey): { count: string; line: string; sub: string } {
    const h = this._hass;
    if (cat === 'active') {
      const m = resolveModel(h, { type: '', group_by: 'area' }); const c = m.counts;
      return { count: `${c.total} on`, line: [c.lights ? `${c.lights} lights` : '', c.blinds ? `${c.blinds} blinds open` : '', c.fans ? `${c.fans} fans` : ''].filter(Boolean).join(' · ') || 'All off', sub: `${m.rooms.length} rooms` };
    }
    if (cat === 'climate') {
      const z = byDomain(h, 'climate').filter((e) => e.state !== 'off' && e.state !== 'unavailable');
      const temps = z.map((e) => Number(e.attributes.current_temperature)).filter((n) => !isNaN(n));
      const avg = temps.length ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length) : null;
      return { count: avg != null ? `${avg}${tempUnit(h)}` : '—', line: z.slice(0, 2).map((e) => `${fname(h, e)} ${e.attributes.current_temperature != null ? Math.round(Number(e.attributes.current_temperature)) + tempUnit(h) : ''}`).join(' · ') || 'All off', sub: `${z.length} active` };
    }
    if (cat === 'media') {
      const players = byDomain(h, 'media_player').filter((e) => e.state !== 'unavailable');
      const playing = players.filter((e) => e.state === 'playing');
      return { count: `${playing.length}`, line: playing.slice(0, 2).map((e) => fname(h, e)).join(' · ') || 'Nothing playing', sub: `${players.length} players` };
    }
    if (cat === 'scenes') {
      const scripts = byDomain(h, 'script').filter((e) => !/helper|duplicate|resync|test|tilt/i.test(e.entity_id + (e.attributes.friendly_name || '')));
      return { count: `${scripts.length}`, line: scripts.slice(0, 3).map((e) => fname(h, e)).join(' · ') || 'Quick actions', sub: 'tap to run' };
    }
    if (cat === 'batteries') {
      const all = batteryEntities(h); const low = all.filter((e) => parseFloat(e.state) < 20);
      const lowest = all[0];
      return { count: low.length ? `${low.length} low` : 'OK', line: lowest ? `${fname(h, lowest)} ${Math.round(parseFloat(lowest.state))}%` : 'No batteries', sub: `${all.length} tracked` };
    }
    if (cat === 'refrigeration') {
      const units = fridgeEntities(h); const u = tempUnit(h);
      const warm = units.filter((e) => { const t = parseFloat(e.state); const lim = /freez/i.test((e.attributes.friendly_name || '')) ? 10 : 42; return !isNaN(t) && t > lim; });
      return { count: warm.length ? `${warm.length} warm` : 'Normal', line: units.slice(0, 2).map((e) => `${fname(h, e).replace(/ ?temperature/i, '').replace(/garage |kitchen /i, '')} ${Math.round(parseFloat(e.state))}${u}`).join(' · ') || 'No sensors', sub: `${units.length} units` };
    }
    const areas = Object.values(h.areas || {});
    return { count: `${areas.length}`, line: 'Tap a room for full control', sub: `${areas.length} rooms` };
  }

  override render() {
    if (!this._hass || !this._config) return nothing;
    const cats = (this._config.categories || DEFAULT_CATS) as CatKey[];
    const now = new Date(), hr = now.getHours();
    const partOfDay = hr < 5 ? 'night' : hr < 12 ? 'morning' : hr < 18 ? 'afternoon' : 'evening';
    const nm = this._config.name ? `, ${this._config.name}` : '';
    const time = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')}`;
    let onCount = 0;
    try { onCount = resolveModel(this._hass, { type: '', group_by: 'area' }).counts.total; } catch { /* */ }
    const w = weatherEntity(this._hass, this._config);
    const wu = w ? (w.attributes.temperature_unit || tempUnit(this._hass)) : '';
    return html`
      <div class="scene">
        <div class="aurora a1"></div><div class="aurora a2"></div><div class="aurora a3"></div>
        <div class="wrap">
          <div class="greet">
            <div>
              <h1>Good ${partOfDay}${nm}</h1>
              <div class="gsub">${onCount} thing${onCount !== 1 ? 's' : ''} on</div>
            </div>
            <div class="now">
              <b>${time}</b>
              ${w ? html`<div class="wchip" @click=${() => this._open('weather')}>
                ${icon(weatherIcon(w.state))}<span>${Math.round(Number(w.attributes.temperature))}${wu}</span>
                <em>${condText(w.state)}</em></div>` : nothing}
            </div>
          </div>
          <div class="grid">
            ${cats.map((key) => {
              const meta = CATS[key]; if (!meta) return nothing;
              const s = this._summary(key);
              return html`<div class="tile" @click=${() => this._open(key)}>
                <div class="ttop"><div class="tchip c-${meta.accent}">${icon(meta.icon)}</div><div class="tlabel">${meta.title}</div><div class="tcount">${s.count}</div></div>
                <div class="tsum">${s.line}</div>
                <div class="tmeta"><div class="dots">${meta.dots.map((d) => html`<span class="dot" style="background:${ACCENT[d]}"></span>`)}</div><span>${s.sub}</span></div>
              </div>`;
            })}
          </div>
        </div>
      </div>`;
  }

  static override styles = css`
    :host { display: block; font-family: -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif; }
    .scene { position: relative; min-height: calc(100vh - 90px); margin: -8px -4px; padding: 26px 18px 50px; border-radius: 22px; overflow: hidden; background: linear-gradient(135deg,#10141e 0%,#15121f 52%,#221634 100%); }
    .aurora { position: absolute; border-radius: 50%; filter: blur(60px); opacity: .5; pointer-events: none; }
    .a1 { width: 520px; height: 520px; left: -160px; top: -180px; background: radial-gradient(circle,#3a2a6e,transparent 70%); }
    .a2 { width: 460px; height: 460px; right: -150px; top: 80px; background: radial-gradient(circle,#1c3a63,transparent 70%); }
    .a3 { width: 420px; height: 420px; left: 30%; bottom: -220px; background: radial-gradient(circle,#5a2350,transparent 70%); opacity: .35; }
    .wrap { position: relative; z-index: 1; max-width: 1080px; margin: 0 auto; }
    .greet { display: flex; align-items: flex-start; justify-content: space-between; margin: 4px 4px 22px; gap: 16px; }
    .greet h1 { font-size: 30px; font-weight: 800; letter-spacing: -.5px; color: #F2F5FB; margin: 0; }
    .gsub { font-size: 14px; color: #8A93A6; margin-top: 4px; }
    .now { text-align: right; } .now b { font-size: 24px; font-weight: 700; color: #F2F5FB; letter-spacing: -.3px; }
    .wchip { display: inline-flex; align-items: center; gap: 6px; margin-top: 6px; padding: 5px 11px; border-radius: 999px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); cursor: pointer; color: #c4d0ec; }
    .wchip:hover { background: rgba(255,255,255,.09); } .wchip svg { width: 18px; height: 18px; fill: #5BA8F2; } .wchip span { font-size: 14px; font-weight: 700; color: #EEF1F7; } .wchip em { font-style: normal; font-size: 12.5px; color: #8A93A6; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(248px,1fr)); gap: 16px; }
    .tile { background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.07); border-radius: 18px; padding: 16px; cursor: pointer; display: flex; flex-direction: column; gap: 12px; min-height: 120px; transition: transform .12s ease, border-color .15s ease, background .15s ease; }
    .tile:hover { background: rgba(255,255,255,.075); border-color: rgba(150,180,240,.32); transform: translateY(-2px); } .tile:active { transform: scale(.99); }
    .ttop { display: flex; align-items: center; gap: 12px; }
    .tchip { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex: 0 0 auto; } .tchip svg { width: 22px; height: 22px; fill: currentColor; }
    .tlabel { font-size: 16px; font-weight: 700; color: #EEF1F7; }
    .tcount { margin-left: auto; font-size: 12px; font-weight: 600; color: #8A93A6; background: rgba(255,255,255,.06); padding: 3px 9px; border-radius: 999px; }
    .tsum { font-size: 13px; color: #c4d0ec; line-height: 1.45; }
    .tmeta { margin-top: auto; display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #8A93A6; }
    .dots { display: flex; gap: 6px; } .dot { width: 8px; height: 8px; border-radius: 50%; }
    .c-amber { background: rgba(255,178,62,.14); color: #FFB23E; } .c-blue { background: rgba(91,168,242,.14); color: #5BA8F2; }
    .c-teal { background: rgba(53,214,198,.14); color: #35D6C6; } .c-red { background: rgba(244,89,91,.16); color: #F4595B; }
    .c-green { background: rgba(124,217,146,.14); color: #7CD992; } .c-violet { background: rgba(183,148,246,.14); color: #b794f6; }
    .c-neutral { background: rgba(154,163,180,.14); color: #9aa3b4; }
  `;
}

if (!customElements.get('home-dashboard-modal')) customElements.define('home-dashboard-modal', HomeDashboardModal);
if (!customElements.get('home-dashboard-card')) customElements.define('home-dashboard-card', HomeDashboardCard);

const w = window as unknown as { customCards?: unknown[] };
w.customCards = w.customCards || [];
if (!(w.customCards as { type?: string }[]).some((c) => c.type === 'home-dashboard-card')) {
  w.customCards.push({ type: 'home-dashboard-card', name: 'Home Dashboard Card', description: 'Modal-driven glassy home dashboard.', preview: false });
}

export { HomeDashboardCard, HomeDashboardModal };
