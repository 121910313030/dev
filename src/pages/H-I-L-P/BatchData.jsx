import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./BatchData.module.css";
import { Eye, Trash2, FileText } from "lucide-react";

const BatchData = ({ batchId, onBack }) => {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchResumes = async () => {
      const res = await axios.get(`http://127.0.0.1:8000/api/resumes/?batch_id=${batchId}`);
      setResumes(res.data);
    };
    fetchResumes();
  }, [batchId]);

  const getConfidence = (score) => {
    if (score >= 80) return { label: "High", class: styles.highConf };
    if (score >= 60) return { label: "Medium", class: styles.medConf };
    return { label: "Low", class: styles.lowConf };
  };

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
              const conf = getConfidence(r.score);
              return (
                <tr key={r.id}>
                  <td className={styles.fileNameCell}><FileText size={16} color="red" /> {r.resume_file.split('/').pop()}</td>
                  <td><span className={styles.scorePill}>{r.score}%</span></td>
                  <td><span className={`${styles.confBadge} ${conf.class}`}>{conf.label}</span></td>
                  <td className={styles.blackText}>{r.experience_years > 0 ? `${r.experience_years} Years` : "0-1 Years"}</td>
                  <td className={styles.actionBtns}>
                    <button onClick={() => window.open(`http://127.0.0.1:8000${r.resume_file}`, '_blank')}><Eye size={18}/></button>
                    <button className={styles.deleteBtn}><Trash2 size={18}/></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default BatchData;