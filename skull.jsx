// Skull plates — bitmap engravings with pixel-accurate interactive hotspots.
// Three calculator views: superior (Norma verticalis), lateral (Norma lateralis), palate (Palatum osseum).
const { useState: useStateS, useRef: useRefS, useEffect: useEffectS } = React;

const SCORE_COLORS = {
  0: "var(--s0)",
  1: "var(--s1)",
  2: "var(--s2)",
  3: "var(--s3)",
};

// Image natural dimensions (all calc plates were rendered at the same size)
const PLATE_W = 1192;
const PLATE_H = 1320;

// Hotspot positions, in IMAGE coords (px). Found by red-marker centroid detection.
const VERTICALIS_MARKERS = [
  { key: "bregma",        nbr: 1, cx: 600, cy: 323, paired: false, label: ["Bregma", "BR"], labelDx:  26, labelDy: -16, anchor: "start" },
  { key: "midcoronal_L",  nbr: 5, cx: 412, cy: 331, paired: false, side: "L", label: ["Midcoronal L", "C-L"], labelDx: -26, labelDy: -16, anchor: "end" },
  { key: "midcoronal_R",  nbr: 6, cx: 788, cy: 340, paired: false, side: "R", label: ["Midcoronal R", "C-R"], labelDx:  26, labelDy: -16, anchor: "start" },
  { key: "antSagittal",   nbr: 2, cx: 600, cy: 452, paired: false, label: ["Ant. sagittal", "AS"], labelDx:  26, labelDy:   6, anchor: "start" },
  { key: "obelion",       nbr: 3, cx: 600, cy: 630, paired: false, label: ["Obelion", "OB"], labelDx:  26, labelDy:   6, anchor: "start" },
  { key: "lambda",        nbr: 4, cx: 600, cy: 746, paired: false, label: ["Lambda", "LA"], labelDx: -26, labelDy:   6, anchor: "end" },
  { key: "midlambdoid_L", nbr: 7, cx: 450, cy: 807, paired: false, side: "L", label: ["Midlambdoid L", "L-L"], labelDx: -26, labelDy:  18, anchor: "end" },
  { key: "midlambdoid_R", nbr: 8, cx: 749, cy: 810, paired: false, side: "R", label: ["Midlambdoid R", "L-R"], labelDx:  26, labelDy:  18, anchor: "start" },
];

const LATERALIS_MARKERS = [
  { key: "pterion",       nbr: 1, cx: 554, cy: 460, label: ["Pterion", "PT"], labelDx:  24, labelDy:  -2, anchor: "start" },
  { key: "sphenofrontal", nbr: 2, cx: 446, cy: 443, label: ["Sphenofrontal", "SF"], labelDx: -24, labelDy:  -6, anchor: "end" },
  { key: "supSpheno",     nbr: 3, cx: 623, cy: 490, label: ["Supra-sphenotemp.", "SS"], labelDx:  24, labelDy:   2, anchor: "start" },
  { key: "infSpheno",     nbr: 4, cx: 515, cy: 575, label: ["Infra-sphenotemp.", "IS"], labelDx: -24, labelDy:   6, anchor: "end" },
];

const PALATE_MARKERS = [
  { key: "medAnt",       nbr: 1, cx: 601, cy: 390, label: ["Median anterior", "M-A"], labelDx:  26, labelDy:  -2, anchor: "start", binary: true },
  { key: "medPost",      nbr: 2, cx: 589, cy: 777, label: ["Median posterior", "M-P"], labelDx:  26, labelDy:   2, anchor: "start", binary: true },
  { key: "transverseL",  nbr: 3, cx: 421, cy: 639, label: ["Transverse L", "T-L"], labelDx: -26, labelDy:  -2, anchor: "end", binary: true },
  { key: "transverseR",  nbr: 4, cx: 764, cy: 639, label: ["Transverse R", "T-R"], labelDx:  26, labelDy:  -2, anchor: "start", binary: true },
];

