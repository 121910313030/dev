import React from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Search, CheckCircle, Brain } from "lucide-react";
import styles from "./Home.module.css";

const Home = () => {

  const navigate = useNavigate();

  return (
    <div className={styles["home-container"]}>

      {/* HERO SECTION */}
      <section className={styles["hero"]}>
        <h1 className={styles["hero-title"]}>
          AI Resume Analyzer
        </h1>

        <p className={styles["hero-subtitle"]}>
          Upload resumes and let AI automatically analyze, extract skills,
          compare with job descriptions, and shortlist the best candidates.
        </p>

        <button
          className={styles["hero-btn"]}
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </section>


      {/* FEATURES SECTION */}
      <section className={styles["features"]}>

        <h2 className={styles["section-title"]}>
          Powerful Resume Intelligence
        </h2>

        <div className={styles["feature-grid"]}>

          <div className={styles["feature-card"]}>
            <Upload size={40} />
            <h3>Upload Resumes</h3>
            <p>
              Upload multiple resumes in PDF format and process them instantly.
            </p>
          </div>

          <div className={styles["feature-card"]}>
            <Brain size={40} />
            <h3>Job Description Matching</h3>
            <p>
              Compare candidate resumes with job descriptions and calculate
              match scores.
            </p>
          </div>

          <div className={styles["feature-card"]}>
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
      <section className={styles["steps"]}>

        <h2 className={styles["section-title"]}>
          How It Works
        </h2>

        <div className={styles["steps-grid"]}>

          <div className={styles["step"]}>
            <span>1</span>
            <p>Upload candidate resumes</p>
          </div>

          <div className={styles["step"]}>
            <span>2</span>
            <p>Upload Job Description</p>
          </div>

          <div className={styles["step"]}>
            <span>3</span>
            <p>AI analyzes and extracts skills</p>
          </div>

          <div className={styles["step"]}>
            <span>4</span>
            <p>View ranked candidates instantly</p>
          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className={styles["home-footer"]}>
        <p>© 2026 AI Resume Analyzer</p>
      </footer>

    </div>
  );
};

export default Home;