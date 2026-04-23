# 🤖 AI Resume Analyser & Job Match

## 📌 Overview

The **AI Resume Analyser & Job Match ** is a web-based application that helps  recruiters evaluate resumes efficiently using Generative AI.

The system analyzes uploaded resumes, compares them with job descriptions, calculates a match percentage, and provides — similar to a real-world Applicant Tracking System (ATS).

---

## 🚀 Problem Statement

In modern recruitment:

- Companies receive hundreds of resumes for each job.
- Manual screening is time-consuming and inconsistent.
- recruiters struggle to understand how well their resume matches a job role.

This project solves these problems using AI-powered resume analysis and job matching.

---

## 🎯 Features

### 📄 Resume Submission
- Upload resumes in **PDF format**
- Provide a job description
- Automatic validation and storage

### 🧠 AI-Based Resume Analysis
- Extracts text from PDF resumes
- Identifies skills and keywords
- Compares resume with job description
- Calculates **Resume-to-Job Match Percentage**

### 📊 Match Result Display
The system shows:
- ✅ Match Percentage
- 🎯 Matched Skills
- ❌ Missing Skills
- 💡 Resume Improvement Suggestions

### 💾 Data Storage
- Stores resumes and analysis results
- Enables future improvements in accuracy

---

## 🏗️ Tech Stack

### 🎨 Frontend
- React.js
- Axios (API communication)

### 🔧 Backend
- Python
- Django
- Django REST Framework

### 🗄️ Database
- PostgreSQL

### 🤖 AI Integration

#### 1️⃣ Resume Text Extraction
- PyPDF2 for extracting text from PDF resumes
- Supports multi-page documents
- Converts resumes into machine-readable text

#### 2️⃣ AI Resume Analysis
- NLP-based keyword extraction
- Semantic similarity comparison
- LLM API integration
- Intelligent skill matching (not just keyword matching)

#### 3️⃣ Job Matching & Scoring
- Calculates overall match percentage
- Identifies:
  - Matched skills
  - Partially matched skills
  - Missing skills

#### 4️⃣ Resume Improvement Suggestions
- Personalized resume improvement recommendations
- Suggests:
  - Missing skills
  - Certifications
  - Project additions
  - Better wording & structure
- Helps optimize resumes for ATS systems

---

## 🏛️ System Architecture

### High-Level Flow

1. User uploads Resume (PDF)
2. User enters Job Description
3. Backend extracts resume text (PyPDF2)
4. AI compares resume with job description
5. System calculates match score
6. Results displayed with suggestions
7. Data stored in PostgreSQL

---

## 📈 Advantages

- ⏳ Saves time
- 🎯 Accurate resume-job matching
- 💡 Provides improvement suggestions
- 💼 Simulates real ATS systems
- 💰 Cost-effective
- 🔍 Reduces manual screening effort

---

