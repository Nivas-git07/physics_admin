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

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState(""); 
  const [startTime, setStartTime] = useState(""); 
  const [endTime, setEndTime] = useState(""); 

  const [scheduleCreated, setScheduleCreated] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  useEffect(() => {
    fetch("https://admin.selfmade.technology/api/schedule")
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


  const next = () => {
    if (step === 1 && (!subject || !topic || !date || !startTime || !endTime)) {
      alert("Fill all fields");
      return;
    }
    if (step === 1) {
      setShowPeoplePopup(true);
      return;
    }
    setStep(step + 1);
  };

  const closePopup = () => {
    setShowPeoplePopup(false);
    setSearch("");
  };

  const proceedFromPopup = () => {
    if (selectedEmails.length === 0) {
      alert("Select at least one person");
      return;
    }
    closePopup();
    setStep(2);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const res = await fetch("https://admin.selfmade.technology/api/gmeet", {
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
