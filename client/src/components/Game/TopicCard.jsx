import { motion } from 'framer-motion';

export default function TopicCard({ topic, secretWord, wordIndex, diceResult, phase }) {
  const showHighlight = secretWord && phase !== 'role-reveal';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-3xl">{topic.icon}</span>
        <h2 className="text-2xl font-bold">{topic.name}</h2>
      </div>

      {/* Word Grid */}
      <div className="grid grid-cols-4 gap-3">
        {topic.words.map((word, index) => {
          const isSecretWord = showHighlight && word === secretWord;
          const row = Math.floor(index / 4);
          const col = index % 4;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className={`relative p-3 rounded-lg text-center text-sm font-medium transition-all ${
                isSecretWord
                  ? 'bg-chameleon-green text-white shadow-lg shadow-chameleon-green/30 scale-105'
                  : 'bg-white/10 hover:bg-white/15'
              }`}
            >
              {/* Row/Col indicator on hover */}
              <div className="absolute -top-1 -left-1 text-[10px] text-white/30">
                {row + 1},{col + 1}
              </div>

              {word}

              {/* Highlight indicator */}
              {isSecretWord && (
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-chameleon-green"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(34, 197, 94, 0.5)',
                      '0 0 20px rgba(34, 197, 94, 0.8)',
                      '0 0 10px rgba(34, 197, 94, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Dice reference */}
      {diceResult && (
        <div className="mt-4 flex justify-center gap-4 text-sm text-white/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-400 rounded text-yellow-900 flex items-center justify-center font-bold text-xs">
              {diceResult.die1}
            </div>
            <span>Row {diceResult.row + 1}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-400 rounded text-blue-900 flex items-center justify-center font-bold text-xs">
              {diceResult.die2}
            </div>
            <span>Column {diceResult.col + 1}</span>
          </div>
        </div>
      )}

      {/* Chameleon hint */}
      {!secretWord && phase !== 'role-reveal' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-red-400/70 text-sm mt-4"
        >
          You don't know the secret word. Watch the clues carefully!
        </motion.p>
      )}
    </motion.div>
  );
}
