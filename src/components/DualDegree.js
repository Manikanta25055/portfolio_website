import React from 'react';

const mitCourses = [
  { code: "EE401", name: "Artificial Intelligence", grade: "A" },
  { code: "EE402", name: "Machine Learning", grade: "A-" },
  { code: "EE310", name: "Solid State Devices", grade: "B+" },
  { code: "EE320", name: "Consumer Electronics", grade: "A" },
  { code: "EE215", name: "Measurement & Instrumentation", grade: "B+" },
  { code: "MA301", name: "Engg Economics Fundamentals", grade: "A-" },
];

const iitCourses = [
  { code: "EC2001", name: "Computer Organisation", grade: "B+" },
  { code: "EC2002", name: "Testing and Measurement", grade: "A-" },
  { code: "EC2003", name: "Sensors and Applications", grade: "A" },
];

const DualDegree = () => (
  <div className="transcript-doc">
    {/* Institution 1 — MIT */}
    <div className="transcript-inst">
      <div className="transcript-letterhead">
        <div className="transcript-inst-seal">M</div>
        <div className="transcript-inst-info">
          <div className="transcript-inst-name">MANIPAL INSTITUTE OF TECHNOLOGY</div>
          <div className="transcript-inst-dept">Dept. of Electrical &amp; Electronics Engineering</div>
          <div className="transcript-inst-loc">Manipal, Karnataka, India</div>
        </div>
        <div className="transcript-inst-badge">
          <div className="transcript-badge-label">CGPA</div>
          <div className="transcript-badge-val">8.02</div>
          <div className="transcript-badge-denom">/ 10.0</div>
        </div>
      </div>

      <div className="transcript-rule" />

      <div className="transcript-meta-row">
        <span><span className="transcript-meta-key">DEGREE:</span> BTech EEE</span>
        <span><span className="transcript-meta-key">SEM:</span> 6 of 8</span>
        <span><span className="transcript-meta-key">PROGRESS:</span> 75%</span>
        <span><span className="transcript-meta-key">MINOR:</span> Computational Intelligence</span>
      </div>

      <table className="transcript-table">
        <thead>
          <tr>
            <th>CODE</th>
            <th>COURSE NAME</th>
            <th>GR</th>
          </tr>
        </thead>
        <tbody>
          {mitCourses.map((c) => (
            <tr key={c.code}>
              <td className="transcript-code">{c.code}</td>
              <td>{c.name}</td>
              <td className="transcript-grade">{c.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Binding fold / separator */}
    <div className="transcript-bind-sep">
      <div className="transcript-bind-holes">
        {[0,1,2].map(i => <div key={i} className="transcript-bind-hole" />)}
      </div>
      <div className="transcript-bind-label">DUAL DEGREE PROGRAMME</div>
    </div>

    {/* Institution 2 — IIT-M */}
    <div className="transcript-inst transcript-inst--iit">
      <div className="transcript-letterhead">
        <div className="transcript-inst-seal transcript-inst-seal--iit">I</div>
        <div className="transcript-inst-info">
          <div className="transcript-inst-name">INDIAN INSTITUTE OF TECHNOLOGY MADRAS</div>
          <div className="transcript-inst-dept">BS Electronic Systems — Online Degree Programme</div>
          <div className="transcript-inst-loc">Chennai, Tamil Nadu, India</div>
        </div>
        <div className="transcript-inst-badge">
          <div className="transcript-badge-label">CGPA</div>
          <div className="transcript-badge-val">7.33</div>
          <div className="transcript-badge-denom">/ 10.0</div>
        </div>
      </div>

      <div className="transcript-rule" />

      <div className="transcript-meta-row">
        <span><span className="transcript-meta-key">DEGREE:</span> BS Electronic Systems</span>
        <span><span className="transcript-meta-key">PHASE:</span> Diploma (Active)</span>
        <span><span className="transcript-meta-key">NEXT:</span> Degree Phase</span>
      </div>

      <table className="transcript-table">
        <thead>
          <tr>
            <th>CODE</th>
            <th>COURSE NAME</th>
            <th>GR</th>
          </tr>
        </thead>
        <tbody>
          {iitCourses.map((c) => (
            <tr key={c.code}>
              <td className="transcript-code">{c.code}</td>
              <td>{c.name}</td>
              <td className="transcript-grade">{c.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Footer */}
    <div className="transcript-footer">
      <div className="transcript-footer-seal">OFFICIAL TRANSCRIPT — ACADEMIC YEAR 2023 – PRESENT</div>
      <div className="transcript-footer-auth">Digitally Generated · Not Valid Without Registrar Seal</div>
    </div>
  </div>
);

export default DualDegree;
