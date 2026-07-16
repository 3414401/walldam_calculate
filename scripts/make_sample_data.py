"""예시용 샘플 엑셀 데이터를 data/ 에 생성합니다.

실제 데이터가 준비되면 이 스크립트는 필요 없습니다.
(data/ 아래에 실제 엑셀을 넣고 build_indicators.py 를 실행하세요.)

실행:  python scripts/make_sample_data.py
"""

import random
from pathlib import Path

import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

SAMPLE_REGIONS = {
    "대전광역시": ["유성구", "동구", "서구"],
    "서울특별시": ["강남구", "종로구"],
    "부산광역시": ["해운대구", "사하구"],
}
FORMULA_COUNT = 6


def make_df(seed: int) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    n = rng.integers(8, 20)
    return pd.DataFrame(
        {
            "항목": [f"항목{i+1}" for i in range(n)],
            "값A": rng.integers(10, 1000, size=n),
            "값B": rng.normal(50, 15, size=n).round(2),
        }
    )


def main():
    count = 0
    for sido, gus in SAMPLE_REGIONS.items():
        for gu in gus:
            folder = DATA_DIR / sido / gu
            folder.mkdir(parents=True, exist_ok=True)
            for f in range(1, FORMULA_COUNT + 1):
                path = folder / f"지표{f}_데이터.xlsx"
                make_df(hash((sido, gu, f)) % (2**32)).to_excel(path, index=False)
                count += 1
    print(f"샘플 엑셀 {count}개 생성 완료: {DATA_DIR}")


if __name__ == "__main__":
    main()
