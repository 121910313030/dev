import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Upload, FileText, CheckCircle, Loader2 , User, Settings2, X} from "lucide-react";
import styles from './Dashboard.module.css';
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from 'framer-motion';
import API from "../api/api";

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ username: "User", is_superuser: false });
  const [dragActive, setDragActive] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [files, setFiles] = useState({ csv: null, jd: null });
  const [rawFiles, setRawFiles] = useState({ csv: null, jd: null });
  const [loading, setLoading] = useState(false);

  // --- PERSISTENCE LOGIC: Load from localStorage on mount ---
  const [candidates, setCandidates] = useState(() => {
    const saved = localStorage.getItem("last_shortlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weights, setWeights] = useState({
    skills: 50,
    experience: 30,
    semantic: 20
  });

  const totalWeight = weights.skills + weights.experience + weights.semantic;
  const csvInputRef = useRef(null);
  const jdInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user_details"));
    if (savedUser) {
      setUserData(savedUser);
    }
  }, [navigate]);

  const rankedCandidates = [...candidates].sort((a, b) => b.score - a.score);
  const displayCandidate = selectedCandidate || rankedCandidates[0];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_details");
    // Clear shortlist on logout
    localStorage.removeItem("last_shortlist"); 
    if (onLogout) onLogout();
    navigate("/login");
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
    for (const resume of rawFiles.csv) {
      formData.append("resumes", resume);
    }
    formData.append("jd_file", rawFiles.jd[0]);
    formData.append("weights", JSON.stringify(weights));

    try {
      const response = await API.post("/resumes/", formData);
          const newCandidates = (response.data.candidates || []).map(c => ({
        ...c,
        // This ensures that even if the backend uses 'experience_score', 
        // the frontend has it ready for the displayCandidate logic
        experience_score: c.experience_score || 0 
      }));

      setCandidates(newCandidates);
      localStorage.setItem("last_shortlist", JSON.stringify(newCandidates));
      
      // --- PERSISTENCE LOGIC: Save to localStorage ---
      localStorage.setItem("last_shortlist", JSON.stringify(newCandidates));

      setFiles({ csv: null, jd: null });
      setRawFiles({ csv: null, jd: null });
      if (csvInputRef.current) csvInputRef.current.value = "";
      if (jdInputRef.current) jdInputRef.current.value = "";
      setSelectedCandidate(null); 
    } catch (error) {
      toast.error("Upload error: " + (error.response?.status || "Connection failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["dashboard-root"]}>
      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={styles.modalContent}
            >
              <div className={styles.modalHeader}>
                <h3>Scoring Parameters</h3>
                <button className={styles.closeIcon} onClick={() => setIsModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className={styles.modalBody}>
                <p>Adjust how the AI weights candidate profiles:</p>
                {['skills', 'experience', 'semantic'].map((field) => (
                  <div key={field} className={styles.modalSliderGroup}>
                    <div className={styles.sliderLabelRow}>
                      <span className={styles.labelTitle}>{field} Match</span>
                      <span className={styles.labelValue}>{weights[field]}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={weights[field]} 
                      onChange={(e) => setWeights({...weights, [field]: Number.parseInt(e.target.value)})}
                      className={styles.modalSlider}
                    />
                  </div>
                ))}
                <div className={styles.modalStatus}>
                  <span style={{ color: totalWeight === 100 ? '#10b981' : '#ef4444' }}>
                    Total Allocation: {totalWeight}%
                  </span>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button className={styles.btnApply} onClick={() => setIsModalOpen(false)}>
                  Apply Weights
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loaderContent}>
            <Loader2 size={100} className={styles.spinner} />
            <p>AI Intelligence is Ranking Resumes...</p>
          </div>
        </div>
      )}

      <Navbar onLogout={handleLogout} userName={userData.username} />

      <div className={styles["hub-container"]}>
        <aside className={styles["crimson-panel-sidebar"]}>
          <div className={styles["upload-section"]}>
            <div className={styles["resume-analyser-title"]}>
              <h2 style={{ color: "#ef4444" }}>Recruiter's Insights</h2>
              <h3 style={{ color: "black" }}>Upload Resumes</h3>
            </div>

            <button
              type="button"
              className={`${styles["crimson-drop-zone"]} ${dragActive === "csv" ? styles.active : ""}`}
              onDragEnter={(e) => handleDrag(e, "csv")}
              onDragOver={(e) => handleDrag(e, "csv")}
              onDrop={(e) => handleDrop(e, "csv")}
              onClick={() => csvInputRef.current.click()}
              style={{ font: "inherit", color: "inherit", cursor: "pointer" }}
            >
              {files.csv ? <CheckCircle color="#10b981" /> : <Upload size={20} color="#ef4444" />}
              <p>{files.csv ? "Files Loaded" : "Upload Resume (PDF)"}</p>
              <span>{files.csv || "Click or Drag File"}</span>
            </button>
            <input type="file" ref={csvInputRef} multiple accept="application/pdf" style={{ display: "none" }} onChange={(e) => processFile(e.target.files, "csv")} />

            <button
              type="button"
              className={`${styles["crimson-drop-zone"]} ${dragActive === "jd" ? styles.active : ""}`}
              onDragEnter={(e) => handleDrag(e, "jd")}
              onDragOver={(e) => handleDrag(e, "jd")}
              onDrop={(e) => handleDrop(e, "jd")}
              onClick={() => jdInputRef.current.click()}
              style={{ font: "inherit", color: "inherit", cursor: "pointer" }}
            >
              {files.jd ? <CheckCircle color="#10b981" /> : <FileText size={20} color="#951111" />}
              <p>{files.jd ? "JD Loaded" : "Upload Job Description"}</p>
              <span>{files.jd || "Click or Drag File"}</span>
            </button>
            <input type="file" accept="application/pdf" ref={jdInputRef} style={{ display: "none" }} onChange={(e) => processFile(e.target.files, "jd")} />

            <button 
              type="button" 
              className={styles.btnOpenModal} 
              onClick={() => setIsModalOpen(true)}
            >
              <Settings2 size={18} />
              Customize Scoring
            </button>

            <button className={styles["btn-generate-crimson"]} onClick={handleshortlist} disabled={loading}>
              Shortlist Candidates
            </button>
          </div>
        </aside>

        <main className={styles["crimson-panel-main-view"]}>
          <header className={styles["view-header"]}>
            <h2>Top 3 Candidates</h2>
          </header>

          <div className={styles["scroll-area"]}>
            {rankedCandidates.slice(0, 3).map((c, index) => (
              <button 
                type="button"
                key={c.id || index} 
                className={`${styles["candidate-card"]} ${displayCandidate?.id === c.id ? styles.activeCard : ""}`}
                onClick={() => setSelectedCandidate(c)}
              >
                <div className={styles["nameColumn"]}>
                  <div className={styles["profileIcon"]}>
                    <User size={80} color="#d8d9db" />
                  </div>
                  <h3 className={styles["candidateName"]}>
                    {c.name || `Resume_${index + 1}`}
                  </h3>
                </div>

                <div className={styles["progressColumn"]}>
                  <div className={styles["progressHeader"]}>
                    <span className={styles["matchPercentage"]}>{c.score}%</span>
                  </div>
                  <div className={styles["progressContainer"]}>
                    <div 
                      className={styles["progressBar"]} 
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>

                <div className={styles["experienceColumn"]}>
                  <span className={styles["experienceLabel"]}>Experience</span>
                  <span className={styles["experienceValue"]}>{c.experience_years || 0} Yrs</span>
                </div>
              </button>
            ))}
          </div>
        </main>

        <aside className={styles["crimson-panel-analytics"]}>
          <h3 className={styles["panel-title"]}>ATS Intelligence</h3>
          
          {displayCandidate ? (
            <div className={styles["analytics-content"]}>
              <p className={styles["candidate-name-small"]}>
                Resume: {displayCandidate.name || "Candidate_Resume.pdf"}
              </p>

              <div className={styles["score-container"]}>
                <div className={styles["gauge-container"]}>
                  <svg viewBox="0 0 100 50" className={styles["gauge-chart"]}>
                    <path
                      className={styles["gauge-bg"]}
                      d="M10,40 A40,40 0 0,1 90,40"
                      fill="none"
                      strokeWidth="10"
                    />
                    <path
                      className={styles["gauge-fill"]}
                      d="M10,40 A40,40 0 0,1 90,40"
                      fill="none"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(displayCandidate.score / 100) * 126}, 126`}
                    />
                  </svg>
                  <div className={styles["gauge-text"]}>{displayCandidate.score}%</div>
                </div>
                <div className={styles["score-text-info"]}>
                  <span>Based on role-specific keywords and experience logic.</span>
                </div>
              </div>

              <div className={styles["alignment-section"]}>
                <div className={styles["label-row"]}>
                  <span>Experience Alignment</span>
                  {/* CHANGE THIS LINE */}
                  <span>{displayCandidate.experience_score || 0}%</span>
                </div>
                <div className={styles["progress-bar-bg"]}>
                  <motion.div 
                    key={displayCandidate.id} 
                    initial={{ width: 0 }}
                    animate={{ width: `${displayCandidate.experience_score || 0}%` }} 
                    className={styles["progress-bar-fill"]}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              <div className={styles["summary-section"]}>
                <h5>Analysis Justification</h5>
                <div className={styles["justification-box"]}>
                  <p className={styles["justification-text"]}>
                    {displayCandidate?.justification || "No analysis available."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles["empty-state"]}>
              <p>Upload a resume to begin analysis.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  onLogout: PropTypes.func
};

export default Dashboard;