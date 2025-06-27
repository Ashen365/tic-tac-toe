import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Sound generator using Web Audio API
function useSoundEffects() {
  const audioContext = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Initialize audio context on first interaction
  const initializeAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };
  
  // X player sound (higher pitched "boop")
  const playXSound = () => {
    if (!soundEnabled || !audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(540, audioContext.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      800, audioContext.current.currentTime + 0.1
    );
    
    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01, audioContext.current.currentTime + 0.3
    );
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.3);
  };
  
  // O player sound (lower pitched "bloop")
  const playOSound = () => {
    if (!soundEnabled || !audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(330, audioContext.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      200, audioContext.current.currentTime + 0.2
    );
    
    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01, audioContext.current.currentTime + 0.4
    );
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.4);
  };
  
  // Victory fanfare sound
  const playWinSound = () => {
    if (!soundEnabled || !audioContext.current) return;
    
    // Play a happy little arpeggio
    const notes = [330, 392, 523, 659, 784];
    const startTime = audioContext.current.currentTime;
    
    notes.forEach((frequency, i) => {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      gainNode.gain.setValueAtTime(0.2, startTime + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, startTime + i * 0.1 + 0.3
      );
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.start(startTime + i * 0.1);
      oscillator.stop(startTime + i * 0.1 + 0.3);
    });
  };
  
  // Draw/tie sound
  const playDrawSound = () => {
    if (!soundEnabled || !audioContext.current) return;
    
    // Simple descending tone sequence
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(300, audioContext.current.currentTime);
    oscillator.frequency.linearRampToValueAtTime(
      150, audioContext.current.currentTime + 0.5
    );
    
    gainNode.gain.setValueAtTime(0.2, audioContext.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0.01, audioContext.current.currentTime + 0.5
    );
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.5);
  };
  
  // Button click sound
  const playClickSound = () => {
    if (!soundEnabled || !audioContext.current) return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      500, audioContext.current.currentTime + 0.1
    );
    
    gainNode.gain.setValueAtTime(0.15, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01, audioContext.current.currentTime + 0.1
    );
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.1);
  };
  
  return {
    initializeAudio,
    playXSound,
    playOSound,
    playWinSound,
    playDrawSound,
    playClickSound,
    soundEnabled,
    setSoundEnabled
  };
}

function XO({ value }) {
  if (value === "X")
    return (
      <svg className="xo-svg x-svg" viewBox="0 0 52 52">
        <line x1="10" y1="10" x2="42" y2="42" stroke="#FF416C" strokeWidth="8" strokeLinecap="round" />
        <line x1="42" y1="10" x2="10" y2="42" stroke="#FF416C" strokeWidth="8" strokeLinecap="round" />
      </svg>
    );
  if (value === "O")
    return (
      <svg className="xo-svg o-svg" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r="16" stroke="#4776E6" strokeWidth="8" fill="none" />
      </svg>
    );
  return null;
}

function Square({ value, onSquareClick, winnerSquare }) {
  return (
    <button
      className={`square${winnerSquare ? " winner" : ""}`}
      onClick={onSquareClick}
      disabled={!!value || winnerSquare}
    >
      <XO value={value} />
      <div className="square-reflection"></div>
    </button>
  );
}

