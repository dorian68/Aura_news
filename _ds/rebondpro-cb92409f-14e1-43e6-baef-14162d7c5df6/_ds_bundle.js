/* @ds-bundle: {"format":3,"namespace":"RebondPro_cb9240","components":[],"sourceHashes":{"app/charts.jsx":"9b7ed7221ccb","app/components.jsx":"84b623ff84e5","app/data.jsx":"0aebaf5307cd","app/icons.jsx":"f014d620b9de","app/page_apprenants.jsx":"e7c93702455b","app/page_assistant.jsx":"8656b9e532c8","app/page_dashboard.jsx":"6a827432350f","app/page_documents.jsx":"f7bb2b25d947","app/page_formateurs.jsx":"cbf8b7598c06","app/page_formations.jsx":"c1c92b8a7bb9","app/page_planning.jsx":"3d0451a3b628","app/page_prospects.jsx":"0539e7af19b7","app/page_qualite.jsx":"ad1396174454","app/page_sessions.jsx":"24c6f3d29d5a","assets/image-slot.js":"9309434cb09c","export/blog-lebonrebond/assets/image-slot.js":"9309434cb09c","export/lebonrebond-complet/app/charts.jsx":"9b7ed7221ccb","export/lebonrebond-complet/app/components.jsx":"84b623ff84e5","export/lebonrebond-complet/app/data.jsx":"0aebaf5307cd","export/lebonrebond-complet/app/icons.jsx":"f014d620b9de","export/lebonrebond-complet/app/page_apprenants.jsx":"e7c93702455b","export/lebonrebond-complet/app/page_assistant.jsx":"8656b9e532c8","export/lebonrebond-complet/app/page_dashboard.jsx":"6a827432350f","export/lebonrebond-complet/app/page_documents.jsx":"f7bb2b25d947","export/lebonrebond-complet/app/page_formateurs.jsx":"cbf8b7598c06","export/lebonrebond-complet/app/page_formations.jsx":"c1c92b8a7bb9","export/lebonrebond-complet/app/page_planning.jsx":"3d0451a3b628","export/lebonrebond-complet/app/page_prospects.jsx":"0539e7af19b7","export/lebonrebond-complet/app/page_qualite.jsx":"ad1396174454","export/lebonrebond-complet/app/page_sessions.jsx":"24c6f3d29d5a","export/lebonrebond-complet/assets/image-slot.js":"9309434cb09c","export/lebonrebond-site/assets/image-slot.js":"9309434cb09c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RebondPro_cb9240 = window.RebondPro_cb9240 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// app/charts.jsx
try { (() => {
// ============================================================
// Charts — lightweight inline SVG (no library)
// ============================================================
const {
  useState: useStateC
} = React;

// Area / line chart for CA évolution
function AreaChart({
  data,
  height = 200,
  accent = "#2469a6"
}) {
  const [hover, setHover] = useStateC(null);
  const w = 560,
    h = height,
    padL = 8,
    padR = 8,
    padT = 18,
    padB = 26;
  const max = Math.max(...data.map(d => d.v)) * 1.12;
  const min = 0;
  const iw = w - padL - padR,
    ih = h - padT - padB;
  const x = i => padL + i / (data.length - 1) * iw;
  const y = v => padT + ih - (v - min) / (max - min) * ih;
  const pts = data.map((d, i) => [x(i), y(d.v)]);
  const linePath = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0] + " " + p[1]).join(" ");
  // smooth
  const smooth = (() => {
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1],
        [x1, y1] = pts[i];
      const cx = (x0 + x1) / 2;
      d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
    }
    return d;
  })();
  const area = smooth + ` L ${x(data.length - 1)} ${padT + ih} L ${x(0)} ${padT + ih} Z`;
  const projStart = data.findIndex(d => d.proj);
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    width: "100%",
    style: {
      display: "block",
      overflow: "visible"
    },
    onMouseLeave: () => setHover(null)
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "caGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: accent,
    stopOpacity: "0.20"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: accent,
    stopOpacity: "0"
  }))), [0, 0.25, 0.5, 0.75, 1].map((g, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: padL,
    x2: w - padR,
    y1: padT + ih * g,
    y2: padT + ih * g,
    stroke: "#eef0f3",
    strokeWidth: "1"
  })), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: "url(#caGrad)"
  }), /*#__PURE__*/React.createElement("path", {
    d: smooth,
    fill: "none",
    stroke: accent,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeDasharray: projStart > 0 ? undefined : undefined
  }), data.map((d, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("rect", {
    x: x(i) - iw / data.length / 2,
    y: padT,
    width: iw / data.length,
    height: ih,
    fill: "transparent",
    onMouseEnter: () => setHover(i)
  }), d.proj && /*#__PURE__*/React.createElement("circle", {
    cx: x(i),
    cy: y(d.v),
    r: "3.5",
    fill: "#fff",
    stroke: accent,
    strokeWidth: "2",
    strokeDasharray: "2 2"
  }), !d.proj && /*#__PURE__*/React.createElement("circle", {
    cx: x(i),
    cy: y(d.v),
    r: hover === i ? 5 : 3.5,
    fill: accent,
    stroke: "#fff",
    strokeWidth: "2",
    style: {
      transition: "r .1s"
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: x(i),
    y: h - 6,
    textAnchor: "middle",
    fontSize: "11",
    fontWeight: "600",
    fill: "#919aa8"
  }, d.m))), hover != null && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: x(hover),
    x2: x(hover),
    y1: padT,
    y2: padT + ih,
    stroke: accent,
    strokeWidth: "1",
    strokeDasharray: "3 3",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${Math.min(Math.max(x(hover), 38), w - 38)}, ${y(data[hover].v) - 14})`
  }, /*#__PURE__*/React.createElement("rect", {
    x: "-34",
    y: "-22",
    width: "68",
    height: "22",
    rx: "6",
    fill: "#15181f"
  }), /*#__PURE__*/React.createElement("text", {
    x: "0",
    y: "-7",
    textAnchor: "middle",
    fontSize: "11.5",
    fontWeight: "700",
    fill: "#fff"
  }, data[hover].v.toFixed(1).replace(".", ","), " k\u20AC"))));
}

// Horizontal bar chart — remplissage par formation
function BarRows({
  data,
  accentKey = "color"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, data.map(d => {
    const tone = d.remplissage >= 70 ? "var(--positive)" : d.remplissage < 40 ? "var(--danger)" : "var(--warn)";
    return /*#__PURE__*/React.createElement("div", {
      key: d.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "spread",
      style: {
        marginBottom: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: "var(--ink)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 3,
        background: d[accentKey],
        flex: "none"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, d.title)), /*#__PURE__*/React.createElement("span", {
      className: "tnum",
      style: {
        fontWeight: 700,
        fontSize: 13,
        color: tone,
        flex: "none",
        marginLeft: 10
      }
    }, d.remplissage, "%")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 9,
        borderRadius: 99,
        background: "var(--border-2)",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: d.remplissage + "%",
        borderRadius: 99,
        background: tone,
        transition: "width .6s cubic-bezier(.4,0,.2,1)"
      }
    })));
  }));
}

// Donut gauge
function Donut({
  value,
  size = 132,
  stroke = 14,
  color = "var(--primary)",
  label,
  sub
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - value / 100 * c;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: "rotate(-90deg)"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--border-2)",
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeDasharray: c,
    strokeDashoffset: off,
    strokeLinecap: "round",
    style: {
      transition: "stroke-dashoffset .7s cubic-bezier(.4,0,.2,1)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontSize: size * 0.26,
      fontWeight: 800,
      letterSpacing: "-0.03em"
    }
  }, label ?? value + "%"), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--ink-3)",
      fontWeight: 600,
      marginTop: 2
    }
  }, sub)));
}

// Mini sparkline
function Spark({
  data,
  color = "#2469a6",
  w = 80,
  h = 30
}) {
  const max = Math.max(...data),
    min = Math.min(...data);
  const pts = data.map((v, i) => [i / (data.length - 1) * w, h - (v - min) / (max - min || 1) * (h - 4) - 2]);
  const d = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h,
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
Object.assign(window, {
  AreaChart,
  BarRows,
  Donut,
  Spark
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/charts.jsx", error: String((e && e.message) || e) }); }

// app/components.jsx
try { (() => {
// ============================================================
// Shared chrome + primitives: Sidebar, Topbar, KpiCard, charts,
// Modal, Drawer, badges, helpers
// ============================================================
const {
  useState,
  useEffect,
  useRef
} = React;
const NAV = [{
  id: "dashboard",
  label: "Dashboard",
  icon: "dashboard"
}, {
  id: "formations",
  label: "Formations",
  icon: "book"
}, {
  id: "sessions",
  label: "Sessions",
  icon: "calendar"
}, {
  id: "planning",
  label: "Planning",
  icon: "calendar-range"
}, {
  id: "prospects",
  label: "Prospects",
  icon: "target",
  badge: 7
}, {
  id: "apprenants",
  label: "Apprenants",
  icon: "grad"
}, {
  id: "documents",
  label: "Documents",
  icon: "file-text",
  badge: 5
}, {
  id: "qualite",
  label: "Qualité",
  icon: "shield"
}, {
  id: "formateurs",
  label: "Formateurs",
  icon: "presentation"
}, {
  id: "assistant",
  label: "Assistant IA",
  icon: "sparkles"
}];
function Logo({
  size = 34,
  light = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 10,
      flex: "none",
      background: light ? "#fff" : "linear-gradient(140deg,#2f9488,#2469a6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: light ? "none" : "0 4px 12px rgba(36,105,166,.35)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size * 0.6,
    height: size * 0.6,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: light ? "#2469a6" : "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 17l5-5 4 3 7-8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 4h4v4"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 15.5,
      letterSpacing: "-0.025em",
      color: light ? "#fff" : "var(--ink)",
      whiteSpace: "nowrap"
    }
  }, "Le Bon Rebond"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: light ? "rgba(255,255,255,.6)" : "var(--ink-3)",
      marginTop: 2
    }
  }, "Formation")));
}
function Sidebar({
  view,
  setView
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: "var(--sidebar-w)",
      flex: "none",
      height: "100vh",
      position: "sticky",
      top: 0,
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "var(--topbar-h)",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement(Logo, null)), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "14px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--ink-4)",
      padding: "6px 12px 8px"
    }
  }, "Pilotage"), NAV.map(n => {
    const active = view === n.id;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => setView(n.id),
      style: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "9px 12px",
        borderRadius: 10,
        marginBottom: 2,
        background: active ? "var(--primary-50)" : "transparent",
        color: active ? "var(--primary-700)" : "var(--ink-2)",
        fontWeight: active ? 700 : 600,
        fontSize: 13.5,
        position: "relative",
        transition: "background .14s, color .14s"
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.background = "var(--surface-3)";
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.background = "transparent";
      }
    }, active && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        top: 8,
        bottom: 8,
        width: 3,
        borderRadius: 99,
        background: "var(--primary)"
      }
    }), /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: 18,
      stroke: active ? 2.2 : 2
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        textAlign: "left"
      }
    }, n.label), n.badge && /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 19,
        height: 19,
        padding: "0 5px",
        borderRadius: 99,
        background: active ? "var(--primary)" : "var(--surface-3)",
        color: active ? "#fff" : "var(--ink-3)",
        fontSize: 11,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, n.badge));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderTop: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("parametres"),
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "9px 12px",
      borderRadius: 10,
      color: view === "parametres" ? "var(--primary-700)" : "var(--ink-2)",
      background: view === "parametres" ? "var(--primary-50)" : "transparent",
      fontWeight: 600,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 18
  }), " Param\xE8tres"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 10px 4px",
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "avatar",
    style: {
      width: 34,
      height: 34,
      background: "linear-gradient(140deg,#2f9488,#2469a6)"
    }
  }, CENTER.user.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 12.5,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, CENTER.user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--ink-3)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, CENTER.name)), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--ink-3)"
    },
    title: "D\xE9connexion"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "logout",
    size: 16
  })))));
}
function Topbar({
  title,
  onNewSession
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: "var(--topbar-h)",
      position: "sticky",
      top: 0,
      zIndex: 20,
      background: "rgba(255,255,255,.82)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "0 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16.5,
      fontWeight: 800,
      letterSpacing: "-0.02em"
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 440,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 17,
    style: {
      position: "absolute",
      left: 13,
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--ink-4)"
    }
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Rechercher une formation, session, prospect\u2026",
    style: {
      paddingLeft: 38,
      paddingRight: 56,
      height: 40,
      background: "var(--surface-3)",
      border: "1px solid transparent"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 10,
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("kbd", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "var(--ink-3)",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 5,
      padding: "2px 5px",
      fontFamily: "var(--font)"
    }
  }, "\u2318K"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setNotifOpen(o => !o),
    className: "btn-secondary btn-icon",
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 7,
      right: 7,
      width: 7,
      height: 7,
      borderRadius: 99,
      background: "var(--danger)",
      border: "2px solid #fff"
    }
  })), notifOpen && /*#__PURE__*/React.createElement(NotifPanel, {
    onClose: () => setNotifOpen(false)
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onNewSession
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 17
  }), " Nouvelle session")));
}
function NotifPanel({
  onClose
}) {
  useEffect(() => {
    const h = () => onClose();
    const t = setTimeout(() => document.addEventListener("click", h), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", h);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: "absolute",
      right: 0,
      top: 48,
      width: 360,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 14,
      boxShadow: "var(--shadow-pop)",
      zIndex: 50,
      overflow: "hidden"
    },
    className: "fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      padding: "14px 16px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 14
    }
  }, "Notifications"), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-danger"
  }, "3 nouvelles")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 340,
      overflowY: "auto"
    }
  }, ALERTS.slice(0, 4).map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: "flex",
      gap: 11,
      padding: "13px 16px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement(AlertGlyph, {
    type: a.type,
    icon: a.icon,
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, a.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-2)",
      marginTop: 2,
      lineHeight: 1.4
    }
  }, a.text))))), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    style: {
      width: "100%",
      padding: "11px",
      fontSize: 13,
      fontWeight: 700,
      color: "var(--primary)",
      borderTop: "1px solid var(--border-2)"
    }
  }, "Tout marquer comme lu"));
}
function AlertGlyph({
  type,
  icon,
  size = 36
}) {
  const map = {
    danger: ["var(--danger-bg)", "var(--danger)"],
    warn: ["var(--warn-bg)", "var(--warn-strong)"],
    primary: ["var(--primary-50)", "var(--primary)"],
    positive: ["var(--positive-bg)", "var(--positive-600)"]
  };
  const [bg, fg] = map[type] || map.primary;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 9,
      background: bg,
      color: fg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: size * 0.5
  }));
}

// ---------- Page header ----------
function PageHeader({
  title,
  subtitle,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 22,
      gap: 16,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 23,
      fontWeight: 800
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--ink-2)",
      marginTop: 5,
      fontSize: 14
    }
  }, subtitle)), children && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, children));
}

// ---------- Status badge for sessions ----------
function SessionBadge({
  statut
}) {
  const map = {
    ouverte: ["badge-positive", "Ouverte"],
    complete: ["badge-primary", "Complète"],
    risque: ["badge-danger", "À risque"],
    terminee: ["badge-neutral", "Terminée"]
  };
  const [cls, label] = map[statut] || map.ouverte;
  return /*#__PURE__*/React.createElement("span", {
    className: "badge " + cls
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), label);
}

// ---------- Fill bar with % ----------
function FillBar({
  value,
  seuil,
  width = 110
}) {
  const tone = value >= 70 ? "positive" : value < 40 ? "danger" : "warn";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress " + tone,
    style: {
      width,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: value + "%"
    }
  }), seuil != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: `${seuil}%`,
      top: -2,
      bottom: -2,
      width: 2,
      background: "var(--ink)",
      opacity: .35,
      borderRadius: 2
    },
    title: "Seuil " + seuil + "%"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontWeight: 700,
      fontSize: 13,
      color: tone === "danger" ? "var(--danger-strong)" : tone === "positive" ? "var(--positive-600)" : "var(--warn-strong)",
      minWidth: 34
    }
  }, value, "%"));
}

// ---------- Modal ----------
function Modal({
  open,
  onClose,
  title,
  children,
  width = 540,
  footer
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      background: "rgba(20,24,35,.42)",
      backdropFilter: "blur(3px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    },
    className: "fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "fade-up",
    style: {
      width,
      maxWidth: "100%",
      maxHeight: "90vh",
      background: "var(--surface)",
      borderRadius: 18,
      boxShadow: "var(--shadow-pop)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      padding: "18px 22px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 17
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "btn-ghost btn-icon",
    style: {
      color: "var(--ink-3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22,
      overflowY: "auto"
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 22px",
      borderTop: "1px solid var(--border-2)",
      display: "flex",
      justifyContent: "flex-end",
      gap: 10,
      background: "var(--surface-2)"
    }
  }, footer)));
}

// ---------- Drawer (right) ----------
function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 480,
  footer,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      pointerEvents: open ? "auto" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(20,24,35,.42)",
      backdropFilter: "blur(3px)",
      opacity: open ? 1 : 0,
      transition: "opacity .28s"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width,
      maxWidth: "100%",
      background: "var(--surface)",
      boxShadow: "var(--shadow-pop)",
      display: "flex",
      flexDirection: "column",
      transform: open ? "none" : "translateX(100%)",
      transition: "transform .3s cubic-bezier(.4,0,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 22px",
      borderBottom: "1px solid var(--border-2)",
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      background: accent ? "var(--primary-tint)" : "transparent"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 17
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--ink-2)",
      fontSize: 13,
      marginTop: 3
    }
  }, subtitle)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "btn-ghost btn-icon",
    style: {
      color: "var(--ink-3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 22
    }
  }, open && children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 22px",
      borderTop: "1px solid var(--border-2)",
      display: "flex",
      gap: 10,
      background: "var(--surface-2)"
    }
  }, footer)));
}

// ---------- Empty state ----------
function EmptyState({
  icon = "search",
  title,
  text,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "56px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 14,
      background: "var(--surface-3)",
      color: "var(--ink-3)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15
    }
  }, title), text && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--ink-2)",
      fontSize: 13.5,
      marginTop: 5,
      maxWidth: 320,
      margin: "5px auto 0"
    }
  }, text), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, action));
}
Object.assign(window, {
  NAV,
  Logo,
  Sidebar,
  Topbar,
  AlertGlyph,
  PageHeader,
  SessionBadge,
  FillBar,
  Modal,
  Drawer,
  EmptyState,
  NotifPanel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/components.jsx", error: String((e && e.message) || e) }); }

// app/data.jsx
try { (() => {
// ============================================================
// Le Bon Rebond Formation — fictional data
// Académie Horizon Formation
// ============================================================

const CENTER = {
  name: "Académie Horizon Formation",
  short: "AHF",
  desc: "Centre de formation spécialisé en bureautique, IA, finance d'entreprise et compétences digitales pour PME.",
  user: {
    name: "Camille Rivière",
    role: "Responsable pédagogique",
    initials: "CR"
  }
};
const FORMATIONS = [{
  id: "excel",
  title: "Excel Avancé pour PME",
  cat: "Bureautique",
  duree: "2 jours",
  heures: 14,
  prix: 690,
  modalite: "Présentiel",
  remplissage: 42,
  sessions: 3,
  formateur: "Claire Martin",
  color: "#2f7fc4"
}, {
  id: "powerbi",
  title: "Power BI — Construire un tableau de bord",
  cat: "Data & BI",
  duree: "3 jours",
  heures: 21,
  prix: 990,
  modalite: "Hybride",
  remplissage: 75,
  sessions: 4,
  formateur: "Claire Martin",
  color: "#2469a6"
}, {
  id: "ia",
  title: "Initiation à l'IA pour fonctions administratives",
  cat: "Intelligence artificielle",
  duree: "1 jour",
  heures: 7,
  prix: 390,
  modalite: "Distanciel",
  remplissage: 28,
  sessions: 2,
  formateur: "Julien Moreau",
  color: "#129a93"
}, {
  id: "finance",
  title: "Finance d'entreprise pour dirigeants",
  cat: "Finance & Gestion",
  duree: "2 jours",
  heures: 14,
  prix: 850,
  modalite: "Présentiel",
  remplissage: 64,
  sessions: 2,
  formateur: "Sarah Benali",
  color: "#d9821f"
}];
const FORMATEURS = [{
  id: "claire",
  name: "Claire Martin",
  initials: "CM",
  specialites: ["Excel", "Power BI"],
  color: "#2469a6",
  dispo: "Disponible",
  occupation: 72,
  sessions: 4,
  confirme: true,
  email: "claire.martin@horizon-formation.fr",
  tel: "06 12 34 56 78"
}, {
  id: "julien",
  name: "Julien Moreau",
  initials: "JM",
  specialites: ["IA", "Automatisation"],
  color: "#129a93",
  dispo: "Disponible",
  occupation: 48,
  sessions: 2,
  confirme: true,
  email: "julien.moreau@horizon-formation.fr",
  tel: "06 23 45 67 89"
}, {
  id: "sarah",
  name: "Sarah Benali",
  initials: "SB",
  specialites: ["Finance", "Gestion"],
  color: "#d9821f",
  dispo: "Partielle",
  occupation: 55,
  sessions: 2,
  confirme: true,
  email: "sarah.benali@horizon-formation.fr",
  tel: "06 34 56 78 90"
}, {
  id: "thomas",
  name: "Thomas Girard",
  initials: "TG",
  specialites: ["Digital", "No-code"],
  color: "#2f7fc4",
  dispo: "À confirmer",
  occupation: 30,
  sessions: 1,
  confirme: false,
  email: "thomas.girard@horizon-formation.fr",
  tel: "06 45 67 89 01"
}];
const SESSIONS = [{
  id: "s1",
  formation: "Power BI — Tableau de bord",
  fid: "powerbi",
  date: "12–14 juin 2026",
  dateShort: "12 juin",
  formateur: "Claire Martin",
  fInit: "CM",
  fColor: "#2469a6",
  capacite: 12,
  inscrits: 9,
  seuil: 6,
  statut: "ouverte"
}, {
  id: "s2",
  formation: "Excel Avancé pour PME",
  fid: "excel",
  date: "16–17 juin 2026",
  dateShort: "16 juin",
  formateur: "Non confirmé",
  fInit: "?",
  fColor: "#b6bdc8",
  capacite: 12,
  inscrits: 5,
  seuil: 6,
  statut: "risque"
}, {
  id: "s3",
  formation: "Initiation à l'IA — fonctions admin.",
  fid: "ia",
  date: "21 juin 2026",
  dateShort: "21 juin",
  formateur: "Julien Moreau",
  fInit: "JM",
  fColor: "#129a93",
  capacite: 14,
  inscrits: 4,
  seuil: 10,
  statut: "risque"
}, {
  id: "s4",
  formation: "Finance d'entreprise — dirigeants",
  fid: "finance",
  date: "24–25 juin 2026",
  dateShort: "24 juin",
  formateur: "Sarah Benali",
  fInit: "SB",
  fColor: "#d9821f",
  capacite: 10,
  inscrits: 8,
  seuil: 5,
  statut: "ouverte"
}, {
  id: "s5",
  formation: "Power BI — Tableau de bord",
  fid: "powerbi",
  date: "30 juin – 2 juil. 2026",
  dateShort: "30 juin",
  formateur: "Claire Martin",
  fInit: "CM",
  fColor: "#2469a6",
  capacite: 12,
  inscrits: 12,
  seuil: 6,
  statut: "complete"
}, {
  id: "s6",
  formation: "Excel Avancé pour PME",
  fid: "excel",
  date: "5–6 mai 2026",
  dateShort: "5 mai",
  formateur: "Claire Martin",
  fInit: "CM",
  fColor: "#2469a6",
  capacite: 12,
  inscrits: 11,
  seuil: 6,
  statut: "terminee"
}, {
  id: "s7",
  formation: "Initiation à l'IA — fonctions admin.",
  fid: "ia",
  date: "9 juil. 2026",
  dateShort: "9 juil.",
  formateur: "Julien Moreau",
  fInit: "JM",
  fColor: "#129a93",
  capacite: 14,
  inscrits: 6,
  seuil: 10,
  statut: "ouverte"
}];
const PROSPECTS = [{
  id: "p1",
  name: "Cabinet Nova RH",
  contact: "Léa Fontaine",
  formation: "Initiation à l'IA",
  montant: 2730,
  action: "Envoyer programme détaillé",
  relance: "5 juin",
  col: "nouveau",
  chaud: true
}, {
  id: "p2",
  name: "Groupe Soleil PME",
  contact: "Marc Dubois",
  formation: "Power BI",
  montant: 5940,
  action: "Appeler le décideur",
  relance: "6 juin",
  col: "contacte",
  chaud: true
}, {
  id: "p3",
  name: "Marie Lambert",
  contact: "Marie Lambert",
  formation: "Excel Avancé",
  montant: 690,
  action: "Relancer par email",
  relance: "5 juin",
  col: "relance",
  chaud: false
}, {
  id: "p4",
  name: "BTP Caraïbes Services",
  contact: "Patrick Adèle",
  formation: "Finance d'entreprise",
  montant: 3400,
  action: "Envoyer devis",
  relance: "8 juin",
  col: "devis",
  chaud: true
}, {
  id: "p5",
  name: "Cabinet Delta Conseil",
  contact: "Sophie Reyes",
  formation: "Power BI",
  montant: 2970,
  action: "Relancer devis envoyé",
  relance: "9 juin",
  col: "relance",
  chaud: false
}, {
  id: "p6",
  name: "Atelier Méridien",
  contact: "Hugo Petit",
  formation: "Excel Avancé",
  montant: 1380,
  action: "Programmer session",
  relance: "—",
  col: "gagne",
  chaud: false
}, {
  id: "p7",
  name: "Studio Lagon Digital",
  contact: "Inès Roy",
  formation: "IA fonctions admin.",
  montant: 1560,
  action: "Confirmer dates",
  relance: "—",
  col: "gagne",
  chaud: false
}, {
  id: "p8",
  name: "Cabinet Vertige",
  contact: "Tom Mercier",
  formation: "Finance d'entreprise",
  montant: 1700,
  action: "—",
  relance: "—",
  col: "contacte",
  chaud: false
}, {
  id: "p9",
  name: "PME Horizon Bleu",
  contact: "Nadia Sloan",
  formation: "Power BI",
  montant: 990,
  action: "Budget non validé",
  relance: "—",
  col: "perdu",
  chaud: false
}, {
  id: "p10",
  name: "Cabinet Aurore",
  contact: "Éric Lemoine",
  formation: "Excel Avancé",
  montant: 690,
  action: "Premier contact",
  relance: "7 juin",
  col: "nouveau",
  chaud: false
}];
const CRM_COLS = [{
  id: "nouveau",
  label: "Nouveau",
  color: "#919aa8"
}, {
  id: "contacte",
  label: "Contacté",
  color: "#2f7fc4"
}, {
  id: "devis",
  label: "Devis envoyé",
  color: "#2469a6"
}, {
  id: "relance",
  label: "Relance",
  color: "#d9821f"
}, {
  id: "gagne",
  label: "Gagné",
  color: "#18996b"
}, {
  id: "perdu",
  label: "Perdu",
  color: "#dc5147"
}];
const APPRENANTS = [{
  id: "a1",
  name: "Antoine Berger",
  initials: "AB",
  entreprise: "Soleil PME",
  formation: "Power BI",
  session: "12 juin",
  statut: "Inscrit",
  presence: "—",
  doc: "Convocation",
  satisfaction: null
}, {
  id: "a2",
  name: "Fatou Camara",
  initials: "FC",
  entreprise: "Nova RH",
  formation: "IA fonctions admin.",
  session: "21 juin",
  statut: "Inscrit",
  presence: "—",
  doc: "À envoyer",
  satisfaction: null
}, {
  id: "a3",
  name: "Lucas Henry",
  initials: "LH",
  entreprise: "Delta Conseil",
  formation: "Power BI",
  session: "12 juin",
  statut: "Confirmé",
  presence: "—",
  doc: "Convocation",
  satisfaction: null
}, {
  id: "a4",
  name: "Émilie Roux",
  initials: "ER",
  entreprise: "Caraïbes Services",
  formation: "Finance d'entreprise",
  session: "24 juin",
  statut: "Confirmé",
  presence: "—",
  doc: "Convocation",
  satisfaction: null
}, {
  id: "a5",
  name: "Karim Saïdi",
  initials: "KS",
  entreprise: "Méridien",
  formation: "Excel Avancé",
  session: "5 mai",
  statut: "Terminé",
  presence: "Présent",
  doc: "Attestation",
  satisfaction: 5
}, {
  id: "a6",
  name: "Chloé Marchand",
  initials: "CM",
  entreprise: "Lagon Digital",
  formation: "Excel Avancé",
  session: "5 mai",
  statut: "Terminé",
  presence: "Présent",
  doc: "Attestation",
  satisfaction: 4
}, {
  id: "a7",
  name: "Yann Le Goff",
  initials: "YL",
  entreprise: "Vertige",
  formation: "Excel Avancé",
  session: "5 mai",
  statut: "Terminé",
  presence: "Absent",
  doc: "—",
  satisfaction: null
}, {
  id: "a8",
  name: "Sabrina Ndiaye",
  initials: "SN",
  entreprise: "Aurore",
  formation: "Power BI",
  session: "30 juin",
  statut: "Inscrit",
  presence: "—",
  doc: "À envoyer",
  satisfaction: null
}];
const ALERTS = [{
  id: "al1",
  type: "danger",
  icon: "alert-triangle",
  title: "Session IA du 21 juin en risque",
  text: "Remplie à 28 % — sous le seuil de rentabilité. Il manque 6 inscriptions.",
  action: "Générer relance"
}, {
  id: "al2",
  type: "warn",
  icon: "user-x",
  title: "Formateur non confirmé",
  text: "Aucun formateur confirmé pour la session Excel Avancé du 16 juin.",
  action: "Affecter un formateur"
}, {
  id: "al3",
  type: "warn",
  icon: "send",
  title: "7 prospects à relancer",
  text: "7 prospects Power BI / Excel attendent une relance cette semaine.",
  action: "Voir les prospects"
}, {
  id: "al4",
  type: "primary",
  icon: "file-text",
  title: "3 attestations à générer",
  text: "Session Excel Avancé du 5 mai — 3 attestations en attente.",
  action: "Générer les documents"
}, {
  id: "al5",
  type: "primary",
  icon: "clipboard",
  title: "2 questionnaires à envoyer",
  text: "Questionnaires de satisfaction non envoyés pour 2 sessions terminées.",
  action: "Envoyer"
}];

// CA prévisionnel evolution (k€) — months
const CA_SERIES = [{
  m: "Jan",
  v: 14.2
}, {
  m: "Fév",
  v: 16.8
}, {
  m: "Mar",
  v: 15.1
}, {
  m: "Avr",
  v: 19.4
}, {
  m: "Mai",
  v: 21.0
}, {
  m: "Juin",
  v: 24.85
}, {
  m: "Juil",
  v: 22.3,
  proj: true
}, {
  m: "Août",
  v: 18.0,
  proj: true
}];
const KPIS = [{
  id: "ca",
  label: "CA prévisionnel",
  value: "24 850 €",
  delta: "+18 %",
  deltaPos: true,
  sub: "vs. mai",
  icon: "trending-up"
}, {
  id: "sessions",
  label: "Sessions à venir",
  value: "12",
  delta: "+3",
  deltaPos: true,
  sub: "ce trimestre",
  icon: "calendar"
}, {
  id: "remplissage",
  label: "Taux de remplissage moyen",
  value: "58 %",
  delta: "−4 pts",
  deltaPos: false,
  sub: "objectif 70 %",
  icon: "gauge"
}, {
  id: "prospects",
  label: "Prospects actifs",
  value: "34",
  delta: "+9",
  deltaPos: true,
  sub: "pipeline",
  icon: "users"
}, {
  id: "relances",
  label: "Relances à faire",
  value: "7",
  delta: "cette semaine",
  deltaPos: null,
  sub: "",
  icon: "send",
  urgent: true
}, {
  id: "docs",
  label: "Documents à générer",
  value: "5",
  delta: "en attente",
  deltaPos: null,
  sub: "",
  icon: "file-text",
  urgent: true
}];
Object.assign(window, {
  CENTER,
  FORMATIONS,
  FORMATEURS,
  SESSIONS,
  PROSPECTS,
  CRM_COLS,
  APPRENANTS,
  ALERTS,
  CA_SERIES,
  KPIS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/data.jsx", error: String((e && e.message) || e) }); }

// app/icons.jsx
try { (() => {
// ============================================================
// Icons — Lucide-style outline paths (2px stroke, round caps)
// ============================================================
const ICON_PATHS = {
  "dashboard": '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  "book": '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  "calendar": '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  "calendar-range": '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M17 14h.01M7 14h.01M11 14h2"/>',
  "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  "grad": '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  "presentation": '<path d="M2 3h20M21 3v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3M7 21l5-4 5 4M12 17v-2"/>',
  "sparkles": '<path d="M9.94 14.34 12 22l2.06-7.66L21 12l-6.94-2.34L12 2l-2.06 7.66L3 12z"/><path d="M19 3v4M21 5h-4M5 18v2M6 19H4"/>',
  "settings": '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  "search": '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  "bell": '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  "plus": '<path d="M5 12h14M12 5v14"/>',
  "trending-up": '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  "gauge": '<path d="m12 14 4-4M3.34 19a10 10 0 1 1 17.32 0"/>',
  "send": '<path d="M14.54 8.46 2 13l8 3 3 8 4.54-12.54z" transform="translate(1 -1)"/><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  "alert-triangle": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><path d="M12 9v4M12 17h.01"/>',
  "user-x": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m17 8 5 5M22 8l-5 5"/>',
  "clipboard": '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  "chevron-left": '<path d="m15 18-6-6 6-6"/>',
  "x": '<path d="M18 6 6 18M6 6l12 12"/>',
  "check": '<path d="M20 6 9 17l-5-5"/>',
  "check-circle": '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  "arrow-up-right": '<path d="M7 7h10v10M7 17 17 7"/>',
  "arrow-right": '<path d="M5 12h14M12 5l7 7-7 7"/>',
  "more": '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  "download": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  "mail": '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
  "clock": '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  "map-pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  "filter": '<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>',
  "external": '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  "edit": '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
  "eye": '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  "star": '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  "phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  "zap": '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  "target": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  "list-checks": '<path d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8"/>',
  "message": '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>',
  "building": '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>',
  "euro": '<path d="M14 5.5a5 5 0 1 0 0 13M4 11h7M4 15h7"/>',
  "percent": '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  "layers": '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  "wand": '<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M15 9h0M17.8 6.2 19 5M3 21l9-9M12.2 6.2 11 5"/>',
  "refresh": '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5"/>',
  "play": '<polygon points="6 3 20 12 6 21 6 3"/>',
  "circle": '<circle cx="12" cy="12" r="10"/>',
  "logout": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  "menu": '<path d="M4 12h16M4 6h16M4 18h16"/>',
  "command": '<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>',
  "dot-grid": '<circle cx="5" cy="5" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="19" cy="5" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  "user": '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  "user-check": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
  "video": '<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  "globe": '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  "copy": '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  "smile": '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  "thumbs-up": '<path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88z"/>',
  "alert-circle": '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  "trophy": '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/>'
};
function Icon({
  name,
  size = 18,
  stroke = 2,
  fill = "none",
  className = "",
  style = {}
}) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: fill,
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: style,
    dangerouslySetInnerHTML: {
      __html: d
    }
  });
}
Object.assign(window, {
  Icon,
  ICON_PATHS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/icons.jsx", error: String((e && e.message) || e) }); }

// app/page_apprenants.jsx
try { (() => {
// ============================================================
// Apprenants — table with actions
// ============================================================
const {
  useState: useStateA
} = React;
function StatutChip({
  s
}) {
  const map = {
    "Inscrit": "badge-neutral",
    "Confirmé": "badge-sky",
    "Terminé": "badge-positive"
  };
  return /*#__PURE__*/React.createElement("span", {
    className: "badge " + (map[s] || "badge-neutral")
  }, s);
}
function PresenceChip({
  p
}) {
  if (p === "Présent") return /*#__PURE__*/React.createElement("span", {
    className: "badge badge-positive"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12
  }), "Pr\xE9sent");
  if (p === "Absent") return /*#__PURE__*/React.createElement("span", {
    className: "badge badge-danger"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 12
  }), "Absent");
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-4)"
    }
  }, "\u2014");
}
function Stars({
  n
}) {
  if (!n) return /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-4)"
    }
  }, "\u2014");
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap: 1,
      color: "var(--warn)"
    }
  }, [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(Icon, {
    key: i,
    name: "star",
    size: 13,
    fill: i <= n ? "var(--warn)" : "none",
    stroke: i <= n ? "var(--warn)" : "var(--ink-4)"
  })));
}
function ApprenantsPage() {
  const [sel, setSel] = useStateA([]);
  const toggle = id => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const all = sel.length === APPRENANTS.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Apprenants",
    subtitle: `${APPRENANTS.length} apprenants suivis · ${APPRENANTS.filter(a => a.statut !== "Terminé").length} sessions en cours`
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " Exporter"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Ajouter un apprenant")), sel.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: "10px 16px",
      marginBottom: 14,
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "var(--primary-tint)",
      borderColor: "var(--primary-100)"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 13
    }
  }, sel.length, " s\xE9lectionn\xE9", sel.length > 1 ? "s" : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginLeft: "auto",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 14
  }), " Convocation"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14
  }), " Marquer pr\xE9sent"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text",
    size: 14
  }), " Attestation"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clipboard",
    size: 14
  }), " Questionnaire"))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl",
    style: {
      minWidth: 940
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 38
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: all,
    onChange: () => setSel(all ? [] : APPRENANTS.map(a => a.id)),
    style: {
      accentColor: "var(--primary)",
      width: 15,
      height: 15
    }
  })), /*#__PURE__*/React.createElement("th", null, "Apprenant"), /*#__PURE__*/React.createElement("th", null, "Entreprise"), /*#__PURE__*/React.createElement("th", null, "Formation"), /*#__PURE__*/React.createElement("th", null, "Session"), /*#__PURE__*/React.createElement("th", null, "Statut"), /*#__PURE__*/React.createElement("th", null, "Pr\xE9sence"), /*#__PURE__*/React.createElement("th", null, "Satisfaction"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, APPRENANTS.map(a => /*#__PURE__*/React.createElement("tr", {
    key: a.id,
    style: {
      background: sel.includes(a.id) ? "var(--primary-tint)" : undefined
    }
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: sel.includes(a.id),
    onChange: () => toggle(a.id),
    style: {
      accentColor: "var(--primary)",
      width: 15,
      height: 15
    }
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 30,
      height: 30,
      fontSize: 11,
      background: "var(--primary)"
    }
  }, a.initials), /*#__PURE__*/React.createElement("strong", null, a.name))), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, a.entreprise), /*#__PURE__*/React.createElement("td", {
    style: {
      maxWidth: 160
    }
  }, a.formation), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, a.session), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatutChip, {
    s: a.statut
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(PresenceChip, {
    p: a.presence
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Stars, {
    n: a.satisfaction
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-icon",
    style: {
      width: 30,
      height: 30,
      color: "var(--ink-3)"
    },
    title: "Convocation"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 15
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-icon",
    style: {
      width: 30,
      height: 30,
      color: "var(--ink-3)"
    },
    title: "Attestation"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text",
    size: 15
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-icon",
    style: {
      width: 30,
      height: 30,
      color: "var(--ink-3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "more",
    size: 15
  })))))))))));
}
Object.assign(window, {
  ApprenantsPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/page_apprenants.jsx", error: String((e && e.message) || e) }); }

// app/page_assistant.jsx
try { (() => {
// ============================================================
// Assistant IA — action cards + conversation
// ============================================================
const {
  useState: useStateAI,
  useRef: useRefAI,
  useEffect: useEffectAI
} = React;
const AI_ACTIONS = [{
  id: "resume",
  icon: "list-checks",
  t: "Générer un résumé hebdomadaire",
  d: "Synthèse de votre activité et priorités"
}, {
  id: "risque",
  icon: "alert-triangle",
  t: "Identifier les sessions à risque",
  d: "Sous le seuil de rentabilité"
}, {
  id: "relance",
  icon: "send",
  t: "Rédiger une relance commerciale",
  d: "Email personnalisé pour un prospect"
}, {
  id: "desc",
  icon: "book",
  t: "Créer une description de formation",
  d: "Texte vendeur orienté PME"
}, {
  id: "quest",
  icon: "clipboard",
  t: "Générer un questionnaire satisfaction",
  d: "Évaluation à chaud prête à envoyer"
}, {
  id: "synth",
  icon: "message",
  t: "Synthétiser les retours apprenants",
  d: "Points forts et axes d'amélioration"
}, {
  id: "creneaux",
  icon: "calendar-range",
  t: "Proposer des créneaux optimaux",
  d: "Selon disponibilités et salles"
}];
const AI_REPLIES = {
  default: "Vous avez 3 priorités : remplir la session IA du 21 juin, relancer 7 prospects Power BI/Excel et confirmer le formateur de la session Excel Avancé. Je recommande de lancer une relance ciblée aujourd'hui.",
  risque: "2 sessions sont sous leur seuil de rentabilité : « Initiation à l'IA » du 21 juin (28 %, –6 inscrits) et « Excel Avancé » du 16 juin (42 %, formateur non confirmé). Je peux préparer une relance pour chacune.",
  resume: "Cette semaine : CA prévisionnel à 24 850 € (+18 %), 12 sessions à venir, remplissage moyen 58 %. Points d'attention : 2 sessions à risque, 7 relances et 1 formateur à confirmer. Bonne dynamique sur Power BI (75 %).",
  relance: "J'ai préparé une relance pour Groupe Soleil PME (Power BI, 5 940 €). Ton chaleureux, mise en avant d'une session imminente et proposition d'un échange de 15 min. Voulez-vous l'envoyer ou l'ajuster ?",
  creneaux: "Pour Excel Avancé (2 jours), les meilleurs créneaux sont : Mardi 18 juin matin (92 %), Jeudi 20 juin après-midi (88 %). Vendredi 21 est déconseillé (conflit de salle)."
};
function AssistantPage() {
  const [msgs, setMsgs] = useStateAI([{
    role: "user",
    text: "Quelles sont les actions prioritaires cette semaine ?"
  }, {
    role: "ai",
    text: AI_REPLIES.default,
    chips: ["Créer campagne de relance", "Voir sessions à risque", "Générer documents"]
  }]);
  const [typing, setTyping] = useStateAI(false);
  const [input, setInput] = useStateAI("");
  const scrollRef = useRefAI(null);
  useEffectAI(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);
  const send = (text, replyKey) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, {
      role: "user",
      text
    }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = AI_REPLIES[replyKey] || AI_REPLIES.default;
      const chips = replyKey === "risque" ? ["Générer 2 relances", "Optimiser le planning"] : ["Créer campagne de relance", "Voir sessions à risque", "Générer documents"];
      setMsgs(m => [...m, {
        role: "ai",
        text: reply,
        chips
      }]);
    }, 1100);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 380px",
      gap: 22,
      height: "calc(100vh - var(--topbar-h) - 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 22px",
      borderBottom: "1px solid var(--border-2)",
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "linear-gradient(120deg,#eef4fa,#fff)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 10,
      background: "linear-gradient(140deg,#2f9488,#2469a6)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(36,105,166,.3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 19
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 15
    }
  }, "Assistant Le Bon Rebond"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)"
    }
  }, "Orient\xE9 action \xB7 conna\xEEt votre activit\xE9")), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-primary"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), "En ligne")), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 22,
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, msgs.map((m, i) => m.role === "user" ? /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      alignSelf: "flex-end",
      maxWidth: "78%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--primary)",
      color: "#fff",
      padding: "11px 15px",
      borderRadius: "14px 14px 4px 14px",
      fontSize: 14,
      lineHeight: 1.5
    }
  }, m.text)) : /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      alignSelf: "flex-start",
      maxWidth: "82%",
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: "linear-gradient(140deg,#2f9488,#2469a6)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 15
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-3)",
      padding: "12px 15px",
      borderRadius: "14px 14px 14px 4px",
      fontSize: 14,
      lineHeight: 1.6
    }
  }, m.text), m.chips && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 10,
      flexWrap: "wrap"
    }
  }, m.chips.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => send(c, /risque/i.test(c) ? "risque" : /relance/i.test(c) ? "relance" : "default"),
    className: "badge badge-primary",
    style: {
      height: 30,
      padding: "0 12px",
      cursor: "pointer",
      fontWeight: 600
    }
  }, c)))))), typing && /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: "flex-start",
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: "linear-gradient(140deg,#2f9488,#2469a6)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-3)",
      padding: "14px 16px",
      borderRadius: 14,
      display: "flex",
      gap: 5
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 7,
      height: 7,
      borderRadius: 99,
      background: "var(--ink-4)",
      animation: `blink 1.2s ${i * 0.2}s infinite`
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") send(input);
    },
    placeholder: "Posez une question ou demandez une action\u2026",
    style: {
      paddingRight: 48,
      height: 46
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => send(input),
    className: "btn btn-ai btn-icon",
    style: {
      position: "absolute",
      right: 6,
      top: 6,
      width: 34,
      height: 34
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 16
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
      overflowY: "auto",
      paddingRight: 2
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5
    }
  }, "Actions rapides"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-3)",
      marginTop: 3
    }
  }, "L'IA ex\xE9cute ces t\xE2ches \xE0 partir de vos donn\xE9es.")), AI_ACTIONS.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.id,
    onClick: () => send(a.t, a.id),
    className: "card",
    style: {
      padding: 15,
      display: "flex",
      gap: 12,
      alignItems: "center",
      textAlign: "left",
      cursor: "pointer",
      transition: "transform .14s, box-shadow .14s, border-color .14s"
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "var(--shadow)";
      e.currentTarget.style.borderColor = "var(--primary-200)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      e.currentTarget.style.borderColor = "var(--border)";
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 10,
      background: "var(--primary-50)",
      color: "var(--primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, a.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      marginTop: 2
    }
  }, a.d)), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 16,
    style: {
      color: "var(--ink-4)"
    }
  })))));
}

// ============================================================
// Paramètres
// ============================================================
function ParametresPage() {
  const tabs = ["Centre", "Équipe", "Facturation", "Notifications"];
  const [tab, setTab] = useStateAI("Centre");
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Param\xE8tres",
    subtitle: "G\xE9rez les informations de votre centre et votre abonnement."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "200px 1fr",
      gap: 24,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setTab(t),
    style: {
      textAlign: "left",
      padding: "10px 14px",
      borderRadius: 10,
      fontSize: 13.5,
      fontWeight: tab === t ? 700 : 600,
      color: tab === t ? "var(--primary-700)" : "var(--ink-2)",
      background: tab === t ? "var(--primary-50)" : "transparent"
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      marginBottom: 18
    }
  }, "Informations du centre"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Nom du centre"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    defaultValue: CENTER.name
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Description"), /*#__PURE__*/React.createElement("textarea", {
    className: "input",
    rows: 3,
    defaultValue: CENTER.desc
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Site web"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    defaultValue: "academie-horizon.fr"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Email de contact"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    defaultValue: "contact@horizon-formation.fr"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      alignSelf: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Enregistrer")))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      background: "linear-gradient(120deg,#eef4fa,#fff)",
      borderColor: "var(--primary-100)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      borderRadius: 12,
      background: "linear-gradient(140deg,#2f9488,#2469a6)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 15
    }
  }, "Plan Pro \xB7 actif"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, "Prochaine facturation le 1\u1D49\u02B3 juillet 2026 \xB7 49 \u20AC/mois")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, "G\xE9rer l'abonnement")))));
}
Object.assign(window, {
  AssistantPage,
  ParametresPage,
  AI_ACTIONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/page_assistant.jsx", error: String((e && e.message) || e) }); }

// app/page_dashboard.jsx
try { (() => {
// ============================================================
// Dashboard — the showpiece
// ============================================================
const {
  useState: useStateD
} = React;
function KpiCard({
  k,
  onClick
}) {
  const deltaColor = k.deltaPos === true ? "var(--positive-600)" : k.deltaPos === false ? "var(--danger-strong)" : "var(--ink-3)";
  const deltaBg = k.deltaPos === true ? "var(--positive-bg)" : k.deltaPos === false ? "var(--danger-bg)" : "var(--surface-3)";
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    className: "card",
    style: {
      padding: "18px 20px",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      cursor: "pointer",
      transition: "transform .14s, box-shadow .14s, border-color .14s",
      position: "relative",
      borderColor: k.urgent ? "var(--warn-border)" : "var(--border)",
      background: k.urgent ? "linear-gradient(180deg,#fffdf8,#fff)" : "var(--surface)"
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--ink-2)"
    }
  }, k.label), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 9,
      background: k.urgent ? "var(--warn-bg)" : "var(--primary-50)",
      color: k.urgent ? "var(--warn-strong)" : "var(--primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: k.icon,
    size: 17
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontSize: 28,
      fontWeight: 800,
      letterSpacing: "-0.03em",
      lineHeight: 1,
      whiteSpace: "nowrap"
    }
  }, k.value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      fontWeight: 700,
      color: deltaColor,
      background: deltaBg,
      padding: "2px 7px",
      borderRadius: 99
    }
  }, k.delta, k.sub && k.deltaPos != null ? "" : "")), k.sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      marginTop: -4
    }
  }, k.sub));
}
function AICard({
  setView
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden",
      borderColor: "var(--primary-100)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 22px",
      display: "flex",
      alignItems: "center",
      gap: 11,
      background: "linear-gradient(120deg,#eef4fa,#eaf2f9)",
      borderBottom: "1px solid var(--primary-100)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      background: "linear-gradient(140deg,#2f9488,#2469a6)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(36,105,166,.3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14.5
    }
  }, "Assistant Le Bon Rebond"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--primary-700)",
      fontWeight: 600
    }
  }, "Analyse de votre semaine")), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-primary"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), "En ligne")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14.5,
      lineHeight: 1.6,
      color: "var(--ink)"
    }
  }, "Votre session ", /*#__PURE__*/React.createElement("strong", null, "\xAB Initiation \xE0 l'IA pour fonctions administratives \xBB"), " est remplie \xE0 ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--danger-strong)"
    }
  }, "28 %"), ". Il manque ", /*#__PURE__*/React.createElement("strong", null, "6 inscriptions"), " pour atteindre le seuil de rentabilit\xE9. Vous avez ", /*#__PURE__*/React.createElement("strong", null, "9 prospects"), " dans le CRM qui pourraient \xEAtre relanc\xE9s aujourd'hui."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 18,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ai btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wand",
    size: 15
  }), " G\xE9n\xE9rer relance"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => setView("prospects")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    size: 15
  }), " Voir prospects"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => setView("planning")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-range",
    size: 15
  }), " Optimiser planning"))));
}
function PrioritiesCard({
  setView
}) {
  const items = [{
    icon: "alert-triangle",
    tone: "danger",
    t: "Remplir la session IA du 21 juin",
    s: "28 % · 6 inscriptions manquantes",
    go: "sessions"
  }, {
    icon: "send",
    tone: "warn",
    t: "Relancer 7 prospects Power BI / Excel",
    s: "Échéance cette semaine",
    go: "prospects"
  }, {
    icon: "user-x",
    tone: "warn",
    t: "Confirmer le formateur Excel Avancé",
    s: "Session du 16 juin",
    go: "formateurs"
  }, {
    icon: "file-text",
    tone: "primary",
    t: "Générer 3 attestations",
    s: "Session Excel du 5 mai",
    go: "documents"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "list-checks",
    size: 18,
    style: {
      color: "var(--primary)"
    }
  }), " Priorit\xE9s de la semaine"), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-neutral"
  }, "4 actions")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setView(it.go),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "11px 10px",
      borderRadius: 11,
      textAlign: "left",
      transition: "background .12s"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--surface-3)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement(AlertGlyph, {
    type: it.tone,
    icon: it.icon,
    size: 34
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, it.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      marginTop: 1
    }
  }, it.s)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 17,
    style: {
      color: "var(--ink-4)"
    }
  })))));
}
function PipelineCard({
  setView
}) {
  const stages = CRM_COLS.filter(c => c.id !== "perdu");
  const counts = {};
  let total = 0;
  PROSPECTS.forEach(p => {
    if (p.col !== "perdu") {
      counts[p.col] = (counts[p.col] || 0) + p.montant;
      total += p.montant;
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5
    }
  }, "Pipeline commercial"), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: () => setView("prospects"),
    style: {
      color: "var(--primary)",
      fontWeight: 700
    }
  }, "Ouvrir le CRM ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-0.03em"
    }
  }, total.toLocaleString("fr-FR"), " \u20AC"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, "pipeline pond\xE9r\xE9 \xB7 ", PROSPECTS.filter(p => p.col !== "perdu" && p.col !== "gagne").length, " en cours")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: 12,
      borderRadius: 99,
      overflow: "hidden",
      gap: 2,
      marginBottom: 16
    }
  }, stages.map(s => {
    const v = counts[s.id] || 0;
    return v ? /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        width: v / total * 100 + "%",
        background: s.color
      },
      title: s.label
    }) : null;
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "9px 18px"
    }
  }, stages.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: "spread"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 3,
      background: s.color
    }
  }), s.label), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontWeight: 700,
      fontSize: 12.5
    }
  }, (counts[s.id] || 0).toLocaleString("fr-FR"), " \u20AC")))));
}
function DashboardPage({
  setView,
  onNewSession
}) {
  const remplMoyen = Math.round(FORMATIONS.reduce((a, f) => a + f.remplissage, 0) / FORMATIONS.length);
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Bonjour Camille 👋",
    subtitle: "Voici l'état de votre activité — semaine du 1ᵉʳ juin 2026."
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " Exporter"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onNewSession
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Nouvelle session")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(196px,1fr))",
      gap: 16
    }
  }, KPIS.map(k => /*#__PURE__*/React.createElement(KpiCard, {
    key: k.id,
    k: k,
    onClick: () => {
      const map = {
        ca: "sessions",
        sessions: "sessions",
        remplissage: "formations",
        prospects: "prospects",
        relances: "prospects",
        docs: "documents"
      };
      setView(map[k.id] || "dashboard");
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.55fr 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5
    }
  }, "CA pr\xE9visionnel"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-3)",
      marginTop: 2
    }
  }, "R\xE9alis\xE9 + projection sur 8 mois")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      fontSize: 11.5,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 3,
      borderRadius: 2,
      background: "var(--primary)"
    }
  }), " R\xE9alis\xE9"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 99,
      border: "2px dashed var(--primary)",
      boxSizing: "border-box"
    }
  }), " Projet\xE9"))), /*#__PURE__*/React.createElement(AreaChart, {
    data: CA_SERIES,
    height: 210
  })), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      marginBottom: 4
    }
  }, "Taux de remplissage par formation"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-3)",
      marginBottom: 20
    }
  }, "Moyenne ", remplMoyen, " % \xB7 objectif 70 %"), /*#__PURE__*/React.createElement(BarRows, {
    data: FORMATIONS
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.3fr 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(AICard, {
    setView: setView
  }), /*#__PURE__*/React.createElement(PrioritiesCard, {
    setView: setView
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(PipelineCard, {
    setView: setView
  }), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5
    }
  }, "Alertes & rappels"), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-danger"
  }, ALERTS.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, ALERTS.slice(0, 3).map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: "flex",
      gap: 12,
      padding: "12px 13px",
      borderRadius: 12,
      background: "var(--surface-2)",
      border: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement(AlertGlyph, {
    type: a.type,
    icon: a.icon,
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, a.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)",
      marginTop: 2,
      lineHeight: 1.45
    }
  }, a.text), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    style: {
      color: "var(--primary)",
      fontWeight: 700,
      padding: "4px 0",
      marginTop: 4,
      height: "auto"
    }
  }, a.action, " \u2192"))))))));
}
Object.assign(window, {
  DashboardPage,
  KpiCard,
  AICard,
  PrioritiesCard,
  PipelineCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/page_dashboard.jsx", error: String((e && e.message) || e) }); }

// app/page_documents.jsx
try { (() => {
// ============================================================
// Documents
// ============================================================
const DOC_TYPES = [{
  name: "Programme",
  icon: "book",
  desc: "Programme pédagogique détaillé"
}, {
  name: "Convention",
  icon: "file-text",
  desc: "Convention de formation"
}, {
  name: "Convocation",
  icon: "mail",
  desc: "Convocation des apprenants"
}, {
  name: "Feuille d'émargement",
  icon: "list-checks",
  desc: "Émargement par demi-journée"
}, {
  name: "Attestation",
  icon: "check-circle",
  desc: "Attestation de fin de formation"
}, {
  name: "Certificat de réalisation",
  icon: "shield",
  desc: "Certificat de réalisation"
}, {
  name: "Questionnaire satisfaction",
  icon: "smile",
  desc: "Évaluation à chaud"
}];
const DOC_QUEUE = [{
  doc: "Attestation",
  ctx: "Excel Avancé · 5 mai",
  who: "3 apprenants",
  urgent: true
}, {
  doc: "Questionnaire satisfaction",
  ctx: "Excel Avancé · 5 mai",
  who: "Session terminée",
  urgent: true
}, {
  doc: "Convocation",
  ctx: "Power BI · 12 juin",
  who: "9 apprenants",
  urgent: false
}, {
  doc: "Convention",
  ctx: "Finance dirigeants · 24 juin",
  who: "Caraïbes Services",
  urgent: false
}, {
  doc: "Feuille d'émargement",
  ctx: "IA fonctions admin. · 21 juin",
  who: "À préparer",
  urgent: false
}];
const DOC_DONE = [{
  doc: "Programme",
  ctx: "Power BI",
  date: "28 mai"
}, {
  doc: "Convention",
  ctx: "Power BI · 12 juin",
  date: "29 mai"
}, {
  doc: "Attestation",
  ctx: "Excel · 12 avril",
  date: "14 avril"
}, {
  doc: "Certificat de réalisation",
  ctx: "Finance · mars",
  date: "2 avril"
}];
function DocIcon({
  name,
  tone = "primary",
  size = 38
}) {
  const map = {
    primary: ["var(--primary-50)", "var(--primary)"],
    warn: ["var(--warn-bg)", "var(--warn-strong)"],
    positive: ["var(--positive-bg)", "var(--positive-600)"],
    neutral: ["var(--surface-3)", "var(--ink-3)"]
  };
  const [bg, fg] = map[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 9,
      background: bg,
      color: fg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: name,
    size: size * 0.5
  }));
}
function DocumentsPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Documents",
    subtitle: "G\xE9n\xE9rez et centralisez tous vos documents de formation."
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 16
  }), " Mod\xE8les"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " G\xE9n\xE9rer PDF")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 16,
      marginBottom: 20
    }
  }, [["À générer", DOC_QUEUE.length, "warn", "clock"], ["Générés ce mois", DOC_DONE.length, "positive", "check-circle"], ["Modèles disponibles", DOC_TYPES.length, "primary", "layers"]].map(([l, n, tone, ic]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    className: "card card-pad",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(DocIcon, {
    name: ic,
    tone: tone,
    size: 44
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 24,
      fontWeight: 800
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.3fr 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      padding: "16px 20px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 17,
    style: {
      color: "var(--warn-strong)"
    }
  }), " \xC0 g\xE9n\xE9rer"), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-warn"
  }, DOC_QUEUE.filter(d => d.urgent).length, " urgents")), /*#__PURE__*/React.createElement("div", null, DOC_QUEUE.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "spread",
    style: {
      padding: "13px 20px",
      borderBottom: i < DOC_QUEUE.length - 1 ? "1px solid var(--border-2)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 13
    }
  }, /*#__PURE__*/React.createElement(DocIcon, {
    name: DOC_TYPES.find(t => t.name === d.doc)?.icon || "file-text",
    tone: d.urgent ? "warn" : "neutral"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, d.doc, " ", d.urgent && /*#__PURE__*/React.createElement("span", {
    className: "badge badge-danger",
    style: {
      marginLeft: 6,
      height: 18
    }
  }, "Urgent")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      marginTop: 2
    }
  }, d.ctx, " \xB7 ", d.who))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 14
  }), " G\xE9n\xE9rer"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 20px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    size: 17,
    style: {
      color: "var(--positive-600)"
    }
  }), " G\xE9n\xE9r\xE9s r\xE9cemment")), /*#__PURE__*/React.createElement("div", null, DOC_DONE.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "spread",
    style: {
      padding: "11px 20px",
      borderBottom: i < DOC_DONE.length - 1 ? "1px solid var(--border-2)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11
    }
  }, /*#__PURE__*/React.createElement(DocIcon, {
    name: "file-text",
    tone: "positive",
    size: 32
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 13
    }
  }, d.doc), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)"
    }
  }, d.ctx, " \xB7 ", d.date))), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-icon",
    style: {
      color: "var(--ink-3)"
    },
    title: "T\xE9l\xE9charger"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  })))))))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      marginBottom: 16
    }
  }, "Mod\xE8les disponibles"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
      gap: 12
    }
  }, DOC_TYPES.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.name,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 14,
      border: "1px solid var(--border)",
      borderRadius: 12,
      cursor: "pointer",
      transition: "border-color .14s, background .14s"
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = "var(--primary-200)";
      e.currentTarget.style.background = "var(--primary-tint)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = "var(--border)";
      e.currentTarget.style.background = "transparent";
    }
  }, /*#__PURE__*/React.createElement(DocIcon, {
    name: t.icon,
    tone: "primary"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, t.desc)))))));
}
Object.assign(window, {
  DocumentsPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/page_documents.jsx", error: String((e && e.message) || e) }); }

// app/page_formateurs.jsx
try { (() => {
// ============================================================
// Formateurs — list + detail
// ============================================================
const {
  useState: useStateFo
} = React;
function DispoChip({
  d
}) {
  const map = {
    "Disponible": "badge-positive",
    "Partielle": "badge-warn",
    "À confirmer": "badge-danger"
  };
  return /*#__PURE__*/React.createElement("span", {
    className: "badge " + (map[d] || "badge-neutral")
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), d);
}
function FormateursPage({
  openDetail
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Formateurs",
    subtitle: `${FORMATEURS.length} formateurs · ${FORMATEURS.filter(f => !f.confirme).length} en attente de confirmation`
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Ajouter un formateur")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
      gap: 18
    }
  }, FORMATEURS.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    className: "card",
    style: {
      padding: 0,
      overflow: "hidden",
      cursor: "pointer",
      transition: "transform .14s, box-shadow .14s"
    },
    onClick: () => openDetail(f),
    onMouseEnter: e => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      alignItems: "flex-start",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 46,
      height: 46,
      fontSize: 16,
      background: f.color
    }
  }, f.initials), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 15.5,
      whiteSpace: "nowrap"
    }
  }, f.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      marginTop: 2
    }
  }, f.sessions, " sessions \xE0 venir"))), /*#__PURE__*/React.createElement(DispoChip, {
    d: f.dispo
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginBottom: 16
    }
  }, f.specialites.map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    className: "badge badge-neutral"
  }, s))), /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, "Taux d'occupation"), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontWeight: 700,
      fontSize: 12.5
    }
  }, f.occupation, "%")), /*#__PURE__*/React.createElement("div", {
    className: "progress"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: f.occupation + "%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginTop: 16,
      paddingTop: 14,
      borderTop: "1px solid var(--border-2)"
    }
  }, f.confirme ? /*#__PURE__*/React.createElement("span", {
    className: "badge badge-positive"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12
  }), " Confirm\xE9") : /*#__PURE__*/React.createElement("span", {
    className: "badge badge-danger"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-triangle",
    size: 12
  }), " \xC0 confirmer"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--primary)",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, "Voir ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 13
  }))))))));
}
function FormateurDetail({
  f,
  goBack
}) {
  const sessions = SESSIONS.filter(s => s.formateur === f.name);
  const dispoWeek = [{
    d: "Lun",
    am: false,
    pm: false
  }, {
    d: "Mar",
    am: true,
    pm: true
  }, {
    d: "Mer",
    am: true,
    pm: false
  }, {
    d: "Jeu",
    am: true,
    pm: true
  }, {
    d: "Ven",
    am: true,
    pm: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: goBack,
    style: {
      color: "var(--ink-2)",
      marginBottom: 16,
      paddingLeft: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 16
  }), " Retour aux formateurs"), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad",
    style: {
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      gap: 20,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 64,
      height: 64,
      fontSize: 22,
      background: f.color
    }
  }, f.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 200
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 24
    }
  }, f.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      marginTop: 8,
      flexWrap: "wrap"
    }
  }, f.specialites.map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    className: "badge badge-neutral"
  }, s)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, "Occupation"), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 20,
      fontWeight: 800,
      marginTop: 2
    }
  }, f.occupation, "%")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, "Sessions"), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 20,
      fontWeight: 800,
      marginTop: 2
    }
  }, f.sessions)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, "Statut"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, f.confirme ? /*#__PURE__*/React.createElement("span", {
    className: "badge badge-positive"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12
  }), "Confirm\xE9") : /*#__PURE__*/React.createElement("span", {
    className: "badge badge-danger"
  }, "\xC0 confirmer")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 16
  }), " Contacter"), !f.confirme && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Confirmer"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 340px",
      gap: 20,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 20px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5
    }
  }, "Sessions \xE0 venir")), sessions.length ? /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Formation"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Inscrits"), /*#__PURE__*/React.createElement("th", null, "Statut"))), /*#__PURE__*/React.createElement("tbody", null, sessions.map(s => /*#__PURE__*/React.createElement("tr", {
    key: s.id
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 600
    }
  }, s.formation), /*#__PURE__*/React.createElement("td", null, s.date), /*#__PURE__*/React.createElement("td", {
    className: "tnum"
  }, s.inscrits, "/", s.capacite), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(SessionBadge, {
    statut: s.statut
  })))))) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "calendar",
    title: "Aucune session programm\xE9e",
    text: "Ce formateur n'a pas encore de session \xE0 venir."
  })), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      marginBottom: 14
    }
  }, "Disponibilit\xE9s \xB7 cette semaine"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(5,1fr)",
      gap: 10
    }
  }, dispoWeek.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.d,
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "var(--ink-2)",
      marginBottom: 8
    }
  }, d.d), [["Matin", d.am], ["A-m", d.pm]].map(([l, ok]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      marginBottom: 6,
      padding: "8px 4px",
      borderRadius: 8,
      fontSize: 11,
      fontWeight: 700,
      background: ok ? "var(--positive-bg)" : "var(--surface-3)",
      color: ok ? "var(--positive-600)" : "var(--ink-4)",
      border: "1px solid " + (ok ? "var(--positive-border)" : "var(--border-2)")
    }
  }, ok ? "Libre" : "—"))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 13.5,
      marginBottom: 12
    }
  }, "Coordonn\xE9es"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 15,
    style: {
      color: "var(--ink-3)"
    }
  }), f.email), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 15,
    style: {
      color: "var(--ink-3)"
    }
  }), f.tel))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 13.5,
      marginBottom: 12
    }
  }, "Documents p\xE9dagogiques"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, ["CV formateur", "Supports de cours", "Convention de prestation"].map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      fontSize: 13,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text",
    size: 15,
    style: {
      color: "var(--ink-3)"
    }
  }), d)))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 13.5,
      marginBottom: 10
    }
  }, "Notes"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: "var(--ink-2)",
      lineHeight: 1.55
    }
  }, "Tr\xE8s bons retours sur la p\xE9dagogie. Pr\xE9f\xE8re les sessions en pr\xE9sentiel le matin. Disponible pour des interventions intra-entreprise.")))));
}
Object.assign(window, {
  FormateursPage,
  FormateurDetail,
  DispoChip
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/page_formateurs.jsx", error: String((e && e.message) || e) }); }

// app/page_formations.jsx
try { (() => {
// ============================================================
// Formations — list + detail
// ============================================================
const {
  useState: useStateF
} = React;
function ModaliteBadge({
  m
}) {
  const map = {
    "Présentiel": ["map-pin", "badge-sky"],
    "Distanciel": ["video", "badge-primary"],
    "Hybride": ["globe", "badge-neutral"]
  };
  const [icon, cls] = map[m] || ["map-pin", "badge-neutral"];
  return /*#__PURE__*/React.createElement("span", {
    className: "badge " + cls
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 12
  }), m);
}
function FormationCard({
  f,
  onOpen
}) {
  const tone = f.remplissage >= 70 ? "positive" : f.remplissage < 40 ? "danger" : "warn";
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "transform .14s, box-shadow .14s",
      cursor: "pointer"
    },
    onClick: () => onOpen(f),
    onMouseEnter: e => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: f.color
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      display: "flex",
      flexDirection: "column",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      alignItems: "flex-start",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge-neutral"
  }, f.cat), /*#__PURE__*/React.createElement(ModaliteBadge, {
    m: f.modalite
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      lineHeight: 1.3,
      marginBottom: 14,
      minHeight: 42
    }
  }, f.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      marginBottom: 16,
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 14
  }), f.duree), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar",
    size: 14
  }), f.sessions, " sessions")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, "Remplissage moyen"), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontWeight: 700,
      fontSize: 12.5,
      color: tone === "danger" ? "var(--danger-strong)" : tone === "positive" ? "var(--positive-600)" : "var(--warn-strong)"
    }
  }, f.remplissage, "%")), /*#__PURE__*/React.createElement("div", {
    className: "progress " + tone
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: f.remplissage + "%"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginTop: 16,
      paddingTop: 16,
      borderTop: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontSize: 19,
      fontWeight: 800
    }
  }, f.prix, " \u20AC", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "var(--ink-3)"
    }
  }, " HT")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 24,
      height: 24,
      fontSize: 10,
      background: f.color
    }
  }, f.formateur.split(" ").map(x => x[0]).join("")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--ink-2)",
      fontWeight: 600
    }
  }, f.formateur.split(" ")[0])))));
}
function FormationsPage({
  openDetail,
  onNewSession
}) {
  const [q, setQ] = useStateF("");
  const [filter, setFilter] = useStateF("all");
  const cats = ["all", ...new Set(FORMATIONS.map(f => f.cat))];
  const list = FORMATIONS.filter(f => (filter === "all" || f.cat === filter) && f.title.toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Formations",
    subtitle: `${FORMATIONS.length} formations au catalogue · ${FORMATIONS.reduce((a, f) => a + f.sessions, 0)} sessions programmées`
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "globe",
    size: 16
  }), " Page publique"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Cr\xE9er une formation")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginBottom: 20,
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 240,
      maxWidth: 360,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16,
    style: {
      position: "absolute",
      left: 12,
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--ink-4)"
    }
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Rechercher une formation\u2026",
    value: q,
    onChange: e => setQ(e.target.value),
    style: {
      paddingLeft: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, cats.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => setFilter(c),
    className: "badge",
    style: {
      height: 34,
      padding: "0 14px",
      fontSize: 12.5,
      cursor: "pointer",
      background: filter === c ? "var(--primary)" : "var(--surface)",
      color: filter === c ? "#fff" : "var(--ink-2)",
      border: "1px solid " + (filter === c ? "var(--primary)" : "var(--border-strong)")
    }
  }, c === "all" ? "Toutes" : c)))), list.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
      gap: 18
    }
  }, list.map(f => /*#__PURE__*/React.createElement(FormationCard, {
    key: f.id,
    f: f,
    onOpen: openDetail
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement(EmptyState, {
    title: "Aucune formation trouv\xE9e",
    text: "Essayez un autre terme ou r\xE9initialisez les filtres."
  })));
}

// ---------- Detail (Power BI) ----------
function FormationDetail({
  f,
  goBack,
  onNewSession,
  openAI
}) {
  const objectifs = ["Concevoir un modèle de données propre et performant", "Créer des visualisations claires et interactives", "Maîtriser le langage DAX pour les mesures clés", "Publier et partager un tableau de bord en équipe"];
  const programme = [{
    t: "Jour 1 — Fondations",
    items: ["Prise en main de Power BI Desktop", "Connexion et transformation des données (Power Query)", "Modélisation et relations"]
  }, {
    t: "Jour 2 — Visualisations",
    items: ["Graphiques, cartes et filtres", "Mise en page et thèmes", "Introduction au DAX"]
  }, {
    t: "Jour 3 — Pilotage",
    items: ["Mesures avancées et KPI", "Publication sur Power BI Service", "Atelier : tableau de bord d'entreprise"]
  }];
  const sessions = SESSIONS.filter(s => s.fid === "powerbi");
  const caPrev = sessions.filter(s => s.statut !== "terminee").reduce((a, s) => a + s.inscrits * f.prix, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: goBack,
    style: {
      color: "var(--ink-2)",
      marginBottom: 16,
      paddingLeft: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 16
  }), " Retour aux formations"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 320px",
      gap: 22,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: f.color
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge-neutral"
  }, f.cat), /*#__PURE__*/React.createElement(ModaliteBadge, {
    m: f.modalite
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 26,
      lineHeight: 1.2,
      marginBottom: 12
    }
  }, f.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.6,
      color: "var(--ink-2)"
    }
  }, "Une formation op\xE9rationnelle de ", f.duree.toLowerCase(), " pour construire, de A \xE0 Z, un tableau de bord d\xE9cisionnel avec Power BI \u2014 de la connexion aux donn\xE9es jusqu'\xE0 la publication d'un rapport partag\xE9 en entreprise."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 28,
      marginTop: 20,
      flexWrap: "wrap"
    }
  }, [["Durée", f.duree + " · " + f.heures + "h"], ["Prix", f.prix + " € HT"], ["Modalité", f.modalite], ["Sessions", f.sessions + " programmées"]].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      marginTop: 3
    }
  }, v)))))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      marginBottom: 14
    }
  }, "Objectifs p\xE9dagogiques"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, objectifs.map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--positive-600)",
      flex: "none",
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      lineHeight: 1.45
    }
  }, o))))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      marginBottom: 16
    }
  }, "Programme"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, programme.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "var(--primary-50)",
      color: "var(--primary)",
      fontWeight: 800,
      fontSize: 13,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, i + 1), i < programme.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 2,
      flex: 1,
      background: "var(--border)",
      marginTop: 4
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: i < programme.length - 1 ? 4 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      marginBottom: 6
    }
  }, p.t), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 16,
      color: "var(--ink-2)",
      fontSize: 13.5,
      lineHeight: 1.7
    }
  }, p.items.map((it, j) => /*#__PURE__*/React.createElement("li", {
    key: j
  }, it)))))))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      padding: "18px 22px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16
    }
  }, "Sessions \xE0 venir"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: onNewSession
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15
  }), " Cr\xE9er une session")), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Formateur"), /*#__PURE__*/React.createElement("th", null, "Inscrits"), /*#__PURE__*/React.createElement("th", null, "Remplissage"), /*#__PURE__*/React.createElement("th", null, "Statut"))), /*#__PURE__*/React.createElement("tbody", null, sessions.map(s => /*#__PURE__*/React.createElement("tr", {
    key: s.id
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 600
    }
  }, s.date), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 24,
      height: 24,
      fontSize: 10,
      background: s.fColor
    }
  }, s.fInit), s.formateur)), /*#__PURE__*/React.createElement("td", {
    className: "tnum"
  }, s.inscrits, "/", s.capacite), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FillBar, {
    value: Math.round(s.inscrits / s.capacite * 100),
    width: 90
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(SessionBadge, {
    statut: s.statut
  })))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
      position: "sticky",
      top: 88
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-block",
    onClick: onNewSession
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Cr\xE9er une session"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-block"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "globe",
    size: 16
  }), " G\xE9n\xE9rer page publique")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden",
      borderColor: "var(--primary-100)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 18px",
      background: "linear-gradient(120deg,#eef4fa,#eaf2f9)",
      display: "flex",
      gap: 10,
      alignItems: "center",
      borderBottom: "1px solid var(--primary-100)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: "linear-gradient(140deg,#2f9488,#2469a6)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 16
  })), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 13.5
    }
  }, "Optimisation IA")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: "var(--ink-2)",
      lineHeight: 1.5,
      marginBottom: 14
    }
  }, "Boostez le remplissage avec une description plus vendeuse, optimis\xE9e pour vos prospects PME."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ai btn-sm btn-block",
    onClick: openAI
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wand",
    size: 15
  }), " Am\xE9liorer la description"))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)",
      fontWeight: 600
    }
  }, "CA pr\xE9visionnel"), /*#__PURE__*/React.createElement(Icon, {
    name: "euro",
    size: 15,
    style: {
      color: "var(--positive-600)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 24,
      fontWeight: 800
    }
  }, caPrev.toLocaleString("fr-FR"), " \u20AC"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      marginTop: 4
    }
  }, "Sur les sessions ouvertes \xE0 venir")), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 13.5,
      marginBottom: 12
    }
  }, "Formateurs possibles"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, FORMATEURS.filter(t => t.specialites.some(s => /Power BI|Excel|Digital/.test(s))).map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 30,
      height: 30,
      background: t.color
    }
  }, t.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 13
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)"
    }
  }, t.specialites.join(" · "))))))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 13.5,
      marginBottom: 12
    }
  }, "Documents li\xE9s"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, ["Programme PDF", "Convention type", "Support de cours"].map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      fontSize: 13,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text",
    size: 15,
    style: {
      color: "var(--ink-3)"
    }
  }), d)))))));
}
Object.assign(window, {
  FormationsPage,
  FormationDetail,
  FormationCard,
  ModaliteBadge
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/page_formations.jsx", error: String((e && e.message) || e) }); }

// app/page_planning.jsx
try { (() => {
// ============================================================
// Planning — weekly grid (formateurs × jours, matin/après-midi)
// + intelligent slot finder panel
// ============================================================
const {
  useState: useStateP
} = React;
const DAYS = [{
  id: "lun",
  label: "Lundi",
  date: "16"
}, {
  id: "mar",
  label: "Mardi",
  date: "17"
}, {
  id: "mer",
  label: "Mercredi",
  date: "18"
}, {
  id: "jeu",
  label: "Jeudi",
  date: "19"
}, {
  id: "ven",
  label: "Vendredi",
  date: "20"
}];

// blocks per formateur: { day: { am, pm } }  am/pm = block object or 'dispo' or 'off'
const PLANNING = {
  claire: {
    mar: {
      am: {
        t: "Power BI",
        color: "#2469a6",
        room: "Salle A"
      },
      pm: {
        t: "Power BI",
        color: "#2469a6",
        room: "Salle A"
      }
    },
    mer: {
      am: {
        t: "Power BI",
        color: "#2469a6",
        room: "Salle A"
      },
      pm: "dispo"
    },
    jeu: {
      am: "dispo",
      pm: "dispo"
    },
    ven: {
      am: {
        t: "Excel Avancé",
        color: "#2f7fc4",
        room: "Salle B",
        conflict: true
      },
      pm: {
        t: "Excel Avancé",
        color: "#2f7fc4",
        room: "Salle B",
        conflict: true
      }
    }
  },
  julien: {
    lun: {
      am: "dispo",
      pm: "dispo"
    },
    mar: {
      am: "dispo",
      pm: "dispo"
    },
    mer: {
      am: "dispo",
      pm: "dispo"
    },
    jeu: {
      am: "dispo",
      pm: "dispo"
    },
    ven: {
      am: {
        t: "IA fonctions admin.",
        color: "#129a93",
        room: "Distanciel"
      },
      pm: "off"
    }
  },
  sarah: {
    lun: {
      am: "off",
      pm: "off"
    },
    mar: {
      am: "dispo",
      pm: "dispo"
    },
    mer: {
      am: {
        t: "Finance dirigeants",
        color: "#d9821f",
        room: "Salle C"
      },
      pm: {
        t: "Finance dirigeants",
        color: "#d9821f",
        room: "Salle C"
      }
    },
    jeu: {
      am: "dispo",
      pm: "dispo"
    },
    ven: {
      am: "dispo",
      pm: "off"
    }
  },
  thomas: {
    lun: {
      am: "dispo",
      pm: "dispo"
    },
    mar: {
      am: "dispo",
      pm: "dispo"
    },
    jeu: {
      am: "dispo",
      pm: "dispo"
    },
    ven: {
      am: "dispo",
      pm: "dispo"
    }
  }
};
function Slot({
  block
}) {
  if (!block || block === "off") return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      borderRadius: 8,
      background: "repeating-linear-gradient(45deg,#f4f5f8,#f4f5f8 5px,#eef0f3 5px,#eef0f3 10px)"
    }
  });
  if (block === "dispo") return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      borderRadius: 8,
      border: "1.5px dashed var(--positive-border)",
      background: "var(--positive-bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--positive-600)",
      fontSize: 11,
      fontWeight: 700
    }
  }, "Dispo");
  const conflict = block.conflict;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      borderRadius: 8,
      padding: "7px 9px",
      overflow: "hidden",
      cursor: "pointer",
      background: conflict ? "var(--danger-bg)" : block.color + "14",
      borderLeft: "3px solid " + (conflict ? "var(--danger)" : block.color),
      border: conflict ? "1px solid var(--danger-border)" : "1px solid " + block.color + "30",
      transition: "transform .12s"
    },
    onMouseEnter: e => e.currentTarget.style.transform = "scale(1.02)",
    onMouseLeave: e => e.currentTarget.style.transform = "none"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 12,
      color: conflict ? "var(--danger-strong)" : block.color,
      lineHeight: 1.2,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, block.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: "var(--ink-3)",
      marginTop: 3,
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, conflict ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-triangle",
    size: 11,
    style: {
      color: "var(--danger)"
    }
  }), " Conflit salle") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 11
  }), " ", block.room)));
}
function PlanningPage() {
  const [panel, setPanel] = useStateP(false);
  const slots = [{
    day: "Mardi 18 juin",
    time: "Matin",
    score: 92,
    note: "Tous les formateurs disponibles · Salle A libre",
    tone: "positive"
  }, {
    day: "Jeudi 20 juin",
    time: "Après-midi",
    score: 88,
    note: "Claire Martin disponible · Salle B libre",
    tone: "positive"
  }, {
    day: "Vendredi 21 juin",
    time: "Journée",
    score: 54,
    note: "Conflit de salle détecté (Salle B occupée)",
    tone: "danger"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Planning",
    subtitle: "Semaine du 16 au 20 juin 2026 \xB7 vue formateurs"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      background: "var(--surface)",
      border: "1px solid var(--border-strong)",
      borderRadius: 10,
      padding: 3
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-icon",
    style: {
      width: 32,
      height: 32
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    style: {
      height: 32,
      padding: "0 10px",
      fontSize: 12.5,
      fontWeight: 700
    }
  }, "Cette semaine"), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-icon",
    style: {
      width: 32,
      height: 32
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16
  }))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ai",
    onClick: () => setPanel(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 17
  }), " Trouver les meilleurs cr\xE9neaux")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 880
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "168px repeat(5,1fr)",
      borderBottom: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px",
      fontSize: 11,
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: ".06em",
      color: "var(--ink-3)"
    }
  }, "Formateur"), DAYS.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    style: {
      padding: "12px 10px",
      textAlign: "center",
      borderLeft: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, d.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)"
    }
  }, d.date, " juin")))), FORMATEURS.map((f, ri) => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    style: {
      display: "grid",
      gridTemplateColumns: "168px repeat(5,1fr)",
      borderBottom: ri < FORMATEURS.length - 1 ? "1px solid var(--border-2)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 30,
      height: 30,
      background: f.color,
      fontSize: 11
    }
  }, f.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      whiteSpace: "nowrap"
    }
  }, f.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: "var(--ink-3)"
    }
  }, f.specialites[0]))), DAYS.map(d => {
    const cell = (PLANNING[f.id] || {})[d.id];
    return /*#__PURE__*/React.createElement("div", {
      key: d.id,
      style: {
        borderLeft: "1px solid var(--border-2)",
        padding: 7,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minHeight: 96
      }
    }, /*#__PURE__*/React.createElement(Slot, {
      block: cell ? cell.am : "off"
    }), /*#__PURE__*/React.createElement(Slot, {
      block: cell ? cell.pm : "off"
    }));
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 18,
      padding: "12px 16px",
      borderTop: "1px solid var(--border-2)",
      fontSize: 11.5,
      color: "var(--ink-2)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 10,
      borderRadius: 3,
      background: "var(--positive-bg)",
      border: "1.5px dashed var(--positive-border)"
    }
  }), " Disponible"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 10,
      borderRadius: 3,
      background: "#2469a622",
      borderLeft: "3px solid #2469a6"
    }
  }), " Session planifi\xE9e"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 10,
      borderRadius: 3,
      background: "var(--danger-bg)",
      borderLeft: "3px solid var(--danger)"
    }
  }), " Conflit"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 10,
      borderRadius: 3,
      background: "repeating-linear-gradient(45deg,#f4f5f8,#f4f5f8 3px,#eef0f3 3px,#eef0f3 6px)"
    }
  }), " Indisponible"))), /*#__PURE__*/React.createElement(Drawer, {
    open: panel,
    onClose: () => setPanel(false),
    title: "Meilleurs cr\xE9neaux",
    subtitle: "Pour : Excel Avanc\xE9 pour PME \xB7 2 jours",
    accent: true,
    width: 440,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary",
      style: {
        flex: 1
      },
      onClick: () => setPanel(false)
    }, "Fermer"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16
    }), " Planifier"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      padding: "12px 14px",
      background: "var(--primary-tint)",
      borderRadius: 12,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 18,
    style: {
      color: "var(--primary)",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, "3 cr\xE9neaux analys\xE9s selon les disponibilit\xE9s formateurs, salles et le remplissage attendu.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, slots.map((s, i) => /*#__PURE__*/React.createElement("label", {
    key: i,
    style: {
      display: "flex",
      gap: 14,
      padding: 16,
      borderRadius: 14,
      border: "1px solid " + (i === 0 ? "var(--primary)" : "var(--border)"),
      background: i === 0 ? "var(--primary-tint)" : "var(--surface)",
      cursor: "pointer",
      boxShadow: i === 0 ? "0 0 0 3px var(--primary-50)" : "none"
    }
  }, /*#__PURE__*/React.createElement(Donut, {
    value: s.score,
    size: 56,
    stroke: 7,
    color: s.tone === "danger" ? "var(--danger)" : "var(--positive)",
    label: s.score + "%"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread"
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 14
    }
  }, s.day), /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "slot",
    defaultChecked: i === 0,
    style: {
      accentColor: "var(--primary)",
      width: 16,
      height: 16
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)",
      margin: "2px 0 8px"
    }
  }, s.time, " \xB7 compatible ", s.score, " %"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: s.tone === "danger" ? "var(--danger-strong)" : "var(--positive-600)",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.tone === "danger" ? "alert-triangle" : "check-circle",
    size: 13
  }), " ", s.note)))))));
}
Object.assign(window, {
  PlanningPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/page_planning.jsx", error: String((e && e.message) || e) }); }

// app/page_prospects.jsx
try { (() => {
// ============================================================
// Prospects — CRM Kanban (draggable) + AI relance drawer
// ============================================================
const {
  useState: useStatePr,
  useRef: useRefPr
} = React;
function ProspectCard({
  p,
  onDragStart,
  onRelance
}) {
  const col = CRM_COLS.find(c => c.id === p.col);
  return /*#__PURE__*/React.createElement("div", {
    draggable: true,
    onDragStart: e => onDragStart(e, p),
    style: {
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: 13,
      boxShadow: "var(--shadow-xs)",
      cursor: "grab",
      transition: "box-shadow .14s, transform .14s"
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = "var(--shadow)";
      e.currentTarget.style.transform = "translateY(-2px)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = "var(--shadow-xs)";
      e.currentTarget.style.transform = "none";
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 28,
      height: 28,
      fontSize: 10.5,
      background: col.color
    }
  }, p.name.split(" ").map(x => x[0]).slice(0, 2).join("")), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 13,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, p.name)), p.chaud && /*#__PURE__*/React.createElement("span", {
    title: "Prospect chaud",
    style: {
      color: "var(--warn)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    size: 14,
    fill: "var(--warn)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-2)",
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 13,
    style: {
      color: "var(--ink-3)"
    }
  }), " ", p.formation), /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      paddingTop: 10,
      borderTop: "1px dashed var(--border-strong)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontWeight: 800,
      fontSize: 14,
      whiteSpace: "nowrap"
    }
  }, p.montant.toLocaleString("fr-FR"), " \u20AC"), p.relance !== "—" && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--warn-strong)",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 12
  }), p.relance)), p.action !== "—" && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 11.5,
      color: "var(--ink-3)",
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 12
  }), " ", p.action), (p.col === "relance" || p.col === "devis" || p.col === "contacte") && /*#__PURE__*/React.createElement("button", {
    onClick: () => onRelance(p),
    className: "btn btn-ai btn-sm btn-block",
    style: {
      marginTop: 11,
      height: 30
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wand",
    size: 14
  }), " Relance IA"));
}
function ProspectsPage() {
  const [prospects, setProspects] = useStatePr(PROSPECTS);
  const [over, setOver] = useStatePr(null);
  const [relance, setRelance] = useStatePr(null);
  const dragged = useRefPr(null);
  const onDragStart = (e, p) => {
    dragged.current = p;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDrop = colId => {
    if (dragged.current && dragged.current.col !== colId) {
      setProspects(prev => prev.map(x => x.id === dragged.current.id ? {
        ...x,
        col: colId
      } : x));
    }
    dragged.current = null;
    setOver(null);
  };
  const totalPipe = prospects.filter(p => p.col !== "perdu" && p.col !== "gagne").reduce((a, p) => a + p.montant, 0);
  const won = prospects.filter(p => p.col === "gagne").reduce((a, p) => a + p.montant, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up",
    style: {
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - var(--topbar-h) - 56px)"
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Prospects",
    subtitle: `Pipeline ${totalPipe.toLocaleString("fr-FR")} € en cours · ${won.toLocaleString("fr-FR")} € gagnés`
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filter",
    size: 16
  }), " Filtrer"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ai",
    onClick: () => setRelance(prospects.find(p => p.col === "relance"))
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wand",
    size: 16
  }), " G\xE9n\xE9rer une relance IA"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Ajouter un prospect")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      gap: 14,
      overflowX: "auto",
      paddingBottom: 8
    }
  }, CRM_COLS.map(col => {
    const items = prospects.filter(p => p.col === col.id);
    const sum = items.reduce((a, p) => a + p.montant, 0);
    return /*#__PURE__*/React.createElement("div", {
      key: col.id,
      onDragOver: e => {
        e.preventDefault();
        setOver(col.id);
      },
      onDragLeave: () => setOver(o => o === col.id ? null : o),
      onDrop: () => onDrop(col.id),
      style: {
        width: 264,
        flex: "none",
        display: "flex",
        flexDirection: "column",
        background: over === col.id ? "var(--primary-tint)" : "var(--surface-3)",
        borderRadius: 14,
        border: "1px solid " + (over === col.id ? "var(--primary-200)" : "var(--border-2)"),
        transition: "background .14s, border-color .14s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "spread",
      style: {
        padding: "12px 14px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: 99,
        background: col.color
      }
    }), /*#__PURE__*/React.createElement("strong", {
      style: {
        fontSize: 13
      }
    }, col.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: "var(--ink-3)",
        background: "var(--surface)",
        borderRadius: 99,
        padding: "1px 7px"
      }
    }, items.length)), /*#__PURE__*/React.createElement("span", {
      className: "tnum",
      style: {
        fontSize: 11.5,
        color: "var(--ink-3)",
        fontWeight: 700
      }
    }, sum ? (sum / 1000).toFixed(1).replace(".", ",") + "k€" : "")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: "auto",
        padding: "0 10px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 60
      }
    }, items.map(p => /*#__PURE__*/React.createElement(ProspectCard, {
      key: p.id,
      p: p,
      onDragStart: onDragStart,
      onRelance: setRelance
    })), !items.length && /*#__PURE__*/React.createElement("div", {
      style: {
        border: "1.5px dashed var(--border-strong)",
        borderRadius: 10,
        padding: "18px 10px",
        textAlign: "center",
        fontSize: 11.5,
        color: "var(--ink-4)"
      }
    }, "D\xE9posez ici")));
  })), /*#__PURE__*/React.createElement(RelanceDrawer, {
    prospect: relance,
    onClose: () => setRelance(null)
  }));
}
function RelanceDrawer({
  prospect,
  onClose
}) {
  const [generating, setGenerating] = useStatePr(false);
  const [text, setText] = useStatePr("");
  const open = !!prospect;
  React.useEffect(() => {
    if (!prospect) return;
    setGenerating(true);
    setText("");
    const full = buildEmail(prospect);
    let i = 0;
    const t = setInterval(() => {
      i += 8;
      setText(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(t);
        setGenerating(false);
      }
    }, 16);
    return () => clearInterval(t);
  }, [prospect]);
  return /*#__PURE__*/React.createElement(Drawer, {
    open: open,
    onClose: onClose,
    title: "Relance commerciale",
    subtitle: prospect ? prospect.name + " · " + prospect.formation : "",
    accent: true,
    width: 520,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary",
      onClick: onClose
    }, "Annuler"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ai",
      style: {
        marginLeft: "auto"
      },
      disabled: generating
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "refresh",
      size: 15
    }), " R\xE9g\xE9n\xE9rer"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      disabled: generating
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 15
    }), " Envoyer"))
  }, prospect && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 18
    }
  }, [["Contact", prospect.contact], ["Montant", prospect.montant.toLocaleString("fr-FR") + " €"], ["Relance", prospect.relance]].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      flex: 1,
      background: "var(--surface-2)",
      border: "1px solid var(--border-2)",
      borderRadius: 10,
      padding: "10px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      marginTop: 2
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label",
    style: {
      margin: 0
    }
  }, "Email g\xE9n\xE9r\xE9"), generating && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--primary)",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 13
  }), " R\xE9daction\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-strong)",
      borderRadius: 12,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      borderBottom: "1px solid var(--border-2)",
      fontSize: 12.5,
      color: "var(--ink-2)",
      background: "var(--surface-2)"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--ink)"
    }
  }, "Objet :"), " ", prospect.formation, " \u2014 une session se pr\xE9pare chez ", CENTER.name), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      fontSize: 13.5,
      lineHeight: 1.7,
      color: "var(--ink)",
      whiteSpace: "pre-wrap",
      minHeight: 230,
      fontFamily: "var(--font)"
    }
  }, text, generating && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 8,
      height: 16,
      background: "var(--primary)",
      marginLeft: 1,
      verticalAlign: "text-bottom",
      animation: "fadeIn .5s infinite alternate"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 12,
      flexWrap: "wrap"
    }
  }, ["Ton plus direct", "Ajouter une offre", "Plus court"].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    className: "badge badge-primary",
    style: {
      height: 30,
      padding: "0 12px",
      cursor: "pointer",
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wand",
    size: 12
  }), " ", t)))));
}
function buildEmail(p) {
  const first = p.contact.split(" ")[0];
  return `Bonjour ${first},

