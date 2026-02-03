import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

export default function ChatBox({ roomCode, players, onSendMessage }) {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const { messages, playerId } = useGame();

  useEffect(() => {
    if (messagesEndRef.current && isExpanded) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const getPlayerName = (id) => {
    const player = players.find(p => p.id === id);
    return player?.name || 'Unknown';
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>💬</span>
          <span className="font-semibold">Chat</span>
          {messages.length > 0 && (
            <span className="text-xs bg-chameleon-purple/30 text-chameleon-purple px-2 py-0.5 rounded-full">
              {messages.length}
            </span>
          )}
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Messages */}
            <div className="h-48 overflow-y-auto p-4 pt-0 space-y-2">
              {messages.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-4">
                  No messages yet. Say hi!
                </p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`text-sm ${
                      msg.playerId === playerId ? 'text-right' : ''
                    }`}
                  >
                    <span className={`inline-block px-3 py-1 rounded-lg ${
                      msg.playerId === playerId
                        ? 'bg-chameleon-green/20 text-chameleon-green'
                        : 'bg-white/10'
                    }`}>
                      <span className="font-semibold text-white/70">
                        {msg.playerId === playerId ? 'You' : getPlayerName(msg.playerId)}:
                      </span>{' '}
                      {msg.message}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 pt-2 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  maxLength={200}
                  className="input-field flex-1 py-2 text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="bg-chameleon-green hover:bg-green-600 disabled:bg-white/10 disabled:cursor-not-allowed px-4 rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
