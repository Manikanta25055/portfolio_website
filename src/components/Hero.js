import React from 'react';

const BARS = [2,1,3,1,2,3,1,2,1,3,2,1,3,1,2,1,3,2,1,2,1,3,2,1,2,3,1,2,1,2];

const Hero = () => (
  <div className="pass-doc">
    {/* Airline header strip */}
    <div className="pass-header">
      <span className="pass-airline">GVM-001</span>
      <span className="pass-type">BOARDING PASS</span>
      <span className="pass-class">EEE</span>
    </div>

    {/* Route row */}
    <div className="pass-route">
      <div className="pass-terminus">
        <div className="pass-iata">MIT</div>
        <div className="pass-city">MANIPAL</div>
      </div>
      <div className="pass-flight-info">
        <svg className="pass-arrow-svg" viewBox="0 0 80 20" fill="none">
          <path d="M2 10h76M62 3l14 7-14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="pass-flight-num">FL GVM-001</div>
      </div>
      <div className="pass-terminus pass-terminus--right">
        <div className="pass-iata">IIT-M</div>
        <div className="pass-city">MADRAS</div>
      </div>
    </div>

    {/* Passenger block */}
    <div className="pass-passenger">
      <div className="pass-label">PASSENGER NAME</div>
      <div className="pass-name">VEERA MANIKANTA GONUGONDLA</div>
    </div>

    {/* Field grid */}
    <div className="pass-fields">
      <div className="pass-field">
        <div className="pass-label">ROLE</div>
        <div className="pass-val">EEE ENGINEER</div>
      </div>
      <div className="pass-field">
        <div className="pass-label">GATE</div>
        <div className="pass-val">FPGA-7</div>
      </div>
      <div className="pass-field">
        <div className="pass-label">CLASS</div>
        <div className="pass-val">EMBEDDED</div>
      </div>
      <div className="pass-field">
        <div className="pass-label">SEAT</div>
        <div className="pass-val">01-A</div>
      </div>
      <div className="pass-field">
        <div className="pass-label">BOARDING</div>
        <div className="pass-val">HYDERABAD</div>
      </div>
      <div className="pass-field">
        <div className="pass-label">DEPARTS</div>
        <div className="pass-val">2023 &#8594; &#8734;</div>
      </div>
    </div>

    {/* Achievement stamps */}
    <div className="pass-stamps">
      <div className="pass-stamp pass-stamp--gold">
        <div className="pass-stamp-main">1ST PLACE</div>
        <div className="pass-stamp-sub">GADGET EXPO · IIT-M 2025</div>
      </div>
      <div className="pass-stamp pass-stamp--blue">
        <div className="pass-stamp-main">PATENT FILED</div>
        <div className="pass-stamp-sub">BIOMEDICAL SYS · 2025</div>
      </div>
      <div className="pass-stamp pass-stamp--dim">
        <div className="pass-stamp-main">INTERN</div>
        <div className="pass-stamp-sub">APSIS SOLUTIONS · 2025</div>
      </div>
    </div>

    {/* Perforation */}
    <div className="pass-perf">
      <span className="pass-perf-label">TEAR HERE</span>
    </div>

    {/* Stub */}
    <div className="pass-stub">
      <div className="pass-stub-info">
        <div className="pass-stub-name">GONUGONDLA V.M.</div>
        <div className="pass-stub-route">MIT  ›  IIT-M</div>
        <div className="pass-stub-tagline">Hardware meets software — silicon that thinks</div>
        <div className="pass-stub-links">
          <a href="mailto:mgonugondlamanikanta@gmail.com" className="pass-stub-link">EMAIL</a>
          <span className="pass-stub-sep">·</span>
          <a href="https://github.com/Manikanta25055" target="_blank" rel="noreferrer" className="pass-stub-link">GITHUB</a>
        </div>
      </div>
      <div className="pass-barcode">
        {BARS.map((_, i) => (
          <div
            key={i}
            className="pass-bar"
            style={{ width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '2px' : '1px', marginRight: '1px' }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default Hero;
