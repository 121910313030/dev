import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./BatchData.module.css";
import { Eye, Trash2, FileText, X } from "lucide-react"; 
import { toast } from "react-toastify";
import API from "../../api/api";

const BatchData = ({ batchId, onBack }) => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [newScore, setNewScore] = useState("");

  /**
   * FIX S7044/S8476: Sanitizing URL construction.
   * Using a strict whitelist approach for paths.
   */
  const getSafeFileUrl = useCallback((fileUrl) => {
    if (!fileUrl || typeof fileUrl !== "string") return "about:blank";

    if (fileUrl.startsWith("http")) {
      return fileUrl;
    }
    
    if (fileUrl.includes("..") || fileUrl.includes("\\\\")) {
      return "about:blank";
    }
    
    return fileUrl;
  }, []);

  const fetchResumes = useCallback(async () => {
    const cleanId = Number.parseInt(batchId, 10);
    if (Number.isNaN(cleanId)) return;

    try {
      // S7044 Fix: Pass parameters via the config object.
      // Do not use string templates like `/resumes/?id=${id}`
      const res = await API.get("/resumes/", {
        params: { batch_id: cleanId }
      });
      setResumes(res.data);
    } catch (err) {
      // S2486 Fix: Do not leave catch blocks empty. Log or handle.
      console.error("Fetch failed:", err);
      toast.error("Failed to load resumes.");
    }
  }, [batchId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedResume) {
        setSelectedResume(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedResume]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleUpdateScore = async (id) => {
    const safeId = Number.parseInt(id, 10);
    const scoreNum = Number.parseInt(newScore, 10);

    if (Number.isNaN(scoreNum) || scoreNum > 100 || scoreNum < 0) {
      toast.error("Score must be between 0 and 100.");
      return;
    }

    try {
      await API.patch(`/resumes/${safeId}/`, { score: scoreNum });
      toast.success("Score updated successfully!");
      setResumes((prev) => prev.map((r) => (r.id === id ? { ...r, score: scoreNum } : r)));
      setSelectedResume(null);
      setNewScore("");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update score.");
    }
  };

  const handleDelete = async (id) => {
    const safeId = Number.parseInt(id, 10);
    if (Number.isNaN(safeId)) return;
    
    // eslint-disable-next-line no-alert
    if (globalThis.confirm?.("Are you sure you want to delete this resume?")) {
      try {
        await API.delete(`/resumes/${safeId}/`);
        setResumes((prev) => prev.filter((r) => r.id !== id));
        setSelectedResume(null);
        toast.success("Resume deleted");
      } catch (err) { 
        console.error("Delete failed:", err);
        toast.error("Failed to delete resume.");
      }
    }
  };

  return (
    <section className={styles.fadeUp}>
      <button type="button" onClick={onBack} className={styles.backLink}>
        ← Back to Activity
      </button>
      <h2 className={styles.welcomeText}>Reviewing Batch #{Number.parseInt(batchId, 10)}</h2>
      
      <div className={styles.tableScrollContainer}>
        <table className={styles.modernTable}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>File Name</th>
              <th>AI Score</th>
              <th>Confidence</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr> 
          </thead>
          <tbody>
            {resumes.map((r) => {
              const conf = (r.confidence_level || "medium").toLowerCase();
              let confClass = styles.medConf;
              if (conf === "high") confClass = styles.highConf;
              if (conf === "low") confClass = styles.lowConf;

              return (
                <tr key={r.id}>
                  <td className={styles.fileNameCell}>
                    <FileText size={16} color="#991b1b" style={{ marginRight: "8px" }} /> 
                    {String(r.resume_file || "").split("/").pop()}
                  </td>
                  <td><span className={styles.scorePill}>{r.score}%</span></td>
                  <td><span className={`${styles.confBadge} ${confClass}`}>{conf}</span></td>
                  <td className={styles.blackText}>
                    {r.experience_years > 0 ? `${r.experience_years} Yrs` : "Entry Level"}
                  </td>
                  <td className={styles.actionBtns}>
                    <button type="button" onClick={() => setSelectedResume(r)} aria-label="View">
                      <Eye size={18} color="#1a1a1a" />
                    </button>
                    <button type="button" onClick={() => handleDelete(r.id)} className={styles.deleteBtn} aria-label="Delete">
                      <Trash2 size={18} color="#991b1b" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

{selectedResume && (
        <div className={styles.modalOverlay}>
          <button type="button" className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Resume Preview</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setSelectedResume(null)}>
                <X size={24} color="black" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <iframe 
                src={getSafeFileUrl(selectedResume.resume_file)}
                className={styles.resumeIframe}
                title="Resume Document"
              />

              <div className={styles.aiDetails}>
                 <h4>AI Analysis</h4>
                 <h3><strong>Score:</strong> {selectedResume.score}%</h3>
                 <p><strong>Reasoning:</strong> {selectedResume.analysis_reason || "N/A"}</p>
                 <hr className={styles.divider} />
                 <div className={styles.actionSection}>
                    <label htmlFor="scoreInput">Edit Score:</label>
                    <div className={styles.inputGroup}>
                      <input 
                        id="scoreInput"
                        type="number" 
                        min="0"
                        max="100"
                        value={newScore}
                        onChange={(e) => setNewScore(e.target.value)}
                        className={styles.scoreInput}
                      />
                      <button type="button" onClick={() => handleUpdateScore(selectedResume.id)} className={styles.updateBtn}>
                        Update
                      </button>
                    </div>
                 </div>
                 <button type="button" onClick={() => handleDelete(selectedResume.id)} className={styles.modalDeleteBtn}>
                    <Trash2 size={16} /> Delete Resume
                 </button>
              </div>
            </div>
          </button>
        </div>
      )}
    </section>
  );
};

BatchData.propTypes = {
  batchId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default BatchData;