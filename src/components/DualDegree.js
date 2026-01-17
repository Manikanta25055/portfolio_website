import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const DualDegree = () => {
  const [expandedMIT, setExpandedMIT] = useState(false);
  const [expandedIIT, setExpandedIIT] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMemo(() => window.innerWidth <= 768, []);
  const shouldAnimate = !isMobile && !prefersReducedMotion;

  const mitData = {
    institution: "Manipal Institute of Technology",
    degree: "BTech in Electrical & Electronics Engineering",
    currentSem: 6,
    totalSems: 8,
    cgpa: "8.01",
    maxCgpa: "10.0",
    progress: 75, // 6/8 = 75%
    semesters: [
      { sem: "1-2", status: "completed", icon: "I", description: "Foundation Year" },
      { sem: "3-4", status: "completed", icon: "II", description: "Core Subjects" },
      { sem: "5-6", status: "in-progress", icon: "III", description: "Specialization Track" },
      { sem: "7-8", status: "upcoming", icon: "IV", description: "Advanced & Projects" }
    ],
    currentCourses: [
      { code: "AI", name: "Artificial Intelligence", category: "Program Elective" },
      { code: "ML", name: "Machine Learning", category: "Program Elective" },
      { code: "SSD", name: "Solid State Drives", category: "Flexi Core" },
      { code: "EEFM", name: "Engineering Economics Fundamentals", category: "Core" },
      { code: "CE", name: "Consumer Electronics", category: "Open Elective" },
      { code: "M&I", name: "Measurement and Instrumentation", category: "Core" }
    ],
    specialization: {
      name: "Computational Intelligence",
      type: "Minor Specialization",
      courses: ["Artificial Intelligence", "Machine Learning", "+ 2 more electives"]
    }
  };

  const iitData = {
    institution: "Indian Institute of Technology Madras",
    degree: "BS in Electronic Systems",
    currentPhase: "Diploma",
    cgpa: "7.33",
    maxCgpa: "10.0",
    phases: [
      {
        name: "Foundation",
        status: "completed",
        icon: "1",
        description: "Core fundamentals completed"
      },
      {
        name: "Diploma",
        status: "in-progress",
        icon: "2",
        description: "Currently pursuing"
      },
      {
        name: "Degree",
        status: "upcoming",
        icon: "3",
        description: "Final phase"
      }
    ],
    currentCourses: [
      { code: "CO", name: "Computer Organisation", type: "Theory" },
      { code: "TM", name: "Testing and Measurement", type: "Theory" },
      { code: "SA", name: "Sensors and Application", type: "Theory" }
    ],
    currentProjects: [
      { name: "Electronics Project", status: "Registered" }
    ]
  };

  const CircularProgress = ({ progress, size = 120, strokeWidth = 8, color = "#FF6B35" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    const ProgressCircle = shouldAnimate ? motion.circle : 'circle';

    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="circular-progress"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 107, 53, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <ProgressCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={shouldAnimate ? circumference : offset}
          {...(shouldAnimate && {
            animate: { strokeDashoffset: offset },
            transition: { duration: 1.5, ease: "easeOut", delay: 0.3 }
          })}
          style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".35em"
          className="progress-text"
          fill={color}
          style={{ fontSize: `${size * 0.15}px`, fontWeight: 700 }}
        >
          {Math.round(progress)}%
        </text>
      </svg>
    );
  };

  const SectionContainer = shouldAnimate ? motion.div : 'div';
  const TitleContainer = shouldAnimate ? motion.h2 : 'h2';
  const DegreeCard = shouldAnimate ? motion.div : 'div';
  const MotionDiv = shouldAnimate ? motion.div : 'div';
  const MotionButton = shouldAnimate ? motion.button : 'button';

  return (
    <section className="dual-degree" id="about">
      <SectionContainer
        className="section-container"
        {...(shouldAnimate && {
          initial: { opacity: 0, y: 50 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.1, margin: "200px 0px -200px 0px" },
          transition: { duration: 0.6, ease: "easeOut" }
        })}
      >
        <TitleContainer
          className="section-title"
          {...(shouldAnimate && {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 }
          })}
        >
          Dual Degree Journey
        </TitleContainer>

        <div className="degrees-grid">
          {/* MIT Card */}
          <motion.div
            className="degree-card mit-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="degree-header">
              <div className="institution-badge">MIT</div>
              <h3>{mitData.institution}</h3>
              <p className="degree-name">{mitData.degree}</p>
            </div>

            <div className="degree-stats">
              <div className="stat-item">
                <CircularProgress progress={mitData.progress} />
                <div className="stat-info">
                  <span className="stat-label">Progress</span>
                  <span className="stat-value">Semester {mitData.currentSem}/{mitData.totalSems}</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="cgpa-display">
                  <motion.div
                    className="cgpa-value"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    {mitData.cgpa}
                  </motion.div>
                  <span className="cgpa-max">/ {mitData.maxCgpa}</span>
                </div>
                <span className="stat-label">CGPA (Till 5th Sem)</span>
              </div>
            </div>

            <motion.div
              className="specialization-badge"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span className="badge-icon">★</span>
              <div className="badge-content">
                <strong>{mitData.specialization.name}</strong>
                <span>{mitData.specialization.type}</span>
              </div>
            </motion.div>

            <motion.div
              className="phase-timeline"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h4>Semester Progression</h4>
              <div className="phases">
                {mitData.semesters.map((semester, index) => (
                  <motion.div
                    key={index}
                    className={`phase-item ${semester.status}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="phase-icon">{semester.icon}</div>
                    <div className="phase-content">
                      <strong>Semester {semester.sem}</strong>
                      <span>{semester.description}</span>
                    </div>
                    {index < mitData.semesters.length - 1 && (
                      <div className="phase-connector"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.button
              className="expand-btn"
              onClick={() => setExpandedMIT(!expandedMIT)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-expanded={expandedMIT}
              aria-label={expandedMIT ? 'Hide MIT current courses' : 'View MIT current courses'}
            >
              {expandedMIT ? 'Hide' : 'View'} Current Courses
              <span className={`arrow ${expandedMIT ? 'up' : 'down'}`} aria-hidden="true">▼</span>
            </motion.button>

            <AnimatePresence>
              {expandedMIT && (
                <motion.div
                  className="courses-section"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4>Semester 6 Courses</h4>
                  <div className="courses-list">
                    {mitData.currentCourses.map((course, index) => (
                      <motion.div
                        key={index}
                        className="course-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <span className="course-code">{course.code}</span>
                        <div className="course-details">
                          <span className="course-name">{course.name}</span>
                          <span className={`course-category ${course.category.toLowerCase().replace(' ', '-')}`}>
                            {course.category}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="specialization-note">
                    <p>
                      <strong>Specialization Track:</strong> {mitData.specialization.courses.join(', ')}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* IIT Madras Card */}
          <motion.div
            className="degree-card iit-card"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="degree-header">
              <div className="institution-badge iit-badge">IITM</div>
              <h3>{iitData.institution}</h3>
              <p className="degree-name">{iitData.degree}</p>
            </div>

            <div className="degree-stats">
              <div className="stat-item full-width">
                <div className="cgpa-display">
                  <motion.div
                    className="cgpa-value"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    {iitData.cgpa}
                  </motion.div>
                  <span className="cgpa-max">/ {iitData.maxCgpa}</span>
                </div>
                <span className="stat-label">CGPA (Till 5th Sem, Incl. Labs)</span>
              </div>
            </div>

            <motion.div
              className="phase-timeline"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h4>Academic Progression</h4>
              <div className="phases">
                {iitData.phases.map((phase, index) => (
                  <motion.div
                    key={index}
                    className={`phase-item ${phase.status}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  >
                    <div className="phase-icon">{phase.icon}</div>
                    <div className="phase-content">
                      <strong>{phase.name}</strong>
                      <span>{phase.description}</span>
                    </div>
                    {index < iitData.phases.length - 1 && (
                      <div className="phase-connector"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.button
              className="expand-btn"
              onClick={() => setExpandedIIT(!expandedIIT)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-expanded={expandedIIT}
              aria-label={expandedIIT ? 'Hide IITM current courses' : 'View IITM current courses'}
            >
              {expandedIIT ? 'Hide' : 'View'} Current Courses
              <span className={`arrow ${expandedIIT ? 'up' : 'down'}`} aria-hidden="true">▼</span>
            </motion.button>

            <AnimatePresence>
              {expandedIIT && (
                <motion.div
                  className="courses-section"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4>Diploma Level - Current Semester</h4>
                  <div className="courses-list">
                    {iitData.currentCourses.map((course, index) => (
                      <motion.div
                        key={index}
                        className="course-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <span className="course-code">{course.code}</span>
                        <div className="course-details">
                          <span className="course-name">{course.name}</span>
                          <span className="course-type">{course.type}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="projects-section">
                    <h5>Registered Projects</h5>
                    {iitData.currentProjects.map((project, index) => (
                      <div key={index} className="project-item">
                        <span className="project-icon">📋</span>
                        <span>{project.name}</span>
                        <span className="project-status">{project.status}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
};

export default DualDegree;
