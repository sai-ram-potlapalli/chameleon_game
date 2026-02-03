const GameLogic = require('./GameLogic');
const AIPlayer = require('../ai/AIPlayer');

class GameManager {
  constructor() {
    this.games = new Map();
  }

  createGame(room) {
    const playerIds = room.players.map(p => p.id);
    const topic = GameLogic.getRandomTopic();
    const diceResult = GameLogic.rollDice();
    const secretWord = GameLogic.getSecretWord(topic, diceResult);
    const { roles, chameleonId } = GameLogic.assignRoles(playerIds);
    const turnOrder = GameLogic.getTurnOrder(playerIds);

    const game = {
      roomCode: room.code,
      round: 1,
      phase: 'role-reveal', // role-reveal, dice-roll, clue-giving, discussion, voting, chameleon-guess, results
      topic,
      diceResult,
      secretWord,
      roles,
      chameleonId,
      turnOrder,
      currentTurnIndex: 0,
      clues: [],
      votes: [],
      chameleonGuess: null,
      roundResult: null,
      scores: {},
      turnStartTime: null,
      phaseStartTime: Date.now(),
      settings: room.settings
    };

    // Initialize scores
    for (const playerId of playerIds) {
      game.scores[playerId] = 0;
    }

    this.games.set(room.code, game);
    return game;
  }

  getGame(roomCode) {
    return this.games.get(roomCode);
  }

  // Advance to next phase
  advancePhase(roomCode) {
    const game = this.getGame(roomCode);
    if (!game) return null;

    const phases = ['role-reveal', 'dice-roll', 'clue-giving', 'discussion', 'voting', 'results'];
    const currentIndex = phases.indexOf(game.phase);

    if (currentIndex < phases.length - 1) {
      game.phase = phases[currentIndex + 1];
      game.phaseStartTime = Date.now();

      if (game.phase === 'clue-giving') {
        game.turnStartTime = Date.now();
      }
    }

    return game;
  }

  // Set specific phase
  setPhase(roomCode, phase) {
    const game = this.getGame(roomCode);
    if (!game) return null;

    game.phase = phase;
    game.phaseStartTime = Date.now();

    if (phase === 'clue-giving') {
      game.turnStartTime = Date.now();
    }

    return game;
  }

  // Get current player's turn
  getCurrentTurn(roomCode) {
    const game = this.getGame(roomCode);
    if (!game) return null;

    return {
      playerId: game.turnOrder[game.currentTurnIndex],
      turnIndex: game.currentTurnIndex,
      totalTurns: game.turnOrder.length
    };
  }

  // Submit a clue
  submitClue(roomCode, playerId, clue) {
    const game = this.getGame(roomCode);
    if (!game) return { success: false, error: 'Game not found' };

    if (game.phase !== 'clue-giving') {
      return { success: false, error: 'Not in clue-giving phase' };
    }

    const currentTurn = this.getCurrentTurn(roomCode);
    if (currentTurn.playerId !== playerId) {
      return { success: false, error: 'Not your turn' };
    }

    // Validate clue
    const validation = GameLogic.validateClue(clue, game.secretWord, game.clues);
    if (!validation.valid) {
      return { success: false, error: validation.reason };
    }

    // Record clue
    game.clues.push({
      playerId,
      clue: validation.clue,
      timestamp: Date.now()
    });

    // Advance turn
    game.currentTurnIndex++;

    // Check if all clues given
    if (game.currentTurnIndex >= game.turnOrder.length) {
      game.phase = 'discussion';
      game.phaseStartTime = Date.now();
      return { success: true, clue: validation.clue, phaseComplete: true, nextPhase: 'discussion' };
    }

    game.turnStartTime = Date.now();
    return {
      success: true,
      clue: validation.clue,
      nextTurn: game.turnOrder[game.currentTurnIndex]
    };
  }

  // Submit a vote
  submitVote(roomCode, playerId, votedForId) {
    const game = this.getGame(roomCode);
    if (!game) return { success: false, error: 'Game not found' };

    if (game.phase !== 'voting') {
      return { success: false, error: 'Not in voting phase' };
    }

    // Check if already voted
    if (game.votes.some(v => v.playerId === playerId)) {
      return { success: false, error: 'Already voted' };
    }

    // Can't vote for yourself
    if (playerId === votedForId) {
      return { success: false, error: 'Cannot vote for yourself' };
    }

    // Check if votedFor is a valid player
    if (!game.turnOrder.includes(votedForId)) {
      return { success: false, error: 'Invalid player to vote for' };
    }

    game.votes.push({
      playerId,
      votedFor: votedForId,
      timestamp: Date.now()
    });

    // Check if all votes are in
    if (game.votes.length >= game.turnOrder.length) {
      return this.resolveVoting(roomCode);
    }

    return { success: true, votesCount: game.votes.length, totalPlayers: game.turnOrder.length };
  }

