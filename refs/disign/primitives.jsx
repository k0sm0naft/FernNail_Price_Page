/* eslint-disable */
/* Fern nail art — shared mockup primitives                            */
/* Loads after React; exposes leaf SVGs, common chrome, content data.   */

// ── Botanical SVG primitives (flat shapes — no photos) ───────────────
const FernFrond = ({ className, style, opacity = 0.55, flip = false, hue = 150 }) => (
  <svg className={className} style={{ ...(style || {}), transform: flip ? 'scaleX(-1)' : undefined }}
       viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g opacity={opacity} fill={`oklch(0.42 0.06 ${hue})`}>
      {/* central stem */}
      <path d="M8 192 C 80 150, 180 80, 312 18" stroke={`oklch(0.50 0.07 ${hue})`} strokeWidth="1.6" fill="none" />
      {/* leaflets — pinnate */}
      {Array.from({ length: 18 }).map((_, i) => {
        const t = i / 17;
        const x = 8 + (312 - 8) * t;
        const y = 192 - (192 - 18) * t - Math.sin(t * Math.PI) * 6;
        const len = 28 + Math.sin(t * Math.PI) * 26;
        const angTop = -42 - t * 8;
        const angBot =  44 + t * 6;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <ellipse cx={Math.cos(angTop * Math.PI/180) * len/2}
                     cy={Math.sin(angTop * Math.PI/180) * len/2}
                     rx={len/2} ry={len/9}
                     transform={`rotate(${angTop})`} />
            {i < 16 && (
              <ellipse cx={Math.cos(angBot * Math.PI/180) * len/2}
                       cy={Math.sin(angBot * Math.PI/180) * len/2}
                       rx={len/2} ry={len/9}
                       transform={`rotate(${angBot})`} />
            )}
          </g>
        );
      })}
    </g>
  </svg>
);

const PalmLeaf = ({ className, style, opacity = 0.5, flip = false, hue = 150 }) => (
  <svg className={className} style={{ ...(style || {}), transform: flip ? 'scaleX(-1)' : undefined }}
       viewBox="0 0 280 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g opacity={opacity}>
      {Array.from({ length: 11 }).map((_, i) => {
        const ang = -55 + i * 11;
        const len = 130 + Math.sin(i / 10 * Math.PI) * 30;
        return (
          <ellipse key={i}
                   cx={0} cy={-len/2}
                   rx={9 + Math.sin(i/10*Math.PI)*4}
                   ry={len/2}
                   transform={`translate(40 230) rotate(${ang})`}
                   fill={`oklch(0.38 0.06 ${hue})`} />
        );
      })}
      <path d="M40 230 C 80 180, 130 130, 200 80"
            stroke={`oklch(0.50 0.07 ${hue})`} strokeWidth="1.5" fill="none" />
    </g>
  </svg>
);

const SmallLeaf = ({ style, opacity = 0.6, hue = 150 }) => (
  <svg style={style} viewBox="0 0 80 120" aria-hidden="true">
    <g opacity={opacity}>
      <path d="M40 4 C 14 30, 14 90, 40 116 C 66 90, 66 30, 40 4 Z"
            fill={`oklch(0.40 0.06 ${hue})`} />
      <path d="M40 4 L 40 116" stroke={`oklch(0.55 0.07 ${hue})`} strokeWidth="1" />
    </g>
  </svg>
);

// ── Background composition: deep canvas with corner foliage ──────────
const LeafBackdrop = ({ density = 'normal', children }) => (
  <div className="fa-bg">
    <div className="fa-bg__layer fa-bg__layer--top">
      <PalmLeaf className="fa-leaf fa-leaf--tl" opacity={0.55} />
      <FernFrond className="fa-leaf fa-leaf--tr" opacity={0.45} />
    </div>
    <div className="fa-bg__layer fa-bg__layer--bot">
      <FernFrond className="fa-leaf fa-leaf--bl" opacity={0.4} flip />
      <SmallLeaf style={{
        position: 'absolute', right: -10, bottom: -10, width: 90, height: 130,
        transform: 'rotate(18deg)'
      }} opacity={0.35} />
    </div>
    {density === 'rich' && (
      <div className="fa-bg__layer fa-bg__layer--mid">
        <SmallLeaf style={{ position:'absolute', left:'8%', top:'40%', width:60, height:90, transform:'rotate(-22deg)' }} opacity={0.18} />
        <SmallLeaf style={{ position:'absolute', right:'12%', top:'55%', width:50, height:75, transform:'rotate(40deg)' }} opacity={0.16} />
      </div>
    )}
    <div className="fa-bg__content">{children}</div>
  </div>
);

