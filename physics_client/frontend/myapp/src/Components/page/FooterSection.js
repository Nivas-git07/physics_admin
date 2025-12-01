import React from "react";
import "../css/FooterSection.css";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaQuoteLeft,
  FaQuoteRight,
  FaClock,
} from "react-icons/fa";

const FooterSection = () => {
  const testimonials = [
    {
      name: "Nivas",
      role: "Class XII Student",
      text: "The teaching methodology at Alsana helped me understand complex physics concepts easily. My grades improved significantly!",
    },
    {
      name: "Aakash",
      role: "Engineering Student",
      text: "Excellent problem-solving approach and personalized attention. The foundation I built here helped me excel in engineering.",
    },
    {
      name: "Karuppu",
      role: "Medical Student",
      text: "The conceptual clarity provided here was instrumental in my NEET preparation. Highly recommended for serious students.",
    },
  ];

  return (
    <div className="footer-wrapper">
      {/* Contact Info Banner */}
      {/* <div className="contact-banner">
        <div className="contact-info">
          <div className="info-box">
            <div className="icon">
              <FaClock />
            </div>
            <div>
              <h5>Class Timings</h5>
              <p>6:00 PM - 8:00 PM</p>
            </div>
          </div>
          <div className="info-box">
            <div className="icon">
              <FaEnvelope />
            </div>
            <div>
              <h5>Email</h5>
              <p>fathikhani12@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="quote-center">
          <FaQuoteLeft className="quote-left" />
          <h3>Building strong roots in Physics for a confident tomorrow</h3>
          <FaQuoteRight className="quote-right" />
        </div>

        <div className="class-contact">
          <div className="class-box">
            <p className="small">Classes</p>
            <h4>X | XI | XII</h4>
            <p>CBSE · ICSE · State Board</p>
          </div>
          <div className="contact-box">
            <p className="small">Contact Us</p>
            <h4>+91 87984 44467</h4>
            <h4>+91 87914 44467</h4>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      {/* <section className="testimonial-section">
        <h2>People Talk About Us</h2>
        <div className="underline"></div>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <FaQuoteRight className="quote-icon" />
              <p className="testimonial-text">"{t.text}"</p>
              <h4>{t.name}</h4>
              <span>{t.role}</span>
            </div>
          ))}
        </div>
      </section> */} 

      {/* Footer Bottom */}
      <footer className="footer-bottom">
        <div className="footer-left">
          <h2>
            Let’s Make to <span className="highlight">Dream</span> Real!
          </h2>
          <p>
            Join us in transforming your physics understanding and achieving
            your academic goals.
          </p>
        </div>

        <div className="footer-right">
          <h3>Information</h3>
          <div className="info-item">
            <FaMapMarkerAlt className="footer-icon" />
            <p>
              640/5, 4th Cross Street, R.R. Nagar, <br />
              Thiruppalai, Madurai – 14
            </p>
          </div>
          <div className="info-item">
            <FaEnvelope className="footer-icon" />
            <p>fathikhani12@gmail.com</p>
          </div>
        </div>
      </footer>

      <div className="footer-end">
        <p>Alsana | © 2025 All Rights Reserved</p>
        <p className="designer">Designed by Sinister Six</p>
      </div>
    </div>
  );
};

export default FooterSection;
