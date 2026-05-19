// Calculator screen — skull-centric, real-time
const { useState: useStateC, useMemo: useMemoC } = React;

// initial scores: undefined means unentered
const INITIAL_SCORES = {
  midlambdoid_L: null, midlambdoid_R: null,
  lambda: null,
  obelion: null,
  antSagittal: null,
  bregma: null,
  midcoronal_L: null, midcoronal_R: null,
  pterion_L: null, pterion_R: null,
  sphenofrontal_L: null, sphenofrontal_R: null,
  infSpheno_L: null, infSpheno_R: null,
  supSpheno_L: null, supSpheno_R: null,
  // palate
  transverseL: null, transverseR: null,
  medAnt: null, medPost: null,
};

const DEMO_SCORES = {
  midlambdoid_L: 2, midlambdoid_R: 2,
  lambda: 2, obelion: 2, antSagittal: 2, bregma: 2,
  midcoronal_L: 2, midcoronal_R: 2,
  pterion_L: 1, pterion_R: 1,
  sphenofrontal_L: 1, sphenofrontal_R: 1,
  infSpheno_L: 2, infSpheno_R: 2,
  supSpheno_L: 2, supSpheno_R: 2,
  transverseL: 1, transverseR: 1, medAnt: 1, medPost: 0,
};

// pair average — but Meindl & Lovejoy sums all 10 sites; for pairs we take mean.
// Per brief: "система автоматически считает среднее" for paired sites.
const VAULT_SITES = [
  { key: "midlambdoid", paired: true },
  { key: "lambda",      paired: false },
  { key: "obelion",     paired: false },
  { key: "antSagittal", paired: false },
  { key: "bregma",      paired: false },
  { key: "midcoronal",  paired: true },
  { key: "pterion",     paired: true },
  { key: "sphenofrontal", paired: true },
  { key: "infSpheno",   paired: true },
  { key: "supSpheno",   paired: true },
];

const PALATE_SITES = ["transverseL", "transverseR", "medAnt", "medPost"];

function siteValue(scores, site) {
  if (site.paired) {
    const l = scores[site.key + "_L"];
    const r = scores[site.key + "_R"];
    if (l == null && r == null) return null;
    if (l == null) return r;
    if (r == null) return l;
    return (l + r) / 2;
  }
  return scores[site.key];
}

function sumS(scores) {
  let s = 0; let any = false;
  for (const site of VAULT_SITES) {
    const v = siteValue(scores, site);
    if (v != null) { s += v; any = true; }
  }
  return { sum: s, any };
}
function sumP(scores) {
  let s = 0;
  for (const k of PALATE_SITES) s += (scores[k] || 0);
  return s;
}

function computeAge(scores, sex) {
  if (sex == null) return null;
  const { sum: S, any } = sumS(scores);
  if (!any) return null;
  const P = sumP(scores);
  const G = sex === "male" ? 1 : 0;
  return 41.1 + 2.14 * S + 1.39 * P - 9.4 * G;
}

