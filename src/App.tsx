import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="app">
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
