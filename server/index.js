const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const RoomManager = require('./src/rooms/RoomManager');
const GameManager = require('./src/game/GameManager');
const GameLogic = require('./src/game/GameLogic');

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// AI Host commentary
const AIHost = {
  comments: {
    gameStart: [
      "Welcome to The Chameleon! One of you is NOT who they claim to be...",
      "Let the hunt begin! Can you spot the imposter among you?",
      "Trust no one. Question everything. The Chameleon is watching."
    ],
    roleReveal: [
      "Cards have been dealt. Someone's sweating already!",
      "Check your card carefully... or pretend to!",
      "The Chameleon is among us. Act natural, everyone."
    ],
    diceRoll: [
      "The dice decide your fate!",
      "Rolling for the secret word...",
      "Let's see what the universe has chosen!"
    ],
    clueStart: [
      "Time for clues! Remember: one word only, and make it count.",
      "Choose your words wisely. The Chameleon is listening.",
      "Don't be too obvious... or too vague. Good luck!"
    ],
    clueGiven: [
      "Interesting choice...",
      "Hmm, that could mean anything!",
      "Someone's thinking hard about that one.",
      "Bold move. Let's see how it plays out.",
      "Now THAT'S suspicious... or is it?"
    ],
    discussionStart: [
      "Time to point fingers! Who's the Chameleon?",
      "The debate begins. Trust your instincts!",
      "Two minutes to decide. Who's been bluffing?"
    ],
    votingStart: [
      "It's voting time! Choose wisely.",
      "Point at the player you suspect most!",
      "The moment of truth approaches..."
    ],
    votingTense: [
      "The tension is palpable!",
      "I can feel the suspicion in the air.",
      "Someone's about to be exposed..."
    ],
    chameleonCaught: [
      "The Chameleon has been caught! But can they guess the word?",
      "Gotcha! Now for the final challenge...",
      "Cornered! Let's see if they can escape with a correct guess."
    ],
    chameleonEscaped: [
      "The wrong person was accused! The Chameleon escapes!",
      "Incredible! The Chameleon fooled everyone!",
      "You've accused an innocent player. The Chameleon wins!"
    ],
    chameleonGuessCorrect: [
      "Unbelievable! The Chameleon guessed the word!",
      "Even caught, the Chameleon proves their worth!",
      "A masterful guess! The Chameleon salvages a point!"
    ],
    chameleonGuessWrong: [
      "Wrong guess! The players triumph!",
      "So close, yet so far. The Chameleon falls!",
      "The secret word remains safe. Victory for the players!"
    ],
    tieVote: [
      "A tie vote! Chaos reigns and the Chameleon slips away!",
      "Can't decide? The Chameleon thanks you!",
      "Split decision! The sneaky Chameleon escapes!"
    ]
  },

  getComment(category) {
    const comments = this.comments[category];
    if (!comments) return null;
    return comments[Math.floor(Math.random() * comments.length)];
  },

  getClueReaction(clue, isEarlyClue) {
    if (isEarlyClue) {
      return this.comments.clueGiven[Math.floor(Math.random() * this.comments.clueGiven.length)];
    }
    // More specific reactions based on clue
    if (clue.length <= 3) {
      return "Short and cryptic. Interesting strategy!";
    }
    if (clue.length > 8) {
      return "That's quite a specific word choice...";
    }
    return this.comments.clueGiven[Math.floor(Math.random() * this.comments.clueGiven.length)];
  }
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  let currentRoom = null;

  // Create a new room
  socket.on('create-room', ({ playerName }) => {
    const room = RoomManager.createRoom(socket.id, playerName);
    currentRoom = room.code;
    socket.join(room.code);

    socket.emit('room-created', {
      room: sanitizeRoom(room),
      playerId: socket.id
    });

    console.log(`Room ${room.code} created by ${playerName}`);
  });

  // Join an existing room
  socket.on('join-room', ({ roomCode, playerName }) => {
    const result = RoomManager.joinRoom(roomCode, socket.id, playerName);

    if (!result.success) {
      socket.emit('join-error', { error: result.error });
      return;
    }

    currentRoom = roomCode.toUpperCase();
    socket.join(currentRoom);

    socket.emit('room-joined', {
      room: sanitizeRoom(result.room),
      playerId: socket.id,
      reconnected: result.reconnected
    });

    // Notify other players
    socket.to(currentRoom).emit('player-joined', {
      player: result.room.players.find(p => p.id === socket.id),
      room: sanitizeRoom(result.room)
    });

    console.log(`${playerName} joined room ${currentRoom}`);
  });

  // Add AI player
  socket.on('add-ai-player', ({ roomCode }) => {
    const room = RoomManager.getRoom(roomCode);
    if (!room || room.hostId !== socket.id) {
      socket.emit('error', { error: 'Only the host can add AI players' });
      return;
    }

    const result = RoomManager.addAIPlayer(roomCode);
    if (!result.success) {
      socket.emit('error', { error: result.error });
      return;
    }

    io.to(roomCode).emit('ai-player-added', {
      aiPlayer: result.aiPlayer,
      room: sanitizeRoom(result.room)
    });
  });

  // Remove AI player
  socket.on('remove-ai-player', ({ roomCode, aiPlayerId }) => {
    const room = RoomManager.getRoom(roomCode);
    if (!room || room.hostId !== socket.id) {
      socket.emit('error', { error: 'Only the host can remove AI players' });
      return;
    }

    const result = RoomManager.removeAIPlayer(roomCode, aiPlayerId);
    if (!result.success) {
      socket.emit('error', { error: result.error });
      return;
    }

    io.to(roomCode).emit('ai-player-removed', {
      removedId: aiPlayerId,
      room: sanitizeRoom(result.room)
    });
  });

  // Toggle ready status
  socket.on('toggle-ready', ({ roomCode }) => {
    const room = RoomManager.getRoom(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const result = RoomManager.setPlayerReady(roomCode, socket.id, !player.isReady);
    if (result.success) {
      io.to(roomCode).emit('player-ready-changed', {
        playerId: socket.id,
        isReady: !player.isReady,
        room: sanitizeRoom(result.room)
      });
    }
  });

  // Start game
  socket.on('start-game', ({ roomCode }) => {
    const room = RoomManager.getRoom(roomCode);
    if (!room || room.hostId !== socket.id) {
      socket.emit('error', { error: 'Only the host can start the game' });
      return;
    }

    const canStart = RoomManager.canStartGame(roomCode);
    if (!canStart.canStart) {
      socket.emit('error', { error: canStart.reason });
      return;
    }

    // Create game
    const game = GameManager.createGame(room);
    room.status = 'playing';

    // Send game started with host comment
    io.to(roomCode).emit('game-started', {
      hostComment: AIHost.getComment('gameStart')
    });

    // Send role to each player
    for (const player of room.players) {
      const playerSocket = io.sockets.sockets.get(player.id);
      if (playerSocket) {
        playerSocket.emit('role-assigned', {
          role: game.roles[player.id],
          hostComment: AIHost.getComment('roleReveal')
        });
      }
    }

    // Schedule phase advances
    setTimeout(() => {
      GameManager.advancePhase(roomCode);
      io.to(roomCode).emit('dice-rolled', {
        diceResult: game.diceResult,
        topic: {
          id: game.topic.id,
          name: game.topic.name,
          icon: game.topic.icon,
          words: game.topic.words
        },
        hostComment: AIHost.getComment('diceRoll')
      });

      // Send secret word to non-chameleons
      for (const player of room.players) {
        if (!game.roles[player.id].isChameleon) {
          const playerSocket = io.sockets.sockets.get(player.id);
          if (playerSocket) {
            playerSocket.emit('secret-word-revealed', {
              secretWord: game.secretWord,
              wordIndex: game.diceResult.index
            });
          }
        }
      }

      // Start clue giving phase after dice reveal
      setTimeout(() => {
        startClueGivingPhase(roomCode);
      }, 3000);
    }, 5000);

    console.log(`Game started in room ${roomCode}`);
  });

  // Submit clue
  socket.on('submit-clue', ({ roomCode, clue }) => {
    const result = GameManager.submitClue(roomCode, socket.id, clue);

    if (!result.success) {
      socket.emit('clue-error', { error: result.error });
      return;
    }

    const room = RoomManager.getRoom(roomCode);
    const player = room.players.find(p => p.id === socket.id);
    const game = GameManager.getGame(roomCode);
    const isEarlyClue = game.clues.length <= 2;

    io.to(roomCode).emit('clue-submitted', {
      playerId: socket.id,
      playerName: player.name,
      clue: result.clue,
      hostComment: AIHost.getClueReaction(result.clue, isEarlyClue)
    });

    if (result.phaseComplete) {
      startDiscussionPhase(roomCode);
    } else {
      // Next turn
      io.to(roomCode).emit('next-turn', {
        currentPlayerId: result.nextTurn,
        turnIndex: game.currentTurnIndex
      });

      // Process AI turn if needed
      processAITurnIfNeeded(roomCode);
    }
  });

  // Submit vote
  socket.on('submit-vote', ({ roomCode, votedForId }) => {
    const result = GameManager.submitVote(roomCode, socket.id, votedForId);

    if (!result.success) {
      socket.emit('vote-error', { error: result.error });
      return;
    }

    // Notify that someone voted (without revealing who they voted for)
    io.to(roomCode).emit('player-voted', {
      playerId: socket.id,
      votesCount: result.votesCount || GameManager.getGame(roomCode)?.votes.length,
      totalPlayers: result.totalPlayers || GameManager.getGame(roomCode)?.turnOrder.length
    });

    if (result.votingComplete) {
      handleVotingComplete(roomCode, result);
    }
  });

  // Chameleon guess
  socket.on('chameleon-guess', ({ roomCode, guess }) => {
    const result = GameManager.submitChameleonGuess(roomCode, socket.id, guess);

    if (!result.success) {
      socket.emit('guess-error', { error: result.error });
      return;
    }

    const hostComment = result.correct
      ? AIHost.getComment('chameleonGuessCorrect')
      : AIHost.getComment('chameleonGuessWrong');

    io.to(roomCode).emit('chameleon-guess-result', {
      correct: result.correct,
      guess: guess,
      secretWord: result.secretWord,
      result: result.result,
      hostComment
    });

    // Show final results
    setTimeout(() => {
      showRoundResults(roomCode);
    }, 3000);
  });

  // Request next round
  socket.on('next-round', ({ roomCode }) => {
    const room = RoomManager.getRoom(roomCode);
    if (!room || room.hostId !== socket.id) {
      socket.emit('error', { error: 'Only the host can start the next round' });
      return;
    }

    const game = GameManager.startNewRound(roomCode, room);
    if (!game) {
      socket.emit('error', { error: 'Could not start new round' });
      return;
    }

    io.to(roomCode).emit('new-round-started', {
      round: game.round,
      hostComment: AIHost.getComment('gameStart')
    });

    // Send roles
    for (const player of room.players) {
      const playerSocket = io.sockets.sockets.get(player.id);
      if (playerSocket) {
        playerSocket.emit('role-assigned', {
          role: game.roles[player.id],
          hostComment: AIHost.getComment('roleReveal')
        });
      }
    }

    // Dice roll after delay
    setTimeout(() => {
      GameManager.advancePhase(roomCode);
      io.to(roomCode).emit('dice-rolled', {
        diceResult: game.diceResult,
        topic: {
          id: game.topic.id,
          name: game.topic.name,
          icon: game.topic.icon,
          words: game.topic.words
        },
        hostComment: AIHost.getComment('diceRoll')
      });

      // Send secret word to non-chameleons
      for (const player of room.players) {
        if (!game.roles[player.id].isChameleon) {
          const playerSocket = io.sockets.sockets.get(player.id);
          if (playerSocket) {
            playerSocket.emit('secret-word-revealed', {
              secretWord: game.secretWord,
              wordIndex: game.diceResult.index
            });
          }
        }
      }

      setTimeout(() => {
        startClueGivingPhase(roomCode);
      }, 3000);
    }, 5000);
  });

  // End game
  socket.on('end-game', ({ roomCode }) => {
    const room = RoomManager.getRoom(roomCode);
    if (!room || room.hostId !== socket.id) return;

    const gameResult = GameManager.endGame(roomCode);
    room.status = 'lobby';

    // Reset player ready status
    for (const player of room.players) {
      if (!player.isAI && !player.isHost) {
        player.isReady = false;
      }
    }

    io.to(roomCode).emit('game-ended', {
      finalScores: gameResult?.finalScores || {},
      rounds: gameResult?.rounds || 1,
      room: sanitizeRoom(room)
    });
  });

  // Chat message
  socket.on('send-chat', ({ roomCode, message }) => {
    const room = RoomManager.getRoom(roomCode);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    io.to(roomCode).emit('chat-message', {
      playerId: socket.id,
      playerName: player.name,
      message: message.substring(0, 200), // Limit message length
      timestamp: Date.now()
    });
  });

  // Get game state (for reconnection)
  socket.on('get-game-state', ({ roomCode }) => {
    const room = RoomManager.getRoom(roomCode);
    if (!room) {
      socket.emit('error', { error: 'Room not found' });
      return;
    }

    const game = GameManager.getGame(roomCode);
    if (game) {
      socket.emit('game-state', {
        room: sanitizeRoom(room),
        game: GameManager.getPlayerGameState(roomCode, socket.id)
      });
    } else {
      socket.emit('room-state', {
        room: sanitizeRoom(room)
      });
    }
  });

  // Disconnect - just mark as disconnected, don't remove
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);

    if (currentRoom) {
      const result = RoomManager.markDisconnected(currentRoom, socket.id);
      if (result.success) {
        io.to(currentRoom).emit('player-disconnected', {
          playerId: socket.id,
          playerName: result.player?.name,
          room: sanitizeRoom(result.room)
        });
      }
    }
  });
});

