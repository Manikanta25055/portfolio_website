import React, { memo } from 'react';

// The surface the journal rests on: a drafting mat under a reading lamp,
// with a ruled edge, registration marks and a drawing title block.
const RULER_MARKS = Array.from({ length: 40 }, (_, i) => i);

function Registration({ className }) {
  return (
    <svg className={`bk-desk-reg ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="9" />
      <circle cx="20" cy="20" r="3.5" />
      <path d="M20 2v36M2 20h36" />
    </svg>
  );
}

const Desk = memo(function Desk() {
  return (
    <div className="bk-desk" aria-hidden="true">
      <div className="bk-desk-lamp" />
      <div className="bk-desk-ruler is-top">
        {RULER_MARKS.map((i) => <span key={i} style={{ left: i * 100 }}>{i * 10}</span>)}
      </div>
      <div className="bk-desk-ruler is-left">
        {RULER_MARKS.slice(0, 24).map((i) => <span key={i} style={{ top: i * 100 }}>{i * 10}</span>)}
      </div>

      <Registration className="is-tl" />
      <Registration className="is-tr" />
      <Registration className="is-bl" />
      <Registration className="is-br" />

      <svg className="bk-desk-angles" viewBox="0 0 260 260" aria-hidden="true">
        <path d="M0 260L260 0M0 260L225 130M0 260L130 35" />
        <path d="M0 150a110 110 0 0 1 110 110" />
        <text x="178" y="40">45°</text>
        <text x="200" y="128">30°</text>
        <text x="104" y="22">60°</text>
      </svg>

      <div className="bk-titleblock">
        <div className="bk-titleblock-row is-title">
          <span>Title</span>
          <strong>A GVM’s Engineering Journal</strong>
        </div>
        <div className="bk-titleblock-grid">
          <span>Dwg no.<b>GVM-26-001</b></span>
          <span>Scale<b>1 : 1</b></span>
          <span>Sheet<b>1 of 1</b></span>
          <span>Rev.<b>C</b></span>
        </div>
        <div className="bk-titleblock-row">
          <span>Drawn</span>
          <strong>GVM · Hyderabad</strong>
          <span>Checked</span>
          <strong>MMXXVI</strong>
        </div>
      </div>
    </div>
  );
});

export default Desk;
