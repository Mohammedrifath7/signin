import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';  
import { auth } from './Backend/firebase/firebase'; // Adjust this import based on your structure
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'; 
import './App.css';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to /user
        setUserLoggedIn(true);
        navigate('/user'); // Redirect to user dashboard
      }
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: email, password, role }),
      });

      const data = await response.json();

      if (response.status === 200) {
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setIsSigningIn(true);

    try {
      const result = await signInWithPopup(auth, provider);
      // You can get the user's info from the result
      const user = result.user;
      console.log(user); // Use this to redirect or store user data
      // Redirect logic based on user role can be added here
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSigningIn(false);
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
        <h2>Sign in</h2>
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="forgot-password">
            <a href="/">Forgot password?</a>
          </div>
          <div className="forgot-password">
            <Link to="/signup">Don't have an account? Create here</Link>
          </div>
          <button type="submit" className="signin-btn">Sign in</button>
          <button 
            type="button" 
            onClick={handleGoogleSignIn} 
            className={`signin-btn ${isSigningIn ? 'disabled' : ''}`}
            disabled={isSigningIn}
          >
            {isSigningIn ? 'Signing In...' : 'Continue with Google'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signin;
