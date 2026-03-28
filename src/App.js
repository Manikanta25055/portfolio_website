import React, { useState } from 'react';
import './App.css';
import TitleScreen from './components/TitleScreen';
import GameCanvas from './components/GameCanvas';

function App() {
  const [phase, setPhase] = useState('title');
  return (
    <div className="app-root">
      {phase === 'title' && <TitleScreen onStart={() => setPhase('game')} />}
      {phase === 'game'  && <GameCanvas />}
    </div>
  );
}

export default App;
