import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CARD_COLORS = ['note-yellow', 'note-blue', 'note-green'];

const posts = [
  {
    id: 'garuda-hailo',
    title: 'Building GARUDA: Sub-100ms AI Security on Raspberry Pi 5',
    date: 'April 2025',
    readTime: '6 min',
    tags: ['AI', 'Hailo 8L', 'YOLOv8', 'GStreamer'],
    excerpt: 'How we got real-time person detection running at 30 FPS with < 100ms latency on edge hardware — and won IIT Madras Gadget Expo.',
    content: `The challenge was straightforward on paper: detect a person in real-time, trigger an alarm, no cloud dependency. The execution was anything but simple.

The Hailo 8L AI accelerator gives the Raspberry Pi 5 about 13 TOPS of dedicated neural-network compute. But getting YOLOv8 to actually run on it requires compiling the model to Hailo's proprietary HEF format using their Dataflow Compiler. The first bottleneck: the compiler rejects any ONNX export that uses operations it doesn't support — and YOLOv8's post-processing head is one of them.

The fix was to split the model at the output of the backbone/neck, push just the feature extraction to the Hailo chip, and run the decode + NMS steps on the Pi's ARM cores. This also gives you the flexibility to tune confidence thresholds at runtime without recompiling.

For the video pipeline we used GStreamer with a custom appsink element. The key design decision: never copy frame buffers. GStreamer passes zero-copy references from the camera input all the way to the Hailo inference element.

The voice assistant (Narada) runs on a separate thread with a fixed 512-sample audio buffer. We used vosk for offline speech recognition — no internet required, 40MB model, surprisingly accurate for command-word tasks.

Final latency breakdown: camera → hailo inference: 28ms, NMS decode: 8ms, alarm trigger: 4ms. Total: ~40ms typical, 100ms worst-case under full CPU load.`,
  },
  {
    id: 'modbus-esp32',
    title: 'MODBUS RTU from Scratch on ESP32-S3: Industrial Protocols for Students',
    date: 'February 2026',
    readTime: '5 min',
    tags: ['ESP32', 'MODBUS RTU', 'RS485', 'Industrial'],
    excerpt: 'Why your next measurement project should speak MODBUS, and how to implement a full RTU slave on ESP32-S3 with DS18B20 sensors over RS485.',
    content: `MODBUS RTU is a 1979 protocol that still runs half the world's industrial equipment. Understanding it is one of the fastest ways to make your student projects look genuinely industry-relevant.

The physical layer is RS485 — differential signaling, up to 1.2km range, up to 32 devices on one bus. You need a MAX485 transceiver chip between your ESP32's UART and the RS485 bus. The key wiring detail: tie DE and RE together and drive them with a single GPIO. High = transmit, low = receive.

The MODBUS frame structure is simple: device address (1 byte), function code (1 byte), data (N bytes), CRC-16 (2 bytes). Function code 0x03 (Read Holding Registers) is what you'll use 90% of the time.

The register map design matters. I allocated 27 holding registers: 8 raw temperature values, 8 calibrated values, then computed statistics (max, min, average, gradient, hotspot index). This gives the SCADA master everything it needs in two read operations.

Transfer efficiency in simulation: 85-92% depending on the duty cycle and switching losses.`,
  },
  {
    id: 'active-balancing',
    title: "Active Cell Balancing: Why Passive Isn't Good Enough for EVs",
    date: 'November 2024',
    readTime: '4 min',
    tags: ['Power Electronics', 'BMS', 'LTSpice', 'EV'],
    excerpt: 'Passive balancing burns excess charge as heat. Here is how a flyback converter topology recycles that energy between cells — 20-30% battery life increase.',
    content: `A lithium-ion battery pack is only as good as its weakest cell. In passive balancing, a resistor dissipates the charge from stronger cells until they match the weakest one. Simple, cheap, and wasteful.

Active balancing uses a converter to move energy from high-SoC cells to low-SoC cells. The flyback topology is the most cost-effective choice: one transformer, one switch (MOSFET), one diode, and you can transfer energy bidirectionally between any two cells.

The flyback works in two phases. During the magnetization phase, the MOSFET closes and energy is stored in the transformer core. During the demagnetization phase, the MOSFET opens and the stored energy is released through the secondary winding into the target cell.

In LTSpice, the simulation challenge is modeling the transformer realistically. For a 4S1P pack with cells ranging from 3.2V to 4.2V, I used Lm = 100uH, switching frequency 100kHz, and a 1:1 turns ratio.

Transfer efficiency in simulation: 85-92%. Real silicon will be a few percent lower — but even at 80% round-trip efficiency, you're recapturing energy that passive balancing throws away entirely.`,
  },
];

const BlogPostModal = ({ post, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!post) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <div className="modal-container blog-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <div className="modal-content">
              <div className="blog-modal-meta">
                <span className="blog-date">{post.date}</span>
                <span className="blog-dot" />
                <span className="blog-read-time">{post.readTime} read</span>
              </div>
              <h2 className="blog-modal-title">{post.title}</h2>
              <div className="blog-modal-tags">
                {post.tags.map(t => <span key={t} className="modal-tech-pill">{t}</span>)}
              </div>
              <div className="blog-body">
                {post.content.trim().split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const Blog = () => {
  const [activePost, setActivePost] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (post) => { setActivePost(post); setIsOpen(true); };
  const handleClose = () => { setIsOpen(false); setTimeout(() => setActivePost(null), 300); };

  return (
    <div className="notes-doc">
      {/* Header pin */}
      <div className="notes-header">
        <div className="notes-pin" />
        <div className="notes-header-text">
          <div className="notes-title-label">TECHNICAL WRITING</div>
          <div className="notes-subtitle">Field Notes &amp; Build Logs</div>
        </div>
      </div>

      {/* Stack of index cards */}
      <div className="notes-stack">
        {posts.map((post, i) => (
          <div
            key={post.id}
            className={`note-card note-card--${CARD_COLORS[i % CARD_COLORS.length]}`}
            onClick={() => handleOpen(post)}
            role="button"
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleOpen(post)}
          >
            <div className="note-card-lines" aria-hidden="true">
              {[0,1,2,3,4].map(n => <div key={n} className="note-line" />)}
            </div>
            <div className="note-card-content">
              <div className="note-meta">
                <span className="note-date">{post.date}</span>
                <span className="note-time">{post.readTime} read</span>
              </div>
              <div className="note-title">{post.title}</div>
              <div className="note-excerpt">{post.excerpt}</div>
              <div className="note-tags">
                {post.tags.slice(0, 3).map(t => (
                  <span key={t} className="note-tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="note-card-corner" />
          </div>
        ))}
      </div>

      <BlogPostModal post={activePost} isOpen={isOpen} onClose={handleClose} />
    </div>
  );
};

export default Blog;
