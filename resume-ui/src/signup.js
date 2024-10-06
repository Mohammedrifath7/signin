import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import { auth } from './Backend/firebase/firebase'; // Adjust this import based on your structure
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; 
import './App.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: email, password, role, accessToken }),
      });

      const data = await response.json();

      if (response.status === 200) {
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // You may want to store user information or handle redirection here
      console.log(user);
      navigate('/'); // Redirect after successful sign-up
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

          {/* Show access token input only if role is "admin" */}
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
            </div>
          )}

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="forgot-password">
            <Link to="/">Already have an account? Click Here</Link>
          </div>
          <button type="submit" className="signin-btn">Sign up</button>
          <button 
            type="button" 
            onClick={handleGoogleSignIn} 
            className="signin-btn"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
