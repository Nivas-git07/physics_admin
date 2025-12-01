import React from "react";
import { CalendarX } from "lucide-react"; // Make sure lucide-react is installed

export default function NoClassBox() {
  return (
    <div className="no-class-wrapper">
      <div className="no-class-card">
        <div className="no-class-icon">
          <CalendarX size={48} />
        </div>
        <h2 className="no-class-title">No classes scheduled yet.</h2>
        <p className="no-class-sub">Check back soon for upcoming sessions!</p>
      </div>
    </div>
  );
}
