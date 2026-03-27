import React from "react";
import styles from './Overview.module.css';
import { LayoutDashboard, FileText, TrendingUp, CheckCircle } from "lucide-react";

const Overview = ({ batches, setTab }) => {
  const totalResumes = batches.reduce((sum, b) => sum + (parseInt(b.resume_count) || 0), 0);

  return (
    <div className={styles.fadeUp}>
      {/* <span className={styles.sectionTitle}>Today's Highlights</span> */}
      <h1 className={styles.welcomeText}>Hi, Surya Yenumula</h1>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconBox}><LayoutDashboard size={22} /></div>
          <div><p className={styles.statLabel}>Total Batches</p><h3 className={styles.statValue}>{batches.length}</h3></div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconBox}><FileText size={22} /></div>
          <div><p className={styles.statLabel}>Resumes Processed</p><h3 className={styles.statValue}>{totalResumes}</h3></div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconBox}><TrendingUp size={22} /></div>
          <div><p className={styles.statLabel}>Avg. AI Score</p><h3 className={styles.statValue}>74%</h3></div>
        </div>
      </div>

      <div className={styles.attentionSection}>
        <div className={styles.attentionHeader}><CheckCircle size={20} color="#8f0000" /><h4>Items that need attention</h4></div>
        <p className={styles.blackText}>All your recent batches have been analyzed.</p>
        <button className={styles.viewLink} onClick={() => setTab('activity')}>View Recent Activity →</button>
      </div>
    </div>
  );
};

export default Overview;