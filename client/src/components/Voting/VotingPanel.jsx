import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VotingPanel({ players, currentPlayerId, votes, onVote }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const myVote = votes.find(v => v.playerId === currentPlayerId);
  const alreadyVoted = !!myVote || hasVoted;

  const handleVote = (playerId) => {
    if (alreadyVoted || playerId === currentPlayerId) return;
    setSelectedPlayer(playerId);
  };

  const confirmVote = () => {
    if (selectedPlayer && !alreadyVoted) {
      onVote(selectedPlayer);
      setHasVoted(true);
    }
  };

  const cancelSelection = () => {
    setSelectedPlayer(null);
  };

  const votableePlayers = players.filter(p => p.id !== currentPlayerId);
  const votedCount = votes.filter(v => v.hasVoted || v.votedFor).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-6"
    >
      <h2 className="text-2xl font-bold text-center mb-2">Vote for the Chameleon!</h2>
      <p className="text-center text-white/60 mb-6">
        {alreadyVoted
          ? 'Your vote has been cast. Waiting for others...'
          : 'Click on the player you suspect is the Chameleon'}
      </p>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>Votes submitted</span>
          <span>{votedCount}/{players.length}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-chameleon-green"
            initial={{ width: 0 }}
            animate={{ width: `${(votedCount / players.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Player grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {votableePlayers.map((player, index) => {
          const isSelected = selectedPlayer === player.id;
          const canSelect = !alreadyVoted;

          return (
            <motion.button
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleVote(player.id)}
              disabled={!canSelect}
              className={`relative p-4 rounded-xl transition-all ${
                isSelected
                  ? 'bg-red-500/30 border-2 border-red-500 scale-105'
                  : canSelect
                  ? 'bg-white/10 border-2 border-transparent hover:bg-white/20 hover:border-white/30'
                  : 'bg-white/5 border-2 border-transparent opacity-60'
              }`}
            >
              <div className="text-4xl mb-2">{player.avatar}</div>
              <div className="font-medium truncate">{player.name}</div>
              {player.isAI && (
                <div className="text-xs text-white/40 mt-1">AI</div>
              )}

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-lg"
                >
                  👆
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Confirmation dialog */}
      <AnimatePresence>
        {selectedPlayer && !alreadyVoted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/10 rounded-xl p-4"
          >
            <p className="text-center mb-4">
              Vote for <span className="font-bold text-red-400">
                {players.find(p => p.id === selectedPlayer)?.name}
              </span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelSelection}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmVote}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-bold"
              >
                Confirm Vote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voted confirmation */}
      {alreadyVoted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-4xl mb-2">✅</div>
          <p className="text-chameleon-green">Your vote has been submitted!</p>
          <p className="text-white/40 text-sm mt-2">
            Waiting for {players.length - votedCount} more vote(s)...
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
