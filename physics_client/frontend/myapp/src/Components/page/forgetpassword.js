import React, { useState } from "react";
import "../css/ForgotPassword.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Handle Submit triggered!");

    if (!email) {
      setError({ email: "Email is required" });
      return;
    }

    setError({});

    try {
      console.log("Sending request to backend...");

      const response = await fetch("http://localhost:5000/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const dat = await response.json();
      console.log(dat);

      console.log("Raw response:", response);

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("Parsed data:", data);

      if (response.ok) {
        console.log("Navigation happening...");
        navigate(`/Otp-verify?email=${encodeURIComponent(email)}`);
      } else {
        alert("Email not found or server error!");
      }

    } catch (error) {
      console.error("Frontend error:", error);
      alert("Cannot connect to the server!");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">

        <div className="forgot-left">
          <h1 className="logo">
            🌿 <span>Alsana</span>
          </h1>

          <h2 className="forgot-title">Forgot Password?</h2>
          <p className="forgot-subtext">Please enter your email address to reset your password.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="forgot-input"
              />

              {error.email && <span className="error-text">{error.email}</span>}
            </div>

            <button type="submit" className="reset-btn">Reset Password</button>

            <p className="footer-text">
              Don’t have an account?{" "}
              <Link to="/sign" className="signup-link">Sign Up</Link>
            </p>
          </form>
        </div>

        <div className="forgot-right">
          <img
            src="https://c.animaapp.com/mhc7qo5ywWFP2V/img/vector.png"
            alt="illustration"
          />
        </div>
      </div>
    </div>
  );
}
