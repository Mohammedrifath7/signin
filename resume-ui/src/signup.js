import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import './App.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role
      });

      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="left-panel">
        <h2>Create a resume you are proud of</h2>
      </div>
      <div className="right-panel">
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="signin-btn">Sign up</button>
        </form>
        <Link to="/">Already have an account? Sign in</Link>
      </div>
    </div>
  );
}

export default Signup;
