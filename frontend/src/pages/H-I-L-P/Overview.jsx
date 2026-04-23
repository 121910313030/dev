import styles from './Overview.module.css';
import PropTypes from 'prop-types';
import { LayoutDashboard, FileText, TrendingUp, CheckCircle } from "lucide-react";

const Overview = ({ batches, setTab }) => {
  const totalResumes = batches.reduce((sum, b) => {
    const count = Number.parseInt(b.resume_count) || 0;
    return sum + count;
  }, 0);

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
        <div className={styles.attentionHeader}><CheckCircle size={20} color="#991b1b" /><h4>Items that need attention</h4></div>
        <p className={styles.blackText}>All your recent batches have been analyzed.</p>
        <button className={styles.viewLink} onClick={() => setTab('activity')}>View Recent Activity →</button>
      </div>
    </div>
  );
};

Overview.propTypes = {
  batches: PropTypes.arrayOf(PropTypes.shape({
    resume_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  setTab: PropTypes.func.isRequired,
};

export default Overview;