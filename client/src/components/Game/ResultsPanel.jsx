import { motion } from 'framer-motion';

export default function ResultsPanel({
  result,
  players,
  scores,
  myRole,
  isHost,
  onNextRound,
  onEndGame
}) {
  const chameleonPlayer = players.find(p => p.id === result.chameleonId);
  const accusedPlayer = players.find(p => p.id === result.accusedPlayer);

  const isChameleon = myRole?.isChameleon;
  const chameleonWon = !result.chameleonCaught || result.chameleonGuessedWord;
  const playerWon = isChameleon ? chameleonWon : !chameleonWon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`card p-8 text-center ${
        playerWon
          ? 'bg-gradient-to-br from-green-900/30 to-green-600/30 border-green-500/40'
          : 'bg-gradient-to-br from-red-900/30 to-red-600/30 border-red-500/40'
      }`}
    >
      {/* Result header */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="text-6xl mb-4"
      >
        {playerWon ? '🎉' : '😢'}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`text-3xl font-bold mb-2 ${
          playerWon ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {playerWon ? 'You Win!' : 'You Lose!'}
      </motion.h2>

      {/* What happened */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4 mb-6"
      >
        {result.tie ? (
          <p className="text-white/70">
            The vote was tied! The Chameleon escaped!
          </p>
        ) : !result.chameleonCaught ? (
          <p className="text-white/70">
            <span className="text-white font-semibold">{accusedPlayer?.name}</span> was accused,
            but they weren't the Chameleon!
          </p>
        ) : (
          <p className="text-white/70">
            <span className="text-white font-semibold">{chameleonPlayer?.name}</span> was the Chameleon
            and was caught!
          </p>
        )}

        {result.chameleonCaught && (
          <p className="text-white/70">
            {result.chameleonGuessedWord ? (
              <>
                The Chameleon correctly guessed the word
                "<span className="text-chameleon-green font-semibold">{result.secretWord}</span>"!
              </>
            ) : (
              <>
                The Chameleon guessed "<span className="text-red-400">{result.chameleonGuess}</span>"
                but the word was "<span className="text-chameleon-green font-semibold">{result.secretWord}</span>"
              </>
            )}
          </p>
        )}

        {!result.chameleonCaught && (
          <p className="text-white/70">
            The secret word was "<span className="text-chameleon-green font-semibold">{result.secretWord}</span>"
          </p>
        )}
      </motion.div>

      {/* Chameleon reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-black/30 rounded-xl p-4 mb-6 inline-block"
      >
        <p className="text-white/60 text-sm mb-2">The Chameleon was:</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">{chameleonPlayer?.avatar}</span>
          <span className="text-xl font-semibold">{chameleonPlayer?.name}</span>
          <span className="text-2xl">🦎</span>
        </div>
      </motion.div>

      {/* Vote breakdown */}
      {result.voteCounts && Object.keys(result.voteCounts).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold mb-3">Vote Results</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(result.voteCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([playerId, count]) => {
                const player = players.find(p => p.id === playerId);
                const isChameleonPlayer = playerId === result.chameleonId;
                return (
                  <div
                    key={playerId}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      isChameleonPlayer ? 'bg-red-500/20' : 'bg-white/10'
                    }`}
                  >
                    <span>{player?.avatar}</span>
                    <span>{player?.name}</span>
                    <span className="font-bold text-chameleon-gold">{count}</span>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* Score changes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mb-6"
      >
        <h3 className="text-lg font-semibold mb-3">Scores</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {players
            .sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
            .map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10"
              >
                <span>{player.avatar}</span>
                <span>{player.name}</span>
                <span className="font-bold text-chameleon-gold">
                  {scores[player.id] || 0} pts
                </span>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Actions */}
      {isHost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex justify-center gap-4"
        >
          <button
            onClick={onNextRound}
            className="btn-primary text-lg"
          >
            Next Round
          </button>
          <button
            onClick={onEndGame}
            className="btn-secondary text-lg"
          >
            End Game
          </button>
        </motion.div>
      )}

      {!isHost && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-white/50"
        >
          Waiting for host to start next round...
        </motion.p>
      )}
    </motion.div>
  );
}
