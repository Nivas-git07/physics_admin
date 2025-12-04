import React, { useState } from "react";
import "../css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../logincomponents/auth";

export default function LoginForm({ onSubmit }) {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleback = () => {
    navigate("/home");   // Redirect to event page after login
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      // ❌ YOUR MISTAKE EARLIER: token not saved
      // ✅ FIX: Save token here
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("TOKEN SAVED:", data.token);

        handleback(); // redirect after login
      } else {
        alert("Invalid login");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="page-container">
      <div className="login-centered">
        <div className="login-card">
          <div className="login-left">
            <h1>
              Hello Fathima MS <span className="wave">👋</span>
            </h1>
            

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="signup-input"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder=". . . . . . . . "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" /> I agree the{" "}
                  <a href="#" className="terms-link">Terms</a> and{" "}
                  <a href="#" className="terms-link">Privacy</a>
                </label>

                <Link to="/forget_password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="btn">
                Sign In
              </button>

              <Auth />
            </form>
          </div>

          <div className="login-right">
            <img
              src="https://c.animaapp.com/mhc7qo5ywWFP2V/img/vector.png"
              alt="illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