Suite à votre intérêt pour notre formation « ${p.formation} », je reviens vers vous avec plaisir.

Une nouvelle session est en cours d'ouverture et il reste actuellement quelques places. Cette formation est particulièrement adaptée aux PME qui souhaitent monter rapidement en compétence, avec un format concret et opérationnel.

Je serais ravie d'échanger 15 minutes pour cerner vos besoins et vous proposer les meilleures dates. Seriez-vous disponible en début de semaine prochaine ?

Bien à vous,
${CENTER.user.name}
${CENTER.name}`;
}
Object.assign(window, {
  ProspectsPage,
  ProspectCard,
  RelanceDrawer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/page_prospects.jsx", error: String((e && e.message) || e) }); }

// app/page_qualite.jsx
try { (() => {
// ============================================================
// Qualité
// ============================================================
function QualitePage() {
  const metrics = [{
    label: "Taux de satisfaction",
    value: 94,
    color: "var(--positive)",
    sub: "Moyenne 4,7/5 · 38 réponses"
  }, {
    label: "Taux de présence",
    value: 91,
    color: "var(--primary)",
    sub: "Sur les 6 dernières sessions"
  }, {
    label: "Taux de complétion",
    value: 88,
    color: "var(--sky)",
    sub: "Apprenants allés au terme"
  }];
  const retours = [{
    name: "Karim Saïdi",
    entreprise: "Méridien",
    note: 5,
    txt: "Formation très concrète, applicable dès le lundi. La formatrice connaît parfaitement les enjeux PME.",
    formation: "Excel Avancé"
  }, {
    name: "Chloé Marchand",
    entreprise: "Lagon Digital",
    note: 4,
    txt: "Bon rythme et beaucoup d'exercices. J'aurais aimé un peu plus de temps sur les TCD.",
    formation: "Excel Avancé"
  }, {
    name: "Antoine Berger",
    entreprise: "Soleil PME",
    note: 5,
    txt: "Le passage sur DAX était limpide. Je recommande pour toute équipe data.",
    formation: "Power BI"
  }];
  const actions = [{
    t: "Ajouter 1h d'atelier TCD sur Excel Avancé",
    statut: "En cours",
    tone: "warn"
  }, {
    t: "Standardiser l'envoi des questionnaires J+1",
    statut: "Planifié",
    tone: "neutral"
  }, {
    t: "Mettre à jour les supports Power BI (DAX)",
    statut: "Fait",
    tone: "positive"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Qualit\xE9",
    subtitle: "Centralisez vos preuves qualit\xE9 et vos indicateurs utiles \xE0 votre d\xE9marche qualit\xE9."
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " Exporter le rapport")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 16,
      marginBottom: 20
    }
  }, metrics.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.label,
    className: "card card-pad",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Donut, {
    value: m.value,
    size: 92,
    stroke: 10,
    color: m.color
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14.5
    }
  }, m.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      marginTop: 4,
      lineHeight: 1.4
    }
  }, m.sub))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 360px",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      padding: "16px 20px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message",
    size: 17,
    style: {
      color: "var(--primary)"
    }
  }), " Retours apprenants r\xE9cents"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ai btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 14
  }), " Synth\xE9tiser")), /*#__PURE__*/React.createElement("div", null, retours.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "16px 20px",
      borderBottom: i < retours.length - 1 ? "1px solid var(--border-2)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 32,
      height: 32,
      fontSize: 11,
      background: "var(--primary)"
    }
  }, r.name.split(" ").map(x => x[0]).join("")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, r.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)"
    }
  }, r.entreprise, " \xB7 ", r.formation))), /*#__PURE__*/React.createElement(Stars, {
    n: r.note
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: "var(--ink-2)",
      lineHeight: 1.55,
      fontStyle: "italic"
    }
  }, "\xAB ", r.txt, " \xBB"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(DocIcon, {
    name: "alert-circle",
    tone: "warn",
    size: 44
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 24,
      fontWeight: 800
    }
  }, "0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, "R\xE9clamation en cours"))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "15px 18px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 14.5,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    size: 16,
    style: {
      color: "var(--primary)"
    }
  }), " Actions d'am\xE9lioration")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12
    }
  }, actions.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      padding: "10px 8px",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.tone === "positive" ? "check-circle" : "circle",
    size: 17,
    style: {
      color: a.tone === "positive" ? "var(--positive-600)" : "var(--ink-4)",
      flex: "none",
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      lineHeight: 1.4,
      textDecoration: a.tone === "positive" ? "line-through" : "none",
      color: a.tone === "positive" ? "var(--ink-3)" : "var(--ink)"
    }
  }, a.t)), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-" + a.tone,
    style: {
      flex: "none"
    }
  }, a.statut))))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad",
    style: {
      background: "var(--surface-2)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-circle",
    size: 13,
    style: {
      verticalAlign: "-2px",
      marginRight: 4
    }
  }), " Le Bon Rebond centralise vos preuves qualit\xE9. Il ne se substitue pas \xE0 une certification Qualiopi.")))));
}
Object.assign(window, {
  QualitePage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/page_qualite.jsx", error: String((e && e.message) || e) }); }

// app/page_sessions.jsx
try { (() => {
// ============================================================
// Sessions — table  +  New Session modal content
// ============================================================
const {
  useState: useStateS
} = React;
function SessionsPage({
  onNewSession
}) {
  const [tab, setTab] = useStateS("all");
  const tabs = [{
    id: "all",
    label: "Toutes",
    n: SESSIONS.length
  }, {
    id: "ouverte",
    label: "Ouvertes",
    n: SESSIONS.filter(s => s.statut === "ouverte").length
  }, {
    id: "risque",
    label: "À risque",
    n: SESSIONS.filter(s => s.statut === "risque").length
  }, {
    id: "complete",
    label: "Complètes",
    n: SESSIONS.filter(s => s.statut === "complete").length
  }, {
    id: "terminee",
    label: "Terminées",
    n: SESSIONS.filter(s => s.statut === "terminee").length
  }];
  const list = SESSIONS.filter(s => tab === "all" || s.statut === tab);
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Sessions",
    subtitle: "G\xE9rez le remplissage et la rentabilit\xE9 de chaque session."
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " Exporter"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onNewSession
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Nouvelle session")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 18,
      borderBottom: "1px solid var(--border)",
      overflowX: "auto"
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: {
      padding: "10px 14px 13px",
      fontSize: 13.5,
      fontWeight: 700,
      whiteSpace: "nowrap",
      color: tab === t.id ? "var(--primary)" : "var(--ink-2)",
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, t.label, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      padding: "1px 6px",
      borderRadius: 99,
      background: tab === t.id ? "var(--primary-50)" : "var(--surface-3)",
      color: tab === t.id ? "var(--primary)" : "var(--ink-3)",
      fontWeight: 700
    }
  }, t.n), tab === t.id && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 8,
      right: 8,
      bottom: -1,
      height: 2.5,
      borderRadius: 99,
      background: "var(--primary)"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl",
    style: {
      minWidth: 900
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Formation"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Formateur"), /*#__PURE__*/React.createElement("th", null, "Inscrits"), /*#__PURE__*/React.createElement("th", {
    style: {
      minWidth: 160
    }
  }, "Remplissage"), /*#__PURE__*/React.createElement("th", null, "Statut"), /*#__PURE__*/React.createElement("th", null, "Documents"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, list.map(s => {
    const pct = Math.round(s.inscrits / s.capacite * 100);
    const seuilPct = Math.round(s.seuil / s.capacite * 100);
    return /*#__PURE__*/React.createElement("tr", {
      key: s.id
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 700,
        maxWidth: 220
      }
    }, s.formation), /*#__PURE__*/React.createElement("td", {
      style: {
        whiteSpace: "nowrap"
      }
    }, s.date), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        whiteSpace: "nowrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "avatar",
      style: {
        width: 24,
        height: 24,
        fontSize: 9.5,
        background: s.fColor
      }
    }, s.fInit), /*#__PURE__*/React.createElement("span", {
      style: {
        color: s.formateur === "Non confirmé" ? "var(--danger-strong)" : "var(--ink)",
        fontWeight: s.formateur === "Non confirmé" ? 700 : 500
      }
    }, s.formateur))), /*#__PURE__*/React.createElement("td", {
      className: "tnum",
      style: {
        fontWeight: 700
      }
    }, s.inscrits, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--ink-3)",
        fontWeight: 500
      }
    }, "/", s.capacite)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FillBar, {
      value: pct,
      seuil: seuilPct,
      width: 120
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(SessionBadge, {
      statut: s.statut
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 5,
        color: "var(--ink-2)",
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "file-text",
      size: 14,
      style: {
        color: "var(--ink-3)"
      }
    }), " ", s.statut === "terminee" ? "Attestations" : s.statut === "risque" ? "Incomplets" : "Convocations")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost btn-icon",
      style: {
        color: "var(--ink-3)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "more",
      size: 18
    }))));
  }))))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 2,
      height: 12,
      background: "var(--ink)",
      opacity: .35,
      display: "inline-block"
    }
  }), " La barre verticale indique le seuil de rentabilit\xE9 de chaque session."));
}
function NewSessionForm() {
  const [step, setStep] = useStateS(0);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Formation"), /*#__PURE__*/React.createElement("select", {
    className: "select"
  }, FORMATIONS.map(f => /*#__PURE__*/React.createElement("option", {
    key: f.id
  }, f.title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Date de d\xE9but"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    type: "date",
    defaultValue: "2026-06-18"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Modalit\xE9"), /*#__PURE__*/React.createElement("select", {
    className: "select"
  }, /*#__PURE__*/React.createElement("option", null, "Pr\xE9sentiel"), /*#__PURE__*/React.createElement("option", null, "Distanciel"), /*#__PURE__*/React.createElement("option", null, "Hybride")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Formateur"), /*#__PURE__*/React.createElement("select", {
    className: "select"
  }, FORMATEURS.map(f => /*#__PURE__*/React.createElement("option", {
    key: f.id
  }, f.name)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Capacit\xE9"), /*#__PURE__*/React.createElement("input", {
    className: "input tnum",
    type: "number",
    defaultValue: "12"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--primary-tint)",
      border: "1px solid var(--primary-100)",
      borderRadius: 12,
      padding: "12px 14px",
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 18,
    style: {
      color: "var(--primary)",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, "L'assistant sugg\xE8re le ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--ink)"
    }
  }, "mardi 18 juin"), " \u2014 92 % compatible avec les disponibilit\xE9s des formateurs et salles."))));
}
Object.assign(window, {
  SessionsPage,
  NewSessionForm
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "app/page_sessions.jsx", error: String((e && e.message) || e) }); }

// assets/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever you want the user to
 * supply an image. You control the slot's shape and size; the user fills it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The host bridge only allows sidecar writes at the project root, so the
 * HTML that uses this component is assumed to live at the project root too
 * (same constraint as design_canvas.jsx).
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          object-fit: cover | contain | fill.       (default 'cover')
 *                With cover (the default) double-clicking the filled slot
 *                enters a reframe mode: the whole image spills past the mask
 *                (translucent outside, opaque inside), drag to reposition,
 *                corner-drag to scale. The crop persists alongside the image
 *                in the sidecar. contain/fill stay static.
 *   position     object-position for fit=contain|fill.     (default '50% 50%')
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. A user drop overrides
 *                it; clearing the drop reveals src again.
 *
 * Size and layout come from ordinary CSS on the element — width/height
 * inline or from a parent grid — so it composes with any layout.
 *
 * Usage:
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet = ':host{display:inline-block;position:relative;vertical-align:top;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(0,0,0,.55);width:240px;height:160px}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(0,0,0,.04)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  '.spill{position:absolute;transform:translate(-50%,-50%);display:none;z-index:1;' + '  cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .spill{display:block}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px;text-decoration-color:rgba(0,0,0,.25)}' + '.empty:hover .sub u{color:rgba(0,0,0,.75);text-decoration-color:currentColor}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed rgba(0,0,0,.25);' + '  transition:border-color .12s}' + ':host([data-over]) .ring{border-color:#c96442}' + ':host([data-filled]) .ring{display:none}' +
  // Controls sit BELOW the mask (top:100%), absolutely positioned so the
  // author-declared slot height is unaffected. The gap is padding, not a
  // top offset, so the hover target stays contiguous with the frame.
  '.ctl{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:8px;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'position', 'placeholder', 'src', 'id'];
    }
    constructor() {
      super();
      const root = this.attachShadow({
        mode: 'open'
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="ring" part="ring"></div>' + '</div>' + '<div class="spill">' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' + '<div class="ctl"><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="clear" title="Remove image">Remove</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (act === 'replace') {
          this._exitReframe(true);
          this._input.click();
        }
        if (act === 'clear') {
          this._exitReframe(false);
          this._gen++;
          this._local = null;
          if (this.id) setSlot(this.id, null);else this._render();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      this._img.addEventListener('load', () => this._applyView());
      // Gated on editable + fit=cover so share links and contain/fill slots
      // stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const base = Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (commit) this._commitView();
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is only meaningful for fit=cover — contain/fill
    // keep the old object-fit path and double-click is a no-op.
    _reframes() {
      return this.hasAttribute('data-filled') && (this.getAttribute('fit') || 'cover') === 'cover';
    }

    // Cover-baseline geometry, shared by clamp/apply/resize. Null until the
    // img has loaded (naturalWidth is 0 before that) or when the slot has no
    // layout box — ResizeObserver fires with a 0×0 rect under display:none,
    // and clamping against a degenerate 1×1 frame would silently pull the
    // stored pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      return {
        iw,
        ih,
        fw,
        fh,
        base: Math.max(fw / iw, fh / ih)
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      const fit = this.getAttribute('fit') || 'cover';
      if (fit !== 'cover' || !g) {
        // Non-cover, or dimensions not known yet (before img load).
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = fit;
        this._img.style.objectPosition = this.getAttribute('position') || '50% 50%';
        return;
      }
      // Cover baseline: img fills the frame on its tighter axis at s=1, so
      // pan works immediately on the overflowing axis without zooming first.
      // Width/height and left/top are all frame-% — depends only on the
      // frame aspect ratio, so a responsive resize keeps the same crop. The
      // spill layer mirrors the same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      this._spill.style.width = w;
      this._spill.style.height = h;
      this._spill.style.left = l;
      this._spill.style.top = t;
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      if (url) {
        if (this._img.getAttribute('src') !== url) {
          this._img.src = url;
          this._ghost.src = url;
        }
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        this._empty.style.display = 'flex';
        this.removeAttribute('data-filled');
      }
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/image-slot.js", error: String((e && e.message) || e) }); }

// export/blog-lebonrebond/assets/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever you want the user to
 * supply an image. You control the slot's shape and size; the user fills it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The host bridge only allows sidecar writes at the project root, so the
 * HTML that uses this component is assumed to live at the project root too
 * (same constraint as design_canvas.jsx).
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          object-fit: cover | contain | fill.       (default 'cover')
 *                With cover (the default) double-clicking the filled slot
 *                enters a reframe mode: the whole image spills past the mask
 *                (translucent outside, opaque inside), drag to reposition,
 *                corner-drag to scale. The crop persists alongside the image
 *                in the sidecar. contain/fill stay static.
 *   position     object-position for fit=contain|fill.     (default '50% 50%')
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. A user drop overrides
 *                it; clearing the drop reveals src again.
 *
 * Size and layout come from ordinary CSS on the element — width/height
 * inline or from a parent grid — so it composes with any layout.
 *
 * Usage:
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet = ':host{display:inline-block;position:relative;vertical-align:top;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(0,0,0,.55);width:240px;height:160px}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(0,0,0,.04)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  '.spill{position:absolute;transform:translate(-50%,-50%);display:none;z-index:1;' + '  cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .spill{display:block}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px;text-decoration-color:rgba(0,0,0,.25)}' + '.empty:hover .sub u{color:rgba(0,0,0,.75);text-decoration-color:currentColor}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed rgba(0,0,0,.25);' + '  transition:border-color .12s}' + ':host([data-over]) .ring{border-color:#c96442}' + ':host([data-filled]) .ring{display:none}' +
  // Controls sit BELOW the mask (top:100%), absolutely positioned so the
  // author-declared slot height is unaffected. The gap is padding, not a
  // top offset, so the hover target stays contiguous with the frame.
  '.ctl{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:8px;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'position', 'placeholder', 'src', 'id'];
    }
    constructor() {
      super();
      const root = this.attachShadow({
        mode: 'open'
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="ring" part="ring"></div>' + '</div>' + '<div class="spill">' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' + '<div class="ctl"><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="clear" title="Remove image">Remove</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (act === 'replace') {
          this._exitReframe(true);
          this._input.click();
        }
        if (act === 'clear') {
          this._exitReframe(false);
          this._gen++;
          this._local = null;
          if (this.id) setSlot(this.id, null);else this._render();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      this._img.addEventListener('load', () => this._applyView());
      // Gated on editable + fit=cover so share links and contain/fill slots
      // stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const base = Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (commit) this._commitView();
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is only meaningful for fit=cover — contain/fill
    // keep the old object-fit path and double-click is a no-op.
    _reframes() {
      return this.hasAttribute('data-filled') && (this.getAttribute('fit') || 'cover') === 'cover';
    }

    // Cover-baseline geometry, shared by clamp/apply/resize. Null until the
    // img has loaded (naturalWidth is 0 before that) or when the slot has no
    // layout box — ResizeObserver fires with a 0×0 rect under display:none,
    // and clamping against a degenerate 1×1 frame would silently pull the
    // stored pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      return {
        iw,
        ih,
        fw,
        fh,
        base: Math.max(fw / iw, fh / ih)
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      const fit = this.getAttribute('fit') || 'cover';
      if (fit !== 'cover' || !g) {
        // Non-cover, or dimensions not known yet (before img load).
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = fit;
        this._img.style.objectPosition = this.getAttribute('position') || '50% 50%';
        return;
      }
      // Cover baseline: img fills the frame on its tighter axis at s=1, so
      // pan works immediately on the overflowing axis without zooming first.
      // Width/height and left/top are all frame-% — depends only on the
      // frame aspect ratio, so a responsive resize keeps the same crop. The
      // spill layer mirrors the same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      this._spill.style.width = w;
      this._spill.style.height = h;
      this._spill.style.left = l;
      this._spill.style.top = t;
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      if (url) {
        if (this._img.getAttribute('src') !== url) {
          this._img.src = url;
          this._ghost.src = url;
        }
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        this._empty.style.display = 'flex';
        this.removeAttribute('data-filled');
      }
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/blog-lebonrebond/assets/image-slot.js", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/charts.jsx
try { (() => {
// ============================================================
// Charts — lightweight inline SVG (no library)
// ============================================================
const {
  useState: useStateC
} = React;

// Area / line chart for CA évolution
function AreaChart({
  data,
  height = 200,
  accent = "#2469a6"
}) {
  const [hover, setHover] = useStateC(null);
  const w = 560,
    h = height,
    padL = 8,
    padR = 8,
    padT = 18,
    padB = 26;
  const max = Math.max(...data.map(d => d.v)) * 1.12;
  const min = 0;
  const iw = w - padL - padR,
    ih = h - padT - padB;
  const x = i => padL + i / (data.length - 1) * iw;
  const y = v => padT + ih - (v - min) / (max - min) * ih;
  const pts = data.map((d, i) => [x(i), y(d.v)]);
  const linePath = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0] + " " + p[1]).join(" ");
  // smooth
  const smooth = (() => {
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1],
        [x1, y1] = pts[i];
      const cx = (x0 + x1) / 2;
      d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
    }
    return d;
  })();
  const area = smooth + ` L ${x(data.length - 1)} ${padT + ih} L ${x(0)} ${padT + ih} Z`;
  const projStart = data.findIndex(d => d.proj);
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    width: "100%",
    style: {
      display: "block",
      overflow: "visible"
    },
    onMouseLeave: () => setHover(null)
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "caGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: accent,
    stopOpacity: "0.20"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: accent,
    stopOpacity: "0"
  }))), [0, 0.25, 0.5, 0.75, 1].map((g, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: padL,
    x2: w - padR,
    y1: padT + ih * g,
    y2: padT + ih * g,
    stroke: "#eef0f3",
    strokeWidth: "1"
  })), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: "url(#caGrad)"
  }), /*#__PURE__*/React.createElement("path", {
    d: smooth,
    fill: "none",
    stroke: accent,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeDasharray: projStart > 0 ? undefined : undefined
  }), data.map((d, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("rect", {
    x: x(i) - iw / data.length / 2,
    y: padT,
    width: iw / data.length,
    height: ih,
    fill: "transparent",
    onMouseEnter: () => setHover(i)
  }), d.proj && /*#__PURE__*/React.createElement("circle", {
    cx: x(i),
    cy: y(d.v),
    r: "3.5",
    fill: "#fff",
    stroke: accent,
    strokeWidth: "2",
    strokeDasharray: "2 2"
  }), !d.proj && /*#__PURE__*/React.createElement("circle", {
    cx: x(i),
    cy: y(d.v),
    r: hover === i ? 5 : 3.5,
    fill: accent,
    stroke: "#fff",
    strokeWidth: "2",
    style: {
      transition: "r .1s"
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: x(i),
    y: h - 6,
    textAnchor: "middle",
    fontSize: "11",
    fontWeight: "600",
    fill: "#919aa8"
  }, d.m))), hover != null && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: x(hover),
    x2: x(hover),
    y1: padT,
    y2: padT + ih,
    stroke: accent,
    strokeWidth: "1",
    strokeDasharray: "3 3",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${Math.min(Math.max(x(hover), 38), w - 38)}, ${y(data[hover].v) - 14})`
  }, /*#__PURE__*/React.createElement("rect", {
    x: "-34",
    y: "-22",
    width: "68",
    height: "22",
    rx: "6",
    fill: "#15181f"
  }), /*#__PURE__*/React.createElement("text", {
    x: "0",
    y: "-7",
    textAnchor: "middle",
    fontSize: "11.5",
    fontWeight: "700",
    fill: "#fff"
  }, data[hover].v.toFixed(1).replace(".", ","), " k\u20AC"))));
}

