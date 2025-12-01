import React, { useState } from "react";
import "../css/ConfirmPassword.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

export default function ConfirmPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const  [error,seterror] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
  const queryparams = new URLSearchParams(location.search);
  const email = queryparams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newerror ={};
    console.log("working ");

   if(!newPassword) newerror.newPassword = "New password is required";

   if(!confirmPassword) newerror.newPassword = "New password is required";

    if (newPassword.length < 8) {
      newerror.newPassword = "Password must be at least 8 characters";
    }

    if (newPassword !== confirmPassword) {
       newerror.newPassword = "New password and confirm password do not match";
    }

    
        if(Object.keys(newerror).length > 0){
            seterror(newerror);
            return ;
        }
         
        seterror({});
         try{
          console.log(email,newPassword,"workgnn");
            const respone = await fetch("http://localhost:5000/confrom-password",{
                "method": "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({email,newPassword}),
            });
            if(respone.status === 200 || respone.status === 201 || respone.status === 202){
                navigate("/");
            }

        }
        catch(error){
            console.log(error);
        }
  };

  return (
    <div className="confirm-container">
      <div className="confirm-card">
        {/* LEFT SECTION */}
        <div className="confirm-left">
          <h1 className="logo">
            🌿 <span>Alsana</span>
          </h1>

          <h2 className="confirm-title">Set New Password</h2>
          <p className="confirm-subtext">
            Please enter your new password below to secure your account.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="confirm-input"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="confirm-input"
              />
            </div>

            <p className="password-note">
              Must be at least <b>8 characters</b> long.
            </p>

            <button type="submit" className="update-btn">
              Update Password
            </button>

            <p className="footer-text">
              Remembered your password?{" "}
              <Link to="/" className="signin-link">
                Sign In
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT SECTION */}
        <div className="confirm-right">
          <img
            src="https://c.animaapp.com/mhc7qo5ywWFP2V/img/vector.png"
            alt="illustration"
          />
        </div>
      </div>
    </div>
  );
}
