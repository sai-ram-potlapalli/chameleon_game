import { motion } from 'framer-motion';

export default function PlayerCircle({
  players,
  currentPlayerId,
  currentTurnId,
  clues,
  votes,
  phase,
  chameleonId
}) {
  const getPlayerClue = (playerId) => {
    const clue = clues.find(c => c.playerId === playerId);
    return clue?.clue;
  };

  const getVotesForPlayer = (playerId) => {
    return votes.filter(v => v.votedFor === playerId).length;
  };

  const hasPlayerVoted = (playerId) => {
    return votes.some(v => v.playerId === playerId);
  };

  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-4">Players</h3>
      <div className="space-y-3">
        {players.map((player, index) => {
          const isCurrentTurn = player.id === currentTurnId && phase === 'clue-giving';
          const isMe = player.id === currentPlayerId;
          const isChameleon = player.id === chameleonId && phase === 'results';
          const playerClue = getPlayerClue(player.id);
          const votesReceived = getVotesForPlayer(player.id);
          const hasVoted = hasPlayerVoted(player.id);

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative flex items-center gap-3 p-3 rounded-xl transition-all ${
                isCurrentTurn
                  ? 'bg-chameleon-green/30 border border-chameleon-green/50 animate-pulse-glow'
                  : isChameleon
                  ? 'bg-red-500/20 border border-red-500/40'
                  : isMe
                  ? 'bg-chameleon-purple/20 border border-chameleon-purple/40'
                  : 'bg-white/5'
              }`}
            >
              {/* Turn indicator */}
              {isCurrentTurn && (
                <motion.div
                  className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-chameleon-green rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}

              {/* Avatar */}
              <div className="text-2xl">{player.avatar}</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium truncate ${isMe ? 'text-chameleon-purple' : ''}`}>
                    {player.name}
                    {isMe && ' (You)'}
                  </span>

                  {player.isAI && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">AI</span>
                  )}

                  {isChameleon && (
                    <span className="text-[10px] bg-red-500/30 text-red-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                      🦎 Chameleon
                    </span>
                  )}
                </div>

                {/* Clue */}
                {playerClue && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm text-chameleon-green font-medium"
                  >
                    "{playerClue}"
                  </motion.div>
                )}

                {/* Status during clue phase */}
                {phase === 'clue-giving' && !playerClue && !isCurrentTurn && (
                  <div className="text-xs text-white/40">Waiting...</div>
                )}
              </div>

              {/* Vote indicator */}
              {phase === 'voting' && (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  hasVoted ? 'bg-chameleon-green text-white' : 'bg-white/10'
                }`}>
                  {hasVoted ? '✓' : ''}
                </div>
              )}

              {/* Votes received */}
              {phase === 'results' && votesReceived > 0 && (
                <div className="bg-red-500/30 text-red-400 px-2 py-1 rounded text-sm font-bold">
                  {votesReceived} vote{votesReceived > 1 ? 's' : ''}
                </div>
              )}

              {/* Connection status */}
              {!player.connected && (
                <div className="text-xs text-red-400">Disconnected</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
