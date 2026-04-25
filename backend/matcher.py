def match_score(jd, candidate):
    jd = jd.lower()
    candidate = candidate.lower()

    score = 0

    if "python" in jd and "python" in candidate:
        score += 40
    if "fastapi" in jd and "fastapi" in candidate:
        score += 30
    if "react" in jd and "react" in candidate:
        score += 30

    if "bangalore" in jd and "bangalore" in candidate:
        score += 20
    if "delhi" in jd and "delhi" in candidate:
        score += 20

    return score