// ── Content (3 languages) ────────────────────────────────────────────
const COPY = {
  en: {
    nav: { services:'Services', calculator:'Calculator', contact:'Contact' },
    hero: {
      eyebrow: 'PRICE LIST · 2026',
      brand: 'Fern nail art',
      tag: 'Manicure & pedicure studio · Kyiv',
      cta: 'Open price list',
      cta2: 'Try the calculator',
    },
    sections: {
      manicure: 'Manicure',
      pedicure: 'Pedicure',
      design: 'Design',
      extras: 'Extras',
    },
    book: 'Book now',
    currency: 'UAH',
    from: 'from',
    disclaimer: 'Final price depends on the condition of your skin & nails.',
    calc: {
      title: 'Calculate your visit',
      subtitle: 'Four quick questions — no commitment.',
      step: 'Step',
      of: 'of',
      next: 'Next',
      back: 'Back',
      finish: 'See total',
      restart: 'Start over',
      total: 'Estimated total',
      summary: 'Your selection',
      q1: { t: 'What service?', opts: ['Manicure', 'Pedicure', 'Both'] },
      q2: { t: 'Nail length?', opts: ['Length 1–2', 'Length 3+', 'Extension needed'] },
      q3: { t: 'Coverage?', opts: ['No coating', 'Single colour', 'French (10 nails)'] },
      q4: { t: 'Add-ons?', opts: ['Slider art', 'Rub-in / gradient', 'Seal & Protect', 'None'] },
    },
    contact: {
      h: 'Visit us',
      sub: 'Tap to message — replies within an hour.',
      addr: 'Kyiv · Podil',
      hours: 'Mon–Sat 10:00–20:00',
    },
  },
  ua: {
    nav: { services:'Послуги', calculator:'Калькулятор', contact:'Контакти' },
    hero: {
      eyebrow: 'ПРАЙС-ЛИСТ · 2026',
      brand: 'Fern nail art',
      tag: 'Студія манікюру та педикюру · Київ',
      cta: 'Відкрити прайс',
      cta2: 'Калькулятор',
    },
    sections: {
      manicure: 'Манікюр',
      pedicure: 'Педикюр',
      design: 'Дизайн',
      extras: 'Додаткові послуги',
    },
    book: 'Записатися',
    currency: 'грн',
    from: 'від',
    disclaimer: 'Кінцева ціна залежить від стану шкіри та нігтів.',
    calc: {
      title: 'Розрахуйте візит',
      subtitle: 'Чотири питання — без зобов’язань.',
      step: 'Крок',
      of: 'з',
      next: 'Далі',
      back: 'Назад',
      finish: 'Підсумок',
      restart: 'Спочатку',
      total: 'Орієнтовна сума',
      summary: 'Ваш вибір',
      q1: { t: 'Яка послуга?', opts: ['Манікюр', 'Педикюр', 'Обидва'] },
      q2: { t: 'Довжина нігтів?', opts: ['Довжина 1–2', 'Довжина 3+', 'Потрібне нарощування'] },
      q3: { t: 'Покриття?', opts: ['Без покриття', 'Один колір', 'Френч (10 н.)'] },
      q4: { t: 'Доповнення?', opts: ['Слайдер', 'Втирка / градієнт', 'Seal & Protect', 'Немає'] },
    },
    contact: {
      h: 'Завітайте',
      sub: 'Напишіть — відповідаємо протягом години.',
      addr: 'Київ · Поділ',
      hours: 'Пн–Сб 10:00–20:00',
    },
  },
  ru: {
    nav: { services:'Услуги', calculator:'Калькулятор', contact:'Контакты' },
    hero: {
      eyebrow: 'ПРАЙС-ЛИСТ · 2026',
      brand: 'Fern nail art',
      tag: 'Студия маникюра и педикюра · Киев',
      cta: 'Открыть прайс',
      cta2: 'Калькулятор',
    },
    sections: {
      manicure: 'Маникюр',
      pedicure: 'Педикюр',
      design: 'Дизайн',
      extras: 'Доп. услуги',
    },
    book: 'Записаться',
    currency: 'грн',
    from: 'от',
    disclaimer: 'Цена процедуры зависит от состояния кожи и ногтей.',
    calc: {
      title: 'Рассчитайте визит',
      subtitle: 'Четыре вопроса — без обязательств.',
      step: 'Шаг',
      of: 'из',
      next: 'Далее',
      back: 'Назад',
      finish: 'Итог',
      restart: 'Сначала',
      total: 'Ориентировочно',
      summary: 'Ваш выбор',
      q1: { t: 'Какая услуга?', opts: ['Маникюр', 'Педикюр', 'Оба'] },
      q2: { t: 'Длина ногтей?', opts: ['Длина 1–2', 'Длина 3+', 'Нужно наращивание'] },
      q3: { t: 'Покрытие?', opts: ['Без покрытия', 'Один цвет', 'Френч (10 н.)'] },
      q4: { t: 'Дополнения?', opts: ['Слайдер', 'Втирка / градиент', 'Seal & Protect', 'Нет'] },
    },
    contact: {
      h: 'Заходите',
      sub: 'Напишите — отвечаем в течение часа.',
      addr: 'Киев · Подол',
      hours: 'Пн–Сб 10:00–20:00',
    },
  },
};

