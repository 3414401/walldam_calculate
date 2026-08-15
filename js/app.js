const METRICS = [
  {
    key: "H_m",
    label: "Hₘ 종합",
    format: (v) => fmt(v, 3),
    title: "Hₘ 다차원 동질성 지수 (Multidimensional Homogeneity)",
    explain: `
      <p>사회·문화·교육 공공데이터를 전처리·융합하여 교육 환경의 획일성 정도를 산출하는 월담 자체 지표입니다.</p>
      <p>값이 클수록(1에 가까워지거나 그 이상일수록) 집단 구성원(I<sub>SCU</sub>), 소비 방식(H<sub>ppc</sub>), 진로 노출(H<sub>job</sub>), 공부 목표(H<sub>path</sub>)가 비슷하여, 과밀되거나 고립된 극단적 동질 집단에 가까울 가능성이 높습니다.</p>
    `,
  },
  {
    key: "I_SCU",
    label: "I_SCU 사회·문화",
    format: (v) => fmt(v, 2),
    title: "I_SCU 사회·문화 획일성 지수 (Index of Socio-Cultural Uniformity)",
    explain: `
      <p>기초생활수급자, 다문화 학생, 일반 학교 내 특수교육 대상자 비율 데이터를 통해 구성원의 다양성 결핍 상태를 계산한다.</p>
      <p class="data-note">활용 공공데이터: 특수교육 학급 및 학생 현황 일반학교, EDSS 제공. 공시공통사항, 교육부 제공.</p>
    `,
  },
  {
    key: "H_ppc",
    label: "H_ppc 소비",
    format: (v) => fmt(v, 3),
    title: "H_ppc 소비 성향 획일성 지수 (HHI of pure purpose-driven consumption)",
    explain: `
      <p>생존을 위한 필수 소비(식비 등)를 제외한 특정 목적성 결제액을 추출한 뒤, 경제학의 시장 독과점 측정 지표인 HHI(허쉬만-허핀달 지수)를 적용해 지역 내 소비 문화의 쏠림 현상을 수치화했다. 나아가 이 '소비 획일성 지수'에 인구 이동량인 '순전입률'을 곱해 최종 과밀 지수를 산출했다. 이를 통해 단순한 주거지 이동을 필터링하고, 해당 지역에 굳어진 특정 문화를 향유하기 위해 집중적으로 빨려 들어오는 '목적성 인구 유입'만을 정밀하게 추출하였다.</p>
      <p class="data-note">활용 공공데이터: 지역사랑상품권 가맹점 업종별 결제정보, <strong>한국조폐공사</strong> 제공.</p>
    `,
  },
  {
    key: "H_job",
    label: "H_job 진로",
    format: (v) => fmt(v, 4),
    title: "H_job 진로 노출 획일성 지수 (HHI of Job Exposure)",
    explain: `
      <p>전국 시군구 직업군 비율 데이터를 기반으로, 학생이 무의식적으로 노출되는 지역사회의 소득 창출 방식과 문화 자본의 쏠림을 측정한다.</p>
      <p class="data-note">활용 공공데이터: 전국 시군구 단위 직업군별 비율, 문화빅데이터플랫폼 제공.</p>
    `,
  },
  {
    key: "H_path",
    label: "H_path 진학",
    format: (v) => fmt(v, 4),
    title: "H_path 진학 획일성 지수 (HHI of Educational Paths)",
    explain: `
      <p>초중등 진학률 현황 데이터를 활용하여 졸업생들이 특정 학교 유형으로만 몰리는 진학 쏠림 정도를 측정한다. 마지막에 Min-Max 스케일링으로 보정하였다.</p>
      <p class="data-note">활용 공공데이터: 유초중등학생현황[교육통계][EDSS], 교육부 제공.</p>
    `,
  },
  {
    key: "R_net",
    label: "R_net 순전입",
    format: (v) => fmt(v, 4),
    title: "R_net 집단 쏠림 지수 (Net transfer rate)",
    explain: `
      <p>출입 학생 수 데이터를 분석하여 기존 문화를 향유하러 들어오는 목적성 인구 유입(순전입률)을 산출한다.</p>
      <p class="data-note">활용 공공데이터: 전·출입 및 학업중단 학생 수, 학교알리미 제공. 학교학구도연계정보, 한국교육시설안전원 제공.</p>
    `,
  },
];

