const METRICS = [
  { key: "H_m", label: "Hₘ 종합", format: (v) => fmt(v, 3) },
  { key: "I_SCU", label: "I_SCU 사회·문화", format: (v) => fmt(v, 2) },
  { key: "H_ppc", label: "H_ppc 소비", format: (v) => fmt(v, 3) },
  { key: "H_job", label: "H_job 진로", format: (v) => fmt(v, 4) },
  { key: "H_path", label: "H_path 진학", format: (v) => fmt(v, 4) },
  { key: "R_net", label: "R_net 순전입", format: (v) => fmt(v, 4) },
  { key: "overcrowding", label: "과밀지수", format: (v) => fmt(v, 4) },
  { key: "isolation", label: "고립지수", format: (v) => fmt(v, 4) },
  { key: "students", label: "학생 수", format: (v) => (v == null ? "—" : Math.round(v).toLocaleString("ko-KR")) },
];

const EXPLAIN = {
  daejeon: {
    title: "대전광역시 · 지표 해설",
    html: `
      <h3><span class="abbr">Hₘ</span> 다차원 동질성 지수</h3>
      <p>
        교육 환경의 획일성 정도를 산출하는 월담 자체 지표입니다.
        1에 가까울수록(또는 값이 클수록) 구성원·소비·진로·진학 목표가 비슷해
        과밀형 또는 고립형 극단적 동질 집단에 가까울 가능성이 높습니다.
      </p>

      <h3><span class="abbr">I<sub>SCU</sub></span> 사회·문화 획일성 지수</h3>
      <p>
        기초생활수급자, 다문화 학생, 일반 학교 내 특수교육 대상자 비율 데이터를 통해
        구성원의 다양성 결핍 상태를 계산합니다.
      </p>
      <ul>
        <li>활용 공공데이터: 특수교육 학급 및 학생 현황(일반학교, EDSS), 공시공통사항(교육부)</li>
      </ul>

      <h3><span class="abbr">H<sub>ppc</sub></span> 소비 성향 획일성 지수</h3>
      <p>
        생존을 위한 필수 소비(식비 등)를 제외한 목적성 결제액에 HHI(허쉬만-허핀달 지수)를 적용해
        지역 내 소비 문화 쏠림을 수치화합니다. 여기에 순전입률을 곱해 최종 과밀 지수를 산출하며,
        학군지 목적의 인구 유입을 정밀하게 추출합니다.
      </p>
      <ul>
        <li>활용 공공데이터: 지역사랑상품권 가맹점 업종별 결제정보(한국조폐공사)</li>
      </ul>

      <h3><span class="abbr">H<sub>job</sub></span> 진로 노출 획일성 지수</h3>
      <p>
        전국 시군구 직업군 비율을 기반으로, 학생이 무의식적으로 노출되는
        지역사회의 소득 창출 방식과 문화 자본의 쏠림을 측정합니다.
      </p>
      <ul>
        <li>활용 공공데이터: 전국 시군구 단위 직업군별 비율(문화빅데이터플랫폼)</li>
      </ul>

      <h3><span class="abbr">H<sub>path</sub></span> 진학 획일성 지수</h3>
      <p>
        초중등 진학률 현황으로 졸업생이 특정 학교 유형으로만 몰리는 진학 쏠림 정도를 측정하고,
        Min-Max 스케일링으로 보정합니다.
      </p>
      <ul>
        <li>활용 공공데이터: 유초중등학생현황[교육통계][EDSS](교육부)</li>
      </ul>

      <h3><span class="abbr">R<sub>net</sub></span> 집단 쏠림 지수 (순전입률)</h3>
      <p>
        전·출입 학생 수를 분석하여 기존 문화를 향유하러 들어오는 목적성 인구 유입(순전입률)을 산출합니다.
      </p>
      <ul>
        <li>활용 공공데이터: 전·출입 및 학업중단 학생 수(학교알리미), 학교학구도연계정보(한국교육시설안전원)</li>
      </ul>

      <h3>과밀지수 · 고립지수</h3>
      <p>
        소수 학급 환경이 유발하는 인프라 소외와 관계망 단절을 <strong>고립 지수</strong>로 계산하고,
        목적성 인구 유입과 문화 소비 쏠림의 시너지를 <strong>과밀 지수</strong>로 구합니다.
        스케일이 다른 두 지수는 가중치 α로 동기화해 최종 Hₘ에 반영합니다.
      </p>

      <h3>대전광역시 분석 요약</h3>
      <p>
        대전 관내 초·중학교에서도 ‘학군지 중심의 과밀형 동질 집단’과
        ‘외곽 지역의 고립형 동질 집단’이라는 양극화 구조가 확인됩니다.
      </p>
      <ul>
        <li>
          <strong>과밀형:</strong> 한밭초(Hₘ≈15.99), 대전중앙초, 대전용산초, 대전은어송초 등
          서구 둔산지구·유성·동구 주요 학군지/신도심 학교가 상위권을 형성합니다.
          높은 순유입률과 대규모 학생 수가 과밀지수를 증폭시킵니다.
        </li>
        <li>
          <strong>고립형:</strong> 기성초 길헌분교장, 대덕초 도룡분교장, 장동초, 봉암초, 산서초 등
          외곽 소규모 학교·분교장이 고립지수로 인해 또 다른 고동질성 그룹을 이룹니다.
        </li>
      </ul>
    `,
  },
  daegu: {
    title: "대구광역시 · 지표 해설",
    html: `
      <div class="empty-state">
        <p>대구광역시 지표 해설은 추후 채워 넣을 예정입니다.</p>
      </div>
    `,
  },
};

