def chat_agent(messages):
    last = messages[-1]["content"].lower()

    if "select" in last:
        return "Great choice! Candidate looks like a strong match."

    return "Yes, I am interested in this opportunity."