// Main app shell
const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent":      "#a8392f",
  "showGrid":    false,
  "compact":     false
}/*EDITMODE-END*/;

function App() {
  // routing
  const [screen, setScreen] = useStateApp(() => {
    const h = (window.location.hash || "").replace("#", "");
    if (["calc", "compare", "method"].includes(h)) return h === "method" ? "landing" : h;
    return "landing";
  });

  const [lang, setLang] = useStateApp(() => localStorage.getItem("cranium.lang") || "ru");

  const [sex, setSex] = useStateApp(null);
  const [scores, setScores] = useStateApp(INITIAL_SCORES);

  // tweaks
  const [t, setTweak] = useTweaks ? useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}];

  // apply accent tweak
  useEffectApp(() => {
    if (t.accent) {
      // accent color is set as a hex; we treat as overlay
      document.documentElement.style.setProperty("--accent", t.accent);
    }
  }, [t.accent]);

  // language persistence
  useEffectApp(() => {
    localStorage.setItem("cranium.lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // hash routing
  useEffectApp(() => {
    window.location.hash = screen;
  }, [screen]);

  const goto = (s) => {
    if (s === "method") {
      setScreen("landing");
      setTimeout(() => {
        const el = document.getElementById("method-section");
        if (el) el.scrollIntoView({behavior: "smooth", block: "start"});
      }, 100);
    } else {
      setScreen(s);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <TopBar lang={lang} setLang={setLang} screen={screen} goto={goto}/>

      <div key={screen}>
        {screen === "landing" && <Landing lang={lang} goto={goto}/>}
        {screen === "calc" && (
          <Calculator
            lang={lang}
            scores={scores} setScores={setScores}
            sex={sex} setSex={setSex}
            goto={goto}
          />
        )}
        {screen === "compare" && <Comparison lang={lang} goto={goto}/>}
      </div>

      {/* Tweaks panel */}
      {TweaksPanel && (
        <TweaksPanel title="Tweaks">
          <TweakSection title={lang === "ru" ? "Акцент" : "Accent"}>
            <TweakColor
              label={lang === "ru" ? "Цвет акцента" : "Accent color"}
              value={t.accent}
              onChange={(v) => setTweak("accent", v)}
              options={["#a8392f", "#2f5a3e", "#3b4d7a", "#7a5a2e", "#5a4a8a"]}
            />
          </TweakSection>
        </TweaksPanel>
      )}
    </>
  );
}

function TopBar({ lang, setLang, screen, goto }) {
  const t = STRINGS[lang];
  return (
    <header className="topbar">
      <div className="brand" onClick={() => goto("landing")} style={{cursor: "pointer"}}>
        <span className="brand-dot"></span>
        <span className="brand-mark">Cranium</span>
        <span style={{color: "var(--fg-mute)", marginLeft: 8}}>/ M.S.</span>
      </div>

      <nav className="navlinks">
        <button className={screen === "landing" ? "on" : ""} onClick={() => goto("landing")}>{t.navAbout}</button>
        <button className={screen === "calc" ? "on" : ""} onClick={() => goto("calc")}>{t.navCalc}</button>
        <button className={screen === "compare" ? "on" : ""} onClick={() => goto("compare")}>{t.navCompare}</button>
      </nav>

      <div className="topbar-right">
        <div className="lang-toggle">
          <button className={lang === "ru" ? "on" : ""} onClick={() => setLang("ru")}>RU</button>
          <span className="sep">/</span>
          <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
        </div>
      </div>
    </header>
  );
}

// inject fade keyframes
const styleEl = document.createElement("style");
styleEl.textContent = `
@keyframes fade {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
.ctaPrimary:hover { transform: translateY(-1px); }
button:focus { outline: none; }
button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.hotspot-group circle:hover { filter: brightness(1.1); }

/* scrollbar styling */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--line-2); }

/* responsive — narrow screens */
@media (max-width: 720px) {
  .topbar { padding: 14px 20px; }
  .topbar .navlinks { display: none; }
}
`;
document.head.appendChild(styleEl);

// mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
