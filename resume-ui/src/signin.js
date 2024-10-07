import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function Signin() {
  const [nameOrEmail, setNameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nameOrEmail, password }),
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
            <label htmlFor="nameOrEmail">Username or Email</label>
            <input
              type="text"
              id="nameOrEmail"
              placeholder="Enter your username or email"
              required
              value={nameOrEmail}
              onChange={(e) => setNameOrEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="forgot-password">
            <a href="/">Forgot password?</a>
          </div>
          <div className="forgot-password">
            <Link to="/signup">Don't have an account? Create here</Link>
          </div>
          <button type="submit" className="signin-btn">Sign in</button>
        </form>
      </div>
    </div>
  );
}

export default Signin;