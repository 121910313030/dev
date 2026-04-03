import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./BatchData.module.css";
import { Eye, Trash2, FileText, X } from "lucide-react"; // Added X icon
import { color } from "framer-motion";
import { Await } from "react-router-dom";
import Swal from 'sweetalert2';

const BatchData = ({ batchId, onBack }) => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [newScore, setNewScore] = useState("");
  
  useEffect(() => {
    const fetchResumes = async () => {
      const res = await axios.get(`http://127.0.0.1:8000/api/resumes/?batch_id=${batchId}`);
      setResumes(res.data);
    };
    fetchResumes();
  }, [batchId]);

  const handleUpdateScore = async (id) => {
    try{
      const token = localStorage.getItem("access_token");
      await axios.patch(`http://127.0.0.1:8000/api/resumes/${id}/`,
        {score: newScore},
        {headers: {Authorization:'Bearer ${token}'}}
      );
      alert("Score updated");

      setResumes(resumes.map(r => r.id === id ? {...r, score: newScore} : r));
      setSelectedResume(null);
    }catch(err){
      alert("failed to update score ");
    }
  };

  const handleDelete = async(id) => {
    if (window.confirm("Are you sure you want to delete this resume?")){
      try{
        const token = localStorage.getItem("access_token");
        await
         axios.delete(`http://127.0.0.1:8000/api/resumes/${id}/`,{
          headers: {Authorization: 'Bearer ${token}'}
         });
         setResumes(resumes.filter(r => r.id !== id));
         setSelectedResume(null);
      }catch(err){
        alert("delete failed");3
      }
    }
  }

  return (
    <section className={styles.fadeUp}>
      <button onClick={onBack} className={styles.backLink}>← Back to Activity</button>
      <h2 className={styles.welcomeText}>Reviewing Batch #{batchId}</h2>
      
      <div className={styles.tableScrollContainer}>
        <table className={styles.modernTable}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>File Name</th>
              <th>AI Score</th>
              <th>Confidence</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {resumes.map((r) => {
              const confLevel = r.confidence_level || "Medium";
              let confClass = styles.medConf;
              if (confLevel.toLowerCase() === "high") confClass = styles.highConf;
              if (confLevel.toLowerCase() === "low") confClass = styles.lowConf;

              return (
                <tr key={r.id}>
                  <td className={styles.fileNameCell}>
                    <FileText size={16} color="#7e0000" style={{marginRight: '8px'}} /> 
                    {r.resume_file?.split('/').pop()}
                  </td>
                  <td><span className={styles.scorePill}>{r.score}%</span></td>
                  <td>
                    <span className={`${styles.confBadge} ${confClass}`}>
                      {confLevel}
                    </span>
                  </td>
                  <td className={styles.blackText}>
                    {r.experience_years > 0 ? `${r.experience_years} Yrs` : "Entry Level"}
                  </td>
                  <td className={styles.actionBtns}>
                    {/* Changed onClick to open Modal */}
                    <button onClick={() => setSelectedResume(r)}>
                      <Eye size={18} color="#000000"/>
                    </button>
                    <button onClick={() => handleDelete(r.id)}
                     className={styles.deleteBtn} > <Trash2 size={18} color="#b40101"/></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- FLOATING BLUR MODAL --- */}
      {selectedResume && (
        <div className={styles.modalOverlay} onClick={() => setSelectedResume(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Resume Preview</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedResume(null)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {/* Using an iframe to show the PDF/File */}
              <iframe 
                src={selectedResume.resume_file.startsWith('http') 
                  ? selectedResume.resume_file 
                  : `http://127.0.0.1:8000${selectedResume.resume_file}`} 
                title="Resume Preview"
                className={styles.resumeIframe}
              />
              <div className={styles["aiDetails"]}>
                 <h4>AI Analysis</h4>
                 <h3><strong color="black">Score:</strong> {selectedResume.score}%</h3>
                 <p><strong>Reasoning:</strong> {selectedResume.analysis_reason || "No specific reasoning provided."}</p>

                 <hr className={styles["divider"]} />

                 {/* UPDATE SCORE SECTION */}
                  <div className={styles["actionSection"]}>
                    <label>Edit Score:</label>
                    <div className={styles["inputGroup"]}>
                      <input 
                        type="text" 
                        placeholder={selectedResume.score}
                        value={newScore}
                        onChange={(e) => setNewScore(e.target.value)}
                        className={styles["scoreInput"]}
                      />
                      <button 
                        onClick={() => handleUpdateScore(selectedResume.id)}
                        className={styles["updateBtn"]}
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  {/* DELETE SECTION */}
                    <button 
                      onClick={() => handleDelete(selectedResume.id)}
                      className={styles.modalDeleteBtn}
                    >
                      <Trash2 size={16} /> Delete Resume
                    </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BatchData;