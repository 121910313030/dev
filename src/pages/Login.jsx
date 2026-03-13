import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Login.css';
// import { ToastContainer,toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();


  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); 

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
      const response = await fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/dashboard/');
      } else {
      
      if (data.errorType === 'email') {
        setEmailError(data.message);
      } else (data.errorType === 'password') 
        setPasswordError(data.message);
        setPasswordError("Invalid Password or Email");
      }
    }

    catch (err) {
      setPasswordError("Server error. Try again later");
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

        {/* FORM ADDED HERE */}
        <form className="login-form" onSubmit={handleLogin}>

          <div className="crimson-input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="recruiter@agency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="error-text">{emailError}</p>}
          </div>

          <div className="crimson-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className='error-text'>{passwordError}</p>}
          </div>

          {/* BUTTON TYPE CHANGED */}
          <button className="btn-primary-crimson" type="submit">
            Sign-In
          </button>
          {/* <p className='signup-link'>
            New user? <Link to="/signup">Sign Up</Link>
          </p> */}
        </form>
      </motion.div> 
    </div>
  );
};

export default Login;