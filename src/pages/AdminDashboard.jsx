// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import styles from "./AdminDashboard.module.css";
// import { Link } from "react-router-dom";
// import { 
//   Eye, Trash2, FileText, LayoutDashboard, 
//   History, LogOut, TrendingUp, CheckCircle, 
//   Bot, ChevronLeft 
// } from "lucide-react";

// const AdminDashboard = () => {
//   const [batches, setBatches] = useState([]);
//   const [selectedBatchId, setSelectedBatchId] = useState(null);
//   const [resumes, setResumes] = useState([]);
//   const [activeTab, setActiveTab] = useState("dashboard");

//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   const fetchBatches = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/batches/");
//       console.log("Data from Django:", res.data); 
//       setBatches(res.data);
//     } catch (err) {
//       console.error("Connection Error:", err);
//     }
//   };

//   const handleBatchClick = async (batchId) => {
//     try {
//       const res = await axios.get(`http://127.0.0.1:8000/api/resumes/?batch_id=${batchId}`);
//       setResumes(res.data);
//       setSelectedBatchId(batchId);
//       setActiveTab('activity'); 
//     } catch (err) {
//       console.error("Error fetching resumes:", err);
//     }
//   };

//   // Stats for the Overview cards
//   const totalBatches = batches.length;
//   const totalResumes = batches.reduce((sum, batch) => {
//   return sum + (parseInt(batch.resume_count) || 0);
// }, 0);

// const displayAvgScore = batches.length > 0 ? batches[0].avg_score : "0";

// const getConfidence = (score) => {
//   if (score >= 80) return { label: "High", class: styles.highConf };
//   if (score >= 60) return { label: "Medium", class: styles.medConf };
//   return { label: "Low", class: styles.lowConf };
// };

//   return (
//     <div className={styles["appContainer"]}>

//       {/* SIDEBAR */}
//       <aside className={styles["sidebar"]}>
//         <Link to="/dashboard" className={styles["hero-back-btn"]}>
//           <ChevronLeft size={20} />Back
//         </Link>

//         <div className={styles["logo"]}>
//           <Bot size={28} color="#2c34c4" />
//           <span className={styles["logo-text"]}>AI Resume</span>
//         </div>
        
//         <nav className={styles["navMenu"]}>
//           <button 
//             className={activeTab === 'dashboard' ? styles.active : ''} 
//             onClick={() => {setActiveTab('dashboard'); setSelectedBatchId(null);}}
//           >
//             <LayoutDashboard size={20} /> Overview
//           </button>
//           <button 
//             className={activeTab === 'activity' ? styles.active : ''} 
//             onClick={() => {setActiveTab('activity'); setSelectedBatchId(null);}}
//           >
//             <History size={20} /> Recent Activity
//           </button>
//         </nav>

//         <button className={styles["logoutBtn"]}>
//           <LogOut size={18} />  Logout
//         </button>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className={styles["mainContent"]}>
//         <header className={styles["topBar"]}>
//           <div className={styles["userProfile"]}>SY</div>
//         </header>

//         <div className={styles["pageBody"]}>
          
//           {/* --- DASHBOARD OVERVIEW --- */}
//           {activeTab === 'dashboard' && (
//             <div className={styles["fadeUp"]}>
//               <span className={styles["sectionTitle"]}>Today's Highlights</span>
//               <h1 className={styles["welcomeText"]}>Hi, Surya Yenumula</h1>

//               <div className={styles["statsGrid"]}>
//                 <div className={styles["statCard"]}>
//                   <div className={styles["statIconBox"]}><LayoutDashboard size={22} /></div>
//                   <div>

//                     <p className={styles["statLabel"]}>Total Batches</p>
//                     <h3 className={styles["statValue"]}>{totalBatches}</h3>

//                   </div>
//                 </div>

//                 <div className={styles["statCard"]}>
//                   <div className={styles["statIconBox"]}><FileText size={22} /></div>
//                   <div>

//                     <p className={styles["statLabel"]}>Resumes Processed</p>
//                     <h3 className={styles["statValue"]}>{totalResumes}</h3>
                    
//                   </div>
//                 </div>

