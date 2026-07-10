import React, { useState, useEffect } from "react";
import "../css/ScheduleForm.css";
import Navbar from "./Navbar";
import Footer from "../../pagecomponent/footer/footer";

export default function ScheduleForm() {
  const [step, setStep] = useState(1);
  const [people, setPeople] = useState([]);     
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [showPeoplePopup, setShowPeoplePopup] = useState(false);
  const [errors, setErrors] = useState({});
const [successData, setSuccessData] = useState(null);

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [date, setDate] = useState(""); 
  const [startTime, setStartTime] = useState(""); 
  const [endTime, setEndTime] = useState(""); 

  const [scheduleCreated, setScheduleCreated] = useState(false);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/schedule", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.users)) {
          setPeople(data.users);
        } else {
          setPeople([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setPeople([]);
        setLoading(false);
      });
  }, []);

  const safePeople = Array.isArray(people) ? people : [];
  
  

  const filtered = safePeople.filter((p) => {
    const email = p?.email?.toLowerCase() || "";
    const name = p?.name?.toLowerCase() || "";
    const s = search.toLowerCase();
    return email.includes(s) || name.includes(s);
  });

  const togglePerson = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

const selectAll = () => {
  // Select all filtered people
  setSelectedEmails(filtered.map((p) => p.email));
};
const deselectAll = () => setSelectedEmails([]);
const today = new Date().toISOString().split("T")[0];

const timeSlots = [
  "06:00", "06:30", "07:00", "07:30",
  "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30",
];

const getAutoEndTime = (start) => {
  if (!start) return "";
  const [h, m] = start.split(":").map(Number);
  const startDate = new Date();
  startDate.setHours(h, m, 0, 0);
  startDate.setMinutes(startDate.getMinutes() + 60);

  return `${String(startDate.getHours()).padStart(2, "0")}:${String(
    startDate.getMinutes()
  ).padStart(2, "0")}`;
};

