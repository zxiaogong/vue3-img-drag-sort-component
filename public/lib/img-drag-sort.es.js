import "./style.css";
import { defineComponent as Y, ref as d, onMounted as F, watch as G, onUpdated as A, createVNode as u, Fragment as K } from "vue";
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
    const s = d(t.initImgList), v = d(void 0), g = d(-1), $ = d(0), x = d(0), o = d(-1);
    let C = 0, D = 0, M = "0", w = "0", f = 0, b = d(0), S = !1, y = !1, L = null, T = !1;
    F(() => {
      var i;
      f = Math.floor((((i = v.value) == null ? void 0 : i.clientWidth) || 0) / (230 + 10));
    }), G(() => [t.initImgList, t.isGetSortImgs], ([i, m], [e, n]) => {
      i.valueOf.length !== e.valueOf.length && (s.value = i), !n && m && t.onChange && t.onChange(W(s.value));
    });
    const H = (i) => {
      g.value !== -1 && k(i);
    }, N = (i, m) => {
      var a, h, I;
      S = !0, C = ((a = v == null ? void 0 : v.value) == null ? void 0 : a.offsetTop) || 0, D = ((h = v == null ? void 0 : v.value) == null ? void 0 : h.offsetLeft) || 0;
      const e = i.pageX - D, n = i.pageY - C;
      M = String(e / (t.imgWidth + t.imgDistance)).split(".")[1], w = String(n / (t.imgHeigth + t.imgDistance)).split(".")[1];
      const l = i.path, c = l.length;
      for (let r = 0; r < c; r++)
        if (typeof l[r].className == "string" && ((I = l[r].className) == null ? void 0 : I.indexOf("imgBox"))) {
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
      const e = o.value, n = s.value;
      let l = [];
      if (g.value > e) {
        const h = n.slice(0, e), I = n.slice(e + 1, g.value), r = n.slice(g.value + 1, n.length);
        l = h.concat(n[g.value]).concat(n[e]).concat(I).concat(r);
      } else if (g.value < e) {
        const h = n.slice(0, g.value), I = n.slice(g.value + 1, e - 1), r = n.slice(e, n.length);
        l = h.concat(I).concat(n[e - 1]).concat(n[g.value]).concat(r);
      }
      let c = Math.floor(e / f), a = e - c * f;
      g.value > e ? a += 1 : a || (a = f, c -= 1), g.value === e && (g.value % f === 0 ? (c += 1, a -= 2) : a += 1), $.value = c * (t.imgHeigth + t.imgDistance), x.value = (a - 1) * (t.imgWidth + t.imgDistance), setTimeout(() => {
        o.value = -1, e !== g.value && l.length && (s.value = l), b.value = 0, g.value = -1, t.onChange && t.isGetSortImgs && t.onChange(W(l));
      }, 300);
    }, W = (i) => {
      const m = t.initImgList, e = m.length;
      return i.map((l, c) => {
        for (let a = 0; a < e; a++)
          if (l.imgKey === m[a].imgKey)
            return m[a];
      });
    };
    A(() => {
      T = !1;
    });
    const k = (i) => {
      if (!S)
        return;
      const m = i.pageX - D, e = i.pageY - C, n = m - Number(`0.${M}`) * (t.imgWidth + t.imgDistance) + 5, l = e - Number(`0.${w}`) * (t.imgHeigth + t.imgDistance) + 5;
      $.value = l, x.value = n;
      const c = Math.round(n / (t.imgWidth + t.imgDistance + t.imgDistance)), a = Math.round(l / (t.imgHeigth + t.imgDistance + t.imgDistance)), h = f * a;
      y && g.value - h < c ? o.value = f * a + c + 1 : o.value = f * a + c;
    }, X = (i) => i.content ? u(i.content, null, null) : null;
    return () => {
      const i = s.value.length;
      return u("div", {
        class: "imgDragSort-root",
        onMousemove: H,
        ref: v
      }, [s.value.map((m, e) => {
        let n = {
          transition: "0.3s"
        };
        const l = o.value === e;
        return g.value === e && (n = {
          position: "absolute",
          top: `${$.value}px`,
          left: `${x.value}px`,
          transition: `${b.value}s`,
          zIndex: 1
        }), u(K, null, [u("div", {
          key: e + "copy",
          style: {
            width: l ? `${t.imgWidth}px` : "0px",
            height: `${t.imgHeigth}px`,
            marginLeft: l ? `${t.imgDistance}px` : "0px",
            marginTop: `${t.imgDistance}px`
          }
        }, [u("div", {
          style: {
            width: l ? `${t.imgWidth}px` : "0px",
            height: `${t.imgHeigth}px`,
            transition: y && l ? "0.5s" : "0s",
            backgroundColor: t.vacancyStyle.backgroundColor,
            opacity: t.vacancyStyle.opacity
          }
        }, null)]), u("div", {
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
        }, [t.isCustomImg ? u(X, {
          content: s.value[e].customImg || null
        }, null) : u("img", {
          class: "content-img",
          src: s.value[e].imgUrl
        }, null)]), e + 1 === i && u("div", {
          key: e + 1 + "copy",
          style: {
            width: o.value === e + 1 ? `${t.imgWidth}px` : "0px",
            height: `${t.imgHeigth}px`,
            marginLeft: o.value === e + 1 ? `${t.imgDistance}px` : "0px",
            marginTop: `${t.imgDistance}px`
          }
        }, [u("div", {
          style: {
            width: o.value === e + 1 ? `${t.imgWidth - t.imgDistance}px` : "0px",
            height: `${t.imgHeigth}px`,
            transition: y && o.value === e + 1 ? "0.5s" : "0s",
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
