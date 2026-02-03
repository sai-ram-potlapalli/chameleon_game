import { createContext, useContext, useReducer, useCallback } from 'react';

const GameContext = createContext(null);

const initialState = {
  playerId: null,
  playerName: '',
  room: null,
  game: null,
  myRole: null,
  secretWord: null,
  messages: [],
  hostComments: [],
  connected: false,
  error: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_PLAYER':
      return { ...state, playerId: action.payload.id, playerName: action.payload.name };

    case 'SET_ROOM':
      return { ...state, room: action.payload, error: null };

    case 'UPDATE_ROOM':
      return { ...state, room: { ...state.room, ...action.payload } };

    case 'SET_GAME':
      return { ...state, game: action.payload };

    case 'UPDATE_GAME':
      return { ...state, game: state.game ? { ...state.game, ...action.payload } : action.payload };

    case 'SET_ROLE':
      return { ...state, myRole: action.payload };

    case 'SET_SECRET_WORD':
      return { ...state, secretWord: action.payload };

    case 'ADD_CLUE':
      return {
        ...state,
        game: state.game ? {
          ...state.game,
          clues: [...(state.game.clues || []), action.payload]
        } : state.game
      };

    case 'ADD_VOTE':
      return {
        ...state,
        game: state.game ? {
          ...state.game,
          votes: [...(state.game.votes || []), action.payload]
        } : state.game
      };

    case 'SET_VOTES':
      return {
        ...state,
        game: state.game ? { ...state.game, votes: action.payload } : state.game
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload].slice(-100) // Keep last 100 messages
      };

    case 'ADD_HOST_COMMENT':
      return {
        ...state,
        hostComments: [...state.hostComments, {
          text: action.payload,
          timestamp: Date.now()
        }].slice(-10) // Keep last 10 comments
      };

    case 'SET_CONNECTED':
      return { ...state, connected: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'UPDATE_PLAYER_IN_ROOM':
      if (!state.room) return state;
      return {
        ...state,
        room: {
          ...state.room,
          players: state.room.players.map(p =>
            p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
          )
        }
      };

    case 'ADD_PLAYER_TO_ROOM':
      if (!state.room) return state;
      return {
        ...state,
        room: {
          ...state.room,
          players: [...state.room.players, action.payload]
        }
      };

    case 'REMOVE_PLAYER_FROM_ROOM':
      if (!state.room) return state;
      return {
        ...state,
        room: {
          ...state.room,
          players: state.room.players.filter(p => p.id !== action.payload)
        }
      };

    case 'UPDATE_SCORES':
      return {
        ...state,
        game: state.game ? { ...state.game, scores: action.payload } : state.game
      };

    case 'RESET_GAME':
      return {
        ...state,
        game: null,
        myRole: null,
        secretWord: null,
        hostComments: []
      };

    case 'LEAVE_ROOM':
      return {
        ...initialState,
        playerId: state.playerId,
        playerName: state.playerName,
        connected: state.connected
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setPlayer = useCallback((id, name) => {
    dispatch({ type: 'SET_PLAYER', payload: { id, name } });
  }, []);

  const setRoom = useCallback((room) => {
    dispatch({ type: 'SET_ROOM', payload: room });
  }, []);

  const updateRoom = useCallback((updates) => {
    dispatch({ type: 'UPDATE_ROOM', payload: updates });
  }, []);

  const setGame = useCallback((game) => {
    dispatch({ type: 'SET_GAME', payload: game });
  }, []);

  const updateGame = useCallback((updates) => {
    dispatch({ type: 'UPDATE_GAME', payload: updates });
  }, []);

  const setRole = useCallback((role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  }, []);

  const setSecretWord = useCallback((word) => {
    dispatch({ type: 'SET_SECRET_WORD', payload: word });
  }, []);

  const addClue = useCallback((clue) => {
    dispatch({ type: 'ADD_CLUE', payload: clue });
  }, []);

  const addVote = useCallback((vote) => {
    dispatch({ type: 'ADD_VOTE', payload: vote });
  }, []);

  const setVotes = useCallback((votes) => {
    dispatch({ type: 'SET_VOTES', payload: votes });
  }, []);

  const addMessage = useCallback((message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  }, []);

  const addHostComment = useCallback((comment) => {
    dispatch({ type: 'ADD_HOST_COMMENT', payload: comment });
  }, []);

  const setConnected = useCallback((connected) => {
    dispatch({ type: 'SET_CONNECTED', payload: connected });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const updatePlayerInRoom = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_PLAYER_IN_ROOM', payload: { id, updates } });
  }, []);

  const addPlayerToRoom = useCallback((player) => {
    dispatch({ type: 'ADD_PLAYER_TO_ROOM', payload: player });
  }, []);

  const removePlayerFromRoom = useCallback((playerId) => {
    dispatch({ type: 'REMOVE_PLAYER_FROM_ROOM', payload: playerId });
  }, []);

  const updateScores = useCallback((scores) => {
    dispatch({ type: 'UPDATE_SCORES', payload: scores });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const leaveRoom = useCallback(() => {
    dispatch({ type: 'LEAVE_ROOM' });
  }, []);

  const value = {
    ...state,
    setPlayer,
    setRoom,
    updateRoom,
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
    clearError,
    updatePlayerInRoom,
    addPlayerToRoom,
    removePlayerFromRoom,
    updateScores,
    resetGame,
    leaveRoom,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