// --- INTERACTIVE HOTSPOT --------------------------------------------------
// Overlays a printed red marker on the bitmap with a clickable, score-aware disc.
function PlateHotspot({
  cx, cy, nbr, value, max = 3,
  onCycle,
  label, sublabel,
  labelDx = 0, labelDy = 0, labelAnchor = "start",
  showLabels = true,
  active, onHover, onLeave,
  binary = false,
  flipX = false,           // for lateralis right-side mirror
  imageW = PLATE_W,
}) {
  // when flipped, labels should anchor on opposite side
  const fx = flipX ? imageW - cx : cx;
  const flippedAnchor = flipX
    ? (labelAnchor === "start" ? "end" : labelAnchor === "end" ? "start" : labelAnchor)
    : labelAnchor;
  const flippedDx = flipX ? -labelDx : labelDx;

  const scored = value != null;
  const fillColor = scored ? SCORE_COLORS[value] : "var(--accent)";
  const textColor = scored
    ? (value >= 2 ? "oklch(0.95 0.02 80)" : (value === 0 ? "var(--fg)" : "oklch(0.95 0.02 80)"))
    : "oklch(0.95 0.02 80)";
  const display = scored ? value : nbr;

  // marker radius — covers the printed ~13–14 px circle
  const r = 18;

  return (
    <g className="plate-hotspot">
      {/* pulse ring when active */}
      {active && (
        <circle cx={fx} cy={cy} r={r + 8}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.2"
          opacity="0.55"
          style={{ pointerEvents: "none" }}
        />
      )}

      {/* main marker disc — fully replaces the printed one */}
      <circle cx={fx} cy={cy} r={r}
        fill={fillColor}
        stroke="oklch(0.18 0.02 50)"
        strokeWidth={active ? 1.8 : 1.2}
        style={{
          cursor: "pointer",
          transition: "fill 220ms, stroke-width 180ms",
          filter: active ? "drop-shadow(0 1px 3px rgba(28,22,18,0.35))" : "none",
        }}
        onClick={(e) => { e.stopPropagation(); onCycle && onCycle(); }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      />

      {/* serif digit inside */}
      <text
        x={fx} y={cy + 5.5}
        textAnchor="middle"
        fontFamily="var(--serif)"
        fontStyle={scored ? "normal" : "italic"}
        fontSize="18"
        fontWeight="500"
        fill={textColor}
        pointerEvents="none"
        style={{ userSelect: "none" }}
      >
        {display}
      </text>

      {/* anatomical label — italic serif with pointer */}
      {showLabels && label && (
        <g pointerEvents="none" style={{
          opacity: active ? 1 : 0.78,
          transition: "opacity 180ms",
        }}>
          {/* hairline pointer */}
          <line
            x1={fx + (flippedAnchor === "start" ? r + 2 : -(r + 2))}
            y1={cy + (labelDy < 0 ? -2 : labelDy > 0 ? 2 : 0)}
            x2={fx + flippedDx - (flippedAnchor === "start" ? 2 : -2)}
            y2={cy + labelDy - 5}
            stroke="oklch(0.30 0.03 50)"
            strokeWidth="0.7"
            opacity="0.6"
          />
          {/* label text — set in parchment-toned background for legibility on the engraving */}
          <text
            x={fx + flippedDx} y={cy + labelDy}
            textAnchor={flippedAnchor}
            fontFamily="var(--serif)"
            fontStyle="italic"
            fontSize="15"
            fill={active ? "var(--fg)" : "oklch(0.30 0.03 50)"}
            stroke="oklch(0.91 0.030 80)"
            strokeWidth="3"
            paintOrder="stroke"
            style={{ transition: "fill 180ms" }}
          >
            {label[0]}
          </text>
        </g>
      )}
    </g>
  );
}

// --- shared plate wrapper -------------------------------------------------
function Plate({ src, alt, markers, scores, getCycleHandler, hovered, setHovered, showLabels, flipX, lang, scoreKeyFor }) {
  return (
    <svg
      viewBox={`0 0 ${PLATE_W} ${PLATE_H}`}
      style={{ width: "100%", height: "100%", display: "block" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={flipX ? `translate(${PLATE_W},0) scale(-1,1)` : ""}>
        <image
          href={src}
          x="0" y="0"
          width={PLATE_W} height={PLATE_H}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>

      {markers.map(m => {
        const sk = scoreKeyFor ? scoreKeyFor(m) : m.key;
        const val = scores[sk];
        // for binary (palate): map 0/1 to display as 0 or 3 (score equivalent for color),
        // but actually for palate value is 0 or 1 — show as that
        return (
          <PlateHotspot
            key={sk}
            cx={m.cx} cy={m.cy} nbr={m.nbr}
            value={val}
            onCycle={getCycleHandler(sk, m.binary)}
            label={m.label}
            labelDx={m.labelDx} labelDy={m.labelDy} labelAnchor={m.anchor}
            showLabels={showLabels}
            active={hovered === sk}
            onHover={() => setHovered(sk)}
            onLeave={() => setHovered(null)}
            binary={m.binary}
            flipX={flipX}
            imageW={PLATE_W}
          />
        );
      })}
    </svg>
  );
}

// --- SUPERIOR (Norma verticalis) ------------------------------------------
function SuperiorView({ scores, onCycle, lang, showLabels = true, hovered, setHovered }) {
  const cycle = (key) => () => {
    const cur = scores[key];
    // null → 0 → 1 → 2 → 3 → null
    const next = cur == null ? 0 : cur >= 3 ? null : cur + 1;
    onCycle(key, next);
  };
  return (
    <Plate
      src="assets/calc-verticalis.avif"
      alt="Calc · Norma verticalis · TAB II"
      markers={VERTICALIS_MARKERS}
      scores={scores}
      getCycleHandler={(key) => cycle(key)}
      hovered={hovered} setHovered={setHovered}
      showLabels={showLabels}
      lang={lang}
    />
  );
}

// --- LATERAL (Norma lateralis sinistra / dextra) -------------------------
function LateralView({ scores, onCycle, lang, showLabels = true, side = "L", hovered, setHovered }) {
  const sfx = side === "L" ? "_L" : "_R";
  const cycle = (key) => () => {
    const cur = scores[key];
    const next = cur == null ? 0 : cur >= 3 ? null : cur + 1;
    onCycle(key, next);
  };
  return (
    <Plate
      src="assets/calc-lateralis.avif"
      alt={`Calc · Norma lateralis ${side === "L" ? "sinistra" : "dextra"} · TAB III`}
      markers={LATERALIS_MARKERS}
      scores={scores}
      scoreKeyFor={(m) => m.key + sfx}
      getCycleHandler={(key) => cycle(key)}
      hovered={hovered} setHovered={setHovered}
      showLabels={showLabels}
      flipX={side === "R"}
      lang={lang}
    />
  );
}

// --- PALATE (Palatum osseum) ---------------------------------------------
function PalateView({ scores, onCycle, lang, showLabels = true, hovered, setHovered }) {
  const toggle = (key) => () => onCycle(key, scores[key] ? 0 : 1);
  return (
    <Plate
      src="assets/calc-palatum.avif"
      alt="Calc · Palatum osseum · TAB IV"
      markers={PALATE_MARKERS}
      scores={scores}
      getCycleHandler={(key) => toggle(key)}
      hovered={hovered} setHovered={setHovered}
      showLabels={showLabels}
      lang={lang}
    />
  );
}

// =====================================================================
// STADIA reference modal — opened by a "?" / "Стадии" button.
// Shows the two engraved reference plates with a tabbed switch.
function StadiaModal({ open, onClose, lang }) {
  const [tab, setTab] = useStateS("vault");

  useEffectS(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "oklch(0.18 0.02 50 / 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "oklch(0.91 0.030 80)",
          border: "1px solid var(--fg)",
          boxShadow: "0 0 0 4px var(--bg), 0 30px 60px oklch(0.20 0.04 50 / 0.4)",
          maxWidth: 1200,
          width: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 28px",
          borderBottom: "1px solid var(--line)",
        }}>
          <div>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--fg-mute)",
            }}>{lang === "ru" ? "Атлас · Справочник стадий" : "Atlas · Stages reference"}</div>
            <div style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 28,
              color: "var(--fg)",
              marginTop: 2,
            }}>Stadia obliterationis</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setTab("vault")}
              style={{
                padding: "10px 14px",
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: tab === "vault" ? "var(--fg)" : "var(--fg-mute)",
                borderBottom: `2px solid ${tab === "vault" ? "var(--accent)" : "transparent"}`,
              }}
            >{lang === "ru" ? "Своды (0–III)" : "Vault (0–III)"}</button>
            <button
              onClick={() => setTab("palate")}
              style={{
                padding: "10px 14px",
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: tab === "palate" ? "var(--fg)" : "var(--fg-mute)",
                borderBottom: `2px solid ${tab === "palate" ? "var(--accent)" : "transparent"}`,
              }}
            >{lang === "ru" ? "Нёбо (0 / 1)" : "Palate (0 / 1)"}</button>
            <button
              onClick={onClose}
              style={{
                marginLeft: 8,
                width: 36, height: 36,
                border: "1px solid var(--line-2)",
                color: "var(--fg-dim)",
                fontSize: 18,
                lineHeight: 1,
              }}
              aria-label="Close"
            >×</button>
          </div>
        </div>

        {/* body — plate */}
        <div style={{
          flex: 1,
          overflow: "auto",
          padding: 28,
          background: "oklch(0.88 0.030 80)",
        }}>
          {tab === "vault" && (
            <StadiaVaultBody lang={lang}/>
          )}
          {tab === "palate" && (
            <StadiaPalateBody lang={lang}/>
          )}
        </div>

        {/* footer attribution */}
        <div style={{
          padding: "14px 28px",
          borderTop: "1px solid var(--line)",
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--fg-mute)",
          display: "flex",
          justifyContent: "space-between",
        }}>
          <span>{lang === "ru" ? "Secundum Meindl & Lovejoy, 1985" : "After Meindl & Lovejoy, 1985"}</span>
          <span>{lang === "ru" ? "Esc — закрыть" : "Esc — close"}</span>
        </div>
      </div>
    </div>
  );
}

