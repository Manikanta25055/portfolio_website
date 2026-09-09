export const PERSONAL = {
  name: 'Veera Manikanta Gonugondla',
  initials: 'GVM',
  title: 'Electrical & Electronics Engineer',
  focus: 'Digital hardware, embedded systems, and edge AI',
  email: 'manikantagonugondla@gmail.com',
  phone: '+91 83319 01122',
  phoneHref: '+918331901122',
  github: 'github.com/Manikanta25055',
  linkedin: 'linkedin.com/in/manikanta-gonugondla-349bb729a',
  website: 'veeramanikanta.in',
  location: 'Hyderabad, India',
  summary: 'I design digital hardware from the instruction set upward and get it running on real boards. My work spans RTL and FPGA implementation, embedded systems, edge AI, and engineering analytics.',
};

export const UPCOMING_ROLE = {
  role: 'Operations Analyst',
  company: 'Goldman Sachs',
  label: 'Upcoming',
};

export const STATS = [
  { value: '6', label: 'Featured systems' },
  { value: '2', label: 'Indian patent applications' },
  { value: '126', label: 'Self-checking MAK8u tests' },
  { value: '1st', label: 'IITM Gadget Expo' },
];

export const EDUCATION = [
  {
    institution: 'Manipal Institute of Technology, Manipal',
    shortName: 'MIT Manipal',
    degree: 'BTech, Electrical & Electronics Engineering',
    period: 'Jul 2023 - Sep 2027',
    cgpa: '8.07 / 10',
    progress: 'Through 6th semester',
    detail: 'Minor in Computational Intelligence',
    logo: '/logos/manipal.png',
  },
  {
    institution: 'Indian Institute of Technology Madras',
    shortName: 'IIT Madras',
    degree: 'BS, Electronic Systems',
    period: 'Jul 2023 - Dec 2027',
    cgpa: '7.33 / 10',
    progress: 'Through 7th semester',
    detail: 'Open-entry online BS pursued concurrently with the on-campus BTech',
    logo: '/logos/iitm.png',
  },
];

export const EXPERIENCE = [
  {
    role: 'Systems & Digital Engineering Intern',
    company: 'Boeing India Private Limited',
    period: 'May 2026 - Jul 2026',
    logo: '/logos/boeing.png',
    bullets: [
      'Built a fleet-maintenance analytics platform with Python, FastAPI, React, and TypeScript that answers queries across 6,900+ maintenance records in under a second.',
      'Created a forecasting engine that selects among 11 algorithms across a 24-feature pipeline, cutting error by up to 50% against linear interpolation.',
      'Trained an 82-feature XGBoost failure-prediction model (F1 0.964, ROC-AUC 0.952) with SHAP explainability; risk alerts save 40+ engineering hours each month.',
    ],
    skills: ['Python', 'FastAPI', 'React', 'TypeScript', 'XGBoost', 'SHAP', 'RAG'],
  },
  {
    role: 'Project Intern',
    company: 'Mindenious Edutech',
    period: 'Jul 2025 - Oct 2025',
    bullets: [
      'Completed a VLSI and ASIC design programme using commercial EDA tools.',
      'Wrote Verilog and SystemVerilog RTL with self-checking testbenches through synthesis to FPGA.',
      'Measured functional coverage and analysed timing and area trade-offs across synthesis constraints.',
    ],
    skills: ['Verilog', 'SystemVerilog', 'RTL', 'Verification', 'Synthesis', 'FPGA'],
  },
  {
    role: 'Project Intern',
    company: 'Apsis Solutions & IIT Guwahati',
    period: 'Jul 2025 - Oct 2025',
    bullets: [
      'Built a factory-automation monitoring system covering 13 machines and reduced manual check time by 89%.',
      'Instrumented the floor for continuous machine-status capture in one live supervisor view.',
      'Worked with IIT Guwahati mentors to validate monitoring accuracy against manual floor logs.',
    ],
    skills: ['Industrial IoT', 'Monitoring', 'Automation', 'Validation'],
  },
  {
    role: 'Summer School - Product Development Management',
    company: 'IIIT Hyderabad',
    period: 'Jul 2024 - Aug 2024',
    bullets: [
      'Studied product lifecycle, market analysis, and innovation strategy, then carried a concept from market study to pitched prototype.',
      'Presented the prototype and go-to-market plan to mentors and industry reviewers.',
    ],
    skills: ['Product Strategy', 'Market Analysis', 'Prototyping'],
  },
];

