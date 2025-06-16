import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const endpoint = isLogin ? 'login' : 'register';

    try {
      const res = await fetch(`http://localhost:3000/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('role', data.role);
          navigate(data.role === 'admin' ? '/admin' : '/courses');
        } else {
          setMessage('Account created! You can now log in.');
          setIsLogin(true);
        }
      } else {
        setMessage(data.message || 'Something went wrong');
      }
    } catch (err) {
      setMessage('Network error');
    }
  };

  return (
    <div className="auth-page">
  <div className="logo-container">
  <h1 className="logo">
    <img
      src="https://cdn-icons-png.flaticon.com/512/3524/3524659.png"
      alt="Laptop Logo"
      className="logo-icon"
    />
    CoursesTracker
  </h1>
</div>

  <div className="auth-container">
        <h2>{isLogin ? 'Login to your account' : 'Create a new account'}</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {isLogin ? 'Login' : 'Register'}
        </button>

        <p className="toggle" onClick={() => {
          setIsLogin(!isLogin);
          setMessage('');
        }}>
          {isLogin
            ? "Don't have an account? Register here"
            : "Already have an account? Login here"}
        </p>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};