const CITY_LABEL = {
  daejeon: "대전광역시",
  daegu: "대구광역시",
};

const CITY_INTERPRET = {
  daejeon: {
    title: "대전광역시 지표 해석",
    html: `
      <p>
        대전광역시 관내 초·중학교의 다차원 동질성 지수(H<sub>m</sub>) 분석에서도
        ‘학군지 중심의 과밀형 동질 집단’과 ‘외곽 지역의 고립형 동질 집단’이라는
        명확한 양극화 구조가 확인된다.
      </p>
      <p>
        대전 서구 둔산동 일대의 한밭초등학교(H<sub>m</sub> = 15.985)를 필두로,
        대전중앙초(8.327), 대전용산초(5.916), 대전은어송초(5.397), 대전삼천초,
        대전문정초·중, 대전탄방초·중 등 서구 둔산지구 및 유성구·동구의 주요 학군지/신도심 학교들이
        H<sub>m</sub> 지수 최상위권을 형성하고 있다.
      </p>
      <p>
        이는 높은 인구 순유입률(R<sub>net</sub>)과 대규모 학생 수(S)가 결합하여
        수식 내 ‘과밀 지수’를 폭발적으로 증폭시킨 결과다.
        이들 학교는 소비 방식(H<sub>ppc</sub>), 진로 노출(H<sub>job</sub>),
        학습 목표(H<sub>path</sub>)의 동질성이 매우 높게 산출된다.
        높은 학업 성취라는 단일 목표를 공유하는 계층이 특정 학군지로 집중되면서,
        다문화·교육 급여 수급자 등 사회·문화적 이질성(I<sub>SCU</sub>)이 철저히 배제된
        ‘학업 중심의 극단적 동질 집단’ 양상을 보인다.
      </p>
      <p>
        기성초 길헌분교장(1.606), 대덕초 도룡분교장(1.495), 장동초(1.542), 봉암초(1.544),
        산서초(1.475), 세천초, 동명초, 산흥초, 기성중 등 외곽 지역 소규모 초·중학교 및
        분교장들이 또 다른 고동질성 그룹을 이루고 있다.
        대전시 평균 학생 수(S̄) 대비 현저히 적은 전교생 수(S)로 인해 수식 내
        ‘고립 지수’가 크게 작용한 결과다.
        외부 인구 유입 차단과 극소수 학급 구성으로 인해 관계망 확장의 물리적 한계에 직면해 있다.
        구성원 개개인의 배경은 다양할지라도, 폐쇄적인 관계망 속에서 새로운 문화적 자극과
        정보 교류가 통제되는 ‘구조적 고립에 따른 획일화’ 상태를 나타낸다.
      </p>
    `,
  },
  daegu: {
    title: "대구광역시 지표 해석",
    html: `
      <p>
        월담의 ‘동질성 지수 계산기’를 통해 대구광역시 관내 학교들을 분석한 결과,
        상위 15개 학교들을 학교 학생 수를 기준으로 나눌 수 있었다.
        바로 수성구 중심의 학군지의 ‘초과밀 학교’ 그룹과 도시 외곽 지역의 ‘소규모 학교’ 그룹이다.
      </p>
      <p>
        수성구의 과밀 학교들은 다문화 학생, 교육 급여 수급자, 특수 교육 대상자 비율이
        타 지역 대비 현저히 낮아 사회·문화적 다양성이 매우 취약(I 지수 높음)한 것으로 나타났다.
        여기에 특정 학군 인프라를 누리기 위한 압도적인 인구 유입과 거대한 학생 규모가 더해지면서
        ‘과밀 지수’가 폭발적으로 상승했다.
        이는 곧 해당 학교들이 학업 성취라는 강한 단일 목적을 가진 비슷한 유형의 사람들로 뭉쳐 있으며,
        결과적으로 교내 구성원의 다양성과 이질성이 철저히 배제된 ‘극단적 동질 집단’ 상태임을 시사한다.
        이는 다른 지역의 학군지들도 유사한 모습을 보일 것으로 예상된다.
      </p>
      <p>
        반면, 도시 외곽에 위치한 전교생 20~100명대의 소규모 학교들은
        사회·문화적 다양성 지표 자체는 평균 이상(지수 낮음)을 기록했다.
        그러나 외부 인구 유입이 단절된 물리적 한계로 인해 ‘고립 지수’가 폭등하는 양상을 보였다.
        극단적으로 적은 학생 수는 교우 관계의 폭을 제한하여 새로운 문화적 자극과 정보 교류를 차단한다.
        이는 소수 학급 특유의 고정된 관계망으로, 구성원 자체는 다양함에도 불구하고
        구조적으로 갇혀버리는 또 다른 형태의 획일화를 낳고 있다고 해석할 수 있다.
      </p>
    `,
  },
};

