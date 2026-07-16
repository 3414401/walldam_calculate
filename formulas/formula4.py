"""공식 4 계산 코드. 준비하신 pandas 코드로 `calculate` 본문을 교체하세요."""

import pandas as pd

NAME = "공식4 지표"
DESCRIPTION = "지표4_데이터.xlsx 로 계산하는 네 번째 지표입니다."
UNIT = ""


def calculate(df: pd.DataFrame):
    numeric = df.select_dtypes(include="number")
    if numeric.empty:
        return {"value": None, "detail": {"메모": "숫자 컬럼이 없습니다."}}
    value = float(numeric.min().min())
    return {"value": round(value, 4), "detail": {"사용한_행수": int(len(df))}}
