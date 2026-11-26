// Dependency-free SVG charts for Brasil em Números. All charts are drawn from
// data.js; the year explorer re-renders them with one year highlighted.

function tickSteps(min, max, count) {
  const span = max - min || 1;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10) * mag;
  const out = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) out.push(v);
  return out;
}

const num = (v, d = 1) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export function drawLine({ years, values, label, unit = '', color = '#0b7a4b', highlight = null, decimals = 1, height = 240 }) {
  const W = 640, H = height, L = 54, R = 16, T = 16, B = 32;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const lo = min - span * 0.14, hi = max + span * 0.14;
  const ticks = tickSteps(lo, hi, 4);
  const X = (i) => L + (i * (W - L - R)) / (years.length - 1);
  const Y = (v) => T + ((hi - v) / (hi - lo)) * (H - T - B);
  const grid = ticks.map((t) => `<line x1="${L}" y1="${Y(t)}" x2="${W - R}" y2="${Y(t)}" stroke="#e2e8e4" stroke-width="1"/>` +
    `<text x="${L - 8}" y="${Y(t) + 4}" text-anchor="end" font-size="11" fill="#64748b">${num(t, decimals)}${unit}</text>`).join('');
  const zero = lo < 0 && hi > 0 ? `<line x1="${L}" y1="${Y(0)}" x2="${W - R}" y2="${Y(0)}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 3"/>` : '';
  const line = values.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  const dots = values.map((v, i) => {
    const hot = highlight !== null && years[i] === highlight;
    return `<circle cx="${X(i)}" cy="${Y(v)}" r="${hot ? 6.5 : 4}" fill="${hot ? '#e3a008' : color}" stroke="#fff" stroke-width="1.5"/>` +
      `<text x="${X(i)}" y="${Y(v) - 11}" text-anchor="middle" font-size="11" font-weight="${hot ? 800 : 600}" fill="#0f172a">${num(v, decimals)}${unit}</text>`;
  }).join('');
  const yearsRow = years.map((y, i) => `<text x="${X(i)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="${highlight === y ? '#b45309' : '#64748b'}" font-weight="${highlight === y ? 700 : 400}">${y}</text>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label} line chart" class="chart-svg">${grid}${zero}<polyline points="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}${yearsRow}</svg>`;
}

export function drawBars({ labels, values, label, unit = '', color = '#0b7a4b', decimals = 1, height = 240 }) {
  const W = 640, H = height, L = 54, R = 16, T = 28, B = 32;
  const max = Math.max(...values, 0) * 1.12;
  const min = Math.min(0, ...values) * 1.12;
  const ticks = tickSteps(min, max, 4);
  const Y = (v) => T + ((max - v) / (max - min)) * (H - T - B);
  const bw = (W - L - R) / values.length;
  const grid = ticks.map((t) => `<line x1="${L}" y1="${Y(t)}" x2="${W - R}" y2="${Y(t)}" stroke="#e2e8e4" stroke-width="1"/>` +
    `<text x="${L - 8}" y="${Y(t) + 4}" text-anchor="end" font-size="11" fill="#64748b">${num(t, decimals)}${unit}</text>`).join('');
  const bars = values.map((v, i) => {
    const bx = L + i * bw + bw * 0.18;
    const neg = v < 0;
    const top = neg ? Y(0) : Y(v);
    return `<rect x="${bx.toFixed(1)}" y="${top.toFixed(1)}" width="${(bw * 0.64).toFixed(1)}" height="${Math.max(Math.abs(Y(v) - Y(0)), 2).toFixed(1)}" rx="3" fill="${neg ? '#b3402f' : color}"/>` +
      `<text x="${(bx + bw * 0.32).toFixed(1)}" y="${(neg ? Y(v) + 16 : top - 7).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#0f172a">${num(v, decimals)}${unit}</text>` +
      `<text x="${(bx + bw * 0.32).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#64748b">${labels[i]}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label} bar chart" class="chart-svg">${grid}${bars}</svg>`;
}

export function drawHbars({ labels, values, label, unit = '', color = '#0b7a4b', decimals = 1 }) {
  const W = 640, row = 34, L = 150, R = 70, H = labels.length * row + 16;
  const max = Math.max(...values) * 1.12;
  const rows = values.map((v, i) => {
    const y0 = 8 + i * row;
    const w = (v / max) * (W - L - R);
    return `<text x="${L - 10}" y="${y0 + 20}" text-anchor="end" font-size="12" fill="#0f172a">${labels[i]}</text>` +
      `<rect x="${L}" y="${y0 + 6}" width="${w.toFixed(1)}" height="18" rx="3" fill="${color}"/>` +
      `<text x="${L + w + 8}" y="${y0 + 20}" font-size="12" font-weight="600" fill="#0f172a">${num(v, decimals)}${unit}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label} bar chart" class="chart-svg">${rows}</svg>`;
}

export function drawDonut({ parts, label, size = 210, colors = ['#0b7a4b', '#e3a008', '#1f3a6e', '#b3402f', '#94a3b8'] }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const r = 78, cx = 105, cy = 105;
  let a = -Math.PI / 2;
  const arcs = parts.map((p, i) => {
    const frac = p.value / total;
    const a1 = a + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const d = `M ${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)} A ${r} ${r} 0 ${large} 1 ${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)} L ${cx} ${cy} Z`;
    a = a1;
    return `<path d="${d}" fill="${colors[i % colors.length]}" stroke="#fff" stroke-width="2"/>`;
  }).join('');
  const legend = parts.map((p, i) =>
    `<li><span class="swatch" style="background:${colors[i % colors.length]}"></span>${p.label} — <strong>US$ ${num(p.value, 1)} bn (${(p.value / total * 100).toFixed(1)}%)</strong></li>`).join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 210 210" width="${size}" height="${size}" role="img" aria-label="${label} donut chart">${arcs}` +
    `<circle cx="105" cy="105" r="44" fill="#fff"/><text x="105" y="101" text-anchor="middle" font-size="14" font-weight="700" fill="#0f172a">US$ ${num(total, 0)} bn</text>` +
    `<text x="105" y="118" text-anchor="middle" font-size="11" fill="#64748b">exports 2024</text></svg>` +
    `<ul class="legend">${legend}</ul></div>`;
}
