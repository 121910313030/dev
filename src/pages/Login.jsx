import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home as HomeIcon , Loader2} from "lucide-react";
import styles from './Login.module.css';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // --- NEW: Instant Error Clearing Logic ---
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (emailError) setEmailError('');
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (passwordError) setPasswordError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let valid = true;

    // Reset errors before validation
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is Required");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is Required");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/login/", {
        email: email,
        password: password
      });

      if (response.status === 200 || response.status === 201) {
        // FIX: Match your Django view structure {"tokens": {"access": "...", "refresh": "..."}}
        const { access, refresh } = response.data.tokens;

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response) {
        const data = err.response.data;
        
        // Map backend errorType to frontend state
        if (data.errorType === 'email') {
          setEmailError(data.message || "No Account found with this Email");
        } else if (data.errorType === 'password') {
          setPasswordError("Invalid Password");
          console.log(data.message)
        } else {
          setPasswordError(data.message || "Invalid credentials");
        }
      } else {
        setPasswordError("Server error. Try again later");
      }
    }finally {
    setLoading(false); // ✅ Stop the loader (even if it fails)
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

        <form className={styles["login-form"]} onSubmit={handleLogin}>
          <div className={styles["crimson-input-group"]}>
            <label>Email</label>
            <input
              type="email"
              placeholder="recruiter@agency.com"
              value={email}
              onChange={handleEmailChange} // Using new handler
            />
            {emailError && <p className={styles["error-text"]}>{emailError}</p>}
          </div>

          <div className={styles["crimson-input-group"]}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange} // Using new handler
            />
            {passwordError && <p className={styles['error-text']}>{passwordError}</p>}
          </div>

          <button 
            className={styles["btn-primary-crimson"]} 
            type="submit" 
            disabled={loading} // Disable button so they can't click twice
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Loader2 className={styles.spinner} size={20} /> 
                <span>Logging In...</span>
              </div>
            ) : (
              "LogIn"
            )}
          </button>
          
          <p className={styles["bottomText"]}>
            Doesn't have an account? <Link to="/signup">Signup</Link>
          </p>
          
          <p className={styles["bottomTextHome"]}>
            <Link to="/" className={styles["home-link"]}>
              <HomeIcon size={35} style={{ marginRight: "1px", marginTop: "4px" }} />
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;