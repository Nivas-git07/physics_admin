
import "../css/ResearchSection.css";
import React, { useState } from "react";
import { FaSearch, FaGraduationCap, FaInfinity, FaAtom, FaMicroscope, FaArrowRight } from "react-icons/fa";

const ResearchSection = () => {
  // Step 1: Data for research cards
  const researchData = [
    {
      icon: <FaSearch />,
      title: "Research Aptitude and Attitude of PG Students",
      description:
        "Exploring the research capabilities and mindset of postgraduate students in physics education.",
    },
    {
      icon: <FaGraduationCap />,
      title: "Pedagogical Content Knowledge of Rural and Urban Students",
      description:
        "Comparative study of teaching methodologies between rural and urban physics education.",
    },
    {
      icon: <FaInfinity />,
      title: "Theory of Relativity and Its Applications",
      description:
        "Comprehensive analysis of Einstein’s theory and its practical applications in modern physics.",
    },
    {
      icon: <FaAtom />,
      title: "Quantum Mechanics in Modern Technology",
      description:
        "Study of quantum principles and their role in modern-day computing and communication systems.",
    },
    {
      icon: <FaMicroscope />,
      title: "Experimental Physics and Lab Innovations",
      description:
        "Developing innovative methods to simplify complex physics experiments for better learning.",
    },
  ];

  // Step 2: State to track the current visible set
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 3;

  // Step 3: Logic to handle navigation
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + cardsPerPage >= researchData.length ? 0 : prev + cardsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - cardsPerPage < 0
        ? Math.max(0, researchData.length - cardsPerPage)
        : prev - cardsPerPage
    );
  };

  // Step 4: Slice data to show current set
  const visibleCards = researchData.slice(currentIndex, currentIndex + cardsPerPage);

  return (
    <div className="research-container">
      <h2 className="research-title">My Research Works</h2>
      <div className="underline"></div>

      {/* Research Cards */}
      <div className="research-cards">
        {visibleCards.map((item, index) => (
          <div key={index} className="card">
            <div className="icon-box">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a href="#" className="read-more">
              Read More <FaArrowRight className="arrow" />
            </a>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="nav-buttons">
        <button className="circle-btn" onClick={prevSlide}>
          ‹
        </button>
        <button className="circle-btn" onClick={nextSlide}>
          ›
        </button>
      </div>

      {/* About Section */}
      
    </div>
  );
};

export default ResearchSection;