function StadiaVaultBody({ lang }) {
  const captions = lang === "ru" ? [
    ["0", "Открыт", "Шов полностью открыт, прослеживается на всём протяжении."],
    ["I", "Единичные мостики", "Появляются точечные сращения, шов всё ещё чётко различим."],
    ["II", "Значительная облитерация", "Заращение более чем на половине длины, рисунок шва теряется."],
    ["III", "Полное заращение", "Шов исчез или едва различим как линия на кости."],
  ] : [
    ["0", "Open", "Suture fully open, traceable along the entire course."],
    ["I", "Minimal bridging", "Small bony bridges appear, suture still clearly visible."],
    ["II", "Significant closure", "More than half obliterated, suture line breaks up."],
    ["III", "Complete fusion", "Suture has vanished or shows only as a faint trace."],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <picture>
        <source srcSet="assets/plate-stadia-vault.avif" type="image/avif" />
        <img
          src="assets/plate-stadia-vault.jpg"
          alt="Stadia obliterationis suturarum"
          style={{
            width: "100%",
            display: "block",
            border: "1px solid var(--line-2)",
          }}
        />
      </picture>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 14,
      }}>
        {captions.map(([num, title, desc], i) => (
          <div key={i} style={{
            padding: "16px 18px",
            border: "1px solid var(--line)",
            background: "oklch(0.91 0.030 80)",
          }}>
            <div style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 32,
              color: "var(--accent)",
              lineHeight: 1,
            }}>{num}</div>
            <div style={{
              fontFamily: "var(--sans)",
              fontWeight: 500,
              fontSize: 14,
              color: "var(--fg)",
              marginTop: 8,
            }}>{title}</div>
            <div style={{
              fontFamily: "var(--sans)",
              fontSize: 12,
              color: "var(--fg-dim)",
              marginTop: 6,
              lineHeight: 1.5,
            }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StadiaPalateBody({ lang }) {
  const captions = lang === "ru" ? [
    ["0", "Различим", "Шов нёба прослеживается как тонкая зигзагообразная линия."],
    ["I", "Облитерирован", "Шов сросся, отдельные точки на месте бывшей линии."],
  ] : [
    ["0", "Distinct", "Palatal suture visible as a fine zigzag line."],
    ["I", "Obliterated", "Suture has fused; only stippled traces remain."],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <picture>
        <source srcSet="assets/plate-stadia-palate.avif" type="image/avif" />
        <img
          src="assets/plate-stadia-palate.jpg"
          alt="Stadia suturae palatinae"
          style={{
            width: "100%",
            display: "block",
            border: "1px solid var(--line-2)",
          }}
        />
      </picture>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 14,
      }}>
        {captions.map(([num, title, desc], i) => (
          <div key={i} style={{
            padding: "16px 18px",
            border: "1px solid var(--line)",
            background: "oklch(0.91 0.030 80)",
          }}>
            <div style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 32,
              color: "var(--accent)",
              lineHeight: 1,
            }}>{num}</div>
            <div style={{
              fontFamily: "var(--sans)",
              fontWeight: 500,
              fontSize: 14,
              color: "var(--fg)",
              marginTop: 8,
            }}>{title}</div>
            <div style={{
              fontFamily: "var(--sans)",
              fontSize: 12,
              color: "var(--fg-dim)",
              marginTop: 6,
              lineHeight: 1.5,
            }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- decorative ornament (fleuron) — section divider --------------------
function Fleuron({ width = 320, opacity = 0.55 }) {
  return (
    <img
      src="assets/ornament-fleuron.avif"
      alt=""
      aria-hidden="true"
      style={{
        display: "block",
        width,
        height: "auto",
        margin: "0 auto",
        opacity,
        userSelect: "none",
        pointerEvents: "none",
      }}
      draggable={false}
    />
  );
}

Object.assign(window, {
  SuperiorView, LateralView, PalateView,
  StadiaModal, Fleuron, SCORE_COLORS,
});
