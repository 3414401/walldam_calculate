"""공식 1 계산 코드.

이 파일에 준비하신 pandas 코드를 옮겨 넣으세요.
`calculate(df)` 는 `지표1_데이터.xlsx` 를 읽어들인 DataFrame 을 받아
지표 값을 계산해 반환하는 함수입니다.

반환 형식
---------
- 숫자 하나만 반환해도 되고,
- {"value": 값, "detail": {...}} 형태의 dict 로 반환해도 됩니다.
  (detail 은 화면에 보조 정보로 표시됩니다. 없으면 생략 가능)
"""

import pandas as pd


# 화면에 표시될 지표 이름/설명/단위 (자유롭게 수정하세요)
NAME = "공식1 지표"
DESCRIPTION = "지표1_데이터.xlsx 로 계산하는 첫 번째 지표입니다."
UNIT = ""


def calculate(df: pd.DataFrame):
    """지표1_데이터.xlsx 데이터를 받아 지표 값을 계산합니다.

    아래는 예시 구현입니다. 실제 준비하신 pandas 코드로 교체하세요.
    """
    # 예시: 숫자형 컬럼들의 합계를 지표 값으로 사용
    numeric = df.select_dtypes(include="number")
    if numeric.empty:
        return {"value": None, "detail": {"메모": "숫자 컬럼이 없습니다."}}

    value = float(numeric.sum().sum())
    return {
        "value": round(value, 4),
        "detail": {"사용한_행수": int(len(df))},
    }
