import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { useSocket } from '../../hooks/useSocket';
import RoleReveal from './RoleReveal';
import DiceRoll from './DiceRoll';
import TopicCard from './TopicCard';
import ClueInput from './ClueInput';
import PlayerCircle from '../Players/PlayerCircle';
import VotingPanel from '../Voting/VotingPanel';
import ResultsPanel from './ResultsPanel';
import HostComments from '../UI/HostComments';
import ChatBox from '../UI/ChatBox';

export default function GameBoard() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [showRoleReveal, setShowRoleReveal] = useState(true);

  const {
    room,
    game,
    playerId,
    myRole,
    secretWord,
    hostComments,
    error,
    clearError
  } = useGame();

  const {
    submitClue,
    submitVote,
    submitChameleonGuess,
    requestNextRound,
    endGame,
    sendChat
  } = useSocket();

  // Redirect if no room
  useEffect(() => {
    if (!room) {
      navigate('/');
    }
  }, [room, navigate]);

  // Handle role reveal timeout
  useEffect(() => {
    if (myRole && showRoleReveal) {
      const timer = setTimeout(() => setShowRoleReveal(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [myRole, showRoleReveal]);

  // Confetti on win
  useEffect(() => {
    if (game?.phase === 'results' && game?.roundResult) {
      const isChameleon = myRole?.isChameleon;
      const chameleonWon = !game.roundResult.chameleonCaught ||
                          game.roundResult.chameleonGuessedWord;

      const playerWon = isChameleon ? chameleonWon : !chameleonWon;

      if (playerWon) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [game?.phase, game?.roundResult, myRole]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!room || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🦎</div>
          <p className="text-white/60">Loading game...</p>
        </div>
      </div>
    );
  }

  const isHost = room.hostId === playerId;
  const currentTurnPlayerId = game.turnOrder?.[game.currentTurnIndex];
  const isMyTurn = currentTurnPlayerId === playerId;
  const isChameleon = myRole?.isChameleon;

  const handleSubmitClue = (clue) => {
    submitClue(room.code, clue);
  };

  const handleSubmitVote = (votedForId) => {
    submitVote(room.code, votedForId);
  };

  const handleChameleonGuess = (guess) => {
    submitChameleonGuess(room.code, guess);
  };

  const handleNextRound = () => {
    setShowRoleReveal(true);
    requestNextRound(room.code);
  };

  const handleEndGame = () => {
    endGame(room.code);
    navigate(`/lobby/${room.code}`);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🦎</span>
            <div>
              <h1 className="text-2xl font-bold glow-text">The Chameleon</h1>
              <p className="text-white/60 text-sm">Round {game.round}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="card px-4 py-2">
              <span className="text-white/60 text-sm">Room: </span>
              <span className="font-mono font-bold text-chameleon-green">{room.code}</span>
            </div>

            {/* Role indicator */}
            <div className={`card px-4 py-2 ${
              isChameleon ? 'bg-red-500/20 border-red-500/40' : 'bg-green-500/20 border-green-500/40'
            }`}>
              <span className="text-sm">
                {isChameleon ? '🦎 You are the Chameleon!' : `🎯 Secret: ${secretWord || '???'}`}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Role Reveal Overlay */}
        <AnimatePresence>
          {showRoleReveal && myRole && game.phase === 'role-reveal' && (
            <RoleReveal
              role={myRole}
              onComplete={() => setShowRoleReveal(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Game Area */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left sidebar - Players */}
          <div className="lg:col-span-1">
            <PlayerCircle
              players={room.players}
              currentPlayerId={playerId}
              currentTurnId={currentTurnPlayerId}
              clues={game.clues || []}
              votes={game.phase === 'results' ? game.votes : []}
              phase={game.phase}
              chameleonId={game.phase === 'results' ? game.chameleonId : null}
            />
          </div>

          {/* Center - Main game content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dice Roll */}
            {game.phase === 'dice-roll' && game.diceResult && (
              <DiceRoll diceResult={game.diceResult} />
            )}

            {/* Topic Card */}
            {game.topic && game.phase !== 'role-reveal' && (
              <TopicCard
                topic={game.topic}
                secretWord={secretWord}
                wordIndex={game.wordIndex}
                diceResult={game.diceResult}
                phase={game.phase}
              />
            )}

            {/* Clue Input */}
            {game.phase === 'clue-giving' && (
              <ClueInput
                isMyTurn={isMyTurn}
                onSubmit={handleSubmitClue}
                turnTime={room.settings.turnTime}
                currentPlayerName={room.players.find(p => p.id === currentTurnPlayerId)?.name}
              />
            )}

            {/* Discussion Phase */}
            {game.phase === 'discussion' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-6 text-center"
              >
                <h2 className="text-2xl font-bold mb-4">Discussion Time!</h2>
                <p className="text-white/70 mb-4">
                  Who do you think is the Chameleon? Discuss with other players!
                </p>
                <div className="text-4xl font-mono text-chameleon-gold">
                  {Math.max(0, Math.floor((game.discussionEndTime - Date.now()) / 1000))}s
                </div>
              </motion.div>
            )}

            {/* Voting Phase */}
            {game.phase === 'voting' && (
              <VotingPanel
                players={room.players}
                currentPlayerId={playerId}
                votes={game.votes || []}
                onVote={handleSubmitVote}
              />
            )}

            {/* Chameleon Guess Phase */}
            {game.phase === 'chameleon-guess' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-6"
              >
                <h2 className="text-2xl font-bold text-center mb-4">
                  {isChameleon ? 'You were caught! Guess the secret word!' : 'The Chameleon was caught!'}
                </h2>

                {isChameleon ? (
                  <div className="space-y-4">
                    <p className="text-center text-white/70">
                      Pick the word you think is the secret word. Guess correctly to salvage points!
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {game.topic.words.map((word, index) => (
                        <button
                          key={index}
                          onClick={() => handleChameleonGuess(word)}
                          className="p-3 bg-white/10 hover:bg-chameleon-green/30 rounded-lg transition-colors text-sm"
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-white/70">
                    Waiting for {game.chameleonName || 'the Chameleon'} to guess the secret word...
                  </p>
                )}
              </motion.div>
            )}

            {/* Results Phase */}
            {game.phase === 'results' && game.roundResult && (
              <ResultsPanel
                result={game.roundResult}
                players={room.players}
                scores={game.scores}
                myRole={myRole}
                isHost={isHost}
                onNextRound={handleNextRound}
                onEndGame={handleEndGame}
              />
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Host Comments */}
            <HostComments comments={hostComments} />

            {/* Given Clues */}
            {(game.clues?.length > 0) && (
              <div className="card p-4">
                <h3 className="font-semibold mb-3">Clues Given</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {game.clues.map((clue, index) => {
                    const player = room.players.find(p => p.id === clue.playerId);
                    return (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span>{player?.avatar}</span>
                        <span className="text-white/60">{player?.name}:</span>
                        <span className="font-semibold text-chameleon-green">{clue.clue}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chat */}
            <ChatBox
              roomCode={room.code}
              players={room.players}
              onSendMessage={(msg) => sendChat(room.code, msg)}
            />

            {/* Scores */}
            <div className="card p-4">
              <h3 className="font-semibold mb-3">Scores</h3>
              <div className="space-y-2">
                {room.players
                  .sort((a, b) => (game.scores?.[b.id] || 0) - (game.scores?.[a.id] || 0))
                  .map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-white/40">{index + 1}.</span>
                        <span>{player.avatar}</span>
                        <span className={player.id === playerId ? 'text-chameleon-green' : ''}>
                          {player.name}
                        </span>
                      </div>
                      <span className="font-bold text-chameleon-gold">
                        {game.scores?.[player.id] || 0}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
