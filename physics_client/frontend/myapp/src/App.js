import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./Components/page/SignupForm";
import LoginForm from "./Components/page/Login";
import OtpVerify  from "./Components/page/OtpVerify";
import HomePage from "./Components/page/Home";
import FooterSection from "./Components/page/FooterSection";
import ForgotPassword from "./Components/page/forgetpassword";
import MultiStepForm from "./Components/page/MultiStepForm";
import ConfirmPassword from "./Components/page/confirmpassword";
import AuthCallback from "./Components/logincomponents/googleauth";
import Githubcallback from "./Components/logincomponents/github";
import Event from "./Components/page/Event";
import ScheduleForm from "./Components/page/ScheduleForm";
import UserList from "./Components/page/UserList";
import FormSubmissions from "./Components/page/FormSubmissions";



function App() {
  return (
    <Router>
      <Routes>
  
        <Route path="/" element={<LoginForm/>}/>
        <Route path="/Otp-verify" element={<OtpVerify/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/forget_password" element={<ForgotPassword/>}/>
        <Route path="/confirm_password" element={<ConfirmPassword/>}/>
        <Route path="/auth/callback" element={<AuthCallback/>}/>
        <Route path="/auth/github/callback" element={<Githubcallback />} />
        <Route path="/schedule" element={<ScheduleForm/>}/>
        <Route path="/users" element={<UserList/>}/>
        <Route path="/detail" element={<FormSubmissions/>}/>


      </Routes>
    </Router>
  );
}

export default App;
