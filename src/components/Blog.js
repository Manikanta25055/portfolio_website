import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const posts = [
  {
    id: 'garuda-hailo',
    title: 'Building GARUDA: Sub-100ms AI Security on Raspberry Pi 5',
    date: 'April 2025',
    readTime: '6 min read',
    tags: ['AI', 'Hailo 8L', 'YOLOv8', 'GStreamer'],
    excerpt:
      'How we got real-time person detection running at 30 FPS with less than 100ms latency on edge hardware — and won IIT Madras Gadget Expo doing it.',
    content: `The challenge was straightforward on paper: detect a person in real-time, trigger an alarm, no cloud dependency. The execution was anything but simple.

The Hailo 8L AI accelerator gives the Raspberry Pi 5 about 13 TOPS of dedicated neural-network compute. But getting YOLOv8 to actually run on it requires compiling the model to Hailo's proprietary HEF format using their Dataflow Compiler. The first bottleneck: the compiler rejects any ONNX export that uses operations it doesn't support — and YOLOv8's post-processing head is one of them.

The fix was to split the model at the output of the backbone/neck, push just the feature extraction to the Hailo chip, and run the decode + NMS steps on the Pi's ARM cores. This also gives you the flexibility to tune confidence thresholds at runtime without recompiling.

For the video pipeline we used GStreamer with a custom appsink element. The key design decision: never copy frame buffers. GStreamer passes zero-copy references from the camera input all the way to the Hailo inference element. Any unnecessary memcpy between pipeline stages would have blown our latency budget.

The voice assistant (Narada) runs on a separate thread with a fixed 512-sample audio buffer. We used vosk for offline speech recognition — no internet required, 40MB model, surprisingly accurate for command-word tasks.

Multi-user authentication was the last piece. OTP generation via pyotp (TOTP, same algorithm as Google Authenticator) with a per-user secret key stored in a local encrypted SQLite DB. The entire auth flow takes under 1 second.

Final latency breakdown: camera → hailo inference: 28ms, NMS decode: 8ms, alarm trigger: 4ms. Total: ~40ms typical, 100ms worst-case under full CPU load. Well within the threshold for a real security system.`,
  },
  {
    id: 'modbus-esp32',
    title: 'MODBUS RTU from Scratch on ESP32-S3: Industrial Protocols for Students',
    date: 'February 2026',
    readTime: '5 min read',
    tags: ['ESP32', 'MODBUS RTU', 'RS485', 'Industrial'],
    excerpt:
      'Why your next measurement project should speak MODBUS, and how to implement a full RTU slave on the ESP32-S3 with DS18B20 sensors over RS485.',
    content: `MODBUS RTU is a 1979 protocol that still runs half the world's industrial equipment. Understanding it is one of the fastest ways to make your student projects look genuinely industry-relevant.

The physical layer is RS485 — differential signaling, up to 1.2km range, up to 32 devices on one bus. You need a MAX485 transceiver chip (about ₹60) between your ESP32's UART and the RS485 bus. The key wiring detail: tie DE and RE together and drive them with a single GPIO. High = transmit, low = receive.

The MODBUS frame structure is simple: device address (1 byte), function code (1 byte), data (N bytes), CRC-16 (2 bytes). Function code 0x03 (Read Holding Registers) is what you'll use 90% of the time. Holding registers are 16-bit values — for temperature from DS18B20, I multiply the float by 100 and store it as an integer (e.g., 24.5°C → register value 2450).

The DS18B20 uses 1-Wire protocol. All 8 sensors share a single GPIO pin with a 4.7kΩ pull-up resistor. Each sensor has a unique 64-bit ROM address so you can address them individually. The DallasTemperature library handles all of this, but it's worth understanding: the 1-Wire bus has a parasitic power mode where sensors draw power from the data line itself — useful when you need to minimize wiring.

The register map design matters. I allocated 27 holding registers: 8 raw temperature values, 8 calibrated values, then computed statistics (max, min, average, gradient, hotspot index). This gives the SCADA master everything it needs in two read operations.

The Python SCADA side uses minimalmodbus — a clean 200-line library that wraps pyserial. Set baud rate 9600, parity E (even), 1 stop bit (8E1 is the industrial default). Polling at 2 Hz gives you responsive heatmaps without starving the ESP32.

The visual result — a real-time 2D heatmap tracking a soldering iron across the sensor grid — is exactly the kind of demo that makes examiners stop and actually pay attention.`,
  },
  {
    id: 'active-balancing',
    title: 'Active Cell Balancing: Why Passive Isn\'t Good Enough for EVs',
    date: 'November 2024',
    readTime: '4 min read',
    tags: ['Power Electronics', 'BMS', 'LTSpice', 'EV'],
    excerpt:
      'Passive balancing just burns excess charge as heat. Here\'s how a flyback converter topology recycles that energy between cells — and why it gives you a 20-30% battery life increase.',
    content: `A lithium-ion battery pack is only as good as its weakest cell. In passive balancing, a resistor dissipates the charge from stronger cells until they match the weakest one. Simple, cheap, and wasteful — you're throwing away energy as heat.

Active balancing uses a converter to move energy from high-SoC cells to low-SoC cells. The flyback topology is the most cost-effective choice for this: one transformer, one switch (MOSFET), one diode, and you can transfer energy bidirectionally between any two cells with minimal additional circuitry per cell.

The flyback works in two phases. During the magnetization phase, the MOSFET closes and energy is stored in the transformer core as a magnetic field. During the demagnetization phase, the MOSFET opens and the stored energy is released through the secondary winding into the target cell. The key design parameter is the turns ratio — this sets the voltage conversion ratio and must account for the cell voltage differential you're trying to correct.

In LTSpice, the simulation challenge is modeling the transformer realistically. An ideal transformer with infinite inductance gives you perfect efficiency — not useful. You need to specify the magnetizing inductance (sets peak current), leakage inductance (causes voltage spikes at switching), and winding resistance (copper losses). For a 4S1P pack with cells ranging from 3.2V to 4.2V, I used Lm = 100μH, switching frequency 100kHz, and a 1:1 turns ratio.

The MOSFET gate driver timing matters significantly. Too short an on-time and you don't transfer meaningful energy. Too long and you saturate the core, which causes a non-linear drop in inductance and massive current spikes. A current-mode controller that terminates the on-time when magnetizing current hits a set threshold is the standard solution.

Transfer efficiency in simulation: 85-92% depending on the duty cycle and switching losses. Real silicon will be a few percent lower due to gate drive power and snubber losses. But even at 80% round-trip efficiency, you're recapturing energy that passive balancing throws away entirely — which translates directly to usable battery capacity and cycle life.`,
  },
];

