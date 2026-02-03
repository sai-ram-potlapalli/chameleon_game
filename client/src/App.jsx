import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import Landing from './components/Landing';
import Lobby from './components/Lobby/Lobby';
import GameBoard from './components/Game/GameBoard';

function AppRoutes() {
  const { room } = useGame();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/lobby/:roomCode"
        element={room ? <Lobby /> : <Navigate to="/" replace />}
      />
      <Route
        path="/game/:roomCode"
        element={room ? <GameBoard /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
