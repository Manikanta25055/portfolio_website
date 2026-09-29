import React, { memo, useId } from 'react';
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

// Matte gold leaf: a narrow range of warm golds, no mirror-bright stops.
function FoilGradient({ id }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#d8bb78" />
      <stop offset="1" stopColor="#b48f4a" />
    </linearGradient>
  );
}

// A double rule pressed into the cloth without foil ("blind"), with printed-
// circuit traces running into each corner.
function BlindFrame() {
  const corner = (
    <g>
      <path d="M14 58V26l12-12h32" />
      <path d="M22 86V36l14-14h50" />
      <circle cx="58" cy="14" r="2.4" />
      <circle cx="86" cy="22" r="2.4" />
      <circle cx="22" cy="86" r="2.4" />
      <circle cx="14" cy="58" r="2.4" />
    </g>
  );
  return (
    <svg className="bk-blind-frame" viewBox="0 0 470 716" preserveAspectRatio="none" aria-hidden="true">
      <rect x="1" y="1" width="468" height="714" strokeWidth="1.8" />
      <rect x="8" y="8" width="454" height="700" strokeWidth="0.8" />
      {corner}
      <g transform="translate(470 0) scale(-1 1)">{corner}</g>
      <g transform="translate(0 716) scale(1 -1)">{corner}</g>
      <g transform="translate(470 716) scale(-1 -1)">{corner}</g>
    </svg>
  );
}

// A round seal pressed into the cloth, with the monogram picked out in gold.
function Medallion({ className = '' }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={`bk-medallion ${className}`} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <FoilGradient id={`${id}-foil`} />
        <path id={`${id}-ring`} d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1 -148 0" />
      </defs>
      <g className="bk-blind">
        <circle cx="100" cy="100" r="96" strokeWidth="1.6" fill="none" />
        <circle cx="100" cy="100" r="90" strokeWidth="0.7" fill="none" />
        <circle cx="100" cy="100" r="60" strokeWidth="1.3" fill="none" />
        <text className="bk-medallion-ring" stroke="none">
          <textPath href={`#${id}-ring`} startOffset="0">
            HARDWARE · SYSTEMS · OPERATIONS · EST. MMXXIII ·
          </textPath>
        </text>
      </g>
      <text className="bk-medallion-mark" x="100" y="112" fill={`url(#${id}-foil)`}>GVM</text>
      <path d="M100 66l5 5-5 5-5-5zM100 124l5 5-5 5-5-5z" fill={`url(#${id}-foil)`} />
    </svg>
  );
}

export const FrontCover = memo(function FrontCover() {
  return (
    <div className="bk-cover is-front">
      <span className="bk-cover-joint" aria-hidden="true" />
      <BlindFrame />
      <div className="bk-cover-layout">
        <span className="bk-cover-author bk-foil">{PERSONAL.name}</span>
        <span className="bk-cover-rule" aria-hidden="true"><i /></span>
        <h1 className="bk-cover-title">
          <span className="bk-cover-kicker bk-foil">A GVM’s</span>
          <span className="bk-foil">Engineering</span>
          <em className="bk-foil">Journal</em>
        </h1>
        <span className="bk-cover-subtitle bk-foil">From Instruction Set to Working System</span>
        <Medallion />
        <span className="bk-cover-volume bk-foil">Volume I <i aria-hidden="true">◆</i> MMXXVI</span>
      </div>
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
        <p className="bk-blurb">This is the engineering journal behind them.</p>
        <span className="bk-label-rule" aria-hidden="true" />
        <span className="bk-label-kicker">Hardware · Systems · Operations</span>
      </div>
      <Medallion className="is-small" />
      <span className="bk-cover-web bk-foil">{PERSONAL.website}</span>
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
            <span className="bk-bookplate-name">GVM</span>
            <span className="bk-bookplate-line is-sub">{PERSONAL.name}</span>
          </div>
        )}
      </div>
    </div>
  );
});