// Helper functions
function sanitizeRoom(room) {
  return {
    code: room.code,
    hostId: room.hostId,
    status: room.status,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      isAI: p.isAI,
      isReady: p.isReady,
      avatar: p.avatar,
      score: p.score,
      connected: p.connected
    })),
    settings: room.settings
  };
}

function startClueGivingPhase(roomCode) {
  const game = GameManager.getGame(roomCode);
  if (!game) return;

  GameManager.setPhase(roomCode, 'clue-giving');

  io.to(roomCode).emit('clue-phase-started', {
    turnOrder: game.turnOrder,
    currentPlayerId: game.turnOrder[0],
    hostComment: AIHost.getComment('clueStart')
  });

  // Process AI turn if first player is AI
  processAITurnIfNeeded(roomCode);
}

function processAITurnIfNeeded(roomCode) {
  const room = RoomManager.getRoom(roomCode);
  const game = GameManager.getGame(roomCode);
  if (!room || !game || game.phase !== 'clue-giving') return;

  const currentTurn = GameManager.getCurrentTurn(roomCode);
  const currentPlayer = room.players.find(p => p.id === currentTurn.playerId);

  if (currentPlayer && currentPlayer.isAI) {
    // Add delay for AI thinking
    setTimeout(async () => {
      const result = await GameManager.processAITurn(roomCode, room);
      if (result && result.success) {
        io.to(roomCode).emit('clue-submitted', {
          playerId: currentPlayer.id,
          playerName: currentPlayer.name,
          clue: result.clue,
          hostComment: AIHost.getClueReaction(result.clue, game.clues.length <= 2)
        });

        if (result.phaseComplete) {
          startDiscussionPhase(roomCode);
        } else {
          const updatedGame = GameManager.getGame(roomCode);
          io.to(roomCode).emit('next-turn', {
            currentPlayerId: updatedGame.turnOrder[updatedGame.currentTurnIndex],
            turnIndex: updatedGame.currentTurnIndex
          });

          // Continue processing AI turns
          processAITurnIfNeeded(roomCode);
        }
      }
    }, 2000 + Math.random() * 2000); // 2-4 second delay
  }
}

