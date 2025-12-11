// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import "../css/Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";  // npm install lucide-react

export default function Navbar() {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();

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
        }
      } catch (err) {
        setEmail(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false); // Close mobile menu on route change
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`headers ${scrolled ? "scrolled" : ""}`}>
      <nav className="navbar">
        {/* Logo */}
        <Link to="/home" className="logo">
          Alsana
        </Link>

        {/* Desktop Menu - Hidden on mobile */}
        <ul className="nav-links desktop-only">
          <li><Link to="/home" className={`nav-link ${isActive("/home") ? "active" : ""}`}>Home</Link></li>
          <li><Link to="/schedule" className={`nav-link ${isActive("/schedule") ? "active" : ""}`}>Schedule</Link></li>
          <li><Link to="/users" className={`nav-link ${isActive("/users") ? "active" : ""}`}>User</Link></li>
          <li><Link to="/detail" className={`nav-link ${isActive("/detail") ? "active" : ""}`}>FormDetail</Link></li>
        </ul>

        {/* Desktop Email */}
        <div className="email desktop-only">
          {loading ? "Loading..." : email || "Guest"}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay - Only one menu ever visible */}
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <ul className="mobile-nav-links">
            <li><Link to="/home" className={`nav-link ${isActive("/home") ? "active" : ""}`}>Home</Link></li>
            <li><Link to="/schedule" className={`nav-link ${isActive("/schedule") ? "active" : ""}`}>Schedule</Link></li>
            <li><Link to="/users" className={`nav-link ${isActive("/users") ? "active" : ""}`}>User</Link></li>
            <li><Link to="/detail" className={`nav-link ${isActive("/detail") ? "active" : ""}`}>FormDetail</Link></li>
            <li className="mobile-email">{loading ? "Loading..." : email || "Guest"}</li>
          </ul>
        </div>
      </nav>
    </header>
  );
}