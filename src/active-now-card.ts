import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import {
  ActiveNowConfig,
  DeviceItem,
  DeviceKind,
  FilterKey,
  HassEntity,
  HomeAssistant,
  ResolvedModel,
  RoomGroup,
} from './types';
import { buildSummary, resolveModel } from './entities';
import { icon } from './icons';
import './editor';

const DEFAULT_ACCENT = '#FFB23E';

const SERVICE: Record<DeviceKind, [string, string]> = {
  light: ['light', 'turn_off'],
  fan: ['fan', 'turn_off'],
  blind: ['cover', 'close_cover'],
  door: ['cover', 'close_cover'],
};

function hexToRgba(hex: string, alpha: number): string {
  let h = (hex || '').replace('#', '').trim();
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(h)) h = DEFAULT_ACCENT.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function relativeTime(iso: string | undefined): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (isNaN(then)) return '';
  const s = Math.max(0, (Date.now() - then) / 1000);
  if (s < 90) return 'just now';
  const m = Math.round(s / 60);
  if (m < 45) return `${m} minute${m !== 1 ? 's' : ''} ago`;
  const h = Math.round(s / 3600);
  if (h < 2) return 'an hour ago';
  if (h < 24) return `${h} hours ago`;
  const d = Math.round(s / 86400);
  return `${d} day${d !== 1 ? 's' : ''} ago`;
}

function validAccent(c: string | undefined): string {
  if (c && /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(c)) {
    return c.startsWith('#') ? c : `#${c}`;
  }
  return DEFAULT_ACCENT;
}

/* ===========================================================================
 * Overlay element — the full-screen dialog. Appended to <body> by the card so
 * it always renders above the dashboard regardless of stacking context.
 * ======================================================================== */
class ActiveNowOverlay extends LitElement {
  private _hass!: HomeAssistant;
  config!: ActiveNowConfig;
  private _filter: FilterKey = 'all';
  private _removing = new Set<string>();

  set hass(h: HomeAssistant) {
    this._hass = h;
    // Drop optimistic "removing" markers once HA confirms the device is off.
    if (this._removing.size) {
      for (const id of [...this._removing]) {
        if (this._isOff(h.states[id])) this._removing.delete(id);
      }
    }
    this.requestUpdate();
  }
  get hass(): HomeAssistant {
    return this._hass;
  }

