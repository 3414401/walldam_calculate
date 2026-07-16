# walldam_calculate — 지역별 지표 대시보드

엑셀 데이터로 **지역 × 공식** 지표(약 30개 지역 × 6개 공식 ≈ 200개)를 미리 계산해서
웹사이트에 저장해 보여주는 프로젝트입니다.

사용자가 파일을 **업로드/다운로드하지 않고**, 저장된 지표를 **조회만** 하는 구조입니다.

## 핵심 아이디어 (왜 이렇게 만드나)

- 데이터는 이미 준비되어 있고 바뀌지 않으므로, **매 요청마다 계산하지 않습니다.**
- 배포(build) 시점에 `build_indicators.py` 가 모든 엑셀을 pandas 로 한 번 계산해서
  결과를 `app/data/indicators.json` 하나에 저장합니다.
- 웹 서버(Flask)는 그 JSON 만 읽어 아주 빠르게 화면에 보여줍니다.

```
엑셀(data/) ──[build_indicators.py + formulas/]──▶ app/data/indicators.json ──[Flask]──▶ 웹 화면
```

## 폴더 구조

```
.
├── data/                       # 원본 엑셀 (여기에 실제 데이터를 넣으세요)
│   └── <시도>/<구>/지표N_데이터.xlsx     # 파일명의 N 이 공식 N 과 연결됨
├── formulas/                   # 지표(공식)별 pandas 계산 코드
│   ├── formula1.py ... formula6.py   # calculate(df) 안에 실제 코드 작성
│   └── registry.py             # 공식 번호 ↔ 코드 매핑
├── build_indicators.py         # 엑셀 → 계산 → indicators.json 생성 (배포 시 실행)
├── app/
│   ├── main.py                 # Flask 웹 서버
│   ├── data/indicators.json    # 계산 결과(빌드 산출물)
│   └── templates/index.html    # 대시보드 화면
├── scripts/make_sample_data.py # 예시용 샘플 엑셀 생성기 (실제 데이터 준비되면 불필요)
├── requirements.txt
└── render.yaml                 # render.com 배포 설정
```

## 처음부터 하는 순서

### 1) 실제 데이터 넣기
`data/` 아래에 `시도/구/지표N_데이터.xlsx` 형태로 엑셀을 넣습니다.
> 파일명에 `지표1`, `지표2` … 처럼 **공식 번호**가 들어가야 자동으로 연결됩니다.

### 2) 공식 코드 작성
`formulas/formula1.py` ~ `formula6.py` 의 `calculate(df)` 안에
준비하신 pandas 코드를 넣습니다. `df` 는 해당 엑셀을 읽은 DataFrame 입니다.
숫자 하나를 반환하거나 `{"value": 값, "detail": {...}}` 로 반환하면 됩니다.
표시 이름은 각 파일의 `NAME` / `DESCRIPTION` / `UNIT` 로 바꿉니다.

### 3) 로컬에서 확인
```bash
pip install -r requirements.txt

# (선택) 실제 데이터가 아직 없다면 샘플로 먼저 확인
python scripts/make_sample_data.py

# 지표 계산 → app/data/indicators.json 생성
python build_indicators.py

# 웹 실행 후 http://localhost:8000 접속
python app/main.py
```

### 4) render.com 배포
1. 이 저장소를 GitHub 에 올립니다.
2. render.com → **New +** → **Blueprint** 선택 후 저장소 연결
   (루트의 `render.yaml` 을 자동 인식합니다.)
3. 배포되면 `buildCommand` 가 `build_indicators.py` 를 실행해 지표를 계산하고,
   `gunicorn` 으로 웹이 뜹니다.

> 데이터/공식을 바꾼 뒤에는 다시 커밋·푸시하면 render 가 자동으로 재배포하며 지표를 다시 계산합니다.

## 자주 하는 변경

- **공식 개수 변경**: `formulas/` 에 `formulaN.py` 추가 후 `registry.py` 의 `FORMULAS` 에 등록
- **지역 추가**: `data/` 에 폴더/엑셀만 추가하고 다시 `build_indicators.py` 실행
- **표시 방식 변경**: `app/templates/index.html`
