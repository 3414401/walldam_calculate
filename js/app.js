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
  {
    key: "overcrowding",
    label: "과밀지수",
    format: (v) => fmt(v, 4),
    title: "과밀지수",
    explain: `
      <p>목적성 인구 유입과 문화 소비 쏠림의 시너지 효과를 계산하여 대형 학군의 '과밀 지수'를 구하고, 수학적 동기화 계수로 보정해 최종 지수에 반영한다.</p>
      <p>고립 지수와 과밀 지수는 원점수 스케일이 달라, 차원 동기화 계수 α를 곱해 최대 출력치가 비슷하도록 보정한다. 또한 단순 전출입 노이즈가 과밀 지표를 왜곡하지 않도록 max 함수를 임계값 필터로 적용해 '학군지 목적의 인구 유입'만을 추출한다.</p>
    `,
  },
  {
    key: "isolation",
    label: "고립지수",
    format: (v) => fmt(v, 4),
    title: "고립지수",
    explain: `
      <p>개별 학교 학생 수 데이터를 연동하여 소수 학급 환경이 유발하는 인프라 소외와 '관계망의 단절'을 '고립 지수'로 계산한다.</p>
      <p>외부 인구 유입이 적고 전교생 수가 시 평균보다 현저히 적은 학교일수록 고립 지수가 커지며, 폐쇄적 관계망 속에서 새로운 문화적 자극과 정보 교류가 제한되는 상태를 나타낸다.</p>
    `,
  },
  {
    key: "students",
    label: "학생 수",
    format: (v) => (v == null ? "—" : Math.round(v).toLocaleString("ko-KR")),
    title: "S 해당 학교의 학생 수",
    explain: `
      <p>해당 학교의 학생 수(S)입니다. 시 평균 학생 수와 비교해 고립·과밀 지수를 계산하는 데 사용됩니다.</p>
      <p class="data-note">활용 공공데이터: 전·출입 및 학업중단 학생 수, 학교알리미 제공.</p>
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
  wrap.innerHTML = METRICS.map(
    (m) =>
      `<button type="button" class="metric-pill${m.key === activeMetric ? " is-active" : ""}" data-metric="${m.key}">${m.label}</button>`
  ).join("");
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
    return;
  }

  content.hidden = false;
  pills.hidden = false;
  initMetricPills();
  renderMetricExplain();
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
loadData().catch((err) => {
  console.error(err);
});

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