function startDiscussionPhase(roomCode) {
  const game = GameManager.getGame(roomCode);
  if (!game) return;

  GameManager.setPhase(roomCode, 'discussion');

  io.to(roomCode).emit('discussion-started', {
    clues: game.clues,
    duration: game.settings.discussionTime,
    hostComment: AIHost.getComment('discussionStart')
  });

  // Auto-transition to voting after discussion time
  setTimeout(() => {
    startVotingPhase(roomCode);
  }, game.settings.discussionTime * 1000);
}

function startVotingPhase(roomCode) {
  const game = GameManager.getGame(roomCode);
  if (!game || game.phase !== 'discussion') return;

  GameManager.setPhase(roomCode, 'voting');

  io.to(roomCode).emit('voting-started', {
    hostComment: AIHost.getComment('votingStart')
  });

  // Process AI votes
  setTimeout(() => {
    const room = RoomManager.getRoom(roomCode);
    if (!room) return;

    const voteResults = GameManager.processAIVotes(roomCode, room);

    for (const voteResult of voteResults) {
      io.to(roomCode).emit('player-voted', {
        playerId: voteResult.playerId,
        votesCount: GameManager.getGame(roomCode)?.votes.length,
        totalPlayers: GameManager.getGame(roomCode)?.turnOrder.length
      });

      if (voteResult.result.votingComplete) {
        handleVotingComplete(roomCode, voteResult.result);
        return;
      }
    }
  }, 1000);
}

