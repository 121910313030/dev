import { useState, useRef } from 'react';
import { Upload, FileText, LogOut, CheckCircle, Search, AlertCircle, Star } from 'lucide-react';
import './Dashboard.css';


const Dashboard = ({ onLogout }) => {
  const [dragActive, setDragActive] = useState(null);
  const [files, setFiles] = useState({ csv: null, jd: null });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const csvInputRef = useRef(null);
  const jdInputRef = useRef(null);

  // Mock Data
  const candidates = [
    { id: 1, name: "Alice Johnson", score: 95, skills: ["React", "Django", "PostgreSQL"], justification: "Excellent match. Strong React + Django experience with 4+ years full-stack development." },
    { id: 2, name: "Bob Smith", score: 89, skills: ["Python", "React", "AI"], justification: "Strong backend + AI exposure. Slightly less frontend depth than top candidate." },
    { id: 3, name: "Charlie Lee", score: 84, skills: ["Django", "SQL", "Node.js"], justification: "Good backend foundation. Limited React exposure reduces match score." },
    { id: 4, name: "Diana Prince", score: 80, skills: ["React", "Machine Learning"], justification: "Strong ML but missing required backend stack experience." },
    { id: 5, name: "Ethan Hunt", score: 77, skills: ["Data Analysis", "Python"], justification: "Data oriented profile. Weak alignment with required frontend skills." },
  ];

  // Sort ranking-wise (Highest first)
  const rankedCandidates = [...candidates].sort((a, b) => b.score - a.score);

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(type);
    else if (e.type === "dragleave") setDragActive(null);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile) setFiles(prev => ({ ...prev, [type]: uploadedFile.name }));
  };

  const handleFileSelect = (e, type) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFiles(prev => ({ ...prev, [type]: selectedFile.name }));
  };

  return (
    <div className="dashboard-root">
      <div className="hub-container">

        {/* Sidebar */}
        <aside className="crimson-panel sidebar">
          
          <div className="upload-section">
            {/* REsume ANlyser Title */}
            <div className = "resume-analyser-title">
              <h3>Resume Analyser</h3>
            </div>

            <span className="section-label">System Inputs</span>

            {/* CSV Upload */}
            <div 
              className={`crimson-drop-zone ${dragActive === 'csv' ? 'active' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'csv')}
              onDragOver={(e) => handleDrag(e, 'csv')}
              onDragLeave={(e) => handleDrag(e, 'csv')}
              onDrop={(e) => handleDrop(e, 'csv')}
              onClick={() => csvInputRef.current.click()}
            >
              {files.csv ? <CheckCircle color="#10b981" /> : <Upload size={20} color="#ef4444" />}
              <p>{files.csv ? "CSV Synced" : "Upload Resume CSV"}</p>
              <span>{files.csv || "Click or Drag File"}</span>
            </div>
            <input type="file" accept=".csv" ref={csvInputRef} style={{ display: "none"}}
              onChange={(e) => handleFileSelect(e, 'csv')} />

            {/* JD Upload */}
            <div 
              className={`crimson-drop-zone ${dragActive === 'jd' ? 'active' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'jd')}
              onDragOver={(e) => handleDrag(e, 'jd')}
              onDragLeave={(e) => handleDrag(e, 'jd')}
              onDrop={(e) => handleDrop(e, 'jd')}
              onClick={() => jdInputRef.current.click()}
            >
              {files.jd ? <CheckCircle color="#10b981" /> : <FileText size={20} color="#ef4444" />}
              <p>{files.jd ? "JD Uploaded" : "Upload Job Description"}</p>
              <span>{files.jd || "Click or Drag File"}</span>
            </div>
            <input type="file" accept=".txt,.pdf,.doc,.docx" ref={jdInputRef} style={{ display: "none" }}
              onChange={(e) => handleFileSelect(e, 'jd')} />

            <button className="btn-generate-crimson">Shortlist The Candidates</button>
          </div>

          <button className="btn-logout-crimson" onClick={onLogout}>
            <LogOut size={16} /> Sign-Out
          </button>
        </aside>

        {/* Main Ranking View */}
        <main className="crimson-panel main-view">
          <header className="view-header">
            <h2>Elite Rankings</h2>
            <div className="search-box">
              <Search size={16} color="#94a3b8" />
              <input type="text" placeholder="Filter candidates..." />
            </div>
          </header>

          <div className="scroll-area">
            {rankedCandidates.map((c, index) => (
              <div key={c.id}
                className="candidate-card crimson-panel"
                style={{ marginBottom: "1rem", padding: "1rem" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  
                  {/* Left Info */}
                  <div>
                    <h3 style={{ margin: 0 }}>
                      #{index + 1} {c.name}
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                      Skills: {c.skills.join(", ")}
                    </p>
                  </div>

                  {/* Right Info */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                      <Star size={16} color="#facc15" />
                      <span>{c.score}%</span>
                    </div>

                    <button
                      className="btn-generate-crimson"
                      style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}
                      onClick={() => setSelectedCandidate(c)}
                    >
                      View Review
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Justification Panel */}
        <aside className="crimson-panel analytics">
          <h3>ATS Intelligence</h3>

          {selectedCandidate ? (
            <div style={{ marginTop: "1rem" }}>
              <h4>{selectedCandidate.name}</h4>
              <p><strong>Rank Score:</strong> {selectedCandidate.score}%</p>
              <p><strong>Matched Skills:</strong> {selectedCandidate.skills.join(", ")}</p>
              <p style={{ marginTop: "1rem", color: "#cbd5e1" }}>
                {selectedCandidate.justification}
              </p>
            </div>
          ) : (
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <AlertCircle size={40} color="#27272a" />
              <p>Click "View Review" to see AI justification.</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;
