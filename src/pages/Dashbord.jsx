import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, Search, AlertCircle, Loader2 } from "lucide-react";
import styles from './Dashboard.module.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { toast } from "react-toastify";

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

  // Sorting logic: Always show highest scores first
  const rankedCandidates = [...candidates].sort((a, b) => b.score - a.score);
  
  // Defaults to the #1 candidate if the user hasn't clicked one yet
  const displayCandidate = selectedCandidate || rankedCandidates[0];

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  const getScoreClass = (score) => {
    if (score >= 80) return styles.highConfidence; 
    if (score >= 50) return styles.medConfidence;  
    return styles.lowConfidence;                   
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

  const handleshortlist = async () => {
    if (!rawFiles.csv || !rawFiles.jd) {
      toast.error("Please upload both Resume(s) and a Job Description.");
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setCandidates(response.data.candidates || []);

      setFiles({ csv: null, jd: null });     // Clears the UI labels
      setRawFiles({ csv: null, jd: null });  // Clears the actual data
      
      if (csvInputRef.current) csvInputRef.current.value = ""; // Resets the HTML input
      if (jdInputRef.current) jdInputRef.current.value = "";

      // Reset selected candidate to the new #1
      setSelectedCandidate(null); 
    } catch (error) {
      toast.error("Upload error: " + (error.response?.status || "Connection failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["dashboard-root"]}>
      
      {/* --- FULL SCREEN BLUR LOADER --- */}
      {loading && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loaderContent}>
            <Loader2 size={100} className={styles.spinner} />
            <p>AI Intelligence is Ranking Resumes...</p>
            <span>Please wait while we analyze skills and match job descriptions</span>
          </div>
        </div>
      )}

      <Navbar onLogout={handleLogout} userName="Admin User" />

      <div className={styles["hub-container"]}>
        {/* Left Sidebar */}
        <aside className={styles["crimson-panel-sidebar"]}>
          <div className={styles["upload-section"]}>
            <div className={styles["resume-analyser-title"]}>
              <h2 style={{ color: "#ef4444" }}>Recruiter's Insights</h2>
              <h3 style={{ color: "black" }}>Upload Resumes</h3>
            </div>

            <div
              className={`${styles["crimson-drop-zone"]} ${dragActive === "csv" ? styles.active : ""}`}
              onDragEnter={(e) => handleDrag(e, "csv")}
              onDragOver={(e) => handleDrag(e, "csv")}
              onDrop={(e) => handleDrop(e, "csv")}
              onClick={() => csvInputRef.current.click()}
            >
              {files.csv ? <CheckCircle color="#10b981" /> : <Upload size={20} color="#ef4444" />}
              <p>{files.csv ? "Files Loaded" : "Upload Resume (PDF)"}</p>
              <span>{files.csv || "Click or Drag File"}</span>
            </div>
            <input type="file" ref={csvInputRef} multiple accept="application/pdf" style={{ display: "none" }} onChange={(e) => processFile(e.target.files, "csv")} />

            <div
              className={`${styles["crimson-drop-zone"]} ${dragActive === "jd" ? styles.active : ""}`}
              onDragEnter={(e) => handleDrag(e, "jd")}
              onDragOver={(e) => handleDrag(e, "jd")}
              onDrop={(e) => handleDrop(e, "jd")}
              onClick={() => jdInputRef.current.click()}
            >
              {files.jd ? <CheckCircle color="#10b981" /> : <FileText size={20} color="#951111" />}
              <p>{files.jd ? "JD Loaded" : "Upload Job Description"}</p>
              <span>{files.jd || "Click or Drag File"}</span>
            </div>
            <input type="file" accept="application/pdf" ref={jdInputRef} style={{ display: "none" }} onChange={(e) => processFile(e.target.files, "jd")} />

            <button className={styles["btn-generate-crimson"]} onClick={handleshortlist} disabled={loading}>
              Shortlist Candidates
            </button>
          </div>
        </aside>

        {/* Center Main View */}
        <main className={styles["crimson-panel-main-view"]}>
          <header className={styles["view-header"]}>
            <h2>Top 3 Candidates</h2>
            <div className={styles["search-box"]}>
              <Search size={16} color="#94a3b8" />
              <input type="text" placeholder="Filter candidates..." />
            </div>
          </header>

          <div className={styles["scroll-area"]}>
            {rankedCandidates.slice(0, 3).map((c, index) => (
              <div 
                key={c.id || index} 
                className={`${styles["candidate-card"]} ${displayCandidate?.name === c.name ? styles.activeCard : ""}`}
                onClick={() => setSelectedCandidate(c)}
              >
                <div className={styles["infoGroup"]}>
                  <h3>#{index + 1} {c.name}</h3>
                </div>

                <div className={styles["statusGroup"]}>
                  <span className={styles["experienceBadge"]}>{c.experience || 0} Years Exp</span>
                  <div className={styles["simpleScoreBadge"]}>
                    {c.score}% Match
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Analytics Panel */}
        <aside className={styles["crimson-panel-analytics"]}>
          <h3 style={{ color: 'black' }}>ATS Intelligence</h3>
          {displayCandidate ? (
            <div style={{ marginTop: "1rem" }}>
              <h4 style={{ color: "black" }}>{displayCandidate.name}</h4>
              <p><strong style={{ color: "black" }}>Score: {displayCandidate.score}%</strong></p>
              <p className={styles["justificationText"]}>
                {displayCandidate.justification || "AI justification pending..."}
              </p>
            </div>
          ) : (
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <AlertCircle size={40} color="#cbd5e1" />
              <p style={{ color: "#ef4444", marginTop: "1rem" }}>No candidates analyzed yet.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;