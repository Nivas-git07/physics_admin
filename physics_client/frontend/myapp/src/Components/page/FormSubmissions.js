// src/components/FormSubmissions.jsx
import React, { useState, useEffect } from "react";
import "../css/FormSubmissions.css";
import Navbar from "./Navbar";

export default function FormSubmissions() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await fetch("https://admin.selfmade.technology/api/forms");
      const data = await res.json();
      if (data.success) setForms(data.forms);
    } catch (err) {
      console.error(err);
      alert("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`https://admin.selfmade.technology/api/forms/${deleteId}`, { method: "DELETE" });
      setForms(prev => prev.filter(f => f.id !== deleteId));
      setDeleteId(null);
      alert("Deleted successfully!");
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return <div className="loading">Loading submissions...</div>;

  return (
    <>
      <Navbar />
      <div className="submissions-container">
        <h1 className="title">All Form Submissions</h1>
        <p className="subtitle">Total: <strong>{forms.length}</strong> students registered</p>

        <div className="table-container">
          {/* Desktop Table – Only visible on large screens */}
          <table className="submissions-table desktop-only">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Course</th>
                <th>Submitted On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {forms.length === 0 ? (
                <tr><td colSpan="4" className="no-data">No submissions yet</td></tr>
              ) : (
                forms.map(form => (
                  <tr key={form.id}>
                    <td>
                      <button className="name-btn" onClick={() => setSelected(form)}>
                        {form.name || "Unnamed Student"}
                      </button>
                    </td>
                    <td className="course">{form.course || "-"}</td>
                    <td className="date">
                      {new Date(form.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <button className="delete-small-btn" onClick={() => setDeleteId(form.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile Cards – Only visible on mobile */}
          <div className="submissions-cards mobile-only">
            {forms.length === 0 ? (
              <div className="no-data">No submissions yet</div>
            ) : (
              forms.map(form => (
                <div key={form.id} className="submission-card">
                  <div className="card-header">
                    <div className="card-name">{form.name || "Unnamed Student"}</div>
                    <div className="card-course">{form.course || "No Course"}</div>
                  </div>
                  <div className="card-date">
                    {new Date(form.created_at).toLocaleDateString('en-IN')}
                  </div>
                  <div className="card-actions">
                    <button className="view-btn" onClick={() => setSelected(form)}>
                      View Details
                    </button>
                    <button className="delete-card-btn" onClick={() => setDeleteId(form.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail Modal */}
        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <div className="detail-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="avatar-large">
                  {selected.name?.[0]?.toUpperCase() || "S"}
                </div>
                <div>
                  <h2>{selected.name || "No Name"}</h2>
                  <p className="course-large">{selected.course || "No Course Selected"}</p>
                </div>
                <button className="close-btn" onClick={() => setSelected(null)}>×</button>
              </div>

              <div className="modal-grid">
                <div className="info-tag"><strong>Email</strong><span>{selected.email || "-"}</span></div>
                <div className="info-tag"><strong>Phone</strong><span>{selected.phoneno || "-"}</span></div>
                <div className="info-tag"><strong>Gender</strong><span>{selected.gender || "-"}</span></div>
                <div className="info-tag"><strong>Birth Date</strong><span>{selected.birthdate || "-"}</span></div>
                <div className="info-tag"><strong>Address</strong><span>{selected.currentaddress || "-"}</span></div>
                <div className="info-tag"><strong>Parent Name</strong><span>{selected.parentname || "-"}</span></div>
                <div className="info-tag"><strong>Parent Phone</strong><span>{selected.parentphoneno || "-"}</span></div>
                <div className="info-tag"><strong>Current School</strong><span>{selected.currentschool || "-"}</span></div>
                <div className="info-tag"><strong>Current Grade</strong><span>{selected.currentgrade || "-"}</span></div>
                <div className="info-tag"><strong>Class Time</strong><span>{selected.classtime || "-"}</span></div>
                <div className="info-tag"><strong>Class Mode</strong><span>{selected.classmode || "-"}</span></div>
              </div>

              <div className="modal-footer">
                Submitted on: {new Date(selected.created_at).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="confirm-modal" onClick={e => e.stopPropagation()}>
              <h3>Delete This Submission?</h3>
              <p>This action <strong>cannot be undone</strong>.</p>
              <div className="btn-group">
                <button onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="danger" onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}