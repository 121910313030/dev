import React from "react";
import styles from './RecentActivity.module.css';
import { FileText } from "lucide-react";

const RecentActivity = ({ batches, onBatchClick }) => (
  <section className={styles["fadeUp"]}>
    <h2 className={styles["welcomeText"]}>Recent Activities</h2>
    <div className={styles["batchGrid"]}>
      {batches.length > 0 ? batches.map((batch) => (
        <div key={batch.id} className={styles["batchCard"]} onClick={() => onBatchClick(batch.id)}>
          <div className={styles["batchIcon"]}><FileText color="#e81010" size={24}/></div>
          <div className={styles["batchMeta"]}>
            <h4>Batch Analysis #{batch.id}</h4>
            <p>{batch.date} • {batch.time}</p>
          </div>
        </div>
      )) : <p className={styles["blackText"]}>No batches found.</p>}
    </div>
  </section>
);

export default RecentActivity;