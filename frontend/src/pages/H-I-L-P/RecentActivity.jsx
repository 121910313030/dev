import styles from './RecentActivity.module.css';
import PropTypes from 'prop-types';
import { FileText } from "lucide-react";

const RecentActivity = ({ batches, onBatchClick }) => (
  <section className={styles["fadeUp"]}>
    <h2 className={styles["welcomeText"]}>Recent Activities</h2>
    <div className={styles["batchGrid"]}>
      {batches.length > 0 ? batches.map((batch) => (
        <button 
          key={batch.id} 
          className={styles["batchCard"]} 
          onClick={() => onBatchClick(batch.id)}
          type="button"
          aria-label={`View batch ${batch.id}`}
        >
          <div className={styles["batchIcon"]}><FileText color="#991b1b" size={24}/></div>
          <div className={styles["batchMeta"]}>
            <h4>Batch Analysis #{batch.id}</h4>
            <p>{batch.date} • {batch.time}</p>
          </div>
        </button>
      )) : <p className={styles["blackText"]}>No batches found.</p>}
    </div>
  </section>
);

RecentActivity.propTypes = {
  batches: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    date: PropTypes.string,
    time: PropTypes.string,
  })).isRequired,
  onBatchClick: PropTypes.func.isRequired,
};

export default RecentActivity;