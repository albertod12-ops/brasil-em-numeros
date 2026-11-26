// Brasil em Números — year explorer, charts and the sortable states table.
// One page, no network: every figure comes from data.js.
import * as D from './data.js';
import { drawLine, drawBars, drawHbars, drawDonut } from './charts.js';

const f1 = (v) => v.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const f2 = (v) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const int = (v) => v.toLocaleString('en-US');

let year = 2024;

function kpi(value, label, note) {
  return `<div class="kpi"><div class="kpi-value">${value}</div><div class="kpi-label">${label}</div><div class="kpi-note">${note}</div></div>`;
}

function renderYearButtons() {
  const box = document.getElementById('year-buttons');
  box.innerHTML = D.YEARS.map((y) =>
    `<button data-year="${y}" class="${y === year ? 'active' : ''}" aria-pressed="${y === year}">${y}</button>`).join('');
  box.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      year = Number(btn.dataset.year);
      renderYear();
    });
  });
}

function renderYear() {
  const d = D.YEAR_DATA.find((r) => r.year === year);
  document.querySelectorAll('#year-buttons button').forEach((b) => {
    const on = Number(b.dataset.year) === year;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
  });
  document.getElementById('focus-line').innerHTML =
    `<strong>${year} in focus:</strong> population ${f1(d.population)} million · real GDP growth ${d.growth > 0 ? '+' : ''}${f1(d.growth)}% · ` +
    `nominal GDP R$${f2(d.gdpBrl)} trillion (US$${f2(d.gdpUsd)} tn) · IPCA inflation ${f2(d.ipca)}% · unemployment ${f1(d.unemployment)}%.`;
  document.getElementById('kpi-grid').innerHTML =
    kpi(f1(d.population) + ' m', 'Population', `${year} · IBGE`) +
    kpi('R$' + f2(d.gdpBrl) + ' tn', 'Nominal GDP', `${year} · IBGE`) +
    kpi((d.growth > 0 ? '+' : '') + f1(d.growth) + '%', 'Real GDP growth', `${year} · IBGE`) +
    kpi(f2(d.ipca) + '%', 'IPCA inflation', `${year} · IBGE`) +
    kpi(f1(d.unemployment) + '%', 'Unemployment', `${year} · PNAD`) +
    kpi('US$' + int(D.GDP_PER_CAPITA_USD[D.YEARS.indexOf(year)]), 'GDP per capita', `${year} · IMF`);
  document.getElementById('chart-growth').innerHTML =
    drawLine({ years: D.YEARS, values: D.GDP_GROWTH, label: 'Real GDP growth', unit: '%', color: '#0b7a4b', highlight: year });
  document.getElementById('chart-ipca').innerHTML =
    drawBars({ labels: D.YEARS.map(String), values: D.IPCA, label: 'IPCA inflation', unit: '%', color: '#0b7a4b', decimals: 2 });
}

function renderStatic() {
  document.getElementById('chart-population').innerHTML =
    drawLine({ years: D.YEARS, values: D.POPULATION, label: 'Population', unit: ' m', color: '#1f3a6e', highlight: year });
  document.getElementById('chart-gdp').innerHTML =
    drawLine({ years: D.YEARS, values: D.GDP_BRL, label: 'Nominal GDP', unit: ' tn', color: '#0b7a4b', highlight: year, decimals: 2 });
  document.getElementById('chart-unemployment').innerHTML =
    drawLine({ years: D.YEARS, values: D.UNEMPLOYMENT, label: 'Unemployment rate', unit: '%', color: '#b3402f', highlight: year });
  document.getElementById('chart-exports').innerHTML =
    drawDonut({ parts: D.EXPORT_DESTINATIONS, label: 'Exports by destination 2024' });
  document.getElementById('chart-states').innerHTML =
    drawHbars({ labels: D.STATES.map((s) => s.name), values: D.STATES.map((s) => s.pop), label: 'State population', unit: ' m', color: '#0b7a4b' });
  const total = D.HEADLINE_2024.populationM;
  document.getElementById('states-body').innerHTML = D.STATES.map((s) =>
    `<tr><td>${s.name}</td><td>${s.capital}</td><td>${f2(s.pop)}</td><td>${(s.pop / total * 100).toFixed(1)}%</td></tr>`).join('');
  document.getElementById('source-list').innerHTML = D.SOURCES.map((s) =>
    `<li><strong>${s.org}</strong> — ${s.label} (${s.year})</li>`).join('');
}

function bindTable() {
  const table = document.getElementById('states-table');
  table.querySelectorAll('th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const col = [...table.querySelectorAll('th')].indexOf(th);
      const body = document.getElementById('states-body');
      const rows = [...body.querySelectorAll('tr')];
      const asc = th.dataset.dir !== 'asc';
      table.querySelectorAll('th').forEach((h) => { delete h.dataset.dir; h.classList.remove('sorted'); });
      th.dataset.dir = asc ? 'asc' : 'desc';
      th.classList.add('sorted');
      rows.sort((a, b) => {
        const av = a.children[col].textContent.trim();
        const bv = b.children[col].textContent.trim();
        const an = parseFloat(av.replace(/[^0-9.\-]/g, ''));
        const bn = parseFloat(bv.replace(/[^0-9.\-]/g, ''));
        if (!Number.isNaN(an) && !Number.isNaN(bn)) return asc ? an - bn : bn - an;
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
      rows.forEach((r) => body.appendChild(r));
    });
  });
}

renderYearButtons();
renderYear();
renderStatic();
bindTable();

// The anchor jump happens before the charts render and the page grows, so
// re-apply it once everything is laid out — otherwise a section link lands
// on the wrong part of the page.
if (location.hash) {
  const target = document.querySelector(location.hash);
  if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
}
