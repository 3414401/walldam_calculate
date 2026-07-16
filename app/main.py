"""지표 열람용 Flask 웹 앱.

미리 계산된 app/data/indicators.json 을 읽어 화면에 보여줍니다.
사용자는 지역을 고르면 해당 지역의 공식 계산 결과를 볼 수 있습니다.
(엑셀 업로드/다운로드 없이, 저장된 지표만 조회하는 구조)
"""

import json
from pathlib import Path

from flask import Flask, jsonify, render_template

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "indicators.json"

app = Flask(__name__)


def load_data():
    if not DATA_FILE.exists():
        return {
            "generated_at": None,
            "formulas": [],
            "regions": [],
            "summary": {"total": 0, "ok": 0, "failed": 0},
            "error": "indicators.json 이 없습니다. 먼저 `python build_indicators.py` 를 실행하세요.",
        }
    with DATA_FILE.open(encoding="utf-8") as f:
        return json.load(f)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/indicators")
def api_indicators():
    return jsonify(load_data())


@app.route("/healthz")
def healthz():
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