let schools = [];
let activeMetric = "H_m";
let activeCity = null;
let schoolRankCity = null;
let metricRankCity = null;
let districtFilterReady = false;
let metricPillsReady = false;

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
  const res = await fetch("data/daejeon.json");
  if (!res.ok) throw new Error("데이터 로드 실패");
  schools = await res.json();
}

function initDistrictFilter() {
  if (districtFilterReady) return;
  const select = $("#filter-district");
  const districts = [...new Set(schools.map((s) => s.district).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "ko")
  );
  for (const d of districts) {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    select.appendChild(opt);
  }
  districtFilterReady = true;
}

function filteredSchools() {
  const level = $("#filter-level").value;
  const district = $("#filter-district").value;
  const q = $("#school-search").value.trim().toLowerCase();
  return schools.filter((s) => {
    if (level !== "all" && s.level !== level) return false;
    if (district !== "all" && s.district !== district) return false;
    if (q && !s.name.toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderSchoolRank() {
  const content = $("#school-rank-content");
  const body = $("#school-rank-body");
  if (!schoolRankCity) {
    content.hidden = true;
    body.innerHTML = "";
    return;
  }

  content.hidden = false;
  if (schoolRankCity === "daegu") {
    body.innerHTML = `
      <div class="empty-state">
        <p>대구광역시 학교별 동질성 순위는 추후 채워 넣을 예정입니다.</p>
      </div>`;
    return;
  }

  initDistrictFilter();
  const rows = filteredSchools()
    .slice()
    .sort((a, b) => a.H_m - b.H_m);
  body.innerHTML = `
    <div class="table-wrap">
      <table class="data-table" id="school-rank-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>학교명</th>
            <th>학교급</th>
            <th>구</th>
            <th>H<sub>m</sub></th>
            <th>학생 수</th>
            <th>과밀</th>
            <th>고립</th>
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
              <td class="num">${fmt(s.H_m, 3)}</td>
              <td class="num">${s.students == null ? "—" : Math.round(s.students).toLocaleString("ko-KR")}</td>
              <td class="num">${fmt(s.overcrowding, 4)}</td>
              <td class="num">${fmt(s.isolation, 4)}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
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

function renderMetricRank() {
  const content = $("#metric-rank-content");
  const body = $("#metric-rank-body");
  if (!metricRankCity) {
    content.hidden = true;
    body.innerHTML = "";
    return;
  }

  content.hidden = false;
  if (metricRankCity === "daegu") {
    body.innerHTML = `
      <div class="empty-state">
        <p>대구광역시 지표별 순위는 추후 채워 넣을 예정입니다.</p>
      </div>`;
    return;
  }

  initMetricPills();
  const metric = METRICS.find((m) => m.key === activeMetric);
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

function setupMainNav() {
  $$(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.section;
      $$(".nav-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      $$(".section").forEach((sec) => {
        const on = sec.id === `section-${id}`;
        sec.classList.toggle("is-active", on);
        sec.hidden = !on;
      });
    });
  });
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
    $(`#${id}`).addEventListener("input", () => {
      if (schoolRankCity === "daejeon") renderSchoolRank();
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

function setupCities() {
  $$("#section-indicators .city-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCity = btn.dataset.city;
      $$("#section-indicators .city-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      showCity(activeCity);
    });
  });

  $("#explain-btn").addEventListener("click", () => {
    if (!activeCity) return;
    const info = EXPLAIN[activeCity];
    $("#explain-dialog-title").textContent = info.title;
    $("#explain-dialog-body").innerHTML = info.html;
    $("#explain-dialog").showModal();
  });
}

function showCity(city) {
  const panel = $("#city-panel");
  const data = $("#city-data");
  panel.hidden = false;

  if (city === "daejeon") {
    $("#city-title").textContent = "대전광역시 지표";
    const sorted = schools.slice().sort((a, b) => a.H_m - b.H_m);
    const avgHm = schools.reduce((s, x) => s + x.H_m, 0) / schools.length;
    const max = schools.reduce((a, b) => (a.H_m > b.H_m ? a : b));
    const min = schools.reduce((a, b) => (a.H_m < b.H_m ? a : b));

    data.innerHTML = `
      <div class="city-stats">
        <div class="stat"><span class="label">학교 수</span><span class="value">${schools.length}</span></div>
        <div class="stat"><span class="label">평균 Hₘ</span><span class="value">${fmt(avgHm, 3)}</span></div>
        <div class="stat"><span class="label">최고 Hₘ</span><span class="value">${fmt(max.H_m, 2)}</span></div>
        <div class="stat"><span class="label">최저 Hₘ</span><span class="value">${fmt(min.H_m, 2)}</span></div>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>순위</th>
              <th>학교명</th>
              <th>학교급</th>
              <th>구</th>
              <th>Hₘ</th>
              <th>I_SCU</th>
              <th>H_ppc</th>
              <th>H_job</th>
              <th>H_path</th>
              <th>R_net</th>
              <th>과밀</th>
              <th>고립</th>
              <th>학생 수</th>
            </tr>
          </thead>
          <tbody>
            ${sorted
              .map(
                (s, i) => `
              <tr>
                <td class="rank">${i + 1}</td>
                <td>${escapeHtml(s.name)}</td>
                <td>${escapeHtml(s.level || "—")}</td>
                <td>${escapeHtml(s.district || "—")}</td>
                <td class="num">${fmt(s.H_m, 3)}</td>
                <td class="num">${fmt(s.I_SCU, 2)}</td>
                <td class="num">${fmt(s.H_ppc, 3)}</td>
                <td class="num">${fmt(s.H_job, 4)}</td>
                <td class="num">${fmt(s.H_path, 4)}</td>
                <td class="num">${fmt(s.R_net, 4)}</td>
                <td class="num">${fmt(s.overcrowding, 4)}</td>
                <td class="num">${fmt(s.isolation, 4)}</td>
                <td class="num">${s.students == null ? "—" : Math.round(s.students).toLocaleString("ko-KR")}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } else {
    $("#city-title").textContent = "대구광역시 지표";
    data.innerHTML = `
      <div class="empty-state">
        <p>대구광역시 지표 데이터는 추후 채워 넣을 예정입니다.</p>
      </div>
    `;
  }
}

setupMainNav();
setupSubtabs();
setupFilters();
setupRankCityButtons();
setupCities();
loadData().catch((err) => {
  console.error(err);
});
