import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from './Backend/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import './App.css';

function Signup() {
  const AdminToken = '123456789'; // Predefined Admin Token
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'admin' && accessToken !== AdminToken) {
      setIsTokenValid(false);
    } else {
      setIsTokenValid(true);
    }
  }, [role, accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === 'admin' && accessToken !== AdminToken) {
      setError('Invalid admin access token.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
        role: role,
      });

      setMessage('Signup successful! Please check your email for verification.');
      setTimeout(() => navigate('/verify-email'), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (role === 'admin' && accessToken !== AdminToken) {
        setError('Invalid admin access token.');
        return;
      }

      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
        role: role,
      });

      if (user.emailVerified) {
        navigate('/');
      } else {
        await sendEmailVerification(user);
        navigate('/verify-email');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="left-panel">
        <h2>Create a resume you are proud of</h2>
        <p>Beat the competition using actionable, contextual advice</p>
        <p>Highlight key achievements with memorable visuals</p>
      </div>

      <div className="right-panel">
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="example.email@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter at least 8+ characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {role === 'admin' && (
            <div className="input-group">
              <label htmlFor="accessToken">Admin Access Token</label>
              <input
                type="text"
                id="accessToken"
                placeholder="Enter admin access token"
                required
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
              {!(accessToken==='') && !isTokenValid && <p style={{ color: 'red' }}>Invalid Token Address</p>}
            </div>
          )}

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}
          <div className="forgot-password">
            <Link to="/">Already have an account? Click Here</Link>
          </div>
          <button type="submit" className="signin-btn" disabled={role === 'admin' && !isTokenValid}>
            Sign up
          </button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="signin-btn"
            disabled={role === 'admin' && !isTokenValid}
          >
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