export const PROJECTS = [
  {
    id: 'mak8u',
    title: 'MAK8u',
    subtitle: 'Asymmetric dual-core microcontroller',
    period: 'Jun 2025 - Present',
    badge: 'Custom ISA + RTL',
    overview: 'A dual-core 8-bit microcontroller built from its own 54-instruction ISA. One core runs five stages at 50 MHz for predictable timing; the other runs seven at 100 MHz for throughput.',
    highlights: [
      'Both clocks close post-route on Artix-7 with WNS +0.452 ns and +0.480 ns and positive hold slack.',
      '126 self-checking testbenches pass before every synthesis; five mutation campaigns caught tests that only looked strong.',
      'Two cores share memory at an exact 2:1 ratio, with worst-case wait reporting, DMA, and SPI, I2C, UART, GPIO, PWM, and XADC peripherals.',
      'Patent draft in progress for repeatable inter-core timing across rationally related clock domains.',
    ],
    metrics: [
      { value: '50/100', label: 'MHz dual clocks' },
      { value: '126', label: 'testbenches' },
      { value: '8,823', label: 'Artix-7 LUTs' },
      { value: '54', label: 'ISA instructions' },
    ],
    stack: ['SystemVerilog', 'Vivado', 'Tcl', 'Verilator', 'Python', 'Nexys A7'],
    link: 'https://github.com/Manikanta25055/MAK-8',
  },
  {
    id: 'garuda',
    title: 'Project Garuda',
    subtitle: 'Edge-AI home security & surveillance',
    period: 'Jan 2025 - Present',
    badge: 'IITM Gadget Expo - 1st place',
    overview: 'A fully local surveillance stack: detection runs on-device, no cloud is required, and no video leaves the home.',
    highlights: [
      'INT8-quantized YOLOv8s inference reaches 52.2 FPS at 18.4 ms latency and 0.854 mAP@0.5.',
      'Runs on a Raspberry Pi 5 with a Hailo-8L M.2 AI HAT under a 5.8 W total power budget.',
      'Co-inventor on Indian Patent Application No. 202641090505; research paper in preparation.',
    ],
    metrics: [
      { value: '52.2', label: 'FPS' },
      { value: '18.4', label: 'ms latency' },
      { value: '0.854', label: 'mAP@0.5' },
      { value: '5.8 W', label: 'system power' },
    ],
    stack: ['Raspberry Pi 5', 'Hailo-8L', 'YOLOv8s', 'Python'],
    link: 'https://github.com/Manikanta25055/Garuda_26',
  },
  {
    id: 'breadth',
    title: 'Project bREADth',
    subtitle: 'Non-invasive multi-modal patient monitor',
    period: 'Mar 2025 - Present',
    badge: 'Patent published',
    overview: 'A wearable monitor for continuous vital signs and early-collapse detection, paired with a macOS app for multi-patient floor-plan tracking.',
    highlights: [
      'An embedded Random Forest detects falls from 104 features; a local RAG agent supports vital-sign diagnostics and clinical-handbook queries.',
      'Indian Patent Application No. 202541059846 was published in Aug 2026.',
      'The manuscript is under review at IEEE Sensors Journal.',
    ],
    metrics: [
      { value: '104', label: 'model features' },
      { value: 'Local', label: 'RAG diagnostics' },
      { value: 'Multi', label: 'modal sensing' },
      { value: 'IEEE', label: 'under review' },
    ],
    stack: ['Sensor Fusion', 'DSP', 'SwiftUI', 'MQTT', 'scikit-learn'],
    link: 'https://github.com/Manikanta25055/bREADth',
  },
  {
    id: 'thermal',
    title: '8-Channel Thermal Profiling',
    subtitle: 'Industrial heatmap and hotspot analysis',
    period: 'Feb 2025',
    badge: 'Industrial monitoring',
    overview: 'Eight DS18B20 sensors on a single 1-Wire GPIO feed an ESP32-S3, exposed as a MODBUS RTU slave over RS-485.',
    highlights: [
      'A macOS SCADA dashboard provides live 2D heatmaps, 3D surface plots, hotspot analysis, and CSV logging.',
      'A real-time Isolation Forest detects thermal anomalies.',
    ],
    metrics: [
      { value: '8', label: 'temperature channels' },
      { value: '1-Wire', label: 'sensor bus' },
      { value: 'RS-485', label: 'field bus' },
      { value: 'Live', label: 'anomaly detection' },
    ],
    stack: ['ESP32-S3', 'DS18B20', 'MODBUS RTU', 'Python', 'PyQt5', 'SwiftUI'],
    link: 'https://github.com/Manikanta25055/Thermal_Profiling',
  },
  {
    id: 'battery',
    title: 'Active Battery Cell Equalization',
    subtitle: 'Bidirectional flyback BMS for EV applications',
    period: 'Sep 2025 - Oct 2025',
    badge: 'Power electronics',
    overview: 'An active battery-management system that moves charge between series-connected Li-ion cells instead of dissipating it resistively.',
    highlights: [
      'A proportional duty-cycle controller with dynamic threshold monitoring drives peak inter-cell divergence from about 1.3 V to near zero.',
      'The active strategy avoids the persistent imbalance observed under passive balancing.',
    ],
    metrics: [
      { value: '~1.3 V', label: 'initial divergence' },
      { value: '~0 V', label: 'final divergence' },
      { value: 'Active', label: 'energy transfer' },
      { value: 'Dynamic', label: 'threshold control' },
    ],
    stack: ['MATLAB', 'Simulink', 'Power Electronics', 'BMS'],
    link: 'https://github.com/Manikanta25055/Active_Battery_cell_Equalisation',
  },
  {
    id: 'smart-factory',
    title: 'Smart Factory with IoT',
    subtitle: 'Live industrial automation monitoring',
    period: 'Sep 2025 - Oct 2025',
    badge: 'Factory automation',
    overview: 'A continuous machine-status monitoring system that consolidates an instrumented factory floor into one live supervisor view.',
    highlights: [
      'Covered 13 machines and reduced manual status-check time by 89%.',
      'Validated monitoring accuracy against manual floor logs with mentors from IIT Guwahati.',
      'Designed for practical, cross-machine visibility rather than isolated sensor demonstrations.',
    ],
    metrics: [
      { value: '13', label: 'machines monitored' },
      { value: '89%', label: 'less check time' },
      { value: 'Live', label: 'supervisor view' },
      { value: 'IoT', label: 'factory telemetry' },
    ],
    stack: ['Industrial IoT', 'Sensors', 'Data Acquisition', 'Monitoring', 'Validation'],
    link: null,
  },
];

