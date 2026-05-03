/* eslint-disable */
/* Fern nail art — artboard components for design canvas              */

const Mobile = ({ children, lang = 'ua', showHeader = true, showCTA = true, calcTotal, langOpen = false }) => {
  const c = COPY[lang];
  return (
    <div className="fa-mobile">
      <LeafBackdrop density="rich">
        {showHeader && (
          <header className="fa-header">
            <div className="fa-header__brand">
              Fern
              <small>NAIL ART</small>
            </div>
            <div className="fa-header__lang">
              <LangPill code="ua" active={lang==='ua'} />
              <LangPill code="ru" active={lang==='ru'} />
              <LangPill code="en" active={lang==='en'} />
            </div>
          </header>
        )}
        {children}
        {showCTA && (
          <div className="fa-cta">
            {calcTotal != null ? (
              <div className="fa-cta__price">
                {c.calc.total}
                <b>{calcTotal} {c.currency}</b>
              </div>
            ) : null}
            <button className="fa-btn fa-btn--primary fa-btn--block">{c.book} →</button>
          </div>
        )}
        {langOpen && (
          <div className="fa-langmodal">
            <div className="fa-langmodal__sheet">
              {[
                { code:'ua', native:'Українська', en:'Ukrainian' },
                { code:'ru', native:'Русский',    en:'Russian'   },
                { code:'en', native:'English',    en:'English'   },
              ].map(r => (
                <div className="fa-langmodal__row" key={r.code}>
                  <div>
                    <b>{r.native}</b>
                    <small>{r.en}</small>
                  </div>
                  <div className={`fa-langmodal__check ${lang===r.code?'is-on':''}`}>
                    {lang===r.code ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </LeafBackdrop>
    </div>
  );
};

// ── A. Mobile landing — hero + first section visible ────────────────
const MobileLanding = ({ lang = 'ua' }) => {
  const c = COPY[lang];
  return (
    <Mobile lang={lang}>
      <section className="fa-hero">
        <div className="fa-hero__eyebrow">{c.hero.eyebrow}</div>
        <h1 className="fa-hero__brand">Fern<br/>nail art</h1>
        <p className="fa-hero__tag">{c.hero.tag}</p>
        <div className="fa-hero__ctas">
          <button className="fa-btn fa-btn--primary">{c.hero.cta}</button>
          <button className="fa-btn fa-btn--ghost">{c.hero.cta2}</button>
        </div>
      </section>
      <section className="fa-section" style={{ paddingTop: 0 }}>
        <h2 className="fa-section__h">{c.sections.manicure}</h2>
        <div className="fa-card">
          {PRICES.manicure.slice(0, 3).map((row, i) => (
            <div className="fa-row" key={i}>
              <div className="fa-row__name">{row[lang]}</div>
              <div className="fa-row__price">
                {row.from && <em>{c.from}</em>}{row.price} {c.currency}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Mobile>
  );
};

// ── B. Mobile services scroll — all 4 categories long-page ─────────
const MobileServices = ({ lang = 'ua' }) => {
  const c = COPY[lang];
  const cats = [
    { key:'manicure', rows: PRICES.manicure },
    { key:'pedicure', rows: PRICES.pedicure },
    { key:'design',   rows: PRICES.design   },
    { key:'extras',   rows: PRICES.extras   },
  ];
  return (
    <Mobile lang={lang}>
      <div style={{ paddingTop: 76 }}>
        {cats.map((cat, i) => (
          <section className="fa-section" key={cat.key} style={{ paddingBlock: 28 }}>
            <h2 className="fa-section__h fa-section__h--small">{c.sections[cat.key]}</h2>
            <div className="fa-card">
              {cat.rows.map((row, j) => (
                <div className="fa-row" key={j}>
                  <div className="fa-row__name">
                    {row[lang]}
                    {row.info && <span className="fa-row__info" title={c.disclaimer}>i</span>}
                  </div>
                  <div className="fa-row__price">
                    {fmtPrice(row, lang)}
                  </div>
                </div>
              ))}
            </div>
            {cat.key === 'pedicure' && (
              <div className="fa-ribbon">
                <u>{c.disclaimer}</u>
              </div>
            )}
          </section>
        ))}
        <section className="fa-section">
          <h2 className="fa-section__h fa-section__h--small">{c.contact.h}</h2>
          <p style={{
            fontFamily:'var(--font-serif)', fontStyle:'italic',
            color:'var(--text-muted)', marginTop:0
          }}>{c.contact.sub}</p>
          <div className="fa-contact">
            {[
              { ic:'IG', name:'Instagram' },
              { ic:'TG', name:'Telegram'  },
              { ic:'WA', name:'WhatsApp'  },
              { ic:'VB', name:'Viber'     },
            ].map(ch => (
              <div className="fa-chip" key={ch.ic}>
                <span className="fa-chip__ic">{ch.ic}</span>
                {ch.name}
              </div>
            ))}
          </div>
          <div style={{
            fontFamily:'var(--font-serif)', fontStyle:'italic',
            color:'var(--text-muted)', marginTop: 16, fontSize:13, textAlign:'center'
          }}>
            {c.contact.addr} · {c.contact.hours}
          </div>
        </section>
      </div>
    </Mobile>
  );
};

// ── C. Calculator step 2 of 4 ───────────────────────────────────────
const MobileCalcStep = ({ lang='ua', step=2 }) => {
  const c = COPY[lang];
  const q = c.calc[`q${step}`];
  const selected = step === 2 ? 1 : 0;
  return (
    <Mobile lang={lang} showCTA={false}>
      <div className="fa-calc">
        <div>
          <div className="fa-calc__progress">
            {[1,2,3,4].map(i => <div key={i} className={`fa-calc__pip ${i<=step?'is-on':''}`} />)}
          </div>
          <div className="fa-calc__step">{c.calc.step} {step} {c.calc.of} 4</div>
          <h2 className="fa-calc__h">{q.t}</h2>
          <div className="fa-calc__opts">
            {q.opts.map((opt, i) => (
              <div className={`fa-opt ${i===selected?'is-on':''}`} key={i}>
                <span className="fa-opt__radio" />
                {opt}
              </div>
            ))}
          </div>
        </div>
        <div className="fa-calc__nav">
          <button className="fa-btn fa-btn--ghost">← {c.calc.back}</button>
          <button className="fa-btn fa-btn--primary">{c.calc.next} →</button>
        </div>
      </div>
    </Mobile>
  );
};

// ── D. Calculator summary ───────────────────────────────────────────
const MobileCalcSummary = ({ lang='ua' }) => {
  const c = COPY[lang];
  const rows = [
    { l: c.calc.q1.t, v: c.calc.q1.opts[0] },
    { l: c.calc.q2.t, v: c.calc.q2.opts[1] },
    { l: c.calc.q3.t, v: c.calc.q3.opts[1] },
    { l: c.calc.q4.t, v: c.calc.q4.opts[2] },
  ];
  return (
    <Mobile lang={lang} showCTA={false}>
      <div className="fa-summary">
        <div className="fa-calc__step">{c.calc.summary}</div>
        <h2 className="fa-summary__h">{c.calc.title}</h2>
        <p className="fa-summary__sub">{c.calc.subtitle}</p>
        <div className="fa-summary__rows">
          {rows.map((r, i) => (
            <div className="fa-summary__row" key={i}>
              <em>{r.l}</em>
              <span>{r.v}</span>
            </div>
          ))}
        </div>
        <div className="fa-summary__total">
          <div>
            <small>{c.calc.total}</small>
            <b>670 {c.currency}</b>
          </div>
          <button className="fa-btn fa-btn--primary">{c.book}</button>
        </div>
        <button className="fa-btn fa-btn--ghost" style={{ marginTop: 12 }}>↺ {c.calc.restart}</button>
      </div>
    </Mobile>
  );
};

// ── E. Language switcher open ───────────────────────────────────────
const MobileLangOpen = ({ lang='ua' }) => (
  <Mobile lang={lang} langOpen>
    <section className="fa-hero">
      <div className="fa-hero__eyebrow">{COPY[lang].hero.eyebrow}</div>
      <h1 className="fa-hero__brand">Fern<br/>nail art</h1>
      <p className="fa-hero__tag">{COPY[lang].hero.tag}</p>
    </section>
  </Mobile>
);

// ── F. Desktop full layout ──────────────────────────────────────────
const Desktop = ({ lang='ua' }) => {
  const c = COPY[lang];
  return (
    <div className="fa-desktop">
      <LeafBackdrop density="rich">
        <header className="fa-d-header">
          <div className="fa-d-header__brand">Fern <span style={{ fontFamily:'var(--font-sans)', fontSize:11, letterSpacing:'var(--tr-eyebrow)', color:'var(--text-muted)', textTransform:'uppercase', verticalAlign: '6px', marginLeft: 8 }}>NAIL ART</span></div>
          <nav className="fa-d-nav">
            <a className="is-on">{c.nav.services}</a>
            <a>{c.nav.calculator}</a>
            <a>{c.nav.contact}</a>
          </nav>
          <div className="fa-header__lang">
            <LangPill code="ua" active={lang==='ua'} />
            <LangPill code="ru" active={lang==='ru'} />
            <LangPill code="en" active={lang==='en'} />
          </div>
        </header>

        <section className="fa-d-hero">
          <div>
            <div className="fa-d-hero__eye">{c.hero.eyebrow}</div>
            <h1 className="fa-d-hero__brand" style={{ margin:'12px 0 0' }}>Fern nail art</h1>
            <p className="fa-d-hero__tag">{c.hero.tag}</p>
            <div className="fa-d-hero__ctas">
              <button className="fa-btn fa-btn--primary">{c.hero.cta}</button>
              <button className="fa-btn fa-btn--ghost">{c.hero.cta2}</button>
            </div>
          </div>
          <div style={{ position:'relative', height: 360 }}>
            <FernFrond style={{ position:'absolute', top:-20, right:-30, width:520, height:320, transform:'rotate(-14deg)' }} opacity={0.6} />
            <PalmLeaf  style={{ position:'absolute', bottom:-60, left:0, width:340, height:300 }} opacity={0.5} flip />
          </div>
        </section>

        <div className="fa-d-grid">
          <div className="fa-d-services">
            {[
              ['manicure', PRICES.manicure],
              ['pedicure', PRICES.pedicure],
              ['design',   PRICES.design  ],
              ['extras',   PRICES.extras  ],
            ].map(([key, rows]) => (
              <div key={key}>
                <h2 className="fa-d-section__h">{c.sections[key]}</h2>
                <div className="fa-card">
                  {rows.map((row, j) => (
                    <div className="fa-row" key={j}>
                      <div className="fa-row__name">
                        {row[lang]}
                        {row.info && <span className="fa-row__info">i</span>}
                      </div>
                      <div className="fa-row__price">{fmtPrice(row, lang)}</div>
                    </div>
                  ))}
                </div>
                {key === 'pedicure' && (
                  <div className="fa-ribbon" style={{ fontSize: 13 }}>
                    <u>{c.disclaimer}</u>
                  </div>
                )}
              </div>
            ))}
          </div>

          <aside className="fa-d-aside">
            <div className="fa-d-aside__eye">{c.calc.title}</div>
            <h3 className="fa-d-aside__h">{c.calc.subtitle.replace('—','').trim()}</h3>
            <div className="fa-calc__progress" style={{ margin:'8px 0 16px' }}>
              {[1,2,3,4].map(i => <div key={i} className={`fa-calc__pip ${i<=2?'is-on':''}`} />)}
            </div>
            <div className="fa-calc__step">{c.calc.step} 2 {c.calc.of} 4</div>
            <h4 style={{ fontFamily:'var(--font-script)', fontSize:32, color:'var(--text)', margin:'4px 0 16px', lineHeight:1 }}>
              {c.calc.q2.t}
            </h4>
            <div className="fa-calc__opts">
              {c.calc.q2.opts.map((opt, i) => (
                <div className={`fa-opt ${i===1?'is-on':''}`} key={i}>
                  <span className="fa-opt__radio" />
                  {opt}
                </div>
              ))}
            </div>
            <div className="fa-calc__nav" style={{ marginTop:18 }}>
              <button className="fa-btn fa-btn--ghost">← {c.calc.back}</button>
              <button className="fa-btn fa-btn--primary">{c.calc.next} →</button>
            </div>
          </aside>
        </div>
      </LeafBackdrop>
    </div>
  );
};

// ── Tablet layout ───────────────────────────────────────────────────
const Tablet = ({ lang='ua' }) => {
  const c = COPY[lang];
  return (
    <div className="fa-tablet">
      <LeafBackdrop density="rich">
        <header className="fa-d-header" style={{ height: 72, padding:'0 36px' }}>
          <div className="fa-d-header__brand" style={{ fontSize: 32 }}>Fern</div>
          <nav className="fa-d-nav" style={{ gap: 24 }}>
            <a className="is-on">{c.nav.services}</a>
            <a>{c.nav.calculator}</a>
            <a>{c.nav.contact}</a>
          </nav>
          <div className="fa-header__lang">
            <LangPill code="ua" active={lang==='ua'} />
            <LangPill code="ru" active={lang==='ru'} />
            <LangPill code="en" active={lang==='en'} />
          </div>
        </header>
        <section style={{ padding:'120px 56px 24px', textAlign:'center' }}>
          <div className="fa-d-hero__eye">{c.hero.eyebrow}</div>
          <h1 className="fa-hero__brand" style={{ fontSize: 88, margin:'10px 0 6px' }}>Fern nail art</h1>
          <p className="fa-hero__tag" style={{ fontSize: 18, maxWidth: 460 }}>{c.hero.tag}</p>
        </section>
        <div className="fa-t-grid">
          {[
            ['manicure', PRICES.manicure],
            ['pedicure', PRICES.pedicure.slice(0,4)],
          ].map(([key, rows]) => (
            <div key={key}>
              <h2 className="fa-d-section__h" style={{ fontSize: 48 }}>{c.sections[key]}</h2>
              <div className="fa-card">
                {rows.map((row, j) => (
                  <div className="fa-row" key={j}>
                    <div className="fa-row__name">{row[lang]}</div>
                    <div className="fa-row__price">{fmtPrice(row, lang)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </LeafBackdrop>
    </div>
  );
};

// ── Style guide ─────────────────────────────────────────────────────
const StyleGuide = () => {
  const colors = [
    { name:'Background',       v:'--bg',           hex:'oklch(0.16 0.012 155)', notes:'page' },
    { name:'BG · deep',        v:'--bg-deep',      hex:'oklch(0.12 0.012 155)', notes:'under leaves' },
    { name:'Surface',          v:'--surface',      hex:'oklch(0.22 0.018 155 / 0.55)', notes:'price strip' },
    { name:'Surface · solid',  v:'--surface-solid',hex:'oklch(0.22 0.018 155)', notes:'modal' },
    { name:'Surface · elev.',  v:'--surface-elevated', hex:'oklch(0.27 0.020 155 / 0.75)', notes:'hover' },
    { name:'Text',             v:'--text',         hex:'oklch(0.96 0.005 145)', notes:'AAA · 16:1' },
    { name:'Text · muted',     v:'--text-muted',   hex:'oklch(0.74 0.012 145)', notes:'AAA · 7.4:1' },
    { name:'Text · faint',     v:'--text-faint',   hex:'oklch(0.55 0.015 145)', notes:'AA Large only' },
    { name:'Accent (sage)',    v:'--accent',       hex:'oklch(0.78 0.085 150)', notes:'AAA · 9.2:1' },
    { name:'Accent · bright',  v:'--accent-bright',hex:'oklch(0.86 0.110 150)', notes:'hover' },
    { name:'Accent · muted',   v:'--accent-muted', hex:'oklch(0.45 0.045 150)', notes:'lines' },
    { name:'Border',           v:'--border',       hex:'oklch(0.32 0.015 150 / 0.6)', notes:'card edge' },
    { name:'Success',          v:'--success',      hex:'oklch(0.78 0.110 150)', notes:'state' },
    { name:'Error',            v:'--error',        hex:'oklch(0.70 0.150 25)',  notes:'state' },
    { name:'Warn',             v:'--warn',         hex:'oklch(0.82 0.120 80)',  notes:'state' },
  ];
  const types = [
    { name:'Hero (script)',  font:'var(--font-script)',  size:88, lh:0.95, code:'--fs-1000', sample:'Fern nail art' },
    { name:'Section heading',font:'var(--font-script)',  size:56, lh:1,    code:'--fs-800',  sample:'Манікюр' },
    { name:'H2 sans',        font:'var(--font-sans)',    size:30, lh:1.15, code:'--fs-700 / 600',sample:'Calculate your visit' },
    { name:'H3 sans',        font:'var(--font-sans)',    size:24, lh:1.2,  code:'--fs-600 / 600',sample:'Pedicure' },
    { name:'Body',           font:'var(--font-sans)',    size:16, lh:1.55, code:'--fs-300 / 400',sample:'Manicure without coating — 250 UAH' },
    { name:'Small',          font:'var(--font-sans)',    size:14, lh:1.5,  code:'--fs-200 / 400',sample:'Length depends on …' },
    { name:'Caption',        font:'var(--font-sans)',    size:12, lh:1.45, code:'--fs-100 / 500 · tracking 0.24em',sample:'PRICE LIST · 2026' },
    { name:'Italic serif',   font:'var(--font-serif)',   size:18, lh:1.4,  code:'Cormorant Italic',sample:'Studio · Kyiv · Podil' },
  ];
  const sp = [4,8,12,16,20,24,32,40,48,64,80,96];
  return (
    <div className="sg">
      <div style={{ display:'flex', alignItems:'flex-end', gap: 32 }}>
        <div>
          <div style={{ fontSize:11, letterSpacing:'var(--tr-eyebrow)', color:'var(--accent)', textTransform:'uppercase', fontWeight:500 }}>Design system</div>
          <h1 className="sg__h">Fern nail art</h1>
        </div>
        <div className="fa-fav" style={{ marginBottom: 12 }}>
          {/* Favicon: stylised fern leaflet on dark tile */}
          <svg width="64" height="64" viewBox="0 0 64 64">
            <g>
              <path d="M32 6 C 40 22, 46 38, 48 58" stroke="oklch(0.78 0.085 150)" strokeWidth="1.6" fill="none" />
              {Array.from({ length: 9 }).map((_,i) => {
                const t = i / 8;
                const x = 32 + (48-32)*t * 0.9;
                const y = 6 + (58-6)*t;
                const len = 8 + Math.sin(t*Math.PI)*9;
                return (
                  <g key={i} transform={`translate(${x} ${y})`}>
                    <ellipse rx={len} ry={len/3.5} transform="rotate(-30)" fill="oklch(0.65 0.075 150)" />
                    <ellipse rx={len} ry={len/3.5} transform="rotate(30)"  fill="oklch(0.55 0.060 150)" />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
      <p className="sg__lead">A botanical, near-black system — sage script over deep evergreen, with semi-transparent strips so the leaf bed shows through. Optimised for Cyrillic copy that runs 30–40% longer than English.</p>

      <div className="sg__grid">
        {/* Colors */}
        <div className="sg__row">
          <div className="sg__rowH">Color
            <small>Tonal palette anchored on green (hue ≈ 150). Accent ratios on bg meet WCAG AAA.</small>
          </div>
          <div className="sg__swatches">
            {colors.map(c => (
              <div className="sg__sw" key={c.v}>
                <div className="sg__sw__chip" style={{ background: c.hex }} />
                <div className="sg__sw__meta">
                  <b>{c.name}</b>
                  <code>{c.v}</code>
                  <div style={{ marginTop:6, color:'var(--text-muted)', fontSize:10 }}>{c.notes}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="sg__row">
          <div className="sg__rowH">Typography
            <small>Hamiltone (script) for brand & section heads · Manrope (sans) for UI · Cormorant italic for taglines.</small>
          </div>
          <div className="sg__type">
            {types.map((t,i) => (
              <div className="sg__type__row" key={i}>
                <div><code>{t.code}</code></div>
                <em>{t.name}</em>
                <div style={{ fontFamily: t.font, fontSize: t.size, lineHeight: t.lh, color:'var(--text)' }}>
                  {t.sample}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spacing */}
        <div className="sg__row">
          <div className="sg__rowH">Spacing
            <small>4px base, 8px primary rhythm. Token ramp: 4 8 12 16 20 24 32 40 48 64 80 96.</small>
          </div>
          <div className="sg__sp">
            {sp.map(n => (
              <div className="sg__sp__cell" key={n}>
                <div className="sg__sp__bar" style={{ width: n, height: n }} />
                <code>{n}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Radius / shadow / motion */}
        <div className="sg__row">
          <div className="sg__rowH">Radius · Shadow · Motion
            <small>Soft-rectangular corners, low-saturation shadows, ease-out motion at 240ms default.</small>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 24 }}>
            <div>
              {[['xs',2],['sm',4],['md',8],['lg',14],['xl',22]].map(([n,r]) => (
                <div key={n} style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
                  <div style={{ width:48, height:32, background:'var(--surface-solid)', border:'1px solid var(--border)', borderRadius: r }} />
                  <code style={{ color:'var(--text-muted)', fontFamily:'ui-monospace, monospace', fontSize:11 }}>--r-{n} · {r}px</code>
                </div>
              ))}
            </div>
            <div>
              {['sh-1','sh-2','sh-3'].map((s,i) => (
                <div key={s} style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
                  <div style={{ width:48, height:32, background:'var(--surface-solid)', borderRadius:8, boxShadow: `var(--${s})` }} />
                  <code style={{ color:'var(--text-muted)', fontFamily:'ui-monospace, monospace', fontSize:11 }}>--{s}</code>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div><code style={{ color:'var(--accent)', fontFamily:'ui-monospace, monospace', fontSize:11 }}>--dur-fast · 140ms</code></div>
              <div><code style={{ color:'var(--accent)', fontFamily:'ui-monospace, monospace', fontSize:11 }}>--dur · 240ms</code></div>
              <div><code style={{ color:'var(--accent)', fontFamily:'ui-monospace, monospace', fontSize:11 }}>--dur-slow · 480ms</code></div>
              <div style={{ marginTop:10, color:'var(--text-muted)', fontSize:12 }}>ease-out · cubic-bezier(.22,1,.36,1)</div>
              <div style={{ marginTop:18 }}>
                <div className="fa-fav" style={{ width: 64, height: 64, borderRadius: 14 }}>
                  <svg width="40" height="40" viewBox="0 0 64 64">
                    <path d="M32 6 C 40 22, 46 38, 48 58" stroke="oklch(0.78 0.085 150)" strokeWidth="1.6" fill="none" />
                    {Array.from({ length: 9 }).map((_,i) => {
                      const t = i / 8;
                      const x = 32 + (48-32)*t * 0.9;
                      const y = 6 + (58-6)*t;
                      const len = 8 + Math.sin(t*Math.PI)*9;
                      return (
                        <g key={i} transform={`translate(${x} ${y})`}>
                          <ellipse rx={len} ry={len/3.5} transform="rotate(-30)" fill="oklch(0.65 0.075 150)" />
                          <ellipse rx={len} ry={len/3.5} transform="rotate(30)"  fill="oklch(0.55 0.060 150)" />
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:8 }}>favicon · 512×512 master · sage on bg-deep</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rationale */}
        <div className="sg__row">
          <div className="sg__rowH">Rationale</div>
          <div style={{ fontFamily:'var(--font-serif)', fontSize: 17, lineHeight: 1.55, color:'var(--text-muted)', maxWidth: 720 }}>
            <p style={{ marginTop: 0 }}>The reference imagery sets a clear voice: a near-black canvas tinted just enough toward green that fern silhouettes feel native, not pasted. We anchor the palette on hue 150 across all neutrals so the page reads as one tone, then introduce a single sage accent for navigation, totals and section heads.</p>
            <p>Hamiltone carries the brand identity at hero scale; we deliberately do not use it for body copy, where Manrope holds Cyrillic well at small sizes. Cormorant italic serves taglines and disclaimers — its higher contrast adds an editorial calm without competing with the script.</p>
            <p>Cards are semi-transparent so the leaf bed shows through, but always sit over a backdrop-blur to keep prices legible at AAA. Cyrillic strings run ~35% longer than English, so every card is single-column on mobile and two-column on tablet+ — never three.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Mobile, MobileLanding, MobileServices, MobileCalcStep, MobileCalcSummary, MobileLangOpen, Desktop, Tablet, StyleGuide });
