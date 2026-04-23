import React, { useEffect, useRef, useState } from 'react';
import { PERSONAL } from '../data/portfolio';

const OAK_LINES = [
  'Hello there! Welcome to the world of POKeMON!',
  'My name is OAK. People call me the PORTFOLIO PROF!',
  'This world is inhabited by projects, skills, and badges.',
  `This trainer is ${PERSONAL.shortName}. Some call him ASH.`,
  'Your very own portfolio journey is about to unfold!',
];

const LoadingScreen = ({ onComplete }) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      setLineIndex((current) => {
        if (current >= OAK_LINES.length - 1) {
          if (!completedRef.current) {
            completedRef.current = true;
            clearInterval(id);
            setTimeout(() => setFadeOut(true), 500);
            setTimeout(onComplete, 1050);
          }
          return current;
        }
        return current + 1;
      });
    }, 900);

    return () => clearInterval(id);
  }, [onComplete]);

  return (
    <div className={`loading-screen${fadeOut ? ' loading-screen-fade' : ''}`}>
      <div className="loading-oak-card">
        <div className="loading-header">PROF. OAK'S INTRO</div>
        <div className="loading-stage">
          <div className="loading-oak">
            <div className="oak-hair" />
            <div className="oak-head" />
            <div className="oak-coat" />
            <div className="oak-legs" />
          </div>
          <div className="loading-pikachu">
            <div className="pikachu-ear pikachu-ear-left" />
            <div className="pikachu-ear pikachu-ear-right" />
            <div className="pikachu-head" />
            <div className="pikachu-body" />
          </div>
        </div>
      </div>

      <div className="dialog-box loading-dialog">
        <div className="dialog-speaker">PROF. OAK</div>
        <div className="dialog-text">
          {OAK_LINES.slice(0, lineIndex + 1).map((line) => (
            <div key={line} className="loading-line">{line}</div>
          ))}
        </div>
        <div className="dialog-hint">PREPARING ADVENTURE...</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