function Calculator({ lang, scores, setScores, sex, setSex, goto }) {
  const t = STRINGS[lang];
  const [view, setView] = useStateC("top"); // top | lat_L | lat_R | palate
  const [hovered, setHovered] = useStateC(null);
  const [showLabels, setShowLabels] = useStateC(true);
  const [showAccTable, setShowAccTable] = useStateC(false);
  const [stadiaOpen, setStadiaOpen] = useStateC(false);

  const sInfo = useMemoC(() => sumS(scores), [scores]);
  const pVal = useMemoC(() => sumP(scores), [scores]);
  const age = useMemoC(() => computeAge(scores, sex), [scores, sex]);
  const ageRow = useMemoC(() => age != null ? maeForAge(age) : null, [age]);

  const onCycle = (key, val) => setScores(s => ({ ...s, [key]: val }));

  // pair component  — for one site (paired or not)
  const VaultSiteRow = ({ site }) => {
    const tInfo = t.sites[site.key];
    const val = siteValue(scores, site);
    const active = hovered === site.key || hovered === site.key + "_L" || hovered === site.key + "_R";
    return (
      <div
        style={{
          ...calcStyles.siteRow,
          background: active ? "var(--bg-3)" : "transparent",
          borderColor: active ? "var(--line-2)" : "var(--line)",
        }}
        onMouseEnter={() => setHovered(site.paired ? site.key + "_L" : site.key)}
        onMouseLeave={() => setHovered(null)}
      >
        <div style={calcStyles.siteHeader}>
          <div>
            <div style={calcStyles.siteName}>{tInfo[0]}</div>
            <div style={calcStyles.siteSub}>{tInfo[1]}</div>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 8, flexShrink: 0}}>
            {site.paired && val != null && (
              <div style={calcStyles.meanInline}>
                <span style={calcStyles.meanLabel}>{lang === "ru" ? "средн." : "mean"}</span>
                <span style={calcStyles.meanValue}>{val.toFixed(1)}</span>
              </div>
            )}
            {site.paired && <div style={calcStyles.pairedTag}>{t.paired}</div>}
          </div>
        </div>
        {site.paired ? (
          <div style={calcStyles.pairRow}>
            <Stepper
              label="L"
              full
              value={scores[site.key + "_L"]}
              onChange={(v) => onCycle(site.key + "_L", v)}
              onHover={() => setHovered(site.key + "_L")}
            />
            <Stepper
              label="R"
              full
              value={scores[site.key + "_R"]}
              onChange={(v) => onCycle(site.key + "_R", v)}
              onHover={() => setHovered(site.key + "_R")}
            />
          </div>
        ) : (
          <Stepper
            value={scores[site.key]}
            onChange={(v) => onCycle(site.key, v)}
            onHover={() => setHovered(site.key)}
            full
          />
        )}
      </div>
    );
  };

  return (
    <div style={calcStyles.root}>

      {/* HEADER STRIP */}
      <div style={calcStyles.header}>
        <div>
          <div className="eyebrow">{ lang === "ru" ? "Калькулятор · режим осмотра" : "Calculator · examination mode" }</div>
          <h1 style={calcStyles.calcTitle}>{t.calcTitle}</h1>
        </div>
        <div style={calcStyles.headerActions}>
          <button style={calcStyles.ghostBtn} onClick={() => setScores(DEMO_SCORES)}>{t.loadDemo}</button>
          <button style={calcStyles.ghostBtn} onClick={() => { setScores(INITIAL_SCORES); setSex(null); }}>{t.reset}</button>
        </div>
      </div>

      {/* MAIN 3-COL LAYOUT */}
      <div style={calcStyles.layout}>

        {/* LEFT — vault inputs */}
        <aside style={calcStyles.leftCol}>
          {/* sex toggle */}
          <SexBlock t={t} sex={sex} setSex={setSex} />

          <div style={calcStyles.sectionHead}>
            <div className="eyebrow">{t.sectionVault}</div>
            <div style={calcStyles.sumBadge}>
              <span style={calcStyles.sumLabel}>{t.sumS}</span>
              <span style={calcStyles.sumValue}>
                {sInfo.any ? sInfo.sum.toFixed(1) : "—"}<span style={calcStyles.sumMax}>/30</span>
              </span>
            </div>
          </div>

          <div style={calcStyles.siteList}>
            {VAULT_SITES.map(site => <VaultSiteRow key={site.key} site={site} />)}
          </div>
        </aside>

        {/* CENTER — skull stage */}
        <main style={calcStyles.stage}>
          {/* view tabs */}
          <div style={calcStyles.viewTabs}>
            <ViewTab on={view === "top"}    onClick={() => setView("top")}>{t.viewTop}</ViewTab>
            <ViewTab on={view === "lat_L"}  onClick={() => setView("lat_L")}>{t.viewLateral} · L</ViewTab>
            <ViewTab on={view === "lat_R"}  onClick={() => setView("lat_R")}>{t.viewLateral} · R</ViewTab>
            <ViewTab on={view === "palate"} onClick={() => setView("palate")}>{t.viewPalate}</ViewTab>

            <div style={{flex: 1}}></div>
            <button style={calcStyles.labelToggle} onClick={() => setStadiaOpen(true)}>
              <span style={{fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14, color: "var(--accent)", marginRight: 8}}>?</span>
              { lang === "ru" ? "Стадии" : "Stages" }
            </button>
            <button style={calcStyles.labelToggle} onClick={() => setShowLabels(v => !v)}>
              <span style={{
                width: 8, height: 8,
                borderRadius: "50%",
                background: showLabels ? "var(--accent)" : "var(--line-2)",
                marginRight: 8,
                display: "inline-block",
                transition: "background 180ms"
              }}></span>
              { lang === "ru" ? "Подписи" : "Labels" }
            </button>
          </div>

          {/* skull canvas */}
          <div style={calcStyles.skullCanvas}>
            <div style={calcStyles.skullInner}>
              {view === "top" && (
                <SuperiorView scores={scores} onCycle={onCycle} lang={lang}
                  showLabels={showLabels} hovered={hovered} setHovered={setHovered}/>
              )}
              {view === "lat_L" && (
                <LateralView scores={scores} onCycle={onCycle} lang={lang}
                  side="L" showLabels={showLabels} hovered={hovered} setHovered={setHovered}/>
              )}
              {view === "lat_R" && (
                <LateralView scores={scores} onCycle={onCycle} lang={lang}
                  side="R" showLabels={showLabels} hovered={hovered} setHovered={setHovered}/>
              )}
              {view === "palate" && (
                <PalateView scores={scores} onCycle={onCycle} lang={lang}
                  showLabels={showLabels} hovered={hovered} setHovered={setHovered}/>
              )}
            </div>

            {/* score legend */}
            <div style={calcStyles.legend}>
              {[0,1,2,3].map(s => (
                <div key={s} style={calcStyles.legendItem}>
                  <span style={{
                    width: 12, height: 12, borderRadius: "50%",
                    background: SCORE_COLORS[s],
                    border: s === 0 ? "1px solid var(--line-2)" : "none",
                    display: "inline-block",
                  }}></span>
                  <span style={calcStyles.legendText}>
                    {s} — {t.scoreHelp[s].split("—")[1]?.trim() || t.scoreHelp[s]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* palate quick-strip if we're in palate view */}
          {view === "palate" && (
            <div style={calcStyles.palateInputs}>
              {PALATE_SITES.map(k => (
                <PalateToggle key={k} t={t} scoreKey={k} value={scores[k]}
                  onToggle={() => onCycle(k, scores[k] ? 0 : 1)} />
              ))}
            </div>
          )}
        </main>

        {/* RIGHT — result panel */}
        <aside style={calcStyles.rightCol}>
          <ResultPanel
            t={t} lang={lang}
            age={age} ageRow={ageRow}
            sex={sex} sumS={sInfo.sum} sumP={pVal}
            anyScore={sInfo.any}
            showAccTable={showAccTable} setShowAccTable={setShowAccTable}
          />

          {/* palate section as compact card on side */}
          {view !== "palate" && (
            <div style={calcStyles.palateCard}>
              <div style={calcStyles.sectionHead}>
                <div className="eyebrow">{t.sectionPalate}</div>
                <div style={calcStyles.sumBadge}>
                  <span style={calcStyles.sumLabel}>{t.sumP}</span>
                  <span style={calcStyles.sumValue}>{pVal}<span style={calcStyles.sumMax}>/4</span></span>
                </div>
              </div>
              <div style={calcStyles.palateCardInputs}>
                {PALATE_SITES.map(k => (
                  <PalateToggle key={k} t={t} scoreKey={k} value={scores[k]}
                    onToggle={() => onCycle(k, scores[k] ? 0 : 1)} compact />
                ))}
              </div>
              <button style={calcStyles.palateOpen} onClick={() => setView("palate")}>
                { lang === "ru" ? "Открыть схему нёба" : "Open palate diagram" }
                <span style={{marginLeft: 8}}>→</span>
              </button>
            </div>
          )}
        </aside>
      </div>

      <StadiaModal open={stadiaOpen} onClose={() => setStadiaOpen(false)} lang={lang}/>
    </div>
  );
}

// --- Sex block ---------------------------------------------------------
function SexBlock({ t, sex, setSex }) {
  return (
    <div style={calcStyles.sexBlock}>
      <div className="eyebrow">{t.sex}</div>
      <div style={calcStyles.sexToggle}>
        <button
          style={{
            ...calcStyles.sexBtn,
            ...(sex === "male" ? calcStyles.sexBtnOn : {}),
          }}
          onClick={() => setSex("male")}
        >
          <span style={calcStyles.sexGlyph}>♂</span>
          {t.male}
        </button>
        <button
          style={{
            ...calcStyles.sexBtn,
            ...(sex === "female" ? calcStyles.sexBtnOn : {}),
          }}
          onClick={() => setSex("female")}
        >
          <span style={calcStyles.sexGlyph}>♀</span>
          {t.female}
        </button>
      </div>
    </div>
  );
}

// --- Stepper -----------------------------------------------------------
function Stepper({ value, onChange, onHover, full, label }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      flex: full ? 1 : "0 1 auto",
    }}
      onMouseEnter={onHover}
    >
      {label && <div style={calcStyles.stepperLabel}>{label}</div>}
      {[0,1,2,3].map(s => (
        <button
          key={s}
          style={{
            ...calcStyles.stepperBtn,
            color: value === s ? "var(--bg)" : "var(--fg-dim)",
            background: value === s ? SCORE_COLORS[s] : "transparent",
            borderColor: value === s ? SCORE_COLORS[s] : "var(--line)",
            flex: full ? 1 : "0 1 32px",
          }}
          onClick={() => onChange(s)}
        >{s}</button>
      ))}
    </div>
  );
}

