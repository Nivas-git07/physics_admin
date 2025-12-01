// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import '../css/Navbar.css';
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // ← To detect current route

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setEmail(null);
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/home", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setEmail(data.email);
        } else {
          setEmail(null);
        }
      } catch (err) {
        setEmail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Make navbar sticky on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`headers ${scrolled ? "scrolled" : ""}`}>
      <nav className="navbar">
        <Link to="/home" className="logo">Alsana</Link>

        <ul className="nav-links">
          <li><Link to="/home" className={`nav-link ${isActive("/home") ? "active" : ""}`}>Home</Link></li>
          <li><Link to="/form" className={`nav-link ${isActive("/form") ? "active" : ""}`}>Form</Link></li>
          <li><a href="#footer" className="nav-link">About</a></li>
          <li><Link to="/event" className={`nav-link ${isActive("/event") ? "active" : ""}`}>Event</Link></li>
          <li><Link to="/schedule" className={`nav-link ${isActive("/schedule") ? "active" : ""}`}>Schedule</Link></li>
          <li><Link to="/users" className={`nav-link ${isActive("/users") ? "active" : ""}`}>User</Link></li>
        </ul>

        <div className="email">
          {loading ? (
            <span>Loading...</span>
          ) : email ? (
            <span>{email}</span>
          ) : (
            <Link to="/sign" className="nav-link login-btn">Sign In</Link>
          )}
        </div>
      </nav>
    </header>
  );
}