// Horizontal bar chart — remplissage par formation
function BarRows({
  data,
  accentKey = "color"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, data.map(d => {
    const tone = d.remplissage >= 70 ? "var(--positive)" : d.remplissage < 40 ? "var(--danger)" : "var(--warn)";
    return /*#__PURE__*/React.createElement("div", {
      key: d.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "spread",
      style: {
        marginBottom: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: "var(--ink)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 3,
        background: d[accentKey],
        flex: "none"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, d.title)), /*#__PURE__*/React.createElement("span", {
      className: "tnum",
      style: {
        fontWeight: 700,
        fontSize: 13,
        color: tone,
        flex: "none",
        marginLeft: 10
      }
    }, d.remplissage, "%")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 9,
        borderRadius: 99,
        background: "var(--border-2)",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: d.remplissage + "%",
        borderRadius: 99,
        background: tone,
        transition: "width .6s cubic-bezier(.4,0,.2,1)"
      }
    })));
  }));
}

// Donut gauge
function Donut({
  value,
  size = 132,
  stroke = 14,
  color = "var(--primary)",
  label,
  sub
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - value / 100 * c;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: "rotate(-90deg)"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--border-2)",
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeDasharray: c,
    strokeDashoffset: off,
    strokeLinecap: "round",
    style: {
      transition: "stroke-dashoffset .7s cubic-bezier(.4,0,.2,1)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontSize: size * 0.26,
      fontWeight: 800,
      letterSpacing: "-0.03em"
    }
  }, label ?? value + "%"), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--ink-3)",
      fontWeight: 600,
      marginTop: 2
    }
  }, sub)));
}

