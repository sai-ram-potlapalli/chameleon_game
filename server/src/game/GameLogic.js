const { topics } = require('../data/topics');

class GameLogic {
  // Roll two dice (1-6 each) and return grid coordinates
  rollDice() {
    const die1 = Math.floor(Math.random() * 6) + 1; // Row (1-4 maps to rows, 5-6 reroll concept or use 1-4)
    const die2 = Math.floor(Math.random() * 6) + 1; // Column

    // Map dice to 4x4 grid (use modulo for values > 4)
    const row = ((die1 - 1) % 4);
    const col = ((die2 - 1) % 4);

    return {
      die1,
      die2,
      row,
      col,
      index: row * 4 + col
    };
  }

  // Get a random topic
  getRandomTopic() {
    return topics[Math.floor(Math.random() * topics.length)];
  }

  // Get secret word based on dice roll
  getSecretWord(topic, diceResult) {
    return topic.words[diceResult.index];
  }

  // Shuffle array (Fisher-Yates)
  shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Assign roles - one chameleon, rest are regular players
  assignRoles(playerIds) {
    const shuffledIds = this.shuffle(playerIds);
    const chameleonId = shuffledIds[0];

    const roles = {};
    for (const id of playerIds) {
      roles[id] = {
        isChameleon: id === chameleonId,
        card: id === chameleonId ? 'chameleon' : 'code'
      };
    }

    return { roles, chameleonId };
  }

  // Determine turn order (random for first round, then rotate)
  getTurnOrder(playerIds, startIndex = null) {
    if (startIndex === null) {
      // Random start for first round
      return this.shuffle(playerIds);
    }
    // Rotate from start index
    const order = [...playerIds];
    return [...order.slice(startIndex), ...order.slice(0, startIndex)];
  }

  // Validate a clue
  validateClue(clue, secretWord, givenClues) {
    if (!clue || typeof clue !== 'string') {
      return { valid: false, reason: 'Clue must be a non-empty string' };
    }

    const normalizedClue = clue.trim().toLowerCase();

    // Check if empty
    if (normalizedClue.length === 0) {
      return { valid: false, reason: 'Clue cannot be empty' };
    }

    // Check if single word
    if (normalizedClue.includes(' ')) {
      return { valid: false, reason: 'Clue must be a single word' };
    }

    // Check if too long
    if (normalizedClue.length > 30) {
      return { valid: false, reason: 'Clue is too long' };
    }

    // Check if it's the secret word itself
    if (normalizedClue === secretWord.toLowerCase()) {
      return { valid: false, reason: 'Clue cannot be the secret word' };
    }

    // Check if already used
    const usedClues = givenClues.map(c => c.clue.toLowerCase());
    if (usedClues.includes(normalizedClue)) {
      return { valid: false, reason: 'This clue has already been used' };
    }

    return { valid: true, clue: clue.trim() };
  }

  // Calculate scores for a round
  calculateScores(result) {
    const scores = {};

    if (result.chameleonCaught) {
      if (result.chameleonGuessedWord) {
        // Chameleon caught but guessed word correctly
        // Chameleon gets 1 point
        scores[result.chameleonId] = 1;
        // No one else gets points
      } else {
        // Chameleon caught and failed to guess
        // Players who voted correctly get 2 points
        for (const vote of result.votes) {
          if (vote.votedFor === result.chameleonId) {
            scores[vote.playerId] = (scores[vote.playerId] || 0) + 2;
          }
        }
      }
    } else {
      // Chameleon escaped
      // Chameleon gets 2 points
      scores[result.chameleonId] = 2;
    }

    return scores;
  }

  // Determine round winner
  determineWinner(votes, playerCount) {
    // Count votes
    const voteCounts = {};
    for (const vote of votes) {
      voteCounts[vote.votedFor] = (voteCounts[vote.votedFor] || 0) + 1;
    }

    // Find max votes
    let maxVotes = 0;
    let accusedPlayers = [];

    for (const [playerId, count] of Object.entries(voteCounts)) {
      if (count > maxVotes) {
        maxVotes = count;
        accusedPlayers = [playerId];
      } else if (count === maxVotes) {
        accusedPlayers.push(playerId);
      }
    }

    // If tie, no one is accused (chameleon escapes)
    if (accusedPlayers.length > 1) {
      return {
        tie: true,
        accusedPlayers,
        voteCounts
      };
    }

    return {
      tie: false,
      accusedPlayer: accusedPlayers[0],
      voteCounts
    };
  }

  // Check if chameleon's guess is correct
  checkChameleonGuess(guess, secretWord) {
    return guess.toLowerCase().trim() === secretWord.toLowerCase().trim();
  }

  // Get available topics
  getTopics() {
    return topics.map(t => ({
      id: t.id,
      name: t.name,
      icon: t.icon
    }));
  }

  // Get specific topic by ID
  getTopic(topicId) {
    return topics.find(t => t.id === topicId);
  }
}

module.exports = new GameLogic();
