import React, { useState } from "react";
import "../css/OtpVerify.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const OtpVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "",""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
const location = useLocation();
 const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

   useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };
   const handleResend = async  (e) => {
    e.preventDefault();
   }
  
  const handleback=()=>{
    navigate("/sign");
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(paste)) {
      setOtp(paste.split(""));
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleCheck = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setError("Please enter complete OTP");
      return;
    }
console.log(enteredOtp,email);
    try {
      const response = await fetch("https://admin.selfmade.technology/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkotp: enteredOtp, email }),
      });

      const data = await response.json();
      if (response.status ===200) {
       navigate("/"); 
      }
       if(response.status === 201){
        navigate("/confirm_password?email="+email);
      }
           setError("❌ Invalid OTP! Please try again.");
      
    }
     catch {
      setError("⚠️ Server error. Please try again later.");
    }
  };

  return (
 <div className="page-container">
      <div className="login-centered">
        <div className="otp-card">
          {/* LEFT SECTION */}
          <div className="otp-left">
            <h1 className="otp-logo">🌿 Alsana</h1>
            <h2 className="otp-title">Verify OTP</h2>
            <p className="otp-subtext">
              Please enter the 6-digit code we sent to your email.
            </p>

            <label className="otp-label">Enter OTP</label>

            <div className="otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleBackspace(e, i)}
                  className="otp-input"
                />
              ))}
            </div>

            {error && <p className="otp-error">{error}</p>}
            <div className="bottom-row">
  <div className="left-section">
    <p className="resend-text">
      Don't have an account?
      <button className="resend-btn" onClick={handleResend}>
        Resend Code
      </button>
    </p>
  </div>
  <div className="right-section">
    <p className="timer">00:{timer.toString().padStart(2, "0")}</p>
  </div>
</div>

<button className="btn verify-btn" onClick={handleCheck}>
  Verify OTP
</button>

<button onClick={handleback} className="back-btn">
  Back
</button>

            

            
          </div>

          {/* RIGHT SECTION */}
          <div className="otp-right">
            <img
              src="https://c.animaapp.com/mhc7qo5ywWFP2V/img/vector.png"
              alt="OTP illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
