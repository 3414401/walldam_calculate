"""공식 3 계산 코드. 준비하신 pandas 코드로 `calculate` 본문을 교체하세요."""

import pandas as pd

NAME = "공식3 지표"
DESCRIPTION = "지표3_데이터.xlsx 로 계산하는 세 번째 지표입니다."
UNIT = ""


def calculate(df: pd.DataFrame):
    numeric = df.select_dtypes(include="number")
    if numeric.empty:
        return {"value": None, "detail": {"메모": "숫자 컬럼이 없습니다."}}
    value = float(numeric.max().max())
    return {"value": round(value, 4), "detail": {"사용한_행수": int(len(df))}}
