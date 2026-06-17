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
  lock: 'M12,17A2,2 0 0,0 14,15A2,2 0 0,0 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10A2,2 0 0,1 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z',
  lockOpen: 'M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10A2,2 0 0,1 6,8H15V6A3,3 0 0,0 9,6H7A5,5 0 0,1 17,6V8H18M12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17A2,2 0 0,0 14,15A2,2 0 0,0 12,13Z',
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
};
function icon(name: string): SVGTemplateResult {
  return svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${PATHS[name] || ''}"></path></svg>`;
}

/* ============================ palette ============================ */
const ACCENT: Record<string, string> = {
  amber: '#FFB23E', blue: '#5BA8F2', teal: '#35D6C6', red: '#F4595B',
  green: '#7CD992', violet: '#b794f6', neutral: '#9aa3b4',
};

type CatKey = 'active' | 'climate' | 'security' | 'media' | 'scenes' | 'rooms';
interface CatMeta { title: string; icon: string; accent: keyof typeof ACCENT; dots: (keyof typeof ACCENT)[]; }
const CATS: Record<CatKey, CatMeta> = {
  active: { title: 'Active Now', icon: 'home', accent: 'amber', dots: ['amber', 'blue'] },
  climate: { title: 'Climate', icon: 'thermometer', accent: 'red', dots: ['red'] },
  security: { title: 'Security', icon: 'lock', accent: 'green', dots: ['green'] },
  media: { title: 'Media', icon: 'music', accent: 'violet', dots: ['violet'] },
  scenes: { title: 'Scenes & Routines', icon: 'wand', accent: 'teal', dots: ['teal'] },
  rooms: { title: 'Rooms', icon: 'grid', accent: 'blue', dots: ['blue', 'amber', 'teal'] },
};

type Filter = [string, string, keyof typeof ACCENT, number];

interface HomeDashConfig {
  type: string;
  name?: string;
  categories?: CatKey[];
  accent_color?: string;
  show_brightness?: boolean;
}

/* ============================ helpers ============================ */
const byDomain = (hass: HomeAssistant, d: string): HassEntity[] =>
  Object.values(hass.states).filter((e) => e.entity_id.startsWith(d + '.'));
const fname = (hass: HomeAssistant, e: HassEntity): string =>
  e.attributes.friendly_name || friendlyName(hass, e.entity_id);
const briPct = (e: HassEntity): number =>
  typeof e.attributes.brightness === 'number' ? Math.round((e.attributes.brightness / 255) * 100) : 100;
function tempUnit(hass: HomeAssistant): string {
  const u = (hass as unknown as { config?: { unit_system?: { temperature?: string } } }).config;
  return u?.unit_system?.temperature || '°';
}

/* ===========================================================================
 * Modal element — portalled to <body>, renders the glass panel for a category.
 * ======================================================================== */
class HomeDashboardModal extends LitElement {
  private _hass!: HomeAssistant;
  config!: HomeDashConfig;
  category: CatKey | string = 'active';
  roomArea = '';
  private _filter = 'all';
  private _removing = new Set<string>();
  private _prevOverflow = '';

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