// --- Palate toggle -----------------------------------------------------
function PalateToggle({ t, scoreKey, value, onToggle, compact }) {
  const tInfo = t.sites[scoreKey];
  return (
    <div style={compact ? calcStyles.palateRowCompact : calcStyles.palateRow}>
      <div style={{flex: 1}}>
        <div style={calcStyles.siteName}>{tInfo[0]}</div>
        <div style={calcStyles.siteSub}>{tInfo[1]}</div>
      </div>
      <button
        style={{
          ...calcStyles.palateSwitch,
          background: value ? "var(--accent)" : "var(--bg-3)",
          borderColor: value ? "var(--accent)" : "var(--line-2)",
        }}
        onClick={onToggle}
      >
        <span style={{
          ...calcStyles.palateKnob,
          left: value ? 30 : 2,
          background: value ? "var(--bg)" : "var(--fg-mute)",
        }}></span>
        <span style={{...calcStyles.palateNumber, left: 8, opacity: value ? 0 : 1, color: "var(--fg-mute)"}}>0</span>
        <span style={{...calcStyles.palateNumber, right: 8, opacity: value ? 1 : 0, color: "var(--bg)"}}>1</span>
      </button>
    </div>
  );
}

function ViewTab({ on, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...calcStyles.viewTab,
        color: on ? "var(--fg)" : "var(--fg-mute)",
        borderColor: on ? "var(--accent)" : "transparent",
      }}
    >
      {children}
    </button>
  );
}

