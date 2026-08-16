const marketData = {
  "1D": {
    label: "Today",
    current: 24532.4,
    change: 142.25,
    percent: 0.58,
    high: 24645.0,
    low: 24412.65,
    volume: "1.85 Cr",
    advDecline: "1,170 / 820",
    points: [24380, 24430, 24405, 24480, 24460, 24510, 24575, 24590, 24520, 24545, 24588, 24532]
  },
  "1W": {
    label: "This Week",
    current: 24490.1,
    change: 198.3,
    percent: 0.81,
    high: 24720.15,
    low: 24162.3,
    volume: "9.12 Cr",
    advDecline: "1,320 / 1,010",
    points: [24080, 24190, 24250, 24230, 24310, 24420, 24490, 24460, 24580, 24610, 24530, 24490]
  },
  "1M": {
    label: "This Month",
    current: 24215.65,
    change: 410.22,
    percent: 1.72,
    high: 24860.0,
    low: 23620.8,
    volume: "38.4 Cr",
    advDecline: "1,480 / 980",
    points: [23320, 23440, 23610, 23560, 23720, 23880, 23980, 24120, 24310, 24280, 24410, 24215.65]
  }
};

const globalIndices = {
  nifty: { value: 24532.4, delta: 142.25, percent: 0.58, positive: true },
  dow: { value: 39780.55, delta: 297.4, percent: 0.76, positive: true },
  nasdaq: { value: 18185.4, delta: 199.4, percent: 1.12, positive: true },
  sp500: { value: 5430.12, delta: 49.8, percent: 0.92, positive: true },
  china: { value: 3210.48, delta: 10.2, percent: 0.32, positive: true },
  singapore: { value: 3480.26, delta: 16.7, percent: 0.48, positive: true },
  nikkei: { value: 39840.2, delta: 492.0, percent: 1.26, positive: true },
  hangseng: { value: 17640.25, delta: 146.8, percent: 0.84, positive: true },
  oil: { value: 82.4, delta: 0.53, percent: 0.65, positive: true }
};

const gainers = [
  { name: "Reliance", price: "2,985.40", change: "+2.48%" },
  { name: "TCS", price: "3,821.15", change: "+1.96%" },
  { name: "Infosys", price: "1,627.25", change: "+1.74%" },
  { name: "HDFC Bank", price: "1,708.65", change: "+1.38%" }
];

const losers = [
  { name: "Axis Bank", price: "1,111.80", change: "-1.24%" },
  { name: "ICICI Bank", price: "1,236.05", change: "-0.92%" },
  { name: "L&T", price: "3,468.90", change: "-0.74%" },
  { name: "Titan", price: "3,592.60", change: "-0.58%" }
];

const chartSvg = document.getElementById("stockChart");
const currentPriceEl = document.getElementById("currentPrice");
const changeBadgeEl = document.getElementById("changeBadge");
const dayHighEl = document.getElementById("dayHigh");
const dayLowEl = document.getElementById("dayLow");
const volumeEl = document.getElementById("volume");
const advDeclineEl = document.getElementById("advDecline");
const chartRangeLabel = document.getElementById("chartRangeLabel");
const gainersList = document.getElementById("topGainers");
const losersList = document.getElementById("topLosers");

const niftyGlobal = document.getElementById("niftyGlobal");
const dowGlobal = document.getElementById("dowGlobal");
const nasdaqGlobal = document.getElementById("nasdaqGlobal");
const sp500Global = document.getElementById("sp500Global");
const chinaGlobal = document.getElementById("chinaGlobal");
const singaporeGlobal = document.getElementById("singaporeGlobal");
const nikkeiGlobal = document.getElementById("nikkeiGlobal");
const hangsengGlobal = document.getElementById("hangsengGlobal");
const oilGlobal = document.getElementById("oilGlobal");
const niftyTrend = document.getElementById("niftyTrend");
const dowTrend = document.getElementById("dowTrend");
const nasdaqTrend = document.getElementById("nasdaqTrend");
const sp500Trend = document.getElementById("sp500Trend");
const chinaTrend = document.getElementById("chinaTrend");
const singaporeTrend = document.getElementById("singaporeTrend");
const nikkeiTrend = document.getElementById("nikkeiTrend");
const hangsengTrend = document.getElementById("hangsengTrend");
const oilTrend = document.getElementById("oilTrend");

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    maximumSignificantDigits: 8
  }).format(value);
}

