import React, { useState } from "react";
import "../css/Login.css";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("adminEmail", data.email || email);
        navigate("/home");
      } else {
        alert(data.message || "Invalid login");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Unable to reach the login server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="login-centered">
        <div className="login-card">
         <div className="login-left">
  <div className="login-left">
  <div className="login-form-card">
    <div className="login-header">
      <span className="login-badge">Admin Portal</span>

      <h1>
        Hello, <span>Ms. Fathima</span>
        <span className="wave">👋</span>
      </h1>

      <p>
        Sign in to manage classes, schedules, and student updates.
      </p>
    </div>

    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          className="form-input"
          placeholder="admin@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          className="form-input"
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </div>

      <div className="form-options">
        <label className="checkbox-label">
          <input type="checkbox" />
          <span>
            I agree the <span className="terms-link">Terms</span> and{" "}
            <span className="terms-link">Privacy</span>
          </span>
        </label>

        
      </div>

      <button type="submit" className="btn" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  </div>
</div>
</div>
          <div className="login-right">
            <img
              src="https://c.animaapp.com/mhc7qo5ywWFP2V/img/vector.png"
              alt="Physics login illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