const BlogModal = ({ post, onClose }) => (
  <AnimatePresence>
    {post && (
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-container blog-modal"
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 20 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          onClick={e => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div className="modal-content">
            <div className="blog-modal-meta">
              <span className="blog-date">{post.date}</span>
              <span className="blog-dot" />
              <span className="blog-read-time">{post.readTime}</span>
            </div>
            <h2 className="blog-modal-title">{post.title}</h2>
            <div className="blog-modal-tags">
              {post.tags.map(t => <span key={t} className="modal-tech-pill">{t}</span>)}
            </div>
            <div className="blog-body">
              {post.content.trim().split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Blog = () => {
  const [activePost, setActivePost] = useState(null);

  return (
    <section className="blog-section" id="blog">
      <motion.div
        className="section-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Writing</h2>

        <div className="blog-grid">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              className="blog-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              onClick={() => setActivePost(post)}
              role="button"
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setActivePost(post)}
            >
              <div className="blog-card-meta">
                <span className="blog-date">{post.date}</span>
                <span className="blog-dot" />
                <span className="blog-read-time">{post.readTime}</span>
              </div>
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-card-excerpt">{post.excerpt}</p>
              <div className="blog-card-tags">
                {post.tags.slice(0, 3).map(t => (
                  <span key={t} className="blog-tag">{t}</span>
                ))}
              </div>
              <div className="view-details">
                <span>Read post</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <BlogModal post={activePost} onClose={() => setActivePost(null)} />
    </section>
  );
};

export default Blog;
