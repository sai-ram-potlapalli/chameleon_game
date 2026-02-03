import { motion, AnimatePresence } from 'framer-motion';

export default function HostComments({ comments }) {
  const latestComment = comments[comments.length - 1];

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🎩</span>
        <span className="font-semibold">AI Host</span>
      </div>

      <div className="min-h-[60px]">
        <AnimatePresence mode="wait">
          {latestComment ? (
            <motion.div
              key={latestComment.timestamp}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white/80 italic"
            >
              "{latestComment.text}"
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/40 text-sm"
            >
              The host is watching...
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
