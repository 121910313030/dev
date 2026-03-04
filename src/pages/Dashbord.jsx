import { useState, useRef } from 'react';
import { Upload, FileText, LogOut, CheckCircle, Search, AlertCircle, Star } from 'lucide-react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const [dragActive, setDragActive] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  const [files, setFiles] = useState({ csv: null, jd: null });
  const [rawFiles, setRawFiles] = useState({ csv: null, jd: null });
  
  const [loading, setLoading] = useState(false);

  const csvInputRef = useRef(null);
  const jdInputRef = useRef(null);

  const [candidates, setCandidates] = useState([
    { id: 1, name: "Alice Johnson", score: 95, skills: ["React", "Django"], justification: "Excellent match." },
    { id: 2, name: "Bob Smith", score: 89, skills: ["Python", "AI"], justification: "Strong backend." },
  ]);

  const rankedCandidates = [...candidates].sort((a, b) => b.score - a.score);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  // Logic to handle file selection
  const processFile = (file, type) => {
    if (file) {
      setRawFiles(prev => ({ ...prev, [type]: file }));
      setFiles(prev => ({ ...prev, [type]: file.name }));
    }
  };

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
    processFile(e.dataTransfer.files[0], type);
  };

  const handleFileSelect = (e, type) => {
    processFile(e.target.files[0], type);
  };

  const handleshortlist = async () => {
    if (!rawFiles.csv || !rawFiles.jd) {
      alert("Please upload both a Resume and a Job Description.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    // 'resume_file' matches the name in your Django request.FILES.get('resume_file')
    formData.append('resume_file', rawFiles.csv);
    formData.append('jd_text', rawFiles.jd);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/resumes', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        alert("Analysis complete!");
        setFiles({ csv: null, jd: null })


        // If your backend returns the new list, update it here:
        // setCandidates(data.candidates); 
      } else {
        alert("Server error during sanalysis.");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Could not connect to Django backend. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-root">
      <div className="hub-container">
        
        {/* Sidebar */}
        <aside className="crimson-panel sidebar">
          <div className="upload-section">
            <div className="resume-analyser-title">
              <h3>Resume Analyser</h3>
            </div>

            <span className="section-label">System Inputs</span>

            {/* Resume Upload Box */}
            <div 
              className={`crimson-drop-zone ${dragActive === 'csv' ? 'active' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'csv')}
              onDragOver={(e) => handleDrag(e, 'csv')}
              onDragLeave={(e) => handleDrag(e, 'csv')}
              onDrop={(e) => handleDrop(e, 'csv')}
              onClick={() => csvInputRef.current.click()}
            >
              {files.csv ? <CheckCircle color="#10b981" /> : <Upload size={20} color="#ef4444" />}
              <p>{files.csv ? "File Loaded" : "Upload Resume (PDF)"}</p>
              <span>{files.csv || "Click or Drag File"}</span>
            </div>
            <input type="file" ref={csvInputRef} style={{ display: "none"}} onChange={(e) => handleFileSelect(e, 'csv')} />

            {/* JD Upload Box */}
            <div 
              className={`crimson-drop-zone ${dragActive === 'jd' ? 'active' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'jd')}
              onDragOver={(e) => handleDrag(e, 'jd')}
              onDragLeave={(e) => handleDrag(e, 'jd')}
              onDrop={(e) => handleDrop(e, 'jd')}
              onClick={() => jdInputRef.current.click()}
            >
              {files.jd ? <CheckCircle color="#10b981" /> : <FileText size={20} color="#951111" />}
              <p>{files.jd ? "JD Loaded" : "Upload Job Description"}</p>
              <span>{files.jd || "Click or Drag File"}</span>
            </div>
            <input type="file" ref={jdInputRef} style={{ display: "none" }} onChange={(e) => handleFileSelect(e, 'jd')} />

            <button 
              className="btn-generate-crimson" 
              onClick={handleshortlist}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Shortlist The Candidates"}
            </button>
          </div>

          <button className="btn-logout-crimson" onClick={handleLogout}>
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
              <div key={c.id} className="candidate-card crimson-panel" style={{ marginBottom: "1rem", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0 }}>#{index + 1} {c.name}</h3>
                    <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Skills: {c.skills.join(", ")}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                      <Star size={16} color="#facc15" />
                      <span>{c.score}%</span>
                    </div>
                    <button className="btn-generate-crimson" style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }} onClick={() => setSelectedCandidate(c)}>
                      View Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Analytics Panel */}
        <aside className="crimson-panel analytics">
          <h3>ATS Intelligence</h3>
          {selectedCandidate ? (
            <div style={{ marginTop: "1rem" }}>
              <h4>{selectedCandidate.name}</h4>
              <p><strong>Rank Score:</strong> {selectedCandidate.score}%</p>
              <p style={{ marginTop: "1rem", color: "#cbd5e1" }}>{selectedCandidate.justification}</p>
            </div>
          ) : (
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <AlertCircle size={40} color="#27272a" />
              <p>Select a candidate to see AI justification.</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;