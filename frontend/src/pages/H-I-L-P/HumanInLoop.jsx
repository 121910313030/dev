import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styles from './HumanInLoop.module.css';
import Overview from "./Overview";
import RecentActivity from "./RecentActivity";
import BatchData from "./BatchData";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, History, LogOut, Bot, ChevronLeft } from "lucide-react";

const HumanInLoop = ({onLogout}) => {
  const navigate = useNavigate();
  
  const [batches, setBatches] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // overview, activity, batch-details
  const [selectedBatchId, setSelectedBatchId] = useState(null);


  const handleLogout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("user_details");

    if (onLogout) onLogout();
    navigate("/login");
  };

  useEffect(() => {
  const fetchBatches = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/batches/");
      setBatches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchBatches();
}, []);

  const openBatchDetails = (id) => {
    setSelectedBatchId(id);
    setActiveTab("batch-details");
  };

  return (
    <div className={styles.appContainer}>
      <aside className={styles.sidebar}>
        <Link to="/dashboard" className={styles["hero-back-btn"]}><ChevronLeft size={20} />Back</Link>
        <div className={styles.logo}><Bot size={28} color="#232ce0" /><span className={styles["logo-text"]}>AI Resume</span></div>
        <nav className={styles["navMenu"]}>
          <button className={activeTab === 'overview' ? styles.active : ''} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={20} /> Overview
          </button>
          <button className={activeTab === 'activity' || activeTab === 'batch-details' ? styles.active : ''} onClick={() => setActiveTab('activity')}>
            <History size={20} /> Recent Activity
          </button>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}><LogOut size={18} /> Logout</button>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topBar}><div className={styles.userProfile}>SY</div></header>
        
        <div className={styles.pageBody}>
          {activeTab === "overview" && <Overview batches={batches} setTab={setActiveTab} />}
          {activeTab === "activity" && <RecentActivity batches={batches} onBatchClick={openBatchDetails} />}
          {activeTab === "batch-details" && <BatchData batchId={selectedBatchId} onBack={() => setActiveTab("activity")} />}
        </div>
      </main>
    </div>
  );
};

HumanInLoop.propTypes = {
  onLogout: PropTypes.func,
};

export default HumanInLoop;