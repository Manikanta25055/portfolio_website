import React from 'react';
import { motion } from 'framer-motion';

const experiences = [
  {
    title: "Summer Intern",
    company: "Boeing",
    location: "Bangalore, India",
    date: "Summer 2026 (2 Months)",
    description: [
      "Selected for prestigious 2-month summer internship program",
      "Working on aerospace engineering and aviation technology projects",
      "Collaborating with global engineering teams on cutting-edge solutions",
      "Applying hardware-software integration skills to aerospace applications"
    ]
  },
  {
    title: "Project Intern",
    company: "Apsis Solutions & IIT Guwahati",
    location: "Bangalore, India",
    date: "Jul 2025 - Sep 2025",
    description: [
      "Selected for project-based IoT mentorship internship program",
      "Worked on IoT solutions for FMCG, Banking, and Telecom industries",
      "Collaborated remotely on innovative technology projects",
      "Gained hands-on experience in IoT development and implementation"
    ]
  },
  {
    title: "Project Intern",
    company: "Mindenious Edutech",
    location: "Bangalore, India",
    date: "Jul 2025 - Sep 2025",
    description: [
      "Completed comprehensive VLSI design training program",
      "Developed test benches for FPGA validation",
      "Created comprehensive test cases for digital circuit validation",
      "Built expertise in RTL design, verification, and synthesis"
    ]
  },
  {
    title: "Summer School Participant - Product Development Management",
    company: "International Institute of Information Technology, Hyderabad",
    location: "Hyderabad, India",
    date: "Jun 2024 - Jul 2024",
    description: [
      "Completed intensive summer school program on Product Development Management",
      "Gained exposure to industry-standard product development methodologies and practices",
      "Participated in workshops covering product lifecycle, market analysis, and innovation strategies",
      "Contact: Prof. Raghu Reddy, Chair, M.Tech in Product Design & Management, IIITH"
    ]
  }
];

const Experience = () => {
  return (
    <section className="experience" id="experience">
      <motion.div
        className="section-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Experience
        </motion.h2>

        <div className="timeline">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="timeline-item"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="timeline-dot" />
              <div className="timeline-content">
                <span className="timeline-date">{exp.date}</span>
                <h3>{exp.title}</h3>
                <h4>{exp.company}</h4>
                <p className="timeline-location">{exp.location}</p>
                <ul>
                  {exp.description.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Experience;
