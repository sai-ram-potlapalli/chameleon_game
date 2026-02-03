import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ClueInput({ isMyTurn, onSubmit, turnTime, currentPlayerName }) {
  const [clue, setClue] = useState('');
  const [timeLeft, setTimeLeft] = useState(turnTime);
  const inputRef = useRef(null);

  // Timer
  useEffect(() => {
    if (!isMyTurn) {
      setTimeLeft(turnTime);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit "pass" if time runs out
          if (clue.trim()) {
            handleSubmit();
          } else {
            onSubmit('...');
          }
          return turnTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isMyTurn, turnTime]);

  // Focus input when it's our turn
  useEffect(() => {
    if (isMyTurn && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMyTurn]);

  const handleSubmit = () => {
    const trimmedClue = clue.trim();
    if (trimmedClue && !trimmedClue.includes(' ')) {
      onSubmit(trimmedClue);
      setClue('');
      setTimeLeft(turnTime);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const isValidClue = clue.trim() && !clue.trim().includes(' ');
  const timerColor = timeLeft <= 5 ? 'text-red-400' : timeLeft <= 10 ? 'text-yellow-400' : 'text-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">
          {isMyTurn ? 'Your Turn!' : `Waiting for ${currentPlayerName}...`}
        </h3>

        {/* Timer */}
        <motion.div
          className={`text-3xl font-mono font-bold ${timerColor}`}
          animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
        >
          {timeLeft}s
        </motion.div>
      </div>

      {isMyTurn ? (
        <div className="space-y-4">
          <p className="text-white/70 text-sm">
            Enter ONE word that relates to the secret word. Be clever - not too obvious!
          </p>

          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={clue}
              onChange={(e) => setClue(e.target.value.replace(/\s/g, ''))}
              onKeyDown={handleKeyDown}
              placeholder="Type your clue..."
              maxLength={30}
              className="input-field flex-1 text-xl text-center"
              autoComplete="off"
            />

            <button
              onClick={handleSubmit}
              disabled={!isValidClue}
              className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Submit
            </button>
          </div>

          {clue.includes(' ') && (
            <p className="text-red-400 text-sm">
              Your clue must be a single word (no spaces)
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <motion.div
            className="text-4xl mb-4"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            🤔
          </motion.div>
          <p className="text-white/60">
            {currentPlayerName} is thinking of a clue...
          </p>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-4">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-chameleon-green"
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / turnTime) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
