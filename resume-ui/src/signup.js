import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import './App.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, email, password, role, accessToken }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Redirect to sign-in page after successful signup
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
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
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Enter your username" 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

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
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              placeholder="Confirm your password" 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
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
        </form>
      </div>
    </div>
  );
}

export default Signup;