// Mini sparkline
function Spark({
  data,
  color = "#2469a6",
  w = 80,
  h = 30
}) {
  const max = Math.max(...data),
    min = Math.min(...data);
  const pts = data.map((v, i) => [i / (data.length - 1) * w, h - (v - min) / (max - min || 1) * (h - 4) - 2]);
  const d = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h,
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
Object.assign(window, {
  AreaChart,
  BarRows,
  Donut,
  Spark
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/charts.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/components.jsx
try { (() => {
// ============================================================
// Shared chrome + primitives: Sidebar, Topbar, KpiCard, charts,
// Modal, Drawer, badges, helpers
// ============================================================
const {
  useState,
  useEffect,
  useRef
} = React;
const NAV = [{
  id: "dashboard",
  label: "Dashboard",
  icon: "dashboard"
}, {
  id: "formations",
  label: "Formations",
  icon: "book"
}, {
  id: "sessions",
  label: "Sessions",
  icon: "calendar"
}, {
  id: "planning",
  label: "Planning",
  icon: "calendar-range"
}, {
  id: "prospects",
  label: "Prospects",
  icon: "target",
  badge: 7
}, {
  id: "apprenants",
  label: "Apprenants",
  icon: "grad"
}, {
  id: "documents",
  label: "Documents",
  icon: "file-text",
  badge: 5
}, {
  id: "qualite",
  label: "Qualité",
  icon: "shield"
}, {
  id: "formateurs",
  label: "Formateurs",
  icon: "presentation"
}, {
  id: "assistant",
  label: "Assistant IA",
  icon: "sparkles"
}];
function Logo({
  size = 34,
  light = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 10,
      flex: "none",
      background: light ? "#fff" : "linear-gradient(140deg,#2f9488,#2469a6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: light ? "none" : "0 4px 12px rgba(36,105,166,.35)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size * 0.6,
    height: size * 0.6,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: light ? "#2469a6" : "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 17l5-5 4 3 7-8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 4h4v4"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 15.5,
      letterSpacing: "-0.025em",
      color: light ? "#fff" : "var(--ink)",
      whiteSpace: "nowrap"
    }
  }, "Le Bon Rebond"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: light ? "rgba(255,255,255,.6)" : "var(--ink-3)",
      marginTop: 2
    }
  }, "Formation")));
}
function Sidebar({
  view,
  setView
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: "var(--sidebar-w)",
      flex: "none",
      height: "100vh",
      position: "sticky",
      top: 0,
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "var(--topbar-h)",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement(Logo, null)), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "14px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--ink-4)",
      padding: "6px 12px 8px"
    }
  }, "Pilotage"), NAV.map(n => {
    const active = view === n.id;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => setView(n.id),
      style: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "9px 12px",
        borderRadius: 10,
        marginBottom: 2,
        background: active ? "var(--primary-50)" : "transparent",
        color: active ? "var(--primary-700)" : "var(--ink-2)",
        fontWeight: active ? 700 : 600,
        fontSize: 13.5,
        position: "relative",
        transition: "background .14s, color .14s"
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.background = "var(--surface-3)";
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.background = "transparent";
      }
    }, active && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        top: 8,
        bottom: 8,
        width: 3,
        borderRadius: 99,
        background: "var(--primary)"
      }
    }), /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: 18,
      stroke: active ? 2.2 : 2
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        textAlign: "left"
      }
    }, n.label), n.badge && /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 19,
        height: 19,
        padding: "0 5px",
        borderRadius: 99,
        background: active ? "var(--primary)" : "var(--surface-3)",
        color: active ? "#fff" : "var(--ink-3)",
        fontSize: 11,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, n.badge));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderTop: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("parametres"),
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "9px 12px",
      borderRadius: 10,
      color: view === "parametres" ? "var(--primary-700)" : "var(--ink-2)",
      background: view === "parametres" ? "var(--primary-50)" : "transparent",
      fontWeight: 600,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 18
  }), " Param\xE8tres"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 10px 4px",
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "avatar",
    style: {
      width: 34,
      height: 34,
      background: "linear-gradient(140deg,#2f9488,#2469a6)"
    }
  }, CENTER.user.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 12.5,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, CENTER.user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--ink-3)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, CENTER.name)), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--ink-3)"
    },
    title: "D\xE9connexion"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "logout",
    size: 16
  })))));
}
function Topbar({
  title,
  onNewSession
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: "var(--topbar-h)",
      position: "sticky",
      top: 0,
      zIndex: 20,
      background: "rgba(255,255,255,.82)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "0 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16.5,
      fontWeight: 800,
      letterSpacing: "-0.02em"
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 440,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 17,
    style: {
      position: "absolute",
      left: 13,
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--ink-4)"
    }
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Rechercher une formation, session, prospect\u2026",
    style: {
      paddingLeft: 38,
      paddingRight: 56,
      height: 40,
      background: "var(--surface-3)",
      border: "1px solid transparent"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 10,
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("kbd", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "var(--ink-3)",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 5,
      padding: "2px 5px",
      fontFamily: "var(--font)"
    }
  }, "\u2318K"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setNotifOpen(o => !o),
    className: "btn-secondary btn-icon",
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 7,
      right: 7,
      width: 7,
      height: 7,
      borderRadius: 99,
      background: "var(--danger)",
      border: "2px solid #fff"
    }
  })), notifOpen && /*#__PURE__*/React.createElement(NotifPanel, {
    onClose: () => setNotifOpen(false)
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onNewSession
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 17
  }), " Nouvelle session")));
}
function NotifPanel({
  onClose
}) {
  useEffect(() => {
    const h = () => onClose();
    const t = setTimeout(() => document.addEventListener("click", h), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", h);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: "absolute",
      right: 0,
      top: 48,
      width: 360,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 14,
      boxShadow: "var(--shadow-pop)",
      zIndex: 50,
      overflow: "hidden"
    },
    className: "fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      padding: "14px 16px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 14
    }
  }, "Notifications"), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-danger"
  }, "3 nouvelles")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 340,
      overflowY: "auto"
    }
  }, ALERTS.slice(0, 4).map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: "flex",
      gap: 11,
      padding: "13px 16px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement(AlertGlyph, {
    type: a.type,
    icon: a.icon,
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, a.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-2)",
      marginTop: 2,
      lineHeight: 1.4
    }
  }, a.text))))), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    style: {
      width: "100%",
      padding: "11px",
      fontSize: 13,
      fontWeight: 700,
      color: "var(--primary)",
      borderTop: "1px solid var(--border-2)"
    }
  }, "Tout marquer comme lu"));
}
function AlertGlyph({
  type,
  icon,
  size = 36
}) {
  const map = {
    danger: ["var(--danger-bg)", "var(--danger)"],
    warn: ["var(--warn-bg)", "var(--warn-strong)"],
    primary: ["var(--primary-50)", "var(--primary)"],
    positive: ["var(--positive-bg)", "var(--positive-600)"]
  };
  const [bg, fg] = map[type] || map.primary;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 9,
      background: bg,
      color: fg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: size * 0.5
  }));
}

