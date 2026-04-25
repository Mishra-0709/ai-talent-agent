import { useState } from "react";

function App() {
  const API = "https://ai-talent-agent-s3ip.onrender.com";

  const [jd, setJd] = useState("");
  const [candidateText, setCandidateText] = useState("");
  const [results, setResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [parsedJD, setParsedJD] = useState(null);
  const [resume, setResume] = useState([]);
  const [loading, setLoading] = useState(false);

  // Upload JSON
  const uploadCandidates = async () => {
    try {
      const parsed = JSON.parse(candidateText);

      const res = await fetch(`${API}/upload_candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidates: parsed })
      });

      const data = await res.json();
      alert(`Uploaded ${data.count} candidates`);
    } catch {
      alert("Invalid JSON format!");
    }
  };

  // Upload multiple resumes
  const uploadResume = async () => {
    const formData = new FormData();

    for (let i = 0; i < resume.length; i++) {
      formData.append("files", resume[i]);
    }

    const res = await fetch(`${API}/upload_resume_multiple`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    setCandidateText(JSON.stringify(data.candidates, null, 2));
  };

  // Process JD
  const processJD = async () => {
    setLoading(true);

    const res = await fetch(`${API}/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jd })
    });

    const data = await res.json();

    setResults(data.results || []);
    setParsedJD(data.parsed_jd || null);
    setLoading(false);
  };

  // Chat
  const sendMessage = async () => {
    const newMessages = [...messages, { role: "user", content: input }];

    const res = await fetch(`${API}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages })
    });

    const data = await res.json();

    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setInput("");
  };

  const selectCandidate = async (name) => {
    const newMessages = [
      ...messages,
      { role: "user", content: `Select ${name}` }
    ];

    const res = await fetch(`${API}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages })
    });

    const data = await res.json();

    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>🚀 AI Talent Agent</h1>

      {/* Upload */}
      <h3>Upload Resume (Multiple)</h3>
      <input type="file" multiple onChange={(e) => setResume(e.target.files)} />
      <button onClick={uploadResume}>Parse Resume</button>

      <h3>Or Upload JSON</h3>
      <textarea
        rows="4"
        style={{ width: "100%" }}
        onChange={(e) => setCandidateText(e.target.value)}
      />
      <button onClick={uploadCandidates}>Upload</button>

      {/* JD */}
      <h3>Job Description</h3>
      <textarea
        rows="3"
        style={{ width: "100%" }}
        onChange={(e) => setJd(e.target.value)}
      />
      <button onClick={processJD}>Process</button>

      {loading && <p>Processing...</p>}

      {/* Parsed JD */}
      {parsedJD && (
        <div>
          <h3>Parsed JD</h3>
          <p><b>Role:</b> {parsedJD.role}</p>
          <p><b>Skills:</b> {parsedJD.skills_required.join(", ")}</p>
          <p><b>Location:</b> {parsedJD.location}</p>
        </div>
      )}

      {/* Results */}
      <h3>Top Candidates</h3>
      {results.map((r, i) => (
        <div key={i} style={{
          background: "white",
          padding: 15,
          borderRadius: 10,
          marginBottom: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          borderLeft: i === 0 ? "6px solid green" : "4px solid #ccc"
        }}>
          <h3>#{i + 1} {r.name}</h3>

          <p>Match Score: {r.match_score}</p>

          <p style={{
            fontWeight: "bold",
            color: r.final_score > 70 ? "green" : r.final_score > 40 ? "orange" : "red"
          }}>
            Final Score: {r.final_score}
          </p>

          {/* Progress bar */}
          <div style={{ height: 8, background: "#ddd", borderRadius: 5 }}>
            <div style={{
              width: `${r.final_score}%`,
              height: "100%",
              background: "green"
            }}></div>
          </div>

          <p style={{ fontSize: 12, color: "gray" }}>
            {r.explanation?.join(", ")}
          </p>

          <button onClick={() => selectCandidate(r.name)}>
            Select Candidate
          </button>
        </div>
      ))}

      {/* Chat */}
      <h3>Chat</h3>
      <div style={{
        background: "#f5f5f5",
        padding: 10,
        borderRadius: 10,
        height: 200,
        overflowY: "auto"
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.role === "user" ? "right" : "left",
            marginBottom: 8
          }}>
            <span style={{
              background: m.role === "user" ? "#007bff" : "#ddd",
              color: m.role === "user" ? "white" : "black",
              padding: 8,
              borderRadius: 10,
              display: "inline-block"
            }}>
              {m.content}
            </span>
          </div>
        ))}
      </div>

      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;