// --- ResultPanel -------------------------------------------------------
function ResultPanel({ t, lang, age, ageRow, sex, sumS, sumP, anyScore, showAccTable, setShowAccTable }) {
  const empty = age == null;
  const reason = sex == null ? t.needSex : t.enterData;

  // age bar — 15 to 90
  const min = 15, max = 90;
  const pct = empty ? 0 : Math.max(0, Math.min(100, (age - min) / (max - min) * 100));
  const lowPct = empty ? 0 : Math.max(0, ((age - ageRow.mae) - min) / (max - min) * 100);
  const highPct = empty ? 0 : Math.min(100, ((age + ageRow.mae) - min) / (max - min) * 100);

  // warning
  let warn = null, warnKind = "ok";
  if (!empty) {
    if (age <= 29) { warn = t.warnYoung; warnKind = "danger"; }
    else if (age >= 60) { warn = t.warnOld; warnKind = "danger"; }
    else { warn = t.warnBest; warnKind = "ok"; }
  }

  return (
    <div style={calcStyles.resultPanel}>
      <div className="eyebrow">{t.resultTitle}</div>

      <div style={calcStyles.ageBigWrap}>
        {empty ? (
          <div style={calcStyles.ageEmpty}>
            <div style={calcStyles.ageEmptyDash}>—</div>
            <div style={calcStyles.ageEmptyMsg}>{reason}</div>
          </div>
        ) : (
          <>
            <div style={calcStyles.ageBig}>
              {age.toFixed(1)}
              <span style={calcStyles.ageBigUnit}>{t.years}</span>
            </div>
            <div style={calcStyles.ageRange}>
              <span style={calcStyles.ageRangePm}>±</span>
              <span style={{fontFamily: "var(--mono)"}}>{ageRow.mae.toFixed(1)}</span>
              <span style={{color: "var(--fg-mute)", marginLeft: 6}}>{t.rangeText}</span>
            </div>
          </>
        )}
      </div>

      {/* AGE SCALE */}
      <div style={calcStyles.scaleWrap}>
        <div style={calcStyles.scaleTrack}>
          {/* tick marks */}
          {[15, 30, 45, 60, 75, 90].map(v => {
            const p = (v - min) / (max - min) * 100;
            return <div key={v} style={{...calcStyles.scaleTick, left: `${p}%`}}></div>;
          })}
          {/* error band */}
          {!empty && (
            <div style={{
              ...calcStyles.scaleBand,
              left: `${lowPct}%`,
              width: `${highPct - lowPct}%`,
            }}></div>
          )}
          {/* marker */}
          {!empty && (
            <div style={{...calcStyles.scaleMarker, left: `${pct}%`}}>
              <div style={calcStyles.scaleMarkerLine}></div>
              <div style={calcStyles.scaleMarkerDot}></div>
            </div>
          )}
        </div>
        <div style={calcStyles.scaleLabels}>
          {[15, 30, 45, 60, 75, 90].map(v => (
            <span key={v} style={calcStyles.scaleLabel}>{v}</span>
          ))}
        </div>
      </div>

      {/* warning */}
      {warn && (
        <div style={{
          ...calcStyles.warnBox,
          borderColor: warnKind === "danger" ? "var(--danger)" : "var(--ok)",
          background: warnKind === "danger" ? "oklch(0.92 0.04 28)" : "oklch(0.92 0.04 140)",
        }}>
          <div style={{
            ...calcStyles.warnDot,
            background: warnKind === "danger" ? "var(--danger)" : "var(--ok)",
          }}></div>
          <div style={calcStyles.warnText}>{warn}</div>
        </div>
      )}

      {/* mini stats */}
      <div style={calcStyles.miniStatRow}>
        <MiniStat label="S" value={anyScore ? sumS.toFixed(1) : "—"} max="/30" />
        <MiniStat label="P" value={sumP} max="/4" />
        <MiniStat label="G" value={sex == null ? "—" : (sex === "male" ? "1" : "0")} />
      </div>

      {/* accuracy table */}
      <div style={calcStyles.accBlock}>
        <button
          onClick={() => setShowAccTable(v => !v)}
          style={calcStyles.accToggle}
        >
          <span className="eyebrow">{t.accuracyTitle}</span>
          <span style={{color: "var(--fg-mute)"}}>{showAccTable ? "▾" : "▸"}</span>
        </button>
        {showAccTable && (
          <div style={calcStyles.accTable}>
            <div style={calcStyles.accHeader}>
              <span>{t.ageGroup}</span>
              <span style={{textAlign: "right"}}>{t.mae}</span>
              <span style={{textAlign: "right"}}>{t.bias}</span>
            </div>
            {ACCURACY.map((row, i) => {
              const isCurrent = ageRow && ageRow.group === row.group;
              return (
                <div key={i} style={{
                  ...calcStyles.accRow,
                  background: isCurrent ? "var(--bg-3)" : "transparent",
                  color: isCurrent ? "var(--accent)" : "var(--fg-dim)",
                }}>
                  <span style={{fontFamily: "var(--mono)"}}>{row.group}</span>
                  <span style={{fontFamily: "var(--mono)", textAlign: "right"}}>{row.mae.toFixed(1)}</span>
                  <span style={{fontFamily: "var(--mono)", textAlign: "right"}}>
                    {row.bias > 0 ? "+" : ""}{row.bias.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value, max }) {
  return (
    <div style={calcStyles.miniStat}>
      <div style={calcStyles.miniStatLabel}>
        <span style={{fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--accent)"}}>{label}</span>
      </div>
      <div style={calcStyles.miniStatValue}>
        {value}{max && <span style={calcStyles.miniStatMax}>{max}</span>}
      </div>
    </div>
  );
}

// =====================================================================
const calcStyles = {
  root: {
    paddingTop: 80,
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: "20px 40px 24px",
    borderBottom: "1px solid var(--line)",
    gap: 24,
    flexWrap: "wrap",
  },
  calcTitle: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontWeight: 400,
    fontSize: "clamp(28px, 4vw, 44px)",
    letterSpacing: "-0.02em",
    margin: "4px 0 0",
    color: "var(--fg)",
    lineHeight: 1,
    textWrap: "balance",
  },
  headerActions: {
    display: "flex",
    gap: 10,
  },
  ghostBtn: {
    padding: "10px 18px",
    border: "1px solid var(--line-2)",
    color: "var(--fg-dim)",
    fontSize: 12,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "10px 18px",
    background: "var(--accent)",
    color: "var(--bg)",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(300px, 1fr) minmax(440px, 2.2fr) minmax(340px, 1.1fr)",
    gap: 0,
    minHeight: "calc(100vh - 180px)",
  },

  leftCol: {
    borderRight: "1px solid var(--line)",
    padding: "28px 28px 60px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    overflowY: "auto",
    maxHeight: "calc(100vh - 180px)",
  },
  rightCol: {
    borderLeft: "1px solid var(--line)",
    padding: "28px 28px 60px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    overflowY: "auto",
    maxHeight: "calc(100vh - 180px)",
  },
  stage: {
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  // sex block
  sexBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    paddingBottom: 24,
    borderBottom: "1px solid var(--line)",
  },
  sexToggle: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 6,
  },
  sexBtn: {
    padding: "14px 16px",
    border: "1px solid var(--line)",
    color: "var(--fg-dim)",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 180ms",
    fontFamily: "var(--sans)",
  },
  sexBtnOn: {
    background: "var(--bg-3)",
    color: "var(--fg)",
    borderColor: "var(--accent)",
  },
  sexGlyph: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 20,
    color: "var(--accent)",
  },

  // section head
  sectionHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  sumBadge: {
    display: "flex",
    alignItems: "baseline",
    gap: 8,
  },
  sumLabel: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--fg-mute)",
  },
  sumValue: {
    fontFamily: "var(--mono)",
    fontSize: 18,
    color: "var(--accent)",
  },
  sumMax: {
    color: "var(--fg-mute)",
    fontSize: 12,
  },

  // site list
  siteList: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  siteRow: {
    padding: "14px 12px",
    border: "1px solid var(--line)",
    transition: "all 180ms",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  siteHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  siteName: {
    fontFamily: "var(--sans)",
    fontWeight: 500,
    fontSize: 13,
    color: "var(--fg)",
    letterSpacing: "0.02em",
  },
  siteSub: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.04em",
    color: "var(--fg-mute)",
    marginTop: 2,
    textTransform: "uppercase",
  },
  pairedTag: {
    fontFamily: "var(--mono)",
    fontSize: 9,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--accent)",
    padding: "2px 6px",
    border: "1px solid var(--accent-dim)",
    whiteSpace: "nowrap",
  },
  pairRow: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  meanInline: {
    display: "inline-flex",
    alignItems: "baseline",
    gap: 6,
    padding: "3px 8px",
    border: "1px solid var(--line)",
    background: "var(--bg)",
  },

  // stepper
  stepperLabel: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    color: "var(--fg-mute)",
    width: 12,
    letterSpacing: "0.06em",
  },
  stepperBtn: {
    height: 30,
    minWidth: 30,
    border: "1px solid",
    borderRadius: 0,
    fontFamily: "var(--mono)",
    fontSize: 13,
    transition: "all 180ms",
    cursor: "pointer",
  },
  meanBox: {
    paddingLeft: 6,
    borderLeft: "1px solid var(--line)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 40,
  },
  meanLabel: {
    fontFamily: "var(--mono)",
    fontSize: 9,
    color: "var(--fg-mute)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  meanValue: {
    fontFamily: "var(--mono)",
    fontSize: 14,
    color: "var(--accent)",
  },

  // skull canvas
  viewTabs: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    borderBottom: "1px solid var(--line)",
    paddingBottom: 12,
  },
  viewTab: {
    padding: "8px 14px",
    borderBottom: "2px solid transparent",
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    transition: "all 180ms",
  },
  labelToggle: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--fg-mute)",
    padding: "6px 10px",
    display: "inline-flex",
    alignItems: "center",
  },
  skullCanvas: {
    position: "relative",
    flex: 1,
    background: "transparent",
    padding: 0,
    minHeight: 540,
    display: "flex",
    flexDirection: "column",
  },
  skullInner: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 480,
  },
  legend: {
    display: "flex",
    gap: 22,
    flexWrap: "wrap",
    paddingTop: 12,
    borderTop: "1px solid var(--line)",
    marginTop: 12,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  legendText: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    color: "var(--fg-mute)",
    letterSpacing: "0.04em",
  },

  // palate inputs (when palate view active)
  palateInputs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    padding: 16,
    border: "1px solid var(--line)",
    background: "var(--bg-2)",
  },
  palateRow: {
    padding: "12px 14px",
    border: "1px solid var(--line)",
    background: "var(--bg)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  palateRowCompact: {
    padding: "10px 0",
    borderBottom: "1px solid var(--line)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  palateSwitch: {
    position: "relative",
    width: 56,
    height: 28,
    border: "1px solid",
    borderRadius: 999,
    transition: "all 200ms",
    flexShrink: 0,
  },
  palateKnob: {
    position: "absolute",
    top: 2,
    width: 22,
    height: 22,
    borderRadius: "50%",
    transition: "all 200ms",
  },
  palateNumber: {
    position: "absolute",
    top: 6,
    fontFamily: "var(--mono)",
    fontSize: 11,
    transition: "all 200ms",
    pointerEvents: "none",
  },

  // palate card (in right col when not in palate view)
  palateCard: {
    border: "1px solid var(--line)",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    background: "var(--bg-2)",
  },
  palateCardInputs: {
    display: "flex",
    flexDirection: "column",
  },
  palateOpen: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--accent)",
    padding: "8px 0",
    textAlign: "left",
    borderTop: "1px solid var(--line)",
    paddingTop: 14,
  },

  // RESULT PANEL
  resultPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    padding: 24,
    border: "1px solid var(--line-2)",
    background: "var(--bg-2)",
  },
  ageBigWrap: {
    paddingTop: 6,
    paddingBottom: 16,
    borderBottom: "1px solid var(--line)",
  },
  ageBig: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 96,
    lineHeight: 1,
    color: "var(--fg)",
    letterSpacing: "-0.04em",
  },
  ageBigUnit: {
    fontFamily: "var(--mono)",
    fontStyle: "normal",
    fontSize: 14,
    color: "var(--fg-mute)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginLeft: 10,
  },
  ageRange: {
    fontFamily: "var(--sans)",
    fontSize: 14,
    color: "var(--fg-dim)",
    marginTop: 4,
  },
  ageRangePm: {
    color: "var(--accent)",
    marginRight: 4,
    fontFamily: "var(--mono)",
  },
  ageEmpty: {
    padding: "12px 0",
  },
  ageEmptyDash: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 96,
    lineHeight: 1,
    color: "var(--line-2)",
  },
  ageEmptyMsg: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 17,
    color: "var(--fg-mute)",
    marginTop: 6,
  },

  // scale
  scaleWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  scaleTrack: {
    position: "relative",
    height: 28,
    background: "var(--bg)",
    border: "1px solid var(--line)",
  },
  scaleTick: {
    position: "absolute",
    top: 0,
    width: 1,
    height: "100%",
    background: "var(--line-2)",
    opacity: 0.6,
  },
  scaleBand: {
    position: "absolute",
    top: 6,
    bottom: 6,
    background: "var(--accent)",
    opacity: 0.2,
  },
  scaleMarker: {
    position: "absolute",
    top: -4,
    bottom: -4,
    width: 0,
  },
  scaleMarkerLine: {
    position: "absolute",
    left: -1,
    top: 0,
    bottom: 0,
    width: 2,
    background: "var(--accent)",
  },
  scaleMarkerDot: {
    position: "absolute",
    left: -5,
    top: -2,
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "var(--accent)",
    boxShadow: "0 0 14px var(--accent)",
  },
  scaleLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "var(--mono)",
    fontSize: 10,
    color: "var(--fg-mute)",
  },
  scaleLabel: {
    letterSpacing: "0.04em",
  },

  // warn
  warnBox: {
    padding: "14px 16px",
    border: "1px solid",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  warnDot: {
    width: 8, height: 8,
    borderRadius: "50%",
    marginTop: 6,
    flexShrink: 0,
  },
  warnText: {
    fontFamily: "var(--sans)",
    fontSize: 13,
    lineHeight: 1.55,
    color: "var(--fg-dim)",
  },

  // mini stats
  miniStatRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
  },
  miniStat: {
    border: "1px solid var(--line)",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  miniStatLabel: {
    fontSize: 14,
  },
  miniStatValue: {
    fontFamily: "var(--mono)",
    fontSize: 18,
    color: "var(--fg)",
  },
  miniStatMax: {
    color: "var(--fg-mute)",
    fontSize: 11,
    marginLeft: 2,
  },

  // accuracy
  accBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  accToggle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderTop: "1px solid var(--line)",
  },
  accTable: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  accHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 60px 60px",
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--fg-mute)",
    padding: "8px 10px",
    borderBottom: "1px solid var(--line)",
  },
  accRow: {
    display: "grid",
    gridTemplateColumns: "1fr 60px 60px",
    padding: "8px 10px",
    fontSize: 13,
    transition: "all 180ms",
  },
};

Object.assign(window, { Calculator, INITIAL_SCORES, DEMO_SCORES, computeAge });