  // Resolve voting
  resolveVoting(roomCode) {
    const game = this.getGame(roomCode);
    if (!game) return { success: false, error: 'Game not found' };

    const voteResult = GameLogic.determineWinner(game.votes, game.turnOrder.length);

    if (voteResult.tie) {
      // Tie - chameleon escapes!
      game.roundResult = {
        tie: true,
        chameleonId: game.chameleonId,
        chameleonCaught: false,
        chameleonGuessedWord: false,
        secretWord: game.secretWord,
        voteCounts: voteResult.voteCounts
      };
      game.phase = 'results';

      const scores = GameLogic.calculateScores(game.roundResult);
      this.updateScores(roomCode, scores);

      return {
        success: true,
        votingComplete: true,
        result: game.roundResult,
        nextPhase: 'results'
      };
    }

    const accusedIsChameleon = voteResult.accusedPlayer === game.chameleonId;

    if (accusedIsChameleon) {
      // Chameleon caught - they get a chance to guess
      game.phase = 'chameleon-guess';
      game.phaseStartTime = Date.now();
      game.accusedPlayer = voteResult.accusedPlayer;

      return {
        success: true,
        votingComplete: true,
        chameleonCaught: true,
        chameleonId: game.chameleonId,
        accusedPlayer: voteResult.accusedPlayer,
        voteCounts: voteResult.voteCounts,
        nextPhase: 'chameleon-guess'
      };
    } else {
      // Wrong accusation - chameleon wins!
      game.roundResult = {
        tie: false,
        chameleonId: game.chameleonId,
        accusedPlayer: voteResult.accusedPlayer,
        chameleonCaught: false,
        chameleonGuessedWord: false,
        secretWord: game.secretWord,
        voteCounts: voteResult.voteCounts
      };
      game.phase = 'results';

      const scores = GameLogic.calculateScores(game.roundResult);
      this.updateScores(roomCode, scores);

      return {
        success: true,
        votingComplete: true,
        chameleonCaught: false,
        chameleonId: game.chameleonId,
        accusedPlayer: voteResult.accusedPlayer,
        voteCounts: voteResult.voteCounts,
        result: game.roundResult,
        nextPhase: 'results'
      };
    }
  }

  // Chameleon makes their guess
  submitChameleonGuess(roomCode, playerId, guess) {
    const game = this.getGame(roomCode);
    if (!game) return { success: false, error: 'Game not found' };

    if (game.phase !== 'chameleon-guess') {
      return { success: false, error: 'Not in chameleon guess phase' };
    }

    if (playerId !== game.chameleonId) {
      return { success: false, error: 'Only the chameleon can guess' };
    }

    const correct = GameLogic.checkChameleonGuess(guess, game.secretWord);
    game.chameleonGuess = guess;

    game.roundResult = {
      tie: false,
      chameleonId: game.chameleonId,
      chameleonCaught: true,
      chameleonGuessedWord: correct,
      chameleonGuess: guess,
      secretWord: game.secretWord,
      voteCounts: {}
    };

    const scores = GameLogic.calculateScores(game.roundResult);
    this.updateScores(roomCode, scores);

    game.phase = 'results';

    return {
      success: true,
      correct,
      secretWord: game.secretWord,
      result: game.roundResult,
      nextPhase: 'results'
    };
  }

  // Update scores
  updateScores(roomCode, roundScores) {
    const game = this.getGame(roomCode);
    if (!game) return;

    for (const [playerId, points] of Object.entries(roundScores)) {
      game.scores[playerId] = (game.scores[playerId] || 0) + points;
    }
  }

  // Start a new round
  startNewRound(roomCode, room) {
    const game = this.getGame(roomCode);
    if (!game) return null;

    const playerIds = room.players.map(p => p.id);
    const topic = GameLogic.getRandomTopic();
    const diceResult = GameLogic.rollDice();
    const secretWord = GameLogic.getSecretWord(topic, diceResult);
    const { roles, chameleonId } = GameLogic.assignRoles(playerIds);

    // Rotate turn order - start with next player
    const prevFirstPlayer = game.turnOrder[0];
    const prevFirstIndex = playerIds.indexOf(prevFirstPlayer);
    const newStartIndex = (prevFirstIndex + 1) % playerIds.length;
    const turnOrder = GameLogic.getTurnOrder(playerIds, newStartIndex);

    // Update game state
    game.round++;
    game.phase = 'role-reveal';
    game.topic = topic;
    game.diceResult = diceResult;
    game.secretWord = secretWord;
    game.roles = roles;
    game.chameleonId = chameleonId;
    game.turnOrder = turnOrder;
    game.currentTurnIndex = 0;
    game.clues = [];
    game.votes = [];
    game.chameleonGuess = null;
    game.roundResult = null;
    game.phaseStartTime = Date.now();
    game.turnStartTime = null;

    return game;
  }

