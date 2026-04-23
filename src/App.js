import React, { useState } from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import TitleScreen from './components/TitleScreen';
import GameCanvas from './components/GameCanvas';

function App() {
  const [phase, setPhase] = useState('loading');
  return (
    <div className="app-root">
      {phase === 'loading' && <LoadingScreen onComplete={() => setPhase('title')} />}
      {phase === 'title'   && <TitleScreen   onStart={() => setPhase('game')} />}
      {phase === 'game'    && <GameCanvas />}
    </div>
  );
}

export default App;