let dataByCity = { daejeon: [], daegu: [] };
let activeMetric = "H_m";
let schoolRankCity = null;
let metricRankCity = null;
let metricPillsReady = false;
const metricExtraSheetCache = new Map();

const METRIC_EXTRA_SHEETS = {
  // 원본: https://docs.google.com/spreadsheets/d/1oJ25oUu2lvGvql6OVUhI0QM-dCJ9fG_zwtSamAhIEfM/edit
  "daejeon:H_ppc": "data/daejeon-hppc.json",
  // 원본: https://docs.google.com/spreadsheets/d/1GaQw0zezdgjXtpt-El1WMrTnRo2_muNB7BQt3cf0mIA/edit
  "daegu:H_ppc": "data/daegu-hppc.json",
};

function citySchools(city) {
  return dataByCity[city] || [];
}

function fmt(v, digits = 3) {
  if (v == null || Number.isNaN(v)) return "—";
  return Number(v).toFixed(digits);
}

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $$(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  const src = String(text).replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    const next = src[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows
    .map((r) => r.map((c) => String(c).replace(/\s+/g, " ").trim()))
    .filter((r) => r.some((c) => c));
}

async function fetchSheetRows(url) {
  if (metricExtraSheetCache.has(url)) return metricExtraSheetCache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`시트 로드 실패: ${res.status}`);
  const ctype = res.headers.get("content-type") || "";
  let rows;
  if (ctype.includes("application/json") || url.endsWith(".json")) {
    rows = await res.json();
  } else {
    rows = parseCsv(await res.text());
  }
  rows = (rows || [])
    .map((r) => r.map((c) => String(c ?? "").replace(/\s+/g, " ").trim()))
    .filter((r) => r.some((c) => c));
  metricExtraSheetCache.set(url, rows);
  return rows;
}

async function renderMetricExtraTable() {
  const box = $("#metric-extra-table");
  if (!box) return;
  const key = `${metricRankCity}:${activeMetric}`;
  const url = METRIC_EXTRA_SHEETS[key];
  if (!url) {
    box.hidden = true;
    box.innerHTML = "";
    return;
  }
  box.hidden = false;
  box.innerHTML = `<p class="metric-extra-loading">표를 불러오는 중…</p>`;
  try {
    const rows = await fetchSheetRows(url);
    if (!rows.length) {
      box.innerHTML = `<p class="metric-extra-loading">표시할 표가 없습니다.</p>`;
      return;
    }
    // 탭을 바꾸는 동안 응답이 늦게 오면 무시
    if (`${metricRankCity}:${activeMetric}` !== key) return;
    const [header, ...body] = rows;
    const headerCells = header.map((h, i) => (h || (i === 0 ? "지역" : ""))).map((h) => `<th>${escapeHtml(h)}</th>`).join("");
    const bodyRows = body
      .map(
        (r) => `<tr>${header
          .map((_, i) => {
            const isNum = i === 1 || i === header.length - 1;
            return `<td${isNum ? ' class="num"' : ""}>${escapeHtml(r[i] || "")}</td>`;
          })
          .join("")}</tr>`
      )
      .join("");
    box.innerHTML = `
      <p class="metric-extra-source">
        <span>활용 공공데이터: 지역사랑상품권 가맹점 업종별 결제정보, 한국조폐공사 제공.</span>
        <img src="images/research-support-1.png?v=20260813ab" alt="한국조폐공사" class="metric-extra-source-logo" />
      </p>
      <div class="table-wrap metric-extra-wrap">
        <table class="data-table metric-extra-data">
          <thead><tr>${headerCells}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>`;
  } catch (err) {
    console.error(err);
    if (`${metricRankCity}:${activeMetric}` !== key) return;
    box.innerHTML = `<p class="metric-extra-loading">표를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>`;
  }
}

