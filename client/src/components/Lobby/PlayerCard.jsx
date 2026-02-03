import { motion } from 'framer-motion';

export default function PlayerCard({ player, isCurrentPlayer, isHost, onRemoveAI, index }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
        isCurrentPlayer
          ? 'bg-chameleon-green/20 border border-chameleon-green/40'
          : 'bg-white/5 border border-transparent'
      }`}
    >
      {/* Avatar */}
      <div className="text-3xl">{player.avatar}</div>

      {/* Name and badges */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {player.name}
            {isCurrentPlayer && <span className="text-chameleon-green ml-1">(You)</span>}
          </span>
          {player.isHost && (
            <span className="text-xs bg-chameleon-gold/30 text-chameleon-gold px-2 py-0.5 rounded-full">
              Host
            </span>
          )}
          {player.isAI && (
            <span className="text-xs bg-chameleon-purple/30 text-chameleon-purple px-2 py-0.5 rounded-full">
              AI
            </span>
          )}
        </div>

        {/* Status */}
        <div className="text-sm text-white/50">
          {!player.connected ? (
            <span className="text-red-400">Disconnected</span>
          ) : player.isReady ? (
            <span className="text-green-400">Ready</span>
          ) : (
            <span>Waiting...</span>
          )}
        </div>
      </div>

      {/* Score (if any) */}
      {player.score > 0 && (
        <div className="text-chameleon-gold font-bold">
          {player.score} pts
        </div>
      )}

      {/* Remove AI button */}
      {isHost && player.isAI && (
        <button
          onClick={onRemoveAI}
          className="text-white/40 hover:text-red-400 transition-colors p-1"
          title="Remove AI player"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* Ready indicator */}
      <div className={`w-3 h-3 rounded-full ${
        player.isReady ? 'bg-green-400' : 'bg-white/20'
      }`} />
    </motion.div>
  );
}
