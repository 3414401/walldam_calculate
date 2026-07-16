"""공식 번호 -> 계산 함수 매핑.

`지표N_데이터.xlsx` 파일 이름의 숫자 N 이 여기서 공식 N 과 연결됩니다.
공식을 추가/변경하려면 formulas/formulaN.py 를 만들고 아래 FORMULAS 에 등록하세요.
"""

from formulas import formula1, formula2, formula3, formula4, formula5, formula6

FORMULAS = {
    1: formula1,
    2: formula2,
    3: formula3,
    4: formula4,
    5: formula5,
    6: formula6,
}


def get_formula(formula_id: int):
    """공식 번호에 해당하는 모듈을 반환합니다. 없으면 None."""
    return FORMULAS.get(formula_id)


def formula_meta():
    """공식 목록의 메타데이터(이름/설명/단위)를 반환합니다."""
    meta = []
    for fid, module in sorted(FORMULAS.items()):
        meta.append(
            {
                "id": fid,
                "name": getattr(module, "NAME", f"공식{fid}"),
                "description": getattr(module, "DESCRIPTION", ""),
                "unit": getattr(module, "UNIT", ""),
            }
        )
    return meta