// ---------- Page header ----------
function PageHeader({
  title,
  subtitle,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 22,
      gap: 16,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 23,
      fontWeight: 800
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--ink-2)",
      marginTop: 5,
      fontSize: 14
    }
  }, subtitle)), children && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, children));
}

// ---------- Status badge for sessions ----------
function SessionBadge({
  statut
}) {
  const map = {
    ouverte: ["badge-positive", "Ouverte"],
    complete: ["badge-primary", "Complète"],
    risque: ["badge-danger", "À risque"],
    terminee: ["badge-neutral", "Terminée"]
  };
  const [cls, label] = map[statut] || map.ouverte;
  return /*#__PURE__*/React.createElement("span", {
    className: "badge " + cls
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), label);
}

// ---------- Fill bar with % ----------
function FillBar({
  value,
  seuil,
  width = 110
}) {
  const tone = value >= 70 ? "positive" : value < 40 ? "danger" : "warn";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress " + tone,
    style: {
      width,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: value + "%"
    }
  }), seuil != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: `${seuil}%`,
      top: -2,
      bottom: -2,
      width: 2,
      background: "var(--ink)",
      opacity: .35,
      borderRadius: 2
    },
    title: "Seuil " + seuil + "%"
  })), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontWeight: 700,
      fontSize: 13,
      color: tone === "danger" ? "var(--danger-strong)" : tone === "positive" ? "var(--positive-600)" : "var(--warn-strong)",
      minWidth: 34
    }
  }, value, "%"));
}

// ---------- Modal ----------
function Modal({
  open,
  onClose,
  title,
  children,
  width = 540,
  footer
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      background: "rgba(20,24,35,.42)",
      backdropFilter: "blur(3px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    },
    className: "fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "fade-up",
    style: {
      width,
      maxWidth: "100%",
      maxHeight: "90vh",
      background: "var(--surface)",
      borderRadius: 18,
      boxShadow: "var(--shadow-pop)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      padding: "18px 22px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 17
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "btn-ghost btn-icon",
    style: {
      color: "var(--ink-3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22,
      overflowY: "auto"
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 22px",
      borderTop: "1px solid var(--border-2)",
      display: "flex",
      justifyContent: "flex-end",
      gap: 10,
      background: "var(--surface-2)"
    }
  }, footer)));
}

// ---------- Drawer (right) ----------
function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 480,
  footer,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      pointerEvents: open ? "auto" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(20,24,35,.42)",
      backdropFilter: "blur(3px)",
      opacity: open ? 1 : 0,
      transition: "opacity .28s"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width,
      maxWidth: "100%",
      background: "var(--surface)",
      boxShadow: "var(--shadow-pop)",
      display: "flex",
      flexDirection: "column",
      transform: open ? "none" : "translateX(100%)",
      transition: "transform .3s cubic-bezier(.4,0,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 22px",
      borderBottom: "1px solid var(--border-2)",
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      background: accent ? "var(--primary-tint)" : "transparent"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 17
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--ink-2)",
      fontSize: 13,
      marginTop: 3
    }
  }, subtitle)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "btn-ghost btn-icon",
    style: {
      color: "var(--ink-3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 22
    }
  }, open && children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 22px",
      borderTop: "1px solid var(--border-2)",
      display: "flex",
      gap: 10,
      background: "var(--surface-2)"
    }
  }, footer)));
}