export const SKILL_GROUPS = [
  {
    title: 'RTL & architecture',
    items: ['SystemVerilog', 'Verilog', 'RTL design', 'Computer architecture', 'Pipelined cores', 'Hazard detection & forwarding', 'FSM & datapath design', 'Clock-domain crossing', 'Memory arbitration', 'ISA definition'],
  },
  {
    title: 'Verification & implementation',
    items: ['Self-checking testbenches', 'Mutation testing', 'Functional coverage', 'Waveform & ILA debug', 'Synthesis', 'Post-route timing closure', 'AMD Vivado', 'Verilator', 'Nexys A7'],
  },
  {
    title: 'Embedded & tools',
    items: ['C', 'Embedded C', 'Assembly', 'Python', 'MATLAB', 'Tcl', 'Bash', 'Raspberry Pi', 'ESP32', 'Arduino', 'FreeRTOS', 'Git', 'Linux'],
  },
  {
    title: 'Interfaces & instrumentation',
    items: ['SPI', 'I2C', 'UART', 'GPIO', 'PWM', 'XADC', 'MQTT', 'MODBUS RTU', 'RS-485', 'PCB-level debugging', 'Oscilloscopes', 'Logic analysers'],
  },
];

export const RESEARCH = [
  {
    type: 'Patent',
    title: 'Project Garuda',
    status: 'Filed Jul 2026',
    detail: 'Indian Patent Application No. 202641090505. Co-inventor; research paper in preparation.',
  },
  {
    type: 'Patent + manuscript',
    title: 'Project bREADth',
    status: 'Published Aug 2026',
    detail: 'Indian Patent Application No. 202541059846. Co-inventor; manuscript under review at IEEE Sensors Journal.',
  },
];

export const CERTIFICATIONS = [
  { title: 'Computer Architecture Essentials on Arm', issuer: 'Arm Education', date: 'Aug 2026' },
  { title: 'FPGA Architecture Based System for Industrial Application', issuer: 'L&T Edutech', date: 'Aug 2026' },
  {
    title: 'CCL India FY26, CNSL Participant',
    issuer: 'Cisco',
    date: 'Mar 2026',
    credential: '88e5510a-7043-4a24-b101-dff4710fbad1',
  },
  { title: 'Claude Code in Action', issuer: 'Anthropic', date: 'Feb 2026' },
  { title: 'Introduction to MCP (Model Context Protocol)', issuer: 'Anthropic', date: 'Feb 2026' },
  { title: 'Simulink Fundamentals', issuer: 'MathWorks', date: 'Dec 2025' },
  { title: 'MATLAB Onramp', issuer: 'MathWorks', date: 'Sep 2025' },
  { title: 'Simulink Onramp', issuer: 'MathWorks', date: 'Sep 2025' },
  { title: 'Foundation in BS Electronic Systems', issuer: 'Indian Institute of Technology Madras', date: 'Dec 2024' },
];
