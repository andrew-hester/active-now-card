import { LitElement, html, css } from 'lit';
import { ActiveNowConfig, HomeAssistant } from './types';

/**
 * Lightweight visual editor for the card. Covers the common scalar options;
 * advanced lists (rooms/fans/blinds/garage) are best edited in YAML, so the
 * editor surfaces a hint rather than a fragile nested list UI.
 */
class ActiveNowCardEditor extends LitElement {
  hass?: HomeAssistant;
  private _config: Partial<ActiveNowConfig> = {};

  setConfig(config: ActiveNowConfig): void {
    this._config = { ...config };
    this.requestUpdate();
  }

  private _emit(patch: Partial<ActiveNowConfig>): void {
    const next = { ...this._config, ...patch };
    // Strip empties so we don't write noise into the YAML.
    (Object.keys(next) as (keyof ActiveNowConfig)[]).forEach((k) => {
      if (next[k] === '' || next[k] === undefined || next[k] === null) delete next[k];
    });
    this._config = next;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    const c = this._config;
    return html`
      <div class="form">
        <label class="field">
          <span>Title</span>
          <input
            type="text"
            .value=${c.title ?? 'Active Now'}
            @input=${(e: Event) =>
              this._emit({ title: (e.target as HTMLInputElement).value })}
          />
        </label>

        <label class="field">
          <span>Group by</span>
          <select
            .value=${c.group_by ?? 'area'}
            @change=${(e: Event) =>
              this._emit({
                group_by: (e.target as HTMLSelectElement).value as 'area' | 'manual',
              })}
          >
            <option value="area">Area (auto-discover)</option>
            <option value="manual">Manual rooms</option>
          </select>
        </label>

        <label class="field">
          <span>Accent color</span>
          <input
            type="text"
            placeholder="#FFB23E"
            .value=${c.accent_color ?? '#FFB23E'}
            @input=${(e: Event) =>
              this._emit({ accent_color: (e.target as HTMLInputElement).value })}
          />
        </label>

        <label class="checkbox">
          <input
            type="checkbox"
            .checked=${c.show_brightness !== false}
            @change=${(e: Event) =>
              this._emit({ show_brightness: (e.target as HTMLInputElement).checked })}
          />
          <span>Show brightness bars</span>
        </label>

        ${c.group_by === 'manual'
          ? html`<div class="hint">
              <code>group_by: manual</code> — add a <code>rooms:</code> list in YAML.
              Each room needs a <code>name</code> and an <code>entities</code> array.
            </div>`
          : html`<div class="hint">
              Auto-discovery groups lights and fans by their Home Assistant area.
              Use the YAML editor to override <code>fans</code>, <code>blinds</code>,
              or <code>garage</code>.
            </div>`}
      </div>
    `;
  }

  static override styles = css`
    .form {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 4px 2px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .field > span {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color, #ddd);
    }
    input[type='text'],
    select {
      padding: 9px 11px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #222);
      font: inherit;
      font-size: 14px;
    }
    .checkbox {
      display: flex;
      align-items: center;
      gap: 9px;
      font-size: 14px;
      color: var(--primary-text-color, #ddd);
      cursor: pointer;
    }
    .checkbox input {
      width: 18px;
      height: 18px;
    }
    .hint {
      font-size: 12.5px;
      line-height: 1.5;
      color: var(--secondary-text-color, #888);
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
      padding: 10px 12px;
      border-radius: 8px;
    }
    code {
      font-family: ui-monospace, 'SF Mono', Menlo, monospace;
      font-size: 12px;
      background: rgba(127, 127, 127, 0.18);
      padding: 1px 5px;
      border-radius: 4px;
    }
  `;
}

if (!customElements.get('active-now-card-editor')) {
  customElements.define('active-now-card-editor', ActiveNowCardEditor);
}

export { ActiveNowCardEditor };
