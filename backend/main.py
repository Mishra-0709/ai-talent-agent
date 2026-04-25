from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2

from jd_parser import parse_jd
from matcher import match_score
from conversation import chat_agent
from scorer import final_score

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

uploaded_candidates = []

# ------------------ Upload JSON Candidates ------------------
@app.post("/upload_candidates")
def upload_candidates(data: dict):
    global uploaded_candidates
    uploaded_candidates = data.get("candidates", [])
    return {"message": "Candidates uploaded", "count": len(uploaded_candidates)}


# ------------------ Upload MULTIPLE RESUMES ------------------
@app.post("/upload_resume_multiple")
async def upload_resume_multiple(files: list[UploadFile] = File(...)):
    candidates = []

    for file in files:
        text = ""
        pdf_reader = PyPDF2.PdfReader(file.file)

        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted

        candidates.append({
            "name": file.filename,
            "profile": text[:1000]
        })

    return {"candidates": candidates}


# ------------------ Process JD ------------------
@app.post("/process")
def process(data: dict):
    jd_text = data.get("jd", "")
    parsed = parse_jd(jd_text)

    results = []

    for c in uploaded_candidates:
        m = match_score(jd_text, c["profile"])
        interest = 70
        f = final_score(m, interest)

        # Explanation
        explanation = []
        if "python" in jd_text.lower() and "python" in c["profile"].lower():
            explanation.append("Python matched")
        if "machine learning" in jd_text.lower() and "machine learning" in c["profile"].lower():
            explanation.append("ML matched")

        results.append({
            "name": c["name"],
            "match_score": m,
            "final_score": f,
            "explanation": explanation
        })

    results.sort(key=lambda x: x["final_score"], reverse=True)

    return {
        "parsed_jd": parsed,
        "results": results
    }


# ------------------ Chat ------------------
@app.post("/chat")
def chat(data: dict):
    return {"reply": chat_agent(data["messages"])}