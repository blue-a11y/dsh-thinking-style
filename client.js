window.__ModuleLoader__.load({
  id: '@blue-a11y/dsh-thinking-style',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const SETTINGS_NS = 'dsh-thinking-style-settings';
    const THINK_KEYS = new Set([
      'message.think', 'row.running', 'chat.deepDiving', 'chat.deepDivingFor',
      'message.stepProcess.thinking', 'duration.hourUnit', 'duration.minuteUnit', 'duration.secondUnit',
    ]);
    const SETTINGS_COPY = {
      en: {
        language: 'Thinking language', auto: 'Follow DSH', en: 'English', zh: '中文',
        description: 'Used for thinking labels and elapsed-time units. Saved automatically.',
        saveFailed: 'Could not save the language. Please try again.', loading: 'Loading settings…',
      },
      zh: {
        language: '思考区域语言', auto: '跟随 DSH', en: 'English', zh: '中文',
        description: '用于思考状态文案与耗时单位，选择后自动保存。',
        saveFailed: '语言保存失败，请重试。', loading: '正在加载设置…',
      },
    };
    /* Restores the v0.0.1 thinking look:
       - status line: 14px/22px/500, deepseek-500 <-> deepseek-200 continuous gradient sweep
       - icon and text share the same deepseek-500 blue
       - think row: 300px grey sweep while running, 14px/24px tertiary text */
    const CSS = `
/* The whale-tail icon reads currentColor; pin the row to the pure brand blue
   (the gradient-clipped text stays transparent-fill, the icon picks this up). */
[data-chat-running] {
  color: var(--dsw-static-deepseek-500);
}

/* ===== 1-3. Running status line (TextShimmer-based "Deep diving..." row) ===== */

/* v0.0.1 font: 500 14px/22px (--dsw-font-s-strong-14). */
[data-chat-running] {
  font-size: 14px !important;
  line-height: 22px !important;
  font-weight: 500;
}

/* Disable the TextShimmer decorative overlay (mask sweep / stepped highlight).
   The real text keeps rendering; only the overlay copy goes away. */
[data-chat-running] span[data-shimmer] > span[inert] {
  display: none !important;
}

/* v0.0.1 continuous background-gradient sweep, clipped to the text.
   The real text span is the first span of the non-decorative content copy. */
[data-chat-running] span[data-shimmer] > span:not([inert]) > span {
  background-image: linear-gradient(90deg,
    var(--dsw-static-deepseek-500) 0%,
    var(--dsw-static-deepseek-500) 40%,
    var(--dsw-static-deepseek-200) 50%,
    var(--dsw-static-deepseek-500) 60%,
    var(--dsw-static-deepseek-500) 100%);
  background-size: 250% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: dsh-thinking-style-turn-status-shimmer 2s linear infinite;
}

@keyframes dsh-thinking-style-turn-status-shimmer {
  to { background-position: 0 0; }
}

.dsh-thinking-style-settings {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  border: 0.5px solid var(--dsw-alias-border-l4);
  border-radius: 16px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 22px;
}
.dsh-thinking-style-settings-title { margin: 0; font: inherit; font-weight: 500; }
.dsh-thinking-style-settings-description {
  max-width: 52ch;
  margin: 6px 0 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 20px;
}
.dsh-thinking-style-language-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2px;
  padding: 4px;
  border-radius: 12px;
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-thinking-style-language-option {
  position: relative;
  min-width: 0;
  border-radius: 8px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  transition: color 120ms ease, background-color 120ms ease, box-shadow 120ms ease;
}
.dsh-thinking-style-language-option span {
  display: block;
  padding: 8px 10px;
  text-align: center;
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  white-space: nowrap;
  pointer-events: none;
}
.dsh-thinking-style-language-option input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}
.dsh-thinking-style-language-option:has(input:checked) {
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  box-shadow: var(--dsw-elevation-soft);
}
.dsh-thinking-style-language-option:hover:not(:has(input:disabled)) {
  color: var(--dsw-alias-label-primary);
}
.dsh-thinking-style-language-option:has(input:focus-visible) {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
  outline-offset: 2px;
}
.dsh-thinking-style-language-option:has(input:disabled) { cursor: default; opacity: 0.55; }
.dsh-thinking-style-settings-message {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 13px;
  color: var(--dsw-alias-label-secondary);
}
@media (max-width: 960px) {
  .dsh-thinking-style-settings { grid-template-columns: minmax(0, 1fr); gap: 16px; padding: 20px; }
  .dsh-thinking-style-language-options { width: 100%; max-width: 360px; box-sizing: border-box; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-thinking-style-language-option { transition: none; }
}

/* ===== 4. Think reasoning row ===== */

/* Running sweep: a 300px pale band crossing the row, as in v0.0.1. */
[data-variant="think"][data-state="running"] [data-disclosure-row] {
  position: relative;
  overflow: hidden;
}

[data-variant="think"][data-state="running"] [data-disclosure-row]::after {
  content: '';
  position: absolute;
  inset-block: 0;
  left: 0;
  width: 300px;
  background: linear-gradient(90deg,
    transparent 0%,
    color-mix(in srgb, var(--dsw-alias-bg-base) 60%, transparent) 55%,
    transparent 100%);
  animation: dsh-thinking-style-reasoning-row-sweep 2.6s ease-out infinite;
  pointer-events: none;
}

@keyframes dsh-thinking-style-reasoning-row-sweep {
  0% { left: -300px; }
  90%, 100% { left: 100%; }
}

/* v0.0.1 Think text: 14px/24px at the tertiary label tier (summary + body). */
[data-variant="think"] span[class*="summary"] {
  font-size: 14px !important;
  line-height: 24px !important;
  color: var(--dsw-alias-label-tertiary);
}

[data-variant="think"] div[class*="thinkBody"],
[data-variant="think"] div[class*="thinkBody"] p,
[data-variant="think"] div[class*="thinkBody"] li {
  font-size: 14px;
  line-height: 24px;
  color: var(--dsw-alias-label-tertiary);
}

/* ===== Reduced motion: keep static end states, like v0.0.1 ===== */
@media (prefers-reduced-motion: reduce) {
  [data-chat-running] span[data-shimmer] > span:not([inert]) > span {
    background-position: 0 0;
    background-size: 100% 100%;
    animation: none;
  }

  [data-variant="think"][data-state="running"] [data-disclosure-row]::after {
    animation: none;
  }
}
`;
    return {
      inject: ['locale', 'configForms', 'slots'],
      apply(ctx) {
        const scope = ctx.configForms.get('dsh-thinking-style');
        const locale = ctx.locale;
        const lookup = locale.lookup;
        const ownedLookup = Object.prototype.hasOwnProperty.call(locale, 'lookup');
        let language;
        let removeCopy = () => {};
        let disposed = false;
        // The existing translation functions call lookup dynamically. Patch only
        // this service instance and these thinking keys; never its prototype.
        const selectedLookup = function (ns, key, chain) {
          const selected = ns === 'chat' && THINK_KEYS.has(key) && language !== 'auto'
            ? (language === 'zh' ? ['zh', 'en'] : ['en']) : chain;
          return lookup.call(this, ns, key, selected);
        };
        locale.lookup = selectedLookup;
        const adoptLanguage = () => {
          const selected = scope.getSnapshot().value?.language;
          const next = selected === 'en' || selected === 'zh' ? selected : 'auto';
          if (language === next) return;
          language = next;
          removeCopy();
          // Updating our own dictionary also refreshes mounted locale consumers.
          removeCopy = locale.register(SETTINGS_NS, {
            en: { ...SETTINGS_COPY.en, selected: SETTINGS_COPY.en[next] },
            zh: { ...SETTINGS_COPY.zh, selected: SETTINGS_COPY.zh[next] },
          });
        };
        adoptLanguage();
        const unsubscribe = scope.subscribe(adoptLanguage);
        function LanguageSettings({ t }) {
          const state = React.useSyncExternalStore(
            listener => scope.subscribe(listener), () => scope.getSnapshot(),
          );
          const [saving, setSaving] = React.useState(false);
          const [error, setError] = React.useState(false);
          const fieldId = React.useId();
          const disabled = saving || state.status !== 'ready' || !state.writable;
          const saveLanguage = async next => {
            setSaving(true); setError(false);
            try { setError(!await scope.set('language', next)); }
            catch { setError(true); }
            finally { setSaving(false); }
          };
          return h('section', { className: 'dsh-thinking-style-settings', 'aria-busy': saving },
            h('div', null,
              h('h4', { id: fieldId, className: 'dsh-thinking-style-settings-title' }, t('language')),
              h('p', { id: fieldId + '-hint', className: 'dsh-thinking-style-settings-description' }, t('description')),
            ),
            h('div', {
              className: 'dsh-thinking-style-language-options', role: 'radiogroup',
              'aria-labelledby': fieldId, 'aria-describedby': fieldId + '-hint',
            }, ...['auto', 'en', 'zh'].map(id => h('label', {
              key: id, className: 'dsh-thinking-style-language-option',
            },
              h('input', {
                type: 'radio', name: fieldId, value: id, disabled,
                checked: (state.value?.language ?? 'auto') === id,
                onChange: () => { void saveLanguage(id); },
              }),
              h('span', null, t(id)),
            ))),
            state.status === 'loading' ? h('p', { role: 'status', className: 'dsh-thinking-style-settings-message' }, t('loading')) : null,
            error ? h('p', { role: 'alert', className: 'dsh-thinking-style-settings-message' }, t('saveFailed')) : null,
          );
        }
        const removePage = ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
          name: 'plugins.bundle.config', key: '@blue-a11y/dsh-thinking-style', locale: SETTINGS_NS,
        }, LanguageSettings));
        const style = document.createElement('style');
        style.id = 'dsh-thinking-style-style';
        style.textContent = CSS;
        document.head.appendChild(style);
        const dispose = () => {
          if (disposed) return;
          disposed = true;
          unsubscribe();
          if (typeof removePage === 'function') removePage();
          if (locale.lookup === selectedLookup) {
            if (ownedLookup) locale.lookup = lookup;
            else delete locale.lookup;
          }
          removeCopy();
          style.remove();
        };
        if (ctx && typeof ctx.effect === 'function') {
          ctx.effect(() => dispose);
        }
        return dispose;
      },
    };
  },
});