const validateStepOne = () => {
  const newErrors = {};

  if (!subject.trim()) newErrors.subject = "Subject is required";
  if (!topic.trim()) newErrors.topic = "Topic is required";
  if (!date) newErrors.date = "Date is required";
  if (!startTime) newErrors.startTime = "Start time is required";
  if (!endTime) newErrors.endTime = "End time is required";

  if (date && date < today) {
    newErrors.date = "Past date is not allowed";
  }

  if (startTime && endTime && endTime <= startTime) {
    newErrors.endTime = "End time must be after start time";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const validateConfirmStep = () => {
  const newErrors = {};

  if (!meetingLink.trim()) {
    newErrors.meetingLink = "Meeting link is required";
  } else if (!/^https?:\/\/.+/i.test(meetingLink)) {
    newErrors.meetingLink = "Enter a valid meeting link";
  }

  if (selectedEmails.length === 0) {
    newErrors.participants = "Select at least one participant";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


const next = () => {
  if (step === 1) {
    if (!validateStepOne()) return;
    setShowPeoplePopup(true);
    return;
  }

  setStep((prev) => prev + 1);
};

  const closePopup = () => {
    setShowPeoplePopup(false);
    setSearch("");
  };

 const proceedFromPopup = () => {
  if (selectedEmails.length === 0) {
    setErrors({ participants: "Select at least one person" });
    return;
  }

  setErrors({});
  closePopup();
  setStep(2);

  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 100);
};

  const back = () => setStep(step - 1);

  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const formatTimeForBackend = (timeStr) => {
    if (!timeStr) return "";
    let [h, min] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${min.toString().padStart(2, "0")} ${ampm}`;
  };

 const createSchedule = async () => {
  if (!validateConfirmStep()) return;

  setLoadingSchedule(true);
  setScheduleCreated(false);

  const payload = {
    email: selectedEmails,
    class_name: subject,
    topic,
    date: formatDateForBackend(date),
    start: formatTimeForBackend(startTime),
    end: formatTimeForBackend(endTime),
    meeting_link: meetingLink,
  };

  try {
    const res = await fetch("http://localhost:5000/gmeet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoadingSchedule(false);

    if (res.ok) {
      setSuccessData({
        subject,
        topic,
        date,
        startTime,
        endTime,
        meetingLink,
        participants: selectedEmails.length,
      });
      setScheduleCreated(true);
    } else {
      setErrors({
        submit: data.message || "Failed to create schedule",
      });
    }
  } catch (err) {
    console.error(err);
    setLoadingSchedule(false);
    setErrors({
      submit: "Something went wrong. Please try again.",
    });
  }
};

  const resetForm = () => {
    setStep(1);
    setSubject("");
    setTopic("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setSelectedEmails([]);
    setScheduleCreated(false);
    setMeetingLink("");
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="main-container">

        {/* Schedule creation overlay */}
        {(loadingSchedule || scheduleCreated) && (
          <div className="overlay">
            <div className="overlay-content">
              {!scheduleCreated && (
                <>
                  <div className="spinner"></div>
                  <p>Creating Schedule...</p>
                </>
              )}
             {scheduleCreated && successData && (
  <>
    <div className="success-icon">✓</div>
    <h2 className="success-title">Schedule Created Successfully</h2>
    <p className="success-text">
      Meeting details have been sent to selected students.
    </p>

    <div className="success-summary">
      <div>
        <span>Subject</span>
        <strong>{successData.subject}</strong>
      </div>
      <div>
        <span>Topic</span>
        <strong>{successData.topic}</strong>
      </div>
      <div>
        <span>Date</span>
        <strong>{new Date(successData.date).toLocaleDateString("en-IN")}</strong>
      </div>
      <div>
        <span>Time</span>
        <strong>
          {formatTimeForBackend(successData.startTime)} -{" "}
          {formatTimeForBackend(successData.endTime)}
        </strong>
      </div>
      <div>
        <span>Participants</span>
        <strong>{successData.participants}</strong>
      </div>
    </div>

    <a
      className="meeting-link-btn"
      href={successData.meetingLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open Meeting Link
    </a>

    <button className="done-btn" onClick={resetForm}>
      Create Another Schedule
    </button>
  </>
)}
            </div>
          </div>
        )}

        {/* People Selection Popup */}
     {/* People Selection Popup */}
{showPeoplePopup && (
  <div className="overlay" onClick={(e) => e.target === e.currentTarget && closePopup()}>
    <div className="people-popup">
      <div className="popup-header">
        <h2>Add Peoples</h2>
        <button className="popup-close-btn" onClick={closePopup}>×</button>
      </div>

      <div className="popup-search-row">
        <input
          className="popup-search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* ⭐ Added Select All button */}
        <button className="select-all-btn" onClick={selectAll}>
          Select All
        </button>
        <button className="clear-all-btn" onClick={deselectAll}>
          Clear All
        </button>
      </div>

      <div className="popup-section-title">Suggested</div>

      {/* People List */}
      <div className="popup-people-list">
        {filtered.map((p, i) => {
          const firstLetter =
            p?.name?.[0]?.toUpperCase() ||
            p?.email?.[0]?.toUpperCase() ||
            "?";
          const displayName = p?.name || "User";
          const displayEmail = p?.email || "No Email";

          return (
            <div
              key={i}
              className={`popup-person-row ${selectedEmails.includes(p.email) ? "selected" : ""}`}
              onClick={() => togglePerson(p.email)}
            >
              <div className="popup-profile-icon">
                <div className="fallback-icon">{firstLetter}</div>
              </div>

              <div className="popup-person-info">
                <div className="popup-name">{displayName}</div>
                <div className="popup-status">{displayEmail}</div>
              </div>

              <div className={`popup-radio ${selectedEmails.includes(p.email) ? "checked" : ""}`}></div>
            </div>
          );
        })}
      </div>

      <button className="proceed-btn" onClick={proceedFromPopup}>
        Proceed
      </button>
    </div>
  </div>
)}


        {/* Steps and form */}
        <div className="top-progress">
          {[1, 2, 3].map((i) => (
            <div key={i} className="progress-item">
              <div className={`circle ${step >= i ? "active" : ""}`}>
                {step > i ? "✓" : i}
              </div>
              {i < 3 && <div className={`line ${step > i ? "active" : ""}`} />}
            </div>
          ))}
        </div>

        <div className="cards-container">
          {step === 1 && (
            <div className="schedule-card active">
              <h1>Calendar & Subject Detail</h1>
              <div className="schedule-card-body">
  <div className="field-group">
    <label>Subject</label>
    <input
      placeholder="Example: Physics"
      value={subject}
      onChange={(e) => {
        setSubject(e.target.value);
        setErrors((prev) => ({ ...prev, subject: "" }));
      }}
    />
    {errors.subject && <p className="field-error">{errors.subject}</p>}
  </div>

  <div className="field-group">
    <label>Topic</label>
    <input
      placeholder="Example: Laws of Motion"
      value={topic}
      onChange={(e) => {
        setTopic(e.target.value);
        setErrors((prev) => ({ ...prev, topic: "" }));
      }}
    />
    {errors.topic && <p className="field-error">{errors.topic}</p>}
  </div>

  <div className="field-group">
    <label>Class Date</label>
    <input
      type="date"
      min={today}
      value={date}
      onChange={(e) => {
        setDate(e.target.value);
        setErrors((prev) => ({ ...prev, date: "" }));
      }}
    />
    {errors.date && <p className="field-error">{errors.date}</p>}
  </div>

  <div className="time-selection-box">
    <label className="main-label">Choose Class Time</label>

    <div className="quick-time-grid">
      {timeSlots.map((slot) => (
        <button
          type="button"
          key={slot}
          className={`time-chip ${startTime === slot ? "active" : ""}`}
          onClick={() => {
            setStartTime(slot);
            setEndTime(getAutoEndTime(slot));
            setErrors((prev) => ({
              ...prev,
              startTime: "",
              endTime: "",
            }));
          }}
        >
          {formatTimeForBackend(slot)}
        </button>
      ))}
    </div>

    <div className="time-row improved-time-row">
      <div className="time-box">
        <label>Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => {
            const value = e.target.value;
            setStartTime(value);
            setEndTime(getAutoEndTime(value));
            setErrors((prev) => ({ ...prev, startTime: "", endTime: "" }));
          }}
        />
        {errors.startTime && <p className="field-error">{errors.startTime}</p>}
      </div>

      <div className="time-box">
        <label>End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => {
            setEndTime(e.target.value);
            setErrors((prev) => ({ ...prev, endTime: "" }));
          }}
        />
        {errors.endTime && <p className="field-error">{errors.endTime}</p>}
      </div>
    </div>
  </div>

  <div className="btn-row" style={{ justifyContent: "center" }}>
    <button className="next-btn large-btn" onClick={next}>
      Next →
    </button>
  </div>
</div>
            </div>
          )}

          {step === 2 && (
            <div className="schedule-card active">
              <h1>Confirm Details</h1>
             <div className="schedule-card-body schedule-card-confirm">
  <div className="field-group">
    <label>Meeting Link</label>
    <input
      type="url"
      placeholder="Paste Google Meet / Zoom Link"
      value={meetingLink}
      onChange={(e) => {
        setMeetingLink(e.target.value);
        setErrors((prev) => ({ ...prev, meetingLink: "" }));
      }}
    />
    {errors.meetingLink && <p className="field-error">{errors.meetingLink}</p>}
  </div>

  <div className="confirm-box">
    <div className="confirm-header">
      <span>Confirm Schedule</span>
      <h3>{subject}</h3>
      <p>{topic}</p>
    </div>

    <div className="confirm-grid">
      <div className="confirm-item">
        <span>Date</span>
        <strong>{new Date(date).toLocaleDateString("en-IN")}</strong>
      </div>

      <div className="confirm-item">
        <span>Time</span>
        <strong>
          {formatTimeForBackend(startTime)} - {formatTimeForBackend(endTime)}
        </strong>
      </div>

      <div className="confirm-item">
        <span>Participants</span>
        <strong>{selectedEmails.length} Students</strong>
      </div>

      <div className="confirm-item">
        <span>Mode</span>
        <strong>Online Class</strong>
      </div>
    </div>
  </div>

  {errors.participants && <p className="field-error center-error">{errors.participants}</p>}
  {errors.submit && <p className="field-error center-error">{errors.submit}</p>}

  <div className="btn-row confirm-actions">
    <button className="back-btn large-btn" onClick={back}>
      ← Back
    </button>
    <button className="create-btn large-btn" onClick={createSchedule}>
      Create Schedule
    </button>
  </div>
</div>
            </div>
          )}
        </div>

      </div>
      <Footer />
    </>
  );
}
