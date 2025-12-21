import {
  r as d,
  j as e,
  S as Ya,
  c as Vs,
  a as Jt,
  b as ie,
  u as Qe,
  d as Ni,
  P as Pt,
  e as wi,
  f as Ue,
  g as Ka,
  h as Xt,
  A as ki,
  I as Ja,
  i as Ci,
  R as Si,
  F as Ei,
  D as Ai,
  k as Xa,
  C as Pi,
  l as Ti,
  m as Mi,
  n as Ls,
  o as Za,
  p as Ri,
  q as _i,
  s as Qa,
  t as ua,
  v as Os,
  w as gs,
  x as S,
  y as Ii,
  z as Di,
  B as Vi,
  L as Li,
  T as Oi,
  E as $i,
  G as Fi,
  H as zi,
  J as Ui,
  K as Bi,
  M as Hi,
  V as Gi,
  N as qi,
  O as Wi,
  Q as Yi,
  U as Ki,
  W as Ji,
  X as Xi,
  Y as Zi,
  Z as Qi,
  _ as eo,
  $ as to,
  a0 as so,
  a1 as ao,
  a2 as er,
  a3 as tr,
  a4 as ro,
  a5 as sr,
  a6 as ar,
  a7 as no,
  a8 as io,
  a9 as oo,
  aa as lo,
  ab as co,
  ac as mo,
  ad as uo,
  ae as xo,
} from "./vendor-radix-VtQUFPkj.js";
import { a as ho, r as po } from "./vendor-react-DDxydHEc.js";
import { c as rr } from "./vendor-charts-GDaLWVL_.js";
import {
  Contract as xa,
  BrowserProvider as fo,
} from "./vendor-ethers-D5ZThK8B.js";
(function () {
  const s = document.createElement("link").relList;
  if (s && s.supports && s.supports("modulepreload")) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) r(n);
  new MutationObserver((n) => {
    for (const o of n)
      if (o.type === "childList")
        for (const c of o.addedNodes)
          c.tagName === "LINK" && c.rel === "modulepreload" && r(c);
  }).observe(document, { childList: !0, subtree: !0 });
  function a(n) {
    const o = {};
    return (
      n.integrity && (o.integrity = n.integrity),
      n.referrerPolicy && (o.referrerPolicy = n.referrerPolicy),
      n.crossOrigin === "use-credentials"
        ? (o.credentials = "include")
        : n.crossOrigin === "anonymous"
        ? (o.credentials = "omit")
        : (o.credentials = "same-origin"),
      o
    );
  }
  function r(n) {
    if (n.ep) return;
    n.ep = !0;
    const o = a(n);
    fetch(n.href, o);
  }
})();
var Ot = {},
  ha;
function go() {
  if (ha) return Ot;
  ha = 1;
  var t = ho();
  return (Ot.createRoot = t.createRoot), (Ot.hydrateRoot = t.hydrateRoot), Ot;
}
var vo = go();
const pa = (t) => (typeof t == "boolean" ? `${t}` : t === 0 ? "0" : t),
  fa = rr,
  $s = (t, s) => (a) => {
    var r;
    if (s?.variants == null) return fa(t, a?.class, a?.className);
    const { variants: n, defaultVariants: o } = s,
      c = Object.keys(n).map((u) => {
        const p = a?.[u],
          i = o?.[u];
        if (p === null) return null;
        const x = pa(p) || pa(i);
        return n[u][x];
      }),
      l =
        a &&
        Object.entries(a).reduce((u, p) => {
          let [i, x] = p;
          return x === void 0 || (u[i] = x), u;
        }, {}),
      m =
        s == null || (r = s.compoundVariants) === null || r === void 0
          ? void 0
          : r.reduce((u, p) => {
              let { class: i, className: x, ...j } = p;
              return Object.entries(j).every((g) => {
                let [v, T] = g;
                return Array.isArray(T)
                  ? T.includes({ ...o, ...l }[v])
                  : { ...o, ...l }[v] === T;
              })
                ? [...u, i, x]
                : u;
            }, []);
    return fa(t, c, m, a?.class, a?.className);
  },
  jo = (t, s) => {
    const a = new Array(t.length + s.length);
    for (let r = 0; r < t.length; r++) a[r] = t[r];
    for (let r = 0; r < s.length; r++) a[t.length + r] = s[r];
    return a;
  },
  yo = (t, s) => ({ classGroupId: t, validator: s }),
  nr = (t = new Map(), s = null, a) => ({
    nextPart: t,
    validators: s,
    classGroupId: a,
  }),
  Bt = "-",
  ga = [],
  bo = "arbitrary..",
  No = (t) => {
    const s = ko(t),
      { conflictingClassGroups: a, conflictingClassGroupModifiers: r } = t;
    return {
      getClassGroupId: (c) => {
        if (c.startsWith("[") && c.endsWith("]")) return wo(c);
        const l = c.split(Bt),
          m = l[0] === "" && l.length > 1 ? 1 : 0;
        return ir(l, m, s);
      },
      getConflictingClassGroupIds: (c, l) => {
        if (l) {
          const m = r[c],
            u = a[c];
          return m ? (u ? jo(u, m) : m) : u || ga;
        }
        return a[c] || ga;
      },
    };
  },
  ir = (t, s, a) => {
    if (t.length - s === 0) return a.classGroupId;
    const n = t[s],
      o = a.nextPart.get(n);
    if (o) {
      const u = ir(t, s + 1, o);
      if (u) return u;
    }
    const c = a.validators;
    if (c === null) return;
    const l = s === 0 ? t.join(Bt) : t.slice(s).join(Bt),
      m = c.length;
    for (let u = 0; u < m; u++) {
      const p = c[u];
      if (p.validator(l)) return p.classGroupId;
    }
  },
  wo = (t) =>
    t.slice(1, -1).indexOf(":") === -1
      ? void 0
      : (() => {
          const s = t.slice(1, -1),
            a = s.indexOf(":"),
            r = s.slice(0, a);
          return r ? bo + r : void 0;
        })(),
  ko = (t) => {
    const { theme: s, classGroups: a } = t;
    return Co(a, s);
  },
  Co = (t, s) => {
    const a = nr();
    for (const r in t) {
      const n = t[r];
      Fs(n, a, r, s);
    }
    return a;
  },
  Fs = (t, s, a, r) => {
    const n = t.length;
    for (let o = 0; o < n; o++) {
      const c = t[o];
      So(c, s, a, r);
    }
  },
  So = (t, s, a, r) => {
    if (typeof t == "string") {
      Eo(t, s, a);
      return;
    }
    if (typeof t == "function") {
      Ao(t, s, a, r);
      return;
    }
    Po(t, s, a, r);
  },
  Eo = (t, s, a) => {
    const r = t === "" ? s : or(s, t);
    r.classGroupId = a;
  },
  Ao = (t, s, a, r) => {
    if (To(t)) {
      Fs(t(r), s, a, r);
      return;
    }
    s.validators === null && (s.validators = []), s.validators.push(yo(a, t));
  },
  Po = (t, s, a, r) => {
    const n = Object.entries(t),
      o = n.length;
    for (let c = 0; c < o; c++) {
      const [l, m] = n[c];
      Fs(m, or(s, l), a, r);
    }
  },
  or = (t, s) => {
    let a = t;
    const r = s.split(Bt),
      n = r.length;
    for (let o = 0; o < n; o++) {
      const c = r[o];
      let l = a.nextPart.get(c);
      l || ((l = nr()), a.nextPart.set(c, l)), (a = l);
    }
    return a;
  },
  To = (t) => "isThemeGetter" in t && t.isThemeGetter === !0,
  Mo = (t) => {
    if (t < 1) return { get: () => {}, set: () => {} };
    let s = 0,
      a = Object.create(null),
      r = Object.create(null);
    const n = (o, c) => {
      (a[o] = c), s++, s > t && ((s = 0), (r = a), (a = Object.create(null)));
    };
    return {
      get(o) {
        let c = a[o];
        if (c !== void 0) return c;
        if ((c = r[o]) !== void 0) return n(o, c), c;
      },
      set(o, c) {
        o in a ? (a[o] = c) : n(o, c);
      },
    };
  },
  vs = "!",
  va = ":",
  Ro = [],
  ja = (t, s, a, r, n) => ({
    modifiers: t,
    hasImportantModifier: s,
    baseClassName: a,
    maybePostfixModifierPosition: r,
    isExternal: n,
  }),
  _o = (t) => {
    const { prefix: s, experimentalParseClassName: a } = t;
    let r = (n) => {
      const o = [];
      let c = 0,
        l = 0,
        m = 0,
        u;
      const p = n.length;
      for (let v = 0; v < p; v++) {
        const T = n[v];
        if (c === 0 && l === 0) {
          if (T === va) {
            o.push(n.slice(m, v)), (m = v + 1);
            continue;
          }
          if (T === "/") {
            u = v;
            continue;
          }
        }
        T === "[" ? c++ : T === "]" ? c-- : T === "(" ? l++ : T === ")" && l--;
      }
      const i = o.length === 0 ? n : n.slice(m);
      let x = i,
        j = !1;
      i.endsWith(vs)
        ? ((x = i.slice(0, -1)), (j = !0))
        : i.startsWith(vs) && ((x = i.slice(1)), (j = !0));
      const g = u && u > m ? u - m : void 0;
      return ja(o, j, x, g);
    };
    if (s) {
      const n = s + va,
        o = r;
      r = (c) =>
        c.startsWith(n) ? o(c.slice(n.length)) : ja(Ro, !1, c, void 0, !0);
    }
    if (a) {
      const n = r;
      r = (o) => a({ className: o, parseClassName: n });
    }
    return r;
  },
  Io = (t) => {
    const s = new Map();
    return (
      t.orderSensitiveModifiers.forEach((a, r) => {
        s.set(a, 1e6 + r);
      }),
      (a) => {
        const r = [];
        let n = [];
        for (let o = 0; o < a.length; o++) {
          const c = a[o],
            l = c[0] === "[",
            m = s.has(c);
          l || m
            ? (n.length > 0 && (n.sort(), r.push(...n), (n = [])), r.push(c))
            : n.push(c);
        }
        return n.length > 0 && (n.sort(), r.push(...n)), r;
      }
    );
  },
  Do = (t) => ({
    cache: Mo(t.cacheSize),
    parseClassName: _o(t),
    sortModifiers: Io(t),
    ...No(t),
  }),
  Vo = /\s+/,
  Lo = (t, s) => {
    const {
        parseClassName: a,
        getClassGroupId: r,
        getConflictingClassGroupIds: n,
        sortModifiers: o,
      } = s,
      c = [],
      l = t.trim().split(Vo);
    let m = "";
    for (let u = l.length - 1; u >= 0; u -= 1) {
      const p = l[u],
        {
          isExternal: i,
          modifiers: x,
          hasImportantModifier: j,
          baseClassName: g,
          maybePostfixModifierPosition: v,
        } = a(p);
      if (i) {
        m = p + (m.length > 0 ? " " + m : m);
        continue;
      }
      let T = !!v,
        y = r(T ? g.substring(0, v) : g);
      if (!y) {
        if (!T) {
          m = p + (m.length > 0 ? " " + m : m);
          continue;
        }
        if (((y = r(g)), !y)) {
          m = p + (m.length > 0 ? " " + m : m);
          continue;
        }
        T = !1;
      }
      const E = x.length === 0 ? "" : x.length === 1 ? x[0] : o(x).join(":"),
        R = j ? E + vs : E,
        F = R + y;
      if (c.indexOf(F) > -1) continue;
      c.push(F);
      const f = n(y, T);
      for (let B = 0; B < f.length; ++B) {
        const oe = f[B];
        c.push(R + oe);
      }
      m = p + (m.length > 0 ? " " + m : m);
    }
    return m;
  },
  Oo = (...t) => {
    let s = 0,
      a,
      r,
      n = "";
    for (; s < t.length; )
      (a = t[s++]) && (r = lr(a)) && (n && (n += " "), (n += r));
    return n;
  },
  lr = (t) => {
    if (typeof t == "string") return t;
    let s,
      a = "";
    for (let r = 0; r < t.length; r++)
      t[r] && (s = lr(t[r])) && (a && (a += " "), (a += s));
    return a;
  },
  $o = (t, ...s) => {
    let a, r, n, o;
    const c = (m) => {
        const u = s.reduce((p, i) => i(p), t());
        return (a = Do(u)), (r = a.cache.get), (n = a.cache.set), (o = l), l(m);
      },
      l = (m) => {
        const u = r(m);
        if (u) return u;
        const p = Lo(m, a);
        return n(m, p), p;
      };
    return (o = c), (...m) => o(Oo(...m));
  },
  Fo = [],
  me = (t) => {
    const s = (a) => a[t] || Fo;
    return (s.isThemeGetter = !0), s;
  },
  cr = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  dr = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  zo = /^\d+\/\d+$/,
  Uo = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  Bo =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  Ho = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  Go = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  qo =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  xt = (t) => zo.test(t),
  Y = (t) => !!t && !Number.isNaN(Number(t)),
  Je = (t) => !!t && Number.isInteger(Number(t)),
  ds = (t) => t.endsWith("%") && Y(t.slice(0, -1)),
  qe = (t) => Uo.test(t),
  Wo = () => !0,
  Yo = (t) => Bo.test(t) && !Ho.test(t),
  mr = () => !1,
  Ko = (t) => Go.test(t),
  Jo = (t) => qo.test(t),
  Xo = (t) => !_(t) && !I(t),
  Zo = (t) => jt(t, hr, mr),
  _ = (t) => cr.test(t),
  tt = (t) => jt(t, pr, Yo),
  ms = (t) => jt(t, al, Y),
  ya = (t) => jt(t, ur, mr),
  Qo = (t) => jt(t, xr, Jo),
  $t = (t) => jt(t, fr, Ko),
  I = (t) => dr.test(t),
  Nt = (t) => yt(t, pr),
  el = (t) => yt(t, rl),
  ba = (t) => yt(t, ur),
  tl = (t) => yt(t, hr),
  sl = (t) => yt(t, xr),
  Ft = (t) => yt(t, fr, !0),
  jt = (t, s, a) => {
    const r = cr.exec(t);
    return r ? (r[1] ? s(r[1]) : a(r[2])) : !1;
  },
  yt = (t, s, a = !1) => {
    const r = dr.exec(t);
    return r ? (r[1] ? s(r[1]) : a) : !1;
  },
  ur = (t) => t === "position" || t === "percentage",
  xr = (t) => t === "image" || t === "url",
  hr = (t) => t === "length" || t === "size" || t === "bg-size",
  pr = (t) => t === "length",
  al = (t) => t === "number",
  rl = (t) => t === "family-name",
  fr = (t) => t === "shadow",
  nl = () => {
    const t = me("color"),
      s = me("font"),
      a = me("text"),
      r = me("font-weight"),
      n = me("tracking"),
      o = me("leading"),
      c = me("breakpoint"),
      l = me("container"),
      m = me("spacing"),
      u = me("radius"),
      p = me("shadow"),
      i = me("inset-shadow"),
      x = me("text-shadow"),
      j = me("drop-shadow"),
      g = me("blur"),
      v = me("perspective"),
      T = me("aspect"),
      y = me("ease"),
      E = me("animate"),
      R = () => [
        "auto",
        "avoid",
        "all",
        "avoid-page",
        "page",
        "left",
        "right",
        "column",
      ],
      F = () => [
        "center",
        "top",
        "bottom",
        "left",
        "right",
        "top-left",
        "left-top",
        "top-right",
        "right-top",
        "bottom-right",
        "right-bottom",
        "bottom-left",
        "left-bottom",
      ],
      f = () => [...F(), I, _],
      B = () => ["auto", "hidden", "clip", "visible", "scroll"],
      oe = () => ["auto", "contain", "none"],
      C = () => [I, _, m],
      L = () => [xt, "full", "auto", ...C()],
      H = () => [Je, "none", "subgrid", I, _],
      ne = () => ["auto", { span: ["full", Je, I, _] }, Je, I, _],
      X = () => [Je, "auto", I, _],
      Z = () => ["auto", "min", "max", "fr", I, _],
      ee = () => [
        "start",
        "end",
        "center",
        "between",
        "around",
        "evenly",
        "stretch",
        "baseline",
        "center-safe",
        "end-safe",
      ],
      le = () => [
        "start",
        "end",
        "center",
        "stretch",
        "center-safe",
        "end-safe",
      ],
      $ = () => ["auto", ...C()],
      te = () => [
        xt,
        "auto",
        "full",
        "dvw",
        "dvh",
        "lvw",
        "lvh",
        "svw",
        "svh",
        "min",
        "max",
        "fit",
        ...C(),
      ],
      h = () => [t, I, _],
      k = () => [...F(), ba, ya, { position: [I, _] }],
      G = () => ["no-repeat", { repeat: ["", "x", "y", "space", "round"] }],
      re = () => ["auto", "cover", "contain", tl, Zo, { size: [I, _] }],
      ue = () => [ds, Nt, tt],
      D = () => ["", "none", "full", u, I, _],
      q = () => ["", Y, Nt, tt],
      se = () => ["solid", "dashed", "dotted", "double"],
      ce = () => [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion",
        "hue",
        "saturation",
        "color",
        "luminosity",
      ],
      z = () => [Y, ds, ba, ya],
      ae = () => ["", "none", g, I, _],
      Me = () => ["none", Y, I, _],
      He = () => ["none", Y, I, _],
      Ye = () => [Y, I, _],
      Re = () => [xt, "full", ...C()];
    return {
      cacheSize: 500,
      theme: {
        animate: ["spin", "ping", "pulse", "bounce"],
        aspect: ["video"],
        blur: [qe],
        breakpoint: [qe],
        color: [Wo],
        container: [qe],
        "drop-shadow": [qe],
        ease: ["in", "out", "in-out"],
        font: [Xo],
        "font-weight": [
          "thin",
          "extralight",
          "light",
          "normal",
          "medium",
          "semibold",
          "bold",
          "extrabold",
          "black",
        ],
        "inset-shadow": [qe],
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
        perspective: [
          "dramatic",
          "near",
          "normal",
          "midrange",
          "distant",
          "none",
        ],
        radius: [qe],
        shadow: [qe],
        spacing: ["px", Y],
        text: [qe],
        "text-shadow": [qe],
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"],
      },
      classGroups: {
        aspect: [{ aspect: ["auto", "square", xt, _, I, T] }],
        container: ["container"],
        columns: [{ columns: [Y, _, I, l] }],
        "break-after": [{ "break-after": R() }],
        "break-before": [{ "break-before": R() }],
        "break-inside": [
          { "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] },
        ],
        "box-decoration": [{ "box-decoration": ["slice", "clone"] }],
        box: [{ box: ["border", "content"] }],
        display: [
          "block",
          "inline-block",
          "inline",
          "flex",
          "inline-flex",
          "table",
          "inline-table",
          "table-caption",
          "table-cell",
          "table-column",
          "table-column-group",
          "table-footer-group",
          "table-header-group",
          "table-row-group",
          "table-row",
          "flow-root",
          "grid",
          "inline-grid",
          "contents",
          "list-item",
          "hidden",
        ],
        sr: ["sr-only", "not-sr-only"],
        float: [{ float: ["right", "left", "none", "start", "end"] }],
        clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }],
        isolation: ["isolate", "isolation-auto"],
        "object-fit": [
          { object: ["contain", "cover", "fill", "none", "scale-down"] },
        ],
        "object-position": [{ object: f() }],
        overflow: [{ overflow: B() }],
        "overflow-x": [{ "overflow-x": B() }],
        "overflow-y": [{ "overflow-y": B() }],
        overscroll: [{ overscroll: oe() }],
        "overscroll-x": [{ "overscroll-x": oe() }],
        "overscroll-y": [{ "overscroll-y": oe() }],
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        inset: [{ inset: L() }],
        "inset-x": [{ "inset-x": L() }],
        "inset-y": [{ "inset-y": L() }],
        start: [{ start: L() }],
        end: [{ end: L() }],
        top: [{ top: L() }],
        right: [{ right: L() }],
        bottom: [{ bottom: L() }],
        left: [{ left: L() }],
        visibility: ["visible", "invisible", "collapse"],
        z: [{ z: [Je, "auto", I, _] }],
        basis: [{ basis: [xt, "full", "auto", l, ...C()] }],
        "flex-direction": [
          { flex: ["row", "row-reverse", "col", "col-reverse"] },
        ],
        "flex-wrap": [{ flex: ["nowrap", "wrap", "wrap-reverse"] }],
        flex: [{ flex: [Y, xt, "auto", "initial", "none", _] }],
        grow: [{ grow: ["", Y, I, _] }],
        shrink: [{ shrink: ["", Y, I, _] }],
        order: [{ order: [Je, "first", "last", "none", I, _] }],
        "grid-cols": [{ "grid-cols": H() }],
        "col-start-end": [{ col: ne() }],
        "col-start": [{ "col-start": X() }],
        "col-end": [{ "col-end": X() }],
        "grid-rows": [{ "grid-rows": H() }],
        "row-start-end": [{ row: ne() }],
        "row-start": [{ "row-start": X() }],
        "row-end": [{ "row-end": X() }],
        "grid-flow": [
          { "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] },
        ],
        "auto-cols": [{ "auto-cols": Z() }],
        "auto-rows": [{ "auto-rows": Z() }],
        gap: [{ gap: C() }],
        "gap-x": [{ "gap-x": C() }],
        "gap-y": [{ "gap-y": C() }],
        "justify-content": [{ justify: [...ee(), "normal"] }],
        "justify-items": [{ "justify-items": [...le(), "normal"] }],
        "justify-self": [{ "justify-self": ["auto", ...le()] }],
        "align-content": [{ content: ["normal", ...ee()] }],
        "align-items": [{ items: [...le(), { baseline: ["", "last"] }] }],
        "align-self": [{ self: ["auto", ...le(), { baseline: ["", "last"] }] }],
        "place-content": [{ "place-content": ee() }],
        "place-items": [{ "place-items": [...le(), "baseline"] }],
        "place-self": [{ "place-self": ["auto", ...le()] }],
        p: [{ p: C() }],
        px: [{ px: C() }],
        py: [{ py: C() }],
        ps: [{ ps: C() }],
        pe: [{ pe: C() }],
        pt: [{ pt: C() }],
        pr: [{ pr: C() }],
        pb: [{ pb: C() }],
        pl: [{ pl: C() }],
        m: [{ m: $() }],
        mx: [{ mx: $() }],
        my: [{ my: $() }],
        ms: [{ ms: $() }],
        me: [{ me: $() }],
        mt: [{ mt: $() }],
        mr: [{ mr: $() }],
        mb: [{ mb: $() }],
        ml: [{ ml: $() }],
        "space-x": [{ "space-x": C() }],
        "space-x-reverse": ["space-x-reverse"],
        "space-y": [{ "space-y": C() }],
        "space-y-reverse": ["space-y-reverse"],
        size: [{ size: te() }],
        w: [{ w: [l, "screen", ...te()] }],
        "min-w": [{ "min-w": [l, "screen", "none", ...te()] }],
        "max-w": [
          { "max-w": [l, "screen", "none", "prose", { screen: [c] }, ...te()] },
        ],
        h: [{ h: ["screen", "lh", ...te()] }],
        "min-h": [{ "min-h": ["screen", "lh", "none", ...te()] }],
        "max-h": [{ "max-h": ["screen", "lh", ...te()] }],
        "font-size": [{ text: ["base", a, Nt, tt] }],
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        "font-style": ["italic", "not-italic"],
        "font-weight": [{ font: [r, I, ms] }],
        "font-stretch": [
          {
            "font-stretch": [
              "ultra-condensed",
              "extra-condensed",
              "condensed",
              "semi-condensed",
              "normal",
              "semi-expanded",
              "expanded",
              "extra-expanded",
              "ultra-expanded",
              ds,
              _,
            ],
          },
        ],
        "font-family": [{ font: [el, _, s] }],
        "fvn-normal": ["normal-nums"],
        "fvn-ordinal": ["ordinal"],
        "fvn-slashed-zero": ["slashed-zero"],
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
        tracking: [{ tracking: [n, I, _] }],
        "line-clamp": [{ "line-clamp": [Y, "none", I, ms] }],
        leading: [{ leading: [o, ...C()] }],
        "list-image": [{ "list-image": ["none", I, _] }],
        "list-style-position": [{ list: ["inside", "outside"] }],
        "list-style-type": [{ list: ["disc", "decimal", "none", I, _] }],
        "text-alignment": [
          { text: ["left", "center", "right", "justify", "start", "end"] },
        ],
        "placeholder-color": [{ placeholder: h() }],
        "text-color": [{ text: h() }],
        "text-decoration": [
          "underline",
          "overline",
          "line-through",
          "no-underline",
        ],
        "text-decoration-style": [{ decoration: [...se(), "wavy"] }],
        "text-decoration-thickness": [
          { decoration: [Y, "from-font", "auto", I, tt] },
        ],
        "text-decoration-color": [{ decoration: h() }],
        "underline-offset": [{ "underline-offset": [Y, "auto", I, _] }],
        "text-transform": [
          "uppercase",
          "lowercase",
          "capitalize",
          "normal-case",
        ],
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }],
        indent: [{ indent: C() }],
        "vertical-align": [
          {
            align: [
              "baseline",
              "top",
              "middle",
              "bottom",
              "text-top",
              "text-bottom",
              "sub",
              "super",
              I,
              _,
            ],
          },
        ],
        whitespace: [
          {
            whitespace: [
              "normal",
              "nowrap",
              "pre",
              "pre-line",
              "pre-wrap",
              "break-spaces",
            ],
          },
        ],
        break: [{ break: ["normal", "words", "all", "keep"] }],
        wrap: [{ wrap: ["break-word", "anywhere", "normal"] }],
        hyphens: [{ hyphens: ["none", "manual", "auto"] }],
        content: [{ content: ["none", I, _] }],
        "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
        "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
        "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
        "bg-position": [{ bg: k() }],
        "bg-repeat": [{ bg: G() }],
        "bg-size": [{ bg: re() }],
        "bg-image": [
          {
            bg: [
              "none",
              {
                linear: [
                  { to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"] },
                  Je,
                  I,
                  _,
                ],
                radial: ["", I, _],
                conic: [Je, I, _],
              },
              sl,
              Qo,
            ],
          },
        ],
        "bg-color": [{ bg: h() }],
        "gradient-from-pos": [{ from: ue() }],
        "gradient-via-pos": [{ via: ue() }],
        "gradient-to-pos": [{ to: ue() }],
        "gradient-from": [{ from: h() }],
        "gradient-via": [{ via: h() }],
        "gradient-to": [{ to: h() }],
        rounded: [{ rounded: D() }],
        "rounded-s": [{ "rounded-s": D() }],
        "rounded-e": [{ "rounded-e": D() }],
        "rounded-t": [{ "rounded-t": D() }],
        "rounded-r": [{ "rounded-r": D() }],
        "rounded-b": [{ "rounded-b": D() }],
        "rounded-l": [{ "rounded-l": D() }],
        "rounded-ss": [{ "rounded-ss": D() }],
        "rounded-se": [{ "rounded-se": D() }],
        "rounded-ee": [{ "rounded-ee": D() }],
        "rounded-es": [{ "rounded-es": D() }],
        "rounded-tl": [{ "rounded-tl": D() }],
        "rounded-tr": [{ "rounded-tr": D() }],
        "rounded-br": [{ "rounded-br": D() }],
        "rounded-bl": [{ "rounded-bl": D() }],
        "border-w": [{ border: q() }],
        "border-w-x": [{ "border-x": q() }],
        "border-w-y": [{ "border-y": q() }],
        "border-w-s": [{ "border-s": q() }],
        "border-w-e": [{ "border-e": q() }],
        "border-w-t": [{ "border-t": q() }],
        "border-w-r": [{ "border-r": q() }],
        "border-w-b": [{ "border-b": q() }],
        "border-w-l": [{ "border-l": q() }],
        "divide-x": [{ "divide-x": q() }],
        "divide-x-reverse": ["divide-x-reverse"],
        "divide-y": [{ "divide-y": q() }],
        "divide-y-reverse": ["divide-y-reverse"],
        "border-style": [{ border: [...se(), "hidden", "none"] }],
        "divide-style": [{ divide: [...se(), "hidden", "none"] }],
        "border-color": [{ border: h() }],
        "border-color-x": [{ "border-x": h() }],
        "border-color-y": [{ "border-y": h() }],
        "border-color-s": [{ "border-s": h() }],
        "border-color-e": [{ "border-e": h() }],
        "border-color-t": [{ "border-t": h() }],
        "border-color-r": [{ "border-r": h() }],
        "border-color-b": [{ "border-b": h() }],
        "border-color-l": [{ "border-l": h() }],
        "divide-color": [{ divide: h() }],
        "outline-style": [{ outline: [...se(), "none", "hidden"] }],
        "outline-offset": [{ "outline-offset": [Y, I, _] }],
        "outline-w": [{ outline: ["", Y, Nt, tt] }],
        "outline-color": [{ outline: h() }],
        shadow: [{ shadow: ["", "none", p, Ft, $t] }],
        "shadow-color": [{ shadow: h() }],
        "inset-shadow": [{ "inset-shadow": ["none", i, Ft, $t] }],
        "inset-shadow-color": [{ "inset-shadow": h() }],
        "ring-w": [{ ring: q() }],
        "ring-w-inset": ["ring-inset"],
        "ring-color": [{ ring: h() }],
        "ring-offset-w": [{ "ring-offset": [Y, tt] }],
        "ring-offset-color": [{ "ring-offset": h() }],
        "inset-ring-w": [{ "inset-ring": q() }],
        "inset-ring-color": [{ "inset-ring": h() }],
        "text-shadow": [{ "text-shadow": ["none", x, Ft, $t] }],
        "text-shadow-color": [{ "text-shadow": h() }],
        opacity: [{ opacity: [Y, I, _] }],
        "mix-blend": [
          { "mix-blend": [...ce(), "plus-darker", "plus-lighter"] },
        ],
        "bg-blend": [{ "bg-blend": ce() }],
        "mask-clip": [
          {
            "mask-clip": [
              "border",
              "padding",
              "content",
              "fill",
              "stroke",
              "view",
            ],
          },
          "mask-no-clip",
        ],
        "mask-composite": [
          { mask: ["add", "subtract", "intersect", "exclude"] },
        ],
        "mask-image-linear-pos": [{ "mask-linear": [Y] }],
        "mask-image-linear-from-pos": [{ "mask-linear-from": z() }],
        "mask-image-linear-to-pos": [{ "mask-linear-to": z() }],
        "mask-image-linear-from-color": [{ "mask-linear-from": h() }],
        "mask-image-linear-to-color": [{ "mask-linear-to": h() }],
        "mask-image-t-from-pos": [{ "mask-t-from": z() }],
        "mask-image-t-to-pos": [{ "mask-t-to": z() }],
        "mask-image-t-from-color": [{ "mask-t-from": h() }],
        "mask-image-t-to-color": [{ "mask-t-to": h() }],
        "mask-image-r-from-pos": [{ "mask-r-from": z() }],
        "mask-image-r-to-pos": [{ "mask-r-to": z() }],
        "mask-image-r-from-color": [{ "mask-r-from": h() }],
        "mask-image-r-to-color": [{ "mask-r-to": h() }],
        "mask-image-b-from-pos": [{ "mask-b-from": z() }],
        "mask-image-b-to-pos": [{ "mask-b-to": z() }],
        "mask-image-b-from-color": [{ "mask-b-from": h() }],
        "mask-image-b-to-color": [{ "mask-b-to": h() }],
        "mask-image-l-from-pos": [{ "mask-l-from": z() }],
        "mask-image-l-to-pos": [{ "mask-l-to": z() }],
        "mask-image-l-from-color": [{ "mask-l-from": h() }],
        "mask-image-l-to-color": [{ "mask-l-to": h() }],
        "mask-image-x-from-pos": [{ "mask-x-from": z() }],
        "mask-image-x-to-pos": [{ "mask-x-to": z() }],
        "mask-image-x-from-color": [{ "mask-x-from": h() }],
        "mask-image-x-to-color": [{ "mask-x-to": h() }],
        "mask-image-y-from-pos": [{ "mask-y-from": z() }],
        "mask-image-y-to-pos": [{ "mask-y-to": z() }],
        "mask-image-y-from-color": [{ "mask-y-from": h() }],
        "mask-image-y-to-color": [{ "mask-y-to": h() }],
        "mask-image-radial": [{ "mask-radial": [I, _] }],
        "mask-image-radial-from-pos": [{ "mask-radial-from": z() }],
        "mask-image-radial-to-pos": [{ "mask-radial-to": z() }],
        "mask-image-radial-from-color": [{ "mask-radial-from": h() }],
        "mask-image-radial-to-color": [{ "mask-radial-to": h() }],
        "mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
        "mask-image-radial-size": [
          {
            "mask-radial": [
              { closest: ["side", "corner"], farthest: ["side", "corner"] },
            ],
          },
        ],
        "mask-image-radial-pos": [{ "mask-radial-at": F() }],
        "mask-image-conic-pos": [{ "mask-conic": [Y] }],
        "mask-image-conic-from-pos": [{ "mask-conic-from": z() }],
        "mask-image-conic-to-pos": [{ "mask-conic-to": z() }],
        "mask-image-conic-from-color": [{ "mask-conic-from": h() }],
        "mask-image-conic-to-color": [{ "mask-conic-to": h() }],
        "mask-mode": [{ mask: ["alpha", "luminance", "match"] }],
        "mask-origin": [
          {
            "mask-origin": [
              "border",
              "padding",
              "content",
              "fill",
              "stroke",
              "view",
            ],
          },
        ],
        "mask-position": [{ mask: k() }],
        "mask-repeat": [{ mask: G() }],
        "mask-size": [{ mask: re() }],
        "mask-type": [{ "mask-type": ["alpha", "luminance"] }],
        "mask-image": [{ mask: ["none", I, _] }],
        filter: [{ filter: ["", "none", I, _] }],
        blur: [{ blur: ae() }],
        brightness: [{ brightness: [Y, I, _] }],
        contrast: [{ contrast: [Y, I, _] }],
        "drop-shadow": [{ "drop-shadow": ["", "none", j, Ft, $t] }],
        "drop-shadow-color": [{ "drop-shadow": h() }],
        grayscale: [{ grayscale: ["", Y, I, _] }],
        "hue-rotate": [{ "hue-rotate": [Y, I, _] }],
        invert: [{ invert: ["", Y, I, _] }],
        saturate: [{ saturate: [Y, I, _] }],
        sepia: [{ sepia: ["", Y, I, _] }],
        "backdrop-filter": [{ "backdrop-filter": ["", "none", I, _] }],
        "backdrop-blur": [{ "backdrop-blur": ae() }],
        "backdrop-brightness": [{ "backdrop-brightness": [Y, I, _] }],
        "backdrop-contrast": [{ "backdrop-contrast": [Y, I, _] }],
        "backdrop-grayscale": [{ "backdrop-grayscale": ["", Y, I, _] }],
        "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [Y, I, _] }],
        "backdrop-invert": [{ "backdrop-invert": ["", Y, I, _] }],
        "backdrop-opacity": [{ "backdrop-opacity": [Y, I, _] }],
        "backdrop-saturate": [{ "backdrop-saturate": [Y, I, _] }],
        "backdrop-sepia": [{ "backdrop-sepia": ["", Y, I, _] }],
        "border-collapse": [{ border: ["collapse", "separate"] }],
        "border-spacing": [{ "border-spacing": C() }],
        "border-spacing-x": [{ "border-spacing-x": C() }],
        "border-spacing-y": [{ "border-spacing-y": C() }],
        "table-layout": [{ table: ["auto", "fixed"] }],
        caption: [{ caption: ["top", "bottom"] }],
        transition: [
          {
            transition: [
              "",
              "all",
              "colors",
              "opacity",
              "shadow",
              "transform",
              "none",
              I,
              _,
            ],
          },
        ],
        "transition-behavior": [{ transition: ["normal", "discrete"] }],
        duration: [{ duration: [Y, "initial", I, _] }],
        ease: [{ ease: ["linear", "initial", y, I, _] }],
        delay: [{ delay: [Y, I, _] }],
        animate: [{ animate: ["none", E, I, _] }],
        backface: [{ backface: ["hidden", "visible"] }],
        perspective: [{ perspective: [v, I, _] }],
        "perspective-origin": [{ "perspective-origin": f() }],
        rotate: [{ rotate: Me() }],
        "rotate-x": [{ "rotate-x": Me() }],
        "rotate-y": [{ "rotate-y": Me() }],
        "rotate-z": [{ "rotate-z": Me() }],
        scale: [{ scale: He() }],
        "scale-x": [{ "scale-x": He() }],
        "scale-y": [{ "scale-y": He() }],
        "scale-z": [{ "scale-z": He() }],
        "scale-3d": ["scale-3d"],
        skew: [{ skew: Ye() }],
        "skew-x": [{ "skew-x": Ye() }],
        "skew-y": [{ "skew-y": Ye() }],
        transform: [{ transform: [I, _, "", "none", "gpu", "cpu"] }],
        "transform-origin": [{ origin: f() }],
        "transform-style": [{ transform: ["3d", "flat"] }],
        translate: [{ translate: Re() }],
        "translate-x": [{ "translate-x": Re() }],
        "translate-y": [{ "translate-y": Re() }],
        "translate-z": [{ "translate-z": Re() }],
        "translate-none": ["translate-none"],
        accent: [{ accent: h() }],
        appearance: [{ appearance: ["none", "auto"] }],
        "caret-color": [{ caret: h() }],
        "color-scheme": [
          {
            scheme: [
              "normal",
              "dark",
              "light",
              "light-dark",
              "only-dark",
              "only-light",
            ],
          },
        ],
        cursor: [
          {
            cursor: [
              "auto",
              "default",
              "pointer",
              "wait",
              "text",
              "move",
              "help",
              "not-allowed",
              "none",
              "context-menu",
              "progress",
              "cell",
              "crosshair",
              "vertical-text",
              "alias",
              "copy",
              "no-drop",
              "grab",
              "grabbing",
              "all-scroll",
              "col-resize",
              "row-resize",
              "n-resize",
              "e-resize",
              "s-resize",
              "w-resize",
              "ne-resize",
              "nw-resize",
              "se-resize",
              "sw-resize",
              "ew-resize",
              "ns-resize",
              "nesw-resize",
              "nwse-resize",
              "zoom-in",
              "zoom-out",
              I,
              _,
            ],
          },
        ],
        "field-sizing": [{ "field-sizing": ["fixed", "content"] }],
        "pointer-events": [{ "pointer-events": ["auto", "none"] }],
        resize: [{ resize: ["none", "", "y", "x"] }],
        "scroll-behavior": [{ scroll: ["auto", "smooth"] }],
        "scroll-m": [{ "scroll-m": C() }],
        "scroll-mx": [{ "scroll-mx": C() }],
        "scroll-my": [{ "scroll-my": C() }],
        "scroll-ms": [{ "scroll-ms": C() }],
        "scroll-me": [{ "scroll-me": C() }],
        "scroll-mt": [{ "scroll-mt": C() }],
        "scroll-mr": [{ "scroll-mr": C() }],
        "scroll-mb": [{ "scroll-mb": C() }],
        "scroll-ml": [{ "scroll-ml": C() }],
        "scroll-p": [{ "scroll-p": C() }],
        "scroll-px": [{ "scroll-px": C() }],
        "scroll-py": [{ "scroll-py": C() }],
        "scroll-ps": [{ "scroll-ps": C() }],
        "scroll-pe": [{ "scroll-pe": C() }],
        "scroll-pt": [{ "scroll-pt": C() }],
        "scroll-pr": [{ "scroll-pr": C() }],
        "scroll-pb": [{ "scroll-pb": C() }],
        "scroll-pl": [{ "scroll-pl": C() }],
        "snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
        "snap-stop": [{ snap: ["normal", "always"] }],
        "snap-type": [{ snap: ["none", "x", "y", "both"] }],
        "snap-strictness": [{ snap: ["mandatory", "proximity"] }],
        touch: [{ touch: ["auto", "none", "manipulation"] }],
        "touch-x": [{ "touch-pan": ["x", "left", "right"] }],
        "touch-y": [{ "touch-pan": ["y", "up", "down"] }],
        "touch-pz": ["touch-pinch-zoom"],
        select: [{ select: ["none", "text", "all", "auto"] }],
        "will-change": [
          { "will-change": ["auto", "scroll", "contents", "transform", I, _] },
        ],
        fill: [{ fill: ["none", ...h()] }],
        "stroke-w": [{ stroke: [Y, Nt, tt, ms] }],
        stroke: [{ stroke: ["none", ...h()] }],
        "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }],
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: [
          "inset-x",
          "inset-y",
          "start",
          "end",
          "top",
          "right",
          "bottom",
          "left",
        ],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": [
          "fvn-ordinal",
          "fvn-slashed-zero",
          "fvn-figure",
          "fvn-spacing",
          "fvn-fraction",
        ],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: [
          "rounded-s",
          "rounded-e",
          "rounded-t",
          "rounded-r",
          "rounded-b",
          "rounded-l",
          "rounded-ss",
          "rounded-se",
          "rounded-ee",
          "rounded-es",
          "rounded-tl",
          "rounded-tr",
          "rounded-br",
          "rounded-bl",
        ],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": [
          "border-w-x",
          "border-w-y",
          "border-w-s",
          "border-w-e",
          "border-w-t",
          "border-w-r",
          "border-w-b",
          "border-w-l",
        ],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": [
          "border-color-x",
          "border-color-y",
          "border-color-s",
          "border-color-e",
          "border-color-t",
          "border-color-r",
          "border-color-b",
          "border-color-l",
        ],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        translate: ["translate-x", "translate-y", "translate-none"],
        "translate-none": [
          "translate",
          "translate-x",
          "translate-y",
          "translate-z",
        ],
        "scroll-m": [
          "scroll-mx",
          "scroll-my",
          "scroll-ms",
          "scroll-me",
          "scroll-mt",
          "scroll-mr",
          "scroll-mb",
          "scroll-ml",
        ],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": [
          "scroll-px",
          "scroll-py",
          "scroll-ps",
          "scroll-pe",
          "scroll-pt",
          "scroll-pr",
          "scroll-pb",
          "scroll-pl",
        ],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"],
      },
      conflictingClassGroupModifiers: { "font-size": ["leading"] },
      orderSensitiveModifiers: [
        "*",
        "**",
        "after",
        "backdrop",
        "before",
        "details-content",
        "file",
        "first-letter",
        "first-line",
        "marker",
        "placeholder",
        "selection",
      ],
    };
  },
  il = $o(nl);
function O(...t) {
  return il(rr(t));
}
const ol = $s(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
      variants: {
        variant: {
          default: "bg-primary text-primary-foreground hover:bg-primary/90",
          destructive:
            "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
          outline:
            "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
          secondary:
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost:
            "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
          link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
          default: "h-9 px-4 py-2 has-[>svg]:px-3",
          sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
          lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
          icon: "size-9 rounded-md",
        },
      },
      defaultVariants: { variant: "default", size: "default" },
    }
  ),
  b = d.forwardRef(
    ({ className: t, variant: s, size: a, asChild: r = !1, ...n }, o) => {
      const c = r ? Ya : "button";
      return e.jsx(c, {
        ref: o,
        "data-slot": "button",
        className: O(ol({ variant: s, size: a, className: t })),
        ...n,
      });
    }
  );
b.displayName = "Button";
function N({ className: t, ...s }) {
  return e.jsx("div", {
    "data-slot": "card",
    className: O(
      "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
      t
    ),
    ...s,
  });
}
function A({ className: t, ...s }) {
  return e.jsx("div", {
    "data-slot": "card-header",
    className: O(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      t
    ),
    ...s,
  });
}
function P({ className: t, ...s }) {
  return e.jsx("h4", {
    "data-slot": "card-title",
    className: O("leading-none", t),
    ...s,
  });
}
function Q({ className: t, ...s }) {
  return e.jsx("p", {
    "data-slot": "card-description",
    className: O("text-muted-foreground", t),
    ...s,
  });
}
function w({ className: t, ...s }) {
  return e.jsx("div", {
    "data-slot": "card-content",
    className: O("px-6 [&:last-child]:pb-6", t),
    ...s,
  });
}
function Tt({ className: t, ...s }) {
  return e.jsx("div", {
    "data-slot": "card-footer",
    className: O("flex items-center px-6 pb-6 [.border-t]:pt-6", t),
    ...s,
  });
}
const ll = $s(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);
function je({ className: t, variant: s, asChild: a = !1, ...r }) {
  const n = a ? Ya : "span";
  return e.jsx(n, {
    "data-slot": "badge",
    className: O(ll({ variant: s }), t),
    ...r,
  });
}
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const cl = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  dl = (t) =>
    t.replace(/^([A-Z])|[\s-_]+(\w)/g, (s, a, r) =>
      r ? r.toUpperCase() : a.toLowerCase()
    ),
  Na = (t) => {
    const s = dl(t);
    return s.charAt(0).toUpperCase() + s.slice(1);
  },
  gr = (...t) =>
    t
      .filter((s, a, r) => !!s && s.trim() !== "" && r.indexOf(s) === a)
      .join(" ")
      .trim();
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var ml = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ul = d.forwardRef(
  (
    {
      color: t = "currentColor",
      size: s = 24,
      strokeWidth: a = 2,
      absoluteStrokeWidth: r,
      className: n = "",
      children: o,
      iconNode: c,
      ...l
    },
    m
  ) =>
    d.createElement(
      "svg",
      {
        ref: m,
        ...ml,
        width: s,
        height: s,
        stroke: t,
        strokeWidth: r ? (Number(a) * 24) / Number(s) : a,
        className: gr("lucide", n),
        ...l,
      },
      [
        ...c.map(([u, p]) => d.createElement(u, p)),
        ...(Array.isArray(o) ? o : [o]),
      ]
    )
);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const U = (t, s) => {
  const a = d.forwardRef(({ className: r, ...n }, o) =>
    d.createElement(ul, {
      ref: o,
      iconNode: s,
      className: gr(`lucide-${cl(Na(t))}`, `lucide-${t}`, r),
      ...n,
    })
  );
  return (a.displayName = Na(t)), a;
};
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const xl = [
    ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
    ["path", { d: "M19 12H5", key: "x3x0zl" }],
  ],
  ge = U("arrow-left", xl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const hl = [
    [
      "path",
      {
        d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
        key: "1yiouv",
      },
    ],
    ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }],
  ],
  js = U("award", hl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const pl = [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
    [
      "path",
      {
        d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
        key: "11g9vi",
      },
    ],
  ],
  wa = U("bell", pl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const fl = [
    ["path", { d: "M8 2v4", key: "1cmpym" }],
    ["path", { d: "M16 2v4", key: "4m81vk" }],
    [
      "rect",
      { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" },
    ],
    ["path", { d: "M3 10h18", key: "8toen8" }],
  ],
  gl = U("calendar", fl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const vl = [
    [
      "path",
      {
        d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
        key: "1tc9qg",
      },
    ],
    ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }],
  ],
  jl = U("camera", vl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const yl = [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
    ["path", { d: "M18 17V9", key: "2bz60n" }],
    ["path", { d: "M13 17V5", key: "1frdt8" }],
    ["path", { d: "M8 17v-3", key: "17ska0" }],
  ],
  vr = U("chart-column", yl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const bl = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]],
  Zt = U("check", bl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Nl = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]],
  jr = U("chevron-down", Nl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const wl = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]],
  yr = U("chevron-right", wl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const kl = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]],
  Cl = U("chevron-up", kl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Sl = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }],
  ],
  nt = U("circle-alert", Sl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const El = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
  ],
  Ne = U("circle-check", El);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Al = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }],
  ],
  Pl = U("circle-help", Al);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Tl = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]],
  br = U("circle", Tl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ml = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }],
  ],
  Xe = U("clock", Ml);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Rl = [
    ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
    ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
    ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }],
  ],
  _l = U("database", Rl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Il = [
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
    ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
    ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }],
  ],
  Dl = U("download", Il);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Vl = [
    [
      "path",
      {
        d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
        key: "ct8e1f",
      },
    ],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
    [
      "path",
      {
        d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
        key: "13bj9a",
      },
    ],
    ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ],
  ys = U("eye-off", Vl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ll = [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
        key: "1nclc0",
      },
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ],
  Ht = U("eye", Ll);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ol = [
    [
      "path",
      {
        d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
        key: "1rqfz7",
      },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
    ["path", { d: "M10 9H8", key: "b1mrlr" }],
    ["path", { d: "M16 13H8", key: "t4e002" }],
    ["path", { d: "M16 17H8", key: "z1uh3a" }],
  ],
  Nr = U("file-text", Ol);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const $l = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    [
      "path",
      { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" },
    ],
    ["path", { d: "M2 12h20", key: "9i4pu4" }],
  ],
  Gt = U("globe", $l);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Fl = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 16v-4", key: "1dtifu" }],
    ["path", { d: "M12 8h.01", key: "e9boi3" }],
  ],
  us = U("info", Fl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const zl = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]],
  de = U("loader-circle", zl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ul = [
    [
      "rect",
      {
        width: "18",
        height: "11",
        x: "3",
        y: "11",
        rx: "2",
        ry: "2",
        key: "1w4ew1",
      },
    ],
    ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }],
  ],
  Ze = U("lock", Ul);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Bl = [
    ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }],
    ["polyline", { points: "16 17 21 12 16 7", key: "1gabdz" }],
    ["line", { x1: "21", x2: "9", y1: "12", y2: "12", key: "1uyos4" }],
  ],
  Hl = U("log-out", Bl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Gl = [
    [
      "rect",
      { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" },
    ],
    ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7", key: "1ocrg3" }],
  ],
  gt = U("mail", Gl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ql = [
    [
      "path",
      {
        d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
        key: "1r0f0z",
      },
    ],
    ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
  ],
  zs = U("map-pin", ql);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Wl = [
    ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }],
  ],
  Yl = U("message-circle", Wl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Kl = [
    [
      "path",
      {
        d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
        key: "1a8usu",
      },
    ],
    ["path", { d: "m15 5 4 4", key: "1mk7zo" }],
  ],
  Jl = U("pencil", Kl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Xl = [
    [
      "path",
      {
        d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
        key: "foiqr5",
      },
    ],
  ],
  Ct = U("phone", Xl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Zl = [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }],
  ],
  xs = U("plus", Zl);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ql = [
    [
      "path",
      {
        d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
        key: "v9h5vc",
      },
    ],
    ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
    [
      "path",
      {
        d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
        key: "3uifl3",
      },
    ],
    ["path", { d: "M8 16H3v5", key: "1cv678" }],
  ],
  vt = U("refresh-cw", Ql);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ec = [
    [
      "path",
      {
        d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
        key: "1c8476",
      },
    ],
    ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
    ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }],
  ],
  hs = U("save", ec);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const tc = [
    [
      "path",
      { d: "m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z", key: "7g6ntu" },
    ],
    [
      "path",
      { d: "m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z", key: "ijws7r" },
    ],
    ["path", { d: "M7 21h10", key: "1b0cd5" }],
    ["path", { d: "M12 3v18", key: "108xh3" }],
    ["path", { d: "M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2", key: "3gwbw2" }],
  ],
  sc = U("scale", tc);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ac = [
    [
      "path",
      {
        d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
        key: "1qme2f",
      },
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ],
  rc = U("settings", ac);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const nc = [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y",
      },
    ],
    ["path", { d: "M12 8v4", key: "1got3b" }],
    ["path", { d: "M12 16h.01", key: "1drbdi" }],
  ],
  bs = U("shield-alert", nc);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ic = [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y",
      },
    ],
  ],
  We = U("shield", ic);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const oc = [
    [
      "rect",
      {
        width: "14",
        height: "20",
        x: "5",
        y: "2",
        rx: "2",
        ry: "2",
        key: "1yt0o3",
      },
    ],
    ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ],
  lc = U("smartphone", oc);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const cc = [
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
    ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
    ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
    ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }],
  ],
  ka = U("trash-2", cc);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const dc = [
    ["polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17", key: "126l90" }],
    ["polyline", { points: "16 7 22 7 22 13", key: "kwv8wd" }],
  ],
  mc = U("trending-up", dc);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const uc = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
    ["polyline", { points: "16 11 18 13 22 9", key: "1pwet4" }],
  ],
  xc = U("user-check", uc);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const hc = [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
    ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }],
  ],
  St = U("user", hc);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const pc = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
    ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }],
  ],
  Ns = U("users", pc);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const fc = [
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
    [
      "path",
      { d: "M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z", key: "1ezoue" },
    ],
    ["path", { d: "M22 19H2", key: "nuriw5" }],
  ],
  ws = U("vote", fc);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const gc = [
    [
      "path",
      {
        d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
        key: "18etb6",
      },
    ],
    ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }],
  ],
  st = U("wallet", gc);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const vc = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ],
  jc = U("x", vc);
function yc(t) {
  const s = bc(t),
    a = d.forwardRef((r, n) => {
      const { children: o, ...c } = r,
        l = d.Children.toArray(o),
        m = l.find(wc);
      if (m) {
        const u = m.props.children,
          p = l.map((i) =>
            i === m
              ? d.Children.count(u) > 1
                ? d.Children.only(null)
                : d.isValidElement(u)
                ? u.props.children
                : null
              : i
          );
        return e.jsx(s, {
          ...c,
          ref: n,
          children: d.isValidElement(u) ? d.cloneElement(u, void 0, p) : null,
        });
      }
      return e.jsx(s, { ...c, ref: n, children: o });
    });
  return (a.displayName = `${t}.Slot`), a;
}
function bc(t) {
  const s = d.forwardRef((a, r) => {
    const { children: n, ...o } = a;
    if (d.isValidElement(n)) {
      const c = Cc(n),
        l = kc(o, n.props);
      return (
        n.type !== d.Fragment && (l.ref = r ? Vs(r, c) : c),
        d.cloneElement(n, l)
      );
    }
    return d.Children.count(n) > 1 ? d.Children.only(null) : null;
  });
  return (s.displayName = `${t}.SlotClone`), s;
}
var Nc = Symbol("radix.slottable");
function wc(t) {
  return (
    d.isValidElement(t) &&
    typeof t.type == "function" &&
    "__radixId" in t.type &&
    t.type.__radixId === Nc
  );
}
function kc(t, s) {
  const a = { ...s };
  for (const r in s) {
    const n = t[r],
      o = s[r];
    /^on[A-Z]/.test(r)
      ? n && o
        ? (a[r] = (...l) => {
            const m = o(...l);
            return n(...l), m;
          })
        : n && (a[r] = n)
      : r === "style"
      ? (a[r] = { ...n, ...o })
      : r === "className" && (a[r] = [n, o].filter(Boolean).join(" "));
  }
  return { ...t, ...a };
}
function Cc(t) {
  let s = Object.getOwnPropertyDescriptor(t.props, "ref")?.get,
    a = s && "isReactWarning" in s && s.isReactWarning;
  return a
    ? t.ref
    : ((s = Object.getOwnPropertyDescriptor(t, "ref")?.get),
      (a = s && "isReactWarning" in s && s.isReactWarning),
      a ? t.props.ref : t.props.ref || t.ref);
}
var ks = ["Enter", " "],
  Sc = ["ArrowDown", "PageUp", "Home"],
  wr = ["ArrowUp", "PageDown", "End"],
  Ec = [...Sc, ...wr],
  Ac = { ltr: [...ks, "ArrowRight"], rtl: [...ks, "ArrowLeft"] },
  Pc = { ltr: ["ArrowLeft"], rtl: ["ArrowRight"] },
  Mt = "Menu",
  [Et, Tc, Mc] = Ni(Mt),
  [it, kr] = Jt(Mt, [Mc, Ka, Xt]),
  Qt = Ka(),
  Cr = Xt(),
  [Rc, ot] = it(Mt),
  [_c, Rt] = it(Mt),
  Sr = (t) => {
    const {
        __scopeMenu: s,
        open: a = !1,
        children: r,
        dir: n,
        onOpenChange: o,
        modal: c = !0,
      } = t,
      l = Qt(s),
      [m, u] = d.useState(null),
      p = d.useRef(!1),
      i = Ls(o),
      x = Za(n);
    return (
      d.useEffect(() => {
        const j = () => {
            (p.current = !0),
              document.addEventListener("pointerdown", g, {
                capture: !0,
                once: !0,
              }),
              document.addEventListener("pointermove", g, {
                capture: !0,
                once: !0,
              });
          },
          g = () => (p.current = !1);
        return (
          document.addEventListener("keydown", j, { capture: !0 }),
          () => {
            document.removeEventListener("keydown", j, { capture: !0 }),
              document.removeEventListener("pointerdown", g, { capture: !0 }),
              document.removeEventListener("pointermove", g, { capture: !0 });
          }
        );
      }, []),
      e.jsx(Ri, {
        ...l,
        children: e.jsx(Rc, {
          scope: s,
          open: a,
          onOpenChange: i,
          content: m,
          onContentChange: u,
          children: e.jsx(_c, {
            scope: s,
            onClose: d.useCallback(() => i(!1), [i]),
            isUsingKeyboardRef: p,
            dir: x,
            modal: c,
            children: r,
          }),
        }),
      })
    );
  };
Sr.displayName = Mt;
var Ic = "MenuAnchor",
  Us = d.forwardRef((t, s) => {
    const { __scopeMenu: a, ...r } = t,
      n = Qt(a);
    return e.jsx(ki, { ...n, ...r, ref: s });
  });
Us.displayName = Ic;
var Bs = "MenuPortal",
  [Dc, Er] = it(Bs, { forceMount: void 0 }),
  Ar = (t) => {
    const { __scopeMenu: s, forceMount: a, children: r, container: n } = t,
      o = ot(Bs, s);
    return e.jsx(Dc, {
      scope: s,
      forceMount: a,
      children: e.jsx(Pt, {
        present: a || o.open,
        children: e.jsx(wi, { asChild: !0, container: n, children: r }),
      }),
    });
  };
Ar.displayName = Bs;
var Te = "MenuContent",
  [Vc, Hs] = it(Te),
  Pr = d.forwardRef((t, s) => {
    const a = Er(Te, t.__scopeMenu),
      { forceMount: r = a.forceMount, ...n } = t,
      o = ot(Te, t.__scopeMenu),
      c = Rt(Te, t.__scopeMenu);
    return e.jsx(Et.Provider, {
      scope: t.__scopeMenu,
      children: e.jsx(Pt, {
        present: r || o.open,
        children: e.jsx(Et.Slot, {
          scope: t.__scopeMenu,
          children: c.modal
            ? e.jsx(Lc, { ...n, ref: s })
            : e.jsx(Oc, { ...n, ref: s }),
        }),
      }),
    });
  }),
  Lc = d.forwardRef((t, s) => {
    const a = ot(Te, t.__scopeMenu),
      r = d.useRef(null),
      n = Qe(s, r);
    return (
      d.useEffect(() => {
        const o = r.current;
        if (o) return Ti(o);
      }, []),
      e.jsx(Gs, {
        ...t,
        ref: n,
        trapFocus: a.open,
        disableOutsidePointerEvents: a.open,
        disableOutsideScroll: !0,
        onFocusOutside: ie(t.onFocusOutside, (o) => o.preventDefault(), {
          checkForDefaultPrevented: !1,
        }),
        onDismiss: () => a.onOpenChange(!1),
      })
    );
  }),
  Oc = d.forwardRef((t, s) => {
    const a = ot(Te, t.__scopeMenu);
    return e.jsx(Gs, {
      ...t,
      ref: s,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => a.onOpenChange(!1),
    });
  }),
  $c = yc("MenuContent.ScrollLock"),
  Gs = d.forwardRef((t, s) => {
    const {
        __scopeMenu: a,
        loop: r = !1,
        trapFocus: n,
        onOpenAutoFocus: o,
        onCloseAutoFocus: c,
        disableOutsidePointerEvents: l,
        onEntryFocus: m,
        onEscapeKeyDown: u,
        onPointerDownOutside: p,
        onFocusOutside: i,
        onInteractOutside: x,
        onDismiss: j,
        disableOutsideScroll: g,
        ...v
      } = t,
      T = ot(Te, a),
      y = Rt(Te, a),
      E = Qt(a),
      R = Cr(a),
      F = Tc(a),
      [f, B] = d.useState(null),
      oe = d.useRef(null),
      C = Qe(s, oe, T.onContentChange),
      L = d.useRef(0),
      H = d.useRef(""),
      ne = d.useRef(0),
      X = d.useRef(null),
      Z = d.useRef("right"),
      ee = d.useRef(0),
      le = g ? Si : d.Fragment,
      $ = g ? { as: $c, allowPinchZoom: !0 } : void 0,
      te = (k) => {
        const G = H.current + k,
          re = F().filter((z) => !z.disabled),
          ue = document.activeElement,
          D = re.find((z) => z.ref.current === ue)?.textValue,
          q = re.map((z) => z.textValue),
          se = Xc(q, G, D),
          ce = re.find((z) => z.textValue === se)?.ref.current;
        (function z(ae) {
          (H.current = ae),
            window.clearTimeout(L.current),
            ae !== "" && (L.current = window.setTimeout(() => z(""), 1e3));
        })(G),
          ce && setTimeout(() => ce.focus());
      };
    d.useEffect(() => () => window.clearTimeout(L.current), []), Ci();
    const h = d.useCallback(
      (k) => Z.current === X.current?.side && Qc(k, X.current?.area),
      []
    );
    return e.jsx(Vc, {
      scope: a,
      searchRef: H,
      onItemEnter: d.useCallback(
        (k) => {
          h(k) && k.preventDefault();
        },
        [h]
      ),
      onItemLeave: d.useCallback(
        (k) => {
          h(k) || (oe.current?.focus(), B(null));
        },
        [h]
      ),
      onTriggerLeave: d.useCallback(
        (k) => {
          h(k) && k.preventDefault();
        },
        [h]
      ),
      pointerGraceTimerRef: ne,
      onPointerGraceIntentChange: d.useCallback((k) => {
        X.current = k;
      }, []),
      children: e.jsx(le, {
        ...$,
        children: e.jsx(Ei, {
          asChild: !0,
          trapped: n,
          onMountAutoFocus: ie(o, (k) => {
            k.preventDefault(), oe.current?.focus({ preventScroll: !0 });
          }),
          onUnmountAutoFocus: c,
          children: e.jsx(Ai, {
            asChild: !0,
            disableOutsidePointerEvents: l,
            onEscapeKeyDown: u,
            onPointerDownOutside: p,
            onFocusOutside: i,
            onInteractOutside: x,
            onDismiss: j,
            children: e.jsx(Xa, {
              asChild: !0,
              ...R,
              dir: y.dir,
              orientation: "vertical",
              loop: r,
              currentTabStopId: f,
              onCurrentTabStopIdChange: B,
              onEntryFocus: ie(m, (k) => {
                y.isUsingKeyboardRef.current || k.preventDefault();
              }),
              preventScrollOnEntryFocus: !0,
              children: e.jsx(Pi, {
                role: "menu",
                "aria-orientation": "vertical",
                "data-state": Gr(T.open),
                "data-radix-menu-content": "",
                dir: y.dir,
                ...E,
                ...v,
                ref: C,
                style: { outline: "none", ...v.style },
                onKeyDown: ie(v.onKeyDown, (k) => {
                  const re =
                      k.target.closest("[data-radix-menu-content]") ===
                      k.currentTarget,
                    ue = k.ctrlKey || k.altKey || k.metaKey,
                    D = k.key.length === 1;
                  re &&
                    (k.key === "Tab" && k.preventDefault(),
                    !ue && D && te(k.key));
                  const q = oe.current;
                  if (k.target !== q || !Ec.includes(k.key)) return;
                  k.preventDefault();
                  const ce = F()
                    .filter((z) => !z.disabled)
                    .map((z) => z.ref.current);
                  wr.includes(k.key) && ce.reverse(), Kc(ce);
                }),
                onBlur: ie(t.onBlur, (k) => {
                  k.currentTarget.contains(k.target) ||
                    (window.clearTimeout(L.current), (H.current = ""));
                }),
                onPointerMove: ie(
                  t.onPointerMove,
                  At((k) => {
                    const G = k.target,
                      re = ee.current !== k.clientX;
                    if (k.currentTarget.contains(G) && re) {
                      const ue = k.clientX > ee.current ? "right" : "left";
                      (Z.current = ue), (ee.current = k.clientX);
                    }
                  })
                ),
              }),
            }),
          }),
        }),
      }),
    });
  });
Pr.displayName = Te;
var Fc = "MenuGroup",
  qs = d.forwardRef((t, s) => {
    const { __scopeMenu: a, ...r } = t;
    return e.jsx(Ue.div, { role: "group", ...r, ref: s });
  });
qs.displayName = Fc;
var zc = "MenuLabel",
  Tr = d.forwardRef((t, s) => {
    const { __scopeMenu: a, ...r } = t;
    return e.jsx(Ue.div, { ...r, ref: s });
  });
Tr.displayName = zc;
var qt = "MenuItem",
  Ca = "menu.itemSelect",
  es = d.forwardRef((t, s) => {
    const { disabled: a = !1, onSelect: r, ...n } = t,
      o = d.useRef(null),
      c = Rt(qt, t.__scopeMenu),
      l = Hs(qt, t.__scopeMenu),
      m = Qe(s, o),
      u = d.useRef(!1),
      p = () => {
        const i = o.current;
        if (!a && i) {
          const x = new CustomEvent(Ca, { bubbles: !0, cancelable: !0 });
          i.addEventListener(Ca, (j) => r?.(j), { once: !0 }),
            Mi(i, x),
            x.defaultPrevented ? (u.current = !1) : c.onClose();
        }
      };
    return e.jsx(Mr, {
      ...n,
      ref: m,
      disabled: a,
      onClick: ie(t.onClick, p),
      onPointerDown: (i) => {
        t.onPointerDown?.(i), (u.current = !0);
      },
      onPointerUp: ie(t.onPointerUp, (i) => {
        u.current || i.currentTarget?.click();
      }),
      onKeyDown: ie(t.onKeyDown, (i) => {
        const x = l.searchRef.current !== "";
        a ||
          (x && i.key === " ") ||
          (ks.includes(i.key) && (i.currentTarget.click(), i.preventDefault()));
      }),
    });
  });
es.displayName = qt;
var Mr = d.forwardRef((t, s) => {
    const { __scopeMenu: a, disabled: r = !1, textValue: n, ...o } = t,
      c = Hs(qt, a),
      l = Cr(a),
      m = d.useRef(null),
      u = Qe(s, m),
      [p, i] = d.useState(!1),
      [x, j] = d.useState("");
    return (
      d.useEffect(() => {
        const g = m.current;
        g && j((g.textContent ?? "").trim());
      }, [o.children]),
      e.jsx(Et.ItemSlot, {
        scope: a,
        disabled: r,
        textValue: n ?? x,
        children: e.jsx(Ja, {
          asChild: !0,
          ...l,
          focusable: !r,
          children: e.jsx(Ue.div, {
            role: "menuitem",
            "data-highlighted": p ? "" : void 0,
            "aria-disabled": r || void 0,
            "data-disabled": r ? "" : void 0,
            ...o,
            ref: u,
            onPointerMove: ie(
              t.onPointerMove,
              At((g) => {
                r
                  ? c.onItemLeave(g)
                  : (c.onItemEnter(g),
                    g.defaultPrevented ||
                      g.currentTarget.focus({ preventScroll: !0 }));
              })
            ),
            onPointerLeave: ie(
              t.onPointerLeave,
              At((g) => c.onItemLeave(g))
            ),
            onFocus: ie(t.onFocus, () => i(!0)),
            onBlur: ie(t.onBlur, () => i(!1)),
          }),
        }),
      })
    );
  }),
  Uc = "MenuCheckboxItem",
  Rr = d.forwardRef((t, s) => {
    const { checked: a = !1, onCheckedChange: r, ...n } = t;
    return e.jsx(Lr, {
      scope: t.__scopeMenu,
      checked: a,
      children: e.jsx(es, {
        role: "menuitemcheckbox",
        "aria-checked": Wt(a) ? "mixed" : a,
        ...n,
        ref: s,
        "data-state": Ys(a),
        onSelect: ie(n.onSelect, () => r?.(Wt(a) ? !0 : !a), {
          checkForDefaultPrevented: !1,
        }),
      }),
    });
  });
Rr.displayName = Uc;
var _r = "MenuRadioGroup",
  [Bc, Hc] = it(_r, { value: void 0, onValueChange: () => {} }),
  Ir = d.forwardRef((t, s) => {
    const { value: a, onValueChange: r, ...n } = t,
      o = Ls(r);
    return e.jsx(Bc, {
      scope: t.__scopeMenu,
      value: a,
      onValueChange: o,
      children: e.jsx(qs, { ...n, ref: s }),
    });
  });
Ir.displayName = _r;
var Dr = "MenuRadioItem",
  Vr = d.forwardRef((t, s) => {
    const { value: a, ...r } = t,
      n = Hc(Dr, t.__scopeMenu),
      o = a === n.value;
    return e.jsx(Lr, {
      scope: t.__scopeMenu,
      checked: o,
      children: e.jsx(es, {
        role: "menuitemradio",
        "aria-checked": o,
        ...r,
        ref: s,
        "data-state": Ys(o),
        onSelect: ie(r.onSelect, () => n.onValueChange?.(a), {
          checkForDefaultPrevented: !1,
        }),
      }),
    });
  });
Vr.displayName = Dr;
var Ws = "MenuItemIndicator",
  [Lr, Gc] = it(Ws, { checked: !1 }),
  Or = d.forwardRef((t, s) => {
    const { __scopeMenu: a, forceMount: r, ...n } = t,
      o = Gc(Ws, a);
    return e.jsx(Pt, {
      present: r || Wt(o.checked) || o.checked === !0,
      children: e.jsx(Ue.span, { ...n, ref: s, "data-state": Ys(o.checked) }),
    });
  });
Or.displayName = Ws;
var qc = "MenuSeparator",
  $r = d.forwardRef((t, s) => {
    const { __scopeMenu: a, ...r } = t;
    return e.jsx(Ue.div, {
      role: "separator",
      "aria-orientation": "horizontal",
      ...r,
      ref: s,
    });
  });
$r.displayName = qc;
var Wc = "MenuArrow",
  Fr = d.forwardRef((t, s) => {
    const { __scopeMenu: a, ...r } = t,
      n = Qt(a);
    return e.jsx(_i, { ...n, ...r, ref: s });
  });
Fr.displayName = Wc;
var Yc = "MenuSub",
  [Cx, zr] = it(Yc),
  wt = "MenuSubTrigger",
  Ur = d.forwardRef((t, s) => {
    const a = ot(wt, t.__scopeMenu),
      r = Rt(wt, t.__scopeMenu),
      n = zr(wt, t.__scopeMenu),
      o = Hs(wt, t.__scopeMenu),
      c = d.useRef(null),
      { pointerGraceTimerRef: l, onPointerGraceIntentChange: m } = o,
      u = { __scopeMenu: t.__scopeMenu },
      p = d.useCallback(() => {
        c.current && window.clearTimeout(c.current), (c.current = null);
      }, []);
    return (
      d.useEffect(() => p, [p]),
      d.useEffect(() => {
        const i = l.current;
        return () => {
          window.clearTimeout(i), m(null);
        };
      }, [l, m]),
      e.jsx(Us, {
        asChild: !0,
        ...u,
        children: e.jsx(Mr, {
          id: n.triggerId,
          "aria-haspopup": "menu",
          "aria-expanded": a.open,
          "aria-controls": n.contentId,
          "data-state": Gr(a.open),
          ...t,
          ref: Vs(s, n.onTriggerChange),
          onClick: (i) => {
            t.onClick?.(i),
              !(t.disabled || i.defaultPrevented) &&
                (i.currentTarget.focus(), a.open || a.onOpenChange(!0));
          },
          onPointerMove: ie(
            t.onPointerMove,
            At((i) => {
              o.onItemEnter(i),
                !i.defaultPrevented &&
                  !t.disabled &&
                  !a.open &&
                  !c.current &&
                  (o.onPointerGraceIntentChange(null),
                  (c.current = window.setTimeout(() => {
                    a.onOpenChange(!0), p();
                  }, 100)));
            })
          ),
          onPointerLeave: ie(
            t.onPointerLeave,
            At((i) => {
              p();
              const x = a.content?.getBoundingClientRect();
              if (x) {
                const j = a.content?.dataset.side,
                  g = j === "right",
                  v = g ? -5 : 5,
                  T = x[g ? "left" : "right"],
                  y = x[g ? "right" : "left"];
                o.onPointerGraceIntentChange({
                  area: [
                    { x: i.clientX + v, y: i.clientY },
                    { x: T, y: x.top },
                    { x: y, y: x.top },
                    { x: y, y: x.bottom },
                    { x: T, y: x.bottom },
                  ],
                  side: j,
                }),
                  window.clearTimeout(l.current),
                  (l.current = window.setTimeout(
                    () => o.onPointerGraceIntentChange(null),
                    300
                  ));
              } else {
                if ((o.onTriggerLeave(i), i.defaultPrevented)) return;
                o.onPointerGraceIntentChange(null);
              }
            })
          ),
          onKeyDown: ie(t.onKeyDown, (i) => {
            const x = o.searchRef.current !== "";
            t.disabled ||
              (x && i.key === " ") ||
              (Ac[r.dir].includes(i.key) &&
                (a.onOpenChange(!0), a.content?.focus(), i.preventDefault()));
          }),
        }),
      })
    );
  });
Ur.displayName = wt;
var Br = "MenuSubContent",
  Hr = d.forwardRef((t, s) => {
    const a = Er(Te, t.__scopeMenu),
      { forceMount: r = a.forceMount, ...n } = t,
      o = ot(Te, t.__scopeMenu),
      c = Rt(Te, t.__scopeMenu),
      l = zr(Br, t.__scopeMenu),
      m = d.useRef(null),
      u = Qe(s, m);
    return e.jsx(Et.Provider, {
      scope: t.__scopeMenu,
      children: e.jsx(Pt, {
        present: r || o.open,
        children: e.jsx(Et.Slot, {
          scope: t.__scopeMenu,
          children: e.jsx(Gs, {
            id: l.contentId,
            "aria-labelledby": l.triggerId,
            ...n,
            ref: u,
            align: "start",
            side: c.dir === "rtl" ? "left" : "right",
            disableOutsidePointerEvents: !1,
            disableOutsideScroll: !1,
            trapFocus: !1,
            onOpenAutoFocus: (p) => {
              c.isUsingKeyboardRef.current && m.current?.focus(),
                p.preventDefault();
            },
            onCloseAutoFocus: (p) => p.preventDefault(),
            onFocusOutside: ie(t.onFocusOutside, (p) => {
              p.target !== l.trigger && o.onOpenChange(!1);
            }),
            onEscapeKeyDown: ie(t.onEscapeKeyDown, (p) => {
              c.onClose(), p.preventDefault();
            }),
            onKeyDown: ie(t.onKeyDown, (p) => {
              const i = p.currentTarget.contains(p.target),
                x = Pc[c.dir].includes(p.key);
              i &&
                x &&
                (o.onOpenChange(!1), l.trigger?.focus(), p.preventDefault());
            }),
          }),
        }),
      }),
    });
  });
Hr.displayName = Br;
function Gr(t) {
  return t ? "open" : "closed";
}
function Wt(t) {
  return t === "indeterminate";
}
function Ys(t) {
  return Wt(t) ? "indeterminate" : t ? "checked" : "unchecked";
}
function Kc(t) {
  const s = document.activeElement;
  for (const a of t)
    if (a === s || (a.focus(), document.activeElement !== s)) return;
}
function Jc(t, s) {
  return t.map((a, r) => t[(s + r) % t.length]);
}
function Xc(t, s, a) {
  const n = s.length > 1 && Array.from(s).every((u) => u === s[0]) ? s[0] : s,
    o = a ? t.indexOf(a) : -1;
  let c = Jc(t, Math.max(o, 0));
  n.length === 1 && (c = c.filter((u) => u !== a));
  const m = c.find((u) => u.toLowerCase().startsWith(n.toLowerCase()));
  return m !== a ? m : void 0;
}
function Zc(t, s) {
  const { x: a, y: r } = t;
  let n = !1;
  for (let o = 0, c = s.length - 1; o < s.length; c = o++) {
    const l = s[o],
      m = s[c],
      u = l.x,
      p = l.y,
      i = m.x,
      x = m.y;
    p > r != x > r && a < ((i - u) * (r - p)) / (x - p) + u && (n = !n);
  }
  return n;
}
function Qc(t, s) {
  if (!s) return !1;
  const a = { x: t.clientX, y: t.clientY };
  return Zc(a, s);
}
function At(t) {
  return (s) => (s.pointerType === "mouse" ? t(s) : void 0);
}
var ed = Sr,
  td = Us,
  sd = Ar,
  ad = Pr,
  rd = qs,
  nd = Tr,
  id = es,
  od = Rr,
  ld = Ir,
  cd = Vr,
  dd = Or,
  md = $r,
  ud = Fr,
  xd = Ur,
  hd = Hr,
  ts = "DropdownMenu",
  [pd] = Jt(ts, [kr]),
  we = kr(),
  [fd, qr] = pd(ts),
  Wr = (t) => {
    const {
        __scopeDropdownMenu: s,
        children: a,
        dir: r,
        open: n,
        defaultOpen: o,
        onOpenChange: c,
        modal: l = !0,
      } = t,
      m = we(s),
      u = d.useRef(null),
      [p, i] = Qa({ prop: n, defaultProp: o ?? !1, onChange: c, caller: ts });
    return e.jsx(fd, {
      scope: s,
      triggerId: ua(),
      triggerRef: u,
      contentId: ua(),
      open: p,
      onOpenChange: i,
      onOpenToggle: d.useCallback(() => i((x) => !x), [i]),
      modal: l,
      children: e.jsx(ed, {
        ...m,
        open: p,
        onOpenChange: i,
        dir: r,
        modal: l,
        children: a,
      }),
    });
  };
Wr.displayName = ts;
var Yr = "DropdownMenuTrigger",
  Kr = d.forwardRef((t, s) => {
    const { __scopeDropdownMenu: a, disabled: r = !1, ...n } = t,
      o = qr(Yr, a),
      c = we(a);
    return e.jsx(td, {
      asChild: !0,
      ...c,
      children: e.jsx(Ue.button, {
        type: "button",
        id: o.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": o.open,
        "aria-controls": o.open ? o.contentId : void 0,
        "data-state": o.open ? "open" : "closed",
        "data-disabled": r ? "" : void 0,
        disabled: r,
        ...n,
        ref: Vs(s, o.triggerRef),
        onPointerDown: ie(t.onPointerDown, (l) => {
          !r &&
            l.button === 0 &&
            l.ctrlKey === !1 &&
            (o.onOpenToggle(), o.open || l.preventDefault());
        }),
        onKeyDown: ie(t.onKeyDown, (l) => {
          r ||
            (["Enter", " "].includes(l.key) && o.onOpenToggle(),
            l.key === "ArrowDown" && o.onOpenChange(!0),
            ["Enter", " ", "ArrowDown"].includes(l.key) && l.preventDefault());
        }),
      }),
    });
  });
Kr.displayName = Yr;
var gd = "DropdownMenuPortal",
  Jr = (t) => {
    const { __scopeDropdownMenu: s, ...a } = t,
      r = we(s);
    return e.jsx(sd, { ...r, ...a });
  };
Jr.displayName = gd;
var Xr = "DropdownMenuContent",
  Zr = d.forwardRef((t, s) => {
    const { __scopeDropdownMenu: a, ...r } = t,
      n = qr(Xr, a),
      o = we(a),
      c = d.useRef(!1);
    return e.jsx(ad, {
      id: n.contentId,
      "aria-labelledby": n.triggerId,
      ...o,
      ...r,
      ref: s,
      onCloseAutoFocus: ie(t.onCloseAutoFocus, (l) => {
        c.current || n.triggerRef.current?.focus(),
          (c.current = !1),
          l.preventDefault();
      }),
      onInteractOutside: ie(t.onInteractOutside, (l) => {
        const m = l.detail.originalEvent,
          u = m.button === 0 && m.ctrlKey === !0,
          p = m.button === 2 || u;
        (!n.modal || p) && (c.current = !0);
      }),
      style: {
        ...t.style,
        "--radix-dropdown-menu-content-transform-origin":
          "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width":
          "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height":
          "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width":
          "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height":
          "var(--radix-popper-anchor-height)",
      },
    });
  });
Zr.displayName = Xr;
var vd = "DropdownMenuGroup",
  jd = d.forwardRef((t, s) => {
    const { __scopeDropdownMenu: a, ...r } = t,
      n = we(a);
    return e.jsx(rd, { ...n, ...r, ref: s });
  });
jd.displayName = vd;
var yd = "DropdownMenuLabel",
  Qr = d.forwardRef((t, s) => {
    const { __scopeDropdownMenu: a, ...r } = t,
      n = we(a);
    return e.jsx(nd, { ...n, ...r, ref: s });
  });
Qr.displayName = yd;
var bd = "DropdownMenuItem",
  en = d.forwardRef((t, s) => {
    const { __scopeDropdownMenu: a, ...r } = t,
      n = we(a);
    return e.jsx(id, { ...n, ...r, ref: s });
  });
en.displayName = bd;
var Nd = "DropdownMenuCheckboxItem",
  tn = d.forwardRef((t, s) => {
    const { __scopeDropdownMenu: a, ...r } = t,
      n = we(a);
    return e.jsx(od, { ...n, ...r, ref: s });
  });
tn.displayName = Nd;
var wd = "DropdownMenuRadioGroup",
  kd = d.forwardRef((t, s) => {
    const { __scopeDropdownMenu: a, ...r } = t,
      n = we(a);
    return e.jsx(ld, { ...n, ...r, ref: s });
  });
kd.displayName = wd;
var Cd = "DropdownMenuRadioItem",
  sn = d.forwardRef((t, s) => {
    const { __scopeDropdownMenu: a, ...r } = t,
      n = we(a);
    return e.jsx(cd, { ...n, ...r, ref: s });
  });
sn.displayName = Cd;
var Sd = "DropdownMenuItemIndicator",
  an = d.forwardRef((t, s) => {
    const { __scopeDropdownMenu: a, ...r } = t,
      n = we(a);
    return e.jsx(dd, { ...n, ...r, ref: s });
  });
an.displayName = Sd;
var Ed = "DropdownMenuSeparator",
  rn = d.forwardRef((t, s) => {
    const { __scopeDropdownMenu: a, ...r } = t,
      n = we(a);
    return e.jsx(md, { ...n, ...r, ref: s });
  });
rn.displayName = Ed;
var Ad = "DropdownMenuArrow",
  Pd = d.forwardRef((t, s) => {
    const { __scopeDropdownMenu: a, ...r } = t,
      n = we(a);
    return e.jsx(ud, { ...n, ...r, ref: s });
  });
Pd.displayName = Ad;
var Td = "DropdownMenuSubTrigger",
  nn = d.forwardRef((t, s) => {
    const { __scopeDropdownMenu: a, ...r } = t,
      n = we(a);
    return e.jsx(xd, { ...n, ...r, ref: s });
  });
nn.displayName = Td;
var Md = "DropdownMenuSubContent",
  on = d.forwardRef((t, s) => {
    const { __scopeDropdownMenu: a, ...r } = t,
      n = we(a);
    return e.jsx(hd, {
      ...n,
      ...r,
      ref: s,
      style: {
        ...t.style,
        "--radix-dropdown-menu-content-transform-origin":
          "var(--radix-popper-transform-origin)",
        "--radix-dropdown-menu-content-available-width":
          "var(--radix-popper-available-width)",
        "--radix-dropdown-menu-content-available-height":
          "var(--radix-popper-available-height)",
        "--radix-dropdown-menu-trigger-width":
          "var(--radix-popper-anchor-width)",
        "--radix-dropdown-menu-trigger-height":
          "var(--radix-popper-anchor-height)",
      },
    });
  });
on.displayName = Md;
var Rd = Wr,
  _d = Kr,
  Id = Jr,
  ln = Zr,
  cn = Qr,
  dn = en,
  mn = tn,
  un = sn,
  xn = an,
  hn = rn,
  pn = nn,
  fn = on;
const Dd = Rd,
  Vd = _d,
  Ld = d.forwardRef(({ className: t, inset: s, children: a, ...r }, n) =>
    e.jsxs(pn, {
      ref: n,
      className: O(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
        s && "pl-8",
        t
      ),
      ...r,
      children: [a, e.jsx(yr, { className: "ml-auto h-4 w-4" })],
    })
  );
Ld.displayName = pn.displayName;
const Od = d.forwardRef(({ className: t, ...s }, a) =>
  e.jsx(fn, {
    ref: a,
    className: O(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      t
    ),
    ...s,
  })
);
Od.displayName = fn.displayName;
const gn = d.forwardRef(({ className: t, sideOffset: s = 4, ...a }, r) =>
  e.jsx(Id, {
    children: e.jsx(ln, {
      ref: r,
      sideOffset: s,
      className: O(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        t
      ),
      ...a,
    }),
  })
);
gn.displayName = ln.displayName;
const pt = d.forwardRef(({ className: t, inset: s, ...a }, r) =>
  e.jsx(dn, {
    ref: r,
    className: O(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      s && "pl-8",
      t
    ),
    ...a,
  })
);
pt.displayName = dn.displayName;
const $d = d.forwardRef(({ className: t, children: s, checked: a, ...r }, n) =>
  e.jsxs(mn, {
    ref: n,
    className: O(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      t
    ),
    checked: a,
    ...r,
    children: [
      e.jsx("span", {
        className:
          "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: e.jsx(xn, { children: e.jsx(Zt, { className: "h-4 w-4" }) }),
      }),
      s,
    ],
  })
);
$d.displayName = mn.displayName;
const Fd = d.forwardRef(({ className: t, children: s, ...a }, r) =>
  e.jsxs(un, {
    ref: r,
    className: O(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      t
    ),
    ...a,
    children: [
      e.jsx("span", {
        className:
          "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: e.jsx(xn, {
          children: e.jsx(br, { className: "h-2 w-2 fill-current" }),
        }),
      }),
      s,
    ],
  })
);
Fd.displayName = un.displayName;
const vn = d.forwardRef(({ className: t, inset: s, ...a }, r) =>
  e.jsx(cn, {
    ref: r,
    className: O("px-2 py-1.5 text-sm font-semibold", s && "pl-8", t),
    ...a,
  })
);
vn.displayName = cn.displayName;
const Cs = d.forwardRef(({ className: t, ...s }, a) =>
  e.jsx(hn, { ref: a, className: O("-mx-1 my-1 h-px bg-muted", t), ...s })
);
Cs.displayName = hn.displayName;
function zd(t, s = []) {
  let a = [];
  function r(o, c) {
    const l = d.createContext(c);
    l.displayName = o + "Context";
    const m = a.length;
    a = [...a, c];
    const u = (i) => {
      const { scope: x, children: j, ...g } = i,
        v = x?.[t]?.[m] || l,
        T = d.useMemo(() => g, Object.values(g));
      return e.jsx(v.Provider, { value: T, children: j });
    };
    u.displayName = o + "Provider";
    function p(i, x) {
      const j = x?.[t]?.[m] || l,
        g = d.useContext(j);
      if (g) return g;
      if (c !== void 0) return c;
      throw new Error(`\`${i}\` must be used within \`${o}\``);
    }
    return [u, p];
  }
  const n = () => {
    const o = a.map((c) => d.createContext(c));
    return function (l) {
      const m = l?.[t] || o;
      return d.useMemo(() => ({ [`__scope${t}`]: { ...l, [t]: m } }), [l, m]);
    };
  };
  return (n.scopeName = t), [r, Ud(n, ...s)];
}
function Ud(...t) {
  const s = t[0];
  if (t.length === 1) return s;
  const a = () => {
    const r = t.map((n) => ({ useScope: n(), scopeName: n.scopeName }));
    return function (o) {
      const c = r.reduce((l, { useScope: m, scopeName: u }) => {
        const i = m(o)[`__scope${u}`];
        return { ...l, ...i };
      }, {});
      return d.useMemo(() => ({ [`__scope${s.scopeName}`]: c }), [c]);
    };
  };
  return (a.scopeName = s.scopeName), a;
}
var Bd = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul",
  ],
  Ks = Bd.reduce((t, s) => {
    const a = Os(`Primitive.${s}`),
      r = d.forwardRef((n, o) => {
        const { asChild: c, ...l } = n,
          m = c ? a : s;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          e.jsx(m, { ...l, ref: o })
        );
      });
    return (r.displayName = `Primitive.${s}`), { ...t, [s]: r };
  }, {}),
  ps = { exports: {} },
  fs = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Sa;
function Hd() {
  if (Sa) return fs;
  Sa = 1;
  var t = po();
  function s(i, x) {
    return (i === x && (i !== 0 || 1 / i === 1 / x)) || (i !== i && x !== x);
  }
  var a = typeof Object.is == "function" ? Object.is : s,
    r = t.useState,
    n = t.useEffect,
    o = t.useLayoutEffect,
    c = t.useDebugValue;
  function l(i, x) {
    var j = x(),
      g = r({ inst: { value: j, getSnapshot: x } }),
      v = g[0].inst,
      T = g[1];
    return (
      o(
        function () {
          (v.value = j), (v.getSnapshot = x), m(v) && T({ inst: v });
        },
        [i, j, x]
      ),
      n(
        function () {
          return (
            m(v) && T({ inst: v }),
            i(function () {
              m(v) && T({ inst: v });
            })
          );
        },
        [i]
      ),
      c(j),
      j
    );
  }
  function m(i) {
    var x = i.getSnapshot;
    i = i.value;
    try {
      var j = x();
      return !a(i, j);
    } catch {
      return !0;
    }
  }
  function u(i, x) {
    return x();
  }
  var p =
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
      ? u
      : l;
  return (
    (fs.useSyncExternalStore =
      t.useSyncExternalStore !== void 0 ? t.useSyncExternalStore : p),
    fs
  );
}
var Ea;
function Gd() {
  return Ea || ((Ea = 1), (ps.exports = Hd())), ps.exports;
}
var qd = Gd();
function Wd() {
  return qd.useSyncExternalStore(
    Yd,
    () => !0,
    () => !1
  );
}
function Yd() {
  return () => {};
}
var Js = "Avatar",
  [Kd] = zd(Js),
  [Jd, jn] = Kd(Js),
  yn = d.forwardRef((t, s) => {
    const { __scopeAvatar: a, ...r } = t,
      [n, o] = d.useState("idle");
    return e.jsx(Jd, {
      scope: a,
      imageLoadingStatus: n,
      onImageLoadingStatusChange: o,
      children: e.jsx(Ks.span, { ...r, ref: s }),
    });
  });
yn.displayName = Js;
var bn = "AvatarImage",
  Xd = d.forwardRef((t, s) => {
    const {
        __scopeAvatar: a,
        src: r,
        onLoadingStatusChange: n = () => {},
        ...o
      } = t,
      c = jn(bn, a),
      l = Zd(r, o),
      m = Ls((u) => {
        n(u), c.onImageLoadingStatusChange(u);
      });
    return (
      gs(() => {
        l !== "idle" && m(l);
      }, [l, m]),
      l === "loaded" ? e.jsx(Ks.img, { ...o, ref: s, src: r }) : null
    );
  });
Xd.displayName = bn;
var Nn = "AvatarFallback",
  wn = d.forwardRef((t, s) => {
    const { __scopeAvatar: a, delayMs: r, ...n } = t,
      o = jn(Nn, a),
      [c, l] = d.useState(r === void 0);
    return (
      d.useEffect(() => {
        if (r !== void 0) {
          const m = window.setTimeout(() => l(!0), r);
          return () => window.clearTimeout(m);
        }
      }, [r]),
      c && o.imageLoadingStatus !== "loaded"
        ? e.jsx(Ks.span, { ...n, ref: s })
        : null
    );
  });
wn.displayName = Nn;
function Aa(t, s) {
  return t
    ? s
      ? (t.src !== s && (t.src = s),
        t.complete && t.naturalWidth > 0 ? "loaded" : "loading")
      : "error"
    : "idle";
}
function Zd(t, { referrerPolicy: s, crossOrigin: a }) {
  const r = Wd(),
    n = d.useRef(null),
    o = r ? (n.current || (n.current = new window.Image()), n.current) : null,
    [c, l] = d.useState(() => Aa(o, t));
  return (
    gs(() => {
      l(Aa(o, t));
    }, [o, t]),
    gs(() => {
      const m = (i) => () => {
        l(i);
      };
      if (!o) return;
      const u = m("loaded"),
        p = m("error");
      return (
        o.addEventListener("load", u),
        o.addEventListener("error", p),
        s && (o.referrerPolicy = s),
        typeof a == "string" && (o.crossOrigin = a),
        () => {
          o.removeEventListener("load", u), o.removeEventListener("error", p);
        }
      );
    }, [o, a, s]),
    c
  );
}
var Qd = yn,
  em = wn;
function kn({ className: t, ...s }) {
  return e.jsx(Qd, {
    "data-slot": "avatar",
    className: O(
      "relative flex size-10 shrink-0 overflow-hidden rounded-full",
      t
    ),
    ...s,
  });
}
function Cn({ className: t, ...s }) {
  return e.jsx(em, {
    "data-slot": "avatar-fallback",
    className: O(
      "bg-muted flex size-full items-center justify-center rounded-full",
      t
    ),
    ...s,
  });
}
var tm = {};
const sm = {
    SESSION_KEY:
      (typeof process < "u" && tm.NEXT_PUBLIC_SESSION_KEY) ||
      "apu-vote-session-key-2025",
  },
  am = sm.SESSION_KEY,
  Xs = "userSession",
  rm = 1440 * 60 * 1e3;
function nm(t, s) {
  let a = "";
  for (let r = 0; r < t.length; r++)
    a += String.fromCharCode(t.charCodeAt(r) ^ s.charCodeAt(r % s.length));
  return btoa(a);
}
function im(t, s) {
  const a = atob(t);
  let r = "";
  for (let n = 0; n < a.length; n++)
    r += String.fromCharCode(a.charCodeAt(n) ^ s.charCodeAt(n % s.length));
  return r;
}
function Sn() {
  return am;
}
function kt(t, s) {
  if (typeof window > "u") return;
  const a = Date.now(),
    r = { user: t, token: s, expiresAt: a + rm, createdAt: a };
  try {
    const n = nm(JSON.stringify(r), Sn());
    localStorage.setItem(Xs, n),
      localStorage.setItem("currentUser", JSON.stringify(t));
  } catch (n) {
    console.error("Error creating session:", n);
  }
}
function En() {
  if (typeof window > "u") return null;
  try {
    const t = localStorage.getItem(Xs);
    if (!t) return null;
    const s = im(t, Sn()),
      a = JSON.parse(s);
    return Date.now() > a.expiresAt ? (Ss(), null) : a;
  } catch (t) {
    return console.error("Error getting session:", t), Ss(), null;
  }
}
function Zs() {
  return En()?.user || null;
}
function Be() {
  return En() !== null;
}
function om() {
  return Zs()?.role === "admin";
}
function Ss() {
  typeof window > "u" ||
    (localStorage.removeItem(Xs),
    localStorage.removeItem("currentUser"),
    localStorage.removeItem("hasVoted"),
    localStorage.removeItem("voterRegistrationCompleted"));
}
const Es = [
    {
      id: "1",
      studentId: "TP12345",
      email: "student@apu.edu.my",
      firstName: "John",
      lastName: "Doe",
      department: "Computer Science",
      level: "Degree",
      password: "password123",
      role: "student",
      provider: "local",
    },
    {
      id: "2",
      studentId: "TP67890",
      email: "jane.smith@apu.edu.my",
      firstName: "Jane",
      lastName: "Smith",
      department: "Engineering",
      level: "Masters",
      password: "password123",
      role: "student",
      provider: "local",
    },
  ],
  lm = [
    {
      id: "admin1",
      email: "admin@apu.edu.my",
      firstName: "Admin",
      lastName: "User",
      department: "Administration",
      level: "Staff",
      password: "admin123",
      role: "admin",
      provider: "local",
    },
    {
      id: "admin2",
      email: "election@apu.edu.my",
      firstName: "Election",
      lastName: "Officer",
      department: "Student Affairs",
      level: "Staff",
      password: "election123",
      role: "admin",
      provider: "local",
    },
  ],
  _t = (t) => new Promise((s) => setTimeout(s, t)),
  Yt = {
    google: [
      {
        id: "google_123",
        email: "student.google@apu.edu.my",
        firstName: "Google",
        lastName: "Student",
        department: "Computer Science",
        level: "Degree",
        role: "student",
        provider: "google",
        profilePicture:
          "https://lh3.googleusercontent.com/a/default-user=s96-c",
      },
      {
        id: "google_456",
        email: "another.student@apu.edu.my",
        firstName: "Sarah",
        lastName: "Johnson",
        department: "Engineering",
        level: "Masters",
        role: "student",
        provider: "google",
        profilePicture:
          "https://lh3.googleusercontent.com/a/default-user=s96-c",
      },
    ],
    microsoft: [
      {
        id: "ms_789",
        email: "student.microsoft@apu.edu.my",
        firstName: "Microsoft",
        lastName: "Student",
        department: "Business",
        level: "Degree",
        role: "student",
        provider: "microsoft",
        profilePicture: "https://graph.microsoft.com/v1.0/me/photo/$value",
      },
      {
        id: "ms_101",
        email: "mike.wilson@apu.edu.my",
        firstName: "Mike",
        lastName: "Wilson",
        department: "Arts",
        level: "Foundation",
        role: "student",
        provider: "microsoft",
        profilePicture: "https://graph.microsoft.com/v1.0/me/photo/$value",
      },
    ],
  },
  cm = async (t) => {
    await _t(1e3);
    const s = Es.find(
      (a) => a.studentId === t.studentId && a.password === t.password
    );
    if (s) {
      const { password: a, ...r } = s,
        n = `student_token_${s.id}_${Date.now()}`;
      return kt(r, n), { success: !0, user: r, token: n };
    }
    return { success: !1, message: "Invalid student ID or password." };
  },
  dm = async (t) => {
    await _t(1200);
    const s = lm.find((a) => a.email === t.email && a.password === t.password);
    if (s) {
      const { password: a, ...r } = s,
        n = `admin_token_${s.id}_${Date.now()}`;
      return kt(r, n), { success: !0, user: r, token: n };
    }
    return { success: !1, message: "Invalid admin credentials." };
  },
  mm = async () => {
    await _t(2e3);
    const t = Yt.google[Math.floor(Math.random() * Yt.google.length)];
    return t.email.endsWith("@apu.edu.my")
      ? { success: !0, user: t, token: `google_token_${t.id}_${Date.now()}` }
      : {
          success: !1,
          message:
            "Please use your university Google account (@apu.edu.my) to sign in.",
        };
  },
  um = async () => {
    await _t(2200);
    const t = Yt.microsoft[Math.floor(Math.random() * Yt.microsoft.length)];
    return t.email.endsWith("@apu.edu.my")
      ? { success: !0, user: t, token: `microsoft_token_${t.id}_${Date.now()}` }
      : {
          success: !1,
          message:
            "Please use your university Microsoft account (@apu.edu.my) to sign in.",
        };
  },
  xm = async (t) => {
    if (
      (await _t(1500),
      Es.find((r) => r.studentId === t.studentId || r.email === t.email))
    )
      return {
        success: !1,
        message: "A user with this student ID or email already exists.",
      };
    const a = {
      id: `user_${Date.now()}`,
      studentId: t.studentId,
      email: t.email,
      firstName: t.firstName,
      lastName: t.lastName,
      department: t.department,
      level: t.level,
      role: "student",
      provider: "local",
    };
    return (
      Es.push({ ...a, password: t.password }),
      { success: !0, user: a, token: `student_token_${a.id}_${Date.now()}` }
    );
  },
  ss = () => Zs(),
  As = () => om(),
  hm = () => {
    Ss();
  },
  pm = (t) => {
    const s = ss();
    if (s) {
      const a = { ...s, ...t };
      localStorage.setItem("currentUser", JSON.stringify(a));
    }
  };
function Ce({ onNavigate: t }) {
  const [s, a] = d.useState(null);
  d.useEffect(() => {
    a(ss());
  }, []);
  const r = () => {
    hm(), a(null), t("home");
  };
  if (!s)
    return e.jsxs("div", {
      className: "flex items-center gap-4",
      children: [
        e.jsx(b, {
          variant: "outline",
          size: "sm",
          onClick: () => t("register"),
          children: "Register",
        }),
        e.jsx(b, {
          size: "sm",
          onClick: () => t("login"),
          children: "Sign In",
        }),
      ],
    });
  const n = `${s.firstName?.[0] || ""}${s.lastName?.[0] || ""}`.toUpperCase();
  return e.jsxs(Dd, {
    children: [
      e.jsx(Vd, {
        asChild: !0,
        children: e.jsx(b, {
          variant: "ghost",
          className: "relative h-8 w-8 rounded-full",
          children: e.jsx(kn, {
            className: "h-8 w-8",
            children: e.jsx(Cn, { children: n }),
          }),
        }),
      }),
      e.jsxs(gn, {
        className: "w-56",
        align: "end",
        forceMount: !0,
        children: [
          e.jsx(vn, {
            className: "font-normal",
            children: e.jsxs("div", {
              className: "flex flex-col space-y-1",
              children: [
                e.jsxs("p", {
                  className: "text-sm leading-none",
                  children: [s.firstName, " ", s.lastName],
                }),
                e.jsx("p", {
                  className: "text-xs leading-none text-slate-600",
                  children: s.email,
                }),
                s.studentId &&
                  e.jsxs("p", {
                    className: "text-xs leading-none text-slate-600",
                    children: ["ID: ", s.studentId],
                  }),
              ],
            }),
          }),
          e.jsx(Cs, {}),
          e.jsxs(pt, {
            onClick: () => t("elections"),
            className: "cursor-pointer",
            children: [
              e.jsx(ws, { className: "mr-2 h-4 w-4" }),
              e.jsx("span", { children: "Vote Now" }),
            ],
          }),
          !As() &&
            e.jsxs(pt, {
              onClick: () => t("voter"),
              className: "cursor-pointer",
              children: [
                e.jsx(St, { className: "mr-2 h-4 w-4" }),
                e.jsx("span", { children: "Dashboard" }),
              ],
            }),
          e.jsxs(pt, {
            onClick: () => t("settings"),
            className: "cursor-pointer",
            children: [
              e.jsx(rc, { className: "mr-2 h-4 w-4" }),
              e.jsx("span", { children: "Settings" }),
            ],
          }),
          As() &&
            e.jsxs(pt, {
              onClick: () => t("admin"),
              className: "cursor-pointer",
              children: [
                e.jsx(We, { className: "mr-2 h-4 w-4" }),
                e.jsx("span", { children: "Admin Dashboard" }),
              ],
            }),
          e.jsx(Cs, {}),
          e.jsxs(pt, {
            onClick: r,
            className: "cursor-pointer",
            children: [
              e.jsx(Hl, { className: "mr-2 h-4 w-4" }),
              e.jsx("span", { children: "Log out" }),
            ],
          }),
        ],
      }),
    ],
  });
}
const Ps = [
    {
      inputs: [
        { internalType: "uint256", name: "categoryId", type: "uint256" },
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "party", type: "string" },
      ],
      name: "addCandidate",
      outputs: [
        { internalType: "uint256", name: "newCandidateId", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "uint256",
          name: "categoryId",
          type: "uint256",
        },
        {
          indexed: !0,
          internalType: "uint256",
          name: "candidateId",
          type: "uint256",
        },
        { indexed: !1, internalType: "string", name: "name", type: "string" },
      ],
      name: "CandidateAdded",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "uint256",
          name: "categoryId",
          type: "uint256",
        },
        {
          indexed: !0,
          internalType: "uint256",
          name: "candidateId",
          type: "uint256",
        },
      ],
      name: "CandidateDeactivated",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "uint256",
          name: "categoryId",
          type: "uint256",
        },
        { indexed: !1, internalType: "string", name: "name", type: "string" },
      ],
      name: "CategoryCreated",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "uint256",
          name: "categoryId",
          type: "uint256",
        },
      ],
      name: "CategoryDeactivated",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "uint256",
          name: "categoryId",
          type: "uint256",
        },
        { indexed: !1, internalType: "string", name: "name", type: "string" },
        { indexed: !1, internalType: "bool", name: "isActive", type: "bool" },
      ],
      name: "CategoryUpdated",
      type: "event",
    },
    {
      inputs: [
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "description", type: "string" },
      ],
      name: "createCategory",
      outputs: [
        { internalType: "uint256", name: "newCategoryId", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "title", type: "string" },
        { internalType: "uint256", name: "startTime", type: "uint256" },
        { internalType: "uint256", name: "endTime", type: "uint256" },
      ],
      name: "createElection",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "categoryId", type: "uint256" },
        { internalType: "uint256", name: "candidateId", type: "uint256" },
      ],
      name: "deactivateCandidate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "categoryId", type: "uint256" },
      ],
      name: "deactivateCategory",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: !1,
      inputs: [
        { indexed: !1, internalType: "string", name: "title", type: "string" },
        {
          indexed: !1,
          internalType: "uint256",
          name: "startTime",
          type: "uint256",
        },
        {
          indexed: !1,
          internalType: "uint256",
          name: "endTime",
          type: "uint256",
        },
      ],
      name: "ElectionCreated",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !1,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      name: "ElectionEnded",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !1,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      name: "ElectionStarted",
      type: "event",
    },
    {
      inputs: [],
      name: "endElection",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "studentId", type: "string" },
        { internalType: "string", name: "department", type: "string" },
        { internalType: "uint256", name: "yearOfStudy", type: "uint256" },
      ],
      name: "registerVoter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "resetSystem",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "startElection",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !1,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      name: "SystemReset",
      type: "event",
    },
    {
      inputs: [
        { internalType: "uint256", name: "categoryId", type: "uint256" },
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "description", type: "string" },
        { internalType: "bool", name: "isActive", type: "bool" },
      ],
      name: "updateCategory",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "categoryId", type: "uint256" },
        { internalType: "uint256", name: "candidateId", type: "uint256" },
      ],
      name: "vote",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "address",
          name: "voter",
          type: "address",
        },
        {
          indexed: !0,
          internalType: "uint256",
          name: "categoryId",
          type: "uint256",
        },
        {
          indexed: !0,
          internalType: "uint256",
          name: "candidateId",
          type: "uint256",
        },
      ],
      name: "VoteCast",
      type: "event",
    },
    {
      anonymous: !1,
      inputs: [
        {
          indexed: !0,
          internalType: "address",
          name: "voterAddress",
          type: "address",
        },
        {
          indexed: !1,
          internalType: "string",
          name: "studentId",
          type: "string",
        },
      ],
      name: "VoterRegistered",
      type: "event",
    },
    {
      inputs: [],
      name: "admin",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "categoryCount",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "currentElection",
      outputs: [
        { internalType: "string", name: "title", type: "string" },
        { internalType: "uint256", name: "startTime", type: "uint256" },
        { internalType: "uint256", name: "endTime", type: "uint256" },
        {
          internalType: "enum VotingSystem.ElectionState",
          name: "state",
          type: "uint8",
        },
        { internalType: "uint256", name: "totalVoters", type: "uint256" },
        { internalType: "uint256", name: "totalVotes", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllCategories",
      outputs: [
        {
          components: [
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "description", type: "string" },
            { internalType: "bool", name: "isActive", type: "bool" },
            { internalType: "bool", name: "exists", type: "bool" },
          ],
          internalType: "struct VotingSystem.Category[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "categoryId", type: "uint256" },
      ],
      name: "getCandidatesForCategory",
      outputs: [
        { internalType: "uint256[]", name: "ids", type: "uint256[]" },
        { internalType: "string[]", name: "names", type: "string[]" },
        { internalType: "string[]", name: "parties", type: "string[]" },
        { internalType: "uint256[]", name: "votes", type: "uint256[]" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "categoryId", type: "uint256" },
      ],
      name: "getCategory",
      outputs: [
        { internalType: "uint256", name: "id", type: "uint256" },
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "description", type: "string" },
        { internalType: "bool", name: "isActive", type: "bool" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "voter", type: "address" },
        { internalType: "uint256", name: "categoryId", type: "uint256" },
      ],
      name: "hasVotedInCategory",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "registeredVoters",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
  ],
  fm = Object.freeze(
    Object.defineProperty(
      { __proto__: null, default: Ps },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
function gm(t) {
  if (typeof document > "u") return;
  let s = document.head || document.getElementsByTagName("head")[0],
    a = document.createElement("style");
  (a.type = "text/css"),
    s.appendChild(a),
    a.styleSheet
      ? (a.styleSheet.cssText = t)
      : a.appendChild(document.createTextNode(t));
}
const vm = (t) => {
    switch (t) {
      case "success":
        return bm;
      case "info":
        return wm;
      case "warning":
        return Nm;
      case "error":
        return km;
      default:
        return null;
    }
  },
  jm = Array(12).fill(0),
  ym = ({ visible: t, className: s }) =>
    S.createElement(
      "div",
      {
        className: ["sonner-loading-wrapper", s].filter(Boolean).join(" "),
        "data-visible": t,
      },
      S.createElement(
        "div",
        { className: "sonner-spinner" },
        jm.map((a, r) =>
          S.createElement("div", {
            className: "sonner-loading-bar",
            key: `spinner-bar-${r}`,
          })
        )
      )
    ),
  bm = S.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    S.createElement("path", {
      fillRule: "evenodd",
      d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
      clipRule: "evenodd",
    })
  ),
  Nm = S.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    S.createElement("path", {
      fillRule: "evenodd",
      d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
      clipRule: "evenodd",
    })
  ),
  wm = S.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    S.createElement("path", {
      fillRule: "evenodd",
      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
      clipRule: "evenodd",
    })
  ),
  km = S.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    S.createElement("path", {
      fillRule: "evenodd",
      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
      clipRule: "evenodd",
    })
  ),
  Cm = S.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    S.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    S.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
  ),
  Sm = () => {
    const [t, s] = S.useState(document.hidden);
    return (
      S.useEffect(() => {
        const a = () => {
          s(document.hidden);
        };
        return (
          document.addEventListener("visibilitychange", a),
          () => window.removeEventListener("visibilitychange", a)
        );
      }, []),
      t
    );
  };
let Ts = 1;
class Em {
  constructor() {
    (this.subscribe = (s) => (
      this.subscribers.push(s),
      () => {
        const a = this.subscribers.indexOf(s);
        this.subscribers.splice(a, 1);
      }
    )),
      (this.publish = (s) => {
        this.subscribers.forEach((a) => a(s));
      }),
      (this.addToast = (s) => {
        this.publish(s), (this.toasts = [...this.toasts, s]);
      }),
      (this.create = (s) => {
        var a;
        const { message: r, ...n } = s,
          o =
            typeof s?.id == "number" ||
            ((a = s.id) == null ? void 0 : a.length) > 0
              ? s.id
              : Ts++,
          c = this.toasts.find((m) => m.id === o),
          l = s.dismissible === void 0 ? !0 : s.dismissible;
        return (
          this.dismissedToasts.has(o) && this.dismissedToasts.delete(o),
          c
            ? (this.toasts = this.toasts.map((m) =>
                m.id === o
                  ? (this.publish({ ...m, ...s, id: o, title: r }),
                    { ...m, ...s, id: o, dismissible: l, title: r })
                  : m
              ))
            : this.addToast({ title: r, ...n, dismissible: l, id: o }),
          o
        );
      }),
      (this.dismiss = (s) => (
        s
          ? (this.dismissedToasts.add(s),
            requestAnimationFrame(() =>
              this.subscribers.forEach((a) => a({ id: s, dismiss: !0 }))
            ))
          : this.toasts.forEach((a) => {
              this.subscribers.forEach((r) => r({ id: a.id, dismiss: !0 }));
            }),
        s
      )),
      (this.message = (s, a) => this.create({ ...a, message: s })),
      (this.error = (s, a) => this.create({ ...a, message: s, type: "error" })),
      (this.success = (s, a) =>
        this.create({ ...a, type: "success", message: s })),
      (this.info = (s, a) => this.create({ ...a, type: "info", message: s })),
      (this.warning = (s, a) =>
        this.create({ ...a, type: "warning", message: s })),
      (this.loading = (s, a) =>
        this.create({ ...a, type: "loading", message: s })),
      (this.promise = (s, a) => {
        if (!a) return;
        let r;
        a.loading !== void 0 &&
          (r = this.create({
            ...a,
            promise: s,
            type: "loading",
            message: a.loading,
            description:
              typeof a.description != "function" ? a.description : void 0,
          }));
        const n = Promise.resolve(s instanceof Function ? s() : s);
        let o = r !== void 0,
          c;
        const l = n
            .then(async (u) => {
              if (((c = ["resolve", u]), S.isValidElement(u)))
                (o = !1), this.create({ id: r, type: "default", message: u });
              else if (Pm(u) && !u.ok) {
                o = !1;
                const i =
                    typeof a.error == "function"
                      ? await a.error(`HTTP error! status: ${u.status}`)
                      : a.error,
                  x =
                    typeof a.description == "function"
                      ? await a.description(`HTTP error! status: ${u.status}`)
                      : a.description,
                  g =
                    typeof i == "object" && !S.isValidElement(i)
                      ? i
                      : { message: i };
                this.create({ id: r, type: "error", description: x, ...g });
              } else if (u instanceof Error) {
                o = !1;
                const i =
                    typeof a.error == "function" ? await a.error(u) : a.error,
                  x =
                    typeof a.description == "function"
                      ? await a.description(u)
                      : a.description,
                  g =
                    typeof i == "object" && !S.isValidElement(i)
                      ? i
                      : { message: i };
                this.create({ id: r, type: "error", description: x, ...g });
              } else if (a.success !== void 0) {
                o = !1;
                const i =
                    typeof a.success == "function"
                      ? await a.success(u)
                      : a.success,
                  x =
                    typeof a.description == "function"
                      ? await a.description(u)
                      : a.description,
                  g =
                    typeof i == "object" && !S.isValidElement(i)
                      ? i
                      : { message: i };
                this.create({ id: r, type: "success", description: x, ...g });
              }
            })
            .catch(async (u) => {
              if (((c = ["reject", u]), a.error !== void 0)) {
                o = !1;
                const p =
                    typeof a.error == "function" ? await a.error(u) : a.error,
                  i =
                    typeof a.description == "function"
                      ? await a.description(u)
                      : a.description,
                  j =
                    typeof p == "object" && !S.isValidElement(p)
                      ? p
                      : { message: p };
                this.create({ id: r, type: "error", description: i, ...j });
              }
            })
            .finally(() => {
              o && (this.dismiss(r), (r = void 0)),
                a.finally == null || a.finally.call(a);
            }),
          m = () =>
            new Promise((u, p) =>
              l.then(() => (c[0] === "reject" ? p(c[1]) : u(c[1]))).catch(p)
            );
        return typeof r != "string" && typeof r != "number"
          ? { unwrap: m }
          : Object.assign(r, { unwrap: m });
      }),
      (this.custom = (s, a) => {
        const r = a?.id || Ts++;
        return this.create({ jsx: s(r), id: r, ...a }), r;
      }),
      (this.getActiveToasts = () =>
        this.toasts.filter((s) => !this.dismissedToasts.has(s.id))),
      (this.subscribers = []),
      (this.toasts = []),
      (this.dismissedToasts = new Set());
  }
}
const ke = new Em(),
  Am = (t, s) => {
    const a = s?.id || Ts++;
    return ke.addToast({ title: t, ...s, id: a }), a;
  },
  Pm = (t) =>
    t &&
    typeof t == "object" &&
    "ok" in t &&
    typeof t.ok == "boolean" &&
    "status" in t &&
    typeof t.status == "number",
  Tm = Am,
  Mm = () => ke.toasts,
  Rm = () => ke.getActiveToasts(),
  M = Object.assign(
    Tm,
    {
      success: ke.success,
      info: ke.info,
      warning: ke.warning,
      error: ke.error,
      custom: ke.custom,
      message: ke.message,
      promise: ke.promise,
      dismiss: ke.dismiss,
      loading: ke.loading,
    },
    { getHistory: Mm, getToasts: Rm }
  );
gm(
  "[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}"
);
function zt(t) {
  return t.label !== void 0;
}
const _m = 3,
  Im = "24px",
  Dm = "16px",
  Pa = 4e3,
  Vm = 356,
  Lm = 14,
  Om = 45,
  $m = 200;
function Ve(...t) {
  return t.filter(Boolean).join(" ");
}
function Fm(t) {
  const [s, a] = t.split("-"),
    r = [];
  return s && r.push(s), a && r.push(a), r;
}
const zm = (t) => {
  var s, a, r, n, o, c, l, m, u;
  const {
      invert: p,
      toast: i,
      unstyled: x,
      interacting: j,
      setHeights: g,
      visibleToasts: v,
      heights: T,
      index: y,
      toasts: E,
      expanded: R,
      removeToast: F,
      defaultRichColors: f,
      closeButton: B,
      style: oe,
      cancelButtonStyle: C,
      actionButtonStyle: L,
      className: H = "",
      descriptionClassName: ne = "",
      duration: X,
      position: Z,
      gap: ee,
      expandByDefault: le,
      classNames: $,
      icons: te,
      closeButtonAriaLabel: h = "Close toast",
    } = t,
    [k, G] = S.useState(null),
    [re, ue] = S.useState(null),
    [D, q] = S.useState(!1),
    [se, ce] = S.useState(!1),
    [z, ae] = S.useState(!1),
    [Me, He] = S.useState(!1),
    [Ye, Re] = S.useState(!1),
    [di, os] = S.useState(0),
    [mi, aa] = S.useState(0),
    bt = S.useRef(i.duration || X || Pa),
    ra = S.useRef(null),
    Ge = S.useRef(null),
    ui = y === 0,
    xi = y + 1 <= v,
    Se = i.type,
    dt = i.dismissible !== !1,
    hi = i.className || "",
    pi = i.descriptionClassName || "",
    Dt = S.useMemo(
      () => T.findIndex((W) => W.toastId === i.id) || 0,
      [T, i.id]
    ),
    fi = S.useMemo(() => {
      var W;
      return (W = i.closeButton) != null ? W : B;
    }, [i.closeButton, B]),
    na = S.useMemo(() => i.duration || X || Pa, [i.duration, X]),
    ls = S.useRef(0),
    mt = S.useRef(0),
    ia = S.useRef(0),
    ut = S.useRef(null),
    [gi, vi] = Z.split("-"),
    oa = S.useMemo(
      () => T.reduce((W, xe, ve) => (ve >= Dt ? W : W + xe.height), 0),
      [T, Dt]
    ),
    la = Sm(),
    ji = i.invert || p,
    cs = Se === "loading";
  (mt.current = S.useMemo(() => Dt * ee + oa, [Dt, oa])),
    S.useEffect(() => {
      bt.current = na;
    }, [na]),
    S.useEffect(() => {
      q(!0);
    }, []),
    S.useEffect(() => {
      const W = Ge.current;
      if (W) {
        const xe = W.getBoundingClientRect().height;
        return (
          aa(xe),
          g((ve) => [
            { toastId: i.id, height: xe, position: i.position },
            ...ve,
          ]),
          () => g((ve) => ve.filter((Ee) => Ee.toastId !== i.id))
        );
      }
    }, [g, i.id]),
    S.useLayoutEffect(() => {
      if (!D) return;
      const W = Ge.current,
        xe = W.style.height;
      W.style.height = "auto";
      const ve = W.getBoundingClientRect().height;
      (W.style.height = xe),
        aa(ve),
        g((Ee) =>
          Ee.find((he) => he.toastId === i.id)
            ? Ee.map((he) => (he.toastId === i.id ? { ...he, height: ve } : he))
            : [{ toastId: i.id, height: ve, position: i.position }, ...Ee]
        );
    }, [D, i.title, i.description, g, i.id, i.jsx, i.action, i.cancel]);
  const Ke = S.useCallback(() => {
    ce(!0),
      os(mt.current),
      g((W) => W.filter((xe) => xe.toastId !== i.id)),
      setTimeout(() => {
        F(i);
      }, $m);
  }, [i, F, g, mt]);
  S.useEffect(() => {
    if (
      (i.promise && Se === "loading") ||
      i.duration === 1 / 0 ||
      i.type === "loading"
    )
      return;
    let W;
    return (
      R || j || la
        ? (() => {
            if (ia.current < ls.current) {
              const Ee = new Date().getTime() - ls.current;
              bt.current = bt.current - Ee;
            }
            ia.current = new Date().getTime();
          })()
        : (() => {
            bt.current !== 1 / 0 &&
              ((ls.current = new Date().getTime()),
              (W = setTimeout(() => {
                i.onAutoClose == null || i.onAutoClose.call(i, i), Ke();
              }, bt.current)));
          })(),
      () => clearTimeout(W)
    );
  }, [R, j, i, Se, la, Ke]),
    S.useEffect(() => {
      i.delete && (Ke(), i.onDismiss == null || i.onDismiss.call(i, i));
    }, [Ke, i.delete]);
  function yi() {
    var W;
    if (te?.loading) {
      var xe;
      return S.createElement(
        "div",
        {
          className: Ve(
            $?.loader,
            i == null || (xe = i.classNames) == null ? void 0 : xe.loader,
            "sonner-loader"
          ),
          "data-visible": Se === "loading",
        },
        te.loading
      );
    }
    return S.createElement(ym, {
      className: Ve(
        $?.loader,
        i == null || (W = i.classNames) == null ? void 0 : W.loader
      ),
      visible: Se === "loading",
    });
  }
  const bi = i.icon || te?.[Se] || vm(Se);
  var ca, da;
  return S.createElement(
    "li",
    {
      tabIndex: 0,
      ref: Ge,
      className: Ve(
        H,
        hi,
        $?.toast,
        i == null || (s = i.classNames) == null ? void 0 : s.toast,
        $?.default,
        $?.[Se],
        i == null || (a = i.classNames) == null ? void 0 : a[Se]
      ),
      "data-sonner-toast": "",
      "data-rich-colors": (ca = i.richColors) != null ? ca : f,
      "data-styled": !(i.jsx || i.unstyled || x),
      "data-mounted": D,
      "data-promise": !!i.promise,
      "data-swiped": Ye,
      "data-removed": se,
      "data-visible": xi,
      "data-y-position": gi,
      "data-x-position": vi,
      "data-index": y,
      "data-front": ui,
      "data-swiping": z,
      "data-dismissible": dt,
      "data-type": Se,
      "data-invert": ji,
      "data-swipe-out": Me,
      "data-swipe-direction": re,
      "data-expanded": !!(R || (le && D)),
      "data-testid": i.testId,
      style: {
        "--index": y,
        "--toasts-before": y,
        "--z-index": E.length - y,
        "--offset": `${se ? di : mt.current}px`,
        "--initial-height": le ? "auto" : `${mi}px`,
        ...oe,
        ...i.style,
      },
      onDragEnd: () => {
        ae(!1), G(null), (ut.current = null);
      },
      onPointerDown: (W) => {
        W.button !== 2 &&
          (cs ||
            !dt ||
            ((ra.current = new Date()),
            os(mt.current),
            W.target.setPointerCapture(W.pointerId),
            W.target.tagName !== "BUTTON" &&
              (ae(!0), (ut.current = { x: W.clientX, y: W.clientY }))));
      },
      onPointerUp: () => {
        var W, xe, ve;
        if (Me || !dt) return;
        ut.current = null;
        const Ee = Number(
            ((W = Ge.current) == null
              ? void 0
              : W.style
                  .getPropertyValue("--swipe-amount-x")
                  .replace("px", "")) || 0
          ),
          Vt = Number(
            ((xe = Ge.current) == null
              ? void 0
              : xe.style
                  .getPropertyValue("--swipe-amount-y")
                  .replace("px", "")) || 0
          ),
          he =
            new Date().getTime() -
            ((ve = ra.current) == null ? void 0 : ve.getTime()),
          Pe = k === "x" ? Ee : Vt,
          Lt = Math.abs(Pe) / he;
        if (Math.abs(Pe) >= Om || Lt > 0.11) {
          os(mt.current),
            i.onDismiss == null || i.onDismiss.call(i, i),
            ue(
              k === "x" ? (Ee > 0 ? "right" : "left") : Vt > 0 ? "down" : "up"
            ),
            Ke(),
            He(!0);
          return;
        } else {
          var _e, Ie;
          (_e = Ge.current) == null ||
            _e.style.setProperty("--swipe-amount-x", "0px"),
            (Ie = Ge.current) == null ||
              Ie.style.setProperty("--swipe-amount-y", "0px");
        }
        Re(!1), ae(!1), G(null);
      },
      onPointerMove: (W) => {
        var xe, ve, Ee;
        if (
          !ut.current ||
          !dt ||
          ((xe = window.getSelection()) == null
            ? void 0
            : xe.toString().length) > 0
        )
          return;
        const he = W.clientY - ut.current.y,
          Pe = W.clientX - ut.current.x;
        var Lt;
        const _e = (Lt = t.swipeDirections) != null ? Lt : Fm(Z);
        !k &&
          (Math.abs(Pe) > 1 || Math.abs(he) > 1) &&
          G(Math.abs(Pe) > Math.abs(he) ? "x" : "y");
        let Ie = { x: 0, y: 0 };
        const ma = (et) => 1 / (1.5 + Math.abs(et) / 20);
        if (k === "y") {
          if (_e.includes("top") || _e.includes("bottom"))
            if (
              (_e.includes("top") && he < 0) ||
              (_e.includes("bottom") && he > 0)
            )
              Ie.y = he;
            else {
              const et = he * ma(he);
              Ie.y = Math.abs(et) < Math.abs(he) ? et : he;
            }
        } else if (k === "x" && (_e.includes("left") || _e.includes("right")))
          if (
            (_e.includes("left") && Pe < 0) ||
            (_e.includes("right") && Pe > 0)
          )
            Ie.x = Pe;
          else {
            const et = Pe * ma(Pe);
            Ie.x = Math.abs(et) < Math.abs(Pe) ? et : Pe;
          }
        (Math.abs(Ie.x) > 0 || Math.abs(Ie.y) > 0) && Re(!0),
          (ve = Ge.current) == null ||
            ve.style.setProperty("--swipe-amount-x", `${Ie.x}px`),
          (Ee = Ge.current) == null ||
            Ee.style.setProperty("--swipe-amount-y", `${Ie.y}px`);
      },
    },
    fi && !i.jsx && Se !== "loading"
      ? S.createElement(
          "button",
          {
            "aria-label": h,
            "data-disabled": cs,
            "data-close-button": !0,
            onClick:
              cs || !dt
                ? () => {}
                : () => {
                    Ke(), i.onDismiss == null || i.onDismiss.call(i, i);
                  },
            className: Ve(
              $?.closeButton,
              i == null || (r = i.classNames) == null ? void 0 : r.closeButton
            ),
          },
          (da = te?.close) != null ? da : Cm
        )
      : null,
    (Se || i.icon || i.promise) &&
      i.icon !== null &&
      (te?.[Se] !== null || i.icon)
      ? S.createElement(
          "div",
          {
            "data-icon": "",
            className: Ve(
              $?.icon,
              i == null || (n = i.classNames) == null ? void 0 : n.icon
            ),
          },
          i.promise || (i.type === "loading" && !i.icon)
            ? i.icon || yi()
            : null,
          i.type !== "loading" ? bi : null
        )
      : null,
    S.createElement(
      "div",
      {
        "data-content": "",
        className: Ve(
          $?.content,
          i == null || (o = i.classNames) == null ? void 0 : o.content
        ),
      },
      S.createElement(
        "div",
        {
          "data-title": "",
          className: Ve(
            $?.title,
            i == null || (c = i.classNames) == null ? void 0 : c.title
          ),
        },
        i.jsx ? i.jsx : typeof i.title == "function" ? i.title() : i.title
      ),
      i.description
        ? S.createElement(
            "div",
            {
              "data-description": "",
              className: Ve(
                ne,
                pi,
                $?.description,
                i == null || (l = i.classNames) == null ? void 0 : l.description
              ),
            },
            typeof i.description == "function" ? i.description() : i.description
          )
        : null
    ),
    S.isValidElement(i.cancel)
      ? i.cancel
      : i.cancel && zt(i.cancel)
      ? S.createElement(
          "button",
          {
            "data-button": !0,
            "data-cancel": !0,
            style: i.cancelButtonStyle || C,
            onClick: (W) => {
              zt(i.cancel) &&
                dt &&
                (i.cancel.onClick == null || i.cancel.onClick.call(i.cancel, W),
                Ke());
            },
            className: Ve(
              $?.cancelButton,
              i == null || (m = i.classNames) == null ? void 0 : m.cancelButton
            ),
          },
          i.cancel.label
        )
      : null,
    S.isValidElement(i.action)
      ? i.action
      : i.action && zt(i.action)
      ? S.createElement(
          "button",
          {
            "data-button": !0,
            "data-action": !0,
            style: i.actionButtonStyle || L,
            onClick: (W) => {
              zt(i.action) &&
                (i.action.onClick == null || i.action.onClick.call(i.action, W),
                !W.defaultPrevented && Ke());
            },
            className: Ve(
              $?.actionButton,
              i == null || (u = i.classNames) == null ? void 0 : u.actionButton
            ),
          },
          i.action.label
        )
      : null
  );
};
function Ta() {
  if (typeof window > "u" || typeof document > "u") return "ltr";
  const t = document.documentElement.getAttribute("dir");
  return t === "auto" || !t
    ? window.getComputedStyle(document.documentElement).direction
    : t;
}
function Um(t, s) {
  const a = {};
  return (
    [t, s].forEach((r, n) => {
      const o = n === 1,
        c = o ? "--mobile-offset" : "--offset",
        l = o ? Dm : Im;
      function m(u) {
        ["top", "right", "bottom", "left"].forEach((p) => {
          a[`${c}-${p}`] = typeof u == "number" ? `${u}px` : u;
        });
      }
      typeof r == "number" || typeof r == "string"
        ? m(r)
        : typeof r == "object"
        ? ["top", "right", "bottom", "left"].forEach((u) => {
            r[u] === void 0
              ? (a[`${c}-${u}`] = l)
              : (a[`${c}-${u}`] = typeof r[u] == "number" ? `${r[u]}px` : r[u]);
          })
        : m(l);
    }),
    a
  );
}
const Bm = S.forwardRef(function (s, a) {
    const {
        id: r,
        invert: n,
        position: o = "bottom-right",
        hotkey: c = ["altKey", "KeyT"],
        expand: l,
        closeButton: m,
        className: u,
        offset: p,
        mobileOffset: i,
        theme: x = "light",
        richColors: j,
        duration: g,
        style: v,
        visibleToasts: T = _m,
        toastOptions: y,
        dir: E = Ta(),
        gap: R = Lm,
        icons: F,
        containerAriaLabel: f = "Notifications",
      } = s,
      [B, oe] = S.useState([]),
      C = S.useMemo(
        () =>
          r
            ? B.filter((D) => D.toasterId === r)
            : B.filter((D) => !D.toasterId),
        [B, r]
      ),
      L = S.useMemo(
        () =>
          Array.from(
            new Set(
              [o].concat(C.filter((D) => D.position).map((D) => D.position))
            )
          ),
        [C, o]
      ),
      [H, ne] = S.useState([]),
      [X, Z] = S.useState(!1),
      [ee, le] = S.useState(!1),
      [$, te] = S.useState(
        x !== "system"
          ? x
          : typeof window < "u" &&
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      ),
      h = S.useRef(null),
      k = c.join("+").replace(/Key/g, "").replace(/Digit/g, ""),
      G = S.useRef(null),
      re = S.useRef(!1),
      ue = S.useCallback((D) => {
        oe((q) => {
          var se;
          return (
            ((se = q.find((ce) => ce.id === D.id)) != null && se.delete) ||
              ke.dismiss(D.id),
            q.filter(({ id: ce }) => ce !== D.id)
          );
        });
      }, []);
    return (
      S.useEffect(
        () =>
          ke.subscribe((D) => {
            if (D.dismiss) {
              requestAnimationFrame(() => {
                oe((q) =>
                  q.map((se) => (se.id === D.id ? { ...se, delete: !0 } : se))
                );
              });
              return;
            }
            setTimeout(() => {
              Ii.flushSync(() => {
                oe((q) => {
                  const se = q.findIndex((ce) => ce.id === D.id);
                  return se !== -1
                    ? [
                        ...q.slice(0, se),
                        { ...q[se], ...D },
                        ...q.slice(se + 1),
                      ]
                    : [D, ...q];
                });
              });
            });
          }),
        [B]
      ),
      S.useEffect(() => {
        if (x !== "system") {
          te(x);
          return;
        }
        if (
          (x === "system" &&
            (window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
              ? te("dark")
              : te("light")),
          typeof window > "u")
        )
          return;
        const D = window.matchMedia("(prefers-color-scheme: dark)");
        try {
          D.addEventListener("change", ({ matches: q }) => {
            te(q ? "dark" : "light");
          });
        } catch {
          D.addListener(({ matches: se }) => {
            try {
              te(se ? "dark" : "light");
            } catch (ce) {
              console.error(ce);
            }
          });
        }
      }, [x]),
      S.useEffect(() => {
        B.length <= 1 && Z(!1);
      }, [B]),
      S.useEffect(() => {
        const D = (q) => {
          var se;
          if (c.every((ae) => q[ae] || q.code === ae)) {
            var z;
            Z(!0), (z = h.current) == null || z.focus();
          }
          q.code === "Escape" &&
            (document.activeElement === h.current ||
              ((se = h.current) != null &&
                se.contains(document.activeElement))) &&
            Z(!1);
        };
        return (
          document.addEventListener("keydown", D),
          () => document.removeEventListener("keydown", D)
        );
      }, [c]),
      S.useEffect(() => {
        if (h.current)
          return () => {
            G.current &&
              (G.current.focus({ preventScroll: !0 }),
              (G.current = null),
              (re.current = !1));
          };
      }, [h.current]),
      S.createElement(
        "section",
        {
          ref: a,
          "aria-label": `${f} ${k}`,
          tabIndex: -1,
          "aria-live": "polite",
          "aria-relevant": "additions text",
          "aria-atomic": "false",
          suppressHydrationWarning: !0,
        },
        L.map((D, q) => {
          var se;
          const [ce, z] = D.split("-");
          return C.length
            ? S.createElement(
                "ol",
                {
                  key: D,
                  dir: E === "auto" ? Ta() : E,
                  tabIndex: -1,
                  ref: h,
                  className: u,
                  "data-sonner-toaster": !0,
                  "data-sonner-theme": $,
                  "data-y-position": ce,
                  "data-x-position": z,
                  style: {
                    "--front-toast-height": `${
                      ((se = H[0]) == null ? void 0 : se.height) || 0
                    }px`,
                    "--width": `${Vm}px`,
                    "--gap": `${R}px`,
                    ...v,
                    ...Um(p, i),
                  },
                  onBlur: (ae) => {
                    re.current &&
                      !ae.currentTarget.contains(ae.relatedTarget) &&
                      ((re.current = !1),
                      G.current &&
                        (G.current.focus({ preventScroll: !0 }),
                        (G.current = null)));
                  },
                  onFocus: (ae) => {
                    (ae.target instanceof HTMLElement &&
                      ae.target.dataset.dismissible === "false") ||
                      re.current ||
                      ((re.current = !0), (G.current = ae.relatedTarget));
                  },
                  onMouseEnter: () => Z(!0),
                  onMouseMove: () => Z(!0),
                  onMouseLeave: () => {
                    ee || Z(!1);
                  },
                  onDragEnd: () => Z(!1),
                  onPointerDown: (ae) => {
                    (ae.target instanceof HTMLElement &&
                      ae.target.dataset.dismissible === "false") ||
                      le(!0);
                  },
                  onPointerUp: () => le(!1),
                },
                C.filter(
                  (ae) => (!ae.position && q === 0) || ae.position === D
                ).map((ae, Me) => {
                  var He, Ye;
                  return S.createElement(zm, {
                    key: ae.id,
                    icons: F,
                    index: Me,
                    toast: ae,
                    defaultRichColors: j,
                    duration: (He = y?.duration) != null ? He : g,
                    className: y?.className,
                    descriptionClassName: y?.descriptionClassName,
                    invert: n,
                    visibleToasts: T,
                    closeButton: (Ye = y?.closeButton) != null ? Ye : m,
                    interacting: ee,
                    position: D,
                    style: y?.style,
                    unstyled: y?.unstyled,
                    classNames: y?.classNames,
                    cancelButtonStyle: y?.cancelButtonStyle,
                    actionButtonStyle: y?.actionButtonStyle,
                    closeButtonAriaLabel: y?.closeButtonAriaLabel,
                    removeToast: ue,
                    toasts: C.filter((Re) => Re.position == ae.position),
                    heights: H.filter((Re) => Re.position == ae.position),
                    setHeights: ne,
                    expandByDefault: l,
                    gap: R,
                    expanded: X,
                    swipeDirections: s.swipeDirections,
                  });
                })
              )
            : null;
        })
      )
    );
  }),
  Ms = "0x7E7B7e71ae3D0b1E2E75701929E6885c7b5a4B91",
  Qs = () => {
    if (typeof window > "u" || !window.ethereum)
      throw new Error("MetaMask is not available");
    return new fo(window.ethereum);
  },
  Ae = async (t = !1) => {
    const s = Qs();
    if (t) {
      const a = await s.getSigner();
      return new xa(Ms, Ps, a);
    }
    return new xa(Ms, Ps, s);
  },
  An = async () => {
    const t = Qs();
    return (
      await t.send("eth_requestAccounts", []),
      (await t.getSigner()).getAddress()
    );
  },
  Pn = async (t, s, a) => {
    const n = await (await Ae(!0)).createElection(t, s, a);
    M.info("Creating election..."),
      await n.wait(),
      M.success("Election created");
  },
  Tn = async () => {
    const s = await (await Ae(!0)).startElection();
    M.info("Starting election..."),
      await s.wait(),
      M.success("Election started");
  },
  Mn = async () => {
    const s = await (await Ae(!0)).endElection();
    M.info("Ending election..."), await s.wait(), M.success("Election ended");
  },
  Rn = async () => {
    const s = await (await Ae(!0)).resetSystem();
    M.info("Resetting system..."), await s.wait(), M.success("System reset");
  },
  It = async () => {
    const s = await (await Ae(!1)).currentElection(),
      a = Number(s.state);
    return {
      title: s.title,
      startTime: Number(s.startTime),
      endTime: Number(s.endTime),
      state: a,
      totalVoters: Number(s.totalVoters),
      totalVotes: Number(s.totalVotes),
      isNone: a === 0,
      isCreated: a === 1,
      isActive: a === 2,
      hasEnded: a === 3,
    };
  },
  _n = It,
  In = async (t, s) => {
    const r = await (await Ae(!0)).createCategory(t, s);
    M.info("Creating category...");
    const n = await r.wait();
    let o = 0;
    try {
      const c = n.logs.find((l) => l.fragment?.name === "CategoryCreated");
      c?.args?.categoryId !== void 0 && (o = Number(c.args.categoryId));
    } catch {}
    return { categoryId: o, txHash: n.hash };
  },
  as = async () =>
    (await (await Ae(!1)).getAllCategories()).map((a) => ({
      id: Number(a.id),
      name: a.name,
      description: a.description,
      isActive: !!a.isActive,
    })),
  Dn = async (t, s, a) => {
    const n = await (await Ae(!0)).addCandidate(t, s, a);
    M.info("Adding candidate...");
    const o = await n.wait();
    let c = 0;
    try {
      const l = o.logs.find((m) => m.fragment?.name === "CandidateAdded");
      l?.args?.candidateId !== void 0 && (c = Number(l.args.candidateId));
    } catch {}
    return { candidateId: c, txHash: o.hash };
  },
  Vn = async (t, s) => {
    const r = await (await Ae(!0)).deactivateCandidate(t, s);
    M.info("Deactivating candidate..."),
      await r.wait(),
      M.success("Candidate deactivated");
  },
  rs = async (t) => {
    const s = await Ae(!1),
      [a, r, n, o] = await s.getCandidatesForCategory(t);
    return a.map((c, l) => ({
      id: Number(c),
      name: r[l],
      party: n[l],
      votes: Number(o[l]),
    }));
  },
  Ln = async (t, s, a) => {
    const n = await (await Ae(!0)).registerVoter(t, s, a);
    M.info("Registering voter..."),
      await n.wait(),
      M.success("Voter registered");
  },
  On = async () => {
    try {
      if (localStorage.getItem("voterRegistrationCompleted") === "true")
        return console.log("✅ Voter registered (localStorage check)"), !0;
      const r = await (await Qs().getSigner()).getAddress(),
        c = (await (await Ae(!1)).voters(r)).isRegistered === !0;
      return console.log(`Blockchain check for ${r}:`, c), c;
    } catch (t) {
      return (
        console.error("Error checking voter registration:", t),
        localStorage.getItem("voterRegistrationCompleted") === "true"
          ? (console.log("✅ Using localStorage fallback"), !0)
          : !1
      );
    }
  },
  $n = async (t, s) => {
    const r = await (await Ae(!0)).vote(t, s);
    M.info("Submitting vote..."), await r.wait(), M.success("Vote recorded");
  },
  Hm = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        CONTRACT_ADDRESS: Ms,
        addCandidate: Dn,
        castVote: $n,
        connectWallet: An,
        createCategory: In,
        createElection: Pn,
        deactivateCandidate: Vn,
        endElection: Mn,
        getAllCategories: as,
        getCandidatesForCategory: rs,
        getElectionInfo: _n,
        getElectionState: It,
        isVoterRegistered: On,
        registerVoter: Ln,
        resetSystem: Rn,
        startElection: Tn,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  Gm = "/apu-logo.png";
function qm({ onNavigate: t }) {
  const s = Be(),
    [a, r] = d.useState(null),
    [n, o] = d.useState(!0);
  d.useEffect(() => {
    (async () => {
      try {
        if (typeof window > "u" || !window.ethereum)
          throw new Error("MetaMask not available");
        const m = await It(),
          u = m.startTime ? new Date(m.startTime * 1e3) : null,
          p = m.endTime ? new Date(m.endTime * 1e3) : null;
        let i = "Not Available",
          x = !1;
        m.state === 0
          ? (i = "No Election")
          : m.state === 1
          ? (i = "Setup Phase")
          : m.state === 2
          ? ((i = "Active"), (x = !0))
          : m.state === 3 && (i = "Ended"),
          r({
            title: m.title || "No Active Election",
            status: i,
            startDate: u
              ? u.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "TBD",
            endDate: p
              ? p.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "TBD",
            votesCount: m.totalVotes || 0,
            isActive: x,
          });
      } catch (m) {
        console.error("Failed to fetch election data from blockchain:", m),
          r({
            title: "No Active Election",
            status: "Not Available",
            startDate: "TBD",
            endDate: "TBD",
            votesCount: 0,
            isActive: !1,
          });
      } finally {
        o(!1);
      }
    })();
  }, []);
  const c = () => {
    s
      ? t("vote")
      : (localStorage.setItem("intendedDestination", "vote"), t("login"));
  };
  return e.jsxs("div", {
    className:
      "flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white",
    children: [
      e.jsx("header", {
        className: "border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-2 w-48",
              children: [
                e.jsx("img", {
                  src: Gm,
                  alt: "APU Logo",
                  className: "h-8 w-8",
                }),
                e.jsx("span", {
                  className: "text-slate-900",
                  children: "APU VOTE",
                }),
              ],
            }),
            e.jsxs("nav", {
              className: "hidden md:flex gap-6 flex-1 justify-center",
              children: [
                e.jsx("button", {
                  onClick: () => t("home"),
                  className: "text-sm font-normal text-primary",
                  children: "Home",
                }),
                e.jsx("button", {
                  onClick: c,
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Elections",
                }),
                e.jsx("button", {
                  onClick: () => t("results"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Results",
                }),
                e.jsx("button", {
                  onClick: () => t("about"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "About",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Contact",
                }),
              ],
            }),
            e.jsx("div", {
              className: "flex items-center gap-3 w-48 justify-end",
              children: s
                ? e.jsx(Ce, { onNavigate: t })
                : e.jsxs(e.Fragment, {
                    children: [
                      e.jsx(b, {
                        variant: "ghost",
                        onClick: () => t("register"),
                        className: "text-slate-900",
                        children: "Register",
                      }),
                      e.jsx(b, {
                        onClick: () => t("login"),
                        className: "bg-slate-900 hover:bg-slate-800 text-white",
                        children: "Sign In",
                      }),
                    ],
                  }),
            }),
          ],
        }),
      }),
      e.jsxs("main", {
        className: "flex-1",
        children: [
          e.jsx("section", {
            className: "w-full py-16 md:py-24 lg:py-32",
            children: e.jsx("div", {
              className: "container mx-auto max-w-7xl px-6 md:px-8",
              children: e.jsxs("div", {
                className: "grid gap-12 lg:grid-cols-2 lg:gap-16 items-start",
                children: [
                  e.jsxs("div", {
                    className: "flex flex-col justify-center space-y-6 pt-8",
                    children: [
                      e.jsxs("div", {
                        className: "space-y-4",
                        children: [
                          e.jsx("h1", {
                            className: "text-slate-900 leading-tight",
                            children:
                              "APU VOTE: Secure University Elections on Blockchain",
                          }),
                          e.jsx("p", {
                            className: "text-slate-600 max-w-[600px]",
                            children:
                              "Transparent, tamper-proof voting system ensuring fair elections with real-time results and complete auditability.",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "flex flex-col gap-3 min-[400px]:flex-row",
                        children: [
                          e.jsx(b, {
                            size: "lg",
                            className:
                              "bg-slate-900 hover:bg-slate-800 text-white px-8",
                            onClick: () => t("register"),
                            children: "Register to Vote",
                          }),
                          e.jsx(b, {
                            size: "lg",
                            variant: "outline",
                            className:
                              "border-slate-300 text-slate-900 hover:bg-slate-50 px-8",
                            onClick: () => t("about"),
                            children: "Learn More",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className:
                      "flex items-start justify-center lg:justify-end pt-8",
                    children: n
                      ? e.jsxs(N, {
                          className:
                            "w-full max-w-sm border-2 border-emerald-400 shadow-lg",
                          children: [
                            e.jsxs(A, {
                              className: "text-center space-y-1 pb-4",
                              children: [
                                e.jsx(P, {
                                  className: "text-slate-900",
                                  children: "Loading...",
                                }),
                                e.jsx(Q, {
                                  className: "text-slate-600",
                                  children: "Fetching election data",
                                }),
                              ],
                            }),
                            e.jsx(w, {
                              className: "space-y-4",
                              children: e.jsx("div", {
                                className:
                                  "h-32 flex items-center justify-center",
                                children: e.jsx("div", {
                                  className:
                                    "animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full",
                                }),
                              }),
                            }),
                          ],
                        })
                      : a
                      ? e.jsxs(N, {
                          className: `w-full max-w-sm border-2 ${
                            a.isActive
                              ? "border-emerald-400"
                              : "border-slate-300"
                          } shadow-lg`,
                          children: [
                            e.jsxs(A, {
                              className: "text-center space-y-1 pb-4",
                              children: [
                                e.jsx(P, {
                                  className: "text-slate-900",
                                  children: "Current Election",
                                }),
                                e.jsx(Q, {
                                  className: "text-slate-600",
                                  children: a.title,
                                }),
                              ],
                            }),
                            e.jsxs(w, {
                              className: "space-y-4",
                              children: [
                                e.jsxs("div", {
                                  className: "space-y-2",
                                  children: [
                                    e.jsxs("div", {
                                      className:
                                        "flex items-center justify-between",
                                      children: [
                                        e.jsx("span", {
                                          className: "text-sm text-slate-900",
                                          children: "Status:",
                                        }),
                                        e.jsx(je, {
                                          className: `${
                                            a.status === "Active"
                                              ? "bg-emerald-500 hover:bg-emerald-600"
                                              : a.status === "Ended"
                                              ? "bg-red-500 hover:bg-red-600"
                                              : "bg-slate-500 hover:bg-slate-600"
                                          } text-white`,
                                          children: a.status,
                                        }),
                                      ],
                                    }),
                                    a.isActive &&
                                      e.jsxs(e.Fragment, {
                                        children: [
                                          e.jsx("div", {
                                            className:
                                              "h-2 w-full rounded-full bg-slate-200",
                                            children: e.jsx("div", {
                                              className:
                                                "h-full rounded-full bg-emerald-500 transition-all duration-300",
                                              style: {
                                                width: `${
                                                  a.startDate !== "TBD" &&
                                                  a.endDate !== "TBD"
                                                    ? Math.min(
                                                        75,
                                                        Math.max(
                                                          10,
                                                          Math.random() * 100
                                                        )
                                                      )
                                                    : 0
                                                }%`,
                                              },
                                            }),
                                          }),
                                          e.jsxs("div", {
                                            className:
                                              "flex justify-between text-xs text-slate-600",
                                            children: [
                                              e.jsxs("span", {
                                                children: [
                                                  "Started: ",
                                                  a.startDate,
                                                ],
                                              }),
                                              e.jsxs("span", {
                                                children: ["Ends: ", a.endDate],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    !a.isActive &&
                                      a.startDate !== "TBD" &&
                                      e.jsxs("div", {
                                        className:
                                          "flex justify-between text-xs text-slate-600",
                                        children: [
                                          e.jsxs("span", {
                                            children: [
                                              "Started: ",
                                              a.startDate,
                                            ],
                                          }),
                                          e.jsxs("span", {
                                            children: ["Ends: ", a.endDate],
                                          }),
                                        ],
                                      }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className: "text-center py-2",
                                  children: [
                                    e.jsx("p", {
                                      className: "text-sm text-slate-600 mb-1",
                                      children: "Total Votes Cast",
                                    }),
                                    e.jsx("p", {
                                      className: "text-slate-900",
                                      children: a.votesCount.toLocaleString(),
                                    }),
                                  ],
                                }),
                                e.jsxs(b, {
                                  className: `w-full ${
                                    a.isActive
                                      ? "bg-slate-900 hover:bg-slate-800"
                                      : "bg-slate-400 hover:bg-slate-500 cursor-not-allowed"
                                  } text-white`,
                                  onClick: a.isActive ? c : void 0,
                                  disabled: !a.isActive,
                                  children: [
                                    a.isActive
                                      ? "Vote Now"
                                      : a.status === "Ended"
                                      ? "Election Ended"
                                      : "Not Started",
                                    a.isActive &&
                                      e.jsx(yr, { className: "ml-2 h-4 w-4" }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        })
                      : null,
                  }),
                ],
              }),
            }),
          }),
          e.jsx("section", {
            className: "w-full py-16 md:py-24 bg-white",
            children: e.jsxs("div", {
              className: "container mx-auto max-w-7xl px-6 md:px-8",
              children: [
                e.jsxs("div", {
                  className:
                    "flex flex-col items-center justify-center space-y-3 text-center mb-12",
                  children: [
                    e.jsx("h2", {
                      className: "text-slate-900",
                      children: "Why Blockchain Voting?",
                    }),
                    e.jsx("p", {
                      className: "max-w-[800px] text-slate-600",
                      children:
                        "Our platform leverages Ethereum blockchain technology to provide a secure, transparent, and tamper-proof voting system.",
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className:
                    "mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3",
                  children: [
                    e.jsxs("div", {
                      className: "flex flex-col items-start space-y-3",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-3",
                          children: [
                            e.jsx(We, {
                              className: "h-6 w-6 text-emerald-500",
                            }),
                            e.jsx("h3", {
                              className: "text-slate-900",
                              children: "Security",
                            }),
                          ],
                        }),
                        e.jsx("p", {
                          className: "text-sm text-slate-600 leading-relaxed",
                          children:
                            "Cryptographic security ensures votes cannot be tampered with once cast. Each vote is securely recorded on the blockchain.",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "flex flex-col items-start space-y-3",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-3",
                          children: [
                            e.jsx(Ze, {
                              className: "h-6 w-6 text-emerald-500",
                            }),
                            e.jsx("h3", {
                              className: "text-slate-900",
                              children: "Transparency",
                            }),
                          ],
                        }),
                        e.jsx("p", {
                          className: "text-sm text-slate-600 leading-relaxed",
                          children:
                            "All votes are publicly verifiable while maintaining voter privacy. The entire election process is transparent and auditable.",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "flex flex-col items-start space-y-3",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-3",
                          children: [
                            e.jsx(Zt, {
                              className: "h-6 w-6 text-emerald-500",
                            }),
                            e.jsx("h3", {
                              className: "text-slate-900",
                              children: "Fairness",
                            }),
                          ],
                        }),
                        e.jsx("p", {
                          className: "text-sm text-slate-600 leading-relaxed",
                          children:
                            "Decentralized system prevents any single entity from controlling the election. Real-time results are available to all participants.",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
      e.jsx("footer", {
        className: "w-full border-t py-6 bg-white",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "text-center text-sm text-slate-600 md:text-left",
              children: [
                "© ",
                new Date().getFullYear(),
                " APU Vote Chain. All rights reserved.",
              ],
            }),
            e.jsxs("div", {
              className: "flex gap-6",
              children: [
                e.jsx("button", {
                  onClick: () => t("terms"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Terms",
                }),
                e.jsx("button", {
                  onClick: () => t("privacy"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Privacy",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Contact",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
function J({ className: t, type: s, ...a }) {
  return e.jsx("input", {
    type: s,
    "data-slot": "input",
    className: O(
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      t
    ),
    ...a,
  });
}
function V({ className: t, ...s }) {
  return e.jsx(Di, {
    "data-slot": "label",
    className: O(
      "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      t
    ),
    ...s,
  });
}
function lt({ className: t, ...s }) {
  return e.jsx(Vi, {
    "data-slot": "tabs",
    className: O("flex flex-col gap-2", t),
    ...s,
  });
}
function ct({ className: t, ...s }) {
  return e.jsx(Li, {
    "data-slot": "tabs-list",
    className: O(
      "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex",
      t
    ),
    ...s,
  });
}
function pe({ className: t, ...s }) {
  return e.jsx(Oi, {
    "data-slot": "tabs-trigger",
    className: O(
      "data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      t
    ),
    ...s,
  });
}
function fe({ className: t, ...s }) {
  return e.jsx($i, {
    "data-slot": "tabs-content",
    className: O("flex-1 outline-none", t),
    ...s,
  });
}
const Wm = $s(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: { variant: "default" },
  }
);
function at({ className: t, variant: s, ...a }) {
  return e.jsx("div", {
    "data-slot": "alert",
    role: "alert",
    className: O(Wm({ variant: s }), t),
    ...a,
  });
}
function rt({ className: t, ...s }) {
  return e.jsx("div", {
    "data-slot": "alert-description",
    className: O(
      "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
      t
    ),
    ...s,
  });
}
var Ym = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul",
  ],
  Km = Ym.reduce((t, s) => {
    const a = Os(`Primitive.${s}`),
      r = d.forwardRef((n, o) => {
        const { asChild: c, ...l } = n,
          m = c ? a : s;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          e.jsx(m, { ...l, ref: o })
        );
      });
    return (r.displayName = `Primitive.${s}`), { ...t, [s]: r };
  }, {}),
  Jm = "Separator",
  Ma = "horizontal",
  Xm = ["horizontal", "vertical"],
  Fn = d.forwardRef((t, s) => {
    const { decorative: a, orientation: r = Ma, ...n } = t,
      o = Zm(r) ? r : Ma,
      l = a
        ? { role: "none" }
        : {
            "aria-orientation": o === "vertical" ? o : void 0,
            role: "separator",
          };
    return e.jsx(Km.div, { "data-orientation": o, ...l, ...n, ref: s });
  });
Fn.displayName = Jm;
function Zm(t) {
  return Xm.includes(t);
}
var Qm = Fn;
function De({
  className: t,
  orientation: s = "horizontal",
  decorative: a = !0,
  ...r
}) {
  return e.jsx(Qm, {
    "data-slot": "separator-root",
    decorative: a,
    orientation: s,
    className: O(
      "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
      t
    ),
    ...r,
  });
}
const eu = "/apu-logo.png";
function tu({ onNavigate: t }) {
  const [s, a] = d.useState(!1),
    [r, n] = d.useState(null),
    [o, c] = d.useState(""),
    [l, m] = d.useState(!1),
    [u, p] = d.useState("student"),
    [i, x] = d.useState({ studentId: "", password: "" }),
    [j, g] = d.useState({ email: "", password: "" }),
    v = async (E) => {
      E.preventDefault(), a(!0), c("");
      try {
        const R = await cm(i);
        if (R.success) {
          kt(R.user, R.token || "");
          const F = localStorage.getItem("intendedDestination");
          F === "elections" || F === "vote"
            ? (localStorage.removeItem("intendedDestination"), t("vote"))
            : t("home");
        } else c(R.message || "Invalid credentials. Please try again.");
      } catch (R) {
        c("An error occurred during login. Please try again."),
          console.error("Login error:", R);
      } finally {
        a(!1);
      }
    },
    T = async (E) => {
      E.preventDefault(), a(!0), c("");
      try {
        const R = await dm(j);
        R.success
          ? (kt(R.user, R.token || ""), t("admin"))
          : c(R.message || "Invalid admin credentials. Please try again.");
      } catch (R) {
        c("An error occurred during admin login. Please try again."),
          console.error("Admin login error:", R);
      } finally {
        a(!1);
      }
    },
    y = async (E) => {
      n(E), c("");
      try {
        const R = E === "google" ? await mm() : await um();
        R.success
          ? (kt(R.user, R.token || ""), t("home"))
          : c(R.message || `Failed to login with ${E}. Please try again.`);
      } catch (R) {
        c(`An error occurred during ${E} login. Please try again.`),
          console.error(`${E} login error:`, R);
      } finally {
        n(null);
      }
    };
  return e.jsx("div", {
    className:
      "min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center py-16 px-6 md:px-8",
    children: e.jsxs(N, {
      className: "w-full max-w-md",
      children: [
        e.jsxs(A, {
          children: [
            e.jsx("div", {
              className: "flex items-center",
              children: e.jsxs(b, {
                variant: "ghost",
                size: "sm",
                className: "gap-1 mr-auto",
                onClick: () => t("home"),
                children: [e.jsx(ge, { className: "h-4 w-4" }), "Back"],
              }),
            }),
            e.jsxs("div", {
              className: "flex items-center gap-3 mb-4",
              children: [
                e.jsx("img", {
                  src: eu,
                  alt: "Asia Pacific University Logo",
                  className: "h-10 w-auto ml-4",
                }),
                e.jsx(P, { children: "Login to APU VOTE" }),
              ],
            }),
            e.jsx(Q, {
              children: "Access your account to participate in elections",
            }),
          ],
        }),
        e.jsx(w, {
          children: e.jsxs(lt, {
            value: u,
            onValueChange: p,
            className: "w-full",
            children: [
              e.jsxs(ct, {
                className: "grid w-full grid-cols-2",
                children: [
                  e.jsx(pe, { value: "student", children: "Student Login" }),
                  e.jsx(pe, { value: "admin", children: "Admin Login" }),
                ],
              }),
              e.jsxs(fe, {
                value: "student",
                className: "space-y-4 mt-6",
                children: [
                  e.jsxs("div", {
                    className: "space-y-3",
                    children: [
                      e.jsx("div", {
                        className: "text-center",
                        children: e.jsx("p", {
                          className: "text-slate-600 mb-4",
                          children: "Sign in with your university account",
                        }),
                      }),
                      e.jsxs(b, {
                        variant: "outline",
                        className: "w-full h-11 bg-transparent",
                        onClick: () => y("google"),
                        disabled: r !== null || s,
                        children: [
                          r === "google"
                            ? e.jsx(de, {
                                className: "mr-2 h-4 w-4 animate-spin",
                              })
                            : e.jsxs("svg", {
                                className: "mr-2 h-4 w-4",
                                viewBox: "0 0 24 24",
                                children: [
                                  e.jsx("path", {
                                    fill: "#4285F4",
                                    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
                                  }),
                                  e.jsx("path", {
                                    fill: "#34A853",
                                    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                                  }),
                                  e.jsx("path", {
                                    fill: "#FBBC05",
                                    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                                  }),
                                  e.jsx("path", {
                                    fill: "#EA4335",
                                    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                                  }),
                                ],
                              }),
                          r === "google"
                            ? "Signing in..."
                            : "Continue with Google",
                        ],
                      }),
                      e.jsxs(b, {
                        variant: "outline",
                        className: "w-full h-11 bg-transparent",
                        onClick: () => y("microsoft"),
                        disabled: r !== null || s,
                        children: [
                          r === "microsoft"
                            ? e.jsx(de, {
                                className: "mr-2 h-4 w-4 animate-spin",
                              })
                            : e.jsxs("svg", {
                                className: "mr-2 h-4 w-4",
                                viewBox: "0 0 24 24",
                                children: [
                                  e.jsx("path", {
                                    fill: "#F25022",
                                    d: "M1 1h10v10H1z",
                                  }),
                                  e.jsx("path", {
                                    fill: "#00A4EF",
                                    d: "M13 1h10v10H13z",
                                  }),
                                  e.jsx("path", {
                                    fill: "#7FBA00",
                                    d: "M1 13h10v10H1z",
                                  }),
                                  e.jsx("path", {
                                    fill: "#FFB900",
                                    d: "M13 13h10v10H13z",
                                  }),
                                ],
                              }),
                          r === "microsoft"
                            ? "Signing in..."
                            : "Continue with Microsoft",
                        ],
                      }),
                      e.jsxs("div", {
                        className: "relative",
                        children: [
                          e.jsx("div", {
                            className: "absolute inset-0 flex items-center",
                            children: e.jsx(De, { className: "w-full" }),
                          }),
                          e.jsx("div", {
                            className: "relative flex justify-center",
                            children: e.jsx("span", {
                              className: "bg-white px-2 text-slate-600",
                              children: "Or continue with",
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("form", {
                    onSubmit: v,
                    className: "space-y-4",
                    children: [
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsx(V, {
                            htmlFor: "studentId",
                            children: "Student ID",
                          }),
                          e.jsx(J, {
                            id: "studentId",
                            placeholder: "Enter your student ID",
                            value: i.studentId,
                            onChange: (E) =>
                              x({ ...i, studentId: E.target.value }),
                            required: !0,
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsx(V, {
                            htmlFor: "password",
                            children: "Password",
                          }),
                          e.jsxs("div", {
                            className: "relative",
                            children: [
                              e.jsx(J, {
                                id: "password",
                                type: l ? "text" : "password",
                                placeholder: "Enter your password",
                                value: i.password,
                                onChange: (E) =>
                                  x({ ...i, password: E.target.value }),
                                required: !0,
                              }),
                              e.jsx(b, {
                                type: "button",
                                variant: "ghost",
                                size: "sm",
                                className:
                                  "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                                onClick: () => m(!l),
                                children: l
                                  ? e.jsx(ys, {
                                      className: "h-4 w-4 text-slate-600",
                                    })
                                  : e.jsx(Ht, {
                                      className: "h-4 w-4 text-slate-600",
                                    }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      o &&
                        e.jsxs(at, {
                          variant: "destructive",
                          children: [
                            e.jsx(bs, { className: "h-4 w-4" }),
                            e.jsx(rt, { children: o }),
                          ],
                        }),
                      e.jsx(b, {
                        type: "submit",
                        className: "w-full bg-emerald-600 hover:bg-emerald-700",
                        disabled: s || r !== null,
                        children: s
                          ? e.jsxs(e.Fragment, {
                              children: [
                                e.jsx(de, {
                                  className: "mr-2 h-4 w-4 animate-spin",
                                }),
                                "Signing in...",
                              ],
                            })
                          : "Sign In",
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "text-center space-y-2",
                    children: [
                      e.jsx("button", {
                        onClick: () => t("forgot-password"),
                        className: "text-sm text-emerald-600 hover:underline",
                        children: "Forgot your password?",
                      }),
                      e.jsxs("p", {
                        className: "text-slate-600",
                        children: [
                          "Don't have an account?",
                          " ",
                          e.jsx("button", {
                            onClick: () => t("register"),
                            className: "text-emerald-600 hover:underline",
                            children: "Register here",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs(fe, {
                value: "admin",
                className: "space-y-4 mt-6",
                children: [
                  e.jsxs("form", {
                    onSubmit: T,
                    className: "space-y-4",
                    children: [
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsx(V, {
                            htmlFor: "adminEmail",
                            children: "Admin Email",
                          }),
                          e.jsx(J, {
                            id: "adminEmail",
                            type: "email",
                            placeholder: "Enter your admin email",
                            value: j.email,
                            onChange: (E) => g({ ...j, email: E.target.value }),
                            required: !0,
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          e.jsx(V, {
                            htmlFor: "adminPassword",
                            children: "Password",
                          }),
                          e.jsxs("div", {
                            className: "relative",
                            children: [
                              e.jsx(J, {
                                id: "adminPassword",
                                type: l ? "text" : "password",
                                placeholder: "Enter your admin password",
                                value: j.password,
                                onChange: (E) =>
                                  g({ ...j, password: E.target.value }),
                                required: !0,
                              }),
                              e.jsx(b, {
                                type: "button",
                                variant: "ghost",
                                size: "sm",
                                className:
                                  "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                                onClick: () => m(!l),
                                children: l
                                  ? e.jsx(ys, {
                                      className: "h-4 w-4 text-slate-600",
                                    })
                                  : e.jsx(Ht, {
                                      className: "h-4 w-4 text-slate-600",
                                    }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      o &&
                        e.jsxs(at, {
                          variant: "destructive",
                          children: [
                            e.jsx(bs, { className: "h-4 w-4" }),
                            e.jsx(rt, { children: o }),
                          ],
                        }),
                      e.jsx(b, {
                        type: "submit",
                        className: "w-full bg-emerald-600 hover:bg-emerald-700",
                        disabled: s || r !== null,
                        children: s
                          ? e.jsxs(e.Fragment, {
                              children: [
                                e.jsx(de, {
                                  className: "mr-2 h-4 w-4 animate-spin",
                                }),
                                "Signing in...",
                              ],
                            })
                          : "Admin Sign In",
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className: "text-center",
                    children: e.jsx("p", {
                      className: "text-slate-600",
                      children:
                        "Admin access is restricted to authorized personnel only.",
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
        e.jsx(Tt, {
          className: "flex justify-center border-t pt-4",
          children: e.jsx("p", {
            className: "text-slate-600 text-center",
            children:
              "By signing in, you agree to the APU VOTE terms of service and privacy policy.",
          }),
        }),
      ],
    }),
  });
}
function su({ className: t, ...s }) {
  return e.jsx(Fi, {
    "data-slot": "checkbox",
    className: O(
      "peer border bg-input-background dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      t
    ),
    ...s,
    children: e.jsx(zi, {
      "data-slot": "checkbox-indicator",
      className:
        "flex items-center justify-center text-current transition-none",
      children: e.jsx(Zt, { className: "size-3.5" }),
    }),
  });
}
function Oe({ ...t }) {
  return e.jsx(Ui, { "data-slot": "select", ...t });
}
function $e({ ...t }) {
  return e.jsx(Gi, { "data-slot": "select-value", ...t });
}
function Fe({ className: t, size: s = "default", children: a, ...r }) {
  return e.jsxs(Bi, {
    "data-slot": "select-trigger",
    "data-size": s,
    className: O(
      "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      t
    ),
    ...r,
    children: [
      a,
      e.jsx(Hi, {
        asChild: !0,
        children: e.jsx(jr, { className: "size-4 opacity-50" }),
      }),
    ],
  });
}
function ze({ className: t, children: s, position: a = "popper", ...r }) {
  return e.jsx(qi, {
    children: e.jsxs(Wi, {
      "data-slot": "select-content",
      className: O(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        a === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        t
      ),
      position: a,
      ...r,
      children: [
        e.jsx(au, {}),
        e.jsx(Yi, {
          className: O(
            "p-1",
            a === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          ),
          children: s,
        }),
        e.jsx(ru, {}),
      ],
    }),
  });
}
function K({ className: t, children: s, ...a }) {
  return e.jsxs(Ki, {
    "data-slot": "select-item",
    className: O(
      "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
      t
    ),
    ...a,
    children: [
      e.jsx("span", {
        className: "absolute right-2 flex size-3.5 items-center justify-center",
        children: e.jsx(Ji, { children: e.jsx(Zt, { className: "size-4" }) }),
      }),
      e.jsx(Xi, { children: s }),
    ],
  });
}
function au({ className: t, ...s }) {
  return e.jsx(Zi, {
    "data-slot": "select-scroll-up-button",
    className: O("flex cursor-default items-center justify-center py-1", t),
    ...s,
    children: e.jsx(Cl, { className: "size-4" }),
  });
}
function ru({ className: t, ...s }) {
  return e.jsx(Qi, {
    "data-slot": "select-scroll-down-button",
    className: O("flex cursor-default items-center justify-center py-1", t),
    ...s,
    children: e.jsx(jr, { className: "size-4" }),
  });
}
const nu = "/apu-logo.png";
function iu({ onNavigate: t }) {
  const [s, a] = d.useState(!1),
    [r, n] = d.useState(!1),
    [o, c] = d.useState({
      firstName: "",
      lastName: "",
      email: "",
      studentId: "",
      password: "",
      confirmPassword: "",
      faculty: "",
      agreeToTerms: !1,
    }),
    l = async (u) => {
      if ((u.preventDefault(), a(!0), o.password !== o.confirmPassword)) {
        M.error("Passwords do not match"), a(!1);
        return;
      }
      if (!o.agreeToTerms) {
        M.error("You must agree to the terms and privacy policy"), a(!1);
        return;
      }
      try {
        await new Promise((i) => setTimeout(i, 1500)),
          (await xm({
            firstName: o.firstName,
            lastName: o.lastName,
            email: o.email,
            studentId: o.studentId,
            password: o.password,
            faculty: o.faculty,
          }))
            ? (M.success("Registration successful! Please login."), t("login"))
            : M.error("Registration failed. User may already exist.");
      } catch (p) {
        M.error("An error occurred during registration"), console.error(p);
      } finally {
        a(!1);
      }
    },
    m = (u) => {
      const { name: p, value: i } = u.target;
      c((x) => ({ ...x, [p]: i }));
    };
  return e.jsx("div", {
    className:
      "min-h-screen bg-slate-50 flex items-center justify-center py-12 px-6",
    children: e.jsxs(N, {
      className: "w-full max-w-md",
      children: [
        e.jsxs(A, {
          children: [
            e.jsx("div", {
              className: "flex items-center",
              children: e.jsxs(b, {
                variant: "ghost",
                size: "sm",
                className: "gap-1 mr-auto",
                onClick: () => t("home"),
                children: [e.jsx(ge, { className: "h-4 w-4" }), "Back"],
              }),
            }),
            e.jsxs("div", {
              className: "flex items-center gap-3 mb-4",
              children: [
                e.jsx("img", {
                  src: nu,
                  alt: "Asia Pacific University Logo",
                  className: "h-10 w-auto ml-4",
                }),
                e.jsx(P, { children: "Create an account" }),
              ],
            }),
            e.jsx(Q, {
              children:
                "Enter your student details to register for APU voting system",
            }),
          ],
        }),
        e.jsx(w, {
          children: e.jsxs("form", {
            onSubmit: l,
            className: "space-y-6",
            children: [
              e.jsxs("div", {
                className: "grid grid-cols-2 gap-4",
                children: [
                  e.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      e.jsx(V, {
                        htmlFor: "firstName",
                        children: "First Name",
                      }),
                      e.jsx(J, {
                        id: "firstName",
                        name: "firstName",
                        placeholder: "John",
                        required: !0,
                        value: o.firstName,
                        onChange: m,
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      e.jsx(V, { htmlFor: "lastName", children: "Last Name" }),
                      e.jsx(J, {
                        id: "lastName",
                        name: "lastName",
                        placeholder: "Doe",
                        required: !0,
                        value: o.lastName,
                        onChange: m,
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "space-y-2",
                children: [
                  e.jsx(V, { htmlFor: "email", children: "Student Email" }),
                  e.jsx(J, {
                    id: "email",
                    name: "email",
                    type: "email",
                    placeholder: "tp012345@mail.apu.edu.my",
                    required: !0,
                    value: o.email,
                    onChange: m,
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "space-y-2",
                children: [
                  e.jsx(V, {
                    htmlFor: "studentId",
                    children: "Student ID (TP Number)",
                  }),
                  e.jsx(J, {
                    id: "studentId",
                    name: "studentId",
                    placeholder: "TP012345",
                    required: !0,
                    value: o.studentId,
                    onChange: m,
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "space-y-2",
                children: [
                  e.jsx(V, { htmlFor: "faculty", children: "Faculty" }),
                  e.jsxs(Oe, {
                    value: o.faculty,
                    onValueChange: (u) => c((p) => ({ ...p, faculty: u })),
                    children: [
                      e.jsx(Fe, {
                        children: e.jsx($e, {
                          placeholder: "Select your faculty",
                        }),
                      }),
                      e.jsxs(ze, {
                        children: [
                          e.jsx(K, {
                            value: "computing",
                            children: "School of Computing",
                          }),
                          e.jsx(K, {
                            value: "engineering",
                            children: "School of Engineering",
                          }),
                          e.jsx(K, {
                            value: "business",
                            children: "School of Business",
                          }),
                          e.jsx(K, {
                            value: "media",
                            children: "School of Media & Design",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "space-y-2",
                children: [
                  e.jsx(V, { htmlFor: "password", children: "Password" }),
                  e.jsxs("div", {
                    className: "relative",
                    children: [
                      e.jsx(J, {
                        id: "password",
                        name: "password",
                        type: r ? "text" : "password",
                        required: !0,
                        value: o.password,
                        onChange: m,
                      }),
                      e.jsx(b, {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        className:
                          "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                        onClick: () => n(!r),
                        children: r
                          ? e.jsx(ys, { className: "h-4 w-4 text-slate-500" })
                          : e.jsx(Ht, { className: "h-4 w-4 text-slate-500" }),
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "space-y-2",
                children: [
                  e.jsx(V, {
                    htmlFor: "confirmPassword",
                    children: "Confirm Password",
                  }),
                  e.jsx(J, {
                    id: "confirmPassword",
                    name: "confirmPassword",
                    type: "password",
                    required: !0,
                    value: o.confirmPassword,
                    onChange: m,
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "flex items-start space-x-2",
                children: [
                  e.jsx(su, {
                    id: "terms",
                    checked: o.agreeToTerms,
                    onCheckedChange: (u) =>
                      c((p) => ({ ...p, agreeToTerms: u })),
                  }),
                  e.jsxs("div", {
                    className: "grid gap-1.5 leading-none",
                    children: [
                      e.jsx("label", {
                        htmlFor: "terms",
                        className:
                          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        children: "Agree to terms and conditions",
                      }),
                      e.jsx("p", {
                        className: "text-sm text-slate-500",
                        children:
                          "By registering, you agree to our Terms of Service and Privacy Policy.",
                      }),
                    ],
                  }),
                ],
              }),
              e.jsx(b, {
                type: "submit",
                className: "w-full bg-emerald-600 hover:bg-emerald-700",
                disabled: s,
                children: s
                  ? e.jsxs(e.Fragment, {
                      children: [
                        e.jsx(de, { className: "mr-2 h-4 w-4 animate-spin" }),
                        "Creating account...",
                      ],
                    })
                  : "Create Account",
              }),
              e.jsxs("div", {
                className: "text-center text-sm",
                children: [
                  "Already have an account?",
                  " ",
                  e.jsx("button", {
                    type: "button",
                    className: "font-medium text-emerald-600 hover:underline",
                    onClick: () => t("login"),
                    children: "Sign in",
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    }),
  });
}
const ou = "modulepreload",
  lu = function (t) {
    return "/" + t;
  },
  Ra = {},
  Ut = function (s, a, r) {
    let n = Promise.resolve();
    if (a && a.length > 0) {
      let c = function (u) {
        return Promise.all(
          u.map((p) =>
            Promise.resolve(p).then(
              (i) => ({ status: "fulfilled", value: i }),
              (i) => ({ status: "rejected", reason: i })
            )
          )
        );
      };
      document.getElementsByTagName("link");
      const l = document.querySelector("meta[property=csp-nonce]"),
        m = l?.nonce || l?.getAttribute("nonce");
      n = c(
        a.map((u) => {
          if (((u = lu(u)), u in Ra)) return;
          Ra[u] = !0;
          const p = u.endsWith(".css"),
            i = p ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${u}"]${i}`)) return;
          const x = document.createElement("link");
          if (
            ((x.rel = p ? "stylesheet" : ou),
            p || (x.as = "script"),
            (x.crossOrigin = ""),
            (x.href = u),
            m && x.setAttribute("nonce", m),
            document.head.appendChild(x),
            p)
          )
            return new Promise((j, g) => {
              x.addEventListener("load", j),
                x.addEventListener("error", () =>
                  g(new Error(`Unable to preload CSS for ${u}`))
                );
            });
        })
      );
    }
    function o(c) {
      const l = new Event("vite:preloadError", { cancelable: !0 });
      if (((l.payload = c), window.dispatchEvent(l), !l.defaultPrevented))
        throw c;
    }
    return n.then((c) => {
      for (const l of c || []) l.status === "rejected" && o(l.reason);
      return s().catch(o);
    });
  },
  cu = "/apu-logo.png";
function zn({ children: t, requireAdmin: s = !1, onNavigate: a }) {
  const [r, n] = d.useState(!0),
    [o, c] = d.useState(!1),
    [l, m] = d.useState(!1);
  return (
    d.useEffect(() => {
      (() => {
        if (!ss()) {
          m(!0), n(!1);
          return;
        }
        if (s && !As()) {
          a("home");
          return;
        }
        c(!0), n(!1);
      })();
    }, [s, a]),
    r
      ? e.jsx("div", {
          className: "flex items-center justify-center min-h-screen",
          children: e.jsxs("div", {
            className: "flex flex-col items-center",
            children: [
              e.jsx(de, {
                className: "h-8 w-8 animate-spin text-emerald-500 mb-4",
              }),
              e.jsx("p", {
                className: "text-slate-600",
                children: "Checking authentication...",
              }),
            ],
          }),
        })
      : l
      ? e.jsx("div", {
          className:
            "container flex items-center justify-center min-h-screen py-12",
          children: e.jsxs(N, {
            className: "w-full max-w-md",
            children: [
              e.jsxs(A, {
                className: "text-center",
                children: [
                  e.jsx("div", {
                    className: "flex justify-center mb-4",
                    children: e.jsx("div", {
                      className: "rounded-full bg-emerald-100 p-3",
                      children: e.jsx(Ze, {
                        className: "h-8 w-8 text-emerald-600",
                      }),
                    }),
                  }),
                  e.jsxs("div", {
                    className: "flex items-center gap-3 justify-center mb-4",
                    children: [
                      e.jsx("img", {
                        src: cu,
                        alt: "Asia Pacific University Logo",
                        className: "h-10 w-auto",
                      }),
                      e.jsx(P, { children: "Authentication Required" }),
                    ],
                  }),
                  e.jsx(Q, {
                    children:
                      "You need to sign in to your account to access the voting system and participate in elections.",
                  }),
                ],
              }),
              e.jsx(w, {
                className: "space-y-4",
                children: e.jsxs("div", {
                  className: "text-center space-y-4",
                  children: [
                    e.jsx("p", {
                      className: "text-sm text-slate-600",
                      children:
                        "To ensure election security and prevent unauthorized voting, all users must be authenticated.",
                    }),
                    e.jsxs("div", {
                      className: "space-y-3",
                      children: [
                        e.jsx("p", {
                          className: "text-xs text-slate-600",
                          children:
                            "Quick sign in with your university account:",
                        }),
                        e.jsxs("div", {
                          className: "grid grid-cols-2 gap-2",
                          children: [
                            e.jsxs(b, {
                              variant: "outline",
                              className: "w-full h-10 text-xs bg-transparent",
                              onClick: () => a("login"),
                              children: [
                                e.jsxs("svg", {
                                  className: "mr-1 h-3 w-3",
                                  viewBox: "0 0 24 24",
                                  children: [
                                    e.jsx("path", {
                                      fill: "#4285F4",
                                      d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
                                    }),
                                    e.jsx("path", {
                                      fill: "#34A853",
                                      d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                                    }),
                                    e.jsx("path", {
                                      fill: "#FBBC05",
                                      d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                                    }),
                                    e.jsx("path", {
                                      fill: "#EA4335",
                                      d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                                    }),
                                  ],
                                }),
                                "Google",
                              ],
                            }),
                            e.jsxs(b, {
                              variant: "outline",
                              className: "w-full h-10 text-xs bg-transparent",
                              onClick: () => a("login"),
                              children: [
                                e.jsxs("svg", {
                                  className: "mr-1 h-3 w-3",
                                  viewBox: "0 0 24 24",
                                  children: [
                                    e.jsx("path", {
                                      fill: "#F25022",
                                      d: "M1 1h10v10H1z",
                                    }),
                                    e.jsx("path", {
                                      fill: "#00A4EF",
                                      d: "M13 1h10v10H13z",
                                    }),
                                    e.jsx("path", {
                                      fill: "#7FBA00",
                                      d: "M1 13h10v10H1z",
                                    }),
                                    e.jsx("path", {
                                      fill: "#FFB900",
                                      d: "M13 13h10v10H13z",
                                    }),
                                  ],
                                }),
                                "Microsoft",
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "flex flex-col gap-3",
                      children: [
                        e.jsx(b, {
                          className: "w-full",
                          size: "lg",
                          onClick: () => a("login"),
                          children: "Sign In to Your Account",
                        }),
                        e.jsx(b, {
                          variant: "outline",
                          className: "w-full bg-transparent",
                          size: "lg",
                          onClick: () => a("register"),
                          children: "Create New Account",
                        }),
                      ],
                    }),
                    e.jsx("div", {
                      className: "pt-4 border-t",
                      children: e.jsxs("p", {
                        className: "text-xs text-slate-600",
                        children: [
                          "Don't have an account yet?",
                          " ",
                          e.jsx("button", {
                            onClick: () => a("register"),
                            className: "text-emerald-600 hover:underline",
                            children: "Register here",
                          }),
                          " ",
                          "to get started.",
                        ],
                      }),
                    }),
                  ],
                }),
              }),
            ],
          }),
        })
      : o
      ? e.jsx(e.Fragment, { children: t })
      : null
  );
}
function ht(t) {
  const s = t?.message || t?.toString() || "Unknown error";
  return s.includes("Reset first")
    ? "⚠️ An election already exists. Please end the current election and reset the system before creating a new one."
    : s.includes("user rejected") || s.includes("User denied")
    ? "❌ Transaction cancelled. You rejected the MetaMask signature request."
    : s.includes("insufficient funds")
    ? "💰 Insufficient funds. You don't have enough ETH to pay for gas fees."
    : s.includes("Election is not active")
    ? "⚠️ Election is not active yet. Please start the election first."
    : s.includes("Election ended")
    ? "⚠️ This election has already ended. No more changes can be made."
    : s.includes("Only admin")
    ? "🚫 Access denied. Only the admin wallet can perform this action."
    : s.includes("Setup locked")
    ? "🔒 Election setup is locked. Cannot modify categories/candidates after election has started."
    : s.includes("Already voted")
    ? "✅ You have already voted in this category."
    : s.includes("Not registered")
    ? "📝 You must register as a voter before you can vote."
    : s.includes("network changed") || s.includes("chain")
    ? "🌐 Network error. Please make sure you're connected to the correct blockchain network."
    : s.includes("nonce")
    ? "🔄 Transaction error. Please refresh the page and try again."
    : `❌ ${s}`;
}
function Le({ className: t, ...s }) {
  return e.jsx(eo, {
    "data-slot": "switch",
    className: O(
      "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      t
    ),
    ...s,
    children: e.jsx(to, {
      "data-slot": "switch-thumb",
      className: O(
        "bg-card dark:data-[state=unchecked]:bg-card-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
      ),
    }),
  });
}
function Rs({ className: t, ...s }) {
  return e.jsx("div", {
    "data-slot": "table-container",
    className: "relative w-full overflow-x-auto",
    children: e.jsx("table", {
      "data-slot": "table",
      className: O("w-full caption-bottom text-sm", t),
      ...s,
    }),
  });
}
function _s({ className: t, ...s }) {
  return e.jsx("thead", {
    "data-slot": "table-header",
    className: O("[&_tr]:border-b", t),
    ...s,
  });
}
function Is({ className: t, ...s }) {
  return e.jsx("tbody", {
    "data-slot": "table-body",
    className: O("[&_tr:last-child]:border-0", t),
    ...s,
  });
}
function ft({ className: t, ...s }) {
  return e.jsx("tr", {
    "data-slot": "table-row",
    className: O(
      "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
      t
    ),
    ...s,
  });
}
function ye({ className: t, ...s }) {
  return e.jsx("th", {
    "data-slot": "table-head",
    className: O(
      "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      t
    ),
    ...s,
  });
}
function be({ className: t, ...s }) {
  return e.jsx("td", {
    "data-slot": "table-cell",
    className: O(
      "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      t
    ),
    ...s,
  });
}
const _a = "/apu-logo.png",
  Ia = () => localStorage.getItem("user_id");
function du({ onNavigate: t }) {
  const [s, a] = d.useState(!0),
    [r, n] = d.useState(!1),
    [o, c] = d.useState("dashboard"),
    [l, m] = d.useState(null),
    [u, p] = d.useState([]),
    [i, x] = d.useState([]),
    [j, g] = d.useState({ title: "", startDate: "", endDate: "" }),
    [v, T] = d.useState({ name: "", description: "" }),
    [y, E] = d.useState({
      name: "",
      position: "",
      party: "",
      category: "",
      contractId: "",
    }),
    [R, F] = d.useState(!1),
    f = {
      registeredVoters: l?.totalVoters || 0,
      totalVoters: 100,
      votesCount: l?.totalVotes || 0,
      electionStatus:
        l?.state === 0 || l?.state === 1
          ? "Not Started"
          : l?.state === 2
          ? "Active"
          : l?.state === 3
          ? "Ended"
          : "Not Started",
      electionTitle: l?.title || "No Election Created",
      startDate: l?.startTime ? new Date(l.startTime * 1e3).toISOString() : "",
      endDate: l?.endTime ? new Date(l.endTime * 1e3).toISOString() : "",
      candidates: i.map((h) => ({
        id: h.id,
        name: h.name,
        position: u.find((k) => k.id === h.categoryId)?.name || "Unknown",
        party: h.party,
      })),
      voters: [],
      activities: [],
    },
    B = async () => {
      try {
        a(!0);
        const h = await _n(),
          k = await as(),
          G = [];
        for (const re of k)
          (await rs(re.id)).forEach((D) => {
            G.push({
              id: Number(D.id),
              name: String(D.name),
              party: String(D.party),
              categoryId: re.id,
            });
          });
        m(h), p(k), x(G);
      } catch (h) {
        console.error("Create category error:", h);
        const k = h?.response?.data || h?.message || JSON.stringify(h);
        M.error(`RAW ERROR: ${JSON.stringify(k, null, 2)}`);
      } finally {
        a(!1);
      }
    };
  d.useEffect(() => {
    B();
  }, []);
  const oe = async (h) => {
      h.preventDefault();
      try {
        n(!0);
        const k = Math.floor(new Date(j.startDate).getTime() / 1e3),
          G = Math.floor(new Date(j.endDate).getTime() / 1e3);
        await Pn(j.title, k, G),
          M.success("Election created successfully!"),
          await B();
      } catch (k) {
        M.error(ht(k));
      } finally {
        n(!1);
      }
    },
    C = async () => {
      try {
        n(!0),
          await Tn(),
          M.success("Election started successfully!"),
          await B();
      } catch (h) {
        M.error(ht(h));
      } finally {
        n(!1);
      }
    },
    L = async () => {
      try {
        n(!0), await Mn(), M.success("Election ended successfully!"), await B();
      } catch (h) {
        M.error(ht(h));
      } finally {
        n(!1);
      }
    },
    H = async () => {
      if (
        !window.confirm(`⚠️ WARNING: This will completely reset the system!

This action will DELETE:
• All elections
• All categories
• All candidates
• All voters
• All votes

This cannot be undone. Are you absolutely sure?`)
      ) {
        M.info("Reset cancelled");
        return;
      }
      try {
        n(!0),
          await Rn(),
          M.success(
            "🔄 System reset successfully! You can now create a new election."
          ),
          await B();
      } catch (k) {
        M.error(ht(k));
      } finally {
        n(!1);
      }
    },
    ne = async () => {
      try {
        n(!0);
        const h = await In(v.name, v.description),
          k = Ia(),
          G = await fetch("http://localhost:3001/api/categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(k ? { "x-user-id": k } : {}),
            },
            body: JSON.stringify({ txHash: h.txHash }),
          });
        if (!G.ok) {
          const re = await G.text();
          throw (
            (console.error("Backend error:", re),
            new Error(`Database sync failed: ${re}`))
          );
        }
        T({ name: "", description: "" }),
          M.success("✅ Category created and saved to database!"),
          await B();
      } catch (h) {
        console.error("Full error:", h);
        const k = h?.message || JSON.stringify(h);
        M.error(`❌ ERROR: ${k}`);
      } finally {
        n(!1);
      }
    },
    X = async (h) => {
      if (
        window.confirm(
          "Are you sure you want to delete this category? This will deactivate it on the blockchain."
        )
      )
        try {
          n(!0), M.info("Deactivating category on blockchain...");
          const G = new window.ethereum()
            ? new (
                await Ut(async () => {
                  const { BrowserProvider: z } = await import(
                    "./vendor-ethers-D5ZThK8B.js"
                  );
                  return { BrowserProvider: z };
                }, [])
              ).BrowserProvider(window.ethereum)
            : null;
          if (!G) throw new Error("No Web3 provider found");
          const re = await G.getSigner(),
            { ethers: ue } = await Ut(async () => {
              const { ethers: z } = await import("./vendor-ethers-D5ZThK8B.js");
              return { ethers: z };
            }, []),
            D = (
              await Ut(async () => {
                const { default: z } = await Promise.resolve().then(() => fm);
                return { default: z };
              }, void 0)
            ).default,
            q = (
              await Ut(async () => {
                const { CONTRACT_ADDRESS: z } = await Promise.resolve().then(
                  () => Hm
                );
                return { CONTRACT_ADDRESS: z };
              }, void 0)
            ).CONTRACT_ADDRESS;
          await (await new ue.Contract(q, D, re).deactivateCategory(h)).wait(),
            M.success("✅ Category deleted!"),
            await B();
        } catch (G) {
          console.error("Delete error:", G), M.error(ht(G));
        } finally {
          n(!1);
        }
    },
    Z = async (h) => {
      h.preventDefault();
      try {
        if ((n(!0), !y.category)) {
          M.error("Please select a category");
          return;
        }
        const k = u.find((D) => D.name === y.category);
        if (!k) {
          M.error("Invalid category selected");
          return;
        }
        const G = await Dn(k.id, y.name, y.party),
          re = Ia();
        if (
          !(
            await fetch("http://localhost:3001/api/candidates", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(re ? { "x-user-id": re } : {}),
              },
              body: JSON.stringify({ txHash: G.txHash }),
            })
          ).ok
        )
          throw new Error("Failed to sync candidate to database");
        E({ name: "", position: "", party: "", category: "", contractId: "" }),
          M.success("Candidate added and saved to database!"),
          await B();
      } catch (k) {
        M.error(ht(k));
      } finally {
        n(!1);
      }
    },
    ee = async (h) => {
      try {
        n(!0);
        const k = i.find((G) => G.id === h);
        if (!k) {
          M.error("Candidate not found");
          return;
        }
        await Vn(k.categoryId, h), M.success("Candidate removed"), await B();
      } catch (k) {
        M.error(k?.message || "Failed to remove candidate");
      } finally {
        n(!1);
      }
    },
    le = (h) => {
      M.info("Export feature - voter data is stored on blockchain");
    },
    $ = async () => {
      await B();
    },
    te = (h) =>
      h
        ? new Date(h).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "TBD";
  return s
    ? e.jsx("div", {
        className: "container flex items-center justify-center min-h-screen",
        children: e.jsxs("div", {
          className: "flex flex-col items-center",
          children: [
            e.jsx(de, {
              className: "h-8 w-8 animate-spin text-emerald-500 mb-4",
            }),
            e.jsx("p", {
              className: "text-slate-600",
              children: "Loading admin dashboard...",
            }),
          ],
        }),
      })
    : e.jsx(zn, {
        requireAdmin: !0,
        onNavigate: t,
        children: e.jsxs("div", {
          className: "min-h-screen bg-gradient-to-b from-emerald-50 to-white",
          children: [
            e.jsx("header", {
              className:
                "border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50",
              children: e.jsxs("div", {
                className:
                  "container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-2 w-48",
                    children: [
                      e.jsx("img", {
                        src: _a,
                        alt: "APU Logo",
                        className: "h-8 w-8",
                      }),
                      e.jsx("span", {
                        className: "text-slate-900",
                        children: "Admin",
                      }),
                      e.jsx(je, {
                        className:
                          "bg-indigo-100 text-indigo-700 border-indigo-200 text-xs",
                        children: "Admin",
                      }),
                    ],
                  }),
                  e.jsxs("nav", {
                    className: "hidden md:flex gap-6 flex-1 justify-center",
                    children: [
                      e.jsx("button", {
                        onClick: () => t("home"),
                        className:
                          "text-sm font-normal transition-colors hover:text-primary",
                        children: "Home",
                      }),
                      e.jsx("button", {
                        onClick: () => t("vote"),
                        className:
                          "text-sm font-normal transition-colors hover:text-primary",
                        children: "Elections",
                      }),
                      e.jsx("button", {
                        onClick: () => t("results"),
                        className:
                          "text-sm font-normal transition-colors hover:text-primary",
                        children: "Results",
                      }),
                      e.jsx("button", {
                        onClick: () => t("about"),
                        className:
                          "text-sm font-normal transition-colors hover:text-primary",
                        children: "About",
                      }),
                      e.jsx("button", {
                        onClick: () => t("contact"),
                        className:
                          "text-sm font-normal transition-colors hover:text-primary",
                        children: "Contact",
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className: "flex items-center gap-3 w-48 justify-end",
                    children: e.jsx(Ce, { onNavigate: t }),
                  }),
                ],
              }),
            }),
            e.jsx("div", {
              className: "container mx-auto py-12 px-6",
              children: e.jsxs("div", {
                className: "flex flex-col max-w-6xl mx-auto",
                children: [
                  e.jsxs("div", {
                    className: "w-full mb-8",
                    children: [
                      e.jsx("div", {
                        className: "mb-4",
                        children: e.jsxs(b, {
                          variant: "ghost",
                          size: "sm",
                          className: "gap-1",
                          onClick: () => t("home"),
                          children: [
                            e.jsx(ge, { className: "h-4 w-4" }),
                            "Back to Home",
                          ],
                        }),
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-3 mb-2",
                        children: [
                          e.jsx("img", {
                            src: _a,
                            alt: "Asia Pacific University Logo",
                            className: "h-10 w-auto",
                          }),
                          e.jsx("h1", {
                            className: "text-slate-900",
                            children: "Admin Dashboard",
                          }),
                        ],
                      }),
                      e.jsx("p", {
                        className: "text-slate-600",
                        children:
                          "Manage elections, candidates, and monitor voting activity",
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
                    children: [
                      e.jsxs(N, {
                        children: [
                          e.jsx(A, {
                            className: "pb-2",
                            children: e.jsx(P, {
                              children: "Registered Voters",
                            }),
                          }),
                          e.jsxs(w, {
                            children: [
                              e.jsxs("div", {
                                className:
                                  "flex items-baseline justify-between",
                                children: [
                                  e.jsx("div", {
                                    className: "text-slate-900",
                                    children: f.registeredVoters,
                                  }),
                                  e.jsxs("div", {
                                    className: "text-slate-600",
                                    children: [
                                      "of ",
                                      f.totalVoters,
                                      " eligible",
                                    ],
                                  }),
                                ],
                              }),
                              e.jsx("div", {
                                className:
                                  "mt-2 h-2 w-full rounded-full bg-slate-200",
                                children: e.jsx("div", {
                                  className:
                                    "h-full rounded-full bg-emerald-500",
                                  style: {
                                    width: `${
                                      (f.registeredVoters / f.totalVoters) * 100
                                    }%`,
                                  },
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs(N, {
                        children: [
                          e.jsx(A, {
                            className: "pb-2",
                            children: e.jsx(P, { children: "Votes Cast" }),
                          }),
                          e.jsx(w, {
                            children: (() => {
                              const h = u.length || 1,
                                k = f.registeredVoters * h,
                                G = k > 0 ? (f.votesCount / k) * 100 : 0;
                              return e.jsxs(e.Fragment, {
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "flex items-baseline justify-between",
                                    children: [
                                      e.jsx("div", {
                                        className: "text-slate-900",
                                        children: f.votesCount,
                                      }),
                                      e.jsxs("div", {
                                        className: "text-slate-600",
                                        children: ["of ", k, " possible votes"],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "text-xs text-slate-500 mt-1",
                                    children: [
                                      f.registeredVoters,
                                      " voters ×",
                                      " ",
                                      h,
                                      " ",
                                      h === 1 ? "category" : "categories",
                                    ],
                                  }),
                                  e.jsx("div", {
                                    className:
                                      "mt-2 h-2 w-full rounded-full bg-slate-200",
                                    children: e.jsx("div", {
                                      className:
                                        "h-full rounded-full bg-emerald-500",
                                      style: {
                                        width: `${Math.min(G, 100).toFixed(
                                          1
                                        )}%`,
                                      },
                                    }),
                                  }),
                                ],
                              });
                            })(),
                          }),
                        ],
                      }),
                      e.jsxs(N, {
                        children: [
                          e.jsx(A, {
                            className: "pb-2",
                            children: e.jsx(P, { children: "Election Status" }),
                          }),
                          e.jsxs(w, {
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center justify-between",
                                children: [
                                  e.jsx("div", {
                                    className: "text-slate-900",
                                    children: f.electionStatus,
                                  }),
                                  e.jsx("div", {
                                    className: "flex items-center",
                                    children:
                                      f.electionStatus === "Active"
                                        ? e.jsx(Ne, {
                                            className:
                                              "h-5 w-5 text-emerald-500",
                                          })
                                        : f.electionStatus === "Ended"
                                        ? e.jsx(Ze, {
                                            className: "h-5 w-5 text-gray-500",
                                          })
                                        : e.jsx(Xe, {
                                            className: "h-5 w-5 text-amber-500",
                                          }),
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "mt-4 flex gap-2",
                                children: [
                                  e.jsx(b, {
                                    size: "sm",
                                    onClick: C,
                                    disabled: r,
                                    className:
                                      "bg-emerald-600 hover:bg-emerald-700",
                                    children: "Start Election",
                                  }),
                                  e.jsx(b, {
                                    size: "sm",
                                    variant: "outline",
                                    onClick: L,
                                    disabled:
                                      f.electionStatus !== "Active" || r,
                                    children: "End Election",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs(lt, {
                    value: o,
                    onValueChange: c,
                    className: "w-full",
                    children: [
                      e.jsxs(ct, {
                        className: "grid grid-cols-5 mb-8",
                        children: [
                          e.jsx(pe, {
                            value: "dashboard",
                            children: "Dashboard",
                          }),
                          e.jsx(pe, {
                            value: "candidates",
                            children: "Candidates",
                          }),
                          e.jsx(pe, { value: "voters", children: "Voters" }),
                          e.jsx(pe, {
                            value: "categories",
                            children: "Categories",
                          }),
                          e.jsx(pe, {
                            value: "settings",
                            children: "Settings",
                          }),
                        ],
                      }),
                      e.jsx(fe, {
                        value: "dashboard",
                        className: "space-y-6",
                        children: e.jsxs(N, {
                          children: [
                            e.jsxs(A, {
                              children: [
                                e.jsx(P, { children: "Election Overview" }),
                                e.jsx(Q, {
                                  children:
                                    "Current election status and statistics",
                                }),
                              ],
                            }),
                            e.jsx(w, {
                              children: e.jsxs("div", {
                                className: "space-y-8",
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center justify-between",
                                    children: [
                                      e.jsxs("div", {
                                        className: "space-y-1",
                                        children: [
                                          e.jsx("p", {
                                            className: "text-slate-900",
                                            children: f.electionTitle,
                                          }),
                                          e.jsx("p", {
                                            className: "text-slate-600",
                                            children:
                                              f.startDate && f.endDate
                                                ? `${te(f.startDate)} - ${te(
                                                    f.endDate
                                                  )}`
                                                : "No dates set",
                                          }),
                                        ],
                                      }),
                                      e.jsxs(b, {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: () => t("results"),
                                        children: [
                                          e.jsx(vr, {
                                            className: "h-4 w-4 mr-2",
                                          }),
                                          "View Results",
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("h3", {
                                        className: "text-slate-900 mb-4",
                                        children: "Recent Activity (Last Hour)",
                                      }),
                                      e.jsx("div", {
                                        className: "space-y-4",
                                        children:
                                          f.activities.length === 0
                                            ? e.jsxs("div", {
                                                className:
                                                  "text-center py-8 text-slate-500",
                                                children: [
                                                  e.jsx(Xe, {
                                                    className:
                                                      "h-8 w-8 mx-auto mb-2 text-slate-400",
                                                  }),
                                                  e.jsx("p", {
                                                    children:
                                                      "No recent activity in the last hour",
                                                  }),
                                                ],
                                              })
                                            : f.activities.map((h) =>
                                                e.jsxs(
                                                  "div",
                                                  {
                                                    className:
                                                      "flex items-start gap-4",
                                                    children: [
                                                      e.jsx("div", {
                                                        className:
                                                          "rounded-full bg-emerald-100 p-2",
                                                        children:
                                                          h.type ===
                                                          "voter_registered"
                                                            ? e.jsx(Ns, {
                                                                className:
                                                                  "h-4 w-4 text-emerald-600",
                                                              })
                                                            : h.type ===
                                                              "vote_cast"
                                                            ? e.jsx(Ne, {
                                                                className:
                                                                  "h-4 w-4 text-emerald-600",
                                                              })
                                                            : h.type ===
                                                              "candidate_added"
                                                            ? e.jsx(xs, {
                                                                className:
                                                                  "h-4 w-4 text-emerald-600",
                                                              })
                                                            : e.jsx(Xe, {
                                                                className:
                                                                  "h-4 w-4 text-emerald-600",
                                                              }),
                                                      }),
                                                      e.jsxs("div", {
                                                        children: [
                                                          e.jsx("p", {
                                                            className:
                                                              "text-slate-900",
                                                            children:
                                                              h.description,
                                                          }),
                                                          e.jsx("p", {
                                                            className:
                                                              "text-slate-600",
                                                            children: new Date(
                                                              h.timestamp
                                                            ).toLocaleTimeString(),
                                                          }),
                                                        ],
                                                      }),
                                                    ],
                                                  },
                                                  h.id
                                                )
                                              ),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                          ],
                        }),
                      }),
                      e.jsx(fe, {
                        value: "candidates",
                        className: "space-y-6",
                        children: e.jsxs(N, {
                          children: [
                            e.jsxs(A, {
                              children: [
                                e.jsx(P, { children: "Manage Candidates" }),
                                e.jsx(Q, {
                                  children:
                                    "Add or remove candidates for the election",
                                }),
                              ],
                            }),
                            e.jsxs(w, {
                              children: [
                                e.jsxs("form", {
                                  onSubmit: Z,
                                  className: "space-y-4 mb-8",
                                  children: [
                                    e.jsxs("div", {
                                      className:
                                        "grid grid-cols-1 md:grid-cols-3 gap-4",
                                      children: [
                                        e.jsxs("div", {
                                          className: "space-y-2",
                                          children: [
                                            e.jsx(V, {
                                              htmlFor: "name",
                                              children: "Candidate Name",
                                            }),
                                            e.jsx(J, {
                                              id: "name",
                                              value: y.name,
                                              onChange: (h) =>
                                                E({
                                                  ...y,
                                                  name: h.target.value,
                                                }),
                                              required: !0,
                                            }),
                                          ],
                                        }),
                                        e.jsxs("div", {
                                          className: "space-y-2",
                                          children: [
                                            e.jsx(V, {
                                              htmlFor: "category",
                                              children: "Category",
                                            }),
                                            e.jsxs(Oe, {
                                              value: y.category,
                                              onValueChange: (h) =>
                                                E({
                                                  ...y,
                                                  category: h,
                                                  position: h,
                                                }),
                                              required: !0,
                                              children: [
                                                e.jsx(Fe, {
                                                  className: "w-full",
                                                  children: e.jsx($e, {
                                                    placeholder:
                                                      "Select a category",
                                                  }),
                                                }),
                                                e.jsx(ze, {
                                                  children: u.map((h) =>
                                                    e.jsx(
                                                      K,
                                                      {
                                                        value: h.name,
                                                        children: h.name,
                                                      },
                                                      h.id
                                                    )
                                                  ),
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        e.jsxs("div", {
                                          className: "space-y-2",
                                          children: [
                                            e.jsx(V, {
                                              htmlFor: "party",
                                              children: "Party/Affiliation",
                                            }),
                                            e.jsx(J, {
                                              id: "party",
                                              value: y.party,
                                              onChange: (h) =>
                                                E({
                                                  ...y,
                                                  party: h.target.value,
                                                }),
                                              required: !0,
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    e.jsx(b, {
                                      type: "submit",
                                      disabled: r,
                                      className:
                                        "bg-slate-900 hover:bg-slate-800 text-white",
                                      children: r
                                        ? e.jsxs(e.Fragment, {
                                            children: [
                                              e.jsx(de, {
                                                className:
                                                  "mr-2 h-4 w-4 animate-spin",
                                              }),
                                              "Adding...",
                                            ],
                                          })
                                        : e.jsxs(e.Fragment, {
                                            children: [
                                              e.jsx(xs, {
                                                className: "mr-2 h-4 w-4",
                                              }),
                                              "Add Candidate",
                                            ],
                                          }),
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("h3", {
                                      className: "text-slate-900 mb-4",
                                      children: "Current Candidates",
                                    }),
                                    e.jsxs(Rs, {
                                      children: [
                                        e.jsx(_s, {
                                          children: e.jsxs(ft, {
                                            children: [
                                              e.jsx(ye, { children: "Name" }),
                                              e.jsx(ye, {
                                                children: "Position",
                                              }),
                                              e.jsx(ye, { children: "Party" }),
                                              e.jsx(ye, {
                                                className: "text-right",
                                                children: "Actions",
                                              }),
                                            ],
                                          }),
                                        }),
                                        e.jsx(Is, {
                                          children: f.candidates.map((h) =>
                                            e.jsxs(
                                              ft,
                                              {
                                                children: [
                                                  e.jsx(be, {
                                                    className: "text-slate-900",
                                                    children: h.name,
                                                  }),
                                                  e.jsx(be, {
                                                    className: "text-slate-600",
                                                    children: h.position,
                                                  }),
                                                  e.jsx(be, {
                                                    className: "text-slate-600",
                                                    children: h.party,
                                                  }),
                                                  e.jsx(be, {
                                                    className: "text-right",
                                                    children: e.jsx(b, {
                                                      variant: "ghost",
                                                      size: "sm",
                                                      onClick: () => ee(h.id),
                                                      children: e.jsx(ka, {
                                                        className:
                                                          "h-4 w-4 text-red-500",
                                                      }),
                                                    }),
                                                  }),
                                                ],
                                              },
                                              `${h.position}-${h.id}`
                                            )
                                          ),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                      e.jsx(fe, {
                        value: "voters",
                        className: "space-y-6",
                        children: e.jsxs(N, {
                          children: [
                            e.jsxs(A, {
                              children: [
                                e.jsx(P, { children: "Registered Voters" }),
                                e.jsx(Q, {
                                  children: "View and manage registered voters",
                                }),
                              ],
                            }),
                            e.jsxs(w, {
                              children: [
                                e.jsxs("div", {
                                  className:
                                    "flex justify-between items-center mb-6",
                                  children: [
                                    e.jsxs("div", {
                                      className: "flex gap-2",
                                      children: [
                                        e.jsx(J, {
                                          placeholder: "Search voters...",
                                          className: "w-64",
                                        }),
                                        e.jsxs(b, {
                                          variant: "outline",
                                          size: "sm",
                                          onClick: $,
                                          children: [
                                            e.jsx(vt, {
                                              className: "h-4 w-4 mr-2",
                                            }),
                                            "Refresh",
                                          ],
                                        }),
                                      ],
                                    }),
                                    e.jsxs(b, {
                                      variant: "outline",
                                      size: "sm",
                                      onClick: () => le(),
                                      children: [
                                        e.jsx(Dl, {
                                          className: "h-4 w-4 mr-2",
                                        }),
                                        "Export List",
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsxs(Rs, {
                                  children: [
                                    e.jsx(_s, {
                                      children: e.jsxs(ft, {
                                        children: [
                                          e.jsx(ye, { children: "Student ID" }),
                                          e.jsx(ye, {
                                            children: "Wallet Address",
                                          }),
                                          e.jsx(ye, { children: "Department" }),
                                          e.jsx(ye, {
                                            children: "Registration Date",
                                          }),
                                          e.jsx(ye, { children: "Voted" }),
                                        ],
                                      }),
                                    }),
                                    e.jsx(Is, {
                                      children: f.voters.map((h) =>
                                        e.jsxs(
                                          ft,
                                          {
                                            children: [
                                              e.jsx(be, {
                                                className: "text-slate-900",
                                                children: h.studentId,
                                              }),
                                              e.jsxs(be, {
                                                className:
                                                  "font-mono text-slate-600",
                                                children: [
                                                  h.walletAddress.substring(
                                                    0,
                                                    10
                                                  ),
                                                  "...",
                                                ],
                                              }),
                                              e.jsx(be, {
                                                className: "text-slate-600",
                                                children: h.department,
                                              }),
                                              e.jsx(be, {
                                                className: "text-slate-600",
                                                children: new Date(
                                                  h.registrationDate
                                                ).toLocaleDateString(),
                                              }),
                                              e.jsx(be, {
                                                children: h.hasVoted
                                                  ? e.jsx(Ne, {
                                                      className:
                                                        "h-4 w-4 text-emerald-500",
                                                    })
                                                  : e.jsx("div", {
                                                      className:
                                                        "h-4 w-4 rounded-full border border-slate-400",
                                                    }),
                                              }),
                                            ],
                                          },
                                          h.id
                                        )
                                      ),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                      e.jsx(fe, {
                        value: "categories",
                        className: "space-y-6",
                        children: e.jsxs(N, {
                          children: [
                            e.jsxs(A, {
                              children: [
                                e.jsx(P, { children: "Voting Categories" }),
                                e.jsx(Q, {
                                  children:
                                    "Manage voting categories and positions",
                                }),
                              ],
                            }),
                            e.jsxs(w, {
                              children: [
                                e.jsxs("form", {
                                  onSubmit: (h) => {
                                    h.preventDefault(), ne();
                                  },
                                  className: "space-y-4 mb-6",
                                  children: [
                                    e.jsxs("div", {
                                      className:
                                        "grid grid-cols-1 md:grid-cols-2 gap-4",
                                      children: [
                                        e.jsxs("div", {
                                          className: "space-y-2",
                                          children: [
                                            e.jsx(V, {
                                              htmlFor: "categoryName",
                                              children: "Category Name",
                                            }),
                                            e.jsx(J, {
                                              id: "categoryName",
                                              placeholder:
                                                "e.g., President, Secretary",
                                              value: v.name,
                                              onChange: (h) =>
                                                T({
                                                  ...v,
                                                  name: h.target.value,
                                                }),
                                              required: !0,
                                            }),
                                          ],
                                        }),
                                        e.jsxs("div", {
                                          className: "space-y-2",
                                          children: [
                                            e.jsx(V, {
                                              htmlFor: "categoryDescription",
                                              children: "Description",
                                            }),
                                            e.jsx(J, {
                                              id: "categoryDescription",
                                              placeholder:
                                                "Describe this position",
                                              value: v.description,
                                              onChange: (h) =>
                                                T({
                                                  ...v,
                                                  description: h.target.value,
                                                }),
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    e.jsx(b, {
                                      type: "submit",
                                      disabled: r || !v.name,
                                      className:
                                        "bg-emerald-600 hover:bg-emerald-700",
                                      children: r
                                        ? e.jsxs(e.Fragment, {
                                            children: [
                                              e.jsx(de, {
                                                className:
                                                  "mr-2 h-4 w-4 animate-spin",
                                              }),
                                              "Adding...",
                                            ],
                                          })
                                        : e.jsxs(e.Fragment, {
                                            children: [
                                              e.jsx(xs, {
                                                className: "mr-2 h-4 w-4",
                                              }),
                                              "Add Category",
                                            ],
                                          }),
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  className: "space-y-4",
                                  children: [
                                    e.jsx("h3", {
                                      className: "font-semibold",
                                      children: "Existing Categories",
                                    }),
                                    u.length === 0
                                      ? e.jsx("p", {
                                          className:
                                            "text-center text-slate-500 py-8",
                                          children:
                                            "No categories yet. Add your first category above.",
                                        })
                                      : e.jsx("div", {
                                          className: "space-y-2",
                                          children: u.map((h) =>
                                            e.jsxs(
                                              "div",
                                              {
                                                className:
                                                  "flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50",
                                                children: [
                                                  e.jsxs("div", {
                                                    children: [
                                                      e.jsx("p", {
                                                        className:
                                                          "text-sm font-medium",
                                                        children: h.name,
                                                      }),
                                                      e.jsx("p", {
                                                        className:
                                                          "text-sm text-slate-600",
                                                        children: h.description,
                                                      }),
                                                    ],
                                                  }),
                                                  e.jsx(b, {
                                                    variant: "ghost",
                                                    size: "sm",
                                                    onClick: () => X(h.id),
                                                    disabled: r,
                                                    className:
                                                      "text-red-500 hover:text-red-600 hover:bg-red-50",
                                                    children: e.jsx(ka, {
                                                      className: "h-4 w-4",
                                                    }),
                                                  }),
                                                ],
                                              },
                                              h.id
                                            )
                                          ),
                                        }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                      e.jsx(fe, {
                        value: "settings",
                        className: "space-y-6",
                        children: e.jsxs(N, {
                          children: [
                            e.jsxs(A, {
                              children: [
                                e.jsx(P, { children: "Election Settings" }),
                                e.jsx(Q, {
                                  children: "Configure election parameters",
                                }),
                              ],
                            }),
                            e.jsx(w, {
                              children: e.jsxs("form", {
                                onSubmit: oe,
                                className: "space-y-6",
                                children: [
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsx(V, {
                                        htmlFor: "title",
                                        children: "Election Title",
                                      }),
                                      e.jsx(J, {
                                        id: "title",
                                        value: j.title,
                                        onChange: (h) =>
                                          g({ ...j, title: h.target.value }),
                                        required: !0,
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className:
                                      "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                      e.jsxs("div", {
                                        className: "space-y-2",
                                        children: [
                                          e.jsx(V, {
                                            htmlFor: "startDate",
                                            children: "Start Date",
                                          }),
                                          e.jsx(J, {
                                            id: "startDate",
                                            type: "datetime-local",
                                            value: j.startDate,
                                            onChange: (h) =>
                                              g({
                                                ...j,
                                                startDate: h.target.value,
                                              }),
                                            required: !0,
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className: "space-y-2",
                                        children: [
                                          e.jsx(V, {
                                            htmlFor: "endDate",
                                            children: "End Date",
                                          }),
                                          e.jsx(J, {
                                            id: "endDate",
                                            type: "datetime-local",
                                            value: j.endDate,
                                            onChange: (h) =>
                                              g({
                                                ...j,
                                                endDate: h.target.value,
                                              }),
                                            required: !0,
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsxs("div", {
                                        className:
                                          "flex items-center justify-between",
                                        children: [
                                          e.jsx(V, {
                                            htmlFor: "allowResults",
                                            children:
                                              "Show Results During Voting",
                                          }),
                                          e.jsx(Le, {
                                            id: "allowResults",
                                            checked: R,
                                            onCheckedChange: F,
                                          }),
                                        ],
                                      }),
                                      e.jsx("p", {
                                        className: "text-sm text-slate-500",
                                        children: R
                                          ? "✓ Voters can see live results while voting is active"
                                          : "✗ Results will be hidden until voting ends",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "flex gap-3",
                                    children: [
                                      e.jsx(b, {
                                        type: "submit",
                                        disabled: r,
                                        className:
                                          "bg-blue-600 hover:bg-blue-700",
                                        children: r
                                          ? e.jsxs(e.Fragment, {
                                              children: [
                                                e.jsx(de, {
                                                  className:
                                                    "mr-2 h-4 w-4 animate-spin",
                                                }),
                                                "Saving...",
                                              ],
                                            })
                                          : "Save Settings",
                                      }),
                                      e.jsx(b, {
                                        type: "button",
                                        variant: "default",
                                        className:
                                          "bg-emerald-600 hover:bg-emerald-700",
                                        onClick: C,
                                        disabled:
                                          r || f.electionStatus === "Active",
                                        children: "Start Election",
                                      }),
                                      e.jsx(b, {
                                        type: "button",
                                        variant: "outline",
                                        onClick: L,
                                        disabled:
                                          r || f.electionStatus !== "Active",
                                        children: "End Election",
                                      }),
                                      e.jsx(b, {
                                        type: "button",
                                        variant: "destructive",
                                        className:
                                          "bg-red-600 hover:bg-red-700",
                                        onClick: H,
                                        disabled: r,
                                        children: r
                                          ? e.jsxs(e.Fragment, {
                                              children: [
                                                e.jsx(de, {
                                                  className:
                                                    "mr-2 h-4 w-4 animate-spin",
                                                }),
                                                "Resetting...",
                                              ],
                                            })
                                          : e.jsxs(e.Fragment, {
                                              children: [
                                                e.jsx(vt, {
                                                  className: "mr-2 h-4 w-4",
                                                }),
                                                "Reset System",
                                              ],
                                            }),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
      });
}
const Da = "/assets/apu-logo-CQBvUzrE.png";
function mu({ onNavigate: t }) {
  return (
    Be(),
    e.jsxs("div", {
      className:
        "flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white",
      children: [
        e.jsx("header", {
          className: "border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50",
          children: e.jsxs("div", {
            className:
              "container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8",
            children: [
              e.jsxs("div", {
                className: "flex items center gap-2 w-48",
                children: [
                  e.jsx("img", {
                    src: Da,
                    alt: "APU Logo",
                    className: "h-8 w-8",
                  }),
                  e.jsx("span", {
                    className: "text-slate-900",
                    children: "About",
                  }),
                ],
              }),
              e.jsxs("nav", {
                className: "hidden md:flex gap-6 flex-1 justify-center",
                children: [
                  e.jsx("button", {
                    onClick: () => t("home"),
                    className: "text-sm transition-colors hover:text-primary",
                    children: "Home",
                  }),
                  e.jsx("button", {
                    onClick: () => t("vote"),
                    className:
                      "text-sm font-normal transition-colors hover:text-primary",
                    children: "Elections",
                  }),
                  e.jsx("button", {
                    onClick: () => t("results"),
                    className:
                      "text-sm font-normal transition-colors hover:text-primary",
                    children: "Results",
                  }),
                  e.jsx("button", {
                    className: "text-sm font-normal text-primary",
                    children: "About",
                  }),
                  e.jsx("button", {
                    onClick: () => t("contact"),
                    className:
                      "text-sm font-normal transition-colors hover:text-primary",
                    children: "Contact",
                  }),
                ],
              }),
              e.jsx("div", {
                className: "flex items-center gap-3 w-48 justify-end",
                children: e.jsx(Ce, { onNavigate: t }),
              }),
            ],
          }),
        }),
        e.jsx("main", {
          className: "flex-1",
          children: e.jsxs("div", {
            className: "container mx-auto max-w-7xl px-6 md:px-8 py-12",
            children: [
              e.jsx("div", {
                className: "mb-6",
                children: e.jsxs(b, {
                  variant: "ghost",
                  size: "sm",
                  className: "gap-1",
                  onClick: () => t("home"),
                  children: [
                    e.jsx(ge, { className: "h-4 w-4" }),
                    "Back to Home",
                  ],
                }),
              }),
              e.jsx("div", {
                className: "mb-12",
                children: e.jsxs("div", {
                  className: "flex items-center gap-4 mb-4",
                  children: [
                    e.jsx("img", {
                      src: Da,
                      alt: "Asia Pacific University Logo",
                      className: "h-16 w-auto",
                    }),
                    e.jsxs("div", {
                      children: [
                        e.jsx("h1", {
                          className: "text-slate-900",
                          children: "About APU VOTE",
                        }),
                        e.jsx("p", {
                          className: "text-slate-600 mt-2",
                          children:
                            "Revolutionizing University Elections with Blockchain Technology",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              e.jsxs(N, {
                className: "mb-8",
                children: [
                  e.jsx(A, {
                    children: e.jsx(P, { children: "What is APU VOTE?" }),
                  }),
                  e.jsxs(w, {
                    className: "space-y-4",
                    children: [
                      e.jsx("p", {
                        className: "text-slate-900",
                        children:
                          "APU VOTE is a cutting-edge blockchain-based voting system designed specifically for Asia Pacific University elections. Our platform ensures transparent, secure, and tamper-proof elections while maintaining voter privacy and providing real-time results.",
                      }),
                      e.jsx("p", {
                        className: "text-slate-600",
                        children:
                          "Built on Ethereum blockchain technology, APU VOTE eliminates traditional voting concerns such as ballot tampering, vote manipulation, and result disputes. Every vote is cryptographically secured and permanently recorded on the blockchain, creating an immutable record of the democratic process.",
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs(N, {
                className: "mb-8",
                children: [
                  e.jsxs(A, {
                    children: [
                      e.jsx(P, { children: "Key Features" }),
                      e.jsx(Q, {
                        children:
                          "What makes APU VOTE the future of university elections",
                      }),
                    ],
                  }),
                  e.jsx(w, {
                    children: e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-start gap-3",
                          children: [
                            e.jsx(We, {
                              className:
                                "h-6 w-6 text-emerald-500 mt-1 flex-shrink-0",
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className: "text-slate-900 mb-2",
                                  children: "Blockchain Security",
                                }),
                                e.jsx("p", {
                                  className: "text-slate-600",
                                  children:
                                    "Every vote is cryptographically secured and stored on the Ethereum blockchain, making it impossible to tamper with or manipulate results.",
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "flex items-start gap-3",
                          children: [
                            e.jsx(Ze, {
                              className:
                                "h-6 w-6 text-emerald-500 mt-1 flex-shrink-0",
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className: "text-slate-900 mb-2",
                                  children: "Voter Privacy",
                                }),
                                e.jsx("p", {
                                  className: "text-slate-600",
                                  children:
                                    "Advanced cryptographic techniques ensure voter anonymity while maintaining the ability to verify that votes were counted correctly.",
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "flex items-start gap-3",
                          children: [
                            e.jsx(Ne, {
                              className:
                                "h-6 w-6 text-emerald-500 mt-1 flex-shrink-0",
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className: "text-slate-900 mb-2",
                                  children: "Transparent Process",
                                }),
                                e.jsx("p", {
                                  className: "text-slate-600",
                                  children:
                                    "All election processes are transparent and auditable. Anyone can verify the integrity of the election through blockchain explorers.",
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "flex items-start gap-3",
                          children: [
                            e.jsx(Xe, {
                              className:
                                "h-6 w-6 text-emerald-500 mt-1 flex-shrink-0",
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className: "text-slate-900 mb-2",
                                  children: "Real-time Results",
                                }),
                                e.jsx("p", {
                                  className: "text-slate-600",
                                  children:
                                    "Vote counts are updated in real-time as ballots are cast, providing immediate and accurate election results.",
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "flex items-start gap-3",
                          children: [
                            e.jsx(Ns, {
                              className:
                                "h-6 w-6 text-emerald-500 mt-1 flex-shrink-0",
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className: "text-slate-900 mb-2",
                                  children: "Student Verification",
                                }),
                                e.jsx("p", {
                                  className: "text-slate-600",
                                  children:
                                    "Integrated with university systems to verify student eligibility and prevent unauthorized voting.",
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "flex items-start gap-3",
                          children: [
                            e.jsx(lc, {
                              className:
                                "h-6 w-6 text-emerald-500 mt-1 flex-shrink-0",
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className: "text-slate-900 mb-2",
                                  children: "Mobile Friendly",
                                }),
                                e.jsx("p", {
                                  className: "text-slate-600",
                                  children:
                                    "Fully responsive design allows students to vote securely from any device, anywhere on campus or remotely.",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                ],
              }),
              e.jsxs(N, {
                className: "mb-8",
                children: [
                  e.jsxs(A, {
                    children: [
                      e.jsx(P, { children: "How It Works" }),
                      e.jsx(Q, { children: "The voting process simplified" }),
                    ],
                  }),
                  e.jsx(w, {
                    children: e.jsxs("div", {
                      className: "space-y-6",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-start gap-4",
                          children: [
                            e.jsx("div", {
                              className:
                                "rounded-full bg-emerald-100 p-2 text-emerald-600 text-sm min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0",
                              children: "1",
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className: "text-slate-900 mb-1",
                                  children: "Eligibility Verification",
                                }),
                                e.jsx("p", {
                                  className: "text-slate-600",
                                  children:
                                    "Students verify their eligibility using their student ID and matriculation number against the university database.",
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "flex items-start gap-4",
                          children: [
                            e.jsx("div", {
                              className:
                                "rounded-full bg-emerald-100 p-2 text-emerald-600 text-sm min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0",
                              children: "2",
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className: "text-slate-900 mb-1",
                                  children: "Wallet Registration",
                                }),
                                e.jsx("p", {
                                  className: "text-slate-600",
                                  children:
                                    "Connect your Ethereum wallet (MetaMask) and register as a voter. Your wallet address becomes your unique voting identifier.",
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "flex items-start gap-4",
                          children: [
                            e.jsx("div", {
                              className:
                                "rounded-full bg-emerald-100 p-2 text-emerald-600 text-sm min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0",
                              children: "3",
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className: "text-slate-900 mb-1",
                                  children: "Cast Your Vote",
                                }),
                                e.jsx("p", {
                                  className: "text-slate-600",
                                  children:
                                    "Select your preferred candidates for each position during the active voting period. Your vote is encrypted and submitted to the blockchain.",
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "flex items-start gap-4",
                          children: [
                            e.jsx("div", {
                              className:
                                "rounded-full bg-emerald-100 p-2 text-emerald-600 text-sm min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0",
                              children: "4",
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className: "text-slate-900 mb-1",
                                  children: "Blockchain Confirmation",
                                }),
                                e.jsx("p", {
                                  className: "text-slate-600",
                                  children:
                                    "Your vote is permanently recorded on the Ethereum blockchain with a unique transaction hash for verification purposes.",
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "flex items-start gap-4",
                          children: [
                            e.jsx("div", {
                              className:
                                "rounded-full bg-emerald-100 p-2 text-emerald-600 text-sm min-w-[2rem] h-8 flex items-center justify-center flex-shrink-0",
                              children: "5",
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("h3", {
                                  className: "text-slate-900 mb-1",
                                  children: "View Results",
                                }),
                                e.jsx("p", {
                                  className: "text-slate-600",
                                  children:
                                    "Monitor real-time election results and verify the integrity of the voting process through blockchain explorers.",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                ],
              }),
              e.jsxs(N, {
                className: "mb-8",
                children: [
                  e.jsxs(A, {
                    children: [
                      e.jsx(P, { children: "Technology Stack" }),
                      e.jsx(Q, {
                        children: "Built with cutting-edge technologies",
                      }),
                    ],
                  }),
                  e.jsxs(w, {
                    children: [
                      e.jsxs("div", {
                        className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6",
                        children: [
                          e.jsxs("div", {
                            className: "text-center",
                            children: [
                              e.jsx("div", {
                                className: "bg-blue-100 p-3 rounded-lg mb-2",
                                children: e.jsx(Gt, {
                                  className: "h-8 w-8 text-blue-600 mx-auto",
                                }),
                              }),
                              e.jsx("h3", {
                                className: "text-slate-900",
                                children: "Ethereum",
                              }),
                              e.jsx("p", {
                                className: "text-slate-600",
                                children: "Blockchain Platform",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "text-center",
                            children: [
                              e.jsx("div", {
                                className: "bg-gray-100 p-3 rounded-lg mb-2",
                                children: e.jsx(vr, {
                                  className: "h-8 w-8 text-gray-600 mx-auto",
                                }),
                              }),
                              e.jsx("h3", {
                                className: "text-slate-900",
                                children: "Solidity",
                              }),
                              e.jsx("p", {
                                className: "text-slate-600",
                                children: "Smart Contracts",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "text-center",
                            children: [
                              e.jsx("div", {
                                className:
                                  "bg-cyan-400 p-3 rounded-lg mb-2 flex items-center justify-center",
                                children: e.jsx("span", {
                                  className: "text-white",
                                  children: "React",
                                }),
                              }),
                              e.jsx("h3", {
                                className: "text-slate-900",
                                children: "React",
                              }),
                              e.jsx("p", {
                                className: "text-slate-600",
                                children: "Frontend Framework",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "text-center",
                            children: [
                              e.jsx("div", {
                                className: "bg-cyan-100 p-3 rounded-lg mb-2",
                                children: e.jsx("div", {
                                  className:
                                    "h-8 w-8 bg-cyan-500 rounded mx-auto",
                                }),
                              }),
                              e.jsx("h3", {
                                className: "text-slate-900",
                                children: "Tailwind CSS",
                              }),
                              e.jsx("p", {
                                className: "text-slate-600",
                                children: "Styling",
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                          e.jsx(je, {
                            variant: "secondary",
                            children: "TypeScript",
                          }),
                          e.jsx(je, {
                            variant: "secondary",
                            children: "ethers.js",
                          }),
                          e.jsx(je, {
                            variant: "secondary",
                            children: "MetaMask",
                          }),
                          e.jsx(je, {
                            variant: "secondary",
                            children: "React",
                          }),
                          e.jsx(je, {
                            variant: "secondary",
                            children: "shadcn/ui",
                          }),
                          e.jsx(je, { variant: "secondary", children: "Vite" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs(N, {
                className: "mb-8",
                children: [
                  e.jsxs(A, {
                    children: [
                      e.jsx(P, { children: "Security & Privacy" }),
                      e.jsx(Q, {
                        children: "Your vote, your privacy, our commitment",
                      }),
                    ],
                  }),
                  e.jsxs(w, {
                    className: "space-y-4",
                    children: [
                      e.jsxs("div", {
                        className: "bg-emerald-50 p-4 rounded-lg",
                        children: [
                          e.jsxs("h3", {
                            className:
                              "text-slate-900 mb-2 flex items-center gap-2",
                            children: [
                              e.jsx(We, {
                                className: "h-5 w-5 text-emerald-600",
                              }),
                              "Cryptographic Security",
                            ],
                          }),
                          e.jsx("p", {
                            className: "text-slate-600",
                            children:
                              "All votes are protected using advanced cryptographic algorithms. Once a vote is cast, it becomes mathematically impossible to alter or delete.",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "bg-blue-50 p-4 rounded-lg",
                        children: [
                          e.jsxs("h3", {
                            className:
                              "text-slate-900 mb-2 flex items-center gap-2",
                            children: [
                              e.jsx(Ze, { className: "h-5 w-5 text-blue-600" }),
                              "Voter Anonymity",
                            ],
                          }),
                          e.jsx("p", {
                            className: "text-slate-600",
                            children:
                              "While votes are publicly verifiable on the blockchain, voter identities remain completely anonymous through zero-knowledge proof techniques.",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "bg-amber-50 p-4 rounded-lg",
                        children: [
                          e.jsxs("h3", {
                            className:
                              "text-slate-900 mb-2 flex items-center gap-2",
                            children: [
                              e.jsx(js, {
                                className: "h-5 w-5 text-amber-600",
                              }),
                              "Audit Trail",
                            ],
                          }),
                          e.jsx("p", {
                            className: "text-slate-600",
                            children:
                              "Every action in the voting process is recorded with timestamps and cryptographic proofs, creating a complete audit trail for election verification.",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs(N, {
                className: "mb-8",
                children: [
                  e.jsxs(A, {
                    children: [
                      e.jsx(P, { children: "About Asia Pacific University" }),
                      e.jsx(Q, {
                        children: "Leading the way in technology education",
                      }),
                    ],
                  }),
                  e.jsxs(w, {
                    className: "space-y-4",
                    children: [
                      e.jsx("p", {
                        className: "text-slate-900",
                        children:
                          "Asia Pacific University (APU) is among Malaysia's premier private universities, and is where a unique fusion of technology, innovation and creativity works effectively towards preparing professional graduates for significant roles in business and society globally.",
                      }),
                      e.jsx("p", {
                        className: "text-slate-600",
                        children:
                          "APU has earned an enviable reputation as an award-winning university through its achievements in winning a host of prestigious awards at national and international levels. The university is committed to providing excellent educational opportunities and maintaining high standards of academic excellence.",
                      }),
                      e.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-6",
                        children: [
                          e.jsxs("div", {
                            className: "text-center p-4 bg-slate-50 rounded-lg",
                            children: [
                              e.jsx(Ns, {
                                className:
                                  "h-8 w-8 text-emerald-600 mx-auto mb-2",
                              }),
                              e.jsx("h3", {
                                className: "text-slate-900",
                                children: "12,000+",
                              }),
                              e.jsx("p", {
                                className: "text-slate-600",
                                children: "Students",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "text-center p-4 bg-slate-50 rounded-lg",
                            children: [
                              e.jsx(Gt, {
                                className:
                                  "h-8 w-8 text-emerald-600 mx-auto mb-2",
                              }),
                              e.jsx("h3", {
                                className: "text-slate-900",
                                children: "130+",
                              }),
                              e.jsx("p", {
                                className: "text-slate-600",
                                children: "Countries",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "text-center p-4 bg-slate-50 rounded-lg",
                            children: [
                              e.jsx(js, {
                                className:
                                  "h-8 w-8 text-emerald-600 mx-auto mb-2",
                              }),
                              e.jsx("h3", {
                                className: "text-slate-900",
                                children: "25+",
                              }),
                              e.jsx("p", {
                                className: "text-slate-600",
                                children: "Years of Excellence",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs(N, {
                children: [
                  e.jsxs(A, {
                    children: [
                      e.jsx(P, { children: "Contact & Support" }),
                      e.jsx(Q, { children: "Get in touch with our team" }),
                    ],
                  }),
                  e.jsxs(w, {
                    children: [
                      e.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                        children: [
                          e.jsxs("div", {
                            children: [
                              e.jsx("h3", {
                                className: "text-slate-900 mb-4",
                                children: "Technical Support",
                              }),
                              e.jsxs("div", {
                                className: "space-y-3",
                                children: [
                                  e.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                      e.jsx(gt, {
                                        className: "h-4 w-4 text-slate-600",
                                      }),
                                      e.jsx("span", {
                                        className: "text-slate-900",
                                        children: "support@apuvote.edu.my",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                      e.jsx(Ct, {
                                        className: "h-4 w-4 text-slate-600",
                                      }),
                                      e.jsx("span", {
                                        className: "text-slate-900",
                                        children: "+60 3-8996 1000",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "flex items-start gap-3",
                                    children: [
                                      e.jsx(zs, {
                                        className:
                                          "h-4 w-4 text-slate-600 mt-0.5",
                                      }),
                                      e.jsxs("span", {
                                        className: "text-slate-900",
                                        children: [
                                          "Technology Park Malaysia",
                                          e.jsx("br", {}),
                                          "57000 Kuala Lumpur",
                                          e.jsx("br", {}),
                                          "Malaysia",
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("h3", {
                                className: "text-slate-900 mb-4",
                                children: "Election Committee",
                              }),
                              e.jsxs("div", {
                                className: "space-y-3",
                                children: [
                                  e.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                      e.jsx(gt, {
                                        className: "h-4 w-4 text-slate-600",
                                      }),
                                      e.jsx("span", {
                                        className: "text-slate-900",
                                        children: "elections@apu.edu.my",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                      e.jsx(Ct, {
                                        className: "h-4 w-4 text-slate-600",
                                      }),
                                      e.jsx("span", {
                                        className: "text-slate-900",
                                        children: "+60 3-8996 1234",
                                      }),
                                    ],
                                  }),
                                  e.jsx("p", {
                                    className: "text-slate-600",
                                    children:
                                      "For election-related inquiries, candidate registration, and voting assistance.",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsx("div", {
                        className: "mt-6 pt-6 border-t",
                        children: e.jsx("p", {
                          className: "text-slate-600 text-center",
                          children:
                            "APU VOTE is developed and maintained by the Computer Science Department in collaboration with the Student Affairs Office.",
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
        e.jsx("footer", {
          className: "w-full border-t py-6 mt-12",
          children: e.jsxs("div", {
            className:
              "container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8",
            children: [
              e.jsxs("p", {
                className: "text-center text-slate-600 md:text-left",
                children: [
                  "© ",
                  new Date().getFullYear(),
                  " APU Vote Chain. All rights reserved.",
                ],
              }),
              e.jsxs("div", {
                className: "flex gap-6",
                children: [
                  e.jsx("button", {
                    onClick: () => t("terms"),
                    className: "text-sm text-slate-600 hover:text-slate-900",
                    children: "Terms",
                  }),
                  e.jsx("button", {
                    onClick: () => t("privacy"),
                    className: "text-sm text-slate-600 hover:text-slate-900",
                    children: "Privacy",
                  }),
                  e.jsx("button", {
                    onClick: () => t("contact"),
                    className: "text-sm text-slate-600 hover:text-slate-900",
                    children: "Contact",
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    })
  );
}
function Un({ className: t, ...s }) {
  return e.jsx("textarea", {
    "data-slot": "textarea",
    className: O(
      "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      t
    ),
    ...s,
  });
}
const uu = "/apu-logo.png";
function xu({ onNavigate: t }) {
  Be();
  const s = (a) => {
    a.preventDefault(), console.log("Contact form submitted");
  };
  return e.jsxs("div", {
    className:
      "flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white",
    children: [
      e.jsx("header", {
        className: "border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-2 w-48",
              children: [
                e.jsx("img", {
                  src: uu,
                  alt: "APU Logo",
                  className: "h-8 w-8",
                }),
                e.jsx("span", {
                  className: "text-slate-900",
                  children: "Contact",
                }),
              ],
            }),
            e.jsxs("nav", {
              className: "hidden md:flex gap-6 flex-1 justify-center",
              children: [
                e.jsx("button", {
                  onClick: () => t("home"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Home",
                }),
                e.jsx("button", {
                  onClick: () => t("vote"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Elections",
                }),
                e.jsx("button", {
                  onClick: () => t("results"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Results",
                }),
                e.jsx("button", {
                  onClick: () => t("about"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "About",
                }),
                e.jsx("button", {
                  className: "text-sm font-normal text-primary",
                  children: "Contact",
                }),
              ],
            }),
            e.jsx("div", {
              className: "flex items-center gap-3 w-48 justify-end",
              children: e.jsx(Ce, { onNavigate: t }),
            }),
          ],
        }),
      }),
      e.jsx("main", {
        className: "flex-1",
        children: e.jsxs("div", {
          className: "container mx-auto max-w-7xl py-16 px-6 md:px-8",
          children: [
            e.jsx("div", {
              className: "mb-6",
              children: e.jsxs(b, {
                variant: "ghost",
                size: "sm",
                className: "gap-1",
                onClick: () => t("home"),
                children: [e.jsx(ge, { className: "h-4 w-4" }), "Back to Home"],
              }),
            }),
            e.jsxs("div", {
              className: "mb-8",
              children: [
                e.jsx("h1", {
                  className: "text-slate-900 mb-2",
                  children: "Contact Us",
                }),
                e.jsx("p", {
                  className: "text-slate-600",
                  children:
                    "Have questions about APU VOTE? We're here to help. Reach out to us through any of the channels below.",
                }),
              ],
            }),
            e.jsxs("div", {
              className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12",
              children: [
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx("div", {
                            className: "p-2 bg-emerald-100 rounded-lg",
                            children: e.jsx(gt, {
                              className: "h-6 w-6 text-emerald-600",
                            }),
                          }),
                          e.jsx(P, { children: "Email Us" }),
                        ],
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "space-y-2 text-slate-600",
                        children: [
                          e.jsx("div", {
                            children: e.jsx("strong", {
                              className: "text-slate-900",
                              children: "General Inquiries:",
                            }),
                          }),
                          e.jsx("a", {
                            href: "mailto:vote@apu.edu.my",
                            className: "text-emerald-600 hover:underline block",
                            children: "vote@apu.edu.my",
                          }),
                          e.jsx("div", {
                            className: "mt-3",
                            children: e.jsx("strong", {
                              className: "text-slate-900",
                              children: "Technical Support:",
                            }),
                          }),
                          e.jsx("a", {
                            href: "mailto:support@apu.edu.my",
                            className: "text-emerald-600 hover:underline block",
                            children: "support@apu.edu.my",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx("div", {
                            className: "p-2 bg-emerald-100 rounded-lg",
                            children: e.jsx(Ct, {
                              className: "h-6 w-6 text-emerald-600",
                            }),
                          }),
                          e.jsx(P, { children: "Call Us" }),
                        ],
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "space-y-2 text-slate-600",
                        children: [
                          e.jsx("div", {
                            children: e.jsx("strong", {
                              className: "text-slate-900",
                              children: "Main Line:",
                            }),
                          }),
                          e.jsx("a", {
                            href: "tel:+60389961000",
                            className: "text-emerald-600 hover:underline block",
                            children: "+60 3-8996 1000",
                          }),
                          e.jsx("div", {
                            className: "mt-3",
                            children: e.jsx("strong", {
                              className: "text-slate-900",
                              children: "Student Services:",
                            }),
                          }),
                          e.jsx("a", {
                            href: "tel:+60389961234",
                            className: "text-emerald-600 hover:underline block",
                            children: "+60 3-8996 1234",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx("div", {
                            className: "p-2 bg-emerald-100 rounded-lg",
                            children: e.jsx(zs, {
                              className: "h-6 w-6 text-emerald-600",
                            }),
                          }),
                          e.jsx(P, { children: "Visit Us" }),
                        ],
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "leading-relaxed text-slate-600",
                        children: [
                          e.jsx("div", {
                            className: "text-slate-900 mb-1",
                            children: "Asia Pacific University",
                          }),
                          e.jsx("div", {
                            children: "Technology Park Malaysia",
                          }),
                          e.jsx("div", { children: "Bukit Jalil" }),
                          e.jsx("div", { children: "57000 Kuala Lumpur" }),
                          e.jsx("div", { children: "Malaysia" }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs("div", {
              className: "grid gap-8 lg:grid-cols-2 mb-12",
              children: [
                e.jsxs(N, {
                  children: [
                    e.jsxs(A, {
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center gap-3",
                          children: [
                            e.jsx(Yl, {
                              className: "h-6 w-6 text-emerald-500",
                            }),
                            e.jsx(P, { children: "Send Us a Message" }),
                          ],
                        }),
                        e.jsx(Q, {
                          children:
                            "Fill out the form below and we'll get back to you within 24 hours.",
                        }),
                      ],
                    }),
                    e.jsx(w, {
                      children: e.jsxs("form", {
                        onSubmit: s,
                        className: "space-y-4",
                        children: [
                          e.jsxs("div", {
                            className: "grid gap-4 md:grid-cols-2",
                            children: [
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx(V, {
                                    htmlFor: "firstName",
                                    children: "First Name *",
                                  }),
                                  e.jsx(J, {
                                    id: "firstName",
                                    placeholder: "John",
                                    required: !0,
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx(V, {
                                    htmlFor: "lastName",
                                    children: "Last Name *",
                                  }),
                                  e.jsx(J, {
                                    id: "lastName",
                                    placeholder: "Doe",
                                    required: !0,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx(V, {
                                htmlFor: "email",
                                children: "University Email *",
                              }),
                              e.jsx(J, {
                                id: "email",
                                type: "email",
                                placeholder: "tp123456@mail.apu.edu.my",
                                required: !0,
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx(V, {
                                htmlFor: "studentId",
                                children: "Student ID *",
                              }),
                              e.jsx(J, {
                                id: "studentId",
                                placeholder: "TP123456",
                                required: !0,
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx(V, {
                                htmlFor: "subject",
                                children: "Subject *",
                              }),
                              e.jsx(J, {
                                id: "subject",
                                placeholder: "Question about voting process",
                                required: !0,
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx(V, {
                                htmlFor: "message",
                                children: "Message *",
                              }),
                              e.jsx(Un, {
                                id: "message",
                                placeholder:
                                  "Please describe your question or concern in detail...",
                                rows: 5,
                                required: !0,
                              }),
                            ],
                          }),
                          e.jsx(b, {
                            type: "submit",
                            className:
                              "w-full bg-emerald-600 hover:bg-emerald-700",
                            children: "Send Message",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "space-y-6",
                  children: [
                    e.jsxs(N, {
                      children: [
                        e.jsx(A, {
                          children: e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [
                              e.jsx(Xe, {
                                className: "h-6 w-6 text-emerald-500",
                              }),
                              e.jsx(P, { children: "Support Hours" }),
                            ],
                          }),
                        }),
                        e.jsx(w, {
                          children: e.jsxs("div", {
                            className: "space-y-3 text-slate-600",
                            children: [
                              e.jsxs("div", {
                                children: [
                                  e.jsx("div", {
                                    className: "text-slate-900",
                                    children: "During Election Period:",
                                  }),
                                  e.jsx("div", {
                                    children:
                                      "Monday - Sunday: 8:00 AM - 10:00 PM",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx("div", {
                                    className: "text-slate-900",
                                    children: "Regular Hours:",
                                  }),
                                  e.jsx("div", {
                                    children:
                                      "Monday - Friday: 9:00 AM - 6:00 PM",
                                  }),
                                  e.jsx("div", {
                                    children: "Saturday: 9:00 AM - 1:00 PM",
                                  }),
                                  e.jsx("div", {
                                    children:
                                      "Sunday & Public Holidays: Closed",
                                  }),
                                ],
                              }),
                              e.jsx("div", {
                                className: "text-slate-500 italic",
                                children:
                                  "All times are in Malaysia Standard Time (GMT+8)",
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                    e.jsxs(N, {
                      children: [
                        e.jsx(A, {
                          children: e.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [
                              e.jsx(Pl, {
                                className: "h-6 w-6 text-emerald-500",
                              }),
                              e.jsx(P, {
                                children: "Frequently Asked Questions",
                              }),
                            ],
                          }),
                        }),
                        e.jsx(w, {
                          children: e.jsxs("div", {
                            className: "space-y-4 text-slate-600",
                            children: [
                              e.jsxs("div", {
                                children: [
                                  e.jsx("div", {
                                    className: "text-slate-900 mb-1",
                                    children: "How do I register to vote?",
                                  }),
                                  e.jsx("div", {
                                    children: `Click the "Register" button and use your @apu.edu.my email to create an account. You'll need your student ID for verification.`,
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx("div", {
                                    className: "text-slate-900 mb-1",
                                    children: "Is my vote really anonymous?",
                                  }),
                                  e.jsx("div", {
                                    children:
                                      "Yes! Your vote is encrypted and recorded on the blockchain without any connection to your identity. Not even administrators can see how you voted.",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx("div", {
                                    className: "text-slate-900 mb-1",
                                    children: "Can I change my vote?",
                                  }),
                                  e.jsx("div", {
                                    children:
                                      "No. Once submitted to the blockchain, votes are permanent and cannot be changed. Please review your choices carefully before submitting.",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx("div", {
                                    className: "text-slate-900 mb-1",
                                    children: "What if I forget my password?",
                                  }),
                                  e.jsx("div", {
                                    children:
                                      'Use the "Forgot Password" link on the login page. A reset link will be sent to your university email.',
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                    e.jsxs(N, {
                      children: [
                        e.jsx(A, {
                          children: e.jsx(P, {
                            children: "Need Immediate Help?",
                          }),
                        }),
                        e.jsx(w, {
                          children: e.jsxs("div", {
                            className: "space-y-3 text-slate-600",
                            children: [
                              e.jsx("div", {
                                children:
                                  "For urgent technical issues during active elections, please call our hotline:",
                              }),
                              e.jsx("a", {
                                href: "tel:+60389961000",
                                className:
                                  "text-emerald-600 hover:underline block",
                                children: "+60 3-8996 1000",
                              }),
                              e.jsx("div", {
                                className: "text-slate-500",
                                children:
                                  "Available during election periods only",
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs(N, {
              className: "bg-emerald-50 border-emerald-200",
              children: [
                e.jsx(A, {
                  children: e.jsx(P, {
                    className: "text-center",
                    children: "Important Notice",
                  }),
                }),
                e.jsx(w, {
                  children: e.jsxs("div", {
                    className: "text-center text-slate-600",
                    children: [
                      "For issues related to election rules, candidate complaints, or official grievances, please contact the APU Student Council Elections Committee directly at",
                      " ",
                      e.jsx("a", {
                        href: "mailto:elections@apu.edu.my",
                        className: "text-emerald-600 hover:underline",
                        children: "elections@apu.edu.my",
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
      }),
      e.jsx("footer", {
        className: "w-full border-t py-6 mt-12",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "text-center text-slate-600 md:text-left",
              children: [
                "© ",
                new Date().getFullYear(),
                " APU Vote Chain. All rights reserved.",
              ],
            }),
            e.jsxs("div", {
              className: "flex gap-6",
              children: [
                e.jsx("button", {
                  onClick: () => t("terms"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Terms",
                }),
                e.jsx("button", {
                  onClick: () => t("privacy"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Privacy",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Contact",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
const hu = "/apu-logo.png";
function pu({ onNavigate: t }) {
  const [s, a] = d.useState(!0),
    [r, n] = d.useState(!1),
    [o, c] = d.useState([]),
    [l, m] = d.useState([]),
    [u, p] = d.useState(""),
    [i, x] = d.useState(new Date()),
    [j, g] = d.useState("APU Election"),
    [v, T] = d.useState(!0),
    [y, E] = d.useState(!1),
    R = Be();
  d.useEffect(() => {
    B();
  }, []);
  const F = (H) => o.filter((ne) => ne.category === H),
    f = (H) => {
      const ne = F(H),
        X = {};
      return (
        ne.forEach((Z) => {
          X[Z.position] || (X[Z.position] = []), X[Z.position].push(Z);
        }),
        Object.keys(X).forEach((Z) => {
          X[Z].sort((ee, le) => le.votes - ee.votes);
        }),
        X
      );
    },
    B = async () => {
      try {
        a(!0);
        const [H, ne] = await Promise.all([as(), It()]),
          X = H.filter((ee) => ee.isActive);
        m(
          X.map((ee) => ({
            id: String(ee.id),
            name: ee.name,
            description: ee.description,
            maxVotes: 1,
            isActive: ee.isActive,
          }))
        ),
          X.length > 0 && p(X[0].name);
        const Z = [];
        for (const ee of X)
          (await rs(ee.id)).forEach(($) => {
            Z.push({
              id: String($.id),
              name: $.name,
              position: ee.name,
              party: $.party,
              category: ee.name,
              votes: Number($.votes || $.voteCount || 0),
            });
          });
        c(Z),
          g(ne.title || "APU Election"),
          E(ne.isActive),
          T(!0),
          x(new Date());
      } catch (H) {
        console.error("Error fetching results:", H), c([]), m([]);
      } finally {
        a(!1), n(!1);
      }
    },
    oe = () => {
      n(!0), B();
    },
    C = (H, ne) => (ne === 0 ? 0 : Math.round((H / ne) * 100)),
    L = (H) => H.reduce((ne, X) => ne + X.votes, 0);
  return e.jsxs("div", {
    className:
      "flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white",
    children: [
      e.jsx("header", {
        className: "border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-2 w-48",
              children: [
                e.jsx("img", {
                  src: hu,
                  alt: "APU Logo",
                  className: "h-8 w-8",
                }),
                e.jsx("span", {
                  className: "text-slate-900",
                  children: "Election Results",
                }),
              ],
            }),
            e.jsxs("nav", {
              className: "hidden md:flex gap-6 flex-1 justify-center",
              children: [
                e.jsx("button", {
                  onClick: () => t("home"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Home",
                }),
                e.jsx("button", {
                  onClick: () => t("vote"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Elections",
                }),
                e.jsx("button", {
                  onClick: () => t("results"),
                  className: "text-sm font-normal text-primary",
                  children: "Results",
                }),
                e.jsx("button", {
                  onClick: () => t("about"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "About",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Contact",
                }),
              ],
            }),
            e.jsx("div", {
              className: "flex items-center gap-3 w-48 justify-end",
              children: R && e.jsx(Ce, { onNavigate: t }),
            }),
          ],
        }),
      }),
      e.jsx("main", {
        className: "flex-1 container mx-auto max-w-7xl px-6 md:px-8 py-16",
        children: e.jsxs("div", {
          className: "mx-auto max-w-6xl",
          children: [
            e.jsxs("div", {
              className: "mb-8",
              children: [
                e.jsxs(b, {
                  variant: "ghost",
                  size: "sm",
                  className: "gap-1 mb-4",
                  onClick: () => t("home"),
                  children: [
                    e.jsx(ge, { className: "h-4 w-4" }),
                    "Back to Home",
                  ],
                }),
                e.jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [
                    e.jsxs("div", {
                      children: [
                        e.jsx("h1", {
                          className: "text-slate-900 mb-2",
                          children: j,
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-4 text-slate-600",
                          children: [
                            e.jsxs("span", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx(Xe, { className: "h-4 w-4" }),
                                "Last updated: ",
                                i.toLocaleTimeString(),
                              ],
                            }),
                            y &&
                              e.jsx("span", {
                                className:
                                  "px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm",
                                children: "Election In Progress",
                              }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs(b, {
                      variant: "outline",
                      size: "sm",
                      onClick: oe,
                      disabled: r,
                      className: "gap-2",
                      children: [
                        e.jsx(vt, {
                          className: `h-4 w-4 ${r ? "animate-spin" : ""}`,
                        }),
                        "Refresh",
                      ],
                    }),
                  ],
                }),
              ],
            }),
            !v && y
              ? e.jsx(N, {
                  children: e.jsx(w, {
                    className: "py-16",
                    children: e.jsxs("div", {
                      className:
                        "flex flex-col items-center justify-center text-center space-y-4",
                      children: [
                        e.jsx(nt, { className: "h-16 w-16 text-amber-500" }),
                        e.jsx("h3", {
                          className: "text-slate-900",
                          children: "Results Hidden",
                        }),
                        e.jsx("p", {
                          className: "text-slate-600 max-w-md",
                          children:
                            "Results are hidden during the voting period. Please check back after the election ends to view the results.",
                        }),
                      ],
                    }),
                  }),
                })
              : s
              ? e.jsx(N, {
                  children: e.jsx(w, {
                    className: "py-16",
                    children: e.jsxs("div", {
                      className: "flex flex-col items-center justify-center",
                      children: [
                        e.jsx(vt, {
                          className:
                            "h-8 w-8 animate-spin text-emerald-500 mb-4",
                        }),
                        e.jsx("p", {
                          className: "text-slate-600",
                          children: "Loading results...",
                        }),
                      ],
                    }),
                  }),
                })
              : l.length === 0
              ? e.jsx(N, {
                  children: e.jsx(w, {
                    className: "py-16",
                    children: e.jsxs("div", {
                      className:
                        "flex flex-col items-center justify-center text-center space-y-4",
                      children: [
                        e.jsx(nt, { className: "h-16 w-16 text-amber-500" }),
                        e.jsx("h3", {
                          className: "text-slate-900",
                          children: "No Categories Available",
                        }),
                        e.jsx("p", {
                          className: "text-slate-600 max-w-md",
                          children:
                            "The election administrator hasn't set up any voting categories yet.",
                        }),
                      ],
                    }),
                  }),
                })
              : e.jsxs(lt, {
                  value: u,
                  onValueChange: p,
                  className: "w-full",
                  children: [
                    e.jsx(ct, {
                      className:
                        "flex w-full mb-6 overflow-x-auto whitespace-nowrap gap-2 bg-slate-100 p-2 rounded-lg",
                      children: l.map((H) =>
                        e.jsx(
                          pe,
                          {
                            value: H.name,
                            className:
                              "flex-shrink-0 min-w-[120px] data-[state=active]:bg-white data-[state=active]:shadow-sm",
                            children: H.name,
                          },
                          H.id
                        )
                      ),
                    }),
                    l.map((H) => {
                      const ne = f(H.name);
                      return e.jsx(
                        fe,
                        {
                          value: H.name,
                          className: "space-y-6",
                          children:
                            Object.keys(ne).length === 0
                              ? e.jsx(N, {
                                  children: e.jsx(w, {
                                    className: "py-12",
                                    children: e.jsx("div", {
                                      className: "text-center",
                                      children: e.jsx("p", {
                                        className: "text-slate-600",
                                        children:
                                          "No candidates in this category yet.",
                                      }),
                                    }),
                                  }),
                                })
                              : Object.entries(ne).map(([X, Z]) => {
                                  const ee = L(Z);
                                  return e.jsxs(
                                    N,
                                    {
                                      className: "border-2 shadow-lg",
                                      children: [
                                        e.jsxs(A, {
                                          children: [
                                            e.jsx(P, { children: X }),
                                            e.jsxs(Q, {
                                              children: [
                                                "Total votes cast: ",
                                                ee,
                                              ],
                                            }),
                                          ],
                                        }),
                                        e.jsx(w, {
                                          className: "space-y-4",
                                          children: Z.map((le, $) => {
                                            const te = C(le.votes, ee),
                                              h = $ === 0 && ee > 0;
                                            return e.jsxs(
                                              "div",
                                              {
                                                className: `p-4 rounded-lg border ${
                                                  h
                                                    ? "border-emerald-500 bg-emerald-50"
                                                    : "border-slate-200"
                                                }`,
                                                children: [
                                                  e.jsxs("div", {
                                                    className:
                                                      "flex items-center justify-between mb-2",
                                                    children: [
                                                      e.jsxs("div", {
                                                        className:
                                                          "flex items-center gap-3",
                                                        children: [
                                                          e.jsx("div", {
                                                            className: `flex h-8 w-8 items-center justify-center rounded-full ${
                                                              h
                                                                ? "bg-emerald-500 text-white"
                                                                : "bg-slate-200 text-slate-600"
                                                            }`,
                                                            children: $ + 1,
                                                          }),
                                                          e.jsxs("div", {
                                                            children: [
                                                              e.jsxs("div", {
                                                                className:
                                                                  "flex items-center gap-2",
                                                                children: [
                                                                  e.jsx(
                                                                    "span",
                                                                    {
                                                                      className:
                                                                        "text-slate-900",
                                                                      children:
                                                                        le.name,
                                                                    }
                                                                  ),
                                                                  h &&
                                                                    e.jsx(
                                                                      "span",
                                                                      {
                                                                        className:
                                                                          "px-2 py-0.5 bg-emerald-500 text-white rounded text-xs",
                                                                        children:
                                                                          "Leading",
                                                                      }
                                                                    ),
                                                                ],
                                                              }),
                                                              e.jsx("div", {
                                                                className:
                                                                  "text-slate-600",
                                                                children:
                                                                  le.party,
                                                              }),
                                                            ],
                                                          }),
                                                        ],
                                                      }),
                                                      e.jsxs("div", {
                                                        className: "text-right",
                                                        children: [
                                                          e.jsxs("div", {
                                                            className:
                                                              "text-slate-900",
                                                            children: [
                                                              le.votes,
                                                              " votes",
                                                            ],
                                                          }),
                                                          e.jsxs("div", {
                                                            className:
                                                              "text-slate-600",
                                                            children: [te, "%"],
                                                          }),
                                                        ],
                                                      }),
                                                    ],
                                                  }),
                                                  e.jsx("div", {
                                                    className:
                                                      "w-full h-2 bg-slate-200 rounded-full overflow-hidden",
                                                    children: e.jsx("div", {
                                                      className: `h-full transition-all ${
                                                        h
                                                          ? "bg-emerald-500"
                                                          : "bg-slate-400"
                                                      }`,
                                                      style: {
                                                        width: `${te}%`,
                                                      },
                                                    }),
                                                  }),
                                                ],
                                              },
                                              le.id
                                            );
                                          }),
                                        }),
                                      ],
                                    },
                                    X
                                  );
                                }),
                        },
                        H.id
                      );
                    }),
                  ],
                }),
            e.jsxs(N, {
              className: "mt-8",
              children: [
                e.jsx(A, {
                  children: e.jsx(P, { children: "Election Information" }),
                }),
                e.jsxs(w, {
                  className: "space-y-2",
                  children: [
                    e.jsxs("div", {
                      className: "flex justify-between text-slate-600",
                      children: [
                        e.jsx("span", { children: "Total Categories:" }),
                        e.jsx("span", {
                          className: "text-slate-900",
                          children: l.length,
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "flex justify-between text-slate-600",
                      children: [
                        e.jsx("span", { children: "Total Candidates:" }),
                        e.jsx("span", {
                          className: "text-slate-900",
                          children: o.length,
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "flex justify-between text-slate-600",
                      children: [
                        e.jsx("span", { children: "Status:" }),
                        e.jsx("span", {
                          className: "text-slate-900",
                          children: y ? "In Progress" : "Completed",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
const fu = {
    hoodi: {
      chainId: "0x88BB0",
      chainName: "Ethereum Hoodi",
      rpcUrls: ["https://rpc.hoodi.ethpandaops.io"],
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      blockExplorerUrls: ["https://explorer.hoodi.ethpandaops.io"],
    },
    sepolia: {
      chainId: "0xaa36a7",
      chainName: "Sepolia Testnet",
      rpcUrls: ["https://rpc.sepolia.org"],
      nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
      blockExplorerUrls: ["https://sepolia.etherscan.io"],
    },
    localhost: {
      chainId: "0x7a69",
      chainName: "Localhost",
      rpcUrls: ["http://127.0.0.1:8545"],
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      blockExplorerUrls: [],
    },
    polygon: {
      chainId: "0x89",
      chainName: "Polygon Mainnet",
      rpcUrls: ["https://polygon-rpc.com"],
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      blockExplorerUrls: ["https://polygonscan.com"],
    },
    mumbai: {
      chainId: "0x13881",
      chainName: "Mumbai Testnet",
      rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    },
  },
  gu = "http://localhost:3001/api";
function vu() {
  return localStorage.getItem("user_id");
}
async function ns(t, s = {}) {
  const a = `${gu}${t}`,
    r = vu(),
    n = { "Content-Type": "application/json", ...s.headers };
  r && (n["x-user-id"] = r);
  const o = await fetch(a, { ...s, headers: n });
  if (!o.ok) {
    const c = await o.json().catch(() => ({}));
    throw new Error(c.error || `HTTP error! status: ${o.status}`);
  }
  return await o.json();
}
async function ju() {
  return ns("/elections/active");
}
async function yu() {
  const t = await ju();
  if (!t?.id)
    throw new Error(
      "No active election found in DB (elections.is_active = true)."
    );
  return t.id;
}
async function bu(t) {
  return ns("/register-voter", { method: "POST", body: JSON.stringify(t) });
}
async function Nu(t) {
  const s = await yu();
  return ns(`/categories?election_id=${encodeURIComponent(s)}`);
}
async function Va(t, s) {
  return ns(`/categories/${t}`, { method: "PUT", body: JSON.stringify(s) });
}
const La = "cyfungjmrumokdjkgnhr",
  Oa =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5ZnVuZ2ptcnVtb2tkamtnbmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MDI0ODUsImV4cCI6MjA3NjQ3ODQ4NX0.sil07Gf8FytbMEHNG-ySiL0Z6Cl5nfWKPP9BLscg_98",
  $a = "/apu-logo.png";
function wu({ onNavigate: t, onRegistrationComplete: s }) {
  const [a, r] = d.useState(1),
    [n, o] = d.useState(!1),
    [c, l] = d.useState(!1),
    [m, u] = d.useState(!1),
    [p, i] = d.useState(""),
    [x, j] = d.useState({
      studentId: "",
      department: "",
      year: "",
      walletAddress: "",
    }),
    g = Be();
  d.useEffect(() => {
    v();
  }, []);
  const v = async () => {
      if (typeof window < "u" && typeof window.ethereum < "u")
        try {
          const E = await window.ethereum.request({ method: "eth_accounts" });
          if (E?.length > 0) {
            const R = E[0];
            try {
              if (
                (
                  await (
                    await fetch(
                      `https://${La}.supabase.co/functions/v1/make-server-14835f38/voter/${R}`,
                      { headers: { Authorization: `Bearer ${Oa}` } }
                    )
                  ).json()
                )?.registered
              ) {
                t("vote");
                return;
              }
            } catch (F) {
              console.log("Error checking voter registration:", F);
            }
            j((F) => ({ ...F, walletAddress: R })), u(!0), r(2);
          }
        } catch (E) {
          console.error("Error checking wallet connection:", E);
        }
    },
    T = async () => {
      o(!0), i("");
      try {
        if (typeof window > "u" || typeof window.ethereum > "u") {
          i("MetaMask is not installed. Please install MetaMask to continue."),
            M.error("MetaMask not found");
          return;
        }
        try {
          const R = await window.ethereum.request({ method: "eth_chainId" }),
            F = fu.hoodi.chainId;
          R !== F && console.log("Not on Hoodi. Current chain:", R);
        } catch (R) {
          console.log("Could not read chainId:", R);
        }
        const E = await An();
        try {
          if (
            (
              await (
                await fetch(
                  `https://${La}.supabase.co/functions/v1/make-server-14835f38/voter/${E}`,
                  { headers: { Authorization: `Bearer ${Oa}` } }
                )
              ).json()
            )?.registered
          ) {
            M.success("Wallet already registered!"), t("vote");
            return;
          }
        } catch (R) {
          console.log("Error checking voter registration:", R);
        }
        j((R) => ({ ...R, walletAddress: E })),
          u(!0),
          M.success(`Wallet connected: ${E.slice(0, 6)}...${E.slice(-4)}`),
          r(2);
      } catch (E) {
        console.error("Failed to connect wallet:", E),
          E?.code === 4001
            ? (i(
                "Connection rejected. Please approve the connection request in MetaMask."
              ),
              M.error("Connection rejected"))
            : (i(E?.message || "Failed to connect wallet. Please try again."),
              M.error(E?.message || "Failed to connect wallet"));
      } finally {
        o(!1);
      }
    },
    y = async (E) => {
      if ((E.preventDefault(), !/^TP\d{6}$/.test(x.studentId))) {
        M.error(
          "Student ID must be in format: TP followed by 6 digits (e.g., TP123456)"
        ),
          i("Invalid Student ID format. Please use format: TP123456");
        return;
      }
      if (!x.studentId || !x.department || !x.year || !x.walletAddress) {
        M.error("Please fill in all required fields"),
          i("All fields are required");
        return;
      }
      o(!0), i("");
      try {
        M.info("Registering on blockchain..."),
          await Ln(x.studentId, x.department, Number(x.year)),
          M.info("Saving to database...");
        const F = await bu(x);
        if (F?.success)
          l(!0),
            M.success("✅ Registration completed successfully!"),
            localStorage.setItem("voterRegistrationCompleted", "true"),
            s?.();
        else {
          const f =
            F?.message || "Failed to save to database. Please try again.";
          i(f), M.error(f);
        }
      } catch (F) {
        console.error("Registration error:", F),
          i(F?.message || "Failed to register voter. Please try again."),
          M.error(F?.message || "Failed to register voter");
      } finally {
        o(!1);
      }
    };
  return e.jsxs("div", {
    className:
      "flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white",
    children: [
      e.jsx("header", {
        className: "border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-2 w-48",
              children: [
                e.jsx("img", {
                  src: $a,
                  alt: "APU Logo",
                  className: "h-8 w-8",
                }),
                e.jsx("span", {
                  className: "text-slate-900",
                  children: "Voter Registration",
                }),
              ],
            }),
            e.jsxs("nav", {
              className: "hidden md:flex gap-6 flex-1 justify-center",
              children: [
                e.jsx("button", {
                  onClick: () => t("home"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Home",
                }),
                e.jsx("button", {
                  onClick: () => t("vote"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Elections",
                }),
                e.jsx("button", {
                  onClick: () => t("results"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Results",
                }),
                e.jsx("button", {
                  onClick: () => t("about"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "About",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Contact",
                }),
              ],
            }),
            e.jsx("div", {
              className: "flex items-center gap-3 w-48 justify-end",
              children: g
                ? e.jsx(Ce, { onNavigate: t })
                : e.jsx(b, {
                    variant: "outline",
                    size: "sm",
                    onClick: () => t("login"),
                    children: "Sign In",
                  }),
            }),
          ],
        }),
      }),
      e.jsx("main", {
        className: "flex-1 flex items-center justify-center py-12",
        children: e.jsx("div", {
          className: "container mx-auto max-w-md px-6",
          children: e.jsxs(N, {
            className: "w-full",
            children: [
              e.jsxs(A, {
                children: [
                  e.jsx("div", {
                    className: "flex items-center mb-4",
                    children: e.jsxs(b, {
                      variant: "ghost",
                      size: "sm",
                      className: "gap-1 mr-auto",
                      onClick: () => t("home"),
                      children: [e.jsx(ge, { className: "h-4 w-4" }), "Back"],
                    }),
                  }),
                  e.jsxs("div", {
                    className: "flex items-center gap-3 mb-4",
                    children: [
                      e.jsx("img", {
                        src: $a,
                        alt: "Asia Pacific University Logo",
                        className: "h-10 w-auto",
                      }),
                      e.jsx(P, { children: "Voter Registration" }),
                    ],
                  }),
                  e.jsx(Q, {
                    children: "Register to participate in APU VOTE elections",
                  }),
                ],
              }),
              e.jsx(w, {
                children: c
                  ? e.jsxs("div", {
                      className:
                        "flex flex-col items-center justify-center py-6 text-center",
                      children: [
                        e.jsx(Ne, {
                          className: "h-16 w-16 text-emerald-500 mb-4",
                        }),
                        e.jsx("h3", {
                          className: "text-slate-900",
                          children: "Registration Successful!",
                        }),
                        e.jsx("p", {
                          className: "text-slate-600 mt-2 mb-6",
                          children:
                            "You are now registered to vote in the upcoming elections.",
                        }),
                        e.jsx(b, {
                          onClick: () => t("vote"),
                          children: "Go to Voting Page",
                        }),
                      ],
                    })
                  : a === 1
                  ? e.jsxs("div", {
                      className: "space-y-6",
                      children: [
                        m
                          ? e.jsxs(at, {
                              className: "bg-emerald-50 border-emerald-200",
                              children: [
                                e.jsx(Ne, {
                                  className: "h-4 w-4 text-emerald-600",
                                }),
                                e.jsxs(rt, {
                                  className: "text-sm text-emerald-800 ml-2",
                                  children: [
                                    "Wallet connected successfully!",
                                    e.jsx("br", {}),
                                    e.jsxs("span", {
                                      className: "text-xs mt-1 block",
                                      children: [
                                        "Address: ",
                                        x.walletAddress.slice(0, 6),
                                        "...",
                                        x.walletAddress.slice(-4),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            })
                          : e.jsxs("div", {
                              className: "text-center py-8",
                              children: [
                                e.jsx("div", {
                                  className:
                                    "w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4",
                                  children: e.jsx(st, {
                                    className: "h-10 w-10 text-gray-600",
                                  }),
                                }),
                                e.jsx("h3", {
                                  className: "text-lg text-gray-900 mb-2",
                                  children: "Connect MetaMask",
                                }),
                                e.jsx("p", {
                                  className: "text-sm text-gray-600 mb-6",
                                  children:
                                    "Connect your wallet to register as a voter. This wallet will be used to cast your vote securely.",
                                }),
                              ],
                            }),
                        p &&
                          e.jsxs(at, {
                            className: "bg-red-50 border-red-200",
                            children: [
                              e.jsx(nt, { className: "h-4 w-4 text-red-600" }),
                              e.jsx(rt, {
                                className: "text-sm text-red-800 ml-2",
                                children: p,
                              }),
                            ],
                          }),
                        e.jsxs("div", {
                          className:
                            "bg-blue-50 border border-blue-200 rounded-lg p-4",
                          children: [
                            e.jsx("h4", {
                              className: "text-sm text-blue-900 mb-2",
                              children: "Before you continue:",
                            }),
                            e.jsxs("ul", {
                              className:
                                "text-sm text-blue-800 space-y-1 list-disc list-inside",
                              children: [
                                e.jsx("li", {
                                  children:
                                    "Make sure MetaMask is installed in your browser",
                                }),
                                e.jsx("li", {
                                  children:
                                    "Ensure you have some ETH for transaction fees",
                                }),
                                e.jsx("li", {
                                  children:
                                    "You can only vote once per election",
                                }),
                              ],
                            }),
                          ],
                        }),
                        !m &&
                          e.jsx(b, {
                            onClick: T,
                            disabled: n,
                            className:
                              "w-full bg-gray-600 hover:bg-gray-700 h-11",
                            children: n
                              ? e.jsxs(e.Fragment, {
                                  children: [
                                    e.jsx(de, {
                                      className: "mr-2 h-4 w-4 animate-spin",
                                    }),
                                    "Connecting...",
                                  ],
                                })
                              : e.jsxs(e.Fragment, {
                                  children: [
                                    e.jsx(st, { className: "mr-2 h-4 w-4" }),
                                    "Connect MetaMask",
                                  ],
                                }),
                          }),
                        e.jsxs("p", {
                          className: "text-xs text-gray-500 text-center",
                          children: [
                            "Don't have MetaMask?",
                            " ",
                            e.jsx("a", {
                              href: "https://metamask.io/download/",
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "text-blue-600 hover:underline",
                              children: "Download here",
                            }),
                          ],
                        }),
                        e.jsxs("p", {
                          className: "text-sm text-center text-slate-600",
                          children: [
                            "Not sure if you're eligible?",
                            " ",
                            e.jsx("button", {
                              onClick: () => t("verify-eligibility"),
                              className: "text-emerald-600 hover:underline",
                              children: "Verify your eligibility",
                            }),
                            " ",
                            "first.",
                          ],
                        }),
                      ],
                    })
                  : e.jsxs("form", {
                      onSubmit: y,
                      className: "space-y-4",
                      children: [
                        p &&
                          e.jsxs(at, {
                            className: "bg-red-50 border-red-200",
                            children: [
                              e.jsx(nt, { className: "h-4 w-4 text-red-600" }),
                              e.jsx(rt, {
                                className: "text-sm text-red-800 ml-2",
                                children: p,
                              }),
                            ],
                          }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(V, {
                              htmlFor: "studentId",
                              children: "Student ID",
                            }),
                            e.jsx(J, {
                              id: "studentId",
                              placeholder: "TP123456",
                              value: x.studentId,
                              onChange: (E) =>
                                j((R) => ({
                                  ...R,
                                  studentId: E.target.value.toUpperCase(),
                                })),
                              maxLength: 8,
                              required: !0,
                            }),
                            e.jsx("p", {
                              className: "text-xs text-slate-500",
                              children:
                                "Format: TP followed by 6 digits (e.g., TP123456)",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(V, {
                              htmlFor: "department",
                              children: "Department",
                            }),
                            e.jsxs(Oe, {
                              value: x.department,
                              onValueChange: (E) =>
                                j((R) => ({ ...R, department: E })),
                              required: !0,
                              children: [
                                e.jsx(Fe, {
                                  id: "department",
                                  children: e.jsx($e, {
                                    placeholder: "Select your department",
                                  }),
                                }),
                                e.jsxs(ze, {
                                  children: [
                                    e.jsx(K, {
                                      value: "computer-science",
                                      children: "Computer Science",
                                    }),
                                    e.jsx(K, {
                                      value: "engineering",
                                      children: "Engineering",
                                    }),
                                    e.jsx(K, {
                                      value: "business",
                                      children: "Business",
                                    }),
                                    e.jsx(K, {
                                      value: "arts",
                                      children: "Arts & Humanities",
                                    }),
                                    e.jsx(K, {
                                      value: "science",
                                      children: "Science",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(V, {
                              htmlFor: "year",
                              children: "Year of Study",
                            }),
                            e.jsxs(Oe, {
                              value: x.year,
                              onValueChange: (E) =>
                                j((R) => ({ ...R, year: E })),
                              required: !0,
                              children: [
                                e.jsx(Fe, {
                                  id: "year",
                                  children: e.jsx($e, {
                                    placeholder: "Select your year",
                                  }),
                                }),
                                e.jsxs(ze, {
                                  children: [
                                    e.jsx(K, {
                                      value: "1",
                                      children: "First Year",
                                    }),
                                    e.jsx(K, {
                                      value: "2",
                                      children: "Second Year",
                                    }),
                                    e.jsx(K, {
                                      value: "3",
                                      children: "Third Year",
                                    }),
                                    e.jsx(K, {
                                      value: "4",
                                      children: "Fourth Year",
                                    }),
                                    e.jsx(K, {
                                      value: "5",
                                      children: "Postgraduate",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(V, {
                              htmlFor: "walletAddress",
                              children: "Wallet Address",
                            }),
                            e.jsx(J, {
                              id: "walletAddress",
                              value: x.walletAddress,
                              readOnly: !0,
                              className: "bg-slate-100",
                            }),
                          ],
                        }),
                        e.jsx(b, {
                          type: "submit",
                          className: "w-full bg-blue-600 hover:bg-blue-700",
                          disabled: n,
                          children: n
                            ? e.jsxs(e.Fragment, {
                                children: [
                                  e.jsx(de, {
                                    className: "mr-2 h-4 w-4 animate-spin",
                                  }),
                                  "Registering...",
                                ],
                              })
                            : "Complete Registration",
                        }),
                      ],
                    }),
              }),
              e.jsx(Tt, {
                className: "flex justify-center border-t pt-4",
                children: e.jsx("p", {
                  className: "text-xs text-slate-600 text-center",
                  children:
                    "By registering, you agree to the terms and conditions of the university election system.",
                }),
              }),
            ],
          }),
        }),
      }),
      e.jsx("footer", {
        className: "w-full border-t py-6 mt-auto",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "text-center text-slate-600 md:text-left",
              children: [
                "© ",
                new Date().getFullYear(),
                " APU Vote Chain. All rights reserved.",
              ],
            }),
            e.jsxs("div", {
              className: "flex gap-4",
              children: [
                e.jsx("button", {
                  className: "text-sm text-slate-600 hover:underline",
                  children: "Terms",
                }),
                e.jsx("button", {
                  onClick: () => t("privacy"),
                  className: "text-sm text-slate-600 hover:underline",
                  children: "Privacy",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className: "text-sm text-slate-600 hover:underline",
                  children: "Contact",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
function ku(t, s = []) {
  let a = [];
  function r(o, c) {
    const l = d.createContext(c);
    l.displayName = o + "Context";
    const m = a.length;
    a = [...a, c];
    const u = (i) => {
      const { scope: x, children: j, ...g } = i,
        v = x?.[t]?.[m] || l,
        T = d.useMemo(() => g, Object.values(g));
      return e.jsx(v.Provider, { value: T, children: j });
    };
    u.displayName = o + "Provider";
    function p(i, x) {
      const j = x?.[t]?.[m] || l,
        g = d.useContext(j);
      if (g) return g;
      if (c !== void 0) return c;
      throw new Error(`\`${i}\` must be used within \`${o}\``);
    }
    return [u, p];
  }
  const n = () => {
    const o = a.map((c) => d.createContext(c));
    return function (l) {
      const m = l?.[t] || o;
      return d.useMemo(() => ({ [`__scope${t}`]: { ...l, [t]: m } }), [l, m]);
    };
  };
  return (n.scopeName = t), [r, Cu(n, ...s)];
}
function Cu(...t) {
  const s = t[0];
  if (t.length === 1) return s;
  const a = () => {
    const r = t.map((n) => ({ useScope: n(), scopeName: n.scopeName }));
    return function (o) {
      const c = r.reduce((l, { useScope: m, scopeName: u }) => {
        const i = m(o)[`__scope${u}`];
        return { ...l, ...i };
      }, {});
      return d.useMemo(() => ({ [`__scope${s.scopeName}`]: c }), [c]);
    };
  };
  return (a.scopeName = s.scopeName), a;
}
var Su = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul",
  ],
  Bn = Su.reduce((t, s) => {
    const a = Os(`Primitive.${s}`),
      r = d.forwardRef((n, o) => {
        const { asChild: c, ...l } = n,
          m = c ? a : s;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          e.jsx(m, { ...l, ref: o })
        );
      });
    return (r.displayName = `Primitive.${s}`), { ...t, [s]: r };
  }, {}),
  ea = "Progress",
  ta = 100,
  [Eu] = ku(ea),
  [Au, Pu] = Eu(ea),
  Hn = d.forwardRef((t, s) => {
    const {
      __scopeProgress: a,
      value: r = null,
      max: n,
      getValueLabel: o = Tu,
      ...c
    } = t;
    (n || n === 0) && !Fa(n) && console.error(Mu(`${n}`, "Progress"));
    const l = Fa(n) ? n : ta;
    r !== null && !za(r, l) && console.error(Ru(`${r}`, "Progress"));
    const m = za(r, l) ? r : null,
      u = Kt(m) ? o(m, l) : void 0;
    return e.jsx(Au, {
      scope: a,
      value: m,
      max: l,
      children: e.jsx(Bn.div, {
        "aria-valuemax": l,
        "aria-valuemin": 0,
        "aria-valuenow": Kt(m) ? m : void 0,
        "aria-valuetext": u,
        role: "progressbar",
        "data-state": Wn(m, l),
        "data-value": m ?? void 0,
        "data-max": l,
        ...c,
        ref: s,
      }),
    });
  });
Hn.displayName = ea;
var Gn = "ProgressIndicator",
  qn = d.forwardRef((t, s) => {
    const { __scopeProgress: a, ...r } = t,
      n = Pu(Gn, a);
    return e.jsx(Bn.div, {
      "data-state": Wn(n.value, n.max),
      "data-value": n.value ?? void 0,
      "data-max": n.max,
      ...r,
      ref: s,
    });
  });
qn.displayName = Gn;
function Tu(t, s) {
  return `${Math.round((t / s) * 100)}%`;
}
function Wn(t, s) {
  return t == null ? "indeterminate" : t === s ? "complete" : "loading";
}
function Kt(t) {
  return typeof t == "number";
}
function Fa(t) {
  return Kt(t) && !isNaN(t) && t > 0;
}
function za(t, s) {
  return Kt(t) && !isNaN(t) && t <= s && t >= 0;
}
function Mu(t, s) {
  return `Invalid prop \`max\` of value \`${t}\` supplied to \`${s}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${ta}\`.`;
}
function Ru(t, s) {
  return `Invalid prop \`value\` of value \`${t}\` supplied to \`${s}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${ta} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var _u = Hn,
  Iu = qn;
function Du({ className: t, value: s, ...a }) {
  return e.jsx(_u, {
    "data-slot": "progress",
    className: O(
      "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
      t
    ),
    ...a,
    children: e.jsx(Iu, {
      "data-slot": "progress-indicator",
      className: "bg-emerald-500 h-full w-full flex-1 transition-all",
      style: { transform: `translateX(-${100 - (s || 0)}%)` },
    }),
  });
}
const Ua = "/apu-logo.png";
function Vu({ onNavigate: t }) {
  const [s, a] = d.useState([]),
    [r, n] = d.useState({}),
    [o, c] = d.useState(""),
    [l, m] = d.useState(!0),
    [u, p] = d.useState(!0);
  d.useEffect(() => {
    i();
  }, []);
  const i = () => {
      p(!0);
      const g = localStorage.getItem("systemSettings");
      if (g) {
        const T = JSON.parse(g);
        m(T.showResultsDuringVoting);
      }
      const v = localStorage.getItem("votingCategories");
      if (v) {
        const y = JSON.parse(v).filter((E) => E.isActive);
        a(y), y.length > 0 && c(y[0].id), x(y);
      }
      p(!1);
    },
    x = (g) => {
      const v = localStorage.getItem("candidates"),
        T = localStorage.getItem("votes");
      if (!v) return;
      const y = JSON.parse(v),
        E = T ? JSON.parse(T) : [],
        R = {};
      g.forEach((F) => {
        const f = y.filter((L) => L.position === F.name),
          B = {};
        f.forEach((L) => (B[L.id] = 0)),
          E.forEach((L) => {
            const H = L.selections[F.id];
            H && B[H] !== void 0 && B[H]++;
          });
        const oe = Object.values(B).reduce((L, H) => L + H, 0),
          C = f.map((L) => ({
            ...L,
            voteCount: B[L.id] || 0,
            percentage: oe > 0 ? ((B[L.id] || 0) / oe) * 100 : 0,
          }));
        C.sort((L, H) => H.voteCount - L.voteCount), (R[F.id] = C);
      }),
        n(R);
    },
    j = () => {
      i();
    };
  return l
    ? u
      ? e.jsx("div", {
          className:
            "min-h-screen bg-slate-50 flex items-center justify-center",
          children: e.jsxs("div", {
            className: "text-center",
            children: [
              e.jsx(vt, {
                className: "h-8 w-8 animate-spin text-blue-600 mx-auto mb-4",
              }),
              e.jsx("p", {
                className: "text-slate-600",
                children: "Loading data from blockchain...",
              }),
            ],
          }),
        })
      : e.jsxs("div", {
          className: "min-h-screen bg-slate-50",
          children: [
            e.jsx("header", {
              className: "bg-white border-b sticky top-0 z-50",
              children: e.jsxs("div", {
                className:
                  "container mx-auto px-6 py-4 flex items-center justify-between",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [
                      e.jsx("img", {
                        src: Ua,
                        alt: "APU Logo",
                        className: "h-10 w-10",
                      }),
                      e.jsx("h2", {
                        className: "text-slate-900",
                        children: "APU VOTE",
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [
                      e.jsxs(b, {
                        variant: "outline",
                        size: "sm",
                        onClick: j,
                        children: [
                          e.jsx(vt, { className: "h-4 w-4 mr-2" }),
                          "Refresh",
                        ],
                      }),
                      e.jsxs(b, {
                        variant: "ghost",
                        size: "sm",
                        onClick: () => t("home"),
                        children: [
                          e.jsx(ge, { className: "h-4 w-4 mr-2" }),
                          "Back",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            }),
            e.jsx("div", {
              className: "container mx-auto py-12 px-6",
              children: e.jsxs("div", {
                className: "max-w-4xl mx-auto",
                children: [
                  e.jsxs("div", {
                    className: "mb-8 text-center",
                    children: [
                      e.jsx("h1", {
                        className: "text-slate-900 mb-2",
                        children: "Election Results",
                      }),
                      e.jsx("p", {
                        className: "text-slate-600",
                        children: "Live results based on blockchain data.",
                      }),
                    ],
                  }),
                  s.length === 0
                    ? e.jsx(N, {
                        children: e.jsx(w, {
                          className: "py-12 text-center",
                          children: e.jsx("p", {
                            className: "text-slate-600",
                            children: "No active categories available.",
                          }),
                        }),
                      })
                    : e.jsxs(lt, {
                        value: o,
                        onValueChange: c,
                        children: [
                          e.jsx(ct, {
                            className: "grid w-full mb-8",
                            style: {
                              gridTemplateColumns: `repeat(${s.length}, 1fr)`,
                            },
                            children: s.map((g) =>
                              e.jsx(pe, { value: g.id, children: g.name }, g.id)
                            ),
                          }),
                          s.map((g) => {
                            const v = r[g.id] || [],
                              T = v.reduce((y, E) => y + E.voteCount, 0);
                            return e.jsx(
                              fe,
                              {
                                value: g.id,
                                children: e.jsxs(N, {
                                  children: [
                                    e.jsxs(A, {
                                      children: [
                                        e.jsx(P, { children: g.name }),
                                        e.jsxs(Q, {
                                          children: ["Total votes cast: ", T],
                                        }),
                                      ],
                                    }),
                                    e.jsx(w, {
                                      children:
                                        v.length === 0
                                          ? e.jsx("div", {
                                              className: "text-center py-8",
                                              children: e.jsx("p", {
                                                className: "text-slate-600",
                                                children:
                                                  "No candidates in this category.",
                                              }),
                                            })
                                          : e.jsx("div", {
                                              className: "space-y-6",
                                              children: v.map((y, E) =>
                                                e.jsxs(
                                                  "div",
                                                  {
                                                    className: "space-y-2",
                                                    children: [
                                                      e.jsxs("div", {
                                                        className:
                                                          "flex items-center justify-between",
                                                        children: [
                                                          e.jsxs("div", {
                                                            className:
                                                              "flex items-center gap-3",
                                                            children: [
                                                              e.jsx("div", {
                                                                className: `flex items-center justify-center w-8 h-8 rounded-full ${
                                                                  E === 0
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-slate-100 text-slate-600"
                                                                }`,
                                                                children: E + 1,
                                                              }),
                                                              e.jsxs("div", {
                                                                children: [
                                                                  e.jsx("p", {
                                                                    className:
                                                                      "text-slate-900",
                                                                    children:
                                                                      y.name,
                                                                  }),
                                                                  e.jsx("p", {
                                                                    className:
                                                                      "text-sm text-slate-600",
                                                                    children:
                                                                      y.party,
                                                                  }),
                                                                ],
                                                              }),
                                                            ],
                                                          }),
                                                          e.jsxs("div", {
                                                            className:
                                                              "text-right",
                                                            children: [
                                                              e.jsxs("p", {
                                                                className:
                                                                  "text-slate-900",
                                                                children: [
                                                                  y.voteCount,
                                                                  " votes",
                                                                ],
                                                              }),
                                                              e.jsxs("p", {
                                                                className:
                                                                  "text-sm text-slate-600",
                                                                children: [
                                                                  y.percentage.toFixed(
                                                                    1
                                                                  ),
                                                                  "%",
                                                                ],
                                                              }),
                                                            ],
                                                          }),
                                                        ],
                                                      }),
                                                      e.jsx(Du, {
                                                        value: y.percentage,
                                                        className: "h-2",
                                                      }),
                                                    ],
                                                  },
                                                  y.id
                                                )
                                              ),
                                            }),
                                    }),
                                  ],
                                }),
                              },
                              g.id
                            );
                          }),
                        ],
                      }),
                ],
              }),
            }),
          ],
        })
    : e.jsxs("div", {
        className: "min-h-screen bg-slate-50",
        children: [
          e.jsx("header", {
            className: "bg-white border-b sticky top-0 z-50",
            children: e.jsxs("div", {
              className:
                "container mx-auto px-6 py-4 flex items-center justify-between",
              children: [
                e.jsxs("div", {
                  className: "flex items-center gap-3",
                  children: [
                    e.jsx("img", {
                      src: Ua,
                      alt: "APU Logo",
                      className: "h-10 w-10",
                    }),
                    e.jsx("h2", {
                      className: "text-slate-900",
                      children: "APU VOTE",
                    }),
                  ],
                }),
                e.jsxs(b, {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => t("home"),
                  children: [e.jsx(ge, { className: "h-4 w-4 mr-2" }), "Back"],
                }),
              ],
            }),
          }),
          e.jsx("div", {
            className: "container mx-auto py-12 px-6",
            children: e.jsx("div", {
              className: "max-w-2xl mx-auto",
              children: e.jsx(N, {
                className: "shadow-lg",
                children: e.jsxs(w, {
                  className: "py-16 text-center",
                  children: [
                    e.jsx("div", {
                      className:
                        "mx-auto mb-6 rounded-full bg-slate-100 p-4 w-fit",
                      children: e.jsx(Ze, {
                        className: "h-12 w-12 text-slate-600",
                      }),
                    }),
                    e.jsx("h2", {
                      className: "text-slate-900 mb-2",
                      children: "Results Locked",
                    }),
                    e.jsx("p", {
                      className: "text-slate-600 max-w-md mx-auto",
                      children:
                        "Results will be available after the voting period ends.",
                    }),
                    e.jsx(b, {
                      onClick: () => t("home"),
                      className: "mt-8 bg-blue-600 hover:bg-blue-700",
                      children: "Return Home",
                    }),
                  ],
                }),
              }),
            }),
          }),
        ],
      });
}
const Ba = "/apu-logo.png";
function Lu({ onNavigate: t }) {
  const [s, a] = d.useState(!1),
    [r, n] = d.useState(!1),
    [o, c] = d.useState(""),
    [l, m] = d.useState({
      studentId: "",
      matricNumber: "",
      department: "",
      level: "",
    }),
    u = Be(),
    p = async (i) => {
      i.preventDefault(), a(!0), c("");
      try {
        l.studentId.trim().length >= 3 &&
        l.matricNumber.trim().length >= 3 &&
        !!l.department &&
        !!l.level
          ? n(!0)
          : c("Please fill in all fields correctly before verifying.");
      } catch (x) {
        console.error("Verification error:", x),
          c("An error occurred during verification. Please try again.");
      } finally {
        a(!1);
      }
    };
  return e.jsxs("div", {
    className:
      "flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white",
    children: [
      e.jsx("header", {
        className:
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex h-16 items-center justify-between px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("img", {
                  src: Ba,
                  alt: "Asia Pacific University Logo",
                  className: "h-10 w-auto",
                }),
                e.jsx("span", { children: "APU VOTE" }),
              ],
            }),
            e.jsxs("nav", {
              className: "hidden md:flex gap-6",
              children: [
                e.jsx("button", {
                  onClick: () => t("home"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "Home",
                }),
                e.jsx("button", {
                  onClick: () => t("voter"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "Elections",
                }),
                e.jsx("button", {
                  onClick: () => t("results"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "Results",
                }),
                e.jsx("button", {
                  onClick: () => t("about"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "About",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "Contact",
                }),
              ],
            }),
            u
              ? e.jsx(Ce, { onNavigate: t })
              : e.jsx(b, {
                  variant: "outline",
                  size: "sm",
                  onClick: () => t("login"),
                  children: "Sign In",
                }),
          ],
        }),
      }),
      e.jsx("main", {
        className: "flex-1 flex items-center justify-center py-12",
        children: e.jsx("div", {
          className: "container mx-auto max-w-md px-6",
          children: e.jsxs(N, {
            className: "w-full",
            children: [
              e.jsxs(A, {
                children: [
                  e.jsx("div", {
                    className: "flex items-center mb-4",
                    children: e.jsxs(b, {
                      variant: "ghost",
                      size: "sm",
                      className: "gap-1",
                      onClick: () => t("home"),
                      children: [e.jsx(ge, { className: "h-4 w-4" }), "Back"],
                    }),
                  }),
                  e.jsxs("div", {
                    className: "flex items-center gap-3 mb-4",
                    children: [
                      e.jsx("img", {
                        src: Ba,
                        alt: "Asia Pacific University Logo",
                        className: "h-10 w-auto",
                      }),
                      e.jsx(P, { children: "Verify Eligibility" }),
                    ],
                  }),
                  e.jsx(Q, {
                    children:
                      "Verify your eligibility to vote in APU VOTE elections.",
                  }),
                ],
              }),
              e.jsx(w, {
                children: r
                  ? e.jsxs("div", {
                      className:
                        "flex flex-col items-center justify-center py-6 text-center",
                      children: [
                        e.jsx(Ne, {
                          className: "h-16 w-16 text-emerald-500 mb-4",
                        }),
                        e.jsx("h3", {
                          className: "text-slate-900",
                          children: "Verification Successful",
                        }),
                        e.jsx("div", {
                          className: "text-slate-600 mt-2 mb-6",
                          children: "You can proceed to wallet registration.",
                        }),
                        e.jsx(b, {
                          onClick: () => t("voter-registration"),
                          children: "Register to Vote",
                        }),
                      ],
                    })
                  : e.jsxs("form", {
                      onSubmit: p,
                      className: "space-y-4",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(V, {
                              htmlFor: "studentId",
                              children: "Student ID",
                            }),
                            e.jsx(J, {
                              id: "studentId",
                              placeholder: "e.g., TP123456",
                              value: l.studentId,
                              onChange: (i) =>
                                m({ ...l, studentId: i.target.value }),
                              required: !0,
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(V, {
                              htmlFor: "matricNumber",
                              children: "Matriculation Number",
                            }),
                            e.jsx(J, {
                              id: "matricNumber",
                              placeholder: "e.g., APU1234567",
                              value: l.matricNumber,
                              onChange: (i) =>
                                m({ ...l, matricNumber: i.target.value }),
                              required: !0,
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(V, {
                              htmlFor: "department",
                              children: "Department",
                            }),
                            e.jsxs(Oe, {
                              value: l.department,
                              onValueChange: (i) => m({ ...l, department: i }),
                              required: !0,
                              children: [
                                e.jsx(Fe, {
                                  id: "department",
                                  children: e.jsx($e, {
                                    placeholder: "Select your department",
                                  }),
                                }),
                                e.jsxs(ze, {
                                  children: [
                                    e.jsx(K, {
                                      value: "computer-science",
                                      children: "Computer Science",
                                    }),
                                    e.jsx(K, {
                                      value: "engineering",
                                      children: "Engineering",
                                    }),
                                    e.jsx(K, {
                                      value: "management",
                                      children: "Management",
                                    }),
                                    e.jsx(K, { value: "law", children: "Law" }),
                                    e.jsx(K, {
                                      value: "arts",
                                      children: "Arts & Humanities",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(V, { htmlFor: "level", children: "Level" }),
                            e.jsxs(Oe, {
                              value: l.level,
                              onValueChange: (i) => m({ ...l, level: i }),
                              required: !0,
                              children: [
                                e.jsx(Fe, {
                                  id: "level",
                                  children: e.jsx($e, {
                                    placeholder: "Select your level",
                                  }),
                                }),
                                e.jsxs(ze, {
                                  children: [
                                    e.jsx(K, { value: "100", children: "100" }),
                                    e.jsx(K, { value: "200", children: "200" }),
                                    e.jsx(K, { value: "300", children: "300" }),
                                    e.jsx(K, { value: "400", children: "400" }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        o &&
                          e.jsxs("div", {
                            className:
                              "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2",
                            children: [
                              e.jsx(bs, {
                                className: "h-5 w-5 mt-0.5 flex-shrink-0",
                              }),
                              e.jsx("div", {
                                className: "text-sm",
                                children: o,
                              }),
                            ],
                          }),
                        e.jsx(b, {
                          type: "submit",
                          className: "w-full",
                          disabled: s,
                          children: s
                            ? e.jsxs(e.Fragment, {
                                children: [
                                  e.jsx(de, {
                                    className: "mr-2 h-4 w-4 animate-spin",
                                  }),
                                  "Verifying...",
                                ],
                              })
                            : "Verify Eligibility",
                        }),
                      ],
                    }),
              }),
              e.jsx(Tt, {
                className: "flex justify-center border-t pt-4",
                children: e.jsx("div", {
                  className: "text-xs text-slate-600 text-center",
                  children:
                    "Note: This screen is currently using a temporary client-side check until the backend verification endpoint is added.",
                }),
              }),
            ],
          }),
        }),
      }),
    ],
  });
}
const Ou = "/apu-logo.png";
function $u({ onNavigate: t }) {
  return e.jsxs("div", {
    className:
      "flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white",
    children: [
      e.jsx("header", {
        className: "border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-2 w-48",
              children: [
                e.jsx("img", {
                  src: Ou,
                  alt: "APU Logo",
                  className: "h-8 w-8",
                }),
                e.jsx("span", {
                  className: "text-slate-900",
                  children: "Terms",
                }),
              ],
            }),
            e.jsxs("nav", {
              className: "hidden md:flex gap-6 flex-1 justify-center",
              children: [
                e.jsx("button", {
                  onClick: () => t("home"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Home",
                }),
                e.jsx("button", {
                  onClick: () => t("vote"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Elections",
                }),
                e.jsx("button", {
                  onClick: () => t("results"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Results",
                }),
                e.jsx("button", {
                  onClick: () => t("about"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "About",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Contact",
                }),
              ],
            }),
            e.jsx("div", {
              className: "flex items-center gap-3 w-48 justify-end",
              children: e.jsx(Ce, { onNavigate: t }),
            }),
          ],
        }),
      }),
      e.jsx("main", {
        className: "flex-1",
        children: e.jsxs("div", {
          className: "container mx-auto max-w-4xl py-16 px-6 md:px-8",
          children: [
            e.jsx("div", {
              className: "mb-6",
              children: e.jsxs(b, {
                variant: "ghost",
                size: "sm",
                className: "gap-1",
                onClick: () => t("home"),
                children: [e.jsx(ge, { className: "h-4 w-4" }), "Back to Home"],
              }),
            }),
            e.jsxs("div", {
              className: "mb-8",
              children: [
                e.jsx("h1", {
                  className: "text-slate-900 mb-2",
                  children: "Terms of Service",
                }),
                e.jsxs("p", {
                  className: "text-slate-600",
                  children: ["Last updated: ", new Date().toLocaleDateString()],
                }),
              ],
            }),
            e.jsxs("div", {
              className: "space-y-6",
              children: [
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx(Nr, { className: "h-6 w-6 text-emerald-500" }),
                          e.jsx(P, { children: "1. Acceptance of Terms" }),
                        ],
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsx("div", {
                        className: "text-slate-600 leading-relaxed",
                        children:
                          "By accessing and using the APU VOTE blockchain voting system, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use this service.",
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx(We, { className: "h-6 w-6 text-emerald-500" }),
                          e.jsx(P, { children: "2. Eligibility" }),
                        ],
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed space-y-2",
                        children: [
                          e.jsx("div", {
                            children:
                              "To use the APU VOTE system, you must be a currently enrolled student at Asia Pacific University (APU) with a valid student ID and university email address (@apu.edu.my).",
                          }),
                          e.jsx("div", {
                            children: e.jsx("strong", {
                              className: "text-slate-900",
                              children: "Requirements:",
                            }),
                          }),
                          e.jsxs("ul", {
                            className: "list-disc list-inside ml-4 space-y-1",
                            children: [
                              e.jsx("li", { children: "Valid APU student ID" }),
                              e.jsx("li", {
                                children: "Active @apu.edu.my email address",
                              }),
                              e.jsx("li", {
                                children: "Current enrollment status",
                              }),
                              e.jsx("li", {
                                children:
                                  "Agreement to abide by university regulations",
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx(sc, { className: "h-6 w-6 text-emerald-500" }),
                          e.jsx(P, { children: "3. Voting Procedures" }),
                        ],
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed space-y-2",
                        children: [
                          e.jsx("div", {
                            children: e.jsx("strong", {
                              className: "text-slate-900",
                              children: "Voting Rules:",
                            }),
                          }),
                          e.jsxs("ul", {
                            className: "list-disc list-inside ml-4 space-y-1",
                            children: [
                              e.jsx("li", {
                                children:
                                  "Each eligible voter may cast one vote per election category",
                              }),
                              e.jsx("li", {
                                children:
                                  "Votes are final and cannot be changed once submitted to the blockchain",
                              }),
                              e.jsx("li", {
                                children:
                                  "All votes are anonymous and encrypted",
                              }),
                              e.jsx("li", {
                                children:
                                  "Vote tampering or fraud will result in disciplinary action",
                              }),
                              e.jsx("li", {
                                children:
                                  "Voting is only allowed during the official election period",
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "mt-3",
                            children:
                              "The system records all voting activity on the Ethereum blockchain for transparency and auditability while maintaining voter anonymity.",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx(nt, { className: "h-6 w-6 text-emerald-500" }),
                          e.jsx(P, { children: "4. User Responsibilities" }),
                        ],
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed space-y-2",
                        children: [
                          e.jsx("div", {
                            children: e.jsx("strong", {
                              className: "text-slate-900",
                              children: "You agree to:",
                            }),
                          }),
                          e.jsxs("ul", {
                            className: "list-disc list-inside ml-4 space-y-1",
                            children: [
                              e.jsx("li", {
                                children:
                                  "Provide accurate and truthful information during registration",
                              }),
                              e.jsx("li", {
                                children:
                                  "Keep your account credentials secure and confidential",
                              }),
                              e.jsx("li", {
                                children: "Not share your account with others",
                              }),
                              e.jsx("li", {
                                children:
                                  "Not attempt to manipulate or interfere with the voting system",
                              }),
                              e.jsx("li", {
                                children:
                                  "Report any security vulnerabilities or suspicious activity",
                              }),
                              e.jsx("li", {
                                children:
                                  "Comply with all applicable university policies and Malaysian laws",
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "5. System Availability",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsx("div", {
                        className: "text-slate-600 leading-relaxed",
                        children:
                          "While we strive to maintain continuous service, the APU VOTE system may be temporarily unavailable due to maintenance, updates, or unforeseen technical issues. We are not liable for any loss or inconvenience caused by system downtime.",
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "6. Blockchain Technology",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed",
                        children: [
                          "The voting system utilizes Ethereum blockchain technology. By using this service, you acknowledge that:",
                          e.jsxs("ul", {
                            className:
                              "list-disc list-inside ml-4 mt-2 space-y-1",
                            children: [
                              e.jsx("li", {
                                children:
                                  "Votes recorded on the blockchain are permanent and immutable",
                              }),
                              e.jsx("li", {
                                children:
                                  "Blockchain transactions may incur network fees (gas fees)",
                              }),
                              e.jsx("li", {
                                children:
                                  "Transaction processing times may vary based on network congestion",
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "7. Privacy and Data Protection",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed",
                        children: [
                          "Your privacy is important to us. Please review our",
                          " ",
                          e.jsx("button", {
                            onClick: () => t("privacy"),
                            className: "text-emerald-600 hover:underline",
                            children: "Privacy Policy",
                          }),
                          " ",
                          "to understand how we collect, use, and protect your personal information. All data handling complies with Malaysian Personal Data Protection Act (PDPA) 2010.",
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "8. Prohibited Activities",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed",
                        children: [
                          e.jsx("strong", {
                            className: "text-slate-900",
                            children:
                              "The following activities are strictly prohibited:",
                          }),
                          e.jsxs("ul", {
                            className:
                              "list-disc list-inside ml-4 mt-2 space-y-1",
                            children: [
                              e.jsx("li", {
                                children: "Vote buying, selling, or coercion",
                              }),
                              e.jsx("li", {
                                children: "Creating multiple accounts",
                              }),
                              e.jsx("li", {
                                children:
                                  "Attempting to hack or compromise the system",
                              }),
                              e.jsx("li", {
                                children:
                                  "Spreading false information about candidates or the voting process",
                              }),
                              e.jsx("li", {
                                children:
                                  "Any form of election fraud or manipulation",
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "mt-3",
                            children:
                              "Violations may result in account suspension, reporting to university authorities, and potential legal action.",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "9. Intellectual Property",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsx("div", {
                        className: "text-slate-600 leading-relaxed",
                        children:
                          "All content, features, and functionality of the APU VOTE system are owned by Asia Pacific University and are protected by international copyright, trademark, and other intellectual property laws.",
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "10. Disclaimer of Warranties",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsx("div", {
                        className: "text-slate-600 leading-relaxed",
                        children:
                          'The service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, secure, or error-free.',
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "11. Limitation of Liability",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsx("div", {
                        className: "text-slate-600 leading-relaxed",
                        children:
                          "To the maximum extent permitted by law, APU and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.",
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "12. Modifications to Terms",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsx("div", {
                        className: "text-slate-600 leading-relaxed",
                        children:
                          "We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or through the platform. Continued use of the service after changes constitutes acceptance of the modified terms.",
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, { children: "13. Governing Law" }),
                    }),
                    e.jsx(w, {
                      children: e.jsx("div", {
                        className: "text-slate-600 leading-relaxed",
                        children:
                          "These terms shall be governed by and construed in accordance with the laws of Malaysia. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the Malaysian courts.",
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "14. Contact Information",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed",
                        children: [
                          "If you have any questions about these Terms of Service, please contact us:",
                          e.jsxs("div", {
                            className: "mt-3 space-y-1",
                            children: [
                              e.jsxs("div", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Email:",
                                  }),
                                  " ",
                                  "vote@apu.edu.my",
                                ],
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Phone:",
                                  }),
                                  " +60 3-8996 1000",
                                ],
                              }),
                              e.jsxs("div", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Address:",
                                  }),
                                  " ",
                                  "Technology Park Malaysia, Bukit Jalil, 57000 Kuala Lumpur, Malaysia",
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
            e.jsx("div", {
              className: "mt-8 p-4 bg-slate-100 rounded-lg",
              children: e.jsx("div", {
                className: "text-slate-600 text-center",
                children:
                  "By using APU VOTE, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.",
              }),
            }),
          ],
        }),
      }),
      e.jsx("footer", {
        className: "w-full border-t py-6 mt-12",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "text-center text-slate-600 md:text-left",
              children: [
                "© ",
                new Date().getFullYear(),
                " APU Vote Chain. All rights reserved.",
              ],
            }),
            e.jsxs("div", {
              className: "flex gap-6",
              children: [
                e.jsx("button", {
                  onClick: () => t("terms"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Terms",
                }),
                e.jsx("button", {
                  onClick: () => t("privacy"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Privacy",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Contact",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
const Fu = "/apu-logo.png";
function zu({ onNavigate: t }) {
  return e.jsxs("div", {
    className:
      "flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white",
    children: [
      e.jsx("header", {
        className: "border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-2 w-48",
              children: [
                e.jsx("img", {
                  src: Fu,
                  alt: "APU Logo",
                  className: "h-8 w-8",
                }),
                e.jsx("span", {
                  className: "text-slate-900",
                  children: "Privacy",
                }),
              ],
            }),
            e.jsxs("nav", {
              className: "hidden md:flex gap-6 flex-1 justify-center",
              children: [
                e.jsx("button", {
                  onClick: () => t("home"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Home",
                }),
                e.jsx("button", {
                  onClick: () => t("vote"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Elections",
                }),
                e.jsx("button", {
                  onClick: () => t("results"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Results",
                }),
                e.jsx("button", {
                  onClick: () => t("about"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "About",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className:
                    "text-sm font-normal transition-colors hover:text-primary",
                  children: "Contact",
                }),
              ],
            }),
            e.jsx("div", {
              className: "flex items-center gap-3 w-48 justify-end",
              children: e.jsx(Ce, { onNavigate: t }),
            }),
          ],
        }),
      }),
      e.jsx("main", {
        className: "flex-1",
        children: e.jsxs("div", {
          className: "container mx-auto max-w-5xl px-6 md:px-8 py-12",
          children: [
            e.jsx("div", {
              className: "mb-6",
              children: e.jsxs(b, {
                variant: "ghost",
                size: "sm",
                className: "gap-1",
                onClick: () => t("home"),
                children: [e.jsx(ge, { className: "h-4 w-4" }), "Back to Home"],
              }),
            }),
            e.jsxs("div", {
              className: "mb-8",
              children: [
                e.jsx("h1", {
                  className: "text-slate-900 mb-2",
                  children: "Privacy Policy",
                }),
                e.jsxs("p", {
                  className: "text-slate-600",
                  children: ["Last updated: ", new Date().toLocaleDateString()],
                }),
              ],
            }),
            e.jsx("div", {
              className:
                "mb-8 p-4 bg-emerald-50 rounded-lg border border-emerald-200",
              children: e.jsx("p", {
                className: "text-slate-900 leading-relaxed",
                children:
                  "At APU VOTE, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data in compliance with the Malaysian Personal Data Protection Act (PDPA) 2010.",
              }),
            }),
            e.jsxs("div", {
              className: "space-y-6",
              children: [
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx(_l, { className: "h-6 w-6 text-emerald-500" }),
                          e.jsx(P, { children: "1. Information We Collect" }),
                        ],
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed space-y-3",
                        children: [
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", {
                                className: "text-slate-900 mb-2",
                                children: "Personal Information:",
                              }),
                              e.jsxs("ul", {
                                className:
                                  "list-disc list-inside ml-4 space-y-1",
                                children: [
                                  e.jsx("li", { children: "Full name" }),
                                  e.jsx("li", {
                                    children: "Student ID number",
                                  }),
                                  e.jsx("li", {
                                    children:
                                      "University email address (@apu.edu.my)",
                                  }),
                                  e.jsx("li", { children: "Date of birth" }),
                                  e.jsx("li", { children: "Program of study" }),
                                  e.jsx("li", {
                                    children: "Enrollment status",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", {
                                className: "text-slate-900 mb-2",
                                children: "Technical Information:",
                              }),
                              e.jsxs("ul", {
                                className:
                                  "list-disc list-inside ml-4 space-y-1",
                                children: [
                                  e.jsx("li", { children: "IP address" }),
                                  e.jsx("li", {
                                    children: "Browser type and version",
                                  }),
                                  e.jsx("li", {
                                    children: "Device information",
                                  }),
                                  e.jsx("li", { children: "Login timestamps" }),
                                  e.jsx("li", {
                                    children:
                                      "Blockchain wallet addresses (for voting transactions)",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("div", {
                                className: "text-slate-900 mb-2",
                                children: "Voting Data:",
                              }),
                              e.jsxs("ul", {
                                className:
                                  "list-disc list-inside ml-4 space-y-1",
                                children: [
                                  e.jsx("li", {
                                    children:
                                      "Participation status (whether you voted)",
                                  }),
                                  e.jsx("li", {
                                    children: "Timestamp of vote submission",
                                  }),
                                  e.jsx("li", {
                                    children:
                                      "Note: Your actual vote choices are encrypted and anonymous",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx(Ht, { className: "h-6 w-6 text-emerald-500" }),
                          e.jsx(P, {
                            children: "2. How We Use Your Information",
                          }),
                        ],
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed",
                        children: [
                          e.jsx("div", {
                            className: "mb-3",
                            children:
                              "We use the collected information for the following purposes:",
                          }),
                          e.jsxs("ul", {
                            className: "list-disc list-inside ml-4 space-y-1",
                            children: [
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Voter Verification:",
                                  }),
                                  " ",
                                  "To confirm your eligibility to vote in university elections",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Account Management:",
                                  }),
                                  " ",
                                  "To create and maintain your voting account",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Election Administration:",
                                  }),
                                  " ",
                                  "To conduct fair and transparent elections",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Security:",
                                  }),
                                  " To prevent fraud, unauthorized access, and ensure system integrity",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Communication:",
                                  }),
                                  " ",
                                  "To send election notifications and important updates",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Analytics:",
                                  }),
                                  " To improve system performance and user experience",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Compliance:",
                                  }),
                                  " To meet legal and regulatory requirements",
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx(Ze, { className: "h-6 w-6 text-emerald-500" }),
                          e.jsx(P, {
                            children: "3. Vote Anonymity and Blockchain",
                          }),
                        ],
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed space-y-2",
                        children: [
                          e.jsx("div", {
                            children: e.jsx("strong", {
                              className: "text-slate-900",
                              children: "Your vote is completely anonymous:",
                            }),
                          }),
                          e.jsxs("ul", {
                            className: "list-disc list-inside ml-4 space-y-1",
                            children: [
                              e.jsx("li", {
                                children:
                                  "Votes are encrypted before being recorded on the Ethereum blockchain",
                              }),
                              e.jsx("li", {
                                children:
                                  "Your identity is separated from your vote through cryptographic techniques (zero-knowledge proofs)",
                              }),
                              e.jsx("li", {
                                children:
                                  "No one, including system administrators, can link your vote to your identity",
                              }),
                              e.jsx("li", {
                                children:
                                  "The blockchain ensures votes cannot be altered or deleted",
                              }),
                              e.jsx("li", {
                                children:
                                  "Only aggregated, anonymous voting results are made public",
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "mt-3",
                            children:
                              "The blockchain records transaction hashes and timestamps but does not contain any personally identifiable information about how individuals voted.",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx(We, { className: "h-6 w-6 text-emerald-500" }),
                          e.jsx(P, { children: "4. Data Security" }),
                        ],
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed space-y-2",
                        children: [
                          e.jsx("div", {
                            children:
                              "We implement industry-standard security measures to protect your data:",
                          }),
                          e.jsxs("ul", {
                            className: "list-disc list-inside ml-4 space-y-1",
                            children: [
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Encryption:",
                                  }),
                                  " ",
                                  "All data is encrypted in transit (TLS/SSL) and at rest (AES-256)",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Access Controls:",
                                  }),
                                  " ",
                                  "Strict role-based access to personal data",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Authentication:",
                                  }),
                                  " ",
                                  "Multi-factor authentication for enhanced security",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Monitoring:",
                                  }),
                                  " ",
                                  "Continuous security monitoring and threat detection",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Auditing:",
                                  }),
                                  " ",
                                  "Regular security audits and penetration testing",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Blockchain Security:",
                                  }),
                                  " ",
                                  "Immutable records protected by Ethereum network consensus",
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx(Nr, { className: "h-6 w-6 text-emerald-500" }),
                          e.jsx(P, {
                            children: "5. Data Sharing and Disclosure",
                          }),
                        ],
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed space-y-2",
                        children: [
                          e.jsxs("div", {
                            children: [
                              e.jsx("strong", {
                                className: "text-slate-900",
                                children:
                                  "We do not sell your personal information.",
                              }),
                              " ",
                              "We may share your data only in the following circumstances:",
                            ],
                          }),
                          e.jsxs("ul", {
                            className: "list-disc list-inside ml-4 space-y-1",
                            children: [
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "University Administration:",
                                  }),
                                  " ",
                                  "With authorized APU staff for election management",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Service Providers:",
                                  }),
                                  " ",
                                  "With trusted third-party services that help operate our platform (under strict confidentiality agreements)",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Legal Requirements:",
                                  }),
                                  " ",
                                  "When required by Malaysian law or valid legal process",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Security:",
                                  }),
                                  " To protect against fraud, abuse, or security threats",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Consent:",
                                  }),
                                  " When you explicitly consent to sharing",
                                ],
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "mt-3 text-slate-900",
                            children:
                              "Public Blockchain Data: Transaction hashes and timestamps are publicly visible on the Ethereum blockchain, but these contain no personally identifiable information.",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx(xc, { className: "h-6 w-6 text-emerald-500" }),
                          e.jsx(P, {
                            children: "6. Your Rights (Under PDPA 2010)",
                          }),
                        ],
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed space-y-2",
                        children: [
                          e.jsx("div", {
                            children:
                              "Under Malaysian law, you have the following rights regarding your personal data:",
                          }),
                          e.jsxs("ul", {
                            className: "list-disc list-inside ml-4 space-y-1",
                            children: [
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Access:",
                                  }),
                                  " ",
                                  "Request a copy of your personal data we hold",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Correction:",
                                  }),
                                  " ",
                                  "Request correction of inaccurate or incomplete data",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Data Portability:",
                                  }),
                                  " ",
                                  "Request your data in a structured, commonly used format",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Withdrawal of Consent:",
                                  }),
                                  " ",
                                  "Withdraw consent for data processing (subject to legal requirements)",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Limit Processing:",
                                  }),
                                  " ",
                                  "Request limitation of how we process your data",
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "mt-3",
                            children: [
                              e.jsx("strong", {
                                className: "text-slate-900",
                                children: "Important Note:",
                              }),
                              " ",
                              "Due to the immutable nature of blockchain technology, votes recorded on the blockchain cannot be deleted or modified. However, votes are anonymous and cannot be linked to your identity.",
                            ],
                          }),
                          e.jsxs("div", {
                            className: "mt-2",
                            children: [
                              "To exercise your rights, please contact our Data Protection Officer at",
                              " ",
                              e.jsx("a", {
                                href: "mailto:dpo@apu.edu.my",
                                className: "text-emerald-600 hover:underline",
                                children: "dpo@apu.edu.my",
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, { children: "7. Data Retention" }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed space-y-2",
                        children: [
                          e.jsx("div", {
                            children:
                              "We retain your data for the following periods:",
                          }),
                          e.jsxs("ul", {
                            className: "list-disc list-inside ml-4 space-y-1",
                            children: [
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Account Information:",
                                  }),
                                  " ",
                                  "Duration of your enrollment plus 7 years (for audit purposes)",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Voting Records:",
                                  }),
                                  " ",
                                  "Permanently on the blockchain (anonymous)",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Personal Identifiers:",
                                  }),
                                  " ",
                                  "Separated from voting data and retained according to university policy",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Technical Logs:",
                                  }),
                                  " ",
                                  "12 months for security purposes",
                                ],
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "mt-3",
                            children:
                              "Data is securely deleted or anonymized after retention periods expire, except for blockchain records which are permanent but anonymous.",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "8. Cookies and Tracking Technologies",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed",
                        children: [
                          "We use essential cookies and similar technologies to:",
                          e.jsxs("ul", {
                            className:
                              "list-disc list-inside ml-4 mt-2 space-y-1",
                            children: [
                              e.jsx("li", {
                                children: "Maintain your login session",
                              }),
                              e.jsx("li", {
                                children: "Remember your preferences",
                              }),
                              e.jsx("li", {
                                children:
                                  "Analyze system usage and performance",
                              }),
                              e.jsx("li", {
                                children: "Detect and prevent security threats",
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "mt-3",
                            children:
                              "You can control cookies through your browser settings, but disabling them may affect system functionality.",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "9. Third-Party Services",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed",
                        children: [
                          "Our platform integrates with:",
                          e.jsxs("ul", {
                            className:
                              "list-disc list-inside ml-4 mt-2 space-y-1",
                            children: [
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Ethereum Blockchain:",
                                  }),
                                  " ",
                                  "For vote recording and verification",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Email Services:",
                                  }),
                                  " ",
                                  "For sending notifications (university email system)",
                                ],
                              }),
                              e.jsxs("li", {
                                children: [
                                  e.jsx("strong", {
                                    className: "text-slate-900",
                                    children: "Cloud Infrastructure:",
                                  }),
                                  " ",
                                  "For hosting and data storage (with PDPA compliance)",
                                ],
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "mt-3",
                            children:
                              "All third-party services are carefully selected and required to maintain appropriate security and privacy standards.",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "10. Children's Privacy",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsx("div", {
                        className: "text-slate-600 leading-relaxed",
                        children:
                          "APU VOTE is designed for university students aged 18 and above. We do not knowingly collect personal information from individuals under 18. If you believe we have inadvertently collected such information, please contact us immediately.",
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "11. International Data Transfers",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed",
                        children: [
                          "Your data is primarily stored and processed in Malaysia. If data needs to be transferred internationally (e.g., for cloud services), we ensure appropriate safeguards are in place, including:",
                          e.jsxs("ul", {
                            className:
                              "list-disc list-inside ml-4 mt-2 space-y-1",
                            children: [
                              e.jsx("li", {
                                children: "Standard contractual clauses",
                              }),
                              e.jsx("li", {
                                children: "Adequate data protection measures",
                              }),
                              e.jsx("li", {
                                children:
                                  "Compliance with PDPA requirements for cross-border data transfers",
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, {
                        children: "12. Changes to This Privacy Policy",
                      }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed",
                        children: [
                          "We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes via:",
                          e.jsxs("ul", {
                            className:
                              "list-disc list-inside ml-4 mt-2 space-y-1",
                            children: [
                              e.jsx("li", {
                                children:
                                  "Email notification to your university address",
                              }),
                              e.jsx("li", {
                                children: "Prominent notice on the platform",
                              }),
                              e.jsx("li", {
                                children:
                                  'Updated "Last updated" date at the top of this policy',
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "mt-3",
                            children:
                              "Continued use of the service after changes indicates acceptance of the updated policy.",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, { children: "13. Contact Us" }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed",
                        children: [
                          "If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact:",
                          e.jsxs("div", {
                            className: "mt-3 space-y-2",
                            children: [
                              e.jsx("div", {
                                children: e.jsx("strong", {
                                  className: "text-slate-900",
                                  children: "Data Protection Officer (DPO)",
                                }),
                              }),
                              e.jsxs("div", {
                                children: [
                                  "Email:",
                                  " ",
                                  e.jsx("a", {
                                    href: "mailto:dpo@apu.edu.my",
                                    className:
                                      "text-emerald-600 hover:underline",
                                    children: "dpo@apu.edu.my",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                children: [
                                  "General Inquiries:",
                                  " ",
                                  e.jsx("a", {
                                    href: "mailto:vote@apu.edu.my",
                                    className:
                                      "text-emerald-600 hover:underline",
                                    children: "vote@apu.edu.my",
                                  }),
                                ],
                              }),
                              e.jsx("div", {
                                children: "Phone: +60 3-8996 1000",
                              }),
                              e.jsxs("div", {
                                children: [
                                  "Address: Asia Pacific University of Technology & Innovation",
                                  e.jsx("br", {}),
                                  "Technology Park Malaysia",
                                  e.jsx("br", {}),
                                  "Bukit Jalil, 57000 Kuala Lumpur",
                                  e.jsx("br", {}),
                                  "Malaysia",
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsx(A, {
                      children: e.jsx(P, { children: "14. Complaints" }),
                    }),
                    e.jsx(w, {
                      children: e.jsxs("div", {
                        className: "text-slate-600 leading-relaxed",
                        children: [
                          "If you believe your privacy rights have been violated, you may lodge a complaint with:",
                          e.jsxs("div", {
                            className: "mt-3 space-y-2",
                            children: [
                              e.jsx("div", {
                                children: e.jsx("strong", {
                                  className: "text-slate-900",
                                  children:
                                    "Personal Data Protection Department",
                                }),
                              }),
                              e.jsx("div", {
                                children:
                                  "Ministry of Communications and Digital",
                              }),
                              e.jsxs("div", {
                                children: [
                                  "Website:",
                                  " ",
                                  e.jsx("a", {
                                    href: "https://www.pdp.gov.my",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className:
                                      "text-emerald-600 hover:underline",
                                    children: "www.pdp.gov.my",
                                  }),
                                ],
                              }),
                              e.jsx("div", {
                                children: "Email: pdp@kkmm.gov.my",
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
            e.jsx("div", {
              className: "mt-8 p-4 bg-slate-100 rounded-lg",
              children: e.jsx("div", {
                className: "text-slate-600 text-center",
                children:
                  "By using APU VOTE, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your personal information as described herein.",
              }),
            }),
          ],
        }),
      }),
      e.jsx("footer", {
        className: "w-full border-t py-6 mt-12",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "text-center text-slate-600 md:text-left",
              children: [
                "© ",
                new Date().getFullYear(),
                " APU Vote Chain. All rights reserved.",
              ],
            }),
            e.jsxs("div", {
              className: "flex gap-6",
              children: [
                e.jsx("button", {
                  onClick: () => t("terms"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Terms",
                }),
                e.jsx("button", {
                  onClick: () => t("privacy"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Privacy",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Contact",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
var sa = "Radio",
  [Uu, Yn] = Jt(sa),
  [Bu, Hu] = Uu(sa),
  Kn = d.forwardRef((t, s) => {
    const {
        __scopeRadio: a,
        name: r,
        checked: n = !1,
        required: o,
        disabled: c,
        value: l = "on",
        onCheck: m,
        form: u,
        ...p
      } = t,
      [i, x] = d.useState(null),
      j = Qe(s, (T) => x(T)),
      g = d.useRef(!1),
      v = i ? u || !!i.closest("form") : !0;
    return e.jsxs(Bu, {
      scope: a,
      checked: n,
      disabled: c,
      children: [
        e.jsx(Ue.button, {
          type: "button",
          role: "radio",
          "aria-checked": n,
          "data-state": Qn(n),
          "data-disabled": c ? "" : void 0,
          disabled: c,
          value: l,
          ...p,
          ref: j,
          onClick: ie(t.onClick, (T) => {
            n || m?.(),
              v &&
                ((g.current = T.isPropagationStopped()),
                g.current || T.stopPropagation());
          }),
        }),
        v &&
          e.jsx(Zn, {
            control: i,
            bubbles: !g.current,
            name: r,
            value: l,
            checked: n,
            required: o,
            disabled: c,
            form: u,
            style: { transform: "translateX(-100%)" },
          }),
      ],
    });
  });
Kn.displayName = sa;
var Jn = "RadioIndicator",
  Xn = d.forwardRef((t, s) => {
    const { __scopeRadio: a, forceMount: r, ...n } = t,
      o = Hu(Jn, a);
    return e.jsx(Pt, {
      present: r || o.checked,
      children: e.jsx(Ue.span, {
        "data-state": Qn(o.checked),
        "data-disabled": o.disabled ? "" : void 0,
        ...n,
        ref: s,
      }),
    });
  });
Xn.displayName = Jn;
var Gu = "RadioBubbleInput",
  Zn = d.forwardRef(
    ({ __scopeRadio: t, control: s, checked: a, bubbles: r = !0, ...n }, o) => {
      const c = d.useRef(null),
        l = Qe(c, o),
        m = so(a),
        u = ao(s);
      return (
        d.useEffect(() => {
          const p = c.current;
          if (!p) return;
          const i = window.HTMLInputElement.prototype,
            j = Object.getOwnPropertyDescriptor(i, "checked").set;
          if (m !== a && j) {
            const g = new Event("click", { bubbles: r });
            j.call(p, a), p.dispatchEvent(g);
          }
        }, [m, a, r]),
        e.jsx(Ue.input, {
          type: "radio",
          "aria-hidden": !0,
          defaultChecked: a,
          ...n,
          tabIndex: -1,
          ref: l,
          style: {
            ...n.style,
            ...u,
            position: "absolute",
            pointerEvents: "none",
            opacity: 0,
            margin: 0,
          },
        })
      );
    }
  );
Zn.displayName = Gu;
function Qn(t) {
  return t ? "checked" : "unchecked";
}
var qu = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
  is = "RadioGroup",
  [Wu] = Jt(is, [Xt, Yn]),
  ei = Xt(),
  ti = Yn(),
  [Yu, Ku] = Wu(is),
  si = d.forwardRef((t, s) => {
    const {
        __scopeRadioGroup: a,
        name: r,
        defaultValue: n,
        value: o,
        required: c = !1,
        disabled: l = !1,
        orientation: m,
        dir: u,
        loop: p = !0,
        onValueChange: i,
        ...x
      } = t,
      j = ei(a),
      g = Za(u),
      [v, T] = Qa({ prop: o, defaultProp: n ?? null, onChange: i, caller: is });
    return e.jsx(Yu, {
      scope: a,
      name: r,
      required: c,
      disabled: l,
      value: v,
      onValueChange: T,
      children: e.jsx(Xa, {
        asChild: !0,
        ...j,
        orientation: m,
        dir: g,
        loop: p,
        children: e.jsx(Ue.div, {
          role: "radiogroup",
          "aria-required": c,
          "aria-orientation": m,
          "data-disabled": l ? "" : void 0,
          dir: g,
          ...x,
          ref: s,
        }),
      }),
    });
  });
si.displayName = is;
var ai = "RadioGroupItem",
  ri = d.forwardRef((t, s) => {
    const { __scopeRadioGroup: a, disabled: r, ...n } = t,
      o = Ku(ai, a),
      c = o.disabled || r,
      l = ei(a),
      m = ti(a),
      u = d.useRef(null),
      p = Qe(s, u),
      i = o.value === n.value,
      x = d.useRef(!1);
    return (
      d.useEffect(() => {
        const j = (v) => {
            qu.includes(v.key) && (x.current = !0);
          },
          g = () => (x.current = !1);
        return (
          document.addEventListener("keydown", j),
          document.addEventListener("keyup", g),
          () => {
            document.removeEventListener("keydown", j),
              document.removeEventListener("keyup", g);
          }
        );
      }, []),
      e.jsx(Ja, {
        asChild: !0,
        ...l,
        focusable: !c,
        active: i,
        children: e.jsx(Kn, {
          disabled: c,
          required: o.required,
          checked: i,
          ...m,
          ...n,
          name: o.name,
          ref: p,
          onCheck: () => o.onValueChange(n.value),
          onKeyDown: ie((j) => {
            j.key === "Enter" && j.preventDefault();
          }),
          onFocus: ie(n.onFocus, () => {
            x.current && u.current?.click();
          }),
        }),
      })
    );
  });
ri.displayName = ai;
var Ju = "RadioGroupIndicator",
  ni = d.forwardRef((t, s) => {
    const { __scopeRadioGroup: a, ...r } = t,
      n = ti(a);
    return e.jsx(Xn, { ...n, ...r, ref: s });
  });
ni.displayName = Ju;
var Xu = si,
  Zu = ri,
  Qu = ni;
function ex({ className: t, ...s }) {
  return e.jsx(Xu, {
    "data-slot": "radio-group",
    className: O("grid gap-3", t),
    ...s,
  });
}
function tx({ className: t, ...s }) {
  return e.jsx(Zu, {
    "data-slot": "radio-group-item",
    className: O(
      "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      t
    ),
    ...s,
    children: e.jsx(Qu, {
      "data-slot": "radio-group-indicator",
      className: "relative flex items-center justify-center",
      children: e.jsx(br, {
        className:
          "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2",
      }),
    }),
  });
}
const sx = "/apu-logo.png";
function ax({ onNavigate: t }) {
  const [s, a] = d.useState(!0),
    [r, n] = d.useState(!1),
    [o, c] = d.useState(!1),
    [l, m] = d.useState(null),
    [u, p] = d.useState(!0),
    [i, x] = d.useState(!1),
    [j, g] = d.useState(!1),
    [v, T] = d.useState([]),
    [y, E] = d.useState({}),
    [R, F] = d.useState({});
  d.useEffect(() => {
    (async () => {
      try {
        p(!0);
        const L = await On();
        if ((m(L), !L)) {
          t("voter-registration");
          return;
        }
      } catch (L) {
        console.error("Failed to check voter registration", L), m(!1);
      } finally {
        p(!1);
      }
    })();
  }, [t]),
    d.useEffect(() => {
      if (l !== !0) return;
      (async () => {
        try {
          a(!0);
          const L = await It();
          x(L.isActive), g(L.hasEnded);
          const ne = (await as()).filter((Z) => Z.isActive);
          T(ne);
          const X = {};
          for (const Z of ne) {
            const ee = await rs(Z.id);
            X[Z.id] = ee;
          }
          E(X);
        } catch (L) {
          console.error("Failed to load voting data", L);
        } finally {
          a(!1);
        }
      })();
    }, [l]);
  const f = (C, L) => {
      F((H) => ({ ...H, [C]: L }));
    },
    B = () => v.every((C) => R[C.id]),
    oe = async () => {
      try {
        n(!0);
        for (const C of v) {
          const L = R[C.id];
          await $n(C.id, L);
        }
        c(!0);
      } catch (C) {
        alert(C.message || "Failed to submit vote");
      } finally {
        n(!1);
      }
    };
  return s
    ? e.jsx("div", {
        className: "flex items-center justify-center min-h-screen",
        children: e.jsx(de, {
          className: "h-8 w-8 animate-spin text-emerald-600",
        }),
      })
    : j
    ? e.jsx("div", {
        className: "flex items-center justify-center min-h-screen",
        children: e.jsx(N, {
          className: "max-w-md w-full",
          children: e.jsxs(w, {
            className: "py-12 text-center",
            children: [
              e.jsx(nt, { className: "h-14 w-14 text-red-600 mx-auto mb-4" }),
              e.jsx("h2", { children: "Election Ended" }),
              e.jsx("p", {
                className: "text-slate-600 mt-2",
                children: "Voting is no longer available.",
              }),
              e.jsx(b, {
                className: "mt-6",
                onClick: () => t("results"),
                children: "View Results",
              }),
            ],
          }),
        }),
      })
    : i
    ? o
      ? e.jsx("div", {
          className: "flex items-center justify-center min-h-screen",
          children: e.jsx(N, {
            className: "max-w-md w-full",
            children: e.jsxs(w, {
              className: "py-12 text-center",
              children: [
                e.jsx(Ne, {
                  className: "h-14 w-14 text-emerald-600 mx-auto mb-4",
                }),
                e.jsx("h2", { children: "Vote Submitted" }),
                e.jsx("p", {
                  className: "text-slate-600 mt-2",
                  children: "Your vote has been recorded on the blockchain.",
                }),
                e.jsx(b, {
                  className: "mt-6",
                  onClick: () => t("results"),
                  children: "View Results",
                }),
              ],
            }),
          }),
        })
      : e.jsxs("div", {
          className: "container py-10 max-w-4xl mx-auto",
          children: [
            e.jsxs(b, {
              variant: "ghost",
              onClick: () => t("home"),
              children: [e.jsx(ge, { className: "h-4 w-4 mr-1" }), "Back"],
            }),
            e.jsxs("div", {
              className: "flex items-center gap-3 my-6",
              children: [
                e.jsx("img", { src: sx, className: "h-10" }),
                e.jsx("h1", { children: "Cast Your Vote" }),
              ],
            }),
            e.jsxs(lt, {
              defaultValue: String(v[0]?.id),
              children: [
                e.jsx(ct, {
                  className: "grid w-full grid-cols-3 mb-6",
                  children: v.map((C) =>
                    e.jsx(pe, { value: String(C.id), children: C.name }, C.id)
                  ),
                }),
                v.map((C) =>
                  e.jsx(
                    fe,
                    {
                      value: String(C.id),
                      children: e.jsx(ex, {
                        value: String(R[C.id] || ""),
                        onValueChange: (L) => f(C.id, Number(L)),
                        children: y[C.id]?.map((L) =>
                          e.jsxs(
                            "div",
                            {
                              className:
                                "flex items-center space-x-3 border rounded p-4 mb-3",
                              children: [
                                e.jsx(tx, {
                                  value: String(L.id),
                                  id: `cand-${L.id}`,
                                }),
                                e.jsxs(V, {
                                  htmlFor: `cand-${L.id}`,
                                  className: "flex flex-col",
                                  children: [
                                    e.jsx("span", { children: L.name }),
                                    e.jsx("span", {
                                      className: "text-slate-500 text-sm",
                                      children: L.party,
                                    }),
                                  ],
                                }),
                              ],
                            },
                            L.id
                          )
                        ),
                      }),
                    },
                    C.id
                  )
                ),
              ],
            }),
            e.jsx(Tt, {
              className: "pt-6",
              children: e.jsx(b, {
                className: "w-full",
                disabled: !B() || r,
                onClick: oe,
                children: r
                  ? e.jsxs(e.Fragment, {
                      children: [
                        e.jsx(de, { className: "h-4 w-4 mr-2 animate-spin" }),
                        "Submitting...",
                      ],
                    })
                  : "Submit Vote",
              }),
            }),
          ],
        })
    : e.jsx("div", {
        className: "flex items-center justify-center min-h-screen",
        children: e.jsx(N, {
          className: "max-w-md w-full",
          children: e.jsxs(w, {
            className: "py-12 text-center",
            children: [
              e.jsx(Xe, { className: "h-14 w-14 text-amber-500 mx-auto mb-4" }),
              e.jsx("h2", { children: "Election Not Started" }),
              e.jsx("p", {
                className: "text-slate-600 mt-2",
                children: "Voting has not started yet.",
              }),
              e.jsx(b, {
                className: "mt-6",
                onClick: () => t("home"),
                children: "Go Back",
              }),
            ],
          }),
        }),
      });
}
const rx = "/apu-logo.png";
function nx({ onNavigate: t }) {
  const [s, a] = d.useState(null),
    [r, n] = d.useState(!1),
    [o, c] = d.useState(""),
    [l, m] = d.useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      studentId: "",
      department: "",
      yearOfStudy: "",
      program: "",
    }),
    [u, p] = d.useState({
      emailNewElections: !0,
      emailDeadlines: !0,
      emailResults: !0,
      emailUpdates: !1,
      smsAlerts: !1,
    }),
    [i, x] = d.useState({ twoFactorAuth: !1, publicProfile: !1 }),
    j = Be();
  d.useEffect(() => {
    if (!j) {
      t("login");
      return;
    }
    g(), v();
  }, [j, t]);
  const g = () => {
      const f = ss();
      f &&
        (a(f),
        m({
          firstName: f.firstName || "",
          lastName: f.lastName || "",
          email: f.email || "",
          phone: f.phone || "",
          studentId: f.studentId || "",
          department: f.department || "",
          yearOfStudy: f.yearOfStudy || "",
          program: f.program || "",
        }));
    },
    v = async () => {
      if (typeof window.ethereum < "u")
        try {
          const f = await window.ethereum.request({ method: "eth_accounts" });
          f.length > 0 && c(f[0]);
        } catch (f) {
          console.error("Error checking wallet connection:", f);
        }
    },
    T = async () => {
      try {
        if (typeof window.ethereum > "u") {
          M.error("MetaMask is not installed");
          return;
        }
        const f = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        f.length > 0 && (c(f[0]), M.success("Wallet connected successfully!"));
      } catch (f) {
        console.error("Error connecting wallet:", f),
          M.error("Failed to connect wallet");
      }
    },
    y = async () => {
      n(!0);
      try {
        await new Promise((B) => setTimeout(B, 1500));
        const f = { ...s, ...l };
        pm(f), a(f), M.success("Profile updated successfully!");
      } catch (f) {
        console.error("Error saving profile:", f),
          M.error("Failed to update profile");
      } finally {
        n(!1);
      }
    },
    E = async () => {
      n(!0);
      try {
        await new Promise((f) => setTimeout(f, 1e3)),
          M.success("Notification preferences saved!");
      } catch {
        M.error("Failed to save preferences");
      } finally {
        n(!1);
      }
    },
    R = async () => {
      n(!0);
      try {
        await new Promise((f) => setTimeout(f, 1e3)),
          M.success("Security settings updated!");
      } catch {
        M.error("Failed to update security settings");
      } finally {
        n(!1);
      }
    },
    F = () => `${l.firstName?.[0] || ""}${l.lastName?.[0] || ""}`.toUpperCase();
  return e.jsxs("div", {
    className:
      "flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 to-white",
    children: [
      e.jsx("header", {
        className:
          "sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex h-16 items-center justify-between px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("img", {
                  src: rx,
                  alt: "APU Logo",
                  className: "h-10 w-auto",
                }),
                e.jsx("span", {
                  className: "text-slate-900",
                  children: "APU VOTE",
                }),
              ],
            }),
            e.jsxs("nav", {
              className: "hidden md:flex gap-8",
              children: [
                e.jsx("button", {
                  onClick: () => t("home"),
                  className:
                    "text-sm transition-colors hover:text-slate-900 text-slate-600",
                  children: "Home",
                }),
                e.jsx("button", {
                  onClick: () => t("vote"),
                  className:
                    "text-sm transition-colors hover:text-slate-900 text-slate-600",
                  children: "Elections",
                }),
                e.jsx("button", {
                  onClick: () => t("results"),
                  className:
                    "text-sm transition-colors hover:text-slate-900 text-slate-600",
                  children: "Results",
                }),
                e.jsx("button", {
                  onClick: () => t("about"),
                  className:
                    "text-sm transition-colors hover:text-slate-900 text-slate-600",
                  children: "About",
                }),
              ],
            }),
            j
              ? e.jsx(Ce, { onNavigate: t })
              : e.jsx(b, {
                  variant: "outline",
                  size: "sm",
                  onClick: () => t("login"),
                  children: "Sign In",
                }),
          ],
        }),
      }),
      e.jsx("main", {
        className: "flex-1 py-12",
        children: e.jsxs("div", {
          className: "container mx-auto max-w-5xl px-6",
          children: [
            e.jsxs("div", {
              className: "mb-8",
              children: [
                e.jsxs("div", {
                  className: "flex items-center gap-3 mb-2",
                  children: [
                    e.jsx(St, { className: "h-8 w-8 text-emerald-600" }),
                    e.jsx("h1", {
                      className: "text-slate-900",
                      children: "Account Settings",
                    }),
                  ],
                }),
                e.jsx("p", {
                  className: "text-slate-600",
                  children:
                    "Manage your profile information, security settings, and preferences",
                }),
              ],
            }),
            e.jsxs(lt, {
              defaultValue: "profile",
              className: "w-full",
              children: [
                e.jsxs(ct, {
                  className: "grid w-full grid-cols-4 mb-8",
                  children: [
                    e.jsxs(pe, {
                      value: "profile",
                      children: [
                        e.jsx(St, { className: "h-4 w-4 mr-2" }),
                        "Profile",
                      ],
                    }),
                    e.jsxs(pe, {
                      value: "wallet",
                      children: [
                        e.jsx(st, { className: "h-4 w-4 mr-2" }),
                        "Wallet & Security",
                      ],
                    }),
                    e.jsxs(pe, {
                      value: "notifications",
                      children: [
                        e.jsx(wa, { className: "h-4 w-4 mr-2" }),
                        "Notifications",
                      ],
                    }),
                    e.jsxs(pe, {
                      value: "preferences",
                      children: [
                        e.jsx(Gt, { className: "h-4 w-4 mr-2" }),
                        "Preferences",
                      ],
                    }),
                  ],
                }),
                e.jsx(fe, {
                  value: "profile",
                  children: e.jsxs(N, {
                    children: [
                      e.jsxs(A, {
                        children: [
                          e.jsx(P, { children: "Profile Information" }),
                          e.jsx(Q, {
                            children:
                              "Update your personal details and student information",
                          }),
                        ],
                      }),
                      e.jsxs(w, {
                        className: "space-y-6",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center gap-6",
                            children: [
                              e.jsx(kn, {
                                className: "h-24 w-24",
                                children: e.jsx(Cn, {
                                  className:
                                    "text-2xl bg-emerald-100 text-emerald-700",
                                  children: F(),
                                }),
                              }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx("h3", {
                                    className: "text-slate-900",
                                    children: "Profile Photo",
                                  }),
                                  e.jsx("p", {
                                    className: "text-sm text-slate-600",
                                    children:
                                      "Upload a profile picture to personalize your account",
                                  }),
                                  e.jsxs(b, {
                                    size: "sm",
                                    variant: "outline",
                                    disabled: !0,
                                    children: [
                                      e.jsx(jl, { className: "h-4 w-4 mr-2" }),
                                      "Upload Photo (Coming Soon)",
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsx(De, {}),
                          e.jsxs("div", {
                            className: "space-y-4",
                            children: [
                              e.jsx("h3", {
                                className: "text-slate-900",
                                children: "Personal Information",
                              }),
                              e.jsxs("div", {
                                className:
                                  "grid grid-cols-1 md:grid-cols-2 gap-4",
                                children: [
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsx(V, {
                                        htmlFor: "firstName",
                                        children: "First Name *",
                                      }),
                                      e.jsx(J, {
                                        id: "firstName",
                                        value: l.firstName,
                                        onChange: (f) =>
                                          m({
                                            ...l,
                                            firstName: f.target.value,
                                          }),
                                        placeholder: "Enter your first name",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsx(V, {
                                        htmlFor: "lastName",
                                        children: "Last Name *",
                                      }),
                                      e.jsx(J, {
                                        id: "lastName",
                                        value: l.lastName,
                                        onChange: (f) =>
                                          m({ ...l, lastName: f.target.value }),
                                        placeholder: "Enter your last name",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx(V, {
                                    htmlFor: "studentId",
                                    children: "TP Number / Student ID *",
                                  }),
                                  e.jsx(J, {
                                    id: "studentId",
                                    value: l.studentId,
                                    onChange: (f) =>
                                      m({ ...l, studentId: f.target.value }),
                                    placeholder: "e.g., TP12345",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "grid grid-cols-1 md:grid-cols-2 gap-4",
                                children: [
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsx(V, {
                                        htmlFor: "email",
                                        children: "Email Address *",
                                      }),
                                      e.jsxs("div", {
                                        className: "relative",
                                        children: [
                                          e.jsx(gt, {
                                            className:
                                              "absolute left-3 top-3 h-4 w-4 text-slate-400",
                                          }),
                                          e.jsx(J, {
                                            id: "email",
                                            type: "email",
                                            value: l.email,
                                            onChange: (f) =>
                                              m({
                                                ...l,
                                                email: f.target.value,
                                              }),
                                            placeholder:
                                              "your.email@student.apu.edu.my",
                                            className: "pl-10",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsx(V, {
                                        htmlFor: "phone",
                                        children: "Phone Number",
                                      }),
                                      e.jsxs("div", {
                                        className: "relative",
                                        children: [
                                          e.jsx(Ct, {
                                            className:
                                              "absolute left-3 top-3 h-4 w-4 text-slate-400",
                                          }),
                                          e.jsx(J, {
                                            id: "phone",
                                            type: "tel",
                                            value: l.phone,
                                            onChange: (f) =>
                                              m({
                                                ...l,
                                                phone: f.target.value,
                                              }),
                                            placeholder: "+60 12-345 6789",
                                            className: "pl-10",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsx(De, {}),
                          e.jsxs("div", {
                            className: "space-y-4",
                            children: [
                              e.jsx("h3", {
                                className: "text-slate-900",
                                children: "Academic Information",
                              }),
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx(V, {
                                    htmlFor: "department",
                                    children: "Department / Faculty *",
                                  }),
                                  e.jsxs(Oe, {
                                    value: l.department,
                                    onValueChange: (f) =>
                                      m({ ...l, department: f }),
                                    children: [
                                      e.jsx(Fe, {
                                        id: "department",
                                        children: e.jsx($e, {
                                          placeholder: "Select your department",
                                        }),
                                      }),
                                      e.jsxs(ze, {
                                        children: [
                                          e.jsx(K, {
                                            value: "computer-science",
                                            children: "School of Computing",
                                          }),
                                          e.jsx(K, {
                                            value: "engineering",
                                            children: "School of Engineering",
                                          }),
                                          e.jsx(K, {
                                            value: "business",
                                            children: "School of Business",
                                          }),
                                          e.jsx(K, {
                                            value: "accounting",
                                            children:
                                              "School of Accounting & Finance",
                                          }),
                                          e.jsx(K, {
                                            value: "foundation",
                                            children: "Foundation Studies",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "grid grid-cols-1 md:grid-cols-2 gap-4",
                                children: [
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsx(V, {
                                        htmlFor: "program",
                                        children: "Program / Course",
                                      }),
                                      e.jsx(J, {
                                        id: "program",
                                        value: l.program,
                                        onChange: (f) =>
                                          m({ ...l, program: f.target.value }),
                                        placeholder:
                                          "e.g., BSc (Hons) in Computer Science",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsx(V, {
                                        htmlFor: "yearOfStudy",
                                        children: "Year of Study",
                                      }),
                                      e.jsxs(Oe, {
                                        value: l.yearOfStudy,
                                        onValueChange: (f) =>
                                          m({ ...l, yearOfStudy: f }),
                                        children: [
                                          e.jsx(Fe, {
                                            id: "yearOfStudy",
                                            children: e.jsx($e, {
                                              placeholder: "Select year",
                                            }),
                                          }),
                                          e.jsxs(ze, {
                                            children: [
                                              e.jsx(K, {
                                                value: "1",
                                                children: "Year 1",
                                              }),
                                              e.jsx(K, {
                                                value: "2",
                                                children: "Year 2",
                                              }),
                                              e.jsx(K, {
                                                value: "3",
                                                children: "Year 3",
                                              }),
                                              e.jsx(K, {
                                                value: "4",
                                                children: "Year 4",
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "flex justify-end pt-4",
                            children: e.jsx(b, {
                              onClick: y,
                              disabled: r,
                              className: "bg-emerald-600 hover:bg-emerald-700",
                              children: r
                                ? e.jsxs(e.Fragment, {
                                    children: [
                                      e.jsx(de, {
                                        className: "mr-2 h-4 w-4 animate-spin",
                                      }),
                                      "Saving...",
                                    ],
                                  })
                                : e.jsxs(e.Fragment, {
                                    children: [
                                      e.jsx(hs, { className: "mr-2 h-4 w-4" }),
                                      "Save Changes",
                                    ],
                                  }),
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                e.jsx(fe, {
                  value: "wallet",
                  children: e.jsxs("div", {
                    className: "space-y-6",
                    children: [
                      e.jsxs(N, {
                        children: [
                          e.jsxs(A, {
                            children: [
                              e.jsxs(P, {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsx(st, {
                                    className: "h-5 w-5 text-emerald-600",
                                  }),
                                  "Connected Wallet",
                                ],
                              }),
                              e.jsx(Q, {
                                children:
                                  "Your blockchain wallet used for voting and identity verification",
                              }),
                            ],
                          }),
                          e.jsxs(w, {
                            className: "space-y-4",
                            children: [
                              o
                                ? e.jsxs(at, {
                                    className:
                                      "bg-emerald-50 border-emerald-200",
                                    children: [
                                      e.jsx(Ne, {
                                        className: "h-4 w-4 text-emerald-600",
                                      }),
                                      e.jsx(rt, {
                                        className: "ml-2",
                                        children: e.jsxs("div", {
                                          className: "space-y-1",
                                          children: [
                                            e.jsx("p", {
                                              className:
                                                "text-sm text-emerald-800",
                                              children:
                                                "Wallet Connected Successfully",
                                            }),
                                            e.jsx("p", {
                                              className:
                                                "text-xs text-emerald-700 font-mono break-all",
                                              children: o,
                                            }),
                                          ],
                                        }),
                                      }),
                                    ],
                                  })
                                : e.jsxs(at, {
                                    className: "bg-amber-50 border-amber-200",
                                    children: [
                                      e.jsx(nt, {
                                        className: "h-4 w-4 text-amber-600",
                                      }),
                                      e.jsx(rt, {
                                        className: "ml-2 text-amber-800",
                                        children:
                                          "No wallet connected. Connect your MetaMask wallet to participate in voting.",
                                      }),
                                    ],
                                  }),
                              e.jsxs("div", {
                                className: "flex gap-3",
                                children: [
                                  o
                                    ? e.jsx(b, {
                                        variant: "outline",
                                        disabled: !0,
                                        children: "Wallet Connected",
                                      })
                                    : e.jsxs(b, {
                                        onClick: T,
                                        className:
                                          "bg-gray-600 hover:bg-gray-700",
                                        children: [
                                          e.jsx(st, {
                                            className: "mr-2 h-4 w-4",
                                          }),
                                          "Connect MetaMask",
                                        ],
                                      }),
                                  e.jsx(b, {
                                    variant: "outline",
                                    onClick: () => t("voter-registration"),
                                    children: "View Wallet Details",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4",
                                children: [
                                  e.jsx("h4", {
                                    className: "text-sm text-blue-900 mb-2",
                                    children: "Important:",
                                  }),
                                  e.jsxs("ul", {
                                    className:
                                      "text-sm text-blue-800 space-y-1 list-disc list-inside",
                                    children: [
                                      e.jsx("li", {
                                        children:
                                          "Your wallet address is used to verify your identity",
                                      }),
                                      e.jsx("li", {
                                        children:
                                          "You can only vote once per election per wallet",
                                      }),
                                      e.jsx("li", {
                                        children:
                                          "Never share your wallet private key with anyone",
                                      }),
                                      e.jsx("li", {
                                        children:
                                          "Ensure you have some ETH for transaction fees",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs(N, {
                        children: [
                          e.jsxs(A, {
                            children: [
                              e.jsxs(P, {
                                className: "flex items-center gap-2",
                                children: [
                                  e.jsx(We, {
                                    className: "h-5 w-5 text-emerald-600",
                                  }),
                                  "Security Settings",
                                ],
                              }),
                              e.jsx(Q, {
                                children:
                                  "Manage your account security and privacy preferences",
                              }),
                            ],
                          }),
                          e.jsxs(w, {
                            className: "space-y-6",
                            children: [
                              e.jsxs("div", {
                                className: "flex items-center justify-between",
                                children: [
                                  e.jsxs("div", {
                                    className: "space-y-1",
                                    children: [
                                      e.jsx(V, {
                                        children: "Two-Factor Authentication",
                                      }),
                                      e.jsx("p", {
                                        className: "text-sm text-slate-600",
                                        children:
                                          "Add an extra layer of security to your account",
                                      }),
                                    ],
                                  }),
                                  e.jsx(Le, {
                                    checked: i.twoFactorAuth,
                                    onCheckedChange: (f) =>
                                      x({ ...i, twoFactorAuth: f }),
                                    disabled: !0,
                                  }),
                                ],
                              }),
                              e.jsx(De, {}),
                              e.jsxs("div", {
                                className: "flex items-center justify-between",
                                children: [
                                  e.jsxs("div", {
                                    className: "space-y-1",
                                    children: [
                                      e.jsx(V, { children: "Public Profile" }),
                                      e.jsx("p", {
                                        className: "text-sm text-slate-600",
                                        children:
                                          "Allow other students to view your profile",
                                      }),
                                    ],
                                  }),
                                  e.jsx(Le, {
                                    checked: i.publicProfile,
                                    onCheckedChange: (f) =>
                                      x({ ...i, publicProfile: f }),
                                  }),
                                ],
                              }),
                              e.jsx(De, {}),
                              e.jsxs("div", {
                                className: "space-y-3",
                                children: [
                                  e.jsx(V, { children: "Password" }),
                                  e.jsx("p", {
                                    className: "text-sm text-slate-600 mb-3",
                                    children:
                                      "Change your password to keep your account secure",
                                  }),
                                  e.jsxs(b, {
                                    variant: "outline",
                                    disabled: !0,
                                    children: [
                                      e.jsx(Ze, { className: "mr-2 h-4 w-4" }),
                                      "Change Password (Coming Soon)",
                                    ],
                                  }),
                                ],
                              }),
                              e.jsx("div", {
                                className: "flex justify-end pt-4",
                                children: e.jsx(b, {
                                  onClick: R,
                                  disabled: r,
                                  className:
                                    "bg-emerald-600 hover:bg-emerald-700",
                                  children: r
                                    ? e.jsxs(e.Fragment, {
                                        children: [
                                          e.jsx(de, {
                                            className:
                                              "mr-2 h-4 w-4 animate-spin",
                                          }),
                                          "Saving...",
                                        ],
                                      })
                                    : e.jsxs(e.Fragment, {
                                        children: [
                                          e.jsx(hs, {
                                            className: "mr-2 h-4 w-4",
                                          }),
                                          "Save Security Settings",
                                        ],
                                      }),
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                e.jsx(fe, {
                  value: "notifications",
                  children: e.jsxs(N, {
                    children: [
                      e.jsxs(A, {
                        children: [
                          e.jsxs(P, {
                            className: "flex items-center gap-2",
                            children: [
                              e.jsx(wa, {
                                className: "h-5 w-5 text-emerald-600",
                              }),
                              "Notification Preferences",
                            ],
                          }),
                          e.jsx(Q, {
                            children:
                              "Choose how you want to receive updates about elections and voting",
                          }),
                        ],
                      }),
                      e.jsxs(w, {
                        className: "space-y-6",
                        children: [
                          e.jsxs("div", {
                            className: "space-y-4",
                            children: [
                              e.jsx("h3", {
                                className: "text-slate-900",
                                children: "Email Notifications",
                              }),
                              e.jsxs("div", {
                                className: "space-y-4",
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center justify-between",
                                    children: [
                                      e.jsxs("div", {
                                        className: "space-y-1",
                                        children: [
                                          e.jsx(V, {
                                            children: "New Elections",
                                          }),
                                          e.jsx("p", {
                                            className: "text-sm text-slate-600",
                                            children:
                                              "Get notified when new elections are announced",
                                          }),
                                        ],
                                      }),
                                      e.jsx(Le, {
                                        checked: u.emailNewElections,
                                        onCheckedChange: (f) =>
                                          p({ ...u, emailNewElections: f }),
                                      }),
                                    ],
                                  }),
                                  e.jsx(De, {}),
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center justify-between",
                                    children: [
                                      e.jsxs("div", {
                                        className: "space-y-1",
                                        children: [
                                          e.jsx(V, {
                                            children: "Voting Deadlines",
                                          }),
                                          e.jsx("p", {
                                            className: "text-sm text-slate-600",
                                            children:
                                              "Reminders about upcoming voting deadlines",
                                          }),
                                        ],
                                      }),
                                      e.jsx(Le, {
                                        checked: u.emailDeadlines,
                                        onCheckedChange: (f) =>
                                          p({ ...u, emailDeadlines: f }),
                                      }),
                                    ],
                                  }),
                                  e.jsx(De, {}),
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center justify-between",
                                    children: [
                                      e.jsxs("div", {
                                        className: "space-y-1",
                                        children: [
                                          e.jsx(V, {
                                            children: "Election Results",
                                          }),
                                          e.jsx("p", {
                                            className: "text-sm text-slate-600",
                                            children:
                                              "Get notified when election results are announced",
                                          }),
                                        ],
                                      }),
                                      e.jsx(Le, {
                                        checked: u.emailResults,
                                        onCheckedChange: (f) =>
                                          p({ ...u, emailResults: f }),
                                      }),
                                    ],
                                  }),
                                  e.jsx(De, {}),
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center justify-between",
                                    children: [
                                      e.jsxs("div", {
                                        className: "space-y-1",
                                        children: [
                                          e.jsx(V, {
                                            children: "System Updates",
                                          }),
                                          e.jsx("p", {
                                            className: "text-sm text-slate-600",
                                            children:
                                              "News about APU VOTE features and improvements",
                                          }),
                                        ],
                                      }),
                                      e.jsx(Le, {
                                        checked: u.emailUpdates,
                                        onCheckedChange: (f) =>
                                          p({ ...u, emailUpdates: f }),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsx(De, {}),
                          e.jsxs("div", {
                            className: "space-y-4",
                            children: [
                              e.jsx("h3", {
                                className: "text-slate-900",
                                children: "SMS Notifications",
                              }),
                              e.jsxs("div", {
                                className: "flex items-center justify-between",
                                children: [
                                  e.jsxs("div", {
                                    className: "space-y-1",
                                    children: [
                                      e.jsx(V, { children: "SMS Alerts" }),
                                      e.jsx("p", {
                                        className: "text-sm text-slate-600",
                                        children:
                                          "Receive text messages for critical voting reminders",
                                      }),
                                    ],
                                  }),
                                  e.jsx(Le, {
                                    checked: u.smsAlerts,
                                    onCheckedChange: (f) =>
                                      p({ ...u, smsAlerts: f }),
                                    disabled: !0,
                                  }),
                                ],
                              }),
                              e.jsx("p", {
                                className: "text-xs text-slate-500",
                                children:
                                  "SMS notifications require phone number verification (Coming soon)",
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "flex justify-end pt-4",
                            children: e.jsx(b, {
                              onClick: E,
                              disabled: r,
                              className: "bg-emerald-600 hover:bg-emerald-700",
                              children: r
                                ? e.jsxs(e.Fragment, {
                                    children: [
                                      e.jsx(de, {
                                        className: "mr-2 h-4 w-4 animate-spin",
                                      }),
                                      "Saving...",
                                    ],
                                  })
                                : e.jsxs(e.Fragment, {
                                    children: [
                                      e.jsx(hs, { className: "mr-2 h-4 w-4" }),
                                      "Save Preferences",
                                    ],
                                  }),
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                e.jsx(fe, {
                  value: "preferences",
                  children: e.jsxs(N, {
                    children: [
                      e.jsxs(A, {
                        children: [
                          e.jsxs(P, {
                            className: "flex items-center gap-2",
                            children: [
                              e.jsx(Gt, {
                                className: "h-5 w-5 text-emerald-600",
                              }),
                              "General Preferences",
                            ],
                          }),
                          e.jsx(Q, {
                            children: "Customize your APU VOTE experience",
                          }),
                        ],
                      }),
                      e.jsxs(w, {
                        className: "space-y-6",
                        children: [
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx(V, {
                                htmlFor: "language",
                                children: "Language",
                              }),
                              e.jsxs(Oe, {
                                defaultValue: "english",
                                children: [
                                  e.jsx(Fe, {
                                    id: "language",
                                    children: e.jsx($e, {
                                      placeholder: "Select language",
                                    }),
                                  }),
                                  e.jsxs(ze, {
                                    children: [
                                      e.jsx(K, {
                                        value: "english",
                                        children: "English",
                                      }),
                                      e.jsx(K, {
                                        value: "malay",
                                        children: "Bahasa Melayu",
                                      }),
                                      e.jsx(K, {
                                        value: "chinese",
                                        children: "中文",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsx("p", {
                                className: "text-xs text-slate-500",
                                children:
                                  "Choose your preferred language for the interface",
                              }),
                            ],
                          }),
                          e.jsx(De, {}),
                          e.jsxs("div", {
                            className: "space-y-2",
                            children: [
                              e.jsx(V, {
                                htmlFor: "timezone",
                                children: "Timezone",
                              }),
                              e.jsxs(Oe, {
                                defaultValue: "malaysia",
                                children: [
                                  e.jsx(Fe, {
                                    id: "timezone",
                                    children: e.jsx($e, {
                                      placeholder: "Select timezone",
                                    }),
                                  }),
                                  e.jsxs(ze, {
                                    children: [
                                      e.jsx(K, {
                                        value: "malaysia",
                                        children: "Malaysia (GMT+8)",
                                      }),
                                      e.jsx(K, {
                                        value: "singapore",
                                        children: "Singapore (GMT+8)",
                                      }),
                                      e.jsx(K, {
                                        value: "thailand",
                                        children: "Thailand (GMT+7)",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsx("p", {
                                className: "text-xs text-slate-500",
                                children:
                                  "All dates and times will be shown in this timezone",
                              }),
                            ],
                          }),
                          e.jsx(De, {}),
                          e.jsxs("div", {
                            className: "space-y-4",
                            children: [
                              e.jsx(V, { children: "Privacy" }),
                              e.jsxs("div", {
                                className:
                                  "bg-blue-50 border border-blue-200 rounded-lg p-4",
                                children: [
                                  e.jsx("p", {
                                    className: "text-sm text-blue-900 mb-2",
                                    children:
                                      "Your voting choices are always private and encrypted on the blockchain.",
                                  }),
                                  e.jsx("p", {
                                    className: "text-xs text-blue-800",
                                    children:
                                      "Only you can see your voting history. Election results show aggregate vote counts without revealing individual votes.",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "flex justify-end pt-4",
                            children: e.jsx(b, {
                              disabled: !0,
                              variant: "outline",
                              children: "Save Preferences (Coming Soon)",
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
const Ha = "/apu-logo.png";
function ix({ onNavigate: t }) {
  const [s, a] = d.useState(!1),
    [r, n] = d.useState(!1),
    [o, c] = d.useState(""),
    [l, m] = d.useState(""),
    u = Be(),
    p = async (i) => {
      i.preventDefault(), a(!0), m("");
      try {
        await new Promise((x) => setTimeout(x, 1500)), n(!0);
      } catch (x) {
        m("Failed to send reset email. Please try again."),
          console.error("Password reset error:", x);
      } finally {
        a(!1);
      }
    };
  return e.jsxs("div", {
    className:
      "flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white",
    children: [
      e.jsx("header", {
        className:
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex h-16 items-center justify-between px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("img", {
                  src: Ha,
                  alt: "Asia Pacific University Logo",
                  className: "h-10 w-auto",
                }),
                e.jsx("span", { children: "APU VOTE" }),
              ],
            }),
            e.jsxs("nav", {
              className: "hidden md:flex gap-6",
              children: [
                e.jsx("button", {
                  onClick: () => t("home"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "Home",
                }),
                e.jsx("button", {
                  onClick: () => t("vote"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "Elections",
                }),
                e.jsx("button", {
                  onClick: () => t("results"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "Results",
                }),
                e.jsx("button", {
                  onClick: () => t("about"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "About",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "Contact",
                }),
              ],
            }),
            u
              ? e.jsx(Ce, { onNavigate: t })
              : e.jsx(b, {
                  variant: "outline",
                  size: "sm",
                  onClick: () => t("login"),
                  children: "Sign In",
                }),
          ],
        }),
      }),
      e.jsx("main", {
        className: "flex-1 flex items-center justify-center py-12",
        children: e.jsx("div", {
          className: "container mx-auto max-w-md px-6",
          children: e.jsxs(N, {
            className: "w-full",
            children: [
              e.jsxs(A, {
                children: [
                  e.jsx("div", {
                    className: "flex items-center mb-4",
                    children: e.jsxs(b, {
                      variant: "ghost",
                      size: "sm",
                      className: "gap-1",
                      onClick: () => t("login"),
                      children: [e.jsx(ge, { className: "h-4 w-4" }), "Back"],
                    }),
                  }),
                  e.jsxs("div", {
                    className: "flex items-center gap-3 mb-4",
                    children: [
                      e.jsx("img", {
                        src: Ha,
                        alt: "Asia Pacific University Logo",
                        className: "h-10 w-auto",
                      }),
                      e.jsx(P, { children: "Reset Password" }),
                    ],
                  }),
                  e.jsx(Q, {
                    children: r
                      ? "Check your email for reset instructions"
                      : "Enter your student email to receive password reset instructions",
                  }),
                ],
              }),
              e.jsx(w, {
                children: r
                  ? e.jsxs("div", {
                      className:
                        "flex flex-col items-center justify-center py-6 text-center",
                      children: [
                        e.jsx("div", {
                          className:
                            "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100",
                          children: e.jsx(Ne, {
                            className: "h-10 w-10 text-emerald-600",
                          }),
                        }),
                        e.jsx("h3", {
                          className: "text-slate-900 mb-2",
                          children: "Email Sent!",
                        }),
                        e.jsxs("p", {
                          className: "text-slate-600 mb-6",
                          children: [
                            "We've sent password reset instructions to ",
                            e.jsx("span", {
                              className: "text-slate-900",
                              children: o,
                            }),
                            ". Please check your inbox and follow the link to reset your password.",
                          ],
                        }),
                        e.jsx("p", {
                          className: "text-sm text-slate-500 mb-6",
                          children:
                            "Didn't receive the email? Check your spam folder or try again.",
                        }),
                        e.jsxs("div", {
                          className: "flex flex-col sm:flex-row gap-3 w-full",
                          children: [
                            e.jsx(b, {
                              variant: "outline",
                              className: "flex-1",
                              onClick: () => {
                                n(!1), c("");
                              },
                              children: "Try Another Email",
                            }),
                            e.jsx(b, {
                              className: "flex-1",
                              onClick: () => t("login"),
                              children: "Back to Login",
                            }),
                          ],
                        }),
                      ],
                    })
                  : e.jsxs("form", {
                      onSubmit: p,
                      className: "space-y-4",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            e.jsx(V, {
                              htmlFor: "email",
                              children: "Student Email",
                            }),
                            e.jsxs("div", {
                              className: "relative",
                              children: [
                                e.jsx(gt, {
                                  className:
                                    "absolute left-3 top-3 h-4 w-4 text-slate-400",
                                }),
                                e.jsx(J, {
                                  id: "email",
                                  type: "email",
                                  placeholder: "your.email@student.apu.edu.my",
                                  value: o,
                                  onChange: (i) => c(i.target.value),
                                  className: "pl-9",
                                  required: !0,
                                }),
                              ],
                            }),
                            e.jsx("p", {
                              className: "text-xs text-slate-500",
                              children:
                                "Enter the email address associated with your student account",
                            }),
                          ],
                        }),
                        l &&
                          e.jsx("div", {
                            className:
                              "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg",
                            children: e.jsx("p", {
                              className: "text-sm",
                              children: l,
                            }),
                          }),
                        e.jsx(b, {
                          type: "submit",
                          className: "w-full",
                          disabled: s,
                          children: s
                            ? e.jsxs(e.Fragment, {
                                children: [
                                  e.jsx(de, {
                                    className: "mr-2 h-4 w-4 animate-spin",
                                  }),
                                  "Sending...",
                                ],
                              })
                            : "Send Reset Instructions",
                        }),
                        e.jsxs("div", {
                          className: "text-center text-sm",
                          children: [
                            e.jsx("span", {
                              className: "text-slate-600",
                              children: "Remember your password? ",
                            }),
                            e.jsx("button", {
                              type: "button",
                              onClick: () => t("login"),
                              className: "text-primary hover:underline",
                              children: "Sign in",
                            }),
                          ],
                        }),
                      ],
                    }),
              }),
              e.jsx(Tt, {
                className: "flex justify-center border-t pt-4",
                children: e.jsxs("p", {
                  className: "text-xs text-slate-600 text-center",
                  children: [
                    "If you continue to have issues, please contact",
                    " ",
                    e.jsx("button", {
                      onClick: () => t("contact"),
                      className: "text-primary hover:underline",
                      children: "support",
                    }),
                  ],
                }),
              }),
            ],
          }),
        }),
      }),
      e.jsx("footer", {
        className: "w-full border-t py-6 mt-auto",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8",
          children: [
            e.jsxs("p", {
              className: "text-sm text-slate-600",
              children: [
                "© ",
                new Date().getFullYear(),
                " APU Vote Chain. All rights reserved.",
              ],
            }),
            e.jsxs("div", {
              className: "flex gap-6",
              children: [
                e.jsx("button", {
                  onClick: () => t("terms"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Terms",
                }),
                e.jsx("button", {
                  onClick: () => t("privacy"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Privacy",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Contact",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
const ox = "/apu-logo.png";
function lx({ onNavigate: t }) {
  const s = Be(),
    a = Zs(),
    [r, n] = d.useState([]),
    [o, c] = d.useState({
      totalElections: 3,
      participated: 1,
      upcoming: 1,
      walletConnected: !0,
    });
  return (
    d.useEffect(() => {
      if (!s) {
        t("login");
        return;
      }
      n([
        {
          id: "1",
          electionTitle: "Faculty Representative 2024",
          date: "2024-10-12",
          status: "Completed",
          transactionHash: "0x1234...5678",
        },
      ]);
    }, [s, t]),
    e.jsxs("div", {
      className: "flex min-h-screen flex-col",
      children: [
        e.jsx("header", {
          className:
            "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          children: e.jsxs("div", {
            className:
              "container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8",
            children: [
              e.jsxs("div", {
                className: "flex items-center gap-3 w-48",
                children: [
                  e.jsx("img", {
                    src: ox,
                    alt: "Asia Pacific University Logo",
                    className: "h-10 w-auto",
                  }),
                  e.jsx("span", { children: "APU VOTE" }),
                ],
              }),
              e.jsxs("nav", {
                className: "hidden md:flex gap-6 flex-1 justify-center",
                children: [
                  e.jsx("button", {
                    onClick: () => t("home"),
                    className: "text-sm transition-colors hover:text-primary",
                    children: "Home",
                  }),
                  e.jsx("button", {
                    onClick: () => t("vote"),
                    className: "text-sm transition-colors hover:text-primary",
                    children: "Elections",
                  }),
                  e.jsx("button", {
                    onClick: () => t("results"),
                    className: "text-sm transition-colors hover:text-primary",
                    children: "Results",
                  }),
                  e.jsx("button", {
                    onClick: () => t("about"),
                    className: "text-sm transition-colors hover:text-primary",
                    children: "About",
                  }),
                  e.jsx("button", {
                    onClick: () => t("contact"),
                    className: "text-sm transition-colors hover:text-primary",
                    children: "Contact",
                  }),
                ],
              }),
              e.jsx("div", {
                className: "flex items-center gap-3 w-48 justify-end",
                children: e.jsx(Ce, { onNavigate: t }),
              }),
            ],
          }),
        }),
        e.jsx("main", {
          className: "flex-1 bg-gradient-to-b from-teal-50/30 to-white",
          children: e.jsxs("div", {
            className: "container mx-auto max-w-7xl px-6 md:px-8 py-12",
            children: [
              e.jsx("div", {
                className: "mb-6",
                children: e.jsxs(b, {
                  variant: "ghost",
                  size: "sm",
                  className: "gap-1",
                  onClick: () => t("home"),
                  children: [
                    e.jsx(ge, { className: "h-4 w-4" }),
                    "Back to Home",
                  ],
                }),
              }),
              e.jsxs("div", {
                className: "mb-8",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center gap-3 mb-2",
                    children: [
                      e.jsx(St, { className: "h-8 w-8 text-emerald-600" }),
                      e.jsx("h1", {
                        className: "text-slate-900",
                        children: "Student Dashboard",
                      }),
                    ],
                  }),
                  e.jsxs("p", {
                    className: "text-slate-600",
                    children: [
                      "Welcome back, ",
                      a?.firstName,
                      "! Manage your profile and view your voting activity.",
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "grid gap-6 md:grid-cols-4 mb-8",
                children: [
                  e.jsxs(N, {
                    children: [
                      e.jsxs(A, {
                        className:
                          "flex flex-row items-center justify-between space-y-0 pb-2",
                        children: [
                          e.jsx(P, {
                            className: "text-sm",
                            children: "Total Elections",
                          }),
                          e.jsx(ws, { className: "h-4 w-4 text-slate-600" }),
                        ],
                      }),
                      e.jsxs(w, {
                        children: [
                          e.jsx("div", {
                            className: "text-2xl text-slate-900",
                            children: o.totalElections,
                          }),
                          e.jsx("p", {
                            className: "text-xs text-slate-600 mt-1",
                            children: "Available to vote",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs(N, {
                    children: [
                      e.jsxs(A, {
                        className:
                          "flex flex-row items-center justify-between space-y-0 pb-2",
                        children: [
                          e.jsx(P, {
                            className: "text-sm",
                            children: "Participated",
                          }),
                          e.jsx(Ne, { className: "h-4 w-4 text-emerald-600" }),
                        ],
                      }),
                      e.jsxs(w, {
                        children: [
                          e.jsx("div", {
                            className: "text-2xl text-slate-900",
                            children: o.participated,
                          }),
                          e.jsx("p", {
                            className: "text-xs text-slate-600 mt-1",
                            children: "Votes cast successfully",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs(N, {
                    children: [
                      e.jsxs(A, {
                        className:
                          "flex flex-row items-center justify-between space-y-0 pb-2",
                        children: [
                          e.jsx(P, {
                            className: "text-sm",
                            children: "Upcoming",
                          }),
                          e.jsx(Xe, { className: "h-4 w-4 text-blue-600" }),
                        ],
                      }),
                      e.jsxs(w, {
                        children: [
                          e.jsx("div", {
                            className: "text-2xl text-slate-900",
                            children: o.upcoming,
                          }),
                          e.jsx("p", {
                            className: "text-xs text-slate-600 mt-1",
                            children: "Elections coming soon",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs(N, {
                    children: [
                      e.jsxs(A, {
                        className:
                          "flex flex-row items-center justify-between space-y-0 pb-2",
                        children: [
                          e.jsx(P, {
                            className: "text-sm",
                            children: "Wallet Status",
                          }),
                          e.jsx(st, { className: "h-4 w-4 text-purple-600" }),
                        ],
                      }),
                      e.jsxs(w, {
                        children: [
                          e.jsx("div", {
                            className: "text-2xl text-slate-900",
                            children: o.walletConnected
                              ? e.jsx(Ne, {
                                  className: "h-6 w-6 text-emerald-600",
                                })
                              : e.jsx("span", { children: "-" }),
                          }),
                          e.jsx("p", {
                            className: "text-xs text-slate-600 mt-1",
                            children: o.walletConnected
                              ? "Connected"
                              : "Not connected",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs(lt, {
                defaultValue: "profile",
                className: "space-y-6",
                children: [
                  e.jsxs(ct, {
                    className: "grid w-full grid-cols-3 max-w-md",
                    children: [
                      e.jsx(pe, { value: "profile", children: "Profile" }),
                      e.jsx(pe, {
                        value: "history",
                        children: "Voting History",
                      }),
                      e.jsx(pe, {
                        value: "achievements",
                        children: "Achievements",
                      }),
                    ],
                  }),
                  e.jsxs(fe, {
                    value: "profile",
                    className: "space-y-6",
                    children: [
                      e.jsxs(N, {
                        children: [
                          e.jsxs(A, {
                            children: [
                              e.jsx(P, { children: "Personal Information" }),
                              e.jsx(Q, {
                                children:
                                  "Your registered details with APU VOTE",
                              }),
                            ],
                          }),
                          e.jsxs(w, {
                            className: "space-y-4",
                            children: [
                              e.jsxs("div", {
                                className: "grid gap-4 md:grid-cols-2",
                                children: [
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsx("label", {
                                        className: "text-sm text-slate-600",
                                        children: "Full Name",
                                      }),
                                      e.jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                          e.jsx(St, {
                                            className: "h-4 w-4 text-slate-400",
                                          }),
                                          e.jsxs("p", {
                                            className: "text-slate-900",
                                            children: [
                                              a?.firstName,
                                              " ",
                                              a?.lastName,
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsx("label", {
                                        className: "text-sm text-slate-600",
                                        children: "Student ID",
                                      }),
                                      e.jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                          e.jsx(We, {
                                            className: "h-4 w-4 text-slate-400",
                                          }),
                                          e.jsx("p", {
                                            className: "text-slate-900",
                                            children:
                                              a?.studentId || "TP012345",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsx("label", {
                                        className: "text-sm text-slate-600",
                                        children: "Email Address",
                                      }),
                                      e.jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                          e.jsx(gt, {
                                            className: "h-4 w-4 text-slate-400",
                                          }),
                                          e.jsx("p", {
                                            className: "text-slate-900",
                                            children: a?.email,
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsx("label", {
                                        className: "text-sm text-slate-600",
                                        children: "Phone Number",
                                      }),
                                      e.jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                          e.jsx(Ct, {
                                            className: "h-4 w-4 text-slate-400",
                                          }),
                                          e.jsx("p", {
                                            className: "text-slate-900",
                                            children:
                                              a?.phone || "+60 12-345 6789",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsx("label", {
                                        className: "text-sm text-slate-600",
                                        children: "Faculty",
                                      }),
                                      e.jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                          e.jsx(zs, {
                                            className: "h-4 w-4 text-slate-400",
                                          }),
                                          e.jsx("p", {
                                            className: "text-slate-900",
                                            children:
                                              a?.faculty ||
                                              "Computing & Technology",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-2",
                                    children: [
                                      e.jsx("label", {
                                        className: "text-sm text-slate-600",
                                        children: "Registration Date",
                                      }),
                                      e.jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                          e.jsx(gl, {
                                            className: "h-4 w-4 text-slate-400",
                                          }),
                                          e.jsx("p", {
                                            className: "text-slate-900",
                                            children:
                                              new Date().toLocaleDateString(),
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsx("div", {
                                className: "pt-4",
                                children: e.jsx(b, {
                                  variant: "outline",
                                  onClick: () => t("settings"),
                                  children: "Edit Profile",
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs(N, {
                        children: [
                          e.jsxs(A, {
                            children: [
                              e.jsx(P, { children: "Blockchain Wallet" }),
                              e.jsx(Q, {
                                children:
                                  "Your connected wallet for secure voting",
                              }),
                            ],
                          }),
                          e.jsxs(w, {
                            className: "space-y-4",
                            children: [
                              e.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  e.jsx("label", {
                                    className: "text-sm text-slate-600",
                                    children: "Wallet Address",
                                  }),
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center gap-2 p-3 bg-slate-50 rounded-md",
                                    children: [
                                      e.jsx(st, {
                                        className: "h-4 w-4 text-slate-400",
                                      }),
                                      e.jsx("code", {
                                        className:
                                          "text-sm text-slate-900 font-mono",
                                        children: o.walletConnected
                                          ? "0x1234...5678"
                                          : "Not connected",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsx("div", {
                                className: "flex items-center gap-2",
                                children: o.walletConnected
                                  ? e.jsxs(e.Fragment, {
                                      children: [
                                        e.jsx(Ne, {
                                          className: "h-4 w-4 text-emerald-600",
                                        }),
                                        e.jsx("span", {
                                          className: "text-sm text-emerald-600",
                                          children: "Wallet Connected",
                                        }),
                                      ],
                                    })
                                  : e.jsx(b, {
                                      onClick: () => t("wallet-connection"),
                                      children: "Connect Wallet",
                                    }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx(fe, {
                    value: "history",
                    className: "space-y-6",
                    children: e.jsxs(N, {
                      children: [
                        e.jsxs(A, {
                          children: [
                            e.jsx(P, { children: "Your Voting History" }),
                            e.jsx(Q, {
                              children:
                                "All your past voting activities on the blockchain",
                            }),
                          ],
                        }),
                        e.jsx(w, {
                          children:
                            r.length > 0
                              ? e.jsx("div", {
                                  className: "space-y-4",
                                  children: r.map((l) =>
                                    e.jsxs(
                                      "div",
                                      {
                                        className:
                                          "flex items-center justify-between p-4 border rounded-lg",
                                        children: [
                                          e.jsxs("div", {
                                            className: "flex items-start gap-4",
                                            children: [
                                              e.jsx("div", {
                                                className:
                                                  "p-2 bg-emerald-50 rounded-lg",
                                                children: e.jsx(Ne, {
                                                  className:
                                                    "h-5 w-5 text-emerald-600",
                                                }),
                                              }),
                                              e.jsxs("div", {
                                                children: [
                                                  e.jsx("h3", {
                                                    className: "text-slate-900",
                                                    children: l.electionTitle,
                                                  }),
                                                  e.jsxs("p", {
                                                    className:
                                                      "text-sm text-slate-600",
                                                    children: [
                                                      "Voted on ",
                                                      new Date(
                                                        l.date
                                                      ).toLocaleDateString(),
                                                    ],
                                                  }),
                                                  e.jsxs("p", {
                                                    className:
                                                      "text-xs text-slate-500 font-mono mt-1",
                                                    children: [
                                                      "TX: ",
                                                      l.transactionHash,
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                          e.jsx(je, {
                                            className: "bg-emerald-500",
                                            children: l.status,
                                          }),
                                        ],
                                      },
                                      l.id
                                    )
                                  ),
                                })
                              : e.jsxs("div", {
                                  className:
                                    "flex flex-col items-center justify-center py-12",
                                  children: [
                                    e.jsx(ws, {
                                      className:
                                        "h-12 w-12 text-slate-300 mb-4",
                                    }),
                                    e.jsx("p", {
                                      className: "text-slate-600",
                                      children: "No voting history yet",
                                    }),
                                    e.jsx(b, {
                                      className:
                                        "mt-4 bg-emerald-600 hover:bg-emerald-700",
                                      onClick: () => t("elections"),
                                      children: "Cast Your First Vote",
                                    }),
                                  ],
                                }),
                        }),
                      ],
                    }),
                  }),
                  e.jsx(fe, {
                    value: "achievements",
                    className: "space-y-6",
                    children: e.jsxs(N, {
                      children: [
                        e.jsxs(A, {
                          children: [
                            e.jsx(P, { children: "Your Achievements" }),
                            e.jsx(Q, {
                              children:
                                "Badges earned through active participation",
                            }),
                          ],
                        }),
                        e.jsx(w, {
                          children: e.jsxs("div", {
                            className: "grid gap-4 md:grid-cols-3",
                            children: [
                              e.jsxs("div", {
                                className:
                                  "flex flex-col items-center justify-center p-6 border rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50",
                                children: [
                                  e.jsx(js, {
                                    className:
                                      "h-12 w-12 text-emerald-600 mb-2",
                                  }),
                                  e.jsx("h3", {
                                    className: "text-slate-900 text-center",
                                    children: "First Vote",
                                  }),
                                  e.jsx("p", {
                                    className:
                                      "text-sm text-slate-600 text-center mt-1",
                                    children: "Cast your first vote",
                                  }),
                                  e.jsx(je, {
                                    className: "mt-2 bg-emerald-500",
                                    children: "Earned",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "flex flex-col items-center justify-center p-6 border rounded-lg opacity-50",
                                children: [
                                  e.jsx(mc, {
                                    className: "h-12 w-12 text-slate-400 mb-2",
                                  }),
                                  e.jsx("h3", {
                                    className: "text-slate-900 text-center",
                                    children: "Active Voter",
                                  }),
                                  e.jsx("p", {
                                    className:
                                      "text-sm text-slate-600 text-center mt-1",
                                    children: "Vote in 5 elections",
                                  }),
                                  e.jsx(je, {
                                    variant: "outline",
                                    className: "mt-2",
                                    children: "Locked",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "flex flex-col items-center justify-center p-6 border rounded-lg opacity-50",
                                children: [
                                  e.jsx(We, {
                                    className: "h-12 w-12 text-slate-400 mb-2",
                                  }),
                                  e.jsx("h3", {
                                    className: "text-slate-900 text-center",
                                    children: "Verified Voter",
                                  }),
                                  e.jsx("p", {
                                    className:
                                      "text-sm text-slate-600 text-center mt-1",
                                    children: "Complete wallet verification",
                                  }),
                                  e.jsx(je, {
                                    variant: "outline",
                                    className: "mt-2",
                                    children: "Locked",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
        e.jsx("footer", {
          className: "w-full border-t py-6 mt-12",
          children: e.jsxs("div", {
            className:
              "container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8",
            children: [
              e.jsxs("div", {
                className: "text-center text-slate-600 md:text-left",
                children: [
                  "© ",
                  new Date().getFullYear(),
                  " APU Vote Chain. All rights reserved.",
                ],
              }),
              e.jsxs("div", {
                className: "flex gap-6",
                children: [
                  e.jsx("button", {
                    onClick: () => t("terms"),
                    className: "text-sm text-slate-600 hover:text-slate-900",
                    children: "Terms",
                  }),
                  e.jsx("button", {
                    onClick: () => t("privacy"),
                    className: "text-sm text-slate-600 hover:text-slate-900",
                    children: "Privacy",
                  }),
                  e.jsx("button", {
                    onClick: () => t("contact"),
                    className: "text-sm text-slate-600 hover:text-slate-900",
                    children: "Contact",
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    })
  );
}
function cx({ ...t }) {
  return e.jsx(io, { "data-slot": "dialog", ...t });
}
function dx({ ...t }) {
  return e.jsx(no, { "data-slot": "dialog-portal", ...t });
}
const ii = d.forwardRef(({ className: t, ...s }, a) =>
  e.jsx(er, {
    ref: a,
    "data-slot": "dialog-overlay",
    className: O(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
      t
    ),
    ...s,
  })
);
ii.displayName = er.displayName;
const oi = d.forwardRef(({ className: t, children: s, ...a }, r) =>
  e.jsxs(dx, {
    "data-slot": "dialog-portal",
    children: [
      e.jsx(ii, {}),
      e.jsxs(tr, {
        ref: r,
        "data-slot": "dialog-content",
        className: O(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          t
        ),
        ...a,
        children: [
          s,
          e.jsxs(ro, {
            className:
              "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            children: [
              e.jsx(jc, {}),
              e.jsx("span", { className: "sr-only", children: "Close" }),
            ],
          }),
        ],
      }),
    ],
  })
);
oi.displayName = tr.displayName;
function mx({ className: t, ...s }) {
  return e.jsx("div", {
    "data-slot": "dialog-header",
    className: O("flex flex-col gap-2 text-center sm:text-left", t),
    ...s,
  });
}
function ux({ className: t, ...s }) {
  return e.jsx("div", {
    "data-slot": "dialog-footer",
    className: O("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", t),
    ...s,
  });
}
const li = d.forwardRef(({ className: t, ...s }, a) =>
  e.jsx(sr, {
    ref: a,
    "data-slot": "dialog-title",
    className: O("text-lg leading-none font-semibold", t),
    ...s,
  })
);
li.displayName = sr.displayName;
const ci = d.forwardRef(({ className: t, ...s }, a) =>
  e.jsx(ar, {
    ref: a,
    "data-slot": "dialog-description",
    className: O("text-muted-foreground text-sm", t),
    ...s,
  })
);
ci.displayName = ar.displayName;
const xx = "/apu-logo.png";
function hx({ onNavigate: t }) {
  const [s, a] = d.useState([]),
    [r, n] = d.useState(!0),
    [o, c] = d.useState(!1),
    [l, m] = d.useState(null),
    [u, p] = d.useState({ category_name: "", description: "", max_votes: 1 });
  d.useEffect(() => {
    i();
  }, []);
  const i = async () => {
      try {
        n(!0);
        const y = [...((await Nu()).categories || [])].sort((E, R) => {
          const F = E.created_at ? new Date(E.created_at).getTime() : 0,
            f = R.created_at ? new Date(R.created_at).getTime() : 0;
          return F !== f
            ? F - f
            : (E.category_name || "").localeCompare(R.category_name || "");
        });
        a(y);
      } catch (v) {
        console.error(v),
          M.error(v?.message || "Failed to load categories"),
          a([]);
      } finally {
        n(!1);
      }
    },
    x = (v) => {
      m(v),
        p({
          category_name: v.category_name || "",
          description: v.description || "",
          max_votes: v.max_votes ?? 1,
        }),
        c(!0);
    },
    j = async (v) => {
      if ((v.preventDefault(), !l)) return;
      const T = u.category_name.trim();
      if (!T) {
        M.error("Category name is required.");
        return;
      }
      try {
        await Va(l.id, {
          name: T,
          description: u.description || "",
          maxVotes: u.max_votes,
          isActive: l.is_active,
        }),
          M.success("Category updated (DB)"),
          c(!1),
          m(null),
          await i();
      } catch (y) {
        console.error("Save error:", y),
          M.error(y?.reason || y?.message || "Failed to update category");
      }
    },
    g = async (v) => {
      const T = !v.is_active;
      try {
        await Va(v.id, {
          name: v.category_name,
          description: v.description || "",
          maxVotes: v.max_votes,
          isActive: T,
        }),
          a((y) => y.map((E) => (E.id === v.id ? { ...E, is_active: T } : E))),
          M.success(`Category ${T ? "activated" : "deactivated"} (DB)`);
      } catch (y) {
        console.error("Toggle error:", y),
          M.error(y?.reason || y?.message || "Failed to update status"),
          i();
      }
    };
  return e.jsx(zn, {
    requireAdmin: !0,
    onNavigate: t,
    children: e.jsxs("div", {
      className: "min-h-screen bg-slate-50 flex flex-col",
      children: [
        e.jsx("header", {
          className: "bg-white border-b sticky top-0 z-50",
          children: e.jsxs("div", {
            className:
              "container mx-auto px-6 h-16 flex items-center justify-between",
            children: [
              e.jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  e.jsx("img", {
                    src: xx,
                    alt: "APU Logo",
                    className: "h-8 w-8",
                  }),
                  e.jsx("span", {
                    className: "text-slate-900 font-bold text-xl",
                    children: "Admin Dashboard",
                  }),
                ],
              }),
              e.jsx(Ce, { onNavigate: t }),
            ],
          }),
        }),
        e.jsxs("main", {
          className: "flex-1 container mx-auto px-6 py-8",
          children: [
            e.jsx("div", {
              className: "flex items-center gap-2 mb-6",
              children: e.jsxs(b, {
                variant: "ghost",
                size: "sm",
                onClick: () => t("admin"),
                children: [
                  e.jsx(ge, { className: "h-4 w-4 mr-1" }),
                  "Back to Dashboard",
                ],
              }),
            }),
            e.jsx("div", {
              className:
                "flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4",
              children: e.jsxs("div", {
                children: [
                  e.jsx("h1", {
                    className: "text-3xl font-bold text-slate-900",
                    children: "Manage Voting Categories",
                  }),
                  e.jsx("p", {
                    className: "text-slate-600 mt-1",
                    children:
                      "Dynamic categories from DB (UUID id + slug). Toggle active status and edit details.",
                  }),
                ],
              }),
            }),
            e.jsxs(N, {
              children: [
                e.jsxs(A, {
                  children: [
                    e.jsx(P, { children: "Categories" }),
                    e.jsx(Q, {
                      children:
                        "These categories are tied to the active election in DB.",
                    }),
                  ],
                }),
                e.jsx(w, {
                  children: r
                    ? e.jsxs("div", {
                        className: "text-center py-12",
                        children: [
                          e.jsx("div", {
                            className:
                              "animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4",
                          }),
                          e.jsx("p", {
                            className: "text-slate-500",
                            children: "Loading categories...",
                          }),
                        ],
                      })
                    : s.length === 0
                    ? e.jsx("div", {
                        className: "text-center py-12 text-slate-500",
                        children:
                          "No categories found for the active election.",
                      })
                    : e.jsx("div", {
                        className: "overflow-x-auto",
                        children: e.jsxs(Rs, {
                          children: [
                            e.jsx(_s, {
                              children: e.jsxs(ft, {
                                children: [
                                  e.jsx(ye, { children: "Status" }),
                                  e.jsx(ye, { children: "Slug" }),
                                  e.jsx(ye, { children: "Name" }),
                                  e.jsx(ye, { children: "Description" }),
                                  e.jsx(ye, { children: "Max Votes" }),
                                  e.jsx(ye, {
                                    className: "text-right",
                                    children: "Actions",
                                  }),
                                ],
                              }),
                            }),
                            e.jsx(Is, {
                              children: s.map((v) =>
                                e.jsxs(
                                  ft,
                                  {
                                    children: [
                                      e.jsx(be, {
                                        children: e.jsx(Le, {
                                          checked: v.is_active,
                                          onCheckedChange: () => g(v),
                                        }),
                                      }),
                                      e.jsx(be, {
                                        className: "font-mono text-slate-700",
                                        children: v.slug,
                                      }),
                                      e.jsx(be, {
                                        className: "font-medium text-slate-900",
                                        children: v.category_name,
                                      }),
                                      e.jsx(be, {
                                        className:
                                          "text-slate-600 max-w-xs truncate",
                                        children:
                                          v.description ||
                                          e.jsx("span", {
                                            className: "text-slate-400",
                                            children: "—",
                                          }),
                                      }),
                                      e.jsx(be, {
                                        children: e.jsx(je, {
                                          variant: "secondary",
                                          children: v.max_votes,
                                        }),
                                      }),
                                      e.jsx(be, {
                                        className: "text-right",
                                        children: e.jsx(b, {
                                          variant: "ghost",
                                          size: "icon",
                                          onClick: () => x(v),
                                          children: e.jsx(Jl, {
                                            className: "h-4 w-4 text-slate-500",
                                          }),
                                        }),
                                      }),
                                    ],
                                  },
                                  v.id
                                )
                              ),
                            }),
                          ],
                        }),
                      }),
                }),
              ],
            }),
          ],
        }),
        e.jsx(cx, {
          open: o,
          onOpenChange: c,
          children: e.jsxs(oi, {
            className: "sm:max-w-[500px]",
            children: [
              e.jsxs(mx, {
                children: [
                  e.jsx(li, { children: "Edit Category" }),
                  e.jsx(ci, {
                    children: "Editing category details in DB (UUID-based).",
                  }),
                ],
              }),
              e.jsxs("form", {
                onSubmit: j,
                className: "space-y-4 py-4",
                children: [
                  e.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      e.jsx(V, { children: "Slug" }),
                      e.jsx(J, { value: l?.slug || "", disabled: !0 }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      e.jsx(V, { htmlFor: "name", children: "Category Name" }),
                      e.jsx(J, {
                        id: "name",
                        value: u.category_name,
                        onChange: (v) =>
                          p({ ...u, category_name: v.target.value }),
                        required: !0,
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      e.jsx(V, {
                        htmlFor: "description",
                        children: "Description",
                      }),
                      e.jsx(Un, {
                        id: "description",
                        value: u.description,
                        onChange: (v) =>
                          p({ ...u, description: v.target.value }),
                        rows: 3,
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      e.jsx(V, {
                        htmlFor: "maxVotes",
                        children: "Max Votes per Voter",
                      }),
                      e.jsx(J, {
                        id: "maxVotes",
                        type: "number",
                        min: 1,
                        max: 10,
                        value: u.max_votes,
                        onChange: (v) =>
                          p({ ...u, max_votes: parseInt(v.target.value) || 1 }),
                        required: !0,
                      }),
                    ],
                  }),
                  e.jsxs(ux, {
                    children: [
                      e.jsx(b, {
                        type: "button",
                        variant: "outline",
                        onClick: () => c(!1),
                        children: "Cancel",
                      }),
                      e.jsx(b, {
                        type: "submit",
                        className: "bg-blue-600 hover:bg-blue-700",
                        children: "Save Changes",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    }),
  });
}
function Ds({ delayDuration: t = 0, ...s }) {
  return e.jsx(oo, { "data-slot": "tooltip-provider", delayDuration: t, ...s });
}
function Ga({ ...t }) {
  return e.jsx(Ds, { children: e.jsx(lo, { "data-slot": "tooltip", ...t }) });
}
function qa({ ...t }) {
  return e.jsx(co, { "data-slot": "tooltip-trigger", ...t });
}
function Wa({ className: t, sideOffset: s = 0, children: a, ...r }) {
  return e.jsx(mo, {
    children: e.jsxs(uo, {
      "data-slot": "tooltip-content",
      sideOffset: s,
      className: O(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        t
      ),
      ...r,
      children: [
        a,
        e.jsx(xo, {
          className:
            "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]",
        }),
      ],
    }),
  });
}
const px = "/apu-logo.png";
function fx({ onNavigate: t }) {
  const [s, a] = d.useState({
      showResultsDuringVoting: !1,
      visitorLimit: null,
    }),
    [r, n] = d.useState(""),
    [o, c] = d.useState("");
  d.useEffect(() => {
    l();
  }, []);
  const l = () => {
      const x = localStorage.getItem("systemSettings");
      if (x) {
        const j = JSON.parse(x);
        a(j), n(j.visitorLimit?.toString() || "");
      }
    },
    m = (x) => {
      localStorage.setItem("systemSettings", JSON.stringify(x)), a(x);
    },
    u = (x) => {
      const j = { ...s, showResultsDuringVoting: x };
      m(j), M.success("Changes saved successfully.");
    },
    p = (x) => {
      n(x), c("");
    },
    i = () => {
      if (r === "") {
        const g = { ...s, visitorLimit: null };
        m(g), M.success("Settings updated.");
        return;
      }
      const x = parseInt(r);
      if (isNaN(x) || x < 1) {
        c("Value must be a positive number.");
        return;
      }
      const j = { ...s, visitorLimit: x };
      m(j), M.success("Settings updated.");
    };
  return e.jsxs("div", {
    className: "min-h-screen bg-slate-50",
    children: [
      e.jsx("header", {
        className: "bg-white border-b sticky top-0 z-50",
        children: e.jsxs("div", {
          className:
            "container mx-auto px-6 py-4 flex items-center justify-between",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("img", {
                  src: px,
                  alt: "APU Logo",
                  className: "h-10 w-10",
                }),
                e.jsx("h2", {
                  className: "text-slate-900",
                  children: "APU VOTE",
                }),
              ],
            }),
            e.jsx(je, {
              className: "bg-indigo-100 text-indigo-700 border-indigo-200",
              children: "Administrator",
            }),
          ],
        }),
      }),
      e.jsx("div", {
        className: "container mx-auto py-12 px-6",
        children: e.jsxs("div", {
          className: "max-w-4xl mx-auto",
          children: [
            e.jsx("div", {
              className: "mb-6",
              children: e.jsxs(b, {
                variant: "ghost",
                size: "sm",
                className: "gap-1",
                onClick: () => t("admin"),
                children: [
                  e.jsx(ge, { className: "h-4 w-4" }),
                  "Back to Dashboard",
                ],
              }),
            }),
            e.jsxs("div", {
              className: "mb-8",
              children: [
                e.jsx("h1", {
                  className: "text-slate-900 mb-2",
                  children: "System Settings",
                }),
                e.jsx("p", {
                  className: "text-slate-600",
                  children:
                    "Configure voting behavior and system access controls",
                }),
              ],
            }),
            e.jsxs("div", {
              className: "space-y-6",
              children: [
                e.jsxs(N, {
                  children: [
                    e.jsxs(A, {
                      children: [
                        e.jsx(P, { children: "Voting Behavior Settings" }),
                        e.jsx(Q, {
                          children:
                            "Control how results are displayed to voters",
                        }),
                      ],
                    }),
                    e.jsxs(w, {
                      className: "space-y-6",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between",
                          children: [
                            e.jsxs("div", {
                              className: "space-y-1 flex-1",
                              children: [
                                e.jsxs("div", {
                                  className: "flex items-center gap-2",
                                  children: [
                                    e.jsx(V, {
                                      htmlFor: "show-results",
                                      children: "Show Results During Voting",
                                    }),
                                    e.jsx(Ds, {
                                      children: e.jsxs(Ga, {
                                        children: [
                                          e.jsx(qa, {
                                            asChild: !0,
                                            children: e.jsx(us, {
                                              className:
                                                "h-4 w-4 text-slate-400 cursor-help",
                                            }),
                                          }),
                                          e.jsx(Wa, {
                                            className: "max-w-xs",
                                            children: e.jsx("p", {
                                              children:
                                                "If enabled, voters can see real-time results. If disabled, results remain hidden until the voting ends.",
                                            }),
                                          }),
                                        ],
                                      }),
                                    }),
                                  ],
                                }),
                                e.jsx("p", {
                                  className: "text-sm text-slate-600",
                                  children: s.showResultsDuringVoting
                                    ? "Live results visible to voters."
                                    : "Results hidden until election ends.",
                                }),
                              ],
                            }),
                            e.jsx(Le, {
                              id: "show-results",
                              checked: s.showResultsDuringVoting,
                              onCheckedChange: u,
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className:
                            "bg-blue-50 p-4 rounded-lg flex items-start gap-3",
                          children: [
                            e.jsx(us, {
                              className: "h-5 w-5 text-blue-600 mt-0.5",
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("p", {
                                  className: "text-sm text-blue-900",
                                  children:
                                    "Changes to this setting will apply immediately.",
                                }),
                                e.jsx("p", {
                                  className: "text-sm text-blue-700 mt-1",
                                  children:
                                    "This setting is blockchain-bound and affects the smart contract behavior.",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                e.jsxs(N, {
                  children: [
                    e.jsxs(A, {
                      children: [
                        e.jsx(P, { children: "Website Traffic Limit" }),
                        e.jsx(Q, {
                          children:
                            "Control the maximum number of simultaneously allowed visitors",
                        }),
                      ],
                    }),
                    e.jsxs(w, {
                      className: "space-y-6",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-4",
                          children: [
                            e.jsxs("div", {
                              className: "space-y-2",
                              children: [
                                e.jsxs("div", {
                                  className: "flex items-center gap-2",
                                  children: [
                                    e.jsx(V, {
                                      htmlFor: "visitor-limit",
                                      children:
                                        "Maximum Active Visitors Allowed",
                                    }),
                                    e.jsx(Ds, {
                                      children: e.jsxs(Ga, {
                                        children: [
                                          e.jsx(qa, {
                                            asChild: !0,
                                            children: e.jsx(us, {
                                              className:
                                                "h-4 w-4 text-slate-400 cursor-help",
                                            }),
                                          }),
                                          e.jsx(Wa, {
                                            className: "max-w-xs",
                                            children: e.jsx("p", {
                                              children:
                                                "This helps prevent overload during peak activity.",
                                            }),
                                          }),
                                        ],
                                      }),
                                    }),
                                  ],
                                }),
                                e.jsx(J, {
                                  id: "visitor-limit",
                                  type: "number",
                                  min: "1",
                                  value: r,
                                  onChange: (x) => p(x.target.value),
                                  placeholder:
                                    "Enter max visitors (e.g., 3) or leave blank for unlimited.",
                                }),
                                o &&
                                  e.jsx("p", {
                                    className: "text-sm text-red-600",
                                    children: o,
                                  }),
                                e.jsx("p", {
                                  className: "text-sm text-slate-600",
                                  children:
                                    "Limit how many users can access the system simultaneously. Extra users will see a capacity message.",
                                }),
                              ],
                            }),
                            e.jsx(b, {
                              onClick: i,
                              className: "bg-blue-600 hover:bg-blue-700",
                              children: "Save Visitor Limit",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "bg-slate-100 p-4 rounded-lg",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-2 mb-1",
                              children: [
                                e.jsx(Ne, {
                                  className: "h-4 w-4 text-slate-600",
                                }),
                                e.jsx("p", {
                                  className: "text-sm text-slate-900",
                                  children: "Current Status",
                                }),
                              ],
                            }),
                            e.jsx("p", {
                              className: "text-sm text-slate-600 ml-6",
                              children: s.visitorLimit
                                ? `Current limit: ${s.visitorLimit} visitor${
                                    s.visitorLimit > 1 ? "s" : ""
                                  }`
                                : "Unlimited access enabled",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
const gx = "/apu-logo.png";
function vx({ onNavigate: t }) {
  const s = Be(),
    [a, r] = d.useState("active");
  return e.jsxs("div", {
    className:
      "flex min-h-screen flex-col bg-gradient-to-b from-teal-50/30 to-white",
    children: [
      e.jsx("header", {
        className: "border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex h-16 items-center px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-2 w-48",
              children: [
                e.jsx("img", {
                  src: gx,
                  alt: "APU Logo",
                  className: "h-8 w-8",
                }),
                e.jsx("span", {
                  className: "text-slate-900",
                  children: "APU VOTE",
                }),
              ],
            }),
            e.jsxs("nav", {
              className: "hidden md:flex gap-6 flex-1 justify-center",
              children: [
                e.jsx("button", {
                  onClick: () => t("home"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "Home",
                }),
                e.jsx("button", {
                  onClick: () => t("elections"),
                  className: "text-sm text-primary",
                  children: "Elections",
                }),
                e.jsx("button", {
                  onClick: () => t("results"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "Results",
                }),
                e.jsx("button", {
                  onClick: () => t("about"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "About",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className: "text-sm transition-colors hover:text-primary",
                  children: "Contact",
                }),
              ],
            }),
            e.jsx("div", {
              className: "flex items-center gap-3 w-48 justify-end",
              children: s
                ? e.jsx(Ce, { onNavigate: t })
                : e.jsxs(e.Fragment, {
                    children: [
                      e.jsx(b, {
                        variant: "ghost",
                        onClick: () => t("register"),
                        className: "text-slate-900",
                        children: "Register",
                      }),
                      e.jsx(b, {
                        onClick: () => t("login"),
                        className: "bg-slate-900 hover:bg-slate-800 text-white",
                        children: "Sign In",
                      }),
                    ],
                  }),
            }),
          ],
        }),
      }),
      e.jsx("main", {
        className: "flex-1 container mx-auto max-w-7xl px-6 md:px-8 py-8",
        children: e.jsxs("div", {
          className: "flex flex-col space-y-8",
          children: [
            e.jsxs("div", {
              className: "flex flex-col space-y-2",
              children: [
                e.jsx("h1", {
                  className: "text-3xl font-bold text-slate-900",
                  children: "Elections",
                }),
                e.jsx("p", {
                  className: "text-slate-600",
                  children: "View active, upcoming, and past elections.",
                }),
              ],
            }),
            e.jsxs("div", {
              className: "flex space-x-2 border-b border-slate-200",
              children: [
                e.jsx("button", {
                  className: `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    a === "active"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`,
                  onClick: () => r("active"),
                  children: "Active",
                }),
                e.jsx("button", {
                  className: `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    a === "upcoming"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`,
                  onClick: () => r("upcoming"),
                  children: "Upcoming",
                }),
                e.jsx("button", {
                  className: `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    a === "past"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`,
                  onClick: () => r("past"),
                  children: "Past",
                }),
              ],
            }),
            e.jsxs("div", {
              className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
              children: [
                a === "active" &&
                  e.jsxs(N, {
                    children: [
                      e.jsxs(A, {
                        children: [
                          e.jsxs("div", {
                            className: "flex justify-between items-start",
                            children: [
                              e.jsx(P, {
                                children: "Student Council Election 2024",
                              }),
                              e.jsx(je, {
                                className: "bg-emerald-500",
                                children: "Active",
                              }),
                            ],
                          }),
                          e.jsx(Q, {
                            children:
                              "Cast your vote for the next student council representatives.",
                          }),
                        ],
                      }),
                      e.jsx(w, {
                        children: e.jsx(b, {
                          className:
                            "w-full bg-slate-900 hover:bg-slate-800 text-white",
                          onClick: () => t("vote"),
                          children: "Vote Now",
                        }),
                      }),
                    ],
                  }),
                a === "upcoming" &&
                  e.jsx("div", {
                    className: "col-span-full text-center py-12 text-slate-500",
                    children: "No upcoming elections scheduled.",
                  }),
                a === "past" &&
                  e.jsxs(N, {
                    className: "opacity-75",
                    children: [
                      e.jsxs(A, {
                        children: [
                          e.jsxs("div", {
                            className: "flex justify-between items-start",
                            children: [
                              e.jsx(P, {
                                children: "Club President Election 2023",
                              }),
                              e.jsx(je, {
                                variant: "secondary",
                                children: "Ended",
                              }),
                            ],
                          }),
                          e.jsx(Q, {
                            children:
                              "Election for Computer Science Club President.",
                          }),
                        ],
                      }),
                      e.jsx(w, {
                        children: e.jsx(b, {
                          variant: "outline",
                          className: "w-full",
                          onClick: () => t("results"),
                          children: "View Results",
                        }),
                      }),
                    ],
                  }),
              ],
            }),
          ],
        }),
      }),
      e.jsx("footer", {
        className: "w-full border-t py-6 bg-white mt-auto",
        children: e.jsxs("div", {
          className:
            "container mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row px-6 md:px-8",
          children: [
            e.jsxs("div", {
              className: "text-center text-sm text-slate-600 md:text-left",
              children: [
                "© ",
                new Date().getFullYear(),
                " APU Vote Chain. All rights reserved.",
              ],
            }),
            e.jsxs("div", {
              className: "flex gap-6",
              children: [
                e.jsx("button", {
                  onClick: () => t("terms"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Terms",
                }),
                e.jsx("button", {
                  onClick: () => t("privacy"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Privacy",
                }),
                e.jsx("button", {
                  onClick: () => t("contact"),
                  className: "text-sm text-slate-600 hover:text-slate-900",
                  children: "Contact",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
function jx() {
  const [t, s] = d.useState("home"),
    a = (r) => {
      s(r);
    };
  return e.jsxs(e.Fragment, {
    children: [
      t === "home" && e.jsx(qm, { onNavigate: a }),
      t === "admin" && e.jsx(du, { onNavigate: a }),
      t === "results" && e.jsx(pu, { onNavigate: a }),
      t === "new-results" && e.jsx(Vu, { onNavigate: a }),
      t === "about" && e.jsx(mu, { onNavigate: a }),
      t === "manage-categories" && e.jsx(hx, { onNavigate: a }),
      t === "register" && e.jsx(iu, { onNavigate: a }),
      t === "voter-registration" && e.jsx(wu, { onNavigate: a }),
      t === "verify-eligibility" && e.jsx(Lu, { onNavigate: a }),
      t === "vote" && e.jsx(ax, { onNavigate: a }),
      t === "contact" && e.jsx(xu, { onNavigate: a }),
      t === "login" && e.jsx(tu, { onNavigate: a }),
      t === "privacy" && e.jsx(zu, { onNavigate: a }),
      t === "terms" && e.jsx($u, { onNavigate: a }),
      t === "settings" && e.jsx(nx, { onNavigate: a }),
      t === "system-settings" && e.jsx(fx, { onNavigate: a }),
      t === "forgot-password" && e.jsx(ix, { onNavigate: a }),
      t === "elections" && e.jsx(vx, { onNavigate: a }),
      t === "voter" && e.jsx(lx, { onNavigate: a }),
      e.jsx(Bm, { richColors: !0, position: "top-right" }),
    ],
  });
}
vo.createRoot(document.getElementById("root")).render(e.jsx(jx, {}));