// ---------- Empty state ----------
function EmptyState({
  icon = "search",
  title,
  text,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "56px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 14,
      background: "var(--surface-3)",
      color: "var(--ink-3)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15
    }
  }, title), text && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--ink-2)",
      fontSize: 13.5,
      marginTop: 5,
      maxWidth: 320,
      margin: "5px auto 0"
    }
  }, text), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, action));
}
Object.assign(window, {
  NAV,
  Logo,
  Sidebar,
  Topbar,
  AlertGlyph,
  PageHeader,
  SessionBadge,
  FillBar,
  Modal,
  Drawer,
  EmptyState,
  NotifPanel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/components.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/data.jsx
try { (() => {
// ============================================================
// Le Bon Rebond Formation — fictional data
// Académie Horizon Formation
// ============================================================

const CENTER = {
  name: "Académie Horizon Formation",
  short: "AHF",
  desc: "Centre de formation spécialisé en bureautique, IA, finance d'entreprise et compétences digitales pour PME.",
  user: {
    name: "Camille Rivière",
    role: "Responsable pédagogique",
    initials: "CR"
  }
};
const FORMATIONS = [{
  id: "excel",
  title: "Excel Avancé pour PME",
  cat: "Bureautique",
  duree: "2 jours",
  heures: 14,
  prix: 690,
  modalite: "Présentiel",
  remplissage: 42,
  sessions: 3,
  formateur: "Claire Martin",
  color: "#2f7fc4"
}, {
  id: "powerbi",
  title: "Power BI — Construire un tableau de bord",
  cat: "Data & BI",
  duree: "3 jours",
  heures: 21,
  prix: 990,
  modalite: "Hybride",
  remplissage: 75,
  sessions: 4,
  formateur: "Claire Martin",
  color: "#2469a6"
}, {
  id: "ia",
  title: "Initiation à l'IA pour fonctions administratives",
  cat: "Intelligence artificielle",
  duree: "1 jour",
  heures: 7,
  prix: 390,
  modalite: "Distanciel",
  remplissage: 28,
  sessions: 2,
  formateur: "Julien Moreau",
  color: "#129a93"
}, {
  id: "finance",
  title: "Finance d'entreprise pour dirigeants",
  cat: "Finance & Gestion",
  duree: "2 jours",
  heures: 14,
  prix: 850,
  modalite: "Présentiel",
  remplissage: 64,
  sessions: 2,
  formateur: "Sarah Benali",
  color: "#d9821f"
}];
const FORMATEURS = [{
  id: "claire",
  name: "Claire Martin",
  initials: "CM",
  specialites: ["Excel", "Power BI"],
  color: "#2469a6",
  dispo: "Disponible",
  occupation: 72,
  sessions: 4,
  confirme: true,
  email: "claire.martin@horizon-formation.fr",
  tel: "06 12 34 56 78"
}, {
  id: "julien",
  name: "Julien Moreau",
  initials: "JM",
  specialites: ["IA", "Automatisation"],
  color: "#129a93",
  dispo: "Disponible",
  occupation: 48,
  sessions: 2,
  confirme: true,
  email: "julien.moreau@horizon-formation.fr",
  tel: "06 23 45 67 89"
}, {
  id: "sarah",
  name: "Sarah Benali",
  initials: "SB",
  specialites: ["Finance", "Gestion"],
  color: "#d9821f",
  dispo: "Partielle",
  occupation: 55,
  sessions: 2,
  confirme: true,
  email: "sarah.benali@horizon-formation.fr",
  tel: "06 34 56 78 90"
}, {
  id: "thomas",
  name: "Thomas Girard",
  initials: "TG",
  specialites: ["Digital", "No-code"],
  color: "#2f7fc4",
  dispo: "À confirmer",
  occupation: 30,
  sessions: 1,
  confirme: false,
  email: "thomas.girard@horizon-formation.fr",
  tel: "06 45 67 89 01"
}];
const SESSIONS = [{
  id: "s1",
  formation: "Power BI — Tableau de bord",
  fid: "powerbi",
  date: "12–14 juin 2026",
  dateShort: "12 juin",
  formateur: "Claire Martin",
  fInit: "CM",
  fColor: "#2469a6",
  capacite: 12,
  inscrits: 9,
  seuil: 6,
  statut: "ouverte"
}, {
  id: "s2",
  formation: "Excel Avancé pour PME",
  fid: "excel",
  date: "16–17 juin 2026",
  dateShort: "16 juin",
  formateur: "Non confirmé",
  fInit: "?",
  fColor: "#b6bdc8",
  capacite: 12,
  inscrits: 5,
  seuil: 6,
  statut: "risque"
}, {
  id: "s3",
  formation: "Initiation à l'IA — fonctions admin.",
  fid: "ia",
  date: "21 juin 2026",
  dateShort: "21 juin",
  formateur: "Julien Moreau",
  fInit: "JM",
  fColor: "#129a93",
  capacite: 14,
  inscrits: 4,
  seuil: 10,
  statut: "risque"
}, {
  id: "s4",
  formation: "Finance d'entreprise — dirigeants",
  fid: "finance",
  date: "24–25 juin 2026",
  dateShort: "24 juin",
  formateur: "Sarah Benali",
  fInit: "SB",
  fColor: "#d9821f",
  capacite: 10,
  inscrits: 8,
  seuil: 5,
  statut: "ouverte"
}, {
  id: "s5",
  formation: "Power BI — Tableau de bord",
  fid: "powerbi",
  date: "30 juin – 2 juil. 2026",
  dateShort: "30 juin",
  formateur: "Claire Martin",
  fInit: "CM",
  fColor: "#2469a6",
  capacite: 12,
  inscrits: 12,
  seuil: 6,
  statut: "complete"
}, {
  id: "s6",
  formation: "Excel Avancé pour PME",
  fid: "excel",
  date: "5–6 mai 2026",
  dateShort: "5 mai",
  formateur: "Claire Martin",
  fInit: "CM",
  fColor: "#2469a6",
  capacite: 12,
  inscrits: 11,
  seuil: 6,
  statut: "terminee"
}, {
  id: "s7",
  formation: "Initiation à l'IA — fonctions admin.",
  fid: "ia",
  date: "9 juil. 2026",
  dateShort: "9 juil.",
  formateur: "Julien Moreau",
  fInit: "JM",
  fColor: "#129a93",
  capacite: 14,
  inscrits: 6,
  seuil: 10,
  statut: "ouverte"
}];
const PROSPECTS = [{
  id: "p1",
  name: "Cabinet Nova RH",
  contact: "Léa Fontaine",
  formation: "Initiation à l'IA",
  montant: 2730,
  action: "Envoyer programme détaillé",
  relance: "5 juin",
  col: "nouveau",
  chaud: true
}, {
  id: "p2",
  name: "Groupe Soleil PME",
  contact: "Marc Dubois",
  formation: "Power BI",
  montant: 5940,
  action: "Appeler le décideur",
  relance: "6 juin",
  col: "contacte",
  chaud: true
}, {
  id: "p3",
  name: "Marie Lambert",
  contact: "Marie Lambert",
  formation: "Excel Avancé",
  montant: 690,
  action: "Relancer par email",
  relance: "5 juin",
  col: "relance",
  chaud: false
}, {
  id: "p4",
  name: "BTP Caraïbes Services",
  contact: "Patrick Adèle",
  formation: "Finance d'entreprise",
  montant: 3400,
  action: "Envoyer devis",
  relance: "8 juin",
  col: "devis",
  chaud: true
}, {
  id: "p5",
  name: "Cabinet Delta Conseil",
  contact: "Sophie Reyes",
  formation: "Power BI",
  montant: 2970,
  action: "Relancer devis envoyé",
  relance: "9 juin",
  col: "relance",
  chaud: false
}, {
  id: "p6",
  name: "Atelier Méridien",
  contact: "Hugo Petit",
  formation: "Excel Avancé",
  montant: 1380,
  action: "Programmer session",
  relance: "—",
  col: "gagne",
  chaud: false
}, {
  id: "p7",
  name: "Studio Lagon Digital",
  contact: "Inès Roy",
  formation: "IA fonctions admin.",
  montant: 1560,
  action: "Confirmer dates",
  relance: "—",
  col: "gagne",
  chaud: false
}, {
  id: "p8",
  name: "Cabinet Vertige",
  contact: "Tom Mercier",
  formation: "Finance d'entreprise",
  montant: 1700,
  action: "—",
  relance: "—",
  col: "contacte",
  chaud: false
}, {
  id: "p9",
  name: "PME Horizon Bleu",
  contact: "Nadia Sloan",
  formation: "Power BI",
  montant: 990,
  action: "Budget non validé",
  relance: "—",
  col: "perdu",
  chaud: false
}, {
  id: "p10",
  name: "Cabinet Aurore",
  contact: "Éric Lemoine",
  formation: "Excel Avancé",
  montant: 690,
  action: "Premier contact",
  relance: "7 juin",
  col: "nouveau",
  chaud: false
}];
const CRM_COLS = [{
  id: "nouveau",
  label: "Nouveau",
  color: "#919aa8"
}, {
  id: "contacte",
  label: "Contacté",
  color: "#2f7fc4"
}, {
  id: "devis",
  label: "Devis envoyé",
  color: "#2469a6"
}, {
  id: "relance",
  label: "Relance",
  color: "#d9821f"
}, {
  id: "gagne",
  label: "Gagné",
  color: "#18996b"
}, {
  id: "perdu",
  label: "Perdu",
  color: "#dc5147"
}];
const APPRENANTS = [{
  id: "a1",
  name: "Antoine Berger",
  initials: "AB",
  entreprise: "Soleil PME",
  formation: "Power BI",
  session: "12 juin",
  statut: "Inscrit",
  presence: "—",
  doc: "Convocation",
  satisfaction: null
}, {
  id: "a2",
  name: "Fatou Camara",
  initials: "FC",
  entreprise: "Nova RH",
  formation: "IA fonctions admin.",
  session: "21 juin",
  statut: "Inscrit",
  presence: "—",
  doc: "À envoyer",
  satisfaction: null
}, {
  id: "a3",
  name: "Lucas Henry",
  initials: "LH",
  entreprise: "Delta Conseil",
  formation: "Power BI",
  session: "12 juin",
  statut: "Confirmé",
  presence: "—",
  doc: "Convocation",
  satisfaction: null
}, {
  id: "a4",
  name: "Émilie Roux",
  initials: "ER",
  entreprise: "Caraïbes Services",
  formation: "Finance d'entreprise",
  session: "24 juin",
  statut: "Confirmé",
  presence: "—",
  doc: "Convocation",
  satisfaction: null
}, {
  id: "a5",
  name: "Karim Saïdi",
  initials: "KS",
  entreprise: "Méridien",
  formation: "Excel Avancé",
  session: "5 mai",
  statut: "Terminé",
  presence: "Présent",
  doc: "Attestation",
  satisfaction: 5
}, {
  id: "a6",
  name: "Chloé Marchand",
  initials: "CM",
  entreprise: "Lagon Digital",
  formation: "Excel Avancé",
  session: "5 mai",
  statut: "Terminé",
  presence: "Présent",
  doc: "Attestation",
  satisfaction: 4
}, {
  id: "a7",
  name: "Yann Le Goff",
  initials: "YL",
  entreprise: "Vertige",
  formation: "Excel Avancé",
  session: "5 mai",
  statut: "Terminé",
  presence: "Absent",
  doc: "—",
  satisfaction: null
}, {
  id: "a8",
  name: "Sabrina Ndiaye",
  initials: "SN",
  entreprise: "Aurore",
  formation: "Power BI",
  session: "30 juin",
  statut: "Inscrit",
  presence: "—",
  doc: "À envoyer",
  satisfaction: null
}];
const ALERTS = [{
  id: "al1",
  type: "danger",
  icon: "alert-triangle",
  title: "Session IA du 21 juin en risque",
  text: "Remplie à 28 % — sous le seuil de rentabilité. Il manque 6 inscriptions.",
  action: "Générer relance"
}, {
  id: "al2",
  type: "warn",
  icon: "user-x",
  title: "Formateur non confirmé",
  text: "Aucun formateur confirmé pour la session Excel Avancé du 16 juin.",
  action: "Affecter un formateur"
}, {
  id: "al3",
  type: "warn",
  icon: "send",
  title: "7 prospects à relancer",
  text: "7 prospects Power BI / Excel attendent une relance cette semaine.",
  action: "Voir les prospects"
}, {
  id: "al4",
  type: "primary",
  icon: "file-text",
  title: "3 attestations à générer",
  text: "Session Excel Avancé du 5 mai — 3 attestations en attente.",
  action: "Générer les documents"
}, {
  id: "al5",
  type: "primary",
  icon: "clipboard",
  title: "2 questionnaires à envoyer",
  text: "Questionnaires de satisfaction non envoyés pour 2 sessions terminées.",
  action: "Envoyer"
}];

// CA prévisionnel evolution (k€) — months
const CA_SERIES = [{
  m: "Jan",
  v: 14.2
}, {
  m: "Fév",
  v: 16.8
}, {
  m: "Mar",
  v: 15.1
}, {
  m: "Avr",
  v: 19.4
}, {
  m: "Mai",
  v: 21.0
}, {
  m: "Juin",
  v: 24.85
}, {
  m: "Juil",
  v: 22.3,
  proj: true
}, {
  m: "Août",
  v: 18.0,
  proj: true
}];
const KPIS = [{
  id: "ca",
  label: "CA prévisionnel",
  value: "24 850 €",
  delta: "+18 %",
  deltaPos: true,
  sub: "vs. mai",
  icon: "trending-up"
}, {
  id: "sessions",
  label: "Sessions à venir",
  value: "12",
  delta: "+3",
  deltaPos: true,
  sub: "ce trimestre",
  icon: "calendar"
}, {
  id: "remplissage",
  label: "Taux de remplissage moyen",
  value: "58 %",
  delta: "−4 pts",
  deltaPos: false,
  sub: "objectif 70 %",
  icon: "gauge"
}, {
  id: "prospects",
  label: "Prospects actifs",
  value: "34",
  delta: "+9",
  deltaPos: true,
  sub: "pipeline",
  icon: "users"
}, {
  id: "relances",
  label: "Relances à faire",
  value: "7",
  delta: "cette semaine",
  deltaPos: null,
  sub: "",
  icon: "send",
  urgent: true
}, {
  id: "docs",
  label: "Documents à générer",
  value: "5",
  delta: "en attente",
  deltaPos: null,
  sub: "",
  icon: "file-text",
  urgent: true
}];
Object.assign(window, {
  CENTER,
  FORMATIONS,
  FORMATEURS,
  SESSIONS,
  PROSPECTS,
  CRM_COLS,
  APPRENANTS,
  ALERTS,
  CA_SERIES,
  KPIS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/data.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/icons.jsx
try { (() => {
// ============================================================
// Icons — Lucide-style outline paths (2px stroke, round caps)
// ============================================================
const ICON_PATHS = {
  "dashboard": '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  "book": '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  "calendar": '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  "calendar-range": '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M17 14h.01M7 14h.01M11 14h2"/>',
  "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  "grad": '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  "presentation": '<path d="M2 3h20M21 3v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3M7 21l5-4 5 4M12 17v-2"/>',
  "sparkles": '<path d="M9.94 14.34 12 22l2.06-7.66L21 12l-6.94-2.34L12 2l-2.06 7.66L3 12z"/><path d="M19 3v4M21 5h-4M5 18v2M6 19H4"/>',
  "settings": '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  "search": '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  "bell": '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  "plus": '<path d="M5 12h14M12 5v14"/>',
  "trending-up": '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  "gauge": '<path d="m12 14 4-4M3.34 19a10 10 0 1 1 17.32 0"/>',
  "send": '<path d="M14.54 8.46 2 13l8 3 3 8 4.54-12.54z" transform="translate(1 -1)"/><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  "alert-triangle": '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><path d="M12 9v4M12 17h.01"/>',
  "user-x": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m17 8 5 5M22 8l-5 5"/>',
  "clipboard": '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  "chevron-left": '<path d="m15 18-6-6 6-6"/>',
  "x": '<path d="M18 6 6 18M6 6l12 12"/>',
  "check": '<path d="M20 6 9 17l-5-5"/>',
  "check-circle": '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  "arrow-up-right": '<path d="M7 7h10v10M7 17 17 7"/>',
  "arrow-right": '<path d="M5 12h14M12 5l7 7-7 7"/>',
  "more": '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  "download": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  "mail": '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
  "clock": '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  "map-pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  "filter": '<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>',
  "external": '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  "edit": '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
  "eye": '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  "star": '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  "phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  "zap": '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  "target": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  "list-checks": '<path d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8"/>',
  "message": '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>',
  "building": '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>',
  "euro": '<path d="M14 5.5a5 5 0 1 0 0 13M4 11h7M4 15h7"/>',
  "percent": '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  "layers": '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  "wand": '<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M15 9h0M17.8 6.2 19 5M3 21l9-9M12.2 6.2 11 5"/>',
  "refresh": '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5"/>',
  "play": '<polygon points="6 3 20 12 6 21 6 3"/>',
  "circle": '<circle cx="12" cy="12" r="10"/>',
  "logout": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  "menu": '<path d="M4 12h16M4 6h16M4 18h16"/>',
  "command": '<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>',
  "dot-grid": '<circle cx="5" cy="5" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="19" cy="5" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  "user": '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  "user-check": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
  "video": '<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  "globe": '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  "copy": '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  "smile": '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  "thumbs-up": '<path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88z"/>',
  "alert-circle": '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  "trophy": '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/>'
};
function Icon({
  name,
  size = 18,
  stroke = 2,
  fill = "none",
  className = "",
  style = {}
}) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: fill,
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: style,
    dangerouslySetInnerHTML: {
      __html: d
    }
  });
}
Object.assign(window, {
  Icon,
  ICON_PATHS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/icons.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/page_apprenants.jsx
try { (() => {
// ============================================================
// Apprenants — table with actions
// ============================================================
const {
  useState: useStateA
} = React;
function StatutChip({
  s
}) {
  const map = {
    "Inscrit": "badge-neutral",
    "Confirmé": "badge-sky",
    "Terminé": "badge-positive"
  };
  return /*#__PURE__*/React.createElement("span", {
    className: "badge " + (map[s] || "badge-neutral")
  }, s);
}
function PresenceChip({
  p
}) {
  if (p === "Présent") return /*#__PURE__*/React.createElement("span", {
    className: "badge badge-positive"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12
  }), "Pr\xE9sent");
  if (p === "Absent") return /*#__PURE__*/React.createElement("span", {
    className: "badge badge-danger"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 12
  }), "Absent");
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-4)"
    }
  }, "\u2014");
}
function Stars({
  n
}) {
  if (!n) return /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-4)"
    }
  }, "\u2014");
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap: 1,
      color: "var(--warn)"
    }
  }, [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(Icon, {
    key: i,
    name: "star",
    size: 13,
    fill: i <= n ? "var(--warn)" : "none",
    stroke: i <= n ? "var(--warn)" : "var(--ink-4)"
  })));
}
function ApprenantsPage() {
  const [sel, setSel] = useStateA([]);
  const toggle = id => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const all = sel.length === APPRENANTS.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Apprenants",
    subtitle: `${APPRENANTS.length} apprenants suivis · ${APPRENANTS.filter(a => a.statut !== "Terminé").length} sessions en cours`
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " Exporter"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Ajouter un apprenant")), sel.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: "10px 16px",
      marginBottom: 14,
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "var(--primary-tint)",
      borderColor: "var(--primary-100)"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 13
    }
  }, sel.length, " s\xE9lectionn\xE9", sel.length > 1 ? "s" : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginLeft: "auto",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 14
  }), " Convocation"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14
  }), " Marquer pr\xE9sent"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text",
    size: 14
  }), " Attestation"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clipboard",
    size: 14
  }), " Questionnaire"))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl",
    style: {
      minWidth: 940
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: 38
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: all,
    onChange: () => setSel(all ? [] : APPRENANTS.map(a => a.id)),
    style: {
      accentColor: "var(--primary)",
      width: 15,
      height: 15
    }
  })), /*#__PURE__*/React.createElement("th", null, "Apprenant"), /*#__PURE__*/React.createElement("th", null, "Entreprise"), /*#__PURE__*/React.createElement("th", null, "Formation"), /*#__PURE__*/React.createElement("th", null, "Session"), /*#__PURE__*/React.createElement("th", null, "Statut"), /*#__PURE__*/React.createElement("th", null, "Pr\xE9sence"), /*#__PURE__*/React.createElement("th", null, "Satisfaction"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, APPRENANTS.map(a => /*#__PURE__*/React.createElement("tr", {
    key: a.id,
    style: {
      background: sel.includes(a.id) ? "var(--primary-tint)" : undefined
    }
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: sel.includes(a.id),
    onChange: () => toggle(a.id),
    style: {
      accentColor: "var(--primary)",
      width: 15,
      height: 15
    }
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 30,
      height: 30,
      fontSize: 11,
      background: "var(--primary)"
    }
  }, a.initials), /*#__PURE__*/React.createElement("strong", null, a.name))), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, a.entreprise), /*#__PURE__*/React.createElement("td", {
    style: {
      maxWidth: 160
    }
  }, a.formation), /*#__PURE__*/React.createElement("td", {
    className: "muted"
  }, a.session), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatutChip, {
    s: a.statut
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(PresenceChip, {
    p: a.presence
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Stars, {
    n: a.satisfaction
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-icon",
    style: {
      width: 30,
      height: 30,
      color: "var(--ink-3)"
    },
    title: "Convocation"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 15
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-icon",
    style: {
      width: 30,
      height: 30,
      color: "var(--ink-3)"
    },
    title: "Attestation"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text",
    size: 15
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-icon",
    style: {
      width: 30,
      height: 30,
      color: "var(--ink-3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "more",
    size: 15
  })))))))))));
}
Object.assign(window, {
  ApprenantsPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/page_apprenants.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/page_assistant.jsx
try { (() => {
// ============================================================
// Assistant IA — action cards + conversation
// ============================================================
const {
  useState: useStateAI,
  useRef: useRefAI,
  useEffect: useEffectAI
} = React;
const AI_ACTIONS = [{
  id: "resume",
  icon: "list-checks",
  t: "Générer un résumé hebdomadaire",
  d: "Synthèse de votre activité et priorités"
}, {
  id: "risque",
  icon: "alert-triangle",
  t: "Identifier les sessions à risque",
  d: "Sous le seuil de rentabilité"
}, {
  id: "relance",
  icon: "send",
  t: "Rédiger une relance commerciale",
  d: "Email personnalisé pour un prospect"
}, {
  id: "desc",
  icon: "book",
  t: "Créer une description de formation",
  d: "Texte vendeur orienté PME"
}, {
  id: "quest",
  icon: "clipboard",
  t: "Générer un questionnaire satisfaction",
  d: "Évaluation à chaud prête à envoyer"
}, {
  id: "synth",
  icon: "message",
  t: "Synthétiser les retours apprenants",
  d: "Points forts et axes d'amélioration"
}, {
  id: "creneaux",
  icon: "calendar-range",
  t: "Proposer des créneaux optimaux",
  d: "Selon disponibilités et salles"
}];
const AI_REPLIES = {
  default: "Vous avez 3 priorités : remplir la session IA du 21 juin, relancer 7 prospects Power BI/Excel et confirmer le formateur de la session Excel Avancé. Je recommande de lancer une relance ciblée aujourd'hui.",
  risque: "2 sessions sont sous leur seuil de rentabilité : « Initiation à l'IA » du 21 juin (28 %, –6 inscrits) et « Excel Avancé » du 16 juin (42 %, formateur non confirmé). Je peux préparer une relance pour chacune.",
  resume: "Cette semaine : CA prévisionnel à 24 850 € (+18 %), 12 sessions à venir, remplissage moyen 58 %. Points d'attention : 2 sessions à risque, 7 relances et 1 formateur à confirmer. Bonne dynamique sur Power BI (75 %).",
  relance: "J'ai préparé une relance pour Groupe Soleil PME (Power BI, 5 940 €). Ton chaleureux, mise en avant d'une session imminente et proposition d'un échange de 15 min. Voulez-vous l'envoyer ou l'ajuster ?",
  creneaux: "Pour Excel Avancé (2 jours), les meilleurs créneaux sont : Mardi 18 juin matin (92 %), Jeudi 20 juin après-midi (88 %). Vendredi 21 est déconseillé (conflit de salle)."
};
function AssistantPage() {
  const [msgs, setMsgs] = useStateAI([{
    role: "user",
    text: "Quelles sont les actions prioritaires cette semaine ?"
  }, {
    role: "ai",
    text: AI_REPLIES.default,
    chips: ["Créer campagne de relance", "Voir sessions à risque", "Générer documents"]
  }]);
  const [typing, setTyping] = useStateAI(false);
  const [input, setInput] = useStateAI("");
  const scrollRef = useRefAI(null);
  useEffectAI(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);
  const send = (text, replyKey) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, {
      role: "user",
      text
    }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = AI_REPLIES[replyKey] || AI_REPLIES.default;
      const chips = replyKey === "risque" ? ["Générer 2 relances", "Optimiser le planning"] : ["Créer campagne de relance", "Voir sessions à risque", "Générer documents"];
      setMsgs(m => [...m, {
        role: "ai",
        text: reply,
        chips
      }]);
    }, 1100);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 380px",
      gap: 22,
      height: "calc(100vh - var(--topbar-h) - 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 22px",
      borderBottom: "1px solid var(--border-2)",
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "linear-gradient(120deg,#eef4fa,#fff)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 10,
      background: "linear-gradient(140deg,#2f9488,#2469a6)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(36,105,166,.3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 19
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 15
    }
  }, "Assistant Le Bon Rebond"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)"
    }
  }, "Orient\xE9 action \xB7 conna\xEEt votre activit\xE9")), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-primary"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), "En ligne")), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 22,
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, msgs.map((m, i) => m.role === "user" ? /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      alignSelf: "flex-end",
      maxWidth: "78%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--primary)",
      color: "#fff",
      padding: "11px 15px",
      borderRadius: "14px 14px 4px 14px",
      fontSize: 14,
      lineHeight: 1.5
    }
  }, m.text)) : /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      alignSelf: "flex-start",
      maxWidth: "82%",
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: "linear-gradient(140deg,#2f9488,#2469a6)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 15
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-3)",
      padding: "12px 15px",
      borderRadius: "14px 14px 14px 4px",
      fontSize: 14,
      lineHeight: 1.6
    }
  }, m.text), m.chips && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 10,
      flexWrap: "wrap"
    }
  }, m.chips.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => send(c, /risque/i.test(c) ? "risque" : /relance/i.test(c) ? "relance" : "default"),
    className: "badge badge-primary",
    style: {
      height: 30,
      padding: "0 12px",
      cursor: "pointer",
      fontWeight: 600
    }
  }, c)))))), typing && /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: "flex-start",
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: "linear-gradient(140deg,#2f9488,#2469a6)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-3)",
      padding: "14px 16px",
      borderRadius: 14,
      display: "flex",
      gap: 5
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 7,
      height: 7,
      borderRadius: 99,
      background: "var(--ink-4)",
      animation: `blink 1.2s ${i * 0.2}s infinite`
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "input",
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") send(input);
    },
    placeholder: "Posez une question ou demandez une action\u2026",
    style: {
      paddingRight: 48,
      height: 46
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => send(input),
    className: "btn btn-ai btn-icon",
    style: {
      position: "absolute",
      right: 6,
      top: 6,
      width: 34,
      height: 34
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 16
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
      overflowY: "auto",
      paddingRight: 2
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5
    }
  }, "Actions rapides"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-3)",
      marginTop: 3
    }
  }, "L'IA ex\xE9cute ces t\xE2ches \xE0 partir de vos donn\xE9es.")), AI_ACTIONS.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.id,
    onClick: () => send(a.t, a.id),
    className: "card",
    style: {
      padding: 15,
      display: "flex",
      gap: 12,
      alignItems: "center",
      textAlign: "left",
      cursor: "pointer",
      transition: "transform .14s, box-shadow .14s, border-color .14s"
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "var(--shadow)";
      e.currentTarget.style.borderColor = "var(--primary-200)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      e.currentTarget.style.borderColor = "var(--border)";
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 10,
      background: "var(--primary-50)",
      color: "var(--primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, a.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      marginTop: 2
    }
  }, a.d)), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 16,
    style: {
      color: "var(--ink-4)"
    }
  })))));
}

