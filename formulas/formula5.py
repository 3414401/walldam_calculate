"""공식 5 계산 코드. 준비하신 pandas 코드로 `calculate` 본문을 교체하세요."""

import pandas as pd

NAME = "공식5 지표"
DESCRIPTION = "지표5_데이터.xlsx 로 계산하는 다섯 번째 지표입니다."
UNIT = ""


def calculate(df: pd.DataFrame):
    numeric = df.select_dtypes(include="number")
    if numeric.empty:
        return {"value": None, "detail": {"메모": "숫자 컬럼이 없습니다."}}
    value = float(numeric.median().median())
    return {"value": round(value, 4), "detail": {"사용한_행수": int(len(df))}}
