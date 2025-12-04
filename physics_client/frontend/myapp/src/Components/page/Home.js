import React from "react";
import "../css/Home.css";
import "../css/FooterSection.css"
import profileImg from "../../assets/phymam.jpg"; // replace with your actual image
import ResearchSection from "./ResearchSection";
import FooterSection from "./FooterSection";
import { Link } from "react-router-dom";
import { IconsManifest } from "react-icons/lib";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaQuoteLeft,
  FaQuoteRight,
  FaClock,
} from "react-icons/fa";
import Navbar from "./Navbar";


const HomePage = () => {
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
    <div>
      <Navbar/>
  

      <main>
        <section id="home" class="hero-section">
          <div class="hero-container">
            <div class="hero-content">
              <div class="left">
                <h1 class="hero-title">
                  Growing
                </h1>
                <div class="hero-subtitle">
                  Seed to Tree in <span class="physics-text">Physics</span>
                </div>
                <p class="hero-description">
                  Nurturing curiosity and knowledge from fundamental concepts to advanced discoveries.
                </p>
                
              </div>
              <div class="hero-visual">
                Effective = <span class="fraction">
                  <span class="numerator">Achievement</span>
                  <span class="divider"></span>
                  <span class="denominator">Dedication</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about">
          <div className="about-left">
            <h2>
              I'm <span className="highlight">Fathima</span>
            </h2>
            <h3>Professor in Physics</h3>
            <p className="description">
              With a decade of experience in academia, I am passionate about
              making physics accessible and inspiring the next generation of
              scientists and thinkers.
            </p>
          </div>

          <div className="about-center">
            <img src={profileImg} alt="Professor" />
            <p className="watering">Watering</p>
          </div>

          <div className="about-right">
            <h2 className="years">10</h2>
            <p>Years Experience</p>
          </div>
        </section>

        {/* Work Experience */}
        <section className="experience">
          <h2>My Work Experience</h2>
          <div className="underline"></div>
          <div className="work-card">
            <h1 className="phy">Assistant Professor of Physics</h1>
            <div className="colleges">
              <div>🎓 Madonna Arts & Science College</div>
              <div>🎓 Mangayarkarasi College of Arts & Science</div>
              <div>🎓 Sethu Institute of Technology</div>
            </div>
          </div>
        </section>
      </main>
      <ResearchSection />
      <div id="footer"className="footer-wrapper">
            {/* Contact Info Banner */}
            <div className="contact-banner">
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
            <section className="testimonial-section">
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
            </section>
      
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
    
      {/* <ResearchSection/>
        <FooterSection/> */}

    </div >
  );
};

export default HomePage;
