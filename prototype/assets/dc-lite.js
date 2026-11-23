/*
 * dc-lite.js: a tiny runtime for the TaniPintar static prototype.
 * Renders the <template id="dc-tpl"> markup using the Component class in
 * <script type="text/x-dc" id="dc-script">. Supports:
 *   {{path}} holes in text and attributes (dotted lookup only)
 *   <sc-for list="{{items}}" as="item">  (with {{$index}})
 *   <sc-if value="{{cond}}">
 *   on*="{{handler}}" event attributes (onClick, onChange, ...)
 *   this.setState() re-renders the page.
 */
(function () {
  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(patch) {
      const p = typeof patch === 'function' ? patch(this.state, this.props) : patch;
      this.state = Object.assign({}, this.state, p);
      if (this.__render) this.__render();
    }
    forceUpdate() { if (this.__render) this.__render(); }
  }
  window.DCLogic = DCLogic;

  const WHOLE = /^\s*\{\{([^}]+)\}\}\s*$/;
  const HOLE = /\{\{([^}]+)\}\}/g;
  const PROPS = { checked: 1, value: 1, disabled: 1, selected: 1 };

  function lookup(scope, path) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^'.*'$|^".*"$/.test(path)) return path.slice(1, -1);
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
  }
  function interp(str, scope) {
    return str.replace(HOLE, (_, p) => { const v = lookup(scope, p); return v == null ? '' : String(v); });
  }

  function build(node, scope, out) {
    if (node.nodeType === 3) { out.appendChild(document.createTextNode(interp(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    const tag = node.localName;
    if (tag === 'sc-for') {
      const m = (node.getAttribute('list') || '').match(WHOLE);
      const list = (m && lookup(scope, m[1])) || [];
      const as = node.getAttribute('as') || 'item';
      list.forEach((it, i) => {
        const s = Object.create(scope); s[as] = it; s.$index = i;
        node.childNodes.forEach((c) => build(c, s, out));
      });
      return;
    }
    if (tag === 'sc-if') {
      const m = (node.getAttribute('value') || '').match(WHOLE);
      if (m && lookup(scope, m[1])) node.childNodes.forEach((c) => build(c, scope, out));
      return;
    }
    const el = node.namespaceURI && node.namespaceURI !== 'http://www.w3.org/1999/xhtml'
      ? document.createElementNS(node.namespaceURI, node.localName)
      : document.createElement(node.localName);
    for (const a of Array.from(node.attributes)) {
      const name = a.name, val = a.value;
      if (name.startsWith('hint-')) continue;
      const whole = val.match(WHOLE);
      if (name.startsWith('on') && whole) {
        const fn = lookup(scope, whole[1]);
        if (typeof fn === 'function') el.addEventListener(name.slice(2).toLowerCase(), (e) => fn(e));
        continue;
      }
      if (whole) {
        const v = lookup(scope, whole[1]);
        if (PROPS[name]) { el[name] = name === 'value' ? (v == null ? '' : v) : !!v; continue; }
        if (name.startsWith('aria-')) { el.setAttribute(name, String(v)); continue; }
        if (v === false || v == null) continue;
        el.setAttribute(name, v === true ? '' : String(v));
        continue;
      }
      el.setAttribute(name, val.indexOf('{{') >= 0 ? interp(val, scope) : val);
    }
    const kids = node.localName === 'template' ? node.content.childNodes : node.childNodes;
    kids.forEach((c) => build(c, scope, el));
    out.appendChild(el);
  }

  document.addEventListener('submit', (e) => e.preventDefault());
  function boot() {
    const tpl = document.getElementById('dc-tpl');
    const src = document.getElementById('dc-script');
    const app = document.getElementById('app');
    const Component = new Function('DCLogic', src.textContent + '\nreturn Component;')(DCLogic);
    const inst = new Component({});
    inst.__render = function () {
      const frag = document.createDocumentFragment();
      const vals = inst.renderVals() || {};
      tpl.content.childNodes.forEach((c) => build(c, vals, frag));
      app.replaceChildren(frag);
    };
    inst.__render();
    if (inst.componentDidMount) inst.componentDidMount();
    if (location.hash) { const t = document.querySelector(location.hash); if (t) t.scrollIntoView(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