function Board({ squares, onSquareClick, winLine }) {
  return (
    <div className="board">
      <div className="board-3d-effect">
        {[0, 1, 2].map(row => (
          <div className="board-row" key={row}>
            {[0, 1, 2].map(col => {
              const i = row * 3 + col;
              const winnerSquare = winLine && winLine.includes(i);
              return (
                <Square
                  key={i}
                  value={squares[i]}
                  onSquareClick={() => onSquareClick(i)}
                  winnerSquare={winnerSquare}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function GameHistory({ history, jumpTo, currentMove }) {
  const { playClickSound, initializeAudio } = useSoundEffects();
  
  const handleJumpClick = (move) => {
    initializeAudio();
    playClickSound();
    jumpTo(move);
  };
  
  return (
    <div className="game-history">
      <h3>Game History</h3>
      <div className="history-list">
        {history.map((_, move) => {
          const desc = move ? `Move #${move}` : 'Game start';
          return (
            <button 
              key={move} 
              className={`history-button ${move === currentMove ? 'active' : ''}`}
              onClick={() => handleJumpClick(move)}
            >
              {desc}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatsCard({ title, value }) {
  return (
    <div className="stats-card">
      <div className="stats-value">{value}</div>
      <div className="stats-title">{title}</div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return { winner: squares[a], line };
  }
  return null;
}

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [stats, setStats] = useState({
    xWins: 0,
    oWins: 0,
    draws: 0,
    gamesPlayed: 0
  });
  const [gameStatsCounted, setGameStatsCounted] = useState(false);
  
  const {
    initializeAudio,
    playXSound,
    playOSound,
    playWinSound,
    playDrawSound,
    playClickSound,
    soundEnabled,
    setSoundEnabled
  } = useSoundEffects();

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const result = calculateWinner(currentSquares);
  const isBoardFull = currentSquares.every(Boolean);
  const isGameOver = result || isBoardFull;

  // Initialize audio context on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [initializeAudio]);

  // Update stats and play sounds when game ends
  useEffect(() => {
    if (isGameOver && currentMove === history.length - 1 && !gameStatsCounted) {
      // Update stats
      setStats(prev => ({
        ...prev,
        xWins: prev.xWins + (result?.winner === 'X' ? 1 : 0),
        oWins: prev.oWins + (result?.winner === 'O' ? 1 : 0),
        draws: prev.draws + (isBoardFull && !result ? 1 : 0),
        gamesPlayed: prev.gamesPlayed + 1
      }));
      
      // Play appropriate sound
      if (result) {
        playWinSound();
      } else if (isBoardFull) {
        playDrawSound();
      }
      
      setGameStatsCounted(true);
    }
  }, [
    result, isBoardFull, currentMove, history.length, gameStatsCounted, 
    isGameOver, playWinSound, playDrawSound
  ]);

  function handleClick(i) {
    if (currentSquares[i] || calculateWinner(currentSquares)) return;
    
    initializeAudio(); // Make sure audio context is initialized
    
    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    
    // Play the appropriate sound based on player
    if (xIsNext) {
      playXSound();
    } else {
      playOSound();
    }
    
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function handleReset() {
    initializeAudio();
    playClickSound();
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setGameStatsCounted(false);
  }

  let status;
  if (result) {
    status = (
      <span className="status-text">
        Winner:{" "}
        <span className={result.winner === "X" ? "x-text" : "o-text"}>
          {result.winner === "X" ? "X" : "O"}
        </span>
      </span>
    );
  } else if (isBoardFull) {
    status = <span className="status-text">It's a <span className="draw-text">Draw</span></span>;
  } else {
    status = (
      <span className="status-text">
        Next player:{" "}
        <span className={xIsNext ? "x-text" : "o-text"}>
          {xIsNext ? "X" : "O"}
        </span>
      </span>
    );
  }

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="settings-bar">
        <button 
          className="toggle-button" 
          onClick={() => {
            initializeAudio();
            playClickSound();
            setSoundEnabled(!soundEnabled);
          }}
          aria-label={soundEnabled ? "Mute Sound" : "Enable Sound"}
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>
        
        <button 
          className="toggle-button" 
          onClick={() => {
            initializeAudio();
            playClickSound();
            setIsDarkMode(!isDarkMode);
          }}
          aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>
      
      <div className="game-container">
        <div className="game-content">
          <h1 className="title">Tic Tac Toe</h1>
          <div className="status">{status}</div>
          
          <Board
            squares={currentSquares}
            onSquareClick={handleClick}
            winLine={result?.line}
          />
          
          <div className="button-group">
            {(result || isBoardFull) && (
              <button className="reset-btn pulse" onClick={handleReset}>
                New Game
              </button>
            )}
            
            <button 
              className="undo-btn" 
              onClick={() => {
                initializeAudio();
                playClickSound();
                jumpTo(currentMove - 1);
              }}
              disabled={currentMove === 0}
            >
              Undo Move
            </button>
          </div>
        </div>
        
        <div className="side-panel">
          <div className="stats-container">
            <h3>Game Stats</h3>
            <div className="stats-grid">
              <StatsCard title="X Wins" value={stats.xWins} />
              <StatsCard title="O Wins" value={stats.oWins} />
              <StatsCard title="Draws" value={stats.draws} />
              <StatsCard title="Games" value={stats.gamesPlayed} />
            </div>
          </div>
          
          <GameHistory 
            history={history} 
            jumpTo={jumpTo} 
            currentMove={currentMove}
          />
        </div>
      </div>
      
      <footer className="footer">
        <p>Created by Ashen Herath • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}