// ── Price data (locale-aware service-name lookup) ────────────────────
const PRICES = {
  manicure: [
    { en:'Manicure without coating', ua:'Манікюр без покриття', ru:'Маникюр без покрытия', price: 250 },
    { en:'Gel correction · length 1–2', ua:'Корекція гель · довжина 1–2', ru:'Коррекция гель · длина 1–2', price: 450 },
    { en:'Gel correction · length 3+', ua:'Корекція гель · довжина 3+', ru:'Коррекция гель · длина 3+', price: 600, from: true },
    { en:'Extension · length 1–2', ua:'Нарощування · довжина 1–2', ru:'Наращивание · длина 1–2', price: 700 },
    { en:'Extension · length 3+', ua:'Нарощування · довжина 3+', ru:'Наращивание · длина 3+', price: 800, from: true },
  ],
  pedicure: [
    { en:'Full complex (heels + toes + colour)', ua:'Повний комплекс (п’ятки + пальці + колір)', ru:'Полный комплекс (пятки + пальцы + цвет)', price: 550 },
    { en:'Heels + toes (no coating)', ua:'П’ятки + пальці (без покриття)', ru:'Пятки + пальцы (без покрытия)', price: 500 },
    { en:'Toes + coating', ua:'Пальці + покриття', ru:'Пальцы + покрытие', price: 450 },
    { en:'Foot / toe cleaning (no coating)', ua:'Чистка стопи / пальців (без покриття)', ru:'Чистка стопы / пальцев (без покрытия)', price: 250, from: true, info: true },
    { en:'Nail correction · onycholysis, hematoma, ingrown', ua:'Зачистка нігтя · оніхолізис, гематома, врослий', ru:'Зачистка ногтя · онихолизис, гематома, вросший', price: 50, from: true, info: true },
  ],
  design: [
    { en:'French (10 nails)', ua:'Френч (10 н.)', ru:'Френч (10 н.)', price: 50 },
    { en:'Slider / painting (1 nail)', ua:'Слайдер / розпис (1 н.)', ru:'Слайдер / роспись (1 н.)', price: 10, from: true },
    { en:'Rub-in / gradient (2–10 nails)', ua:'Втирка / градієнт (2–10 н.)', ru:'Втирка / градиент (2–10 н.)', range: '20–100' },
    { en:'Encrustation (1 nail)', ua:'Інкрустація (1 н.)', ru:'Инкрустация (1 н.)', range: '10–20' },
  ],
  extras: [
    { en:'Coating removal', ua:'Зняття покриття', ru:'Снятие покрытия', price: 100 },
    { en:'Repair (1 nail)', ua:'Ремонт (1 н.)', ru:'Ремонт (1 н.)', price: 50 },
    { en:'Seal & Protect system', ua:'Система Seal & Protect', ru:'Система Seal & Protect', price: 70 },
  ],
};

// ── Format a price line ──────────────────────────────────────────────
const fmtPrice = (row, lang) => {
  const c = COPY[lang];
  if (row.range) return `${row.range} ${c.currency}`;
  if (row.from)  return `${c.from} ${row.price} ${c.currency}`;
  return `${row.price} ${c.currency}`;
};

// ── Mobile language switcher (open state) ────────────────────────────
const LangPill = ({ active, code }) => (
  <span className={`fa-lang__pill ${active ? 'is-active':''}`}>{code.toUpperCase()}</span>
);

// expose
Object.assign(window, {
  FernFrond, PalmLeaf, SmallLeaf, LeafBackdrop,
  COPY, PRICES, fmtPrice, LangPill,
});