// ============================================================
// Paramètres
// ============================================================
function ParametresPage() {
  const tabs = ["Centre", "Équipe", "Facturation", "Notifications"];
  const [tab, setTab] = useStateAI("Centre");
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Param\xE8tres",
    subtitle: "G\xE9rez les informations de votre centre et votre abonnement."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "200px 1fr",
      gap: 24,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setTab(t),
    style: {
      textAlign: "left",
      padding: "10px 14px",
      borderRadius: 10,
      fontSize: 13.5,
      fontWeight: tab === t ? 700 : 600,
      color: tab === t ? "var(--primary-700)" : "var(--ink-2)",
      background: tab === t ? "var(--primary-50)" : "transparent"
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      marginBottom: 18
    }
  }, "Informations du centre"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Nom du centre"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    defaultValue: CENTER.name
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Description"), /*#__PURE__*/React.createElement("textarea", {
    className: "input",
    rows: 3,
    defaultValue: CENTER.desc
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Site web"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    defaultValue: "academie-horizon.fr"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Email de contact"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    defaultValue: "contact@horizon-formation.fr"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      alignSelf: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Enregistrer")))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      background: "linear-gradient(120deg,#eef4fa,#fff)",
      borderColor: "var(--primary-100)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      borderRadius: 12,
      background: "linear-gradient(140deg,#2f9488,#2469a6)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 15
    }
  }, "Plan Pro \xB7 actif"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, "Prochaine facturation le 1\u1D49\u02B3 juillet 2026 \xB7 49 \u20AC/mois")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, "G\xE9rer l'abonnement")))));
}
Object.assign(window, {
  AssistantPage,
  ParametresPage,
  AI_ACTIONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/page_assistant.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/page_dashboard.jsx
try { (() => {
// ============================================================
// Dashboard — the showpiece
// ============================================================
const {
  useState: useStateD
} = React;
function KpiCard({
  k,
  onClick
}) {
  const deltaColor = k.deltaPos === true ? "var(--positive-600)" : k.deltaPos === false ? "var(--danger-strong)" : "var(--ink-3)";
  const deltaBg = k.deltaPos === true ? "var(--positive-bg)" : k.deltaPos === false ? "var(--danger-bg)" : "var(--surface-3)";
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    className: "card",
    style: {
      padding: "18px 20px",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      cursor: "pointer",
      transition: "transform .14s, box-shadow .14s, border-color .14s",
      position: "relative",
      borderColor: k.urgent ? "var(--warn-border)" : "var(--border)",
      background: k.urgent ? "linear-gradient(180deg,#fffdf8,#fff)" : "var(--surface)"
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--ink-2)"
    }
  }, k.label), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 9,
      background: k.urgent ? "var(--warn-bg)" : "var(--primary-50)",
      color: k.urgent ? "var(--warn-strong)" : "var(--primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: k.icon,
    size: 17
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontSize: 28,
      fontWeight: 800,
      letterSpacing: "-0.03em",
      lineHeight: 1,
      whiteSpace: "nowrap"
    }
  }, k.value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      fontWeight: 700,
      color: deltaColor,
      background: deltaBg,
      padding: "2px 7px",
      borderRadius: 99
    }
  }, k.delta, k.sub && k.deltaPos != null ? "" : "")), k.sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      marginTop: -4
    }
  }, k.sub));
}
function AICard({
  setView
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden",
      borderColor: "var(--primary-100)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 22px",
      display: "flex",
      alignItems: "center",
      gap: 11,
      background: "linear-gradient(120deg,#eef4fa,#eaf2f9)",
      borderBottom: "1px solid var(--primary-100)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      background: "linear-gradient(140deg,#2f9488,#2469a6)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(36,105,166,.3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14.5
    }
  }, "Assistant Le Bon Rebond"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--primary-700)",
      fontWeight: 600
    }
  }, "Analyse de votre semaine")), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-primary"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), "En ligne")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14.5,
      lineHeight: 1.6,
      color: "var(--ink)"
    }
  }, "Votre session ", /*#__PURE__*/React.createElement("strong", null, "\xAB Initiation \xE0 l'IA pour fonctions administratives \xBB"), " est remplie \xE0 ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--danger-strong)"
    }
  }, "28 %"), ". Il manque ", /*#__PURE__*/React.createElement("strong", null, "6 inscriptions"), " pour atteindre le seuil de rentabilit\xE9. Vous avez ", /*#__PURE__*/React.createElement("strong", null, "9 prospects"), " dans le CRM qui pourraient \xEAtre relanc\xE9s aujourd'hui."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 18,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ai btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wand",
    size: 15
  }), " G\xE9n\xE9rer relance"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => setView("prospects")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    size: 15
  }), " Voir prospects"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => setView("planning")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-range",
    size: 15
  }), " Optimiser planning"))));
}
function PrioritiesCard({
  setView
}) {
  const items = [{
    icon: "alert-triangle",
    tone: "danger",
    t: "Remplir la session IA du 21 juin",
    s: "28 % · 6 inscriptions manquantes",
    go: "sessions"
  }, {
    icon: "send",
    tone: "warn",
    t: "Relancer 7 prospects Power BI / Excel",
    s: "Échéance cette semaine",
    go: "prospects"
  }, {
    icon: "user-x",
    tone: "warn",
    t: "Confirmer le formateur Excel Avancé",
    s: "Session du 16 juin",
    go: "formateurs"
  }, {
    icon: "file-text",
    tone: "primary",
    t: "Générer 3 attestations",
    s: "Session Excel du 5 mai",
    go: "documents"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "list-checks",
    size: 18,
    style: {
      color: "var(--primary)"
    }
  }), " Priorit\xE9s de la semaine"), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-neutral"
  }, "4 actions")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setView(it.go),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "11px 10px",
      borderRadius: 11,
      textAlign: "left",
      transition: "background .12s"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--surface-3)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, /*#__PURE__*/React.createElement(AlertGlyph, {
    type: it.tone,
    icon: it.icon,
    size: 34
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, it.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      marginTop: 1
    }
  }, it.s)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 17,
    style: {
      color: "var(--ink-4)"
    }
  })))));
}
function PipelineCard({
  setView
}) {
  const stages = CRM_COLS.filter(c => c.id !== "perdu");
  const counts = {};
  let total = 0;
  PROSPECTS.forEach(p => {
    if (p.col !== "perdu") {
      counts[p.col] = (counts[p.col] || 0) + p.montant;
      total += p.montant;
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5
    }
  }, "Pipeline commercial"), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: () => setView("prospects"),
    style: {
      color: "var(--primary)",
      fontWeight: 700
    }
  }, "Ouvrir le CRM ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-0.03em"
    }
  }, total.toLocaleString("fr-FR"), " \u20AC"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, "pipeline pond\xE9r\xE9 \xB7 ", PROSPECTS.filter(p => p.col !== "perdu" && p.col !== "gagne").length, " en cours")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: 12,
      borderRadius: 99,
      overflow: "hidden",
      gap: 2,
      marginBottom: 16
    }
  }, stages.map(s => {
    const v = counts[s.id] || 0;
    return v ? /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        width: v / total * 100 + "%",
        background: s.color
      },
      title: s.label
    }) : null;
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "9px 18px"
    }
  }, stages.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: "spread"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 3,
      background: s.color
    }
  }), s.label), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontWeight: 700,
      fontSize: 12.5
    }
  }, (counts[s.id] || 0).toLocaleString("fr-FR"), " \u20AC")))));
}
function DashboardPage({
  setView,
  onNewSession
}) {
  const remplMoyen = Math.round(FORMATIONS.reduce((a, f) => a + f.remplissage, 0) / FORMATIONS.length);
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Bonjour Camille 👋",
    subtitle: "Voici l'état de votre activité — semaine du 1ᵉʳ juin 2026."
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " Exporter"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onNewSession
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Nouvelle session")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(196px,1fr))",
      gap: 16
    }
  }, KPIS.map(k => /*#__PURE__*/React.createElement(KpiCard, {
    key: k.id,
    k: k,
    onClick: () => {
      const map = {
        ca: "sessions",
        sessions: "sessions",
        remplissage: "formations",
        prospects: "prospects",
        relances: "prospects",
        docs: "documents"
      };
      setView(map[k.id] || "dashboard");
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.55fr 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5
    }
  }, "CA pr\xE9visionnel"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-3)",
      marginTop: 2
    }
  }, "R\xE9alis\xE9 + projection sur 8 mois")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      fontSize: 11.5,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 3,
      borderRadius: 2,
      background: "var(--primary)"
    }
  }), " R\xE9alis\xE9"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 99,
      border: "2px dashed var(--primary)",
      boxSizing: "border-box"
    }
  }), " Projet\xE9"))), /*#__PURE__*/React.createElement(AreaChart, {
    data: CA_SERIES,
    height: 210
  })), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      marginBottom: 4
    }
  }, "Taux de remplissage par formation"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-3)",
      marginBottom: 20
    }
  }, "Moyenne ", remplMoyen, " % \xB7 objectif 70 %"), /*#__PURE__*/React.createElement(BarRows, {
    data: FORMATIONS
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.3fr 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(AICard, {
    setView: setView
  }), /*#__PURE__*/React.createElement(PrioritiesCard, {
    setView: setView
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(PipelineCard, {
    setView: setView
  }), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5
    }
  }, "Alertes & rappels"), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-danger"
  }, ALERTS.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, ALERTS.slice(0, 3).map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: "flex",
      gap: 12,
      padding: "12px 13px",
      borderRadius: 12,
      background: "var(--surface-2)",
      border: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement(AlertGlyph, {
    type: a.type,
    icon: a.icon,
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, a.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)",
      marginTop: 2,
      lineHeight: 1.45
    }
  }, a.text), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    style: {
      color: "var(--primary)",
      fontWeight: 700,
      padding: "4px 0",
      marginTop: 4,
      height: "auto"
    }
  }, a.action, " \u2192"))))))));
}
Object.assign(window, {
  DashboardPage,
  KpiCard,
  AICard,
  PrioritiesCard,
  PipelineCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/page_dashboard.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/page_documents.jsx
try { (() => {
// ============================================================
// Documents
// ============================================================
const DOC_TYPES = [{
  name: "Programme",
  icon: "book",
  desc: "Programme pédagogique détaillé"
}, {
  name: "Convention",
  icon: "file-text",
  desc: "Convention de formation"
}, {
  name: "Convocation",
  icon: "mail",
  desc: "Convocation des apprenants"
}, {
  name: "Feuille d'émargement",
  icon: "list-checks",
  desc: "Émargement par demi-journée"
}, {
  name: "Attestation",
  icon: "check-circle",
  desc: "Attestation de fin de formation"
}, {
  name: "Certificat de réalisation",
  icon: "shield",
  desc: "Certificat de réalisation"
}, {
  name: "Questionnaire satisfaction",
  icon: "smile",
  desc: "Évaluation à chaud"
}];
const DOC_QUEUE = [{
  doc: "Attestation",
  ctx: "Excel Avancé · 5 mai",
  who: "3 apprenants",
  urgent: true
}, {
  doc: "Questionnaire satisfaction",
  ctx: "Excel Avancé · 5 mai",
  who: "Session terminée",
  urgent: true
}, {
  doc: "Convocation",
  ctx: "Power BI · 12 juin",
  who: "9 apprenants",
  urgent: false
}, {
  doc: "Convention",
  ctx: "Finance dirigeants · 24 juin",
  who: "Caraïbes Services",
  urgent: false
}, {
  doc: "Feuille d'émargement",
  ctx: "IA fonctions admin. · 21 juin",
  who: "À préparer",
  urgent: false
}];
const DOC_DONE = [{
  doc: "Programme",
  ctx: "Power BI",
  date: "28 mai"
}, {
  doc: "Convention",
  ctx: "Power BI · 12 juin",
  date: "29 mai"
}, {
  doc: "Attestation",
  ctx: "Excel · 12 avril",
  date: "14 avril"
}, {
  doc: "Certificat de réalisation",
  ctx: "Finance · mars",
  date: "2 avril"
}];
function DocIcon({
  name,
  tone = "primary",
  size = 38
}) {
  const map = {
    primary: ["var(--primary-50)", "var(--primary)"],
    warn: ["var(--warn-bg)", "var(--warn-strong)"],
    positive: ["var(--positive-bg)", "var(--positive-600)"],
    neutral: ["var(--surface-3)", "var(--ink-3)"]
  };
  const [bg, fg] = map[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 9,
      background: bg,
      color: fg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: name,
    size: size * 0.5
  }));
}
function DocumentsPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Documents",
    subtitle: "G\xE9n\xE9rez et centralisez tous vos documents de formation."
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 16
  }), " Mod\xE8les"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " G\xE9n\xE9rer PDF")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 16,
      marginBottom: 20
    }
  }, [["À générer", DOC_QUEUE.length, "warn", "clock"], ["Générés ce mois", DOC_DONE.length, "positive", "check-circle"], ["Modèles disponibles", DOC_TYPES.length, "primary", "layers"]].map(([l, n, tone, ic]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    className: "card card-pad",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(DocIcon, {
    name: ic,
    tone: tone,
    size: 44
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 24,
      fontWeight: 800
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.3fr 1fr",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      padding: "16px 20px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 17,
    style: {
      color: "var(--warn-strong)"
    }
  }), " \xC0 g\xE9n\xE9rer"), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-warn"
  }, DOC_QUEUE.filter(d => d.urgent).length, " urgents")), /*#__PURE__*/React.createElement("div", null, DOC_QUEUE.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "spread",
    style: {
      padding: "13px 20px",
      borderBottom: i < DOC_QUEUE.length - 1 ? "1px solid var(--border-2)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 13
    }
  }, /*#__PURE__*/React.createElement(DocIcon, {
    name: DOC_TYPES.find(t => t.name === d.doc)?.icon || "file-text",
    tone: d.urgent ? "warn" : "neutral"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, d.doc, " ", d.urgent && /*#__PURE__*/React.createElement("span", {
    className: "badge badge-danger",
    style: {
      marginLeft: 6,
      height: 18
    }
  }, "Urgent")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      marginTop: 2
    }
  }, d.ctx, " \xB7 ", d.who))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 14
  }), " G\xE9n\xE9rer"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 20px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    size: 17,
    style: {
      color: "var(--positive-600)"
    }
  }), " G\xE9n\xE9r\xE9s r\xE9cemment")), /*#__PURE__*/React.createElement("div", null, DOC_DONE.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "spread",
    style: {
      padding: "11px 20px",
      borderBottom: i < DOC_DONE.length - 1 ? "1px solid var(--border-2)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11
    }
  }, /*#__PURE__*/React.createElement(DocIcon, {
    name: "file-text",
    tone: "positive",
    size: 32
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 13
    }
  }, d.doc), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)"
    }
  }, d.ctx, " \xB7 ", d.date))), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-icon",
    style: {
      color: "var(--ink-3)"
    },
    title: "T\xE9l\xE9charger"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  })))))))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      marginBottom: 16
    }
  }, "Mod\xE8les disponibles"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
      gap: 12
    }
  }, DOC_TYPES.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.name,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 14,
      border: "1px solid var(--border)",
      borderRadius: 12,
      cursor: "pointer",
      transition: "border-color .14s, background .14s"
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = "var(--primary-200)";
      e.currentTarget.style.background = "var(--primary-tint)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = "var(--border)";
      e.currentTarget.style.background = "transparent";
    }
  }, /*#__PURE__*/React.createElement(DocIcon, {
    name: t.icon,
    tone: "primary"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, t.desc)))))));
}
Object.assign(window, {
  DocumentsPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/page_documents.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/page_formateurs.jsx
try { (() => {
// ============================================================
// Formateurs — list + detail
// ============================================================
const {
  useState: useStateFo
} = React;
function DispoChip({
  d
}) {
  const map = {
    "Disponible": "badge-positive",
    "Partielle": "badge-warn",
    "À confirmer": "badge-danger"
  };
  return /*#__PURE__*/React.createElement("span", {
    className: "badge " + (map[d] || "badge-neutral")
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), d);
}
function FormateursPage({
  openDetail
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Formateurs",
    subtitle: `${FORMATEURS.length} formateurs · ${FORMATEURS.filter(f => !f.confirme).length} en attente de confirmation`
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Ajouter un formateur")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
      gap: 18
    }
  }, FORMATEURS.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    className: "card",
    style: {
      padding: 0,
      overflow: "hidden",
      cursor: "pointer",
      transition: "transform .14s, box-shadow .14s"
    },
    onClick: () => openDetail(f),
    onMouseEnter: e => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      alignItems: "flex-start",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 46,
      height: 46,
      fontSize: 16,
      background: f.color
    }
  }, f.initials), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 15.5,
      whiteSpace: "nowrap"
    }
  }, f.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      marginTop: 2
    }
  }, f.sessions, " sessions \xE0 venir"))), /*#__PURE__*/React.createElement(DispoChip, {
    d: f.dispo
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginBottom: 16
    }
  }, f.specialites.map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    className: "badge badge-neutral"
  }, s))), /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, "Taux d'occupation"), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontWeight: 700,
      fontSize: 12.5
    }
  }, f.occupation, "%")), /*#__PURE__*/React.createElement("div", {
    className: "progress"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: f.occupation + "%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginTop: 16,
      paddingTop: 14,
      borderTop: "1px solid var(--border-2)"
    }
  }, f.confirme ? /*#__PURE__*/React.createElement("span", {
    className: "badge badge-positive"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12
  }), " Confirm\xE9") : /*#__PURE__*/React.createElement("span", {
    className: "badge badge-danger"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-triangle",
    size: 12
  }), " \xC0 confirmer"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--primary)",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, "Voir ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 13
  }))))))));
}
function FormateurDetail({
  f,
  goBack
}) {
  const sessions = SESSIONS.filter(s => s.formateur === f.name);
  const dispoWeek = [{
    d: "Lun",
    am: false,
    pm: false
  }, {
    d: "Mar",
    am: true,
    pm: true
  }, {
    d: "Mer",
    am: true,
    pm: false
  }, {
    d: "Jeu",
    am: true,
    pm: true
  }, {
    d: "Ven",
    am: true,
    pm: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: goBack,
    style: {
      color: "var(--ink-2)",
      marginBottom: 16,
      paddingLeft: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 16
  }), " Retour aux formateurs"), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad",
    style: {
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      gap: 20,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 64,
      height: 64,
      fontSize: 22,
      background: f.color
    }
  }, f.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 200
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 24
    }
  }, f.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      marginTop: 8,
      flexWrap: "wrap"
    }
  }, f.specialites.map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    className: "badge badge-neutral"
  }, s)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, "Occupation"), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 20,
      fontWeight: 800,
      marginTop: 2
    }
  }, f.occupation, "%")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, "Sessions"), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 20,
      fontWeight: 800,
      marginTop: 2
    }
  }, f.sessions)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, "Statut"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, f.confirme ? /*#__PURE__*/React.createElement("span", {
    className: "badge badge-positive"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12
  }), "Confirm\xE9") : /*#__PURE__*/React.createElement("span", {
    className: "badge badge-danger"
  }, "\xC0 confirmer")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 16
  }), " Contacter"), !f.confirme && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), " Confirmer"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 340px",
      gap: 20,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 20px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5
    }
  }, "Sessions \xE0 venir")), sessions.length ? /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Formation"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Inscrits"), /*#__PURE__*/React.createElement("th", null, "Statut"))), /*#__PURE__*/React.createElement("tbody", null, sessions.map(s => /*#__PURE__*/React.createElement("tr", {
    key: s.id
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 600
    }
  }, s.formation), /*#__PURE__*/React.createElement("td", null, s.date), /*#__PURE__*/React.createElement("td", {
    className: "tnum"
  }, s.inscrits, "/", s.capacite), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(SessionBadge, {
    statut: s.statut
  })))))) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "calendar",
    title: "Aucune session programm\xE9e",
    text: "Ce formateur n'a pas encore de session \xE0 venir."
  })), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      marginBottom: 14
    }
  }, "Disponibilit\xE9s \xB7 cette semaine"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(5,1fr)",
      gap: 10
    }
  }, dispoWeek.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.d,
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: "var(--ink-2)",
      marginBottom: 8
    }
  }, d.d), [["Matin", d.am], ["A-m", d.pm]].map(([l, ok]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      marginBottom: 6,
      padding: "8px 4px",
      borderRadius: 8,
      fontSize: 11,
      fontWeight: 700,
      background: ok ? "var(--positive-bg)" : "var(--surface-3)",
      color: ok ? "var(--positive-600)" : "var(--ink-4)",
      border: "1px solid " + (ok ? "var(--positive-border)" : "var(--border-2)")
    }
  }, ok ? "Libre" : "—"))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 13.5,
      marginBottom: 12
    }
  }, "Coordonn\xE9es"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 15,
    style: {
      color: "var(--ink-3)"
    }
  }), f.email), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 15,
    style: {
      color: "var(--ink-3)"
    }
  }), f.tel))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 13.5,
      marginBottom: 12
    }
  }, "Documents p\xE9dagogiques"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, ["CV formateur", "Supports de cours", "Convention de prestation"].map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      fontSize: 13,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text",
    size: 15,
    style: {
      color: "var(--ink-3)"
    }
  }), d)))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 13.5,
      marginBottom: 10
    }
  }, "Notes"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: "var(--ink-2)",
      lineHeight: 1.55
    }
  }, "Tr\xE8s bons retours sur la p\xE9dagogie. Pr\xE9f\xE8re les sessions en pr\xE9sentiel le matin. Disponible pour des interventions intra-entreprise.")))));
}
Object.assign(window, {
  FormateursPage,
  FormateurDetail,
  DispoChip
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/page_formateurs.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/page_formations.jsx
try { (() => {
// ============================================================
// Formations — list + detail
// ============================================================
const {
  useState: useStateF
} = React;
function ModaliteBadge({
  m
}) {
  const map = {
    "Présentiel": ["map-pin", "badge-sky"],
    "Distanciel": ["video", "badge-primary"],
    "Hybride": ["globe", "badge-neutral"]
  };
  const [icon, cls] = map[m] || ["map-pin", "badge-neutral"];
  return /*#__PURE__*/React.createElement("span", {
    className: "badge " + cls
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 12
  }), m);
}
function FormationCard({
  f,
  onOpen
}) {
  const tone = f.remplissage >= 70 ? "positive" : f.remplissage < 40 ? "danger" : "warn";
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "transform .14s, box-shadow .14s",
      cursor: "pointer"
    },
    onClick: () => onOpen(f),
    onMouseEnter: e => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: f.color
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      display: "flex",
      flexDirection: "column",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      alignItems: "flex-start",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge-neutral"
  }, f.cat), /*#__PURE__*/React.createElement(ModaliteBadge, {
    m: f.modalite
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      lineHeight: 1.3,
      marginBottom: 14,
      minHeight: 42
    }
  }, f.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      marginBottom: 16,
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 14
  }), f.duree), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar",
    size: 14
  }), f.sessions, " sessions")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, "Remplissage moyen"), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontWeight: 700,
      fontSize: 12.5,
      color: tone === "danger" ? "var(--danger-strong)" : tone === "positive" ? "var(--positive-600)" : "var(--warn-strong)"
    }
  }, f.remplissage, "%")), /*#__PURE__*/React.createElement("div", {
    className: "progress " + tone
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: f.remplissage + "%"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginTop: 16,
      paddingTop: 16,
      borderTop: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontSize: 19,
      fontWeight: 800
    }
  }, f.prix, " \u20AC", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "var(--ink-3)"
    }
  }, " HT")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 24,
      height: 24,
      fontSize: 10,
      background: f.color
    }
  }, f.formateur.split(" ").map(x => x[0]).join("")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--ink-2)",
      fontWeight: 600
    }
  }, f.formateur.split(" ")[0])))));
}
function FormationsPage({
  openDetail,
  onNewSession
}) {
  const [q, setQ] = useStateF("");
  const [filter, setFilter] = useStateF("all");
  const cats = ["all", ...new Set(FORMATIONS.map(f => f.cat))];
  const list = FORMATIONS.filter(f => (filter === "all" || f.cat === filter) && f.title.toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Formations",
    subtitle: `${FORMATIONS.length} formations au catalogue · ${FORMATIONS.reduce((a, f) => a + f.sessions, 0)} sessions programmées`
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "globe",
    size: 16
  }), " Page publique"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Cr\xE9er une formation")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginBottom: 20,
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 240,
      maxWidth: 360,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16,
    style: {
      position: "absolute",
      left: 12,
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--ink-4)"
    }
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Rechercher une formation\u2026",
    value: q,
    onChange: e => setQ(e.target.value),
    style: {
      paddingLeft: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, cats.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => setFilter(c),
    className: "badge",
    style: {
      height: 34,
      padding: "0 14px",
      fontSize: 12.5,
      cursor: "pointer",
      background: filter === c ? "var(--primary)" : "var(--surface)",
      color: filter === c ? "#fff" : "var(--ink-2)",
      border: "1px solid " + (filter === c ? "var(--primary)" : "var(--border-strong)")
    }
  }, c === "all" ? "Toutes" : c)))), list.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
      gap: 18
    }
  }, list.map(f => /*#__PURE__*/React.createElement(FormationCard, {
    key: f.id,
    f: f,
    onOpen: openDetail
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement(EmptyState, {
    title: "Aucune formation trouv\xE9e",
    text: "Essayez un autre terme ou r\xE9initialisez les filtres."
  })));
}

