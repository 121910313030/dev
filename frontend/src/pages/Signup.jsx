import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Signup.module.css";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      await axios.post("http://localhost:8000/signup/", {
        email,
        password,
      });
      setSuccess("Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className={styles["pageContainer"]}>
      <div className={styles["cardBox"]}>
        <h2 className={styles["title"]}>Create Account</h2>

        <form onSubmit={handleSignup} className={styles["formStack"]}>
          <div className={styles["fieldBlock"]}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles["fieldBlock"]}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className={styles["errorMsg"]}>{error}</p>}
          {success && <p className={styles["successMsg"]}>{success}</p>}

          <button className={styles["primaryBtn"]} type="submit">
            Sign Up
          </button>

          <p className={styles["bottomText"]}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;