import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Users, BarChart3 } from 'lucide-react';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get('http://localhost:8000/api/admin/overview/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (error) {
            console.error("Fetch Error:", error.response);
            if (error.response?.status === 403) {
                alert("Access Denied: Your account is not marked as Staff.");
            } else {
                alert("Server Error: Check backend console.");
            }
        }
    };
    fetchAdminData();
    }, []);

    if (!data) return <div className={styles.loader}>Loading Admin Insights...</div>;

    return (
        <div className={styles["adminPage"]}>
            <div className={styles["header"]}>
                <h2><ShieldCheck size={28} /> Admin Oversight</h2>
                <p>Monitoring system-wide resume scoring and batch processing.</p>
            </div>

            {/* Quick Stats Cards */}
            <div className={styles["statsGrid"]}>
                <div className={styles["card"]}>
                    <Users size={20} />
                    <span>Total Resumes</span>
                    <h3>{data.stats.total_processed}</h3>
                </div>
                <div className={styles["card"]}>
                    <BarChart3 size={20} />
                    <span>Avg Match Rate</span>
                    <h3>{data.top3[0]?.score || 0}%</h3>
                </div>
            </div>

            <div className={styles["contentLayout"]}>
                {/* Batch History Table */}
                <div className={styles["tableSection"]}>
                    <h3>Batch Processing Logs</h3>
                    <table className={styles["solidTable"]}>
                        <thead>
                            <tr>
                                <th>Batch ID</th>
                                <th>Processed By</th>
                                <th>Timestamp</th>
                                <th>Resumes</th>
                                <th>Avg Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.batches.map(batch => (
                                <tr key={batch.id}>
                                    <td>#{batch.id}</td>
                                    <td className={styles.userTag}>{batch.processed_by}</td>
                                    <td>{batch.date}</td>
                                    <td>{batch.count}</td>
                                    <td>{batch.avg_score}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Global Top 3 Sidebar */}
                <div className={styles.sidebarSection}>
                    <h3>System Top 3</h3>
                    {data.top3.map((c, i) => (
                        <div key={i} className={styles.topCandidateCard}>
                            <div className={styles.rankBadge}>{i + 1}</div>
                            <div className={styles.info}>
                                <strong>{c.name}</strong>
                                <small>By: {c.processed_by}</small>
                            </div>
                            <div className={styles.score}>{c.score}%</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;