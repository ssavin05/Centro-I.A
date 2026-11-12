import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import * as accountRules from '../../account-rules.js';

export const settle = () => new Promise(resolve => setImmediate(resolve));

// Import seam: run the real page controller with an isolated DOM and Auth adapter.
export function pageHarness(file, {search = '', hash = '', client = {}} = {}) {
  const nodes = new Map();
  function element(id) {
    if (!nodes.has(id)) {
      const attrs = new Map();
      nodes.set(id, {
        id, value: '', textContent: '', innerHTML: '', hidden: false,
        disabled: false, type: 'password', dataset: {}, listeners: {},
        classList: {toggle() {}},
        setAttribute(key, value) {attrs.set(key, String(value));},
        getAttribute(key) {return attrs.get(key) ?? null;},
        removeAttribute(key) {attrs.delete(key);},
        addEventListener(event, handler) {this.listeners[event] = handler;},
        focus() {document.activeElement = this;},
        reset() {},
      });
    }
    return nodes.get(id);
  }
  const form = element('auth-form');
  form.elements = {accountType: {value: 'user'}};
  form.querySelector = () => ({set checked(value) {if (value) form.elements.accountType.value = 'company';}});
  const document = {
    title: '', activeElement: null, body: {dataset: {}},
    getElementById: element,
    querySelectorAll: () => [],
    addEventListener() {},
  };
  const navigations = [];
  const location = {
    search, hash, href: 'https://example.test/Centro-I.A/auth.html' + search + hash,
    replace: url => navigations.push(url), assign: url => navigations.push(url),
  };
  let authCallback;
  const supabase = {
    ...client,
    auth: {
      getSession: async () => ({data: {session: null}, error: null}),
      onAuthStateChange: callback => {authCallback = callback;return {data: {subscription: {unsubscribe() {}}}};},
      ...client.auth,
    },
  };
  const code = readFileSync(file, 'utf8').replace(/^import .* from ['"].*['"];?\r?\n/gm, '');
  const window = {addEventListener() {}, removeEventListener() {}, confirm: () => true};
  runInNewContext(code, {...accountRules, supabase, document, location, window, URL, URLSearchParams,
    history: {replaceState() {}}, setTimeout, clearTimeout, console}, {filename: file});
  return {
    element, nodes, navigations, supabase,
    set(values) {for (const [id, value] of Object.entries(values)) element(id).value = value;},
    async submit(id = 'auth-form') {await settle();return element(id).listeners.submit({preventDefault() {}});},
    async click(id) {return element(id).listeners.click({preventDefault() {}});},
    authEvent(event, session) {return authCallback?.(event, session);},
  };
}