  // Get game state for a specific player (hides secret info)
  getPlayerGameState(roomCode, playerId) {
    const game = this.getGame(roomCode);
    if (!game) return null;

    const playerRole = game.roles[playerId];
    const isChameleon = playerRole?.isChameleon;

    return {
      roomCode: game.roomCode,
      round: game.round,
      phase: game.phase,
      topic: {
        id: game.topic.id,
        name: game.topic.name,
        icon: game.topic.icon,
        words: game.topic.words
      },
      diceResult: game.phase !== 'role-reveal' ? game.diceResult : null,
      secretWord: !isChameleon && game.phase !== 'role-reveal' ? game.secretWord : null,
      myRole: playerRole,
      turnOrder: game.turnOrder,
      currentTurnIndex: game.currentTurnIndex,
      clues: game.clues,
      votes: game.phase === 'results' ? game.votes : game.votes.map(v => ({ playerId: v.playerId, hasVoted: true })),
      scores: game.scores,
      phaseStartTime: game.phaseStartTime,
      turnStartTime: game.turnStartTime,
      settings: game.settings,
      roundResult: game.phase === 'results' ? game.roundResult : null
    };
  }

  // Process AI turns
  async processAITurn(roomCode, room) {
    const game = this.getGame(roomCode);
    if (!game || game.phase !== 'clue-giving') return null;

    const currentTurn = this.getCurrentTurn(roomCode);
    const currentPlayer = room.players.find(p => p.id === currentTurn.playerId);

    if (!currentPlayer || !currentPlayer.isAI) return null;

    const isChameleon = game.roles[currentPlayer.id]?.isChameleon;
    const difficulty = game.settings.aiDifficulty || 'medium';

    let clue;
    if (isChameleon) {
      clue = AIPlayer.getChameleonClue(
        game.topic.words,
        game.clues,
        difficulty,
        currentPlayer.personality
      );
    } else {
      clue = AIPlayer.getRegularClue(
        game.secretWord,
        game.clues,
        difficulty,
        currentPlayer.personality
      );
    }

    return this.submitClue(roomCode, currentPlayer.id, clue);
  }

  // Process AI votes
  processAIVotes(roomCode, room) {
    const game = this.getGame(roomCode);
    if (!game || game.phase !== 'voting') return [];

    const results = [];
    const aiPlayers = room.players.filter(p => p.isAI);

    for (const aiPlayer of aiPlayers) {
      // Check if already voted
      if (game.votes.some(v => v.playerId === aiPlayer.id)) continue;

      const isChameleon = game.roles[aiPlayer.id]?.isChameleon;
      const difficulty = game.settings.aiDifficulty || 'medium';
      const otherPlayerIds = game.turnOrder.filter(id => id !== aiPlayer.id);

      const votedFor = AIPlayer.getVote(
        game.clues,
        game.secretWord,
        isChameleon,
        otherPlayerIds,
        difficulty,
        aiPlayer.personality
      );

      const voteResult = this.submitVote(roomCode, aiPlayer.id, votedFor);
      results.push({ playerId: aiPlayer.id, votedFor, result: voteResult });

      // If voting is complete, stop processing
      if (voteResult.votingComplete) break;
    }

    return results;
  }

  // Process AI chameleon guess
  processAIChameleonGuess(roomCode, room) {
    const game = this.getGame(roomCode);
    if (!game || game.phase !== 'chameleon-guess') return null;

    const chameleonPlayer = room.players.find(p => p.id === game.chameleonId);
    if (!chameleonPlayer || !chameleonPlayer.isAI) return null;

    const difficulty = game.settings.aiDifficulty || 'medium';
    const guess = AIPlayer.getChameleonGuess(
      game.topic.words,
      game.clues,
      difficulty,
      chameleonPlayer.personality
    );

    return this.submitChameleonGuess(roomCode, chameleonPlayer.id, guess);
  }

  // End game and cleanup
  endGame(roomCode) {
    const game = this.getGame(roomCode);
    if (!game) return null;

    const finalScores = { ...game.scores };
    this.games.delete(roomCode);

    return {
      finalScores,
      rounds: game.round
    };
  }
}

module.exports = new GameManager();
