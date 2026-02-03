import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useSocket } from '../../hooks/useSocket';
import PlayerCard from './PlayerCard';
import ChatBox from '../UI/ChatBox';
import HostComments from '../UI/HostComments';

export default function Lobby() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const {
    room,
    playerId,
    error,
    clearError,
    hostComments,
    game
  } = useGame();

  const {
    addAIPlayer,
    removeAIPlayer,
    toggleReady,
    startGame,
    sendChat
  } = useSocket();

  // Navigate to game when it starts
  useEffect(() => {
    if (game && game.phase) {
      navigate(`/game/${roomCode}`);
    }
  }, [game, roomCode, navigate]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/60">Loading room...</p>
      </div>
    );
  }

  const isHost = room.hostId === playerId;
  const currentPlayer = room.players.find(p => p.id === playerId);
  const canStart = room.players.length >= room.settings.minPlayers &&
                   room.players.every(p => p.isReady);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddAI = () => {
    if (room.players.length < room.settings.maxPlayers) {
      addAIPlayer(room.code);
    }
  };

  const handleRemoveAI = (aiId) => {
    removeAIPlayer(room.code, aiId);
  };

  const handleToggleReady = () => {
    toggleReady(room.code);
  };

  const handleStartGame = () => {
    if (canStart) {
      startGame(room.code);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🦎</span>
            <h1 className="text-3xl font-bold glow-text">Game Lobby</h1>
          </div>

          {/* Room Code */}
          <motion.button
            onClick={copyRoomCode}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="card px-6 py-3 inline-flex items-center gap-3 cursor-pointer hover:border-chameleon-green/50 transition-colors"
          >
            <span className="text-white/60 text-sm">Room Code:</span>
            <span className="text-2xl font-mono font-bold tracking-widest text-chameleon-green">
              {room.code}
            </span>
            <span className="text-white/40 text-sm">
              {copied ? '(Copied!)' : '(Click to copy)'}
            </span>
          </motion.button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Players List */}
          <div className="md:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Players ({room.players.length}/{room.settings.maxPlayers})
                </h2>
                {isHost && room.players.length < room.settings.maxPlayers && (
                  <button
                    onClick={handleAddAI}
                    className="text-sm bg-chameleon-purple/30 hover:bg-chameleon-purple/50 px-3 py-1 rounded-lg transition-colors"
                  >
                    + Add AI
                  </button>
                )}
              </div>

              <div className="grid gap-3">
                <AnimatePresence mode="popLayout">
                  {room.players.map((player, index) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      isCurrentPlayer={player.id === playerId}
                      isHost={isHost}
                      onRemoveAI={() => handleRemoveAI(player.id)}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Minimum players warning */}
              {room.players.length < room.settings.minPlayers && (
                <p className="text-yellow-400/80 text-sm mt-4 text-center">
                  Need at least {room.settings.minPlayers} players to start
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-4">
              {!isHost && (
                <button
                  onClick={handleToggleReady}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${
                    currentPlayer?.isReady
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {currentPlayer?.isReady ? 'Ready!' : 'Click when Ready'}
                </button>
              )}

              {isHost && (
                <button
                  onClick={handleStartGame}
                  disabled={!canStart}
                  className="flex-1 btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {canStart ? 'Start Game' : 'Waiting for players...'}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Host Comments */}
            <HostComments comments={hostComments} />

            {/* Chat */}
            <ChatBox
              roomCode={room.code}
              players={room.players}
              onSendMessage={(msg) => sendChat(room.code, msg)}
            />

            {/* Game Info */}
            <div className="card p-4">
              <h3 className="font-semibold mb-3">Game Settings</h3>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>Turn Time:</span>
                  <span>{room.settings.turnTime}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Discussion:</span>
                  <span>{room.settings.discussionTime}s</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Difficulty:</span>
                  <span className="capitalize">{room.settings.aiDifficulty}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
