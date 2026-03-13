// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import './Signup.css';

// const Signup = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!email || !password) {
//       setError('Email and password are required');
//       return;
//     }

//     try {
//       const res = await fetch('http://localhost:8000/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         setSuccess('Signup successful! Redirecting to login...');
//         setTimeout(() => navigate('/login'), 2000); 
//       } else {
//         setError(data.message || 'Signup failed');
//       }
//     } catch (err) {
//       setError('Server error. Try again.');
//     }
//   };

//   return (
//     <div className="auth-wrapper">
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSignup}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         {error && <p className="error-text">{error}</p>}
//         {success && <p className="success-text">{success}</p>}
//         <button type="submit">Sign Up</button>
//         <p>
//             Existing User? <Link to="/login">Login</Link>
//       </p>
//       </form>
      
//     </div>
//   );
// };

// export default Signup;