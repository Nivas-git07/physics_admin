import React, { useState } from "react";
import "../css/Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Auth from "../logincomponents/auth";

export default function SignupForm({ onSubmit }) {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirm = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // Your submission logic
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
      navigate(`/otp-verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    
    <div className="page-container">
      <div className="login-centered">
        <div className="login-card">
          <div className="login-left">
            <h1>
              Create Account <span className="wave">🎉</span>
            </h1>
            <p className="subtext">
              Already have an account?{" "}
              <Link to="/" className="link">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  className="signup-input"
                  type="email"
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
                  placeholder=". . . . . . . ."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                className="form-input"
                  type="password"
                  placeholder=". . . . . . . ."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && (
                  <p className="error">{errors.confirmPassword}</p>
                )}
              </div>

              {/* ✅ Terms checkbox */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" /> I agree the{" "}
                  <a href="#" className="terms-link">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="terms-link">
                    Privacy
                  </a>
                </label>
              </div>

              <button type="submit" className="btn">
                Sign Up
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