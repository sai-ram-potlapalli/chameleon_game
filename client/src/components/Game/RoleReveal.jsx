import { motion } from 'framer-motion';

export default function RoleReveal({ role, onComplete }) {
  const isChameleon = role?.isChameleon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onComplete}
    >
      <motion.div
        initial={{ scale: 0, rotateY: 180 }}
        animate={{ scale: 1, rotateY: 0 }}
        exit={{ scale: 0, rotateY: -180 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className={`card p-12 text-center cursor-pointer ${
          isChameleon
            ? 'bg-gradient-to-br from-red-900/50 to-red-600/50 border-red-500/50'
            : 'bg-gradient-to-br from-green-900/50 to-green-600/50 border-green-500/50'
        }`}
      >
        <motion.div
          className="text-8xl mb-6"
          animate={{
            scale: [1, 1.2, 1],
            rotate: isChameleon ? [0, -10, 10, 0] : 0
          }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {isChameleon ? '🦎' : '🎯'}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`text-4xl font-bold mb-4 ${
            isChameleon ? 'text-red-400' : 'text-green-400'
          }`}
        >
          {isChameleon ? 'You are the Chameleon!' : 'You know the secret!'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/70 text-lg max-w-md"
        >
          {isChameleon
            ? "Blend in with the others. Give clues that seem related but don't reveal you don't know the word!"
            : "Give clues that prove you know the word, but don't make it too obvious for the Chameleon!"}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-white/40 text-sm mt-6"
        >
          Click anywhere to continue
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
