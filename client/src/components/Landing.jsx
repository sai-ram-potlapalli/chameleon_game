import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useSocket } from '../hooks/useSocket';

export default function Landing() {
  const [mode, setMode] = useState('menu'); // menu, create, join
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { room, error, clearError, connected } = useGame();
  const { createRoom, joinRoom } = useSocket();

  // Navigate to lobby when room is set
  useEffect(() => {
    if (room) {
      navigate(`/lobby/${room.code}`);
    }
  }, [room, navigate]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleCreate = () => {
    if (!playerName.trim()) return;
    setIsLoading(true);
    createRoom(playerName.trim());
    setTimeout(() => setIsLoading(false), 3000); // Timeout fallback
  };

  const handleJoin = () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    setIsLoading(true);
    joinRoom(roomCode.trim(), playerName.trim());
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-chameleon-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-chameleon-purple/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className="text-8xl mb-4">
            <motion.span
              animate={{
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="inline-block"
            >
              🦎
            </motion.span>
          </div>
          <h1 className="text-5xl font-bold glow-text mb-2">
            The Chameleon
          </h1>
          <p className="text-white/60 text-lg">
            Blend in or get caught!
          </p>
        </motion.div>

        {/* Connection status */}
        <div className="flex justify-center mb-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            {connected ? 'Connected' : 'Connecting...'}
          </div>
        </div>

        {/* Main Card */}
        <div className="card p-8">
          <AnimatePresence mode="wait">
            {mode === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setMode('create')}
                  disabled={!connected}
                  className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Game
                </button>
                <button
                  onClick={() => setMode('join')}
                  disabled={!connected}
                  className="btn-secondary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join Game
                </button>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="font-semibold mb-2 text-white/80">How to Play:</h3>
                  <ul className="text-sm text-white/60 space-y-1">
                    <li>• One player is secretly the Chameleon</li>
                    <li>• Everyone else knows the secret word</li>
                    <li>• Give one-word clues to prove you know it</li>
                    <li>• Vote to find the Chameleon!</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {mode === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-center mb-6">Create Game</h2>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={20}
                    className="input-field w-full"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  />
                </div>

                <button
                  onClick={handleCreate}
                  disabled={!playerName.trim() || isLoading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating...
                    </span>
                  ) : 'Create Room'}
                </button>

                <button
                  onClick={() => { setMode('menu'); clearError(); }}
                  className="w-full text-white/60 hover:text-white transition-colors"
                >
                  Back
                </button>
              </motion.div>
            )}

            {mode === 'join' && (
              <motion.div
                key="join"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-center mb-6">Join Game</h2>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={20}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Room Code</label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Enter 6-letter code"
                    maxLength={6}
                    className="input-field w-full text-center text-2xl tracking-widest font-mono"
                    onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                  />
                </div>

                <button
                  onClick={handleJoin}
                  disabled={!playerName.trim() || roomCode.length !== 6 || isLoading}
                  className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Joining...
                    </span>
                  ) : 'Join Room'}
                </button>

                <button
                  onClick={() => { setMode('menu'); clearError(); }}
                  className="w-full text-white/60 hover:text-white transition-colors"
                >
                  Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-sm mt-6">
          4-8 players • AI players available
        </p>
      </motion.div>
    </div>
  );
}