async function loadData() {
  const [daejeonRes, daeguRes] = await Promise.all([
    fetch("data/daejeon.json"),
    fetch("data/daegu.json"),
  ]);
  if (!daejeonRes.ok || !daeguRes.ok) throw new Error("데이터 로드 실패");
  dataByCity.daejeon = await daejeonRes.json();
  dataByCity.daegu = await daeguRes.json();
}

function renderSchoolSheetRows(list) {
  return list
    .map(
      (s) => `
      <tr>
        <td>${escapeHtml(s.district || "—")}</td>
        <td>${escapeHtml(s.name)}</td>
        <td class="num">${fmt(s.H_m, 6)}</td>
      </tr>`
    )
    .join("");
}

function renderSchoolRank() {
  const content = $("#school-rank-content");
  const body = $("#school-rank-body");
  const filters = content.querySelector(".filters");
  if (!schoolRankCity) {
    content.hidden = true;
    body.innerHTML = "";
    return;
  }

  content.hidden = false;
  filters.hidden = true;

  const schools = citySchools(schoolRankCity);
  const cityName = CITY_LABEL[schoolRankCity] || "";
  // 학생 수 기준으로 먼저 나눈 뒤, 각 그룹에서 H_m 상위 학교를 표시
  const large = schools
    .filter((s) => (s.students ?? 0) >= 400)
    .sort((a, b) => b.H_m - a.H_m)
    .slice(0, 40);
  const small = schools
    .filter((s) => (s.students ?? 0) < 400)
    .sort((a, b) => b.H_m - a.H_m)
    .slice(0, 40);

  body.innerHTML = `
    <div class="dual-sheet">
      <h3 class="dual-sheet-title">${cityName}의 H<sub>m</sub> 지수 상위 학교 목록</h3>
      <p class="dual-sheet-note">학생 수 400명 이상 / 미만 그룹에서 각각 H<sub>m</sub> 상위 40개교</p>
      <div class="dual-sheet-grid">
        <section class="sheet-pane">
          <h4 class="sheet-heading">▼학생수가 400명 이상인 학교</h4>
          <div class="table-wrap sheet-table">
            <table class="data-table compact-table">
              <thead>
                <tr>
                  <th>구</th>
                  <th>학교명</th>
                  <th>H<sub>m</sub></th>
                </tr>
              </thead>
              <tbody>${renderSchoolSheetRows(large)}</tbody>
            </table>
          </div>
        </section>
        <section class="sheet-pane">
          <h4 class="sheet-heading">▼학생수가 400명 미만인 학교</h4>
          <div class="table-wrap sheet-table">
            <table class="data-table compact-table">
              <thead>
                <tr>
                  <th>구</th>
                  <th>학교명</th>
                  <th>H<sub>m</sub></th>
                </tr>
              </thead>
              <tbody>${renderSchoolSheetRows(small)}</tbody>
            </table>
          </div>
        </section>
      </div>
      ${
        CITY_INTERPRET[schoolRankCity]
          ? `<article class="interpret-card">
              <h4>${CITY_INTERPRET[schoolRankCity].title}</h4>
              ${CITY_INTERPRET[schoolRankCity].html}
            </article>`
          : ""
      }
    </div>`;
}

