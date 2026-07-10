import React from "react";
import "../css/Home.css";
import "../css/FooterSection.css"
import profileImg from "../../assets/phymam.jpg"; // replace with your actual image
import ResearchSection from "./ResearchSection";
import user1 from "../../assets/student1.jpg";
import user2 from "../../assets/akp1.jpg";
import user3 from "../../assets/farp1.jpg";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../pagecomponent/footer/footer";

import {
  FaEnvelope,
  FaQuoteLeft,
  FaQuoteRight,
  FaClock,
} from "react-icons/fa";
import Navbar from "./Navbar";



const HomePage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  // 🔍 Check form status on first load
 
  useEffect(() => {
  const revealElements = document.querySelectorAll(".scroll-reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, []);

  // 🔥 Join Button Logic
  // const handleJoin = () => {
  //   const loggedIn = localStorage.getItem("token");

  //   if (loggedIn) {
  //     // Already logged in → go directly to form
  //     navigate("/form");
  //   } else {
  //     // Not logged in → store redirect path → go to login
  //     localStorage.setItem("redirectAfterLogin", "/form");
  //     navigate("/");
  //   }
  // };

 const testimonials = [
  {
    name: "Nivas",
    role: "Class XII Student",
    image: user1,
    text: "The teaching methodology at Alsana helped me understand complex physics concepts easily. My grades improved significantly!",
  },
  {
    name: "Aakash",
    role: "Engineering Student",
    image: user2,
    text: "Excellent problem-solving approach and personalized attention. The foundation I built here helped me excel in engineering.",
  },
  {
    name: "Fareed",
    role: "Medical Student",
    image: user3,
    text: "The conceptual clarity provided here was instrumental in my NEET preparation. Highly recommended for serious students.",
  },
];

  return (
    <div>
      <Navbar />

      <main>
        <section id="home" className="hero-section">
          <div className="physics-orbit orbit-one"></div>
          <div className="physics-orbit orbit-two"></div>
          <div className="wave-line"></div>
          <div className="hero-container">
            <div className="hero-content">
              <div className="left">
                <span className="hero-kicker">Physics tuition centre</span>
                <h1 className="hero-title">Growing</h1>
                <div className="hero-subtitle">
                  Seed to Tree in <span className="physics-text">Physics</span>
                </div>
                <p className="hero-description">
                  Nurturing curiosity and knowledge from fundamental concepts to
                  advanced discoveries.
                </p>

                <div className="hero-actions">
                  <button className="cta-button" onClick={() => navigate("/schedule")}>
                    Schedule Class
                  </button>
                 
                </div>
              </div>

              <div className="hero-visual">
                Effective ={" "}
                <span className="fraction">
                  <span className="numerator">Achievement</span>
                  <span className="divider"></span>
                  <span className="denominator">Dedication</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        {/* <section className="about">
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
        </section> */}
        <section className="about-section">
          {/* LEFT */}
          <div className="about-left">
            <h1 className="title">
              I'm
              {/* <span className="box f-box">   F</span>
              <span>athi</span>
              <span className="box m-box">m</span>
              <span className="box a-box">a</span> */}
              <span className="char bg-light">F</span>
              <span className="char teal">a</span>
              <span className="char teal">t</span>
              <span className="char teal">h</span>
              <span className="char teal">i</span>

              <span className="char bg-dark">m</span>
              <span className="char bg-dark">a</span>
            </h1>

            <div className="prof-box">
              <p>Professor</p>
              <p className="indent-1">in</p>
              <p className="indent-2">Physics</p>
            </div>
          </div>

          {/* CENTER */}
          <div className="about-center">
            <p className="watering">Watering</p>
            <img src={profileImg} alt="Professor" className="about-img" />
          </div>

          {/* RIGHT */}
          <div className="about-right">
            <div className="exp-top">
              <span className="years">10</span>
              <div className="exp-label">
                <span>Years</span>
                <span>Experience</span>
              </div>
            </div>

            <p className="exp-desc">
              With a decade of experience in academia, I am passionate about making
              physics accessible and inspiring the next generation of scientists and
              thinkers.
            </p>
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

    <div className="scroll-reveal">
  <ResearchSection />
</div>

      {/* Footer */}
      <div id="footer" className="footer-wrapper">
        <section className="about-sections">
          <div className="about-containers">
            <h2>About Us</h2>
            <p>
              Alsana Physics Tuition Centre is a dedicated institute located at
              <b> 640/5, 4th Cross Street, R.R. Nagar, Thiruppalai, Madurai – 14.</b>
              We focus on helping students build strong conceptual understanding and
              problem-solving skills in Physics. Guided by
              <b> Dr. M. Ismail Fathima (M.Sc., M.Ed., M.Phil., Ph.D.)</b>,
              our centre provides quality coaching for Classes 10, 11, and 12 (CBSE,
              ICSE & State Board), ensuring every student achieves academic excellence
              with confidence.
            </p>
          </div>
        </section>
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

        <section className="testimonial-section">
          <h2 className="section-title">People Talk About Us</h2>
          <div className="underline"></div>

          <div className="testimonial-grid">
            {testimonials.map((t, i) => (
              <div
  className="testimonial-card scroll-reveal"
  key={i}
  style={{ transitionDelay: `${i * 120}ms` }}
>
                <div className="profile-header">
                  <img src={t.image} alt={t.name} className="profile-img" />
                  <div className="profile-info">
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>

                <p className="testimonial-text">"{t.text}"</p>
              </div>
            ))}
          </div>
        </section>




      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