  /* -------------------- render shell -------------------- */
  override render() {
    if (!this._hass || !this.config) return nothing;
    const accent = this.config.accent_color || ACCENT.amber;
    const cat = String(this.category).startsWith('room:') ? 'rooms' : (this.category as CatKey);
    const meta = CATS[cat as CatKey];
    const built = this._build();
    const rootStyle = `--accent:${accent}`;
    return html`
      <div class="root" style=${rootStyle}>
        <div class="scrim" @click=${this._close}></div>
        <div class="modal" role="dialog" aria-modal="true" @click=${(e: Event) => e.stopPropagation()}>
          <div class="mhead">
            <div class="mtop">
              <div>
                <div class="mtitle">${built.title ?? meta.title}</div>
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
        <button class="fchip ${this._filter === k ? 'active' : ''}"
          @click=${() => { this._filter = k; this.requestUpdate(); }}>
          <span class="fdot" style="background:${ACCENT[color]}"></span>${label}
          <span class="fcount">${n}</span>
        </button>`)}
    </div>`;
  }

  /* -------------------- per-category builders -------------------- */
  private _build(): {
    title?: string; sub: string; action?: TemplateResult;
    filters?: Filter[]; body: TemplateResult | typeof nothing;
  } {
    const c = String(this.category);
    if (c.startsWith('room:')) return this._buildRoom(c.slice(5));
    switch (this.category as CatKey) {
      case 'active': return this._buildActive();
      case 'climate': return this._buildClimate();
      case 'security': return this._buildSecurity();
      case 'media': return this._buildMedia();
      case 'scenes': return this._buildScenes();
      case 'rooms': return this._buildRooms();
      default: return { sub: '', body: nothing };
    }
  }

  // ---- Active Now (reuses the active-now resolver) ----
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
      return html`<div class="gcard">
        <div class="ghead"><div class="gname">${r.name}</div><div class="pill">${n} on</div>
          <button class="link" @click=${() => this._offMany([...r.lights, ...r.fans], 'light')}>Turn off</button></div>
        ${ls.map((l) => this._lightRow(l.entity_id, l.name, l.brightnessPct ?? 100))}
        ${fs.map((fn) => this._toggleRow(fn.entity_id, 'fan', 'teal', fn.name, 'Running', () => this._off(fn.entity_id, 'fan')))}
      </div>`;
    }).filter(Boolean);

    const blindsZone = (f === 'all' || f === 'blinds') && m.blinds.length ? html`
      <div class="wide"><div class="ghead">
        <div class="rchip c-blue">${icon('blinds')}</div>
        <div class="gname">Blinds &amp; Curtains <span class="pill">${blinds} open</span></div>
        <button class="link" style="color:${ACCENT.blue}" @click=${() => this._offMany(m.blinds, 'cover')}>Close all</button>
      </div><div class="wgrid">
        ${m.blinds.map((b) => this._toggleRow(b.entity_id, 'blinds', 'blue', b.name, 'Open', () => this._off(b.entity_id, 'cover')))}
      </div></div>` : nothing;

    const banner = (f === 'all' || f === 'doors') && doors ? html`
      <div class="banner"><div class="rchip c-red">${icon('garage')}</div>
        <div class="btext"><div class="btitle">${live(m.doors).length === 1 ? 'A door is open' : `${doors} doors are open`}</div>
          <div class="bsub">${live(m.doors).map((d) => d.name).join(', ')}</div></div>
        <button class="bbtn" @click=${() => this._offMany(live(m.doors), 'cover')}>Close</button></div>` : nothing;

    const showRooms = f === 'all' || f === 'lights' || f === 'fans';
    let body: TemplateResult | typeof nothing;
    if (total === 0) body = this._empty('All clear', 'Nothing is on. Your home is buttoned up.');
    else body = html`${banner}${showRooms && roomCards.length ? html`<div class="cols">${roomCards}</div>` : nothing}${blindsZone}`;

    return {
      sub: `${total} thing${total !== 1 ? 's' : ''} on`,
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
    const rows = zones.map((e) => {
      const cur = e.attributes.current_temperature;
      const target = e.attributes.temperature;
      return html`<div class="row" style="cursor:default">
        <div class="rchip c-red">${icon('thermometer')}</div>
        <div class="rtext"><div class="rname">${fname(this._hass, e)}</div>
          <div class="rsub">${cur != null ? `Now ${Math.round(Number(cur))}${u} · ` : ''}${e.state}${target != null ? ` to ${Math.round(Number(target))}${u}` : ''}</div></div>
        <div class="stepper">
          <button @click=${() => this._setTemp(e, -1)}>${icon('minus')}</button>
          <span class="temp">${target != null ? Math.round(Number(target)) + u : '—'}</span>
          <button @click=${() => this._setTemp(e, 1)}>${icon('plus')}</button>
        </div></div>`;
    });
    return {
      sub: `${zones.length} zone${zones.length !== 1 ? 's' : ''}`,
      body: zones.length ? html`<div class="wide">${rows}</div>` : this._empty('No active zones', 'Every thermostat is off.'),
    };
  }

  // ---- Security ----
  private _buildSecurity() {
    const locks = byDomain(this._hass, 'lock');
    const lockedN = locks.filter((e) => e.state === 'locked').length;
    const openCovers = byDomain(this._hass, 'cover').filter((e) => {
      const dc = String(e.attributes.device_class);
      return ['garage', 'door'].includes(dc) && (e.state === 'open' || Number(e.attributes.current_position) > 0);
    });
    const openSensors = byDomain(this._hass, 'binary_sensor').filter((e) => {
      const dc = String(e.attributes.device_class);
      return ['door', 'window', 'garage_door', 'opening'].includes(dc) && e.state === 'on';
    });
    const openN = openCovers.length + openSensors.length;
    const lockRows = locks.map((e) => {
      const locked = e.state === 'locked';
      return this._toggleRow(e.entity_id, locked ? 'lock' : 'lockOpen', locked ? 'green' : 'red',
        fname(this._hass, e), locked ? 'Locked' : 'Unlocked',
        () => this._call('lock', locked ? 'unlock' : 'lock', { entity_id: e.entity_id }), locked);
    });
    const coverRows = openCovers.map((e) =>
      this._toggleRow(e.entity_id, 'garage', 'red', fname(this._hass, e), 'Open',
        () => this._call('cover', 'close_cover', { entity_id: e.entity_id }), true));
    const sensorRows = openSensors.map((e) => html`<div class="row" style="cursor:default">
      <div class="rchip c-red">${icon('door')}</div>
      <div class="rtext"><div class="rname">${fname(this._hass, e)}</div><div class="rsub">Open</div></div></div>`);
    return {
      sub: `${lockedN}/${locks.length} locked · ${openN} open`,
      filters: [['all', 'All', 'neutral', locks.length + openN], ['locks', 'Locks', 'green', locks.length], ['open', 'Open', 'red', openN]] as Filter[],
      body: html`
        ${this._filter !== 'open' && locks.length ? html`<div class="wide">
          <div class="ghead"><div class="gname">Locks</div><div class="pill">${lockedN} secured</div>
          <button class="link" style="color:${ACCENT.green}" @click=${() => this._call('lock', 'lock', { entity_id: locks.map((l) => l.entity_id) })}>Lock all</button></div>
          ${lockRows}</div>` : nothing}
        ${this._filter !== 'locks' && openN ? html`<div class="wide" style="margin-top:14px">
          <div class="ghead"><div class="gname">Open right now</div><div class="pill">${openN}</div></div>
          ${coverRows}${sensorRows}</div>` : nothing}
        ${locks.length + openN === 0 ? this._empty('Secure', 'Everything is locked and closed.') : nothing}`,
    };
  }

  // ---- Media ----
  private _buildMedia() {
    const players = byDomain(this._hass, 'media_player').filter((e) => e.state !== 'unavailable');
    const active = players.filter((e) => e.state === 'playing' || e.state === 'paused');
    const idle = players.filter((e) => e.state !== 'playing' && e.state !== 'paused');
    const playingN = players.filter((e) => e.state === 'playing').length;
    const mediaLine = (e: HassEntity) => {
      const t = e.attributes.media_title as string | undefined;
      const a = e.attributes.media_artist as string | undefined;
      if (t) return a ? `${t} · ${a}` : t;
      return e.state.charAt(0).toUpperCase() + e.state.slice(1);
    };
    return {
      sub: `${playingN} playing`,
      body: html`
        ${active.length ? html`<div class="wide"><div class="ghead"><div class="gname">Now playing</div><div class="pill">${active.length}</div></div>
          ${active.map((e) => this._toggleRow(e.entity_id, e.state === 'playing' ? 'pause' : 'play', 'violet', fname(this._hass, e), mediaLine(e), () => this._call('media_player', 'media_play_pause', { entity_id: e.entity_id }), e.state === 'playing'))}</div>` : nothing}
        ${idle.length ? html`<div class="wide" style="margin-top:14px"><div class="ghead"><div class="gname">Idle</div><div class="pill">${idle.length}</div></div>
          ${idle.map((e) => html`<div class="row" style="cursor:default"><div class="rchip c-neutral">${icon('play')}</div>
            <div class="rtext"><div class="rname">${fname(this._hass, e)}</div><div class="rsub">${e.state}</div></div>
            <div class="toggle"><span class="knob"></span></div></div>`)}</div>` : nothing}
        ${players.length === 0 ? this._empty('No players', 'No media players found.') : nothing}`,
    };
  }

  // ---- Scenes & routines ----
  private _buildScenes() {
    const scenes = byDomain(this._hass, 'scene');
    const tiles = scenes.map((e) => html`<div class="scene" @click=${(ev: Event) => { this._flash(ev); this._call('scene', 'turn_on', { entity_id: e.entity_id }); }}>
      <div class="rchip c-teal">${icon('wand')}</div><div class="snm">${fname(this._hass, e)}</div></div>`);
    return {
      sub: `${scenes.length} scene${scenes.length !== 1 ? 's' : ''}`,
      body: scenes.length ? html`<div class="scenes">${tiles}</div>` : this._empty('No scenes', 'Create scenes in Home Assistant to control them here.'),
    };
  }

  // ---- Rooms grid ----
  private _buildRooms() {
    const areas = Object.values(this._hass.areas || {});
    const tiles = areas.map((a) => html`<div class="scene" style="min-height:92px" @click=${() => { this.category = `room:${a.area_id}`; this._filter = 'all'; this.requestUpdate(); }}>
      <div class="rchip c-blue">${icon('grid')}</div><div class="snm">${a.name}</div>
      <div class="rsub" style="font-size:12px">Lights · climate · media</div></div>`);
    return {
      sub: `${areas.length} room${areas.length !== 1 ? 's' : ''}`,
      body: areas.length ? html`<div class="scenes" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr))">${tiles}</div>`
        : this._empty('No areas', 'Assign devices to areas to see rooms here.'),
    };
  }

  // ---- Single room ----
  private _buildRoom(areaId: string) {
    const area = (this._hass.areas || {})[areaId];
    const inArea = (id: string) => {
      const reg = this._hass.entities?.[id];
      let a = reg?.area_id ?? null;
      if (!a && reg?.device_id) a = this._hass.devices?.[reg.device_id]?.area_id ?? null;
      return a === areaId;
    };
    const lights = byDomain(this._hass, 'light').filter((e) => inArea(e.entity_id) && e.state === 'on');
    const climate = byDomain(this._hass, 'climate').filter((e) => inArea(e.entity_id) && e.state !== 'off' && e.state !== 'unavailable');
    const media = byDomain(this._hass, 'media_player').filter((e) => inArea(e.entity_id) && (e.state === 'playing' || e.state === 'paused'));
    const u = tempUnit(this._hass);
    const empty = !lights.length && !climate.length && !media.length;
    return {
      title: area?.name || 'Room',
      sub: 'Back to all rooms',
      action: html`<button class="ghost" @click=${() => { this.category = 'rooms'; this.requestUpdate(); }}>${icon('grid')} All rooms</button>`,
      body: empty ? this._empty('Nothing on here', 'No active lights, climate, or media in this room.') : html`
        ${lights.length ? html`<div class="wide"><div class="ghead"><div class="gname">Lights</div><div class="pill">${lights.length} on</div>
          <button class="link" @click=${() => this._call('light', 'turn_off', { entity_id: lights.map((l) => l.entity_id) })}>Turn off</button></div>
          ${lights.map((e) => this._lightRow(e.entity_id, fname(this._hass, e), briPct(e)))}</div>` : nothing}
        ${climate.length ? html`<div class="wide" style="margin-top:14px"><div class="ghead"><div class="gname">Climate</div></div>
          ${climate.map((e) => html`<div class="row" style="cursor:default"><div class="rchip c-red">${icon('thermometer')}</div>
            <div class="rtext"><div class="rname">${fname(this._hass, e)}</div><div class="rsub">${e.attributes.current_temperature != null ? `Now ${Math.round(Number(e.attributes.current_temperature))}${u}` : e.state}</div></div>
            <div class="stepper"><button @click=${() => this._setTemp(e, -1)}>${icon('minus')}</button><span class="temp">${e.attributes.temperature != null ? Math.round(Number(e.attributes.temperature)) + u : '—'}</span><button @click=${() => this._setTemp(e, 1)}>${icon('plus')}</button></div></div>`)}</div>` : nothing}
        ${media.length ? html`<div class="wide" style="margin-top:14px"><div class="ghead"><div class="gname">Media</div></div>
          ${media.map((e) => this._toggleRow(e.entity_id, e.state === 'playing' ? 'pause' : 'play', 'violet', fname(this._hass, e), String(e.attributes.media_title || e.state), () => this._call('media_player', 'media_play_pause', { entity_id: e.entity_id }), e.state === 'playing'))}</div>` : nothing}`,
    };
  }

  /* -------------------- row atoms -------------------- */
  private _lightRow(id: string, name: string, pct: number): TemplateResult {
    const removing = this._removing.has(id);
    const showBar = this.config.show_brightness !== false;
    return html`<div class="row ${removing ? 'removing' : ''}" @click=${() => this._off(id, 'light')}>
      <div class="rchip c-amber">${icon('bulb')}</div>
      <div class="rtext"><div class="rname">${name}</div><div class="rsub">On · ${pct}%</div>
        ${showBar ? html`<div class="bar"><div class="fill" style="width:${pct}%;background:linear-gradient(90deg,${ACCENT.amber}d9,${ACCENT.amber})"></div></div>` : nothing}</div>
      <div class="toggle on" style="background:${ACCENT.amber}"><span class="knob"></span></div></div>`;
  }
  private _toggleRow(id: string, ic: string, accent: keyof typeof ACCENT, name: string, sub: string, action: () => void, on = true): TemplateResult {
    const removing = this._removing.has(id);
    return html`<div class="row ${removing ? 'removing' : ''}" @click=${action}>
      <div class="rchip c-${accent}">${icon(ic)}</div>
      <div class="rtext"><div class="rname">${name}</div><div class="rsub">${sub}</div></div>
      <div class="toggle ${on ? 'on' : ''}" style=${on ? `background:${ACCENT[accent]}` : ''}><span class="knob"></span></div></div>`;
  }
  private _empty(title: string, sub: string): TemplateResult {
    return html`<div class="empty"><div class="eico">${icon('check')}</div><h3>${title}</h3><p>${sub}</p></div>`;
  }
  private _flash(ev: Event): void {
    const el = (ev.currentTarget as HTMLElement);
    el.style.background = 'rgba(255,255,255,.16)';
    window.setTimeout(() => (el.style.background = ''), 220);
  }

  /* -------------------- actions -------------------- */
  private _off(id: string, domain: string): void {
    const service = domain === 'cover' ? 'close_cover' : 'turn_off';
    this._removeRow(id);
    this._call(domain, service, { entity_id: id });
  }
  private _offMany(items: { entity_id: string }[], domain: string): void {
    const ids = items.filter((i) => !this._removing.has(i.entity_id)).map((i) => i.entity_id);
    if (!ids.length) return;
    ids.forEach((id) => this._removeRow(id));
    this._call(domain, domain === 'cover' ? 'close_cover' : 'turn_off', { entity_id: ids });
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
    .mtop { display: flex; align-items: flex-start; gap: 16px; }
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
    .rchip { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex: 0 0 auto; }
    .rchip svg { width: 19px; height: 19px; fill: currentColor; }
    .rtext { flex: 1; min-width: 0; } .rname { font-size: 14.5px; font-weight: 600; color: #EEF1F7; overflow-wrap: anywhere; }
    .rsub { font-size: 12px; color: #8A93A6; margin-top: 1px; }
    .bar { height: 6px; border-radius: 999px; background: rgba(255,255,255,.09); margin-top: 7px; overflow: hidden; } .bar .fill { height: 100%; border-radius: 999px; }
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
    .scene:hover { background: rgba(255,255,255,.08); } .scene:active { transform: scale(.97); }
    .scene .snm { font-size: 14px; font-weight: 600; color: #EEF1F7; }
    .wgrid { display: grid; grid-template-columns: repeat(auto-fill,minmax(225px,1fr)); gap: 10px; margin-top: 8px; } .wgrid .row { margin-top: 0; }
    .banner { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: 16px; margin-bottom: 18px; background: linear-gradient(120deg,rgba(244,89,91,.17),rgba(244,89,91,.06)); border: 1px solid rgba(244,89,91,.34); animation: pulse 2.8s ease-in-out infinite; }
    .btext { flex: 1; min-width: 0; } .btitle { font-size: 15px; font-weight: 700; color: #FFDADB; } .bsub { font-size: 12.5px; color: #E79C9D; margin-top: 2px; }
    .bbtn { margin-left: auto; background: #F4595B; color: #fff; border: none; border-radius: 11px; padding: 10px 16px; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
    @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(244,89,91,0); } 50% { box-shadow: 0 0 0 6px rgba(244,89,91,.1); } }
    .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 70px 20px; }
    .eico { width: 64px; height: 64px; border-radius: 50%; background: rgba(53,214,198,.14); color: #35D6C6; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    .eico svg { width: 32px; height: 32px; fill: currentColor; }
    .empty h3 { font-size: 19px; font-weight: 700; color: #EEF1F7; margin: 0; } .empty p { font-size: 13.5px; color: #8A93A6; margin: 6px 0 0; }
  `;
}

/* ===========================================================================
 * Card element — the home scene (greeting + category tiles).
 * ======================================================================== */
class HomeDashboardCard extends LitElement {
  static getStubConfig(): Partial<HomeDashConfig> {
    return { type: 'custom:home-dashboard-card', name: '', categories: ['active', 'climate', 'security', 'media', 'scenes', 'rooms'] };
  }

  private _hass!: HomeAssistant;
  private _config!: HomeDashConfig;
  private _modal?: HomeDashboardModal;

  setConfig(config: HomeDashConfig): void {
    if (!config) throw new Error('Invalid configuration');
    this._config = { categories: ['active', 'climate', 'security', 'media', 'scenes', 'rooms'], show_brightness: true, ...config };
    if (this._modal) this._modal.config = this._config;
    this.requestUpdate();
  }
  set hass(h: HomeAssistant) { this._hass = h; if (this._modal) this._modal.hass = h; this.requestUpdate(); }
  get hass(): HomeAssistant { return this._hass; }
  getCardSize(): number { return 12; }
  override disconnectedCallback(): void { super.disconnectedCallback(); this._closeModal(); }

  private _open(cat: CatKey): void {
    if (this._modal) return;
    const el = document.createElement('home-dashboard-modal') as HomeDashboardModal;
    el.config = this._config; el.category = cat; el.hass = this._hass;
    el.addEventListener('close', this._closeModal);
    document.body.appendChild(el);
    this._modal = el;
  }
  private _closeModal = (): void => {
    if (this._modal) { this._modal.removeEventListener('close', this._closeModal); this._modal.remove(); this._modal = undefined; }
  };

  /* ---- per-category summary on the home tiles ---- */
  private _summary(cat: CatKey): { count: string; line: string; sub: string } {
    const h = this._hass;
    if (cat === 'active') {
      const m = resolveModel(h, { type: '', group_by: 'area' });
      const c = m.counts;
      return { count: `${c.total} on`, line: [c.lights ? `${c.lights} lights` : '', c.blinds ? `${c.blinds} blinds open` : '', c.fans ? `${c.fans} fans` : ''].filter(Boolean).join(' · ') || 'All off', sub: `${m.rooms.length} rooms` };
    }
    if (cat === 'climate') {
      const z = byDomain(h, 'climate').filter((e) => e.state !== 'off' && e.state !== 'unavailable');
      const temps = z.map((e) => Number(e.attributes.current_temperature)).filter((n) => !isNaN(n));
      const avg = temps.length ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length) : null;
      return { count: avg != null ? `${avg}${tempUnit(h)}` : '—', line: z.slice(0, 2).map((e) => `${fname(h, e)} ${e.attributes.current_temperature != null ? Math.round(Number(e.attributes.current_temperature)) + tempUnit(h) : ''}`).join(' · ') || 'All off', sub: `${z.length} zones` };
    }
    if (cat === 'security') {
      const locks = byDomain(h, 'lock');
      const lockedN = locks.filter((e) => e.state === 'locked').length;
      const open = byDomain(h, 'cover').filter((e) => ['garage', 'door'].includes(String(e.attributes.device_class)) && (e.state === 'open' || Number(e.attributes.current_position) > 0)).length
        + byDomain(h, 'binary_sensor').filter((e) => ['door', 'window', 'garage_door', 'opening'].includes(String(e.attributes.device_class)) && e.state === 'on').length;
      return { count: open ? 'Check' : 'Secure', line: `${lockedN}/${locks.length} locked · ${open} open`, sub: open ? 'needs attention' : 'all clear' };
    }
    if (cat === 'media') {
      const players = byDomain(h, 'media_player').filter((e) => e.state !== 'unavailable');
      const playing = players.filter((e) => e.state === 'playing');
      return { count: `${playing.length}`, line: playing.slice(0, 2).map((e) => fname(h, e)).join(' · ') || 'Nothing playing', sub: `${players.length} players` };
    }
    if (cat === 'scenes') {
      const s = byDomain(h, 'scene');
      return { count: `${s.length}`, line: s.slice(0, 3).map((e) => fname(h, e)).join(' · ') || 'No scenes', sub: 'tap to run' };
    }
    const areas = Object.values(h.areas || {});
    return { count: `${areas.length}`, line: 'Tap a room for full control', sub: `${areas.length} rooms` };
  }

  override render() {
    if (!this._hass || !this._config) return nothing;
    const cats = (this._config.categories || []) as CatKey[];
    const now = new Date();
    const hr = now.getHours();
    const partOfDay = hr < 5 ? 'night' : hr < 12 ? 'morning' : hr < 18 ? 'afternoon' : 'evening';
    const nm = this._config.name ? `, ${this._config.name}` : '';
    const time = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')}`;
    let onCount = 0;
    try { onCount = resolveModel(this._hass, { type: '', group_by: 'area' }).counts.total; } catch { /* */ }

    return html`
      <div class="scene">
        <div class="aurora a1"></div><div class="aurora a2"></div><div class="aurora a3"></div>
        <div class="wrap">
          <div class="greet">
            <div>
              <h1>Good ${partOfDay}${nm}</h1>
              <div class="gsub">${onCount} thing${onCount !== 1 ? 's' : ''} on</div>
            </div>
            <div class="now"><b>${time}</b></div>
          </div>
          <div class="grid">
            ${cats.map((key) => {
              const meta = CATS[key]; if (!meta) return nothing;
              const s = this._summary(key);
              return html`<div class="tile" @click=${() => this._open(key)}>
                <div class="ttop">
                  <div class="tchip c-${meta.accent}">${icon(meta.icon)}</div>
                  <div class="tlabel">${meta.title}</div>
                  <div class="tcount">${s.count}</div>
                </div>
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
    .scene { position: relative; min-height: calc(100vh - 90px); margin: -8px -4px; padding: 26px 18px 50px; border-radius: 22px; overflow: hidden;
      background: linear-gradient(135deg,#10141e 0%,#15121f 52%,#221634 100%); }
    .aurora { position: absolute; border-radius: 50%; filter: blur(70px); opacity: .5; pointer-events: none; }
    .a1 { width: 520px; height: 520px; left: -160px; top: -180px; background: radial-gradient(circle,#3a2a6e,transparent 70%); }
    .a2 { width: 460px; height: 460px; right: -150px; top: 80px; background: radial-gradient(circle,#1c3a63,transparent 70%); }
    .a3 { width: 420px; height: 420px; left: 30%; bottom: -220px; background: radial-gradient(circle,#5a2350,transparent 70%); opacity: .35; }
    .wrap { position: relative; z-index: 1; max-width: 1080px; margin: 0 auto; }
    .greet { display: flex; align-items: flex-end; justify-content: space-between; margin: 4px 4px 22px; }
    .greet h1 { font-size: 30px; font-weight: 800; letter-spacing: -.5px; color: #F2F5FB; margin: 0; }
    .gsub { font-size: 14px; color: #8A93A6; margin-top: 4px; }
    .now b { font-size: 24px; font-weight: 700; color: #F2F5FB; letter-spacing: -.3px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(248px,1fr)); gap: 16px; }
    .tile { background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.07); border-radius: 18px; padding: 16px; cursor: pointer; display: flex; flex-direction: column; gap: 12px; min-height: 120px; transition: transform .12s ease, border-color .15s ease, background .15s ease; }
    .tile:hover { background: rgba(255,255,255,.075); border-color: rgba(150,180,240,.32); transform: translateY(-2px); }
    .tile:active { transform: scale(.99); }
    .ttop { display: flex; align-items: center; gap: 12px; }
    .tchip { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex: 0 0 auto; }
    .tchip svg { width: 22px; height: 22px; fill: currentColor; }
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
  w.customCards.push({ type: 'home-dashboard-card', name: 'Home Dashboard Card', description: 'Modal-driven glassy home dashboard — summary chips that open Active-Now-style modals.', preview: false });
}

export { HomeDashboardCard, HomeDashboardModal };
