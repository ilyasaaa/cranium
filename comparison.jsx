// Comparison screen
function Comparison({ lang, goto, currentAge }) {
  const t = STRINGS[lang];
  const methods = [
    { name: t.methodA, desc: t.methodADesc, color: "var(--accent)", idx: 0 },
    { name: t.methodB, desc: t.methodBDesc, color: "oklch(0.65 0.10 200)", idx: 1 },
    { name: t.methodC, desc: t.methodCDesc, color: "oklch(0.72 0.10 145)", idx: 2 },
  ];
  const maxMae = 25;

  return (
    <div style={cmpStyles.root}>
      <div style={cmpStyles.header}>
        <div className="eyebrow">{lang === "ru" ? "§ 03 · сравнительный анализ" : "§ 03 · comparative analysis"}</div>
        <h1 style={cmpStyles.h1}>{t.compareTitle}</h1>
        <p style={cmpStyles.lead}>{t.compareLead}</p>
      </div>

      {/* method cards */}
      <div style={cmpStyles.methodGrid}>
        {methods.map(m => (
          <div key={m.idx} style={cmpStyles.methodCard}>
            <div style={{...cmpStyles.methodSwatch, background: m.color}}></div>
            <div style={cmpStyles.methodName}>{m.name}</div>
            <div style={cmpStyles.methodDesc}>{m.desc}</div>
          </div>
        ))}
      </div>

      {/* big chart */}
      <div style={cmpStyles.chartBox}>
        <div style={cmpStyles.chartHead}>
          <div className="eyebrow">{lang === "ru" ? "MAE по возрастным группам, лет" : "MAE by age group, years"}</div>
          <div style={cmpStyles.chartLegend}>
            {methods.map(m => (
              <div key={m.idx} style={cmpStyles.legendChip}>
                <span style={{width: 10, height: 10, background: m.color, display: "inline-block"}}></span>
                <span style={{fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-dim)", letterSpacing: "0.02em"}}>{m.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
        <ComparisonChart data={COMPARISON_DATA} methods={methods} maxMae={maxMae} lang={lang}/>
      </div>

      {/* recommendation */}
      <div style={cmpStyles.recBox}>
        <div style={cmpStyles.recLeft}>
          <div className="eyebrow" style={{color: "var(--accent)"}}>{t.recTitle}</div>
        </div>
        <div style={cmpStyles.recRight}>
          <p style={cmpStyles.recBody}>{t.recBody}</p>
        </div>
      </div>
    </div>
  );
}

function ComparisonChart({ data, methods, maxMae, lang }) {
  // grouped bars
  const W = 1000;
  const H = 360;
  const padL = 60, padR = 30, padT = 30, padB = 60;
  const cw = W - padL - padR;
  const ch = H - padT - padB;
  const gW = cw / data.length;
  const bw = (gW * 0.65) / 3;
  const gap = (gW * 0.35) / 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {/* gridlines */}
      {[0, 5, 10, 15, 20, 25].map(v => {
        const y = padT + ch - (v / maxMae) * ch;
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={W - padR} y2={y}
              stroke="var(--line)" strokeWidth="0.5" opacity="0.6"/>
            <text x={padL - 12} y={y + 4}
              textAnchor="end"
              fontFamily="var(--mono)" fontSize="10"
              fill="var(--fg-mute)" letterSpacing="0.04em">{v}</text>
          </g>
        );
      })}

      {/* bars */}
      {data.map((d, i) => {
        const x0 = padL + i * gW + gap;
        return (
          <g key={i}>
            {d.mae.map((v, j) => {
              const bx = x0 + j * (bw + gap);
              const h = (v / maxMae) * ch;
              const by = padT + ch - h;
              return (
                <g key={j}>
                  <rect x={bx} y={by} width={bw} height={h}
                    fill={methods[j].color} opacity={j === 0 ? 1 : 0.7}/>
                  <text x={bx + bw/2} y={by - 6}
                    textAnchor="middle"
                    fontFamily="var(--mono)" fontSize="10"
                    fill="var(--fg-dim)">{v}</text>
                </g>
              );
            })}
            {/* group label */}
            <text x={x0 + gW/2 - gap} y={H - padB + 22}
              textAnchor="middle"
              fontFamily="var(--mono)" fontSize="11"
              fill="var(--fg-mute)" letterSpacing="0.06em">{d.group}</text>
          </g>
        );
      })}

      {/* y axis title */}
      <text x={20} y={padT - 12}
        fontFamily="var(--mono)" fontSize="9"
        fill="var(--fg-mute)" letterSpacing="0.1em">MAE</text>
      <text x={W/2} y={H - 12}
        fontFamily="var(--mono)" fontSize="9"
        textAnchor="middle"
        fill="var(--fg-mute)" letterSpacing="0.1em">
        {lang === "ru" ? "ВОЗРАСТНАЯ ГРУППА" : "AGE GROUP"}
      </text>
    </svg>
  );
}

const cmpStyles = {
  root: {
    paddingTop: 100,
    padding: "100px 64px 80px",
    minHeight: "100vh",
  },
  header: {
    maxWidth: 900,
    marginBottom: 60,
  },
  h1: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontWeight: 400,
    fontSize: 88,
    lineHeight: 0.95,
    letterSpacing: "-0.03em",
    margin: "12px 0 24px",
    color: "var(--fg)",
  },
  lead: {
    fontFamily: "var(--sans)",
    fontSize: 18,
    lineHeight: 1.55,
    color: "var(--fg-dim)",
    maxWidth: 760,
    margin: 0,
  },

  methodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginBottom: 40,
  },
  methodCard: {
    padding: 24,
    border: "1px solid var(--line)",
    background: "var(--bg-2)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minHeight: 140,
  },
  methodSwatch: {
    width: 24,
    height: 4,
  },
  methodName: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 22,
    color: "var(--fg)",
    letterSpacing: "-0.01em",
  },
  methodDesc: {
    fontFamily: "var(--sans)",
    fontSize: 13,
    color: "var(--fg-dim)",
    lineHeight: 1.5,
  },

  chartBox: {
    border: "1px solid var(--line)",
    padding: "32px 32px 16px",
    background: "var(--bg-2)",
    marginBottom: 40,
  },
  chartHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    gap: 24,
  },
  chartLegend: {
    display: "flex",
    gap: 18,
  },
  legendChip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  recBox: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: 60,
    padding: "40px 32px",
    border: "1px solid var(--accent-dim)",
    background: "oklch(0.88 0.05 30)",
    boxShadow: "inset 0 0 0 1px var(--bg), inset 0 0 0 2px var(--accent-dim)",
  },
  recLeft: {},
  recRight: {},
  recBody: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 28,
    lineHeight: 1.35,
    color: "var(--fg)",
    margin: 0,
    letterSpacing: "-0.01em",
  },
};

Object.assign(window, { Comparison });
