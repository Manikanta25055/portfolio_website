import React, { memo } from 'react';
import { PERSONAL } from '../data/portfolio';

// A small quad-flat package, drawn as if blind-stamped into the cloth.
function ChipStamp({ className }) {
  const pins = Array.from({ length: 7 }, (_, i) => 22 + i * 9.4);
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      <rect x="24" y="24" width="72" height="72" rx="3" />
      <rect x="36" y="36" width="48" height="48" rx="1.5" className="is-die" />
      <circle cx="31" cy="31" r="2.2" className="is-dot" />
      {pins.map((p) => (
        <g key={p}>
          <path d={`M${p + 4} 24V12M${p + 4} 96V108M24 ${p + 4}H12M96 ${p + 4}H108`} />
        </g>
      ))}
    </svg>
  );
}

export const FrontCover = memo(function FrontCover() {
  return (
    <div className="bk-cover is-front">
      <span className="bk-cover-joint" aria-hidden="true" />
      <ChipStamp className="bk-cover-stamp" />
      <div className="bk-label">
        <span className="bk-label-kicker">A working journal</span>
        <h1 className="bk-label-title">
          From Instruction Set
          <span>to Working System</span>
        </h1>
        <span className="bk-label-rule" aria-hidden="true" />
        <span className="bk-label-author">{PERSONAL.name}</span>
      </div>
      <span className="bk-cover-mark" aria-hidden="true">{PERSONAL.initials}</span>
    </div>
  );
});

export const BackCover = memo(function BackCover() {
  return (
    <div className="bk-cover is-back">
      <span className="bk-cover-joint" aria-hidden="true" />
      <div className="bk-label is-blurb">
        <p className="bk-blurb-quote">
          “I design digital hardware from the instruction set upward and get it running on a board.”
        </p>
        <p className="bk-blurb">
          A dual-core microcontroller that closes timing at 50 and 100 MHz. An edge-AI security
          system that took first place at the IITM Gadget Expo. A wearable patient monitor with a
          published patent. Two degrees at once, a summer at Boeing India, and a place waiting at
          Goldman Sachs.
        </p>
        <p className="bk-blurb">This is the working journal behind them.</p>
        <span className="bk-label-rule" aria-hidden="true" />
        <span className="bk-label-kicker">Hardware · Systems · Operations</span>
      </div>
      <span className="bk-cover-web">{PERSONAL.website}</span>
    </div>
  );
});

export const Pastedown = memo(function Pastedown({ side }) {
  return (
    <div className={`bk-pastedown is-${side}`}>
      <div className="bk-endpaper">
        {side === 'left' && (
          <div className="bk-bookplate">
            <span className="bk-bookplate-kicker">Ex libris</span>
            <ChipStamp className="bk-bookplate-chip" />
            <span className="bk-bookplate-line">From the workbench of</span>
            <span className="bk-bookplate-name">{PERSONAL.name}</span>
          </div>
        )}
      </div>
    </div>
  );
});