  private _isOff(e: HassEntity | undefined): boolean {
    if (!e) return true;
    if (e.state === 'on' || e.state === 'open') return false;
    const pos = e.attributes?.current_position;
    if (typeof pos === 'number' && pos > 0) return false;
    return true;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', this._onKeyDown);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.body.style.overflow = this._prevOverflow;
    window.removeEventListener('keydown', this._onKeyDown);
  }
  private _prevOverflow = '';
  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this._close();
  };

  private _close(): void {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private _live<T extends DeviceItem>(items: T[]): T[] {
    return items.filter((i) => !this._removing.has(i.entity_id));
  }

  private _offMany(items: DeviceItem[]): void {
    const live = items.filter((i) => !this._removing.has(i.entity_id));
    if (!live.length) return;
    live.forEach((i) => this._removing.add(i.entity_id));
    this.requestUpdate();

    const byService = new Map<string, string[]>();
    for (const it of live) {
      const [domain, service] = SERVICE[it.kind];
      const key = `${domain}.${service}`;
      const arr = byService.get(key) ?? [];
      arr.push(it.entity_id);
      byService.set(key, arr);
    }
    for (const [key, ids] of byService) {
      const [domain, service] = key.split('.');
      this._hass.callService(domain, service, { entity_id: ids });
    }

    // Safety net: if the service never lands, restore the rows after a beat.
    const allIds = live.map((i) => i.entity_id);
    window.setTimeout(() => {
      let changed = false;
      for (const id of allIds) if (this._removing.delete(id)) changed = true;
      if (changed) this.requestUpdate();
    }, 2200);
  }

  private _off(item: DeviceItem): void {
    this._offMany([item]);
  }

  // ---- render ----------------------------------------------------------
  override render() {
    if (!this._hass || !this.config) return nothing;
    const accent = validAccent(this.config.accent_color);
    const model = resolveModel(this._hass, this.config);

    const rootStyle =
      `--accent:${accent};` +
      `--accent-soft:${hexToRgba(accent, 0.14)};` +
      `--accent-strong:${hexToRgba(accent, 0.85)};`;

    const c = this._counts(model);
    const roomCount = model.rooms.filter(
      (r) => this._live(r.lights).length + this._live(r.fans).length > 0
    ).length;
    const f = this._filter;

    const showAllLights =
      c.lights >= 1 && (f === 'all' || f === 'lights');

    return html`
      <div class="root" style=${rootStyle}>
        <div class="backdrop" @click=${this._close}></div>
        <div
          class="panel"
          role="dialog"
          aria-modal="true"
          aria-label=${this.config.title || 'Active Now'}
        >
          <div class="header">
            <div class="headtop">
              <div class="titlewrap">
                <div class="title">${this.config.title || 'Active Now'}</div>
                <div class="subtitle">
                  ${c.total} thing${c.total !== 1 ? 's' : ''} on · ${roomCount}
                  room${roomCount !== 1 ? 's' : ''}
                </div>
              </div>
              <div class="headactions">
                ${showAllLights
                  ? html`<button class="ghost amber" @click=${() => this._turnOffAllLights(model)}>
                      ${icon('bulb')} Turn off all lights
                    </button>`
                  : nothing}
                <button class="closeX" aria-label="Close" @click=${this._close}>
                  ${icon('close')}
                </button>
              </div>
            </div>
            ${this._renderFilters(c)}
          </div>
          <div class="body">${this._renderBody(model)}</div>
        </div>
      </div>
    `;
  }

  private _counts(model: ResolvedModel) {
    const lights = model.rooms.reduce((n, r) => n + this._live(r.lights).length, 0);
    const fans = model.rooms.reduce((n, r) => n + this._live(r.fans).length, 0);
    const blinds = this._live(model.blinds).length;
    const doors = this._live(model.doors).length;
    return { lights, fans, blinds, doors, total: lights + fans + blinds + doors };
  }

  private _renderFilters(c: {
    lights: number;
    fans: number;
    blinds: number;
    doors: number;
    total: number;
  }): TemplateResult {
    const chip = (key: FilterKey, label: string, count: number, color: string) => html`
      <button
        class="fchip ${this._filter === key ? 'active' : ''}"
        @click=${() => {
          this._filter = key;
          this.requestUpdate();
        }}
      >
        <span class="fdot" style="background:${color}"></span>
        <span>${label}</span>
        <span class="fcount">${count}</span>
      </button>
    `;
    const accent = 'var(--accent)';
    return html`
      <div class="filters">
        ${chip('all', 'All', c.total, '#9aa3b4')}
        ${chip('lights', 'Lights', c.lights, accent)}
        ${chip('blinds', 'Blinds', c.blinds, '#5BA8F2')}
        ${chip('fans', 'Fans', c.fans, '#35D6C6')}
        ${chip('doors', 'Doors', c.doors, '#F4595B')}
      </div>
    `;
  }

  private _renderBody(model: ResolvedModel): TemplateResult {
    const f = this._filter;
    const c = this._counts(model);

    // Whole-home empty: nothing on at all.
    if (c.total === 0) {
      return this._renderEmpty(
        'All clear',
        'Nothing is on. Your home is buttoned up.'
      );
    }

    const showBanner = (f === 'all' || f === 'doors') && this._live(model.doors).length > 0;
    const showRooms = f === 'all' || f === 'lights' || f === 'fans';
    const showBlinds = f === 'all' || f === 'blinds';

    const banner = showBanner ? this._renderBanner(model) : nothing;
    const rooms = showRooms ? this._renderRooms(model) : nothing;
    const blinds = showBlinds ? this._renderBlinds(model) : nothing;

    // Per-filter empty: the chosen category has nothing in it.
    const hasContent =
      (showBanner) ||
      (showRooms && rooms !== nothing) ||
      (showBlinds && blinds !== nothing);

    if (!hasContent) {
      return this._renderEmpty(
        'Nothing here',
        'Everything in this category is already off.'
      );
    }

    return html`${banner}${rooms}${blinds}`;
  }

  private _renderEmpty(title: string, sub: string): TemplateResult {
    return html`
      <div class="empty">
        <div class="ico">${icon('check')}</div>
        <h3>${title}</h3>
        <p>${sub}</p>
      </div>
    `;
  }

  private _renderBanner(model: ResolvedModel): TemplateResult {
    const doors = this._live(model.doors);
    const single = doors.length === 1;
    let title: string;
    let sub: string;
    if (single) {
      const d = doors[0];
      title = d.isGarage ? 'Garage door is open' : `${d.name} is open`;
      const rel = relativeTime(this._hass.states[d.entity_id]?.last_changed);
      sub = rel ? `${d.name} · opened ${rel}` : 'Tap close to secure it.';
    } else {
      title = `${doors.length} doors are open`;
      sub = 'Close them before you head out.';
    }
    return html`
      <div class="banner">
        <div class="chip door">${icon('garage')}</div>
        <div class="bannertext">
          <div class="bannertitle">${title}</div>
          <div class="bannersub">${sub}</div>
        </div>
        <button class="closebtn" @click=${() => this._offMany(doors)}>
          ${single ? 'Close door' : 'Close all'}
        </button>
      </div>
    `;
  }

  private _renderRooms(model: ResolvedModel): TemplateResult | typeof nothing {
    const f = this._filter;
    const showLights = f === 'all' || f === 'lights';
    const showFans = f === 'all' || f === 'fans';

    const cards: TemplateResult[] = [];
    for (const room of model.rooms) {
      const lights = showLights ? room.lights : [];
      const fans = showFans ? room.fans : [];
      if (!lights.length && !fans.length) continue;
      const liveN = this._live(lights).length + this._live(fans).length;
      cards.push(this._renderRoomCard(room, lights, fans, liveN));
    }
    if (!cards.length) return nothing;
    return html`<div class="rooms">${cards}</div>`;
  }

  private _renderRoomCard(
    room: RoomGroup,
    lights: DeviceItem[],
    fans: DeviceItem[],
    liveN: number
  ): TemplateResult {
    const all = [...room.lights, ...room.fans];
    return html`
      <div class="room">
        <div class="roomhead">
          <div class="roomname">${room.name}</div>
          <div class="pill">${liveN} on</div>
          <button class="linkbtn" @click=${() => this._offMany(all)}>Turn off</button>
        </div>
        ${lights.map((l) => this._renderLightRow(l))}
        ${fans.map((fn) => this._renderFanRow(fn))}
      </div>
    `;
  }

  private _renderLightRow(item: DeviceItem): TemplateResult {
    const removing = this._removing.has(item.entity_id);
    const pct = item.brightnessPct ?? 100;
    const showBar = this.config.show_brightness !== false;
    return html`
      <div
        class="row ${removing ? 'removing' : ''}"
        @click=${() => this._off(item)}
      >
        <div class="chip light">${icon('bulb')}</div>
        <div class="rowtext">
          <div class="name">${item.name}</div>
          <div class="sub">On · ${pct}%</div>
          ${showBar
            ? html`<div class="bar"><div class="fill" style="width:${pct}%"></div></div>`
            : nothing}
        </div>
        <div class="toggle light"><span class="knob"></span></div>
      </div>
    `;
  }

  private _renderFanRow(item: DeviceItem): TemplateResult {
    const removing = this._removing.has(item.entity_id);
    return html`
      <div class="row ${removing ? 'removing' : ''}" @click=${() => this._off(item)}>
        <div class="chip fan">${icon('fan')}</div>
        <div class="rowtext">
          <div class="name">${item.name}</div>
          <div class="sub">Running</div>
        </div>
        <div class="toggle fan"><span class="knob"></span></div>
      </div>
    `;
  }

  private _renderBlinds(model: ResolvedModel): TemplateResult | typeof nothing {
    if (!model.blinds.length) return nothing;
    const liveN = this._live(model.blinds).length;
    return html`
      <div class="zone">
        <div class="zonehead">
          <div class="chip blind">${icon('blinds')}</div>
          <div class="zonetitle">
            Blinds &amp; Curtains <span class="zonecount">${liveN} open</span>
          </div>
          <button class="ghost blue" @click=${() => this._offMany(model.blinds)}>
            Close all
          </button>
        </div>
        <div class="blindgrid">
          ${model.blinds.map((b) => this._renderBlindRow(b))}
        </div>
      </div>
    `;
  }

  private _renderBlindRow(item: DeviceItem): TemplateResult {
    const removing = this._removing.has(item.entity_id);
    return html`
      <div class="row ${removing ? 'removing' : ''}" @click=${() => this._off(item)}>
        <div class="chip blind">${icon('blinds')}</div>
        <div class="rowtext">
          <div class="name">${item.name}</div>
          <div class="sub">Open</div>
        </div>
        <div class="toggle blind"><span class="knob"></span></div>
      </div>
    `;
  }

  private _turnOffAllLights(model: ResolvedModel): void {
    const lights = model.rooms.flatMap((r) => r.lights);
    this._offMany(lights);
  }

  static override styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 2147483000;
      font-family: -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif;
    }
    .root {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(6, 8, 14, 0.62);
      -webkit-backdrop-filter: blur(2px);
      backdrop-filter: blur(2px);
      animation: fade 0.18s ease;
    }
    .panel {
      position: relative;
      width: min(1080px, 95vw);
      height: min(880px, 93vh);
      display: flex;
      flex-direction: column;
      border-radius: 26px;
      background: linear-gradient(150deg, #191e2c, #1b1830 60%, #241a36);
      border: 1px solid rgba(255, 255, 255, 0.09);
      box-shadow: 0 40px 120px -30px rgba(0, 0, 0, 0.75);
      overflow: hidden;
      animation: pop 0.2s cubic-bezier(0.2, 0.9, 0.3, 1.1);
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
    }
    @keyframes pop {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.985);
      }
    }

    /* header */
    .header {
      flex: 0 0 auto;
      padding: 20px 26px 14px;
      background: linear-gradient(180deg, #1b2030, #1a1c2e);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .headtop {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }
    .title {
      font-size: 25px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #f2f5fb;
    }
    .subtitle {
      font-size: 13.5px;
      color: #8a93a6;
      margin-top: 3px;
    }
    .headactions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .closeX {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #cfd6e6;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex: 0 0 auto;
    }
    .closeX:hover {
      background: rgba(255, 255, 255, 0.12);
    }
    .closeX svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    /* buttons */
    .ghost {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cfd6e6;
      border-radius: 10px;
      padding: 6px 12px;
      font: inherit;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s, border-color 0.15s;
    }
    .ghost svg {
      width: 15px;
      height: 15px;
      fill: currentColor;
    }
    .ghost:hover {
      background: rgba(255, 255, 255, 0.06);
    }
    .ghost.amber {
      color: var(--accent);
      border-color: rgba(255, 178, 62, 0.4);
      background: rgba(255, 178, 62, 0.08);
    }
    .ghost.amber:hover {
      background: rgba(255, 178, 62, 0.14);
    }
    .ghost.blue {
      color: #5ba8f2;
      border-color: rgba(91, 168, 242, 0.4);
    }
    /* borderless text action (per-room "Turn off") */
    .linkbtn {
      background: transparent;
      border: none;
      color: #8a93a6;
      font: inherit;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 2px;
      white-space: nowrap;
      transition: color 0.15s;
    }
    .linkbtn:hover {
      color: #eef1f7;
    }

    /* filter chips */
    .filters {
      display: flex;
      gap: 8px;
      margin-top: 14px;
      flex-wrap: wrap;
    }
    .fchip {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 13px;
      border-radius: 999px;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #8a93a6;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }
    .fchip.active {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.18);
      color: #eef1f7;
    }
    .fdot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .fcount {
      opacity: 0.85;
      font-variant-numeric: tabular-nums;
    }

    /* body */
    .body {
      flex: 1 1 auto;
      overflow-y: auto;
      padding: 20px 26px 30px;
    }

    /* shared icon chip */
    .chip {
      width: 38px;
      height: 38px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
    }
    .chip svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
    .chip.light {
      background: var(--accent-soft);
      color: var(--accent);
    }
    .chip.fan {
      background: rgba(53, 214, 198, 0.14);
      color: #35d6c6;
    }
    .chip.blind {
      background: rgba(91, 168, 242, 0.13);
      color: #5ba8f2;
    }
    .chip.door {
      background: rgba(244, 89, 91, 0.18);
      color: #f4595b;
    }

    /* urgent banner */
    .banner {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 18px;
      border-radius: 16px;
      margin-bottom: 18px;
      background: linear-gradient(
        120deg,
        rgba(244, 89, 91, 0.17),
        rgba(244, 89, 91, 0.06)
      );
      border: 1px solid rgba(244, 89, 91, 0.34);
      animation: pulse 2.4s ease-in-out infinite;
    }
    @keyframes pulse {
      0%,
      100% {
        box-shadow: 0 0 0 0 rgba(244, 89, 91, 0);
      }
      50% {
        box-shadow: 0 0 0 6px rgba(244, 89, 91, 0.1);
      }
    }
    .bannertext {
      flex: 1;
      min-width: 0;
    }
    .bannertitle {
      font-size: 15px;
      font-weight: 700;
      color: #ffdadb;
    }
    .bannersub {
      font-size: 12.5px;
      color: #e79c9d;
      margin-top: 2px;
    }
    .closebtn {
      background: #f4595b;
      color: #fff;
      border: none;
      border-radius: 11px;
      padding: 10px 16px;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      flex: 0 0 auto;
    }
    .closebtn:hover {
      filter: brightness(1.07);
    }

    /* rooms masonry */
    .rooms {
      column-count: 3;
      column-gap: 16px;
    }
    @media (max-width: 1080px) {
      .rooms {
        column-count: 2;
      }
    }
    @media (max-width: 720px) {
      .rooms {
        column-count: 1;
      }
    }
    .room {
      break-inside: avoid;
      margin-bottom: 16px;
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 18px;
      padding: 14px;
    }
    .roomhead {
      display: flex;
      align-items: center;
      gap: 9px;
    }
    .roomname {
      font-size: 15px;
      font-weight: 700;
      color: #eef1f7;
    }
    .pill {
      font-size: 11.5px;
      font-weight: 600;
      color: #aab3c5;
      background: rgba(255, 255, 255, 0.06);
      padding: 2px 8px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .roomhead .linkbtn {
      margin-left: auto;
    }

    /* device row */
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 13px;
      padding: 10px 12px;
      margin-top: 8px;
      cursor: pointer;
      min-height: 44px;
      transition: opacity 0.26s ease, transform 0.26s ease, background 0.15s ease;
    }
    .row:hover {
      background: rgba(255, 255, 255, 0.075);
    }
    .row.removing {
      opacity: 0;
      transform: scale(0.95);
      pointer-events: none;
    }
    .rowtext {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-size: 14.5px;
      font-weight: 600;
      color: #eef1f7;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }
    .sub {
      font-size: 12px;
      color: #8a93a6;
      margin-top: 1px;
    }
    .bar {
      height: 6px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.09);
      margin-top: 7px;
      overflow: hidden;
    }
    .bar .fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--accent-strong), var(--accent));
      transition: width 0.2s ease;
    }

    /* toggle */
    .toggle {
      width: 48px;
      height: 28px;
      border-radius: 999px;
      position: relative;
      flex: 0 0 auto;
    }
    .toggle .knob {
      position: absolute;
      top: 3px;
      left: 23px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
    .toggle.light {
      background: var(--accent);
    }
    .toggle.fan {
      background: #35d6c6;
    }
    .toggle.blind {
      background: #5ba8f2;
    }

    /* blinds zone */
    .zone {
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 18px;
      padding: 16px;
      margin-top: 2px;
    }
    .zonehead {
      display: flex;
      align-items: center;
      gap: 11px;
      margin-bottom: 4px;
    }
    .zonetitle {
      font-size: 15px;
      font-weight: 700;
      color: #eef1f7;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .zonecount {
      font-size: 11.5px;
      font-weight: 600;
      color: #aab3c5;
      background: rgba(91, 168, 242, 0.14);
      padding: 2px 8px;
      border-radius: 999px;
    }
    .zonehead .ghost {
      margin-left: auto;
    }
    .blindgrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
      gap: 10px;
      margin-top: 6px;
    }
    .blindgrid .row {
      margin-top: 0;
    }

    /* empty state */
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 70px 20px;
    }
    .empty .ico {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(53, 214, 198, 0.14);
      color: #35d6c6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .empty .ico svg {
      width: 32px;
      height: 32px;
      fill: currentColor;
    }
    .empty h3 {
      font-size: 19px;
      font-weight: 700;
      color: #eef1f7;
      margin: 0;
    }
    .empty p {
      font-size: 13.5px;
      color: #8a93a6;
      margin: 6px 0 0;
    }
  `;
}

/* ===========================================================================
 * Card element — renders only the summary chip; owns the overlay lifecycle.
 * ======================================================================== */
class ActiveNowCard extends LitElement {
  static getConfigElement(): HTMLElement {
    return document.createElement('active-now-card-editor');
  }

  static getStubConfig(): Partial<ActiveNowConfig> {
    return {
      type: 'custom:active-now-card',
      title: 'Active Now',
      group_by: 'area',
      show_brightness: true,
    };
  }

  private _hass!: HomeAssistant;
  private _config!: ActiveNowConfig;
  private _overlay?: ActiveNowOverlay;

  setConfig(config: ActiveNowConfig): void {
    if (!config) throw new Error('Invalid configuration');
    if (config.group_by && !['area', 'manual'].includes(config.group_by)) {
      throw new Error(`group_by must be "area" or "manual" (got "${config.group_by}")`);
    }
    if (config.group_by === 'manual' && !Array.isArray(config.rooms)) {
      throw new Error('group_by: manual requires a "rooms" list');
    }
    this._config = {
      group_by: 'area',
      title: 'Active Now',
      show_brightness: true,
      accent_color: DEFAULT_ACCENT,
      ...config,
    };
    if (this._overlay) this._overlay.config = this._config;
    this.requestUpdate();
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (this._overlay) this._overlay.hass = hass;
    this.requestUpdate();
  }
  get hass(): HomeAssistant {
    return this._hass;
  }

  getCardSize(): number {
    return 1;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._closeOverlay();
  }

  private _openOverlay = (): void => {
    if (this._overlay) return;
    const el = document.createElement('active-now-overlay') as ActiveNowOverlay;
    el.config = this._config;
    el.hass = this._hass;
    el.addEventListener('close', this._closeOverlay);
    document.body.appendChild(el);
    this._overlay = el;
  };

  private _closeOverlay = (): void => {
    if (this._overlay) {
      this._overlay.removeEventListener('close', this._closeOverlay);
      this._overlay.remove();
      this._overlay = undefined;
    }
  };

  private _onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._openOverlay();
    }
  };

  override render() {
    if (!this._hass || !this._config) return nothing;
    const model = resolveModel(this._hass, this._config);
    const summary = buildSummary(model);
    return html`
      <div
        class="chip"
        role="button"
        tabindex="0"
        @click=${this._openOverlay}
        @keydown=${this._onKey}
      >
        <div class="homechip">${icon('home')}</div>
        <div class="chiptext">
          <div class="line1">${model.counts.total} active now</div>
          <div class="line2">${summary}</div>
        </div>
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: block;
      font-family: -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif;
    }
    .chip {
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      padding: 16px 20px;
      border-radius: 18px;
      background: linear-gradient(
        135deg,
        rgba(74, 103, 176, 0.42),
        rgba(54, 72, 128, 0.3)
      );
      border: 1px solid rgba(120, 150, 220, 0.28);
      transition: transform 0.12s ease, border-color 0.15s ease;
    }
    .chip:hover {
      border-color: rgba(150, 180, 240, 0.45);
    }
    .chip:active {
      transform: scale(0.99);
    }
    .homechip {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: rgba(244, 89, 91, 0.18);
      color: #f4595b;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
    }
    .homechip svg {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }
    .chiptext {
      min-width: 0;
    }
    .line1 {
      font-size: 16px;
      font-weight: 700;
      color: #eef1f7;
    }
    .line2 {
      font-size: 13px;
      color: #c4d0ec;
      margin-top: 2px;
      overflow-wrap: anywhere;
    }
  `;
}

/* ---- registration ------------------------------------------------------ */
if (!customElements.get('active-now-overlay')) {
  customElements.define('active-now-overlay', ActiveNowOverlay);
}
if (!customElements.get('active-now-card')) {
  customElements.define('active-now-card', ActiveNowCard);
}

const w = window as unknown as { customCards?: unknown[] };
w.customCards = w.customCards || [];
if (!(w.customCards as { type?: string }[]).some((c) => c.type === 'active-now-card')) {
  w.customCards.push({
    type: 'active-now-card',
    name: 'Active Now Card',
    description:
      "A summary chip + full-screen overlay to review and turn off everything that's on, grouped by room.",
    preview: false,
    documentationURL: 'https://github.com/your-username/active-now-card',
  });
}

// eslint-disable-next-line no-console
console.info(
  '%c ACTIVE-NOW-CARD %c v1.0.0 ',
  'color:#10141e;background:#FFB23E;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px',
  'color:#FFB23E;background:#10141e;border-radius:0 4px 4px 0;padding:2px 6px'
);

export { ActiveNowCard, ActiveNowOverlay };
