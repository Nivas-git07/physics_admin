import React, { useState, useEffect } from "react";
import "../css/ScheduleForm.css";
import Navbar from "./Navbar";
import Footer from "../../pagecomponent/footer/footer";

export default function ScheduleForm() {
  const [step, setStep] = useState(1);
  const [people, setPeople] = useState([]);     // initialize as empty array
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState(""); // yyyy-mm-dd
  const [startTime, setStartTime] = useState(""); // HH:MM 24h
  const [endTime, setEndTime] = useState(""); // HH:MM 24h

  const [scheduleCreated, setScheduleCreated] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/schedule")
      .then((res) => res.json())
      .then((data) => {
        // Ensure data.users is an array; if not, fallback to empty array
        if (data && Array.isArray(data.users)) {
          setPeople(data.users);
        } else {
          console.warn("Unexpected data.users:", data.users);
          setPeople([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch schedule users:", err);
        setPeople([]);     // fallback to empty array on error
        setLoading(false);
      });
  }, []);

  // Safe fallback: if people is undefined or not an array, use empty array
  const safePeople = Array.isArray(people) ? people : [];
  const filtered = safePeople.filter((p) =>
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const togglePerson = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const selectAll = () => setSelectedEmails(filtered.map((p) => p.email));
  const deselectAll = () => setSelectedEmails([]);

  const next = () => {
    if (step === 1 && (!subject || !topic || !date || !startTime || !endTime)) {
      alert("Fill all fields");
      return;
    }
    if (step === 2 && selectedEmails.length === 0) {
      alert("Select at least one person");
      return;
    }
    setStep(step + 1);
  };

  const back = () => setStep(step - 1);

  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatTimeForBackend = (timeStr) => {
    if (!timeStr) return "";
    let [hour, minute] = timeStr.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  const createSchedule = async () => {
    if (!subject || !topic || !date || !startTime || !endTime || selectedEmails.length === 0) {
      alert("Fill all fields and select participants");
      return;
    }

    setLoadingSchedule(true);
    setScheduleCreated(false);
    setMeetingLink("");

    const payload = {
      email: selectedEmails,
      class_name: subject,
      date: formatDateForBackend(date),
      start: formatTimeForBackend(startTime),
      end: formatTimeForBackend(endTime),
    };

    try {
      const res = await fetch("http://localhost:5000/gmeet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoadingSchedule(false);

      if (res.ok) {
        setScheduleCreated(true);
        setMeetingLink(data.meetingLink);
      } else {
        alert("Failed: " + data.message);
      }
    } catch (err) {
      setLoadingSchedule(false);
      console.error("Error sending schedule:", err);
      alert("Something went wrong!");
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

        {/* Overlay Popup */}
        {loadingSchedule || scheduleCreated ? (
          <div className="overlay">
            <div className="overlay-content">
              {!scheduleCreated && (
                <>
                  <div className="spinner"></div>
                  <p>Creating Schedule...</p>
                </>
              )}
              {scheduleCreated && (
                <>
                  <div className="tick">✓</div>
                  <p>Meeting Created!</p>
                  <a href={meetingLink} target="_blank" rel="noopener noreferrer">{meetingLink}</a>
                  <button className="done-btn" onClick={resetForm}>Done</button>
                </>
              )}
            </div>
          </div>
        ) : null}

        {/* Step Progress */}
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
        <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
        <input placeholder="Topic" value={topic} onChange={e => setTopic(e.target.value)} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />

        <div className="time-row">
          <div className="time-box">
            <label>Start Time</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>
          <div className="time-box">
            <label>End Time</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
        </div>

        <div className="btn-row" style={{ justifyContent: "center" }}>
          <button className="next-btn large-btn" onClick={next}>Next →</button>
        </div>
      </div>
    </div>
  )}

  {step === 2 && (
    <div className="schedule-card active">
      <h1>Select People</h1>
      <div className="schedule-card-body schedule-card-people">
        <input
          className="search-box"
          placeholder="Search email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="select-all-row">
          <button className="select-btn" onClick={selectAll}>Select All</button>
          <button className="select-btn" onClick={deselectAll}>Deselect All</button>
        </div>

        <div className="people-scroll">
          {filtered.map((p, i) => (
            <div
              key={i}
              className={`person-row ${selectedEmails.includes(p.email) ? "selected" : ""}`}
              onClick={() => togglePerson(p.email)}
            >
              <div className="profile-icon">{p.name ? p.name[0].toUpperCase() : p.email[0].toUpperCase()}</div>
              <div className="person-info">
                <div className="name">{p.name || p.email.split("@")[0]}</div>
                <div className="email">{p.email}</div>
              </div>
              {selectedEmails.includes(p.email) && <span className="selected-check">✓</span>}
            </div>
          ))}
        </div>

        <div className="btn-row" style={{ justifyContent: "center" }}>
          <button className="back-btn large-btn" onClick={back}>← Back</button>
          <button className="next-btn large-btn" onClick={next}>Next →</button>
        </div>
      </div>
    </div>
  )}

  {step === 3 && (
    <div className="schedule-card active">
      <h1>Confirm Details</h1>
      <div className="schedule-card-body schedule-card-confirm">
        <div className="summary">
          <h3>{subject}</h3>
          <p><strong>Topic:</strong> {topic}</p>
          <p><strong>Date:</strong> {date}</p>
          <p className="time-display">
            <strong>Time:</strong> {formatTimeForBackend(startTime)} - {formatTimeForBackend(endTime)}
          </p>
          <p><strong>Participants:</strong> {selectedEmails.length}</p>
        </div>

        <div className="btn-row" style={{ justifyContent: "center", flexDirection: "column", gap: "10px" }}>
          <button className="back-btn large-btn" onClick={back}>← Back</button>
          <button className="create-btn large-btn" onClick={createSchedule}>Create Schedule</button>
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