function initMetricPills() {
  if (metricPillsReady) return;
  const wrap = $("#metric-pills");
  wrap.innerHTML = METRICS.map((m) => {
    const btn = `<button type="button" class="metric-pill${m.key === activeMetric ? " is-active" : ""}" data-metric="${m.key}">${m.label}</button>`;
    if (m.key !== "H_ppc") return btn;
    return `<span class="bubble-anchor"><span class="data-bubble">데이터 제공: 한국조폐공사</span>${btn}</span>`;
  }).join("");
  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-metric]");
    if (!btn) return;
    activeMetric = btn.dataset.metric;
    $$(".metric-pill", wrap).forEach((b) => b.classList.toggle("is-active", b === btn));
    renderMetricRank();
  });
  metricPillsReady = true;
}

function renderMetricExplain() {
  const box = $("#metric-explain");
  if (!box) return;
  if (!metricRankCity || !CITY_LABEL[metricRankCity]) {
    box.hidden = true;
    box.innerHTML = "";
    return;
  }
  const metric = METRICS.find((m) => m.key === activeMetric);
  box.hidden = false;
  box.innerHTML = `<h4>${metric.title}</h4>${metric.explain}`;
}

function renderMetricRank() {
  const content = $("#metric-rank-content");
  const body = $("#metric-rank-body");
  const pills = $("#metric-pills");
  if (!metricRankCity) {
    content.hidden = true;
    body.innerHTML = "";
    renderMetricExplain();
    renderMetricExtraTable();
    return;
  }

  content.hidden = false;
  pills.hidden = false;
  initMetricPills();
  renderMetricExplain();
  renderMetricExtraTable();
  const metric = METRICS.find((m) => m.key === activeMetric);
  const schools = citySchools(metricRankCity);
  const rows = schools
    .filter((s) => s[activeMetric] != null && !Number.isNaN(s[activeMetric]))
    .slice()
    .sort((a, b) => b[activeMetric] - a[activeMetric]);
  body.innerHTML = `
    <div class="table-wrap">
      <table class="data-table" id="metric-rank-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>학교명</th>
            <th>학교급</th>
            <th>구</th>
            <th id="metric-col-header">${metric.label}</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (s, i) => `
            <tr>
              <td class="rank">${i + 1}</td>
              <td>${escapeHtml(s.name)}</td>
              <td>${escapeHtml(s.level || "—")}</td>
              <td>${escapeHtml(s.district || "—")}</td>
              <td class="num">${metric.format(s[activeMetric])}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>`;
}


function setupSubtabs() {
  $$(".subtab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.subtab;
      $$(".subtab").forEach((t) => {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      $$(".subpanel").forEach((panel) => {
        const on = panel.id === `sub-${id}`;
        panel.classList.toggle("is-active", on);
        panel.hidden = !on;
      });
      // 지표별 순위 탭: 대전광역시를 기본으로 바로 표시
      if (id === "metric-rank") {
        const daejeonBtn = document.querySelector(
          '[data-rank-scope="metric"][data-rank-city="daejeon"]'
        );
        if (daejeonBtn) daejeonBtn.click();
      }
    });
  });
}

function setupFilters() {
  ["filter-level", "filter-district", "school-search"].forEach((id) => {
    const el = $(`#${id}`);
    if (!el) return;
    el.addEventListener("input", () => {
      if (schoolRankCity) renderSchoolRank();
    });
  });
}

function setupRankCityButtons() {
  $$("[data-rank-scope]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const scope = btn.dataset.rankScope;
      const city = btn.dataset.rankCity;
      $$(`[data-rank-scope="${scope}"]`).forEach((b) => b.classList.toggle("is-active", b === btn));
      if (scope === "school") {
        schoolRankCity = city;
        renderSchoolRank();
      } else {
        metricRankCity = city;
        renderMetricRank();
      }
    });
  });
}


setupSubtabs();
setupFilters();
setupRankCityButtons();
setupHmSliders();
setupContactForm();
loadData().catch((err) => {
  console.error(err);
});