// ---------- Detail (Power BI) ----------
function FormationDetail({
  f,
  goBack,
  onNewSession,
  openAI
}) {
  const objectifs = ["Concevoir un modèle de données propre et performant", "Créer des visualisations claires et interactives", "Maîtriser le langage DAX pour les mesures clés", "Publier et partager un tableau de bord en équipe"];
  const programme = [{
    t: "Jour 1 — Fondations",
    items: ["Prise en main de Power BI Desktop", "Connexion et transformation des données (Power Query)", "Modélisation et relations"]
  }, {
    t: "Jour 2 — Visualisations",
    items: ["Graphiques, cartes et filtres", "Mise en page et thèmes", "Introduction au DAX"]
  }, {
    t: "Jour 3 — Pilotage",
    items: ["Mesures avancées et KPI", "Publication sur Power BI Service", "Atelier : tableau de bord d'entreprise"]
  }];
  const sessions = SESSIONS.filter(s => s.fid === "powerbi");
  const caPrev = sessions.filter(s => s.statut !== "terminee").reduce((a, s) => a + s.inscrits * f.prix, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-sm",
    onClick: goBack,
    style: {
      color: "var(--ink-2)",
      marginBottom: 16,
      paddingLeft: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 16
  }), " Retour aux formations"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 320px",
      gap: 22,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: f.color
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge-neutral"
  }, f.cat), /*#__PURE__*/React.createElement(ModaliteBadge, {
    m: f.modalite
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 26,
      lineHeight: 1.2,
      marginBottom: 12
    }
  }, f.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.6,
      color: "var(--ink-2)"
    }
  }, "Une formation op\xE9rationnelle de ", f.duree.toLowerCase(), " pour construire, de A \xE0 Z, un tableau de bord d\xE9cisionnel avec Power BI \u2014 de la connexion aux donn\xE9es jusqu'\xE0 la publication d'un rapport partag\xE9 en entreprise."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 28,
      marginTop: 20,
      flexWrap: "wrap"
    }
  }, [["Durée", f.duree + " · " + f.heures + "h"], ["Prix", f.prix + " € HT"], ["Modalité", f.modalite], ["Sessions", f.sessions + " programmées"]].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      marginTop: 3
    }
  }, v)))))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      marginBottom: 14
    }
  }, "Objectifs p\xE9dagogiques"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, objectifs.map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--positive-600)",
      flex: "none",
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      lineHeight: 1.45
    }
  }, o))))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      marginBottom: 16
    }
  }, "Programme"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, programme.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "var(--primary-50)",
      color: "var(--primary)",
      fontWeight: 800,
      fontSize: 13,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, i + 1), i < programme.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 2,
      flex: 1,
      background: "var(--border)",
      marginTop: 4
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: i < programme.length - 1 ? 4 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      marginBottom: 6
    }
  }, p.t), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 16,
      color: "var(--ink-2)",
      fontSize: 13.5,
      lineHeight: 1.7
    }
  }, p.items.map((it, j) => /*#__PURE__*/React.createElement("li", {
    key: j
  }, it)))))))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      padding: "18px 22px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16
    }
  }, "Sessions \xE0 venir"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: onNewSession
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15
  }), " Cr\xE9er une session")), /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Formateur"), /*#__PURE__*/React.createElement("th", null, "Inscrits"), /*#__PURE__*/React.createElement("th", null, "Remplissage"), /*#__PURE__*/React.createElement("th", null, "Statut"))), /*#__PURE__*/React.createElement("tbody", null, sessions.map(s => /*#__PURE__*/React.createElement("tr", {
    key: s.id
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      fontWeight: 600
    }
  }, s.date), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 24,
      height: 24,
      fontSize: 10,
      background: s.fColor
    }
  }, s.fInit), s.formateur)), /*#__PURE__*/React.createElement("td", {
    className: "tnum"
  }, s.inscrits, "/", s.capacite), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FillBar, {
    value: Math.round(s.inscrits / s.capacite * 100),
    width: 90
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(SessionBadge, {
    statut: s.statut
  })))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
      position: "sticky",
      top: 88
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-block",
    onClick: onNewSession
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Cr\xE9er une session"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-block"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "globe",
    size: 16
  }), " G\xE9n\xE9rer page publique")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden",
      borderColor: "var(--primary-100)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 18px",
      background: "linear-gradient(120deg,#eef4fa,#eaf2f9)",
      display: "flex",
      gap: 10,
      alignItems: "center",
      borderBottom: "1px solid var(--primary-100)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: "linear-gradient(140deg,#2f9488,#2469a6)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 16
  })), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 13.5
    }
  }, "Optimisation IA")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: "var(--ink-2)",
      lineHeight: 1.5,
      marginBottom: 14
    }
  }, "Boostez le remplissage avec une description plus vendeuse, optimis\xE9e pour vos prospects PME."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ai btn-sm btn-block",
    onClick: openAI
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wand",
    size: 15
  }), " Am\xE9liorer la description"))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)",
      fontWeight: 600
    }
  }, "CA pr\xE9visionnel"), /*#__PURE__*/React.createElement(Icon, {
    name: "euro",
    size: 15,
    style: {
      color: "var(--positive-600)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 24,
      fontWeight: 800
    }
  }, caPrev.toLocaleString("fr-FR"), " \u20AC"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      marginTop: 4
    }
  }, "Sur les sessions ouvertes \xE0 venir")), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 13.5,
      marginBottom: 12
    }
  }, "Formateurs possibles"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, FORMATEURS.filter(t => t.specialites.some(s => /Power BI|Excel|Digital/.test(s))).map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 30,
      height: 30,
      background: t.color
    }
  }, t.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 13
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)"
    }
  }, t.specialites.join(" · "))))))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 13.5,
      marginBottom: 12
    }
  }, "Documents li\xE9s"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, ["Programme PDF", "Convention type", "Support de cours"].map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      fontSize: 13,
      color: "var(--ink-2)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text",
    size: 15,
    style: {
      color: "var(--ink-3)"
    }
  }), d)))))));
}
Object.assign(window, {
  FormationsPage,
  FormationDetail,
  FormationCard,
  ModaliteBadge
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/page_formations.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/page_planning.jsx
try { (() => {
// ============================================================
// Planning — weekly grid (formateurs × jours, matin/après-midi)
// + intelligent slot finder panel
// ============================================================
const {
  useState: useStateP
} = React;
const DAYS = [{
  id: "lun",
  label: "Lundi",
  date: "16"
}, {
  id: "mar",
  label: "Mardi",
  date: "17"
}, {
  id: "mer",
  label: "Mercredi",
  date: "18"
}, {
  id: "jeu",
  label: "Jeudi",
  date: "19"
}, {
  id: "ven",
  label: "Vendredi",
  date: "20"
}];

// blocks per formateur: { day: { am, pm } }  am/pm = block object or 'dispo' or 'off'
const PLANNING = {
  claire: {
    mar: {
      am: {
        t: "Power BI",
        color: "#2469a6",
        room: "Salle A"
      },
      pm: {
        t: "Power BI",
        color: "#2469a6",
        room: "Salle A"
      }
    },
    mer: {
      am: {
        t: "Power BI",
        color: "#2469a6",
        room: "Salle A"
      },
      pm: "dispo"
    },
    jeu: {
      am: "dispo",
      pm: "dispo"
    },
    ven: {
      am: {
        t: "Excel Avancé",
        color: "#2f7fc4",
        room: "Salle B",
        conflict: true
      },
      pm: {
        t: "Excel Avancé",
        color: "#2f7fc4",
        room: "Salle B",
        conflict: true
      }
    }
  },
  julien: {
    lun: {
      am: "dispo",
      pm: "dispo"
    },
    mar: {
      am: "dispo",
      pm: "dispo"
    },
    mer: {
      am: "dispo",
      pm: "dispo"
    },
    jeu: {
      am: "dispo",
      pm: "dispo"
    },
    ven: {
      am: {
        t: "IA fonctions admin.",
        color: "#129a93",
        room: "Distanciel"
      },
      pm: "off"
    }
  },
  sarah: {
    lun: {
      am: "off",
      pm: "off"
    },
    mar: {
      am: "dispo",
      pm: "dispo"
    },
    mer: {
      am: {
        t: "Finance dirigeants",
        color: "#d9821f",
        room: "Salle C"
      },
      pm: {
        t: "Finance dirigeants",
        color: "#d9821f",
        room: "Salle C"
      }
    },
    jeu: {
      am: "dispo",
      pm: "dispo"
    },
    ven: {
      am: "dispo",
      pm: "off"
    }
  },
  thomas: {
    lun: {
      am: "dispo",
      pm: "dispo"
    },
    mar: {
      am: "dispo",
      pm: "dispo"
    },
    jeu: {
      am: "dispo",
      pm: "dispo"
    },
    ven: {
      am: "dispo",
      pm: "dispo"
    }
  }
};
function Slot({
  block
}) {
  if (!block || block === "off") return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      borderRadius: 8,
      background: "repeating-linear-gradient(45deg,#f4f5f8,#f4f5f8 5px,#eef0f3 5px,#eef0f3 10px)"
    }
  });
  if (block === "dispo") return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      borderRadius: 8,
      border: "1.5px dashed var(--positive-border)",
      background: "var(--positive-bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--positive-600)",
      fontSize: 11,
      fontWeight: 700
    }
  }, "Dispo");
  const conflict = block.conflict;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      borderRadius: 8,
      padding: "7px 9px",
      overflow: "hidden",
      cursor: "pointer",
      background: conflict ? "var(--danger-bg)" : block.color + "14",
      borderLeft: "3px solid " + (conflict ? "var(--danger)" : block.color),
      border: conflict ? "1px solid var(--danger-border)" : "1px solid " + block.color + "30",
      transition: "transform .12s"
    },
    onMouseEnter: e => e.currentTarget.style.transform = "scale(1.02)",
    onMouseLeave: e => e.currentTarget.style.transform = "none"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 12,
      color: conflict ? "var(--danger-strong)" : block.color,
      lineHeight: 1.2,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, block.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: "var(--ink-3)",
      marginTop: 3,
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, conflict ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-triangle",
    size: 11,
    style: {
      color: "var(--danger)"
    }
  }), " Conflit salle") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 11
  }), " ", block.room)));
}
function PlanningPage() {
  const [panel, setPanel] = useStateP(false);
  const slots = [{
    day: "Mardi 18 juin",
    time: "Matin",
    score: 92,
    note: "Tous les formateurs disponibles · Salle A libre",
    tone: "positive"
  }, {
    day: "Jeudi 20 juin",
    time: "Après-midi",
    score: 88,
    note: "Claire Martin disponible · Salle B libre",
    tone: "positive"
  }, {
    day: "Vendredi 21 juin",
    time: "Journée",
    score: 54,
    note: "Conflit de salle détecté (Salle B occupée)",
    tone: "danger"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Planning",
    subtitle: "Semaine du 16 au 20 juin 2026 \xB7 vue formateurs"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      background: "var(--surface)",
      border: "1px solid var(--border-strong)",
      borderRadius: 10,
      padding: 3
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-icon",
    style: {
      width: 32,
      height: 32
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    style: {
      height: 32,
      padding: "0 10px",
      fontSize: 12.5,
      fontWeight: 700
    }
  }, "Cette semaine"), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-icon",
    style: {
      width: 32,
      height: 32
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16
  }))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ai",
    onClick: () => setPanel(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 17
  }), " Trouver les meilleurs cr\xE9neaux")), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 880
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "168px repeat(5,1fr)",
      borderBottom: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px",
      fontSize: 11,
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: ".06em",
      color: "var(--ink-3)"
    }
  }, "Formateur"), DAYS.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    style: {
      padding: "12px 10px",
      textAlign: "center",
      borderLeft: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, d.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)"
    }
  }, d.date, " juin")))), FORMATEURS.map((f, ri) => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    style: {
      display: "grid",
      gridTemplateColumns: "168px repeat(5,1fr)",
      borderBottom: ri < FORMATEURS.length - 1 ? "1px solid var(--border-2)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 30,
      height: 30,
      background: f.color,
      fontSize: 11
    }
  }, f.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      whiteSpace: "nowrap"
    }
  }, f.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: "var(--ink-3)"
    }
  }, f.specialites[0]))), DAYS.map(d => {
    const cell = (PLANNING[f.id] || {})[d.id];
    return /*#__PURE__*/React.createElement("div", {
      key: d.id,
      style: {
        borderLeft: "1px solid var(--border-2)",
        padding: 7,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minHeight: 96
      }
    }, /*#__PURE__*/React.createElement(Slot, {
      block: cell ? cell.am : "off"
    }), /*#__PURE__*/React.createElement(Slot, {
      block: cell ? cell.pm : "off"
    }));
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 18,
      padding: "12px 16px",
      borderTop: "1px solid var(--border-2)",
      fontSize: 11.5,
      color: "var(--ink-2)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 10,
      borderRadius: 3,
      background: "var(--positive-bg)",
      border: "1.5px dashed var(--positive-border)"
    }
  }), " Disponible"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 10,
      borderRadius: 3,
      background: "#2469a622",
      borderLeft: "3px solid #2469a6"
    }
  }), " Session planifi\xE9e"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 10,
      borderRadius: 3,
      background: "var(--danger-bg)",
      borderLeft: "3px solid var(--danger)"
    }
  }), " Conflit"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 10,
      borderRadius: 3,
      background: "repeating-linear-gradient(45deg,#f4f5f8,#f4f5f8 3px,#eef0f3 3px,#eef0f3 6px)"
    }
  }), " Indisponible"))), /*#__PURE__*/React.createElement(Drawer, {
    open: panel,
    onClose: () => setPanel(false),
    title: "Meilleurs cr\xE9neaux",
    subtitle: "Pour : Excel Avanc\xE9 pour PME \xB7 2 jours",
    accent: true,
    width: 440,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary",
      style: {
        flex: 1
      },
      onClick: () => setPanel(false)
    }, "Fermer"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16
    }), " Planifier"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      padding: "12px 14px",
      background: "var(--primary-tint)",
      borderRadius: 12,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 18,
    style: {
      color: "var(--primary)",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, "3 cr\xE9neaux analys\xE9s selon les disponibilit\xE9s formateurs, salles et le remplissage attendu.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, slots.map((s, i) => /*#__PURE__*/React.createElement("label", {
    key: i,
    style: {
      display: "flex",
      gap: 14,
      padding: 16,
      borderRadius: 14,
      border: "1px solid " + (i === 0 ? "var(--primary)" : "var(--border)"),
      background: i === 0 ? "var(--primary-tint)" : "var(--surface)",
      cursor: "pointer",
      boxShadow: i === 0 ? "0 0 0 3px var(--primary-50)" : "none"
    }
  }, /*#__PURE__*/React.createElement(Donut, {
    value: s.score,
    size: 56,
    stroke: 7,
    color: s.tone === "danger" ? "var(--danger)" : "var(--positive)",
    label: s.score + "%"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread"
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 14
    }
  }, s.day), /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "slot",
    defaultChecked: i === 0,
    style: {
      accentColor: "var(--primary)",
      width: 16,
      height: 16
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)",
      margin: "2px 0 8px"
    }
  }, s.time, " \xB7 compatible ", s.score, " %"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: s.tone === "danger" ? "var(--danger-strong)" : "var(--positive-600)",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.tone === "danger" ? "alert-triangle" : "check-circle",
    size: 13
  }), " ", s.note)))))));
}
Object.assign(window, {
  PlanningPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/page_planning.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/page_prospects.jsx
try { (() => {
// ============================================================
// Prospects — CRM Kanban (draggable) + AI relance drawer
// ============================================================
const {
  useState: useStatePr,
  useRef: useRefPr
} = React;
function ProspectCard({
  p,
  onDragStart,
  onRelance
}) {
  const col = CRM_COLS.find(c => c.id === p.col);
  return /*#__PURE__*/React.createElement("div", {
    draggable: true,
    onDragStart: e => onDragStart(e, p),
    style: {
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: 13,
      boxShadow: "var(--shadow-xs)",
      cursor: "grab",
      transition: "box-shadow .14s, transform .14s"
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = "var(--shadow)";
      e.currentTarget.style.transform = "translateY(-2px)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = "var(--shadow-xs)";
      e.currentTarget.style.transform = "none";
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 28,
      height: 28,
      fontSize: 10.5,
      background: col.color
    }
  }, p.name.split(" ").map(x => x[0]).slice(0, 2).join("")), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 13,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, p.name)), p.chaud && /*#__PURE__*/React.createElement("span", {
    title: "Prospect chaud",
    style: {
      color: "var(--warn)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    size: 14,
    fill: "var(--warn)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-2)",
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 13,
    style: {
      color: "var(--ink-3)"
    }
  }), " ", p.formation), /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      paddingTop: 10,
      borderTop: "1px dashed var(--border-strong)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontWeight: 800,
      fontSize: 14,
      whiteSpace: "nowrap"
    }
  }, p.montant.toLocaleString("fr-FR"), " \u20AC"), p.relance !== "—" && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--warn-strong)",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 12
  }), p.relance)), p.action !== "—" && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 11.5,
      color: "var(--ink-3)",
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 12
  }), " ", p.action), (p.col === "relance" || p.col === "devis" || p.col === "contacte") && /*#__PURE__*/React.createElement("button", {
    onClick: () => onRelance(p),
    className: "btn btn-ai btn-sm btn-block",
    style: {
      marginTop: 11,
      height: 30
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wand",
    size: 14
  }), " Relance IA"));
}
function ProspectsPage() {
  const [prospects, setProspects] = useStatePr(PROSPECTS);
  const [over, setOver] = useStatePr(null);
  const [relance, setRelance] = useStatePr(null);
  const dragged = useRefPr(null);
  const onDragStart = (e, p) => {
    dragged.current = p;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDrop = colId => {
    if (dragged.current && dragged.current.col !== colId) {
      setProspects(prev => prev.map(x => x.id === dragged.current.id ? {
        ...x,
        col: colId
      } : x));
    }
    dragged.current = null;
    setOver(null);
  };
  const totalPipe = prospects.filter(p => p.col !== "perdu" && p.col !== "gagne").reduce((a, p) => a + p.montant, 0);
  const won = prospects.filter(p => p.col === "gagne").reduce((a, p) => a + p.montant, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up",
    style: {
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - var(--topbar-h) - 56px)"
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Prospects",
    subtitle: `Pipeline ${totalPipe.toLocaleString("fr-FR")} € en cours · ${won.toLocaleString("fr-FR")} € gagnés`
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "filter",
    size: 16
  }), " Filtrer"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ai",
    onClick: () => setRelance(prospects.find(p => p.col === "relance"))
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wand",
    size: 16
  }), " G\xE9n\xE9rer une relance IA"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Ajouter un prospect")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      gap: 14,
      overflowX: "auto",
      paddingBottom: 8
    }
  }, CRM_COLS.map(col => {
    const items = prospects.filter(p => p.col === col.id);
    const sum = items.reduce((a, p) => a + p.montant, 0);
    return /*#__PURE__*/React.createElement("div", {
      key: col.id,
      onDragOver: e => {
        e.preventDefault();
        setOver(col.id);
      },
      onDragLeave: () => setOver(o => o === col.id ? null : o),
      onDrop: () => onDrop(col.id),
      style: {
        width: 264,
        flex: "none",
        display: "flex",
        flexDirection: "column",
        background: over === col.id ? "var(--primary-tint)" : "var(--surface-3)",
        borderRadius: 14,
        border: "1px solid " + (over === col.id ? "var(--primary-200)" : "var(--border-2)"),
        transition: "background .14s, border-color .14s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "spread",
      style: {
        padding: "12px 14px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: 99,
        background: col.color
      }
    }), /*#__PURE__*/React.createElement("strong", {
      style: {
        fontSize: 13
      }
    }, col.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: "var(--ink-3)",
        background: "var(--surface)",
        borderRadius: 99,
        padding: "1px 7px"
      }
    }, items.length)), /*#__PURE__*/React.createElement("span", {
      className: "tnum",
      style: {
        fontSize: 11.5,
        color: "var(--ink-3)",
        fontWeight: 700
      }
    }, sum ? (sum / 1000).toFixed(1).replace(".", ",") + "k€" : "")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: "auto",
        padding: "0 10px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 60
      }
    }, items.map(p => /*#__PURE__*/React.createElement(ProspectCard, {
      key: p.id,
      p: p,
      onDragStart: onDragStart,
      onRelance: setRelance
    })), !items.length && /*#__PURE__*/React.createElement("div", {
      style: {
        border: "1.5px dashed var(--border-strong)",
        borderRadius: 10,
        padding: "18px 10px",
        textAlign: "center",
        fontSize: 11.5,
        color: "var(--ink-4)"
      }
    }, "D\xE9posez ici")));
  })), /*#__PURE__*/React.createElement(RelanceDrawer, {
    prospect: relance,
    onClose: () => setRelance(null)
  }));
}
function RelanceDrawer({
  prospect,
  onClose
}) {
  const [generating, setGenerating] = useStatePr(false);
  const [text, setText] = useStatePr("");
  const open = !!prospect;
  React.useEffect(() => {
    if (!prospect) return;
    setGenerating(true);
    setText("");
    const full = buildEmail(prospect);
    let i = 0;
    const t = setInterval(() => {
      i += 8;
      setText(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(t);
        setGenerating(false);
      }
    }, 16);
    return () => clearInterval(t);
  }, [prospect]);
  return /*#__PURE__*/React.createElement(Drawer, {
    open: open,
    onClose: onClose,
    title: "Relance commerciale",
    subtitle: prospect ? prospect.name + " · " + prospect.formation : "",
    accent: true,
    width: 520,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary",
      onClick: onClose
    }, "Annuler"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ai",
      style: {
        marginLeft: "auto"
      },
      disabled: generating
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "refresh",
      size: 15
    }), " R\xE9g\xE9n\xE9rer"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      disabled: generating
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 15
    }), " Envoyer"))
  }, prospect && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 18
    }
  }, [["Contact", prospect.contact], ["Montant", prospect.montant.toLocaleString("fr-FR") + " €"], ["Relance", prospect.relance]].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      flex: 1,
      background: "var(--surface-2)",
      border: "1px solid var(--border-2)",
      borderRadius: 10,
      padding: "10px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--ink-3)",
      fontWeight: 600
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      marginTop: 2
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "field-label",
    style: {
      margin: 0
    }
  }, "Email g\xE9n\xE9r\xE9"), generating && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--primary)",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 13
  }), " R\xE9daction\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-strong)",
      borderRadius: 12,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px",
      borderBottom: "1px solid var(--border-2)",
      fontSize: 12.5,
      color: "var(--ink-2)",
      background: "var(--surface-2)"
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--ink)"
    }
  }, "Objet :"), " ", prospect.formation, " \u2014 une session se pr\xE9pare chez ", CENTER.name), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      fontSize: 13.5,
      lineHeight: 1.7,
      color: "var(--ink)",
      whiteSpace: "pre-wrap",
      minHeight: 230,
      fontFamily: "var(--font)"
    }
  }, text, generating && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 8,
      height: 16,
      background: "var(--primary)",
      marginLeft: 1,
      verticalAlign: "text-bottom",
      animation: "fadeIn .5s infinite alternate"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 12,
      flexWrap: "wrap"
    }
  }, ["Ton plus direct", "Ajouter une offre", "Plus court"].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    className: "badge badge-primary",
    style: {
      height: 30,
      padding: "0 12px",
      cursor: "pointer",
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wand",
    size: 12
  }), " ", t)))));
}
function buildEmail(p) {
  const first = p.contact.split(" ")[0];
  return `Bonjour ${first},

Suite à votre intérêt pour notre formation « ${p.formation} », je reviens vers vous avec plaisir.

Une nouvelle session est en cours d'ouverture et il reste actuellement quelques places. Cette formation est particulièrement adaptée aux PME qui souhaitent monter rapidement en compétence, avec un format concret et opérationnel.

Je serais ravie d'échanger 15 minutes pour cerner vos besoins et vous proposer les meilleures dates. Seriez-vous disponible en début de semaine prochaine ?

Bien à vous,
${CENTER.user.name}
${CENTER.name}`;
}
Object.assign(window, {
  ProspectsPage,
  ProspectCard,
  RelanceDrawer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/page_prospects.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/page_qualite.jsx
try { (() => {
// ============================================================
// Qualité
// ============================================================
function QualitePage() {
  const metrics = [{
    label: "Taux de satisfaction",
    value: 94,
    color: "var(--positive)",
    sub: "Moyenne 4,7/5 · 38 réponses"
  }, {
    label: "Taux de présence",
    value: 91,
    color: "var(--primary)",
    sub: "Sur les 6 dernières sessions"
  }, {
    label: "Taux de complétion",
    value: 88,
    color: "var(--sky)",
    sub: "Apprenants allés au terme"
  }];
  const retours = [{
    name: "Karim Saïdi",
    entreprise: "Méridien",
    note: 5,
    txt: "Formation très concrète, applicable dès le lundi. La formatrice connaît parfaitement les enjeux PME.",
    formation: "Excel Avancé"
  }, {
    name: "Chloé Marchand",
    entreprise: "Lagon Digital",
    note: 4,
    txt: "Bon rythme et beaucoup d'exercices. J'aurais aimé un peu plus de temps sur les TCD.",
    formation: "Excel Avancé"
  }, {
    name: "Antoine Berger",
    entreprise: "Soleil PME",
    note: 5,
    txt: "Le passage sur DAX était limpide. Je recommande pour toute équipe data.",
    formation: "Power BI"
  }];
  const actions = [{
    t: "Ajouter 1h d'atelier TCD sur Excel Avancé",
    statut: "En cours",
    tone: "warn"
  }, {
    t: "Standardiser l'envoi des questionnaires J+1",
    statut: "Planifié",
    tone: "neutral"
  }, {
    t: "Mettre à jour les supports Power BI (DAX)",
    statut: "Fait",
    tone: "positive"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Qualit\xE9",
    subtitle: "Centralisez vos preuves qualit\xE9 et vos indicateurs utiles \xE0 votre d\xE9marche qualit\xE9."
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " Exporter le rapport")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 16,
      marginBottom: 20
    }
  }, metrics.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.label,
    className: "card card-pad",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Donut, {
    value: m.value,
    size: 92,
    stroke: 10,
    color: m.color
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14.5
    }
  }, m.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      marginTop: 4,
      lineHeight: 1.4
    }
  }, m.sub))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 360px",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      padding: "16px 20px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message",
    size: 17,
    style: {
      color: "var(--primary)"
    }
  }), " Retours apprenants r\xE9cents"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ai btn-sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 14
  }), " Synth\xE9tiser")), /*#__PURE__*/React.createElement("div", null, retours.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "16px 20px",
      borderBottom: i < retours.length - 1 ? "1px solid var(--border-2)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spread",
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar",
    style: {
      width: 32,
      height: 32,
      fontSize: 11,
      background: "var(--primary)"
    }
  }, r.name.split(" ").map(x => x[0]).join("")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, r.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)"
    }
  }, r.entreprise, " \xB7 ", r.formation))), /*#__PURE__*/React.createElement(Stars, {
    n: r.note
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: "var(--ink-2)",
      lineHeight: 1.55,
      fontStyle: "italic"
    }
  }, "\xAB ", r.txt, " \xBB"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(DocIcon, {
    name: "alert-circle",
    tone: "warn",
    size: 44
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 24,
      fontWeight: 800
    }
  }, "0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, "R\xE9clamation en cours"))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "15px 18px",
      borderBottom: "1px solid var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 14.5,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    size: 16,
    style: {
      color: "var(--primary)"
    }
  }), " Actions d'am\xE9lioration")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12
    }
  }, actions.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      padding: "10px 8px",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.tone === "positive" ? "check-circle" : "circle",
    size: 17,
    style: {
      color: a.tone === "positive" ? "var(--positive-600)" : "var(--ink-4)",
      flex: "none",
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      lineHeight: 1.4,
      textDecoration: a.tone === "positive" ? "line-through" : "none",
      color: a.tone === "positive" ? "var(--ink-3)" : "var(--ink)"
    }
  }, a.t)), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-" + a.tone,
    style: {
      flex: "none"
    }
  }, a.statut))))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad",
    style: {
      background: "var(--surface-2)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-circle",
    size: 13,
    style: {
      verticalAlign: "-2px",
      marginRight: 4
    }
  }), " Le Bon Rebond centralise vos preuves qualit\xE9. Il ne se substitue pas \xE0 une certification Qualiopi.")))));
}
Object.assign(window, {
  QualitePage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/page_qualite.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/app/page_sessions.jsx
try { (() => {
// ============================================================
// Sessions — table  +  New Session modal content
// ============================================================
const {
  useState: useStateS
} = React;
function SessionsPage({
  onNewSession
}) {
  const [tab, setTab] = useStateS("all");
  const tabs = [{
    id: "all",
    label: "Toutes",
    n: SESSIONS.length
  }, {
    id: "ouverte",
    label: "Ouvertes",
    n: SESSIONS.filter(s => s.statut === "ouverte").length
  }, {
    id: "risque",
    label: "À risque",
    n: SESSIONS.filter(s => s.statut === "risque").length
  }, {
    id: "complete",
    label: "Complètes",
    n: SESSIONS.filter(s => s.statut === "complete").length
  }, {
    id: "terminee",
    label: "Terminées",
    n: SESSIONS.filter(s => s.statut === "terminee").length
  }];
  const list = SESSIONS.filter(s => tab === "all" || s.statut === tab);
  return /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Sessions",
    subtitle: "G\xE9rez le remplissage et la rentabilit\xE9 de chaque session."
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }), " Exporter"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onNewSession
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Nouvelle session")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 18,
      borderBottom: "1px solid var(--border)",
      overflowX: "auto"
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: {
      padding: "10px 14px 13px",
      fontSize: 13.5,
      fontWeight: 700,
      whiteSpace: "nowrap",
      color: tab === t.id ? "var(--primary)" : "var(--ink-2)",
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, t.label, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      padding: "1px 6px",
      borderRadius: 99,
      background: tab === t.id ? "var(--primary-50)" : "var(--surface-3)",
      color: tab === t.id ? "var(--primary)" : "var(--ink-3)",
      fontWeight: 700
    }
  }, t.n), tab === t.id && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 8,
      right: 8,
      bottom: -1,
      height: 2.5,
      borderRadius: 99,
      background: "var(--primary)"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl",
    style: {
      minWidth: 900
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Formation"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Formateur"), /*#__PURE__*/React.createElement("th", null, "Inscrits"), /*#__PURE__*/React.createElement("th", {
    style: {
      minWidth: 160
    }
  }, "Remplissage"), /*#__PURE__*/React.createElement("th", null, "Statut"), /*#__PURE__*/React.createElement("th", null, "Documents"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, list.map(s => {
    const pct = Math.round(s.inscrits / s.capacite * 100);
    const seuilPct = Math.round(s.seuil / s.capacite * 100);
    return /*#__PURE__*/React.createElement("tr", {
      key: s.id
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontWeight: 700,
        maxWidth: 220
      }
    }, s.formation), /*#__PURE__*/React.createElement("td", {
      style: {
        whiteSpace: "nowrap"
      }
    }, s.date), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        whiteSpace: "nowrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "avatar",
      style: {
        width: 24,
        height: 24,
        fontSize: 9.5,
        background: s.fColor
      }
    }, s.fInit), /*#__PURE__*/React.createElement("span", {
      style: {
        color: s.formateur === "Non confirmé" ? "var(--danger-strong)" : "var(--ink)",
        fontWeight: s.formateur === "Non confirmé" ? 700 : 500
      }
    }, s.formateur))), /*#__PURE__*/React.createElement("td", {
      className: "tnum",
      style: {
        fontWeight: 700
      }
    }, s.inscrits, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--ink-3)",
        fontWeight: 500
      }
    }, "/", s.capacite)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FillBar, {
      value: pct,
      seuil: seuilPct,
      width: 120
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(SessionBadge, {
      statut: s.statut
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 5,
        color: "var(--ink-2)",
        fontSize: 12.5
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "file-text",
      size: 14,
      style: {
        color: "var(--ink-3)"
      }
    }), " ", s.statut === "terminee" ? "Attestations" : s.statut === "risque" ? "Incomplets" : "Convocations")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost btn-icon",
      style: {
        color: "var(--ink-3)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "more",
      size: 18
    }))));
  }))))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "var(--ink-3)",
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 2,
      height: 12,
      background: "var(--ink)",
      opacity: .35,
      display: "inline-block"
    }
  }), " La barre verticale indique le seuil de rentabilit\xE9 de chaque session."));
}
function NewSessionForm() {
  const [step, setStep] = useStateS(0);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Formation"), /*#__PURE__*/React.createElement("select", {
    className: "select"
  }, FORMATIONS.map(f => /*#__PURE__*/React.createElement("option", {
    key: f.id
  }, f.title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Date de d\xE9but"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    type: "date",
    defaultValue: "2026-06-18"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Modalit\xE9"), /*#__PURE__*/React.createElement("select", {
    className: "select"
  }, /*#__PURE__*/React.createElement("option", null, "Pr\xE9sentiel"), /*#__PURE__*/React.createElement("option", null, "Distanciel"), /*#__PURE__*/React.createElement("option", null, "Hybride")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Formateur"), /*#__PURE__*/React.createElement("select", {
    className: "select"
  }, FORMATEURS.map(f => /*#__PURE__*/React.createElement("option", {
    key: f.id
  }, f.name)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "field-label"
  }, "Capacit\xE9"), /*#__PURE__*/React.createElement("input", {
    className: "input tnum",
    type: "number",
    defaultValue: "12"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--primary-tint)",
      border: "1px solid var(--primary-100)",
      borderRadius: 12,
      padding: "12px 14px",
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 18,
    style: {
      color: "var(--primary)",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)"
    }
  }, "L'assistant sugg\xE8re le ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--ink)"
    }
  }, "mardi 18 juin"), " \u2014 92 % compatible avec les disponibilit\xE9s des formateurs et salles."))));
}
Object.assign(window, {
  SessionsPage,
  NewSessionForm
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/app/page_sessions.jsx", error: String((e && e.message) || e) }); }

// export/lebonrebond-complet/assets/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever you want the user to
 * supply an image. You control the slot's shape and size; the user fills it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The host bridge only allows sidecar writes at the project root, so the
 * HTML that uses this component is assumed to live at the project root too
 * (same constraint as design_canvas.jsx).
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          object-fit: cover | contain | fill.       (default 'cover')
 *                With cover (the default) double-clicking the filled slot
 *                enters a reframe mode: the whole image spills past the mask
 *                (translucent outside, opaque inside), drag to reposition,
 *                corner-drag to scale. The crop persists alongside the image
 *                in the sidecar. contain/fill stay static.
 *   position     object-position for fit=contain|fill.     (default '50% 50%')
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. A user drop overrides
 *                it; clearing the drop reveals src again.
 *
 * Size and layout come from ordinary CSS on the element — width/height
 * inline or from a parent grid — so it composes with any layout.
 *
 * Usage:
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet = ':host{display:inline-block;position:relative;vertical-align:top;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(0,0,0,.55);width:240px;height:160px}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(0,0,0,.04)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  '.spill{position:absolute;transform:translate(-50%,-50%);display:none;z-index:1;' + '  cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .spill{display:block}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px;text-decoration-color:rgba(0,0,0,.25)}' + '.empty:hover .sub u{color:rgba(0,0,0,.75);text-decoration-color:currentColor}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed rgba(0,0,0,.25);' + '  transition:border-color .12s}' + ':host([data-over]) .ring{border-color:#c96442}' + ':host([data-filled]) .ring{display:none}' +
  // Controls sit BELOW the mask (top:100%), absolutely positioned so the
  // author-declared slot height is unaffected. The gap is padding, not a
  // top offset, so the hover target stays contiguous with the frame.
  '.ctl{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:8px;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'position', 'placeholder', 'src', 'id'];
    }
    constructor() {
      super();
      const root = this.attachShadow({
        mode: 'open'
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="ring" part="ring"></div>' + '</div>' + '<div class="spill">' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' + '<div class="ctl"><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="clear" title="Remove image">Remove</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (act === 'replace') {
          this._exitReframe(true);
          this._input.click();
        }
        if (act === 'clear') {
          this._exitReframe(false);
          this._gen++;
          this._local = null;
          if (this.id) setSlot(this.id, null);else this._render();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      this._img.addEventListener('load', () => this._applyView());
      // Gated on editable + fit=cover so share links and contain/fill slots
      // stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const base = Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (commit) this._commitView();
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is only meaningful for fit=cover — contain/fill
    // keep the old object-fit path and double-click is a no-op.
    _reframes() {
      return this.hasAttribute('data-filled') && (this.getAttribute('fit') || 'cover') === 'cover';
    }

    // Cover-baseline geometry, shared by clamp/apply/resize. Null until the
    // img has loaded (naturalWidth is 0 before that) or when the slot has no
    // layout box — ResizeObserver fires with a 0×0 rect under display:none,
    // and clamping against a degenerate 1×1 frame would silently pull the
    // stored pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      return {
        iw,
        ih,
        fw,
        fh,
        base: Math.max(fw / iw, fh / ih)
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      const fit = this.getAttribute('fit') || 'cover';
      if (fit !== 'cover' || !g) {
        // Non-cover, or dimensions not known yet (before img load).
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = fit;
        this._img.style.objectPosition = this.getAttribute('position') || '50% 50%';
        return;
      }
      // Cover baseline: img fills the frame on its tighter axis at s=1, so
      // pan works immediately on the overflowing axis without zooming first.
      // Width/height and left/top are all frame-% — depends only on the
      // frame aspect ratio, so a responsive resize keeps the same crop. The
      // spill layer mirrors the same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      this._spill.style.width = w;
      this._spill.style.height = h;
      this._spill.style.left = l;
      this._spill.style.top = t;
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      if (url) {
        if (this._img.getAttribute('src') !== url) {
          this._img.src = url;
          this._ghost.src = url;
        }
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        this._empty.style.display = 'flex';
        this.removeAttribute('data-filled');
      }
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-complet/assets/image-slot.js", error: String((e && e.message) || e) }); }

// export/lebonrebond-site/assets/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever you want the user to
 * supply an image. You control the slot's shape and size; the user fills it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The host bridge only allows sidecar writes at the project root, so the
 * HTML that uses this component is assumed to live at the project root too
 * (same constraint as design_canvas.jsx).
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          object-fit: cover | contain | fill.       (default 'cover')
 *                With cover (the default) double-clicking the filled slot
 *                enters a reframe mode: the whole image spills past the mask
 *                (translucent outside, opaque inside), drag to reposition,
 *                corner-drag to scale. The crop persists alongside the image
 *                in the sidecar. contain/fill stay static.
 *   position     object-position for fit=contain|fill.     (default '50% 50%')
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. A user drop overrides
 *                it; clearing the drop reveals src again.
 *
 * Size and layout come from ordinary CSS on the element — width/height
 * inline or from a parent grid — so it composes with any layout.
 *
 * Usage:
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet = ':host{display:inline-block;position:relative;vertical-align:top;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(0,0,0,.55);width:240px;height:160px}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(0,0,0,.04)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  '.spill{position:absolute;transform:translate(-50%,-50%);display:none;z-index:1;' + '  cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .spill{display:block}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px;text-decoration-color:rgba(0,0,0,.25)}' + '.empty:hover .sub u{color:rgba(0,0,0,.75);text-decoration-color:currentColor}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed rgba(0,0,0,.25);' + '  transition:border-color .12s}' + ':host([data-over]) .ring{border-color:#c96442}' + ':host([data-filled]) .ring{display:none}' +
  // Controls sit BELOW the mask (top:100%), absolutely positioned so the
  // author-declared slot height is unaffected. The gap is padding, not a
  // top offset, so the hover target stays contiguous with the frame.
  '.ctl{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:8px;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'position', 'placeholder', 'src', 'id'];
    }
    constructor() {
      super();
      const root = this.attachShadow({
        mode: 'open'
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="ring" part="ring"></div>' + '</div>' + '<div class="spill">' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' + '<div class="ctl"><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="clear" title="Remove image">Remove</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (act === 'replace') {
          this._exitReframe(true);
          this._input.click();
        }
        if (act === 'clear') {
          this._exitReframe(false);
          this._gen++;
          this._local = null;
          if (this.id) setSlot(this.id, null);else this._render();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      this._img.addEventListener('load', () => this._applyView());
      // Gated on editable + fit=cover so share links and contain/fill slots
      // stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const base = Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (commit) this._commitView();
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is only meaningful for fit=cover — contain/fill
    // keep the old object-fit path and double-click is a no-op.
    _reframes() {
      return this.hasAttribute('data-filled') && (this.getAttribute('fit') || 'cover') === 'cover';
    }

    // Cover-baseline geometry, shared by clamp/apply/resize. Null until the
    // img has loaded (naturalWidth is 0 before that) or when the slot has no
    // layout box — ResizeObserver fires with a 0×0 rect under display:none,
    // and clamping against a degenerate 1×1 frame would silently pull the
    // stored pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      return {
        iw,
        ih,
        fw,
        fh,
        base: Math.max(fw / iw, fh / ih)
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      const fit = this.getAttribute('fit') || 'cover';
      if (fit !== 'cover' || !g) {
        // Non-cover, or dimensions not known yet (before img load).
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = fit;
        this._img.style.objectPosition = this.getAttribute('position') || '50% 50%';
        return;
      }
      // Cover baseline: img fills the frame on its tighter axis at s=1, so
      // pan works immediately on the overflowing axis without zooming first.
      // Width/height and left/top are all frame-% — depends only on the
      // frame aspect ratio, so a responsive resize keeps the same crop. The
      // spill layer mirrors the same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      this._spill.style.width = w;
      this._spill.style.height = h;
      this._spill.style.left = l;
      this._spill.style.top = t;
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      if (url) {
        if (this._img.getAttribute('src') !== url) {
          this._img.src = url;
          this._ghost.src = url;
        }
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        this._empty.style.display = 'flex';
        this.removeAttribute('data-filled');
      }
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "export/lebonrebond-site/assets/image-slot.js", error: String((e && e.message) || e) }); }

})();
