# AI Talent Agent

AI Talent Agent is a full-stack application that automates candidate screening using AI. It allows users to upload resumes or candidate data, analyze job descriptions, and rank candidates based on their relevance.

The system simulates a real-world recruitment pipeline by combining resume parsing, job description understanding, semantic matching, and conversational interaction.

---

## Features

- Resume Upload (Single & Multiple PDFs)
- Automatic Resume Parsing
- Job Description Parsing (Role, Skills, Location)
- AI-Based Candidate Matching
- Similarity Scoring using Embeddings
- Candidate Ranking System
- Chat Interface for Candidate Interaction
- JSON Upload Support for Bulk Candidates
- Deployed Frontend and Backend

AI-based recruitment systems help streamline hiring by automating resume evaluation and matching candidates to job roles efficiently :contentReference[oaicite:0]{index=0}.

---

## Tech Stack

### Frontend
- React.js
- HTML, CSS
- Fetch API

### Backend
- FastAPI
- Python

### AI / ML
- OpenAI API (LLM + Embeddings)
- Cosine Similarity (Scikit-learn)

### Other Tools
- PyPDF2 (Resume Parsing)
- dotenv (Environment variables)

---


---

## How It Works

1. Upload resumes (PDF) or JSON candidate data  
2. System extracts candidate information  
3. Enter a job description  
4. JD is parsed into structured format (role, skills, location)  
5. Each candidate is compared with the JD using embeddings  
6. Cosine similarity is used to generate a match score  
7. Candidates are ranked based on score  
8. Optional chat interaction simulates recruiter-candidate communication  

---

### Upload Candidates (JSON)

### Upload Resume (Multiple)

### Process Job Description

### Chat

---

## Installation

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

