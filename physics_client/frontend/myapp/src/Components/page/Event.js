import "../css/Event.css";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FooterSection from "./FooterSection";
import NoClassBox from "./NoClassBox"; // add this import

export default function Event() {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/event", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or server error");
        return res.json();
      })
      .then((data) => {
        if (data.events && data.events.length > 0) {
          const now = new Date();

          // find the first upcoming or ongoing class
          const upcomingOrOngoing =
            data.events.find((e) => {
              const startUTC = new Date(e.start_time);
              const endUTC = new Date(e.end_time);
              return now >= startUTC && now <= endUTC; // ongoing
            }) ||
            data.events.find((e) => {
              const startUTC = new Date(e.start_time);
              return now < startUTC; // upcoming
            });

          setEventData(upcomingOrOngoing || null);
        } else {
          setEventData(null);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="event-page">
        <Navbar />
        <NoClassBox message="Loading..." />
        <FooterSection />
      </div>
    );

  if (!eventData)
    return (
      <div className="event-page">
        <Navbar />
        <NoClassBox
          message="No classes scheduled yet."
          subMessage="Check back soon for upcoming sessions!"
        />
        <FooterSection />
      </div>
    );

  const title = eventData.class_name;

  // convert UTC to local time for display
  const startLocal = new Date(eventData.start_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endLocal = new Date(eventData.end_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateLocal = new Date(eventData.start_time).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const link = eventData.meeting_link;

  // Duration calculation
  const diffHoursDecimal =
    (new Date(eventData.end_time) - new Date(eventData.start_time)) /
    (1000 * 60 * 60);
  const duration =
    diffHoursDecimal % 1 === 0
      ? `${diffHoursDecimal} hour`
      : `${diffHoursDecimal.toFixed(2)} hour`;

  return (
    <div className="event-page">
      <Navbar />
      <div className="event-wrapper">
        <h2 className="event-header">Current Schedule</h2>
        <div className="event-card">
          <div className="event-upper">
            <div className="title-section">
              <div className="calendar-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="event-title">{title}</h3>
            </div>

            <div className="datetime-duration">
              <div className="datetime-stack">
                <div className="date-text">{dateLocal}</div>
                <div className="time-text">
                  {startLocal} - {endLocal}
                </div>
              </div>

              <div className="duration-box">
                <div className="duration-value">{duration}</div>
                <div className="duration-label">Class</div>
              </div>
            </div>
          </div>

          <div className="event-lower">
            <p className="topics-heading">Topics to be covered</p>
            <p className="topics-description">
              Physics Education Research Session
            </p>

            <button
              className="join-btn"
              onClick={() => window.open(link, "_blank")}
            >
              Join Class
            </button>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
