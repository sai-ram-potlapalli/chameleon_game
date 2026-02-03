import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DiceRoll({ diceResult }) {
  const [isRolling, setIsRolling] = useState(true);
  const [displayDice, setDisplayDice] = useState({ die1: 1, die2: 1 });

  useEffect(() => {
    // Simulate rolling animation
    const rollInterval = setInterval(() => {
      setDisplayDice({
        die1: Math.floor(Math.random() * 6) + 1,
        die2: Math.floor(Math.random() * 6) + 1
      });
    }, 100);

    // Stop rolling after 2 seconds
    const stopTimer = setTimeout(() => {
      clearInterval(rollInterval);
      setDisplayDice({ die1: diceResult.die1, die2: diceResult.die2 });
      setIsRolling(false);
    }, 2000);

    return () => {
      clearInterval(rollInterval);
      clearTimeout(stopTimer);
    };
  }, [diceResult]);

  const renderDieFace = (value, color) => {
    const dotPositions = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
    };

    const dots = dotPositions[value] || [];
    const bgColor = color === 'yellow' ? 'bg-yellow-400' : 'bg-blue-400';
    const dotColor = color === 'yellow' ? 'bg-yellow-900' : 'bg-blue-900';

    return (
      <motion.div
        className={`w-20 h-20 ${bgColor} rounded-xl shadow-lg grid grid-cols-3 grid-rows-3 p-2 gap-1`}
        animate={isRolling ? {
          rotateX: [0, 360],
          rotateY: [0, 360],
          scale: [1, 1.1, 1]
        } : {}}
        transition={isRolling ? {
          duration: 0.3,
          repeat: Infinity,
          ease: 'linear'
        } : {
          type: 'spring',
          stiffness: 200
        }}
      >
        {[0, 1, 2].map(row =>
          [0, 1, 2].map(col => {
            const hasDot = dots.some(([r, c]) => r === row && c === col);
            return (
              <div key={`${row}-${col}`} className="flex items-center justify-center">
                {hasDot && (
                  <div className={`w-3 h-3 ${dotColor} rounded-full`} />
                )}
              </div>
            );
          })
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-6"
    >
      <h3 className="text-xl font-semibold text-center mb-4">
        {isRolling ? 'Rolling the dice...' : 'Dice Result!'}
      </h3>

      <div className="flex justify-center items-center gap-8">
        {renderDieFace(displayDice.die1, 'yellow')}
        {renderDieFace(displayDice.die2, 'blue')}
      </div>

      {!isRolling && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-4"
        >
          <p className="text-white/60">
            Row <span className="text-yellow-400 font-bold">{diceResult.row + 1}</span>,
            Column <span className="text-blue-400 font-bold">{diceResult.col + 1}</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
