import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const useMediaQuery = (query) => {
  const getMatches = (query) => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(() => getMatches(query));

  useEffect(() => {
    const media = window.matchMedia(query);

    const updateMatch = () => {
      setMatches(media.matches);
    };

    updateMatch();
    media.addEventListener('change', updateMatch);

    return () => media.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
};

const WorkTimeline = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useReducedMotion();

  const shouldAnimate = useMemo(() => {
    return !isMobile && !prefersReducedMotion;
  }, [isMobile, prefersReducedMotion]);

  const experiences = [
    {
      role: "Project Intern",
      company: "Apsis Solutions",
      location: "Bangalore, India",
      period: "July 2025 - September 2025",
      current: false,
      description: "Diving deep into IoT solutions that actually matter - building stuff for banks, supply chains, and telecom giants. Learning from the best while shipping real products.",
      skills: ["IoT Development", "Industry Solutions", "Mentorship", "Technical Leadership"]
    },
    {
      role: "Project Intern",
      company: "Mindenious Edutech",
      location: "Bangalore, India",
      period: "July 2025 - September 2025",
      current: false,
      description: "Getting my hands dirty with hardcore VLSI - FPGAs, RTL design, the whole ASIC flow. Writing testbenches that actually catch bugs before they become disasters.",
      skills: ["FPGA Validation", "RTL Design", "Verification", "Test Bench Development", "ASIC Design Flow"]
    },
    {
      role: "Summer School Participant",
      company: "IIIT Hyderabad",
      location: "Hyderabad, India",
      period: "June 2024 - July 2024",
      description: "Leveled up my product game at one of India's top tech schools - learned how to turn wild ideas into actual products people want to use.",
      skills: ["Product Development", "Project Management", "Innovation Strategy"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const itemVariants = (index) => ({
    hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: shouldAnimate ? index * 0.2 : 0 }
    }
  });

  const [expandedIdx, setExpandedIdx] = useState(null);

  const SectionContainer = shouldAnimate ? motion.div : 'div';
  const TitleContainer = shouldAnimate ? motion.h2 : 'h2';
  const TimelineItem = shouldAnimate ? motion.div : 'div';
  const TimelineContent = shouldAnimate ? motion.div : 'div';

  return (
    <section className="work-timeline" id="experience">
      <SectionContainer
        className="section-container"
        {...(shouldAnimate && {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, amount: 0.1 },
          variants: containerVariants
        })}
      >
        <TitleContainer
          className="section-title"
          {...(shouldAnimate && {
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true },
            variants: titleVariants
          })}
        >
          Work Experience
        </TitleContainer>

        {/* Desktop: classic timeline */}
        <div className="timeline timeline-desktop">
          {experiences.map((exp, index) => (
            <TimelineItem
              key={index}
              className="timeline-item"
              {...(shouldAnimate && {
                initial: "hidden",
                whileInView: "visible",
                viewport: { once: true, amount: 0.3 },
                variants: itemVariants(index)
              })}
              style={!shouldAnimate ? { opacity: 1, transform: 'none' } : {}}
            >
              <div className="timeline-marker">
                <div className="timeline-dot"></div>
              </div>
              <TimelineContent
                className="timeline-content"
                {...(shouldAnimate && {
                  whileHover: { y: -5, boxShadow: "0 12px 32px rgba(255, 107, 53, 0.2)" },
                  transition: { duration: 0.3 }
                })}
              >
                {exp.current && <div className="current-badge">Current</div>}
                <h3>{exp.role}</h3>
                <h4>{exp.company}</h4>
                <div className="timeline-meta">
                  <span className="timeline-location">{exp.location}</span>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                <p>{exp.description}</p>
                <div className="timeline-skills">
                  {exp.skills.map((skill, idx) => (
                    <span key={idx} className="timeline-skill">{skill}</span>
                  ))}
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </div>

        {/* Mobile: expandable mission cards */}
        <div className="timeline-mobile">
          {experiences.map((exp, index) => {
            const isOpen = expandedIdx === index;
            return (
              <motion.div
                key={index}
                className="tl-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  className={`tl-card-header ${isOpen ? 'open' : ''}`}
                  onClick={() => setExpandedIdx(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="tl-num">0{index + 1}</span>
                  <div className="tl-header-main">
                    <span className="tl-company">{exp.company}</span>
                    <span className="tl-role">{exp.role}</span>
                    <span className="tl-period">{exp.period.split(' - ')[0]}</span>
                  </div>
                  <motion.span
                    className="tl-chevron"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="tl-card-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="tl-body-inner">
                        <p className="tl-location">{exp.location}</p>
                        <p className="tl-desc">{exp.description}</p>
                        <div className="tl-skills">
                          {exp.skills.map((skill, idx) => (
                            <span key={idx} className="timeline-skill">{skill}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </SectionContainer>
    </section>
  );
};

export default WorkTimeline;