function renderList(target, items, positive) {
  target.innerHTML = items
    .map(
      (item) => `
        <li class="stock-item">
          <div class="company">
            <strong>${item.name}</strong>
            <span>NSE</span>
          </div>
          <span class="price-tag">${item.price}</span>
          <span class="change ${positive ? "positive" : "negative"}">${item.change}</span>
        </li>
      `
    )
    .join("");
}

function renderChart(points, current, isPositive) {
  const width = 760;
  const height = 280;
  const padding = 24;
  const min = Math.min(...points) * 0.995;
  const max = Math.max(...points) * 1.005;

  const createPath = (values) => {
    return values
      .map((point, index) => {
        const x = padding + (index * (width - padding * 2)) / (values.length - 1);
        const y = height - padding - ((point - min) / (max - min || 1)) * (height - padding * 2);
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  };

  const pathData = createPath(points);
  const color = isPositive ? "#18d38b" : "#ff5f75";
  const lastValue = points[points.length - 1];
  const lastX = padding + ((points.length - 1) * (width - padding * 2)) / (points.length - 1);
  const lastY = height - padding - ((lastValue - min) / (max - min || 1)) * (height - padding * 2);

  const gridLines = Array.from({ length: 5 }, (_, index) => {
    const y = padding + ((height - padding * 2) / 4) * index;
    return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(163,182,206,0.12)" stroke-width="1"/>`;
  }).join("");

  chartSvg.innerHTML = `
    <defs>
      <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${gridLines}
    <path d="${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z" fill="url(#areaFill)"/>
    <path d="${pathData}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${lastX}" cy="${lastY}" r="6" fill="${color}" stroke="#08111f" stroke-width="3"/>
  `;
}

function updateGlobalIndices() {
  const renderIndex = (element, trendEl, data, prefix = "") => {
    const isPositive = data.positive;
    element.textContent = `${prefix}${formatMoney(data.value)}`;
    trendEl.textContent = `${isPositive ? "+" : "-"}${Math.abs(data.percent).toFixed(2)}%`;
    trendEl.classList.toggle("positive", isPositive);
    trendEl.classList.toggle("negative", !isPositive);
  };

  renderIndex(niftyGlobal, niftyTrend, globalIndices.nifty, "₹");
  renderIndex(dowGlobal, dowTrend, globalIndices.dow);
  renderIndex(nasdaqGlobal, nasdaqTrend, globalIndices.nasdaq);
  renderIndex(sp500Global, sp500Trend, globalIndices.sp500);
  renderIndex(chinaGlobal, chinaTrend, globalIndices.china);
  renderIndex(singaporeGlobal, singaporeTrend, globalIndices.singapore);
  renderIndex(nikkeiGlobal, nikkeiTrend, globalIndices.nikkei);
  renderIndex(hangsengGlobal, hangsengTrend, globalIndices.hangseng);
  renderIndex(oilGlobal, oilTrend, globalIndices.oil, "$ ");
}

function updateDashboard(rangeKey) {
  const data = marketData[rangeKey];
  const isPositive = data.change >= 0;

  currentPriceEl.textContent = `₹${formatMoney(data.current)}`;
  changeBadgeEl.textContent = `${isPositive ? "+" : "-"}₹${formatMoney(Math.abs(data.change))} (${isPositive ? "+" : "-"}${Math.abs(data.percent).toFixed(2)}%)`;
  changeBadgeEl.classList.toggle("positive", isPositive);
  changeBadgeEl.classList.toggle("negative", !isPositive);

  dayHighEl.textContent = `₹${formatMoney(data.high)}`;
  dayLowEl.textContent = `₹${formatMoney(data.low)}`;
  volumeEl.textContent = data.volume;
  advDeclineEl.textContent = data.advDecline;
  chartRangeLabel.textContent = data.label;

  renderChart(data.points, data.current, isPositive);
  updateGlobalIndices();
}

renderList(gainersList, gainers, true);
renderList(losersList, losers, false);
updateGlobalIndices();

Array.from(document.querySelectorAll(".range")).forEach((button) => {
  button.addEventListener("click", () => {
    Array.from(document.querySelectorAll(".range")).forEach((btn) => btn.classList.toggle("active", btn === button));
    updateDashboard(button.dataset.range);
  });
});

updateDashboard("1D");
