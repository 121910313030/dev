import { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home as HomeIcon } from "lucide-react";
import styles from './Login.module.css';
import axios from 'axios';


const Login = () => {
  const navigate = useNavigate();


  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();

  // Reset errors at the start of every attempt
  setEmailError('');
  setPasswordError('');

  let valid = true;

  if (!email) {
    setEmailError("Email is Required");
    valid = false;
  }
  if (!password) {
    setPasswordError("Password is Required");
    valid = false;
  }

  if (!valid) return;

  try {
    const response = await axios.post("http://localhost:8000/login/", {
      email: email,
      password: password
    });

    // If successful
    if (response.status === 200 || response.status === 201) {
      navigate("/dashboard");
    }
  } catch (err) {
    // Axios puts the server response in err.response
    if (err.response) {
      const data = err.response.data;

      // Check if backend sent specific error types
      // Adjust 'errorType' or 'field' based on what your Django backend actually sends
      if (data.errorType === 'email' || data.email) {
        setEmailError(data.message || "Invalid Email Address");
      } 
      else if (data.errorType === 'password' || data.password) {
        setPasswordError(data.message || "Incorrect Password");
      } 
      else {
        // Fallback for general "Invalid Credentials"
        setPasswordError("Invalid email or password");
      }
    } else {
      // Network error or server down
      setPasswordError("Server error. Try again later");
    }
  }
};

  return (
    <div className={`${styles["auth-wrapper"]} ${styles["crimson-theme"]}`}>
      <div className={styles["red-glow-1"]}></div>
      <div className={styles["red-glow-2"]}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles["crimson-login-card"]}
      >
        <header className={styles["login-header"]}>
          <div className={styles["crimson-badge"]} style={{ fontWeight: '900', color: 'white' }}>
            AI
          </div>
          <h1 className={styles["logo-text-inline"]}>Resume Analyser</h1>
          <p className={styles["portal-subtitle"]}>
            AI-Powered Resume Screening and Insights
          </p>
        </header>

        {/* FORM ADDED HERE */}
        <form className={styles["login-form"]} onSubmit={handleLogin}>

          <div className={styles["crimson-input-group"]}>
            <label>Email</label>
            <input
              type="email"
              placeholder="recruiter@agency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className={styles["error-text"]}>{emailError}</p>}
          </div>

          <div className={styles["crimson-input-group"]}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className={styles['error-text']}>{passwordError}</p>}
          </div>

          {/* BUTTON TYPE CHANGED */}
          <button className={styles["btn-primary-crimson"]} type="submit">
            LogIn
          </button>
          <p className={styles["bottomText"]}>
                      Doesn't have an account? <Link to="/signup">Signup</Link>
          </p>
          <p className={styles["bottomTextHome"]}>
            <Link to="/" className={styles["home-link"]}>
              <HomeIcon size={35} style={{ marginRight: "1px", marginTop:"4px" }} /> 
            </Link>
          </p>
        </form>
      </motion.div> 
    </div>
  );
};

export default Login;