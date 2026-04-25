def parse_jd(jd_text):
    jd_text = jd_text.lower()

    skills = []
    if "python" in jd_text:
        skills.append("Python")
    if "fastapi" in jd_text:
        skills.append("FastAPI")
    if "react" in jd_text:
        skills.append("React")

    location = "Unknown"
    if "bangalore" in jd_text:
        location = "Bangalore"
    elif "delhi" in jd_text:
        location = "Delhi"

    return {
        "role": "Software Developer",
        "skills_required": skills,
        "experience": "3+ years",
        "location": location
    }