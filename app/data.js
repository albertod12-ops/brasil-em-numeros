// Brazil national statistics — every figure is real, with its source and year.
// Sources: IBGE (population, GDP, IPCA, PNAD labour, poverty), Banco Central do
// Brasil (Selic), Ministério do Desenvolvimento / Comex Stat (trade), IMF WEO
// October 2025 (GDP in USD), UNDP (HDI).

export const COUNTRY = {
  name: 'Brazil',
  portuguese: 'Brasil',
  capital: 'Brasília',
  areaKm2: 8515767,
  currency: 'Brazilian real (BRL)',
  updated: '26 November 2026',
};

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

// Population, millions — IBGE estimates; 2022 is the Census count (203.08 m).
// The 2022 Census revised the count down, so 2023–24 are post-census estimates.
export const POPULATION = [210.1, 211.8, 213.3, 203.1, 216.3, 212.6];
// Real GDP growth, percent — IBGE national accounts
export const GDP_GROWTH = [1.2, -3.3, 5.0, 3.0, 3.2, 3.4];
// Nominal GDP, trillion reais — IBGE
export const GDP_BRL = [7.39, 7.61, 9.01, 10.1, 10.86, 11.66];
// Nominal GDP, trillion US dollars — IMF WEO, October 2025
export const GDP_USD = [1.88, 1.48, 1.65, 1.92, 2.17, 2.17];
// GDP per capita, US dollars — IMF WEO, October 2025
export const GDP_PER_CAPITA_USD = [8965, 7000, 7750, 9470, 10040, 10242];
// Consumer prices (IPCA), percent — IBGE
export const IPCA = [4.31, 4.52, 10.06, 5.79, 4.59, 4.83];
// Unemployment rate, percent, annual average — IBGE PNAD Contínua
export const UNEMPLOYMENT = [11.9, 13.5, 13.2, 9.3, 7.8, 6.6];
// Per-year figures for the year explorer
export const YEAR_DATA = YEARS.map((y, i) => ({
  year: y,
  population: POPULATION[i],
  growth: GDP_GROWTH[i],
  gdpBrl: GDP_BRL[i],
  gdpUsd: GDP_USD[i],
  ipca: IPCA[i],
  unemployment: UNEMPLOYMENT[i],
}));

// Largest states, millions, 2024 — IBGE estimates
export const STATES = [
  { name: 'São Paulo', pop: 45.97, capital: 'São Paulo' },
  { name: 'Minas Gerais', pop: 21.32, capital: 'Belo Horizonte' },
  { name: 'Rio de Janeiro', pop: 17.22, capital: 'Rio de Janeiro' },
  { name: 'Bahia', pop: 14.85, capital: 'Salvador' },
  { name: 'Paraná', pop: 11.44, capital: 'Curitiba' },
  { name: 'Rio Grande do Sul', pop: 11.23, capital: 'Porto Alegre' },
  { name: 'Pernambuco', pop: 9.62, capital: 'Recife' },
  { name: 'Ceará', pop: 9.27, capital: 'Fortaleza' },
  { name: 'Pará', pop: 8.66, capital: 'Belém' },
  { name: 'Santa Catarina', pop: 8.19, capital: 'Florianópolis' },
];

// Foreign trade 2024, billion US dollars — Comex Stat / MDIC
export const TRADE_2024 = { exports: 337.0, imports: 262.9, surplus: 74.1 };
export const EXPORT_DESTINATIONS = [
  { label: 'China', value: 94.4 },
  { label: 'United States', value: 40.3 },
  { label: 'Argentina', value: 13.9 },
  { label: 'Netherlands', value: 13.1 },
  { label: 'All other destinations', value: 175.3 },
];

export const HEADLINE_2024 = {
  populationM: 212.6,
  gdpBrlT: 11.66,
  gdpUsdT: 2.17,
  gdpPerCapitaUsd: 10242,
  growth: 3.4,
  ipca: 4.83,
  unemployment: 6.6,
  selic: 12.25,
  poverty: 27.4,
  extremePoverty: 4.4,
  lifeExpectancy: 76.4,
  hdi: 0.786,
};

export const SOURCES = [
  { label: 'Population estimates & 2022 Census', org: 'IBGE', year: 2024 },
  { label: 'National accounts (GDP)', org: 'IBGE', year: 2024 },
  { label: 'IPCA consumer prices', org: 'IBGE', year: 2024 },
  { label: 'PNAD Contínua labour survey', org: 'IBGE', year: 2024 },
  { label: 'Poverty (Síntese de Indicadores Sociais)', org: 'IBGE', year: 2023 },
  { label: 'Selic policy rate', org: 'Banco Central do Brasil', year: 2024 },
  { label: 'Foreign trade (Comex Stat)', org: 'MDIC', year: 2024 },
  { label: 'World Economic Outlook', org: 'International Monetary Fund', year: 2025 },
  { label: 'Human Development Report', org: 'United Nations Development Programme', year: 2025 },
];
