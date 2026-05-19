// Landing page — cinematic editorial spread
const { useState: useState_l } = React;

function Landing({ lang, goto }) {
  const t = STRINGS[lang];

  return (
    <div style={landingStyles.root}>
      {/* HERO */}
      <section style={landingStyles.hero}>
        <div style={landingStyles.heroGrid}>

          {/* Left: copy */}
          <div style={landingStyles.heroLeft}>
            <div className="eyebrow">{t.eyebrow}</div>

            <h1 style={landingStyles.h1}>
              <span style={{ display: "block" }}>{t.h1Part1}</span>
              <span style={{ display: "block", fontStyle: "italic", color: "var(--accent)" }}>
                {t.h1Part2}
              </span>
              <span style={landingStyles.qmark}>{t.h1Part3}</span>
            </h1>

            <div style={landingStyles.kicker}>{t.leadKicker}</div>

            <p style={landingStyles.lead}>{t.lead}</p>

            {/* CTA */}
            <div style={landingStyles.ctaRow}>
              <button style={landingStyles.ctaPrimary} onClick={() => goto("calc")}>
                <span>{t.ctaStart}</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 6 }}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button style={landingStyles.ctaSecondary} onClick={() => goto("method")}>
                {t.ctaMethod}
              </button>
            </div>

            {/* formula card */}
            <div style={landingStyles.formula}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>{t.formulaLabel}</div>
              <div style={landingStyles.formulaLine}>
                <span style={{ fontStyle: "italic", fontFamily: "var(--serif)", fontSize: 28 }}>Age</span>
                <span style={landingStyles.eq}>=</span>
                <span style={landingStyles.num}>41.1</span>
                <span style={landingStyles.op}>+</span>
                <span style={landingStyles.num}>2.14</span>
                <span style={landingStyles.var_}>S</span>
                <span style={landingStyles.op}>+</span>
                <span style={landingStyles.num}>1.39</span>
                <span style={landingStyles.var_}>P</span>
                <span style={landingStyles.op}>−</span>
                <span style={landingStyles.num}>9.4</span>
                <span style={landingStyles.var_}>G</span>
              </div>
              <div style={landingStyles.formulaLegend}>
                <div><span style={landingStyles.varSmall}>S</span> — {t.sLabel}</div>
                <div><span style={landingStyles.varSmall}>P</span> — {t.pLabel}</div>
                <div><span style={landingStyles.varSmall}>G</span> — {t.gLabel}</div>
              </div>
            </div>
          </div>

          {/* Right: engraving */}
          <HeroPlate lang={lang}/>
        </div>

        {/* bottom stats strip */}
        <div style={landingStyles.statsStrip}>
          <Stat eyebrow={t.sampleLabel} value={t.sampleValue} />
          <Stat eyebrow={t.rangeLabel} value={t.rangeValue} />
          <Stat eyebrow={t.bestLabel} value={t.bestValue} highlight />
          <Stat eyebrow="R²" value="0.62" mono />
        </div>
      </section>

      {/* fleuron divider */}
      <div style={landingStyles.fleuronWrap}>
        <Fleuron width={300} opacity={0.55}/>
      </div>

      {/* METHOD section */}
      <section id="method-section" style={landingStyles.method}>
        <div style={landingStyles.methodGrid}>
          <div>
            <div className="eyebrow">§ 01</div>
            <h2 style={landingStyles.h2}>{t.methodTitle}</h2>
          </div>
          <div style={landingStyles.methodCol}>
            <p style={landingStyles.lead}>{t.methodLead}</p>
            <p style={landingStyles.body}>{t.methodP1}</p>
            <p style={landingStyles.body}>{t.methodP2}</p>
          </div>
        </div>

        {/* MAE chart preview */}
        <div style={landingStyles.maeChart}>
          <div className="eyebrow" style={{marginBottom: 18}}>
            { lang === "ru" ? "Средняя абсолютная ошибка по возрастным группам" : "Mean absolute error by age group" }
          </div>
          <MaeChart />
        </div>
      </section>

      {/* fleuron divider */}
      <div style={landingStyles.fleuronWrap}>
        <Fleuron width={260} opacity={0.5}/>
      </div>

      {/* AUTHORS */}
      <section style={landingStyles.authors}>
        <div style={landingStyles.methodGrid}>
          <div>
            <div className="eyebrow">§ 02</div>
            <h2 style={landingStyles.h2}>{t.authorsTitle}</h2>
          </div>
          <div>
            {t.authors.map(([name, role], i) => (
              <div key={i} style={landingStyles.author}>
                <div style={landingStyles.authorName}>{name}</div>
                <div style={landingStyles.authorRole}>{role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* footer disclaimer */}
      <footer style={landingStyles.footer}>
        <div style={landingStyles.disclaimerGrid}>
          <div>
            <div className="eyebrow" style={{color: "var(--danger)"}}>{ lang === "ru" ? "Дисклеймер" : "Disclaimer" }</div>
          </div>
          <div style={{color: "var(--fg-dim)", maxWidth: 640}}>{t.disclaimer}</div>
        </div>
        <div style={landingStyles.footerBottom}>
          <span className="serif italic">Cranium</span>
          <span className="mono" style={{fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-mute)"}}>
            © 2026 · M. Samokhina · Herzen U. · MAE RAS
          </span>
        </div>
      </footer>
    </div>
  );
}

function Stat({ eyebrow, value, highlight, mono }) {
  return (
    <div style={landingStyles.stat}>
      <div className="eyebrow">{eyebrow}</div>
      <div style={{
        fontFamily: mono ? "var(--mono)" : "var(--serif)",
        fontStyle: mono ? "normal" : "italic",
        fontSize: 24,
        color: highlight ? "var(--accent)" : "var(--fg)",
        marginTop: 8,
        letterSpacing: mono ? "-0.02em" : "0",
      }}>{value}</div>
    </div>
  );
}

// --- Hero plate: bitmap engraving with mouse-parallax tilt + interactive label hover
function HeroPlate({ lang }) {
  const ref = React.useRef(null);
  const imgRef = React.useRef(null);
  const [hovered, setHovered] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;
    let raf = null;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const tx = (x - 0.5) * 2;
      const ty = (y - 0.5) * 2;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const img = imgRef.current;
        if (img) {
          img.style.transform =
            `perspective(1400px) rotateX(${(-ty * 2.4).toFixed(2)}deg) rotateY(${(tx * 3.0).toFixed(2)}deg) translateZ(0)`;
        }
      });
    };
    const onLeave = () => {
      const img = imgRef.current;
      if (img) img.style.transform = "perspective(1400px) rotateX(0deg) rotateY(0deg)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Anatomical label regions, in image coords (1086 × 1448 native).
  // Centred on the printed callouts so the hover halo overlaps the label text.
  const REGIONS = [
    { id: "calvaria",   x: 0.40, y: 0.16, label: "Calvaria",            ru: "свод черепа" },
    { id: "parietale",  x: 0.74, y: 0.22, label: "Os parietale",        ru: "теменная кость" },
    { id: "orbita",     x: 0.28, y: 0.40, label: "Orbita",              ru: "глазница" },
    { id: "piriformis", x: 0.21, y: 0.49, label: "Apertura piriformis", ru: "грушевидное отверстие" },
    { id: "mandibula",  x: 0.30, y: 0.69, label: "Mandibula",           ru: "нижняя челюсть" },
    { id: "occipitale", x: 0.83, y: 0.49, label: "Os occipitale",       ru: "затылочная кость" },
    { id: "mastoideus", x: 0.65, y: 0.62, label: "Processus mastoideus", ru: "сосцевидный отросток" },
  ];

  const r = hovered ? REGIONS.find(x => x.id === hovered) : null;

  return (
    <div style={landingStyles.heroRight}>
      <div
        ref={ref}
        style={{
          ...landingStyles.engravingFrame,
          padding: 0,
          border: "none",
          boxShadow: "none",
          background: "transparent",
          perspective: "1400px",
        }}
      >
        <div
          ref={imgRef}
          style={{
            position: "relative",
            width: "100%",
            transformStyle: "preserve-3d",
            transition: "transform 600ms cubic-bezier(0.2, 0.7, 0.2, 1)",
            filter: "drop-shadow(0 14px 36px oklch(0.20 0.04 50 / 0.22))",
          }}
        >
          <img
            src="assets/hero-cranium.avif"
            alt="Cranium humanum, norma lateralis sinistra · TAB I · MMXXVI"
            draggable={false}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              userSelect: "none",
              opacity: mounted ? 1 : 0,
              transition: "opacity 900ms ease-out",
            }}
          />

          {/* hover regions over the printed anatomical callouts */}
          <svg
            viewBox="0 0 1086 1448"
            preserveAspectRatio="xMidYMid meet"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {REGIONS.map(reg => {
              const active = hovered === reg.id;
              const cx = reg.x * 1086;
              const cy = reg.y * 1448;
              return (
                <g key={reg.id}>
                  <circle
                    cx={cx} cy={cy} r={84}
                    fill="transparent"
                    style={{ pointerEvents: "all", cursor: "help" }}
                    onMouseEnter={() => setHovered(reg.id)}
                    onMouseLeave={() => setHovered(null)}
                  />
                  <circle
                    cx={cx} cy={cy} r={active ? 62 : 0}
                    fill="none"
                    stroke="oklch(0.48 0.18 30)"
                    strokeWidth="1.4"
                    opacity={active ? 0.85 : 0}
                    style={{ transition: "r 360ms ease, opacity 220ms" }}
                  />
                  <circle
                    cx={cx} cy={cy} r={active ? 36 : 0}
                    fill="oklch(0.48 0.18 30)"
                    opacity={active ? 0.10 : 0}
                    style={{ transition: "r 360ms ease, opacity 220ms" }}
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* floating marker — sample size */}
      <div style={landingStyles.floatingMarker}>
        <div style={landingStyles.markerDot}></div>
        <div>
          <div style={{fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-mute)"}}>
            N = 129
          </div>
          <div className="serif italic" style={{fontSize: 14, color: "var(--fg)"}}>
            {lang === "ru" ? "обучающая выборка" : "training sample"}
          </div>
        </div>
      </div>

      {/* hovered-label readout */}
      <div style={landingStyles.heroReadout}>
        <div style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--fg-mute)",
        }}>{lang === "ru" ? "Наведите курсор на череп" : "Hover the engraving"}</div>
        <div className="serif italic" style={{
          fontSize: 22,
          color: r ? "var(--accent)" : "var(--fg-mute)",
          marginTop: 4,
          minHeight: 30,
          transition: "color 220ms",
        }}>
          {r ? r.label : "—"}
          {r && lang === "ru" && (
            <span style={{ fontStyle: "normal", fontFamily: "var(--sans)", fontSize: 13, color: "var(--fg-mute)", marginLeft: 10 }}>
              · {r.ru}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function MaeChart() {
  const data = ACCURACY;
  const maxMae = 25;
  return (
    <svg viewBox="0 0 800 240" style={{ width: "100%", height: "auto" }}>
      {/* baseline */}
      <line x1="0" y1="200" x2="800" y2="200" stroke="var(--line)" strokeWidth="0.5"/>
      {/* MAE bars */}
      {data.map((d, i) => {
        const w = 800 / data.length;
        const x = i * w + w * 0.18;
        const bw = w * 0.64;
        const h = (d.mae / maxMae) * 170;
        const isBest = d.group === "40–49";
        return (
          <g key={i}>
            <rect x={x} y={200 - h} width={bw} height={h}
              fill={isBest ? "var(--accent)" : "var(--fg)"}
              opacity={isBest ? 1 : 0.18}
            />
            <text x={x + bw/2} y={200 - h - 8}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize="13"
              fill={isBest ? "var(--accent)" : "var(--fg)"}
              opacity={isBest ? 1 : 0.7}
            >{d.mae}</text>
            <text x={x + bw/2} y={222}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize="11"
              fill="var(--fg-mute)"
              letterSpacing="0.05em"
            >{d.group}</text>
          </g>
        );
      })}
    </svg>
  );
}

const landingStyles = {
  root: {
    position: "relative",
    minHeight: "100vh",
    paddingTop: 0,
  },
  hero: {
    position: "relative",
    minHeight: "100vh",
    padding: "120px 64px 60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.05fr 1fr",
    gap: 80,
    alignItems: "start",
    flex: 1,
  },
  heroLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 30,
    paddingTop: 20,
  },
  h1: {
    fontFamily: "var(--serif)",
    fontWeight: 400,
    fontSize: "min(11vw, 152px)",
    lineHeight: 0.88,
    letterSpacing: "-0.03em",
    margin: 0,
    color: "var(--fg)",
  },
  qmark: {
    color: "var(--accent)",
    fontStyle: "italic",
    display: "inline",
  },
  kicker: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 22,
    color: "var(--fg-dim)",
    marginTop: -10,
  },
  lead: {
    fontFamily: "var(--sans)",
    fontSize: 17,
    lineHeight: 1.55,
    color: "var(--fg-dim)",
    maxWidth: 540,
    margin: 0,
  },
  body: {
    fontSize: 15,
    lineHeight: 1.65,
    color: "var(--fg-dim)",
    margin: "16px 0 0",
    maxWidth: 540,
  },
  ctaRow: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginTop: 8,
  },
  ctaPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "var(--accent)",
    color: "var(--bg)",
    padding: "16px 26px",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    fontFamily: "var(--sans)",
    transition: "transform 200ms, background 200ms",
    borderRadius: 0,
  },
  ctaSecondary: {
    color: "var(--fg)",
    padding: "16px 0",
    fontSize: 14,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    fontFamily: "var(--sans)",
    borderBottom: "1px solid var(--line-2)",
  },
  formula: {
    marginTop: 24,
    padding: "20px 24px",
    border: "1px solid var(--line)",
    background: "var(--bg-2)",
    maxWidth: 560,
  },
  formulaLine: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: 8,
    fontFamily: "var(--mono)",
    fontSize: 20,
    color: "var(--fg)",
  },
  eq: { color: "var(--accent)", fontSize: 22, margin: "0 4px" },
  num: { color: "var(--fg)", fontFamily: "var(--mono)" },
  var_: { fontStyle: "italic", fontFamily: "var(--serif)", fontSize: 24, color: "var(--accent)", marginLeft: 1 },
  op: { color: "var(--fg-mute)", margin: "0 2px" },
  varSmall: {
    fontStyle: "italic",
    fontFamily: "var(--serif)",
    fontSize: 16,
    color: "var(--accent)",
    marginRight: 4,
  },
  formulaLegend: {
    marginTop: 14,
    paddingTop: 14,
    borderTop: "1px solid var(--line)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontFamily: "var(--mono)",
    fontSize: 11,
    color: "var(--fg-mute)",
    letterSpacing: "0.02em",
  },

  heroRight: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  photoFrame: {
    position: "relative",
    width: "100%",
    aspectRatio: "3 / 4",
    background: "var(--bg-2)",
    border: "1px solid var(--fg)",
  },
  engravingFrame: {
    position: "relative",
    width: "100%",
    aspectRatio: "3 / 4",
    background: "oklch(0.90 0.028 80)",
    border: "1px solid var(--fg)",
    padding: 8,
    boxShadow: "inset 0 0 0 1px var(--bg), inset 0 0 0 2px var(--line)",
    overflow: "hidden",
  },
  crop: {
    position: "absolute",
    width: 22,
    height: 22,
    pointerEvents: "none",
  },
  photoCaption: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  floatingMarker: {
    position: "absolute",
    top: 40,
    left: -36,
    background: "var(--bg)",
    border: "1px solid var(--fg)",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: "3px 3px 0 var(--fg)",
  },
  markerDot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "var(--accent)",
  },

  statsStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 32,
    paddingTop: 40,
    marginTop: 40,
    borderTop: "1px solid var(--line)",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
  },

  fleuronWrap: {
    padding: "60px 64px 20px",
    display: "flex",
    justifyContent: "center",
  },
  heroReadout: {
    paddingTop: 4,
    display: "flex",
    flexDirection: "column",
  },
  method: {
    padding: "80px 64px 120px",
    borderTop: "1px solid var(--line)",
  },
  methodGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: 80,
    alignItems: "start",
  },
  methodCol: {
    maxWidth: 720,
  },
  h2: {
    fontFamily: "var(--serif)",
    fontWeight: 400,
    fontStyle: "italic",
    fontSize: 64,
    lineHeight: 1,
    letterSpacing: "-0.02em",
    margin: "8px 0 0",
    color: "var(--fg)",
  },
  maeChart: {
    marginTop: 80,
    padding: "32px",
    background: "var(--bg-2)",
    border: "1px solid var(--line)",
  },

  authors: {
    padding: "100px 64px",
    borderTop: "1px solid var(--line)",
  },
  author: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "20px 0",
    borderBottom: "1px solid var(--line)",
    gap: 24,
  },
  authorName: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 28,
    color: "var(--fg)",
    letterSpacing: "-0.01em",
  },
  authorRole: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--fg-mute)",
  },

  footer: {
    padding: "80px 64px 40px",
    borderTop: "1px solid var(--line)",
  },
  disclaimerGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: 80,
    paddingBottom: 60,
  },
  footerBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingTop: 32,
    borderTop: "1px solid var(--line)",
    fontSize: 28,
  },
};

Object.assign(window, { Landing });
