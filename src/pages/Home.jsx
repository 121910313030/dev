import React from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Search, CheckCircle, Brain } from "lucide-react";
import "./Home.css";

const Home = () => {

  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* HERO SECTION */}
      <section className="hero">
        <h1 className="hero-title">
          AI Resume Analyzer
        </h1>

        <p className="hero-subtitle">
          Upload resumes and let AI automatically analyze, extract skills,
          compare with job descriptions, and shortlist the best candidates.
        </p>

        <button
          className="hero-btn"
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </section>


      {/* FEATURES SECTION */}
      <section className="features">

        <h2 className="section-title">
          Powerful Resume Intelligence
        </h2>

        <div className="feature-grid">

          <div className="feature-card">
            <Upload size={40} />
            <h3>Upload Resumes</h3>
            <p>
              Upload multiple resumes in PDF format and process them instantly.
            </p>
          </div>

          <div className="feature-card">
            <Brain size={40} />
            <h3>Job Description Matching</h3>
            <p>
              Compare candidate resumes with job descriptions and calculate
              match scores.
            </p>
          </div>

          <div className="feature-card">
            <CheckCircle size={40} />
            <h3>Smart Shortlisting</h3>
            <p>
              Quickly identify the best candidates based on skills and
              relevance.
            </p>
          </div>

        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="steps">

        <h2 className="section-title">
          How It Works
        </h2>

        <div className="steps-grid">

          <div className="step">
            <span>1</span>
            <p>Upload candidate resumes</p>
          </div>

          <div className="step">
            <span>2</span>
            <p>Upload Job Description</p>
          </div>

          <div className="step">
            <span>3</span>
            <p>AI analyzes and extracts skills</p>
          </div>

          <div className="step">
            <span>4</span>
            <p>View ranked candidates instantly</p>
          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="home-footer">
        <p>© 2026 AI Resume Analyzer</p>
      </footer>

    </div>
  );
};

export default Home;