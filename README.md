# Active Now Card

A custom [Home Assistant](https://www.home-assistant.io/) Lovelace card that shows a
compact **summary chip** of everything that's currently on — and opens a full-screen
**overlay** to review and turn it all off fast, grouped by room.

> `28 active now · 1 garage door open · 15 lights · 10 blinds open · 2 fans running — tap to manage`

Tap the chip and you get a dark, glassy panel with:

- a red **urgent banner** when a garage/door is open (one-tap close),
- **room cards** (masonry) listing every on light + running fan, with brightness bars
  and per-domain toggles,
- a dedicated **Blinds & Curtains** zone,
- **filters** (All / Lights / Blinds / Fans / Doors) with live counts,
- bulk actions: per-room **Turn off**, **Turn off all lights**, **Close all** blinds.

Turning something off fades the row out and decrements the counts instantly; the card
re-syncs from the next state update.

---

## Features

- **Zero-config auto-discovery** — finds every on light/fan and open blind/garage and
  groups lights & fans by their Home Assistant **area**.
- **Manual grouping** — define your own rooms in YAML when you want full control.
- **Accurate brightness** — bars read real `brightness` and can be toggled off.
- **Names never truncate** — long entity names wrap instead of clipping.
- **Renders above the dashboard** — the overlay is portalled to `document.body` with a
  high z-index, so it's never clipped by a card's stacking context.
- Single ~45 KB bundle, **Lit** bundled in, no other runtime dependencies.

---

## Installation

### HACS (recommended)

This is a custom repository — add it once, then install like any other card.

1. In Home Assistant, open **HACS → Frontend**.
2. Click the **⋮** menu (top-right) → **Custom repositories**.
3. Add the repository URL, choose category **Dashboard** (a.k.a. *Lovelace/Plugin*), and
   click **Add**.
4. Find **Active Now Card** in the list, open it, and click **Download**.
5. HACS registers the dashboard resource automatically. **Reload your browser** (and clear
   cache if the card doesn't appear).

### Manual

1. Download `dist/active-now-card.js` from a release (or build it — see below).
2. Copy it to `config/www/active-now-card.js` in your Home Assistant config.
3. Register it as a dashboard resource (see next section).

### Registering the resource

Most **storage-mode** dashboards register the resource for you (HACS) or via the UI:
**Settings → Dashboards → ⋮ → Resources → Add resource**:

```
URL:  /hacsfiles/active-now-card/active-now-card.js     (HACS)
        — or —
URL:  /local/active-now-card.js                          (manual install)
Type: JavaScript Module
```

For a **YAML-mode** dashboard, add it under `lovelace:` in `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /hacsfiles/active-now-card/active-now-card.js
      type: module
```

---

## Usage

Add a card to your dashboard:

```yaml
type: custom:active-now-card
title: Active Now
group_by: area        # auto-discovery (default)
```

That's it — everything else is discovered automatically.

### Configuration

| Option            | Type                | Default       | Description |
|-------------------|---------------------|---------------|-------------|
| `type`            | string              | —             | `custom:active-now-card` (required). |
| `title`           | string              | `Active Now`  | Heading shown in the overlay. |
| `group_by`        | `area` \| `manual`  | `area`        | How room cards are built. `area` auto-discovers; `manual` uses your `rooms`. |
| `rooms`           | list                | —             | Required when `group_by: manual`. Each item has a `name` and an `entities` array. |
| `fans`            | list of entity ids  | auto          | Explicit fan list. Omit to auto-discover every `fan.*`. |
| `blinds`          | list of entity ids  | auto          | Explicit blind/curtain list (the **Blinds & Curtains** zone). Omit to auto-discover. |
| `garage`          | string \| list      | auto          | Garage/door cover(s) → urgent banner. Omit to auto-discover `garage`/`door` covers. |
| `accent_color`    | hex string          | `#FFB23E`     | Accent for lights (chips, bars, toggles). |
| `show_brightness` | boolean             | `true`        | Show brightness bars on light rows. |

### Example — auto (area) grouping

```yaml
type: custom:active-now-card
title: Active Now
group_by: area
accent_color: "#FFB23E"
show_brightness: true
# Optional overrides — only set these if auto-discovery picks the wrong things:
# garage: cover.lan_garage
# blinds: [cover.back_right_blind, cover.right_curtain]
# fans:   [fan.office, fan.guest_ceiling]
```

### Example — manual rooms

```yaml
type: custom:active-now-card
title: Active Now
group_by: manual
rooms:
  - name: Master Bedroom
    entities: [light.master_cans, light.master_chandelier]
  - name: Living Room
    entities: [light.living_room_lamp, light.living_room_cans, light.living_room_accent]
  - name: Office
    entities: [light.office_desk, light.office_overhead, fan.office]
blinds: [cover.back_right_blind, cover.right_curtain]
garage: cover.lan_garage
```

---

## How auto-discovery works

When the corresponding list is omitted:

- **Lights** — every `light.*` with `state: on`. Grouped by area via the entity registry
  (`hass.entities[id].area_id`, falling back to the entity's device area). Lights with no
  area land in an **Other** group.
- **Fans** — every `fan.*` with `state: on`, placed **inside its own room** (its area),
  alongside that room's lights.
- **Blinds & curtains** — every open `cover.*` whose `device_class` is one of
  `blind, curtain, shade, window, awning, shutter`. These fill the dedicated
  **Blinds & Curtains** zone (not the room cards).
- **Garage / doors** — any open `cover.*` with `device_class` `garage` or `door` →
  surfaced as the red **urgent banner** at the top.

"Open" means `state: open` **or** `current_position > 0`.

### Actions

| Device        | Off action                          |
|---------------|-------------------------------------|
| Light         | `light.turn_off`                    |
| Fan           | `fan.turn_off`                      |
| Blind/curtain | `cover.close_cover`                 |
| Garage/door   | `cover.close_cover`                 |

Bulk buttons (per-room **Turn off**, **Turn off all lights**, **Close all**) issue a single
service call with an `entity_id` array per domain.

---

## Build from source

```bash
npm install
npm run build      # -> dist/active-now-card.js
npm run watch      # rebuild on change
npm run typecheck  # tsc --noEmit
```

A local demo with a mock `hass` lives in [`demo/demo.html`](demo/demo.html):

```bash
node demo/server.cjs   # then open http://localhost:8791/demo/demo.html
```

### Repo layout

```
active-now-card/
  src/
    active-now-card.ts   # card element + overlay element + registration
    entities.ts          # entity resolution + summary builder
    icons.ts             # inline MDI paths
    editor.ts            # optional visual config editor
    types.ts             # typings
  demo/                  # standalone preview harness (mock hass)
  dist/active-now-card.js
  rollup.config.js
  tsconfig.json
  package.json
  hacs.json
  README.md
```

---

## License

[MIT](LICENSE)