//                 <div className={styles.statCard}>
//                   <div className={styles["statIconBox"]}><TrendingUp size={22} /></div>
//                   <div>

//                     <p className={styles["statLabel"]}>Avg. AI Score</p>
//                     <h3 className={styles["statValue"]}>74%</h3>

//                   </div>
//                 </div>
//               </div>

//               <div className={styles["attentionSection"]}>
//                 <div className={styles["attentionHeader"]}>
//                   <CheckCircle size={20} color="#000000" />
//                   <h4>Items that need your attention</h4>
//                 </div>
//                 <p className={styles["blackText"]}>
//                   Good job! All your recent batches have been analyzed. 
//                   You can now review the candidate rankings.
//                 </p>
//                 <button className={styles["viewLink"]} onClick={() => setActiveTab('activity')}>
//                   View Recent Activity →
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* --- RECENT ACTIVITY: Floating Batch Grid --- */}
//           {activeTab === 'activity' && !selectedBatchId && (
//             <section className={styles["fadeUp"]}>

//               <h2 className={styles["welcomeText"]}>Recent Activity</h2>

//               <div className={styles["batchGrid"]}>

//                 {batches && batches.length > 0 ? (
//                   batches.map((batch) => (
//                     <div key={batch.id} className={styles["batchCard"]} onClick={() => handleBatchClick(batch.id)}>
//                       <div className={styles["batchIcon"]}><FileText color="#e81010" size={24}/></div>
//                       <div className={styles["batchMeta"]}>
//                         <h4>Batch Analysis #{batch.id}</h4>
//                         <p>{batch.date} • {batch.time}</p>
//                         {/* Add this to verify the count is coming through */}
//                         {/* <small className={styles["count"]}>{batch.resume_count} Resumes</small>  */}
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className={styles["blackText"]}>No batches found in the database.</p>
//                 )}

//               </div>
//             </section>
//           )}
             
//           {/* --- BATCH DETAILS: Original Table UI --- */}
//           {selectedBatchId && activeTab === 'activity' && (
//           <section className={styles["fadeUp"]}>
//             <div className={styles["tableHeader"]}>
//               <button 
//                 onClick={() => setSelectedBatchId(null)} 
//                 className={styles["backLink"]}
//               >
//                 ← Back to Activity
//               </button>
//               <h2 className={styles["welcomeText"]}>Reviewing Batch #{selectedBatchId}</h2>
//             </div>
            
//             {/* THIS WRAPPER ENABLES THE FLOATING SCROLL */}
//             <div className={styles["tableScrollContainer"]}>
//               <table className={styles["modernTable"]}>
//                 <thead>
//                     <tr>
//                       <th style={{ textAlign: 'left' }}>File Name</th>
//                       <th>AI Score</th>
//                       <th>Confidence</th> {/* Make sure this is here! */}
//                       <th>Experience</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                 <tbody>
//                   {resumes.map((r) => {
//                     const conf = getConfidence(r.score);
//                     return (
//                       <tr key={r.id}>
//                         <td className={styles["fileNameCell"]}>
//                           <FileText size={16} color="red" /> {r.resume_file.split('/').pop()}
//                         </td>
//                         <td><span className={styles["scorePill"]}>{r.score}%</span></td>
                        
//                         {/* Confidence Badge Column */}
//                         <td>
//                           <span className={`${styles.confBadge} ${conf.class}`}>
//                             {conf.label}
//                           </span>
//                         </td>

//                         {/* Experience Column - Checks both possible names */}
//                         <td className={styles["blackText"]}>
//                           {/* If experience_years is 0 or null, show 'Fresher' or 'N/A' to distinguish from a bug */}
//                           {r.experience_years > 0 ? `${r.experience_years} Years` : "0-1 Years"}
//                         </td>

//                         <td className={styles["actionBtns"]}>
//                           {/* Open PDF in new tab */}
//                           <button onClick={() => window.open(`http://127.0.0.1:8000${r.resume_file}`, '_blank')}>
//                             <Eye size={18}/>
//                           </button>
//                           <button className={styles["deleteBtn"]}><Trash2 size={18}/></button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//             )}

//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;