function setupContactForm() {
  // 광고 문의용 Google Apps Script 웹앱 주소 (배포 URL을 받으면 여기에 붙여넣음)
  const SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzIMXYP0BOtYdI4OC670ndUslXrAJ2x76lEI2eBpd9sqxvTZbnnK74ycXsuurCT23ykbw/exec";

  const form = $("#contact-form");
  if (!form) return;
  const note = $("#contact-form-note");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const payload = {
      timestamp: new Date().toISOString(),
      org: data.get("org") || "",
      name: data.get("name") || "",
      email: data.get("email") || "",
      phone: data.get("phone") || "",
      type: data.get("type") || "",
      scale: data.get("scale") || "",
      schedule: data.get("schedule") || "",
      message: data.get("message") || "",
    };

    const lines = [
      `회사·기관명: ${payload.org}`,
      `담당자명: ${payload.name}`,
      `이메일: ${payload.email}`,
      `연락처: ${payload.phone}`,
      `문의 유형: ${payload.type}`,
      `예상 규모·대상: ${payload.scale}`,
      `희망 일정: ${payload.schedule}`,
      "",
      "문의 내용:",
      payload.message,
    ];
    const subject = encodeURIComponent(`[월담 이용/광고 문의] ${payload.type}`);
    const body = encodeURIComponent(lines.join("\n"));

    const isAd = String(payload.type).includes("광고");

    if (isAd && SHEETS_WEBAPP_URL) {
      try {
        await fetch(SHEETS_WEBAPP_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
        if (note) {
          note.hidden = false;
          note.textContent = "광고 문의가 접수되었습니다. 구글시트에 저장되었습니다.";
        }
        form.reset();
        return;
      } catch (err) {
        console.error(err);
        if (note) {
          note.hidden = false;
          note.textContent = "시트 저장에 실패해 이메일로 전환합니다.";
        }
      }
    }

    window.location.href = `mailto:walldam2026@gmail.com?subject=${subject}&body=${body}`;
    if (note) {
      note.hidden = false;
      note.textContent = isAd && !SHEETS_WEBAPP_URL
        ? "광고 문의용 시트 연결 전이므로, 메일로 보내 주세요. (연결 후 자동 저장됩니다)"
        : "메일 앱이 열리면 내용을 확인하고 전송해 주세요.";
    }
  });
}

function setupHmSliders() {
  const wrap = $("#hm-sliders");
  if (!wrap) return;

  const order = ["I_SCU", "H_ppc", "H_job", "H_path", "R_net"];
  // pentagon axes angles: top, top-right, bottom-right, bottom-left, top-left
  const angles = [-Math.PI / 2, -Math.PI / 2 + (2 * Math.PI) / 5, -Math.PI / 2 + (4 * Math.PI) / 5, -Math.PI / 2 + (6 * Math.PI) / 5, -Math.PI / 2 + (8 * Math.PI) / 5];
  const maxR = 120;

  function readValues() {
    return order.map((key) => {
      const input = wrap.querySelector(`input[data-metric="${key}"]`);
      return Number(input.value) / 100;
    });
  }

  function update() {
    const values = readValues();
    values.forEach((v, i) => {
      const key = order[i];
      const label = wrap.querySelector(`[data-value-for="${key}"]`);
      if (label) label.textContent = v.toFixed(2);
    });

    const points = values.map((v, i) => {
      const r = Math.max(0.08, v) * maxR;
      const x = Math.cos(angles[i]) * r;
      const y = Math.sin(angles[i]) * r;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });

    const shape = $("#radar-shape");
    const dots = $("#radar-dots");
    if (shape) shape.setAttribute("points", points.join(" "));
    if (dots) {
      dots.innerHTML = points
        .map((p) => {
          const [x, y] = p.split(",");
          return `<circle cx="${x}" cy="${y}" r="4" fill="#184f4c"/>`;
        })
        .join("");
    }

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const summary = $("#hm-summary-value");
    if (summary) summary.textContent = `Hₘ ${avg.toFixed(2)}`;
  }

  wrap.querySelectorAll('input[type="range"]').forEach((input) => {
    input.addEventListener("input", update);
  });
  update();
}
