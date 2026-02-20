import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Login.css';


const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Basic empty validation
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
 
    // Dummy login credentials
    if (email === "suryayenumula@gmail.com" && password === "123456789") {
      navigate('/dashboard'); // must match route exactly
    } else {
      alert("Login Failed! Invalid email or password.");
    }
  };

  return (
    <div className="auth-wrapper crimson-theme">
      <div className="red-glow-1"></div>
      <div className="red-glow-2"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="crimson-login-card"
      >
        <header className="login-header">
          <div className="crimson-badge" style={{ fontWeight: '900', color: 'white' }}>
            AI
          </div>
          <h1 className="logo-text-inline">Resume Analyser</h1>
          <p className="portal-subtitle">
            AI-Powered Resume Screening and Insights
          </p>
        </header>

        <div className="login-form">
          <div className="crimson-input-group">
            <label>Professional Email</label>
            <input
              type="email"
              placeholder="recruiter@agency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="crimson-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button className="btn-primary-crimson" onClick={handleLogin}>
          Sign-In
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
