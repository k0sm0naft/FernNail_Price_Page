import calcConfig from '../data/calculator.json';
import prices from '../data/prices.json';
import { t, getLang } from './i18n.js';
import { getItemById, getEstimate } from './services.js';
import { el, clear } from './dom.js';

function optionLabel(opt) {
  const lang = getLang();
  if (opt.labelFromCategory) {
    const cat = prices.categories.find(c => c.id === opt.labelFromCategory);
    if (cat?.labels?.[lang]) return cat.labels[lang];
  }
  if (opt.labelFromItem) {
    const item = getItemById(opt.labelFromItem);
    if (item?.labels?.[lang]) return item.labels[lang];
  }
  if (opt.labelKey) return t(opt.labelKey);
  return opt.id;
}

const state = {
  step: 0,
  answers: {},
  lastTotal: 0,
};

export function getLastTotal() {
  return state.lastTotal;
}

function visibleSteps() {
  // Phase 1 — only single-type steps; showIf ignored. Phase 7 will honor both.
  return calcConfig.steps.filter(s => s.type === 'single');
}

function applyOption(option, selected) {
  if (option.requires && !option.requires.every(id => selected.has(id))) return;
  (option.replacesItems || []).forEach(id => selected.delete(id));
  (option.addsItems || []).forEach(id => selected.add(id));
}

function calcSelectedItems() {
  const selected = new Set();
  for (const step of visibleSteps()) {
    const ansId = state.answers[step.id];
    if (ansId == null) continue;
    const opt = step.options.find(o => o.id === ansId);
    if (!opt) continue;
    applyOption(opt, selected);
  }
  return [...selected].map(getItemById).filter(Boolean);
}

function calcTotal() {
  const total = calcSelectedItems().reduce((sum, item) => sum + getEstimate(item), 0);
  state.lastTotal = total;
  return total;
}

function reset() {
  state.step = 0;
  state.answers = {};
  state.lastTotal = 0;
}

function renderStep(container, step, steps) {
  const totalSteps = steps.length;
  const selectedAnsId = state.answers[step.id];
  const isLast = state.step === totalSteps - 1;

  const progress = el('div', { class: 'calc__progress' },
    steps.map((_, i) => el('div', { class: `calc__pip${i <= state.step ? ' is-on' : ''}` })),
  );

  const opts = el('div', { class: 'calc__opts' },
    step.options.map(opt =>
      el('button', {
        type: 'button',
        class: `opt${selectedAnsId === opt.id ? ' is-on' : ''}`,
        onClick: () => {
          state.answers[step.id] = opt.id;
          renderCalculator(container);
        },
      },
        el('span', { class: 'opt__radio' }),
        optionLabel(opt),
      ),
    ),
  );

  const backBtn = el('button', {
    type: 'button',
    class: 'btn btn--ghost',
    disabled: state.step === 0,
    style: state.step === 0 ? 'opacity:.4' : null,
    onClick: () => {
      state.step = Math.max(0, state.step - 1);
      renderCalculator(container);
    },
  }, `← ${t('calc.back')}`);

  const nextBtn = el('button', {
    type: 'button',
    class: 'btn btn--primary',
    disabled: selectedAnsId == null,
    style: selectedAnsId == null ? 'opacity:.4' : null,
    onClick: () => {
      if (state.answers[step.id] == null) return;
      state.step = Math.min(totalSteps, state.step + 1);
      renderCalculator(container);
    },
  }, `${isLast ? t('calc.finish') : t('calc.next')} →`);

  container.append(
    progress,
    el('div', { class: 'calc__step' }, `${t('calc.step')} ${state.step + 1} ${t('calc.of')} ${totalSteps}`),
    el('h3', { class: 'calc__q' }, t(step.questionKey)),
    opts,
    el('div', { class: 'calc__nav' }, backBtn, nextBtn),
  );
}

function renderSummary(container, steps) {
  const total = calcTotal();

  const rows = el('div', { class: 'sum__rows' },
    steps.map(step => {
      const ansId = state.answers[step.id];
      const opt = step.options.find(o => o.id === ansId);
      const label = opt ? optionLabel(opt) : '—';
      return el('div', { class: 'sum__row' },
        el('em', {}, t(step.questionKey)),
        el('span', {}, label),
      );
    }),
  );

  container.append(
    el('div', { class: 'calc__step' }, t('calc.summary')),
    rows,
    el('div', { class: 'sum__total' },
      el('div', {},
        el('small', {}, t('calc.total')),
        el('b', {}, `${total} ${t('currency')}`),
      ),
      el('a', { class: 'btn btn--primary', href: '#' }, t('book')),
    ),
    el('button', {
      type: 'button',
      class: 'btn btn--ghost btn--block',
      onClick: () => {
        reset();
        renderCalculator(container);
      },
    }, `↺ ${t('calc.restart')}`),
  );
}

export function renderCalculator(container) {
  if (!container) return;
  clear(container);
  const steps = visibleSteps();
  if (state.step < steps.length) {
    renderStep(container, steps[state.step], steps);
  } else {
    renderSummary(container, steps);
  }
}
