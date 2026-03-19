import { useState } from 'react';
import './App.css';
import PixiBackground from './components/PixiBackground';

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="app" style={{ position: 'relative' }}>
      {/* Pixi.js canvas – sits behind all other content */}
      <PixiBackground />

      <header className="app-header">
        <h1>Mori</h1>
        <p>React + TypeScript + Vite</p>
      </header>
      <main className="app-main">
        <div className="card">
          <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
        </div>
      </main>
    </div>
  );
}

export default App;
