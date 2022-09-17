import "./style.css";
import { defineComponent as Y, ref as r, onMounted as F, watch as G, onUpdated as A, createVNode as o, Fragment as K } from "vue";
const U = Y({
  props: {
    initImgList: {
      type: Array,
      default: []
    },
    imgDistance: {
      type: Number,
      default: 0
    },
    imgWidth: {
      type: Number,
      default: 0
    },
    imgHeigth: {
      type: Number,
      default: 0
    },
    isCustomImg: {
      type: Boolean,
      default: !1
    },
    vacancyStyle: {
      type: Object,
      default: {
        backgroundColor: "#4169E1",
        opacity: "0.2"
      }
    },
    onChange: {
      type: Function,
      default: null
    },
    isGetSortImgs: {
      type: Boolean,
      default: !0
    }
  },
  setup(t) {
    const d = r(t.initImgList), s = r(void 0), g = r(-1), x = r(0), $ = r(0), u = r(-1);
    let D = 0, C = 0, M = "0", w = "0", v = 0, b = r(0), S = !1, y = !1, L = null, T = !1;
    F(() => {
      var i;
      v = Math.floor((((i = s.value) == null ? void 0 : i.clientWidth) || 0) / (t.imgWidth + t.imgDistance));
    }), G(() => [t.initImgList, t.isGetSortImgs], ([i, m], [e, n]) => {
      i.valueOf.length !== e.valueOf.length && (d.value = i), !n && m && t.onChange && t.onChange(W(d.value));
    });
    const H = (i) => {
      g.value !== -1 && k(i);
    }, N = (i, m) => {
      var l, f, I;
      S = !0, D = ((l = s == null ? void 0 : s.value) == null ? void 0 : l.offsetTop) || 0, C = ((f = s == null ? void 0 : s.value) == null ? void 0 : f.offsetLeft) || 0;
      const e = i.pageX - C, n = i.pageY - D;
      M = String(e / (t.imgWidth + t.imgDistance)).split(".")[1], w = String(n / (t.imgHeigth + t.imgDistance)).split(".")[1];
      const a = i.path, c = a.length;
      for (let h = 0; h < c; h++)
        if (typeof a[h].className == "string" && ((I = a[h].className) == null ? void 0 : I.indexOf("imgBox"))) {
          k(i);
          break;
        }
      L = setTimeout(() => {
        y || (y = !0);
      }, 150), g.value = m;
    }, O = (i, m) => {
      if (S = !1, y = !1, L && (clearTimeout(L), L = null), !T)
        T = !0;
      else
        return;
      b.value = 0.3;
      const e = u.value, n = d.value;
      let a = [];
      if (g.value > e) {
        const f = n.slice(0, e), I = n.slice(e + 1, g.value), h = n.slice(g.value + 1, n.length);
        a = f.concat(n[g.value]).concat(n[e]).concat(I).concat(h);
      } else if (g.value < e) {
        const f = n.slice(0, g.value), I = n.slice(g.value + 1, e - 1), h = n.slice(e, n.length);
        a = f.concat(I).concat(n[e - 1]).concat(n[g.value]).concat(h);
      }
      let c = Math.floor(e / v), l = e - c * v;
      g.value > e ? l += 1 : l || (l = v, c -= 1), g.value === e && (g.value % v === 0 ? (c += 1, l -= 2) : l += 1), x.value = c * (t.imgHeigth + t.imgDistance), $.value = (l - 1) * (t.imgWidth + t.imgDistance), setTimeout(() => {
        u.value = -1, e !== g.value && a.length && (d.value = a), b.value = 0, g.value = -1, t.onChange && t.isGetSortImgs && t.onChange(W(a));
      }, 300);
    }, W = (i) => {
      const m = t.initImgList, e = m.length;
      return i.map((a, c) => {
        for (let l = 0; l < e; l++)
          if (a.imgKey === m[l].imgKey)
            return m[l];
      });
    };
    A(() => {
      T = !1;
    });
    const k = (i) => {
      if (!S)
        return;
      const m = i.pageX - C, e = i.pageY - D, n = m - Number(`0.${M}`) * (t.imgWidth + t.imgDistance) + 5, a = e - Number(`0.${w}`) * (t.imgHeigth + t.imgDistance) + 5;
      x.value = a, $.value = n;
      const c = Math.round(n / (t.imgWidth + t.imgDistance + t.imgDistance)), l = Math.round(a / (t.imgHeigth + t.imgDistance + t.imgDistance)), f = v * l;
      y && g.value - f < c ? u.value = v * l + c + 1 : u.value = v * l + c;
    }, X = (i) => i.content ? i.content() : null;
    return () => {
      const i = d.value.length;
      return o("div", {
        class: "imgDragSort-root",
        onMousemove: H,
        ref: s
      }, [d.value.map((m, e) => {
        let n = {
          transition: "0.3s"
        };
        const a = u.value === e;
        return g.value === e && (n = {
          position: "absolute",
          top: `${x.value}px`,
          left: `${$.value}px`,
          transition: `${b.value}s`,
          zIndex: 1
        }), o(K, null, [o("div", {
          key: e + "copy",
          style: {
            width: a ? `${t.imgWidth}px` : "0px",
            height: `${t.imgHeigth}px`,
            marginLeft: a ? `${t.imgDistance}px` : "0px",
            marginTop: `${t.imgDistance}px`
          }
        }, [o("div", {
          style: {
            width: a ? `${t.imgWidth}px` : "0px",
            height: `${t.imgHeigth}px`,
            transition: y && a ? "0.5s" : "0s",
            backgroundColor: t.vacancyStyle.backgroundColor,
            opacity: t.vacancyStyle.opacity
          }
        }, null)]), o("div", {
          class: "sort-img-box",
          key: e,
          onMousedown: (c) => N(c, e),
          onMouseup: (c) => O(),
          style: {
            width: `${t.imgWidth}px`,
            height: `${t.imgHeigth}px`,
            marginLeft: `${t.imgDistance}px`,
            marginTop: `${t.imgDistance}px`,
            ...n
          }
        }, [t.isCustomImg ? o(X, {
          content: m.customImg || null
        }, null) : o("img", {
          class: "content-img",
          src: m.imgUrl
        }, null)]), e + 1 === i && o("div", {
          key: e + 1 + "copy",
          style: {
            width: u.value === e + 1 ? `${t.imgWidth}px` : "0px",
            height: `${t.imgHeigth}px`,
            marginLeft: u.value === e + 1 ? `${t.imgDistance}px` : "0px",
            marginTop: `${t.imgDistance}px`
          }
        }, [o("div", {
          style: {
            width: u.value === e + 1 ? `${t.imgWidth - t.imgDistance}px` : "0px",
            height: `${t.imgHeigth}px`,
            transition: y && u.value === e + 1 ? "0.5s" : "0s",
            backgroundColor: t.vacancyStyle.backgroundColor,
            opacity: t.vacancyStyle.opacity
          }
        }, null)])]);
      })]);
    };
  }
});
export {
  U as default
};