function handleVotingComplete(roomCode, result) {
  const room = RoomManager.getRoom(roomCode);
  const game = GameManager.getGame(roomCode);
  if (!room || !game) return;

  if (result.nextPhase === 'chameleon-guess') {
    const chameleonPlayer = room.players.find(p => p.id === game.chameleonId);

    io.to(roomCode).emit('votes-revealed', {
      votes: game.votes,
      accusedPlayer: result.accusedPlayer,
      chameleonCaught: true,
      chameleonId: game.chameleonId,
      chameleonName: chameleonPlayer?.name,
      voteCounts: result.voteCounts,
      hostComment: AIHost.getComment('chameleonCaught')
    });

    // If chameleon is AI, process their guess
    if (chameleonPlayer && chameleonPlayer.isAI) {
      setTimeout(() => {
        const guessResult = GameManager.processAIChameleonGuess(roomCode, room);
        if (guessResult) {
          const hostComment = guessResult.correct
            ? AIHost.getComment('chameleonGuessCorrect')
            : AIHost.getComment('chameleonGuessWrong');

          io.to(roomCode).emit('chameleon-guess-result', {
            correct: guessResult.correct,
            guess: game.chameleonGuess,
            secretWord: guessResult.secretWord,
            result: guessResult.result,
            hostComment
          });

          setTimeout(() => {
            showRoundResults(roomCode);
          }, 3000);
        }
      }, 3000);
    }
  } else if (result.nextPhase === 'results') {
    const hostComment = result.tie
      ? AIHost.getComment('tieVote')
      : AIHost.getComment('chameleonEscaped');

    io.to(roomCode).emit('votes-revealed', {
      votes: game.votes,
      accusedPlayer: result.accusedPlayer,
      chameleonCaught: false,
      chameleonId: game.chameleonId,
      chameleonName: room.players.find(p => p.id === game.chameleonId)?.name,
      voteCounts: result.voteCounts,
      tie: result.tie,
      hostComment
    });

    setTimeout(() => {
      showRoundResults(roomCode);
    }, 4000);
  }
}

function showRoundResults(roomCode) {
  const game = GameManager.getGame(roomCode);
  if (!game) return;

  io.to(roomCode).emit('round-results', {
    result: game.roundResult,
    scores: game.scores,
    secretWord: game.secretWord,
    round: game.round
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', rooms: RoomManager.rooms.size });
});

// Get topics endpoint
app.get('/api/topics', (req, res) => {
  res.json(GameLogic.getTopics());
});

// Cleanup old rooms periodically
setInterval(() => {
  RoomManager.cleanupOldRooms();
}, 600000); // Every 10 minutes

// Cleanup disconnected players periodically (60 second grace period)
setInterval(() => {
  for (const [code, room] of RoomManager.rooms) {
    RoomManager.cleanupDisconnectedPlayers(code, 60000);
  }
}, 30000); // Check every 30 seconds

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🦎 Chameleon server running on port ${PORT}`);
});
