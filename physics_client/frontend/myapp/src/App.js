import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./Components/page/Login";
import OtpVerify  from "./Components/page/OtpVerify";
import HomePage from "./Components/page/Home";
import ForgotPassword from "./Components/page/forgetpassword";
import MultiStepForm from "./Components/page/MultiStepForm";
import ConfirmPassword from "./Components/page/confirmpassword";

import ScheduleForm from "./Components/page/ScheduleForm";
import UserList from "./Components/page/UserList";
import FormSubmissions from "./Components/page/FormSubmissions";


function AdminRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/Otp-verify" element={<OtpVerify/>}/>
        <Route path="/home" element={<AdminRoute><HomePage/></AdminRoute>}/>
        <Route path="/forget_password" element={<ForgotPassword/>}/>
        <Route path="/confirm_password" element={<ConfirmPassword/>}/>
       
        <Route path="/schedule" element={<AdminRoute><ScheduleForm/></AdminRoute>}/>
        <Route path="/users" element={<AdminRoute><UserList/></AdminRoute>}/>
        <Route path="/detail" element={<AdminRoute><FormSubmissions/></AdminRoute>}/>
        <Route path="/form" element={<AdminRoute><MultiStepForm/></AdminRoute>}/>

      </Routes>
    </Router>
  );
}

export default App;
