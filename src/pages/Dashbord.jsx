import { useState, useRef } from "react";
import { Upload, FileText, LogOut, CheckCircle, Search, AlertCircle, Star } from "lucide-react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const [dragActive, setDragActive] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [files, setFiles] = useState({ csv: null, jd: null });
  const [rawFiles, setRawFiles] = useState({ csv: null, jd: null });

  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);

  const csvInputRef = useRef(null);
  const jdInputRef = useRef(null);

  const rankedCandidates = [...candidates].sort((a, b) => b.score - a.score);
  const displayCandidate = selectedCandidate || rankedCandidates[0];

  const handleLogout = () => {
    if (onLogout) onLogout();
    // localstorage.removeItem('token')
    navigate("/");
  };

  const processFile = (fileList, type) => {
    if (fileList.length > 0) {
      setRawFiles((prev) => ({ ...prev, [type]: fileList }));
      setFiles((prev) => ({
        ...prev,
        [type]: `${fileList.length} files selected`,
      }));
    }
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") setDragActive(type);
    else if (e.type === "dragleave") setDragActive(null);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    processFile(e.dataTransfer.files, type);
  };

  const handleFileSelect = (e, type) => {
    processFile(e.target.files, type);
  };

  const handleshortlist = async () => {
    if (!rawFiles.csv || !rawFiles.jd) {
      alert("Please upload both Resume(s) and a Job Description.");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    for (let i = 0; i < rawFiles.csv.length; i++) {
      formData.append("resumes", rawFiles.csv[i]);
    }

    formData.append("jd_file", rawFiles.jd[0]);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/resumes/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Backend Response:", response.data);

      setCandidates(response.data.candidates || []);

      // alert("Analysis complete!");

      setFiles({ csv: null, jd: null });
      setRawFiles({ csv: null, jd: null });

    } catch (error) {
      console.error("Upload error:", error);

      if (error.response) {
        alert("Server error: " + error.response.status);
      } else {
        alert("Could not connect to Django backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-root">
      <div className="hub-container">

        {/* Sidebar */}
        <aside className="crimson-panel sidebar">
          <div className="upload-section">

            <div className="resume-analyser-title">
              <h2 style={{color:"red"}}>Recruiter's Insights</h2>
              <h3 style={{color:"black"}}>Upload Resumes</h3>
            </div>

            <span className="section-label">Resume Analyzer</span>

            {/* Resume Upload */}
            <div
              className={`crimson-drop-zone ${dragActive === "csv" ? "active" : ""}`}
              onDragEnter={(e) => handleDrag(e, "csv")}
              onDragOver={(e) => handleDrag(e, "csv")}
              onDragLeave={(e) => handleDrag(e, "csv")}
              onDrop={(e) => handleDrop(e, "csv")}
              onClick={() => csvInputRef.current.click()}
            >
              {files.csv ? <CheckCircle color="#10b981" /> : <Upload size={20} color="#ef4444" />}
              <p>{files.csv ? "Files Loaded" : "Upload Resume (PDF)"}</p>
              <span>{files.csv || "Click or Drag File"}</span>
            </div>

            <input
              type="file"
              ref={csvInputRef}
              multiple
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFileSelect(e, "csv")}
            />

            {/* JD Upload */}
            <div
              className={`crimson-drop-zone ${dragActive === "jd" ? "active" : ""}`}
              onDragEnter={(e) => handleDrag(e, "jd")}
              onDragOver={(e) => handleDrag(e, "jd")}
              onDragLeave={(e) => handleDrag(e, "jd")}
              onDrop={(e) => handleDrop(e, "jd")}
              onClick={() => jdInputRef.current.click()}
            >
              {files.jd ? <CheckCircle color="#10b981" /> : <FileText size={20} color="#951111" />}
              <p>{files.jd ? "JD Loaded" : "Upload Job Description"}</p>
              <span>{files.jd || "Click or Drag File"}</span>
            </div>

            <input
              type="file"
              accept="application/pdf"
              ref={jdInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleFileSelect(e, "jd")}
            />

            <button
              className="btn-generate-crimson"
              onClick={handleshortlist}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Shortlist Candidates"}
            </button>
          </div>

          <button className="btn-logout-crimson" onClick={handleLogout}>
            <LogOut size={16} /> Sign-Out
          </button>
        </aside>

        {/* Main Ranking */}
        <main className="crimson-panel main-view">

          <header className="view-header">
            <h2>Top Candidates</h2>

            <div className="search-box">
              <Search size={16} color="#94a3b8" />
              <input type="text" placeholder="Filter candidates..." />
            </div>
          </header>

          <div className="scroll-area">

            {rankedCandidates.slice(0, 5).map((c, index) => (
              <div
                key={c.id}
                className="candidate-card crimson-panel"
                style={{ marginBottom: "1rem", padding: "1rem" }}
              >
                <div style={{ display: "flex",color : "black", justifyContent: "space-between" }}>

                  <div>
                    <h3>#{index + 1} {c.name}</h3>
                    <p style={{ fontSize: "0.8rem", color: "#000000" }}>
                      Skills: {c.skills.join(", ")}
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Star size={16} color="#facc15" />
                      <span style={{color:"black"}}>{c.score}%</span>
                    </div>

                    <button
                      className="btn-generate-crimson"
                      style={{ marginTop: "0.5rem" , color:"lightgoldenrodyellow"}}
                      onClick={() => setSelectedCandidate(c)}
                    >
                      View Review
                    </button>
                  </div>

                </div>
              </div>
            ))}

          </div>

        </main>

        {/* Right Panel */}
        <aside className="crimson-panel analytics">

          <h3 style = {{color : 'black'}}>ATS Intelligence</h3>

          {displayCandidate ? (
            <div style={{ marginTop: "1rem" }}>
              <h4 style={{color:"black"}}>{displayCandidate.name}</h4>

              <p>
                <strong style={{color: "black"}}>Score: {displayCandidate.score }%</strong> 
              </p>

              <p style={{ marginTop: "1rem", color: "#3c0d04" }}>
                {displayCandidate.justification}
              </p>
            </div>
          ) : (
            <div style={{ marginTop: "2rem", textAlign: "center", color: "black"}}>
              <AlertCircle size={40} color="#27272a" />
              <p style={{color:"red"}}>No candidates analyzed yet.</p>
            </div>
          )}

        </aside>

      </div>
    </div>
  );
};

export default Dashboard;