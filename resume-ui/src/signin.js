import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './App.css';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get the user's role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userRole = userDoc.data().role;

        // Navigate to the correct page based on role
        if (userRole === role) {
          if (role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/user');
          }
        } else {
          setError('Invalid login details for the selected role');
        }
      } else {
        setError('User document not found in Firestore');
      }
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
        <h2>Sign in</h2>
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
          <button type="submit" className="signin-btn">Sign in</button>
        </form>
        <Link to="/signup">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
}

export default Signin;
