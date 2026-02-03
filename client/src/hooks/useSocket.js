import { useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useGame } from '../context/GameContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

// Singleton socket instance - persists across component mounts
let socket = null;
let socketInitialized = false;

function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function useSocket() {
  const {
    setPlayer,
    setRoom,
    setGame,
    updateGame,
    setRole,
    setSecretWord,
    addClue,
    addVote,
    setVotes,
    addMessage,
    addHostComment,
    setConnected,
    setError,
    updateScores,
    resetGame,
  } = useGame();

  useEffect(() => {
    const socket = getSocket();

    // Only set up listeners once
    if (socketInitialized) {
      // Just update connection status
      setConnected(socket.connected);
      return;
    }

    socketInitialized = true;

    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Unable to connect to server');
    });

    // Room events
    socket.on('room-created', ({ room, playerId }) => {
      console.log('Room created:', room.code);
      setPlayer(playerId, room.players[0].name);
      setRoom(room);
    });

    socket.on('room-joined', ({ room, playerId, reconnected }) => {
      console.log('Room joined:', room.code);
      const player = room.players.find(p => p.id === playerId);
      setPlayer(playerId, player?.name || 'Player');
      setRoom(room);
      if (reconnected) {
        addHostComment('Welcome back! You have reconnected.');
      }
    });

    socket.on('join-error', ({ error }) => {
      setError(error);
    });

    socket.on('player-joined', ({ player, room }) => {
      setRoom(room);
      addHostComment(`${player.name} has joined the game!`);
    });

    socket.on('player-left', ({ playerId, playerName, room }) => {
      setRoom(room);
      if (playerName) {
        addHostComment(`${playerName} has left the game.`);
      }
    });

    socket.on('ai-player-added', ({ aiPlayer, room }) => {
      setRoom(room);
      addHostComment(`${aiPlayer.name} (AI) has joined!`);
    });

    socket.on('ai-player-removed', ({ removedId, room }) => {
      setRoom(room);
    });

    socket.on('player-ready-changed', ({ playerId, isReady, room }) => {
      setRoom(room);
    });

    // Game events
    socket.on('game-started', ({ hostComment }) => {
      if (hostComment) addHostComment(hostComment);
    });

    socket.on('role-assigned', ({ role, hostComment }) => {
      setRole(role);
      if (hostComment) addHostComment(hostComment);
    });

    socket.on('dice-rolled', ({ diceResult, topic, hostComment }) => {
      updateGame({ diceResult, topic, phase: 'dice-roll' });
      if (hostComment) addHostComment(hostComment);
    });

    socket.on('secret-word-revealed', ({ secretWord, wordIndex }) => {
      setSecretWord(secretWord);
      updateGame({ wordIndex });
    });

    socket.on('clue-phase-started', ({ turnOrder, currentPlayerId, hostComment }) => {
      updateGame({
        phase: 'clue-giving',
        turnOrder,
        currentTurnIndex: 0,
        clues: []
      });
      if (hostComment) addHostComment(hostComment);
    });

    socket.on('clue-submitted', ({ playerId, playerName, clue, hostComment }) => {
      addClue({ playerId, playerName, clue, timestamp: Date.now() });
      if (hostComment) addHostComment(hostComment);
    });

    socket.on('next-turn', ({ currentPlayerId, turnIndex }) => {
      updateGame({ currentTurnIndex: turnIndex });
    });

    socket.on('clue-error', ({ error }) => {
      setError(error);
    });

    socket.on('discussion-started', ({ clues, duration, hostComment }) => {
      updateGame({ phase: 'discussion', clues, discussionEndTime: Date.now() + duration * 1000 });
      if (hostComment) addHostComment(hostComment);
    });

    socket.on('voting-started', ({ hostComment }) => {
      updateGame({ phase: 'voting', votes: [] });
      if (hostComment) addHostComment(hostComment);
    });

    socket.on('player-voted', ({ playerId, votesCount, totalPlayers }) => {
      addVote({ playerId, hasVoted: true });
    });

    socket.on('vote-error', ({ error }) => {
      setError(error);
    });

    socket.on('votes-revealed', ({ votes, accusedPlayer, chameleonCaught, chameleonId, chameleonName, voteCounts, tie, hostComment }) => {
      setVotes(votes);
      updateGame({
        phase: chameleonCaught ? 'chameleon-guess' : 'results',
        accusedPlayer,
        chameleonCaught,
        chameleonId,
        chameleonName,
        voteCounts,
        tie
      });
      if (hostComment) addHostComment(hostComment);
    });

    socket.on('chameleon-guess-result', ({ correct, guess, secretWord, result, hostComment }) => {
      updateGame({
        phase: 'results',
        chameleonGuess: guess,
        chameleonGuessCorrect: correct,
        secretWord,
        roundResult: result
      });
      if (hostComment) addHostComment(hostComment);
    });

    socket.on('guess-error', ({ error }) => {
      setError(error);
    });

    socket.on('round-results', ({ result, scores, secretWord, round }) => {
      updateGame({
        phase: 'results',
        roundResult: result,
        scores,
        secretWord,
        round
      });
      updateScores(scores);
    });

    socket.on('new-round-started', ({ round, hostComment }) => {
      updateGame({
        phase: 'role-reveal',
        round,
        clues: [],
        votes: [],
        roundResult: null,
        chameleonGuess: null
      });
      setSecretWord(null);
      setRole(null);
      if (hostComment) addHostComment(hostComment);
    });

    socket.on('game-ended', ({ finalScores, rounds, room }) => {
      setRoom(room);
      resetGame();
      addHostComment(`Game Over! ${rounds} rounds played.`);
    });

    socket.on('chat-message', ({ playerId, playerName, message, timestamp }) => {
      addMessage({ playerId, playerName, message, timestamp });
    });

    socket.on('game-state', ({ room, game }) => {
      setRoom(room);
      if (game) {
        setGame(game);
        setRole(game.myRole);
        setSecretWord(game.secretWord);
      }
    });

    socket.on('room-state', ({ room }) => {
      setRoom(room);
    });

    socket.on('error', ({ error }) => {
      setError(error);
    });

    // Don't disconnect on cleanup - keep socket alive
  }, []);

  // Socket action functions
  const createRoom = useCallback((playerName) => {
    getSocket().emit('create-room', { playerName });
  }, []);

  const joinRoom = useCallback((roomCode, playerName) => {
    getSocket().emit('join-room', { roomCode: roomCode.toUpperCase(), playerName });
  }, []);

  const addAIPlayer = useCallback((roomCode) => {
    getSocket().emit('add-ai-player', { roomCode });
  }, []);

  const removeAIPlayer = useCallback((roomCode, aiPlayerId) => {
    getSocket().emit('remove-ai-player', { roomCode, aiPlayerId });
  }, []);

  const toggleReady = useCallback((roomCode) => {
    getSocket().emit('toggle-ready', { roomCode });
  }, []);

  const startGame = useCallback((roomCode) => {
    getSocket().emit('start-game', { roomCode });
  }, []);

  const submitClue = useCallback((roomCode, clue) => {
    getSocket().emit('submit-clue', { roomCode, clue });
  }, []);

  const submitVote = useCallback((roomCode, votedForId) => {
    getSocket().emit('submit-vote', { roomCode, votedForId });
  }, []);

  const submitChameleonGuess = useCallback((roomCode, guess) => {
    getSocket().emit('chameleon-guess', { roomCode, guess });
  }, []);

  const requestNextRound = useCallback((roomCode) => {
    getSocket().emit('next-round', { roomCode });
  }, []);

  const endGame = useCallback((roomCode) => {
    getSocket().emit('end-game', { roomCode });
  }, []);

  const sendChat = useCallback((roomCode, message) => {
    getSocket().emit('send-chat', { roomCode, message });
  }, []);

  const requestGameState = useCallback((roomCode) => {
    getSocket().emit('get-game-state', { roomCode });
  }, []);

  return {
    socket: getSocket(),
    createRoom,
    joinRoom,
    addAIPlayer,
    removeAIPlayer,
    toggleReady,
    startGame,
    submitClue,
    submitVote,
    submitChameleonGuess,
    requestNextRound,
    endGame,
    sendChat,
    requestGameState,
  };
}
