import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ProjectModal from './ProjectModal';

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

const projects = [
  {
    id: "project-garuda",
    title: "Project GARUDA",
    subtitle: "AI-Powered Real-Time Security System",
    achievement: "1st Place - Gadget Expo 2025",
    description: "Built an insanely smart home security setup that actually sees and thinks. YOLOv8 running on a Pi 5 with Hailo AI - real-time detection that doesn't miss a beat.",
    tech: ["Python", "YOLOv8", "Hailo AI", "Raspberry Pi 5", "GStreamer", "OpenCV", "PyQt5"],
    githubLink: "https://github.com/Manikanta25055/Garuda",
    problemStatement: "Traditional security systems lack intelligent real-time threat detection and often generate false alarms. There was a need for an affordable, AI-powered security solution that could accurately detect persons in real-time with minimal latency.",
    solution: "Developed GARUDA, an AI-powered security system using Raspberry Pi 5 with Hailo 8L AI accelerator. Implemented YOLOv8 for person detection with GStreamer pipeline optimization, achieving real-time performance. Added voice-controlled interface using speech recognition and multi-user authentication with OTP verification.",
    keyFeatures: [
      "Real-time person detection using YOLOv8 with Hailo AI acceleration",
      "Multi-threaded processing for camera feed and AI inference",
      "Voice-controlled interface (Narada voice assistant)",
      "Multi-user GUI with OTP-based authentication",
      "Alert system with configurable notifications",
      "Hardware integration with HC-SR04 ultrasonic sensor backup"
    ],
    achievements: [
      { value: "1st Place", label: "IIT Madras Gadget Expo 2025" },
      { value: "<100ms", label: "Detection Latency" },
      { value: "30 FPS", label: "Real-time Processing" }
    ],
    timeline: "January 2025 - April 2025"
  },
  {
    id: "patient-collapse-detection",
    title: "Patient Collapse Detection System",
    subtitle: "Healthcare Innovation",
    achievement: "Patent Filed",
    description: "Cooked up a wearable that keeps tabs on your vitals 24/7 - non-invasive tech that spots trouble before it happens. Patent-worthy stuff right here.",
    tech: ["Biomedical Sensors", "Wearable Tech", "AI/ML", "Signal Processing", "IoT"],
    problemStatement: "Patient falls and collapses in healthcare facilities often go undetected for critical minutes, leading to delayed emergency response. Existing monitoring systems are either invasive, expensive, or generate high false alarm rates.",
    solution: "Designed a non-invasive patient monitoring system combining multiple vital sign sensors with machine learning algorithms. The system continuously monitors heart rate, respiratory rate, and motion patterns to detect anomalies indicative of patient collapse or distress.",
    keyFeatures: [
      "Multi-modal vital sign monitoring (heart rate, respiration, motion)",
      "Machine learning-based anomaly detection",
      "Non-invasive wearable sensor integration",
      "Real-time alert system to healthcare staff",
      "Low-power design for extended battery life",
      "Privacy-preserving data processing"
    ],
    achievements: [
      { value: "Patent Filed", label: "February 2025" },
      { value: "95%+", label: "Detection Accuracy" },
      { value: "<2s", label: "Alert Response Time" }
    ],
    timeline: "November 2024 - February 2025"
  },
  {
    title: "Active Battery Cell Equalization",
    subtitle: "Electric Vehicle Technology",
    achievement: "20-30% Lifespan Increase",
    description: "Designed a sick flyback converter that shuffles energy between battery cells - basically giving EVs a 30% longer lifespan. Power electronics go brrrr.",
    tech: ["Power Electronics", "EV Systems", "BMS", "LTSpice", "Circuit Design"],
    githubLink: "https://github.com/Manikanta25055/Active_Battery_cell_Equalisation",
    problemStatement: "Lithium-ion battery packs in electric vehicles suffer from cell imbalance, where individual cells charge and discharge at different rates. This reduces overall pack capacity, efficiency, and lifespan.",
    solution: "Implemented an active cell equalization system using flyback converter topology for bidirectional energy transfer between cells. The system monitors individual cell voltages and actively transfers charge from higher voltage cells to lower voltage cells.",
    keyFeatures: [
      "Flyback converter-based bidirectional charge transfer",
      "Individual cell voltage monitoring",
      "Automated balancing algorithm",
      "High efficiency energy transfer (>85%)",
      "Integration with Battery Management System (BMS)"
    ],
    achievements: [
      { value: "20-30%", label: "Battery Life Increase" },
      { value: "85%+", label: "Transfer Efficiency" },
      { value: "15%", label: "Capacity Improvement" }
    ],
    timeline: "August 2024 - November 2024"
  },
  {
    title: "Active Suspension System",
    subtitle: "Control Systems Design",
    achievement: "15.24 dB Vibration Reduction",
    description: "Built a PID controller that absolutely destroys road vibrations - 15dB reduction means your coffee stays in the cup. Control theory actually being useful for once.",
    tech: ["Control Systems", "PID", "MATLAB", "Simulink", "System Modeling"],
    githubLink: "https://github.com/Manikanta25055/Active_Suspension_system",
    problemStatement: "Passive suspension systems in vehicles cannot adapt to varying road conditions, resulting in poor ride comfort and handling. There was a need for an intelligent suspension system that could actively respond to road disturbances.",
    solution: "Designed and simulated an active suspension system using PID control methodology in MATLAB/Simulink. The system uses accelerometer feedback to adjust damping forces in real-time, significantly reducing vehicle body vibrations.",
    keyFeatures: [
      "PID controller with optimized tuning parameters",
      "Real-time vibration sensing and actuation",
      "MATLAB/Simulink simulation and validation",
      "Comparative analysis with passive systems",
      "Road disturbance rejection capability"
    ],
    achievements: [
      { value: "15.24 dB", label: "Vibration Reduction" },
      { value: "60%", label: "Settling Time Improvement" },
      { value: "<5%", label: "Steady-State Error" }
    ],
    timeline: "March 2024 - June 2024"
  },
  {
    title: "Secure Communication System",
    subtitle: "Digital Communication & Encryption",
    achievement: "14.91 dB Processing Gain",
    description: "Engineered a military-grade comms system using spread spectrum - 15dB processing gain means good luck trying to jam this bad boy. Encryption that actually slaps.",
    tech: ["MATLAB", "DSSS", "Digital Signal Processing", "Encryption", "Communication Theory"],
    githubLink: "https://github.com/Manikanta25055/Secure_Communication_System",
    problemStatement: "Traditional communication systems are vulnerable to eavesdropping and jamming attacks. Sensitive data transmission requires robust protection against both unauthorized interception and intentional interference, especially in wireless environments.",
    solution: "Developed a multi-layered secure communication system combining Direct Sequence Spread Spectrum (DSSS) modulation with XOR-based encryption. The system uses a 31-chip spreading factor for signal spreading and correlation-based despreading at the receiver, providing both security and jamming resistance.",
    keyFeatures: [
      "Direct Sequence Spread Spectrum with 31 chips/bit spreading factor",
      "XOR-based encryption with pseudo-random key stream",
      "Correlation-based despreading for signal recovery",
      "AWGN channel modeling with narrowband jamming simulation",
      "BER performance analysis across 4 scenarios",
      "Processing gain of 14.91 dB for noise suppression"
    ],
    achievements: [
      { value: "14.91 dB", label: "Processing Gain" },
      { value: "10 dB", label: "Jamming Suppression" },
      { value: "4 Scenarios", label: "BER Analysis" }
    ],
    timeline: "November 2024"
  },
  {
    title: "Speech Denoising using Spectral Subtraction",
    subtitle: "Digital Signal Processing",
    achievement: "5-10 dB SNR Improvement",
    description: "Made noisy audio crystal clear using FFT magic - spectral subtraction that cleans up speech like nobody's business. DSP wizardry at its finest.",
    tech: ["MATLAB", "FFT/IFFT", "Spectral Analysis", "Audio Processing", "Signal Processing"],
    githubLink: "https://github.com/Manikanta25055/Speech_Denoising_Using_Spectral_Subtraction",
    problemStatement: "Speech signals are often corrupted by background noise in real-world applications such as telecommunication, voice recognition, and hearing aids. Traditional time-domain filtering methods struggle with non-stationary noise, requiring more sophisticated frequency-domain techniques.",
    solution: "Implemented a spectral subtraction algorithm using N-point Fast Fourier Transform to transform signals into the frequency domain. The system estimates noise characteristics from silent frames and subtracts the noise spectrum from the noisy speech spectrum, with spectral floor protection to prevent over-subtraction artifacts.",
    keyFeatures: [
      "Frame-based processing with Hamming windowing",
      "N-point FFT for frequency domain transformation",
      "Adaptive noise spectrum estimation",
      "Spectral subtraction with over-subtraction factor",
      "Spectral floor to prevent musical noise artifacts",
      "Overlap-add synthesis for signal reconstruction"
    ],
    achievements: [
      { value: "5-10 dB", label: "SNR Improvement" },
      { value: ">0.85", label: "Correlation" },
      { value: "2.5-3.5", label: "PESQ Score" }
    ],
    timeline: "October 2024"
  },
  {
    title: "Power Quality Analysis using DTFS",
    subtitle: "Power Systems & Harmonic Analysis",
    achievement: "IEEE 519 Compliance",
    description: "Built a power quality analyzer that catches nasty harmonics red-handed - DTFS-powered THD calculations keeping the grid IEEE 519 compliant. Clean power or bust.",
    tech: ["MATLAB", "DTFS", "Power Systems", "Harmonic Analysis", "IEEE 519"],
    githubLink: "https://github.com/Manikanta25055/Power_Quality_Analysis_Using_DTFS",
    problemStatement: "Modern electrical loads like LED lighting, variable frequency drives, and switch-mode power supplies introduce harmonic distortion into power systems. This degrades power quality, increases losses, causes equipment malfunction, and violates IEEE 519 standards.",
    solution: "Developed a MATLAB-based power quality analysis tool using Discrete-Time Fourier Series (DTFS) to decompose distorted power signals into harmonic components. The system analyzes multiple real-world scenarios (LED lighting, motor drives, data centers), calculates comprehensive power quality metrics, and designs harmonic filters for mitigation.",
    keyFeatures: [
      "DTFS-based harmonic content extraction",
      "Total Harmonic Distortion (THD) calculation",
      "IEEE 519 compliance assessment",
      "Power factor and K-factor computation",
      "Harmonic filter design for mitigation",
      "Multiple real-world scenario analysis"
    ],
    achievements: [
      { value: "<5%", label: "THD after Filtering" },
      { value: "3 Scenarios", label: "Industrial Cases" },
      { value: "IEEE 519", label: "Compliance" }
    ],
    timeline: "October 2024"
  }
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0 });

  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useReducedMotion();

  const shouldAnimate = useMemo(() => {
    return !isMobile && !prefersReducedMotion;
  }, [isMobile, prefersReducedMotion]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e, project) => {
    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // Only trigger click if movement was less than 10px (a tap, not a scroll)
    if (deltaX < 10 && deltaY < 10) {
      handleProjectClick(project);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const cardVariants = (index) => ({
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: shouldAnimate ? index * 0.1 : 0
      }
    }
  });

  const SectionContainer = shouldAnimate ? motion.div : 'div';
  const TitleContainer = shouldAnimate ? motion.h2 : 'h2';
  const CardContainer = shouldAnimate ? motion.div : 'div';

  return (
    <section className="projects" id="projects">
      <SectionContainer
        className="section-container"
        {...(shouldAnimate && {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, amount: 0.05, margin: "200px 0px -200px 0px" },
          variants: containerVariants
        })}
      >
        <TitleContainer
          className="section-title"
          {...(shouldAnimate && {
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true, margin: "0px 0px -50px 0px" },
            variants: titleVariants
          })}
        >
          Featured Projects
        </TitleContainer>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <CardContainer
              key={index}
              id={project.id}
              className={`project-card ${index === 0 ? 'featured' : ''}`}
              {...(shouldAnimate && {
                initial: "hidden",
                whileInView: "visible",
                viewport: { once: true, amount: 0.1, margin: "150px 0px -150px 0px" },
                variants: cardVariants(index),
                whileHover: { y: -10, transition: { duration: 0.3 } }
              })}
              onClick={() => handleProjectClick(project)}
              onTouchStart={handleTouchStart}
              onTouchEnd={(e) => handleTouchEnd(e, project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleProjectClick(project);
                }
              }}
              style={!shouldAnimate ? { opacity: 1, transform: 'none' } : {}}
            >
              <div className="project-badge">{project.achievement}</div>
              <h3>{project.title}</h3>
              <h4>{project.subtitle}</h4>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.tech.map((tech, i) => (
                  <span key={i}>{tech}</span>
                ))}
              </div>
              <div className="view-details">
                <span>View Details</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </CardContainer>
          ))}
        </div>
      </SectionContainer>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Projects;
