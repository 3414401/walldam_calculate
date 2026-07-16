"""엑셀 데이터 -> 지표 계산 -> app/data/indicators.json 생성 스크립트.

동작 방식
---------
1. data/ 폴더를 순회합니다. 폴더 구조는 다음과 같다고 가정합니다.

    data/
      <시도>/
        <구>/
          지표1_데이터.xlsx   -> 공식1 로 계산
          지표2_데이터.xlsx   -> 공식2 로 계산
          ...

2. 파일 이름의 "지표N" 에서 숫자 N 을 뽑아, formulas/registry.py 의 공식 N 과 연결합니다.
3. 각 엑셀을 pandas 로 읽어 해당 공식으로 계산한 뒤, 결과를 한 개의 JSON 파일로 저장합니다.

이 스크립트는 배포(build) 시점에 한 번만 실행되며, 웹사이트는 계산된 결과 JSON 만 읽어 빠르게 보여줍니다.
사용자가 직접 업로드/다운로드하지 않고, 약 200개(지역 x 공식) 지표가 웹에 저장된 형태가 됩니다.

실행:  python build_indicators.py
"""

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd

from formulas import registry

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_FILE = BASE_DIR / "app" / "data" / "indicators.json"

# "지표12_데이터.xlsx" -> 12
INDICATOR_NUM_RE = re.compile(r"지표\s*0*(\d+)")


def parse_formula_id(filename: str):
    """파일명에서 공식 번호를 추출합니다. 못 찾으면 None."""
    match = INDICATOR_NUM_RE.search(filename)
    return int(match.group(1)) if match else None


def normalize_result(raw):
    """공식이 반환한 값을 {value, detail} 형태로 정규화합니다."""
    if isinstance(raw, dict):
        value = raw.get("value")
        detail = raw.get("detail", {})
    else:
        value, detail = raw, {}

    if value is not None:
        try:
            value = float(value)
        except (TypeError, ValueError):
            value = None
    return value, detail


def build():
    if not DATA_DIR.exists():
        print(f"[경고] 데이터 폴더가 없습니다: {DATA_DIR}", file=sys.stderr)
        DATA_DIR.mkdir(parents=True, exist_ok=True)

    regions = {}
    total, ok, failed = 0, 0, 0

    for xlsx_path in sorted(DATA_DIR.rglob("*.xlsx")):
        if xlsx_path.name.startswith("~$"):  # 엑셀 임시파일 무시
            continue

        rel = xlsx_path.relative_to(DATA_DIR)
        parts = rel.parts
        if len(parts) < 3:
            print(f"[건너뜀] 폴더 구조(시도/구/파일)가 아님: {rel}", file=sys.stderr)
            continue

        sido = parts[0]
        gu = parts[1]
        formula_id = parse_formula_id(xlsx_path.name)
        total += 1

        region_key = f"{sido}/{gu}"
        region = regions.setdefault(
            region_key, {"sido": sido, "gu": gu, "indicators": []}
        )

        if formula_id is None:
            failed += 1
            region["indicators"].append(
                {
                    "formula_id": None,
                    "source_file": xlsx_path.name,
                    "value": None,
                    "detail": {},
                    "error": "파일명에서 공식 번호를 찾지 못했습니다.",
                }
            )
            print(f"[실패] 공식 번호 인식 불가: {rel}", file=sys.stderr)
            continue

        module = registry.get_formula(formula_id)
        name = getattr(module, "NAME", f"공식{formula_id}") if module else f"공식{formula_id}"
        unit = getattr(module, "UNIT", "") if module else ""

        try:
            if module is None:
                raise ValueError(f"등록되지 않은 공식 번호입니다: {formula_id}")
            df = pd.read_excel(xlsx_path)
            value, detail = normalize_result(module.calculate(df))
            region["indicators"].append(
                {
                    "formula_id": formula_id,
                    "name": name,
                    "unit": unit,
                    "source_file": xlsx_path.name,
                    "value": value,
                    "detail": detail,
                    "error": None,
                }
            )
            ok += 1
            print(f"[성공] {region_key} · 공식{formula_id} = {value}")
        except Exception as exc:  # noqa: BLE001 - 어떤 파일이 실패해도 전체는 계속
            failed += 1
            region["indicators"].append(
                {
                    "formula_id": formula_id,
                    "name": name,
                    "unit": unit,
                    "source_file": xlsx_path.name,
                    "value": None,
                    "detail": {},
                    "error": str(exc),
                }
            )
            print(f"[실패] {region_key} · 공식{formula_id}: {exc}", file=sys.stderr)

    # 각 지역의 지표를 공식 번호 순으로 정렬
    for region in regions.values():
        region["indicators"].sort(key=lambda i: (i["formula_id"] is None, i["formula_id"] or 0))

    output = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "formulas": registry.formula_meta(),
        "regions": sorted(regions.values(), key=lambda r: (r["sido"], r["gu"])),
        "summary": {"total": total, "ok": ok, "failed": failed},
    }

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_FILE.open("w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print("\n=== 빌드 완료 ===")
    print(f"지역 수: {len(regions)} · 계산한 지표: {total} (성공 {ok} / 실패 {failed})")
    print(f"결과 저장: {OUTPUT_FILE}")


if __name__ == "__main__":
    build()
