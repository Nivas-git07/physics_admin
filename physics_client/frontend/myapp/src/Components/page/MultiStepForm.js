import React, { useState } from "react";
import "../css/MultiStepForm.css";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

// Step 1: Student Details
const StudentDetails = ({ data, onChange }) => (
  <div className="form-step">
    <h2>Student Details</h2>

    <label>Full Name*</label>
    <input
      name="name"
      value={data.name}
      onChange={onChange}
      type="text"
      required
    />

    <label>Birth Date*</label>
    <input
      name="birthdate"
      value={data.birthdate}
      onChange={onChange}
      type="date"
      required
    />

    <label>Gender*</label>
    <div className="gender-group">
      <label>
        <input
          name="gender"
          type="radio"
          value="Male"
          checked={data.gender === "Male"}
          onChange={onChange}
          required
        />
        Male
      </label>
      <label>
        <input
          name="gender"
          type="radio"
          value="Female"
          checked={data.gender === "Female"}
          onChange={onChange}
        />
        Female
      </label>
    </div>

    <label>Current Address</label>
    <textarea
      name="currentaddress"
      value={data.currentaddress}
      onChange={onChange}
    />

    <label>Phone No*</label>
    <input
      name="phoneno"
      value={data.phoneno}
      onChange={onChange}
      type="tel"
      required
    />

    <label>Email</label>
    <input
      name="email"
      value={data.email}
      onChange={onChange}
      type="email"
    />
  </div>
);

// Step 2: Parent/Guardian Details
const ParentDetails = ({ data, onChange }) => (
  <div className="form-step">
    <h2>Parent/Guardian Details</h2>

    <label>Parent/Guardian Full Name*</label>
    <input
      name="parentname"
      value={data.parentname}
      onChange={onChange}
      type="text"
      required
    />

    <label>Relationship to Student*</label>
    <select
      name="relationship"
      value={data.relationship}
      onChange={onChange}
      required
    >
      <option value="">Select Relationship</option>
      <option value="Father">Father</option>
      <option value="Mother">Mother</option>
      <option value="Guardian">Guardian</option>
    </select>

    <label>Primary Contact Phone Number*</label>
    <input
      name="parentphoneno"
      value={data.parentphoneno}
      onChange={onChange}
      type="tel"
      required
    />

    <label>Email</label>
    <input
      name="parentemail"
      value={data.parentemail}
      onChange={onChange}
      type="email"
    />
  </div>
);

// Step 3: Educational Details
const EducationalDetails = ({ data, onChange }) => (
  <div className="form-step">
    <h2>Educational Details</h2>

    <label>Current School/College Name*</label>
    <input
      name="currentschool"
      value={data.currentschool}
      onChange={onChange}
      type="text"
      required
    />

    <label>Current Grade/Class*</label>
    <input
      name="currentgrade"
      value={data.currentgrade}
      onChange={onChange}
      type="text"
      required
    />

    <label>Course/Program Name*</label>
    <input
      name="course"
      value={data.course}
      onChange={onChange}
      type="text"
      required
    />

    <label>Class Timings (Fixed Only)</label>
    <input
      name="classtime"
      value={data.classtime}
      onChange={onChange}
      type="text"
      placeholder="6:00 PM - 8:00 PM"
    />

    <label>Class Mode Preference</label>
    <select
      name="classmode"
      value={data.classmode}
      onChange={onChange}
    >
      <option value="">Select Mode</option>
      <option value="Online">Online</option>
      <option value="Offline">Offline</option>
      <option value="Both">Both</option>
    </select>
  </div>
);

// Main Form Component
const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    gender: "",
    currentaddress: "",
    phoneno: "",
    email: "",
    parentname: "",
    relationship: "",
    parentphoneno: "",
    parentemail: "",
    currentschool: "",
    currentgrade: "",
    course: "",
    classtime: "",
    classmode: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? (checked ? value : prev[name]) : value,
    }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Form submitted successfully!");
        setFormData({
          name: "",
          birthdate: "",
          gender: "",
          currentaddress: "",
          phoneno: "",
          email: "",
          parentname: "",
          relationship: "",
          parentphoneno: "",
          parentemail: "",
          currentschool: "",
          currentgrade: "",
          course: "",
          classtime: "",
          classmode: ""
        });
        setStep(1);
      } else {
        alert("❌ Submission failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Network error");
    }
  };

  return (
    <div>
      <Navbar/>      

      <div className="multi-step-form">
        <form onSubmit={handleSubmit}>
          {step === 1 && <StudentDetails data={formData} onChange={handleChange} />}
          {step === 2 && <ParentDetails data={formData} onChange={handleChange} />}
          {step === 3 && <EducationalDetails data={formData} onChange={handleChange} />}

          <div className="buttons-container">
            {step > 1 && (
              <button type="button" className="btn-prev" onClick={prevStep}>
                &lt;
              </button>
            )}
            {step < 3 && (
              <button type="button" className="btn-next" onClick={nextStep}>
                &gt;
              </button>
            )}
            {step === 3 && (
              <button type="submit" className="btn-submit">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepForm;
