// src/components/UserList.jsx
import React, { useState, useEffect } from "react";
import "../css/UserList.css";
import Navbar from "./Navbar";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/delete-user/${deleteModal.id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        setUsers(prev => prev.filter(u => u.id !== deleteModal.id));
        setDeleteModal(null);
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <>
      <Navbar />
      <div className="userlist-container">

        <div className="header">
          <h1>Manage Users</h1>
          <p>Total: <strong>{users.length}</strong> users</p>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="users-grid">
          {filtered.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <div className="avatar">
                  {user.email[0].toUpperCase()}
                </div>
                <div className="user-details">
                  <h3>{user.email}</h3>
                  <span className={`status ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                  <button
                    className="below"
                    onClick={() => setDeleteModal(user)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && <p className="no-results">No users found</p>}
      </div>

      {/* MODAL */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete User?</h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete?</p>
              <div className="user-preview">
                <strong>{deleteModal.email}</strong><br/>
                <span className={`status ${deleteModal.status.toLowerCase()}`}>
                  {deleteModal.status}
                </span>
              </div>
              <p className="warning">This action <strong>cannot be undone</strong>.</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="confirm-delete-btn" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}