import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8');

function mount(language = 'auto') {
  let plugin, value = { language }, revision = 0;
  const listeners = new Set(), slots = [];
  const dictionaries = { chat: {
    en: { 'chat.deepDiving': 'Deep diving', 'duration.secondUnit': 's', untouched: 'English original' },
    zh: { 'chat.deepDiving': '深度求索中', 'duration.secondUnit': '秒', untouched: '中文原文' },
  }};
  const locale = {
    lookup(ns, key, chain) { for (const id of chain) { const text = dictionaries[ns]?.[id]?.[key]; if (text !== undefined) return text; } },
    register(ns, dicts) { dictionaries[ns] = dicts; revision++; return () => { delete dictionaries[ns]; revision++; }; },
    bind(ns) { return key => locale.lookup(ns, key, ['zh', 'en']); },
  };
  const original = locale.lookup;
  const scope = {
    getSnapshot: () => ({ status:'ready', value, writable:true }),
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    async set(key, selected) { value = {...value, [key]: selected}; for (const fn of listeners) fn(); return true; },
  };
  const context = {
    locale, configForms: { get(id) { assert.equal(id, 'dsh-thinking-style'); return scope; } },
    slots: { inject(name, fn) { return fn(); }, register(options, component) { slots.push({ options, component }); return () => slots.splice(0); } },
    effect() {},
  };
  const sandbox = {
    window: { __ModuleLoader__: { load(module) { plugin = module.factory(id => { assert.equal(id, 'react'); return { createElement() {} }; }); } } },
    document: { createElement() { return { style:{}, remove() {} }; }, head: { appendChild() {} } },
    console,
  };
  vm.runInNewContext(source, sandbox);
  const dispose = plugin.apply(context);
  return { locale, original, scope, slots, dispose, revision: () => revision };
}

test('language preference changes thinking text and units without changing other chat text', async () => {
  const app = mount();
  assert.equal(app.locale.lookup('chat','chat.deepDiving',['zh','en']), '深度求索中');
  const revision = app.revision();
  await app.scope.set('language','en');
  assert.equal(app.locale.lookup('chat','chat.deepDiving',['zh','en']), 'Deep diving');
  assert.equal(app.locale.lookup('chat','duration.secondUnit',['zh','en']), 's');
  assert.equal(app.locale.lookup('chat','untouched',['zh','en']), '中文原文');
  assert.ok(app.revision() > revision);
  await app.scope.set('language','zh');
  assert.equal(app.locale.lookup('chat','chat.deepDiving',['en']), '深度求索中');
  await app.scope.set('language','auto');
  assert.equal(app.locale.lookup('chat','chat.deepDiving',['en']), 'Deep diving');
  app.dispose();
  assert.equal(app.locale.lookup, app.original);
});

test('saved language is adopted on startup and a configuration page is registered', () => {
  const app = mount('en');
  assert.equal(app.locale.lookup('chat','chat.deepDiving',['zh','en']), 'Deep diving');
  assert.ok(app.slots.some(slot => slot.options.name === 'plugins.bundle.config' && slot.options.key === '@blue-a11y/dsh-thinking-style'));
  app.dispose();
});
