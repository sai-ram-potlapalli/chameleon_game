const { getClueForWord, getAllCluesForWord, findWordsForClue } = require('../data/wordAssociations');

class AIPlayer {
  // Get clue for a regular (non-chameleon) AI player
  getRegularClue(secretWord, givenClues, difficulty = 'medium', personality = null) {
    const excludeClues = givenClues.map(c => c.clue.toLowerCase());

    // Try to get a clue from our word associations
    let clue = getClueForWord(secretWord, difficulty, excludeClues);

    if (clue) {
      return clue;
    }

    // Fallback: generate a simple related word
    return this.generateFallbackClue(secretWord, excludeClues);
  }

  // Get clue for a chameleon AI player (must bluff!)
  getChameleonClue(topicWords, givenClues, difficulty = 'medium', personality = null) {
    const excludeClues = givenClues.map(c => c.clue.toLowerCase());

    // Strategy: Analyze given clues to guess the secret word, then give a subtle clue
    if (givenClues.length > 0) {
      // Try to deduce the secret word from other clues
      const likelyWords = this.analyzeCluesForSecretWord(givenClues, topicWords);

      if (likelyWords.length > 0) {
        // Pick a clue that could work for the most likely word
        const bestGuess = likelyWords[0];
        const clue = getClueForWord(bestGuess, 'hard', excludeClues); // Use hard clues to be subtle
        if (clue) return clue;
      }
    }

    // Fallback: Give a vague clue that could apply to multiple words
    return this.getVagueClue(topicWords, excludeClues, difficulty);
  }

  // Analyze clues to determine the most likely secret word
  analyzeCluesForSecretWord(givenClues, topicWords) {
    const wordScores = {};

    // Initialize scores
    for (const word of topicWords) {
      wordScores[word] = 0;
    }

    // Score each word based on how well clues match
    for (const clueObj of givenClues) {
      const clue = clueObj.clue.toLowerCase();

      for (const word of topicWords) {
        const allClues = getAllCluesForWord(word);
        for (const possibleClue of allClues) {
          // Check for exact match or partial match
          if (possibleClue.toLowerCase() === clue) {
            wordScores[word] += 10;
          } else if (possibleClue.toLowerCase().includes(clue) || clue.includes(possibleClue.toLowerCase())) {
            wordScores[word] += 3;
          }
        }

        // Check if clue sounds like the word itself
        if (this.wordsAreSimilar(clue, word.toLowerCase())) {
          wordScores[word] += 5;
        }
      }
    }

    // Sort by score
    const sortedWords = Object.entries(wordScores)
      .sort(([, a], [, b]) => b - a)
      .filter(([, score]) => score > 0)
      .map(([word]) => word);

    return sortedWords;
  }

  // Check if two words are similar (simple heuristic)
  wordsAreSimilar(word1, word2) {
    // Check if one contains the other
    if (word1.includes(word2) || word2.includes(word1)) return true;

    // Check if they share a significant prefix
    const minLen = Math.min(word1.length, word2.length);
    if (minLen >= 4) {
      const prefixLen = Math.floor(minLen * 0.6);
      if (word1.substring(0, prefixLen) === word2.substring(0, prefixLen)) return true;
    }

    return false;
  }

  // Get a vague clue that could apply to multiple topic words
  getVagueClue(topicWords, excludeClues, difficulty) {
    // Common vague words that could apply to many things
    const vagueClues = [
      'interesting', 'common', 'popular', 'classic', 'favorite',
      'traditional', 'famous', 'important', 'essential', 'typical',
      'original', 'unique', 'special', 'everyday', 'universal',
      'natural', 'modern', 'ancient', 'basic', 'standard'
    ];

    const availableClues = vagueClues.filter(c => !excludeClues.includes(c.toLowerCase()));

    if (availableClues.length > 0) {
      return availableClues[Math.floor(Math.random() * availableClues.length)];
    }

    // Last resort: pick a random word that somewhat relates
    const randomWord = topicWords[Math.floor(Math.random() * topicWords.length)];
    const clue = getClueForWord(randomWord, 'hard', excludeClues);
    return clue || 'related';
  }

  // Generate a fallback clue when no association exists
  generateFallbackClue(word, excludeClues) {
    // Simple association based on first letter or common patterns
    const fallbacks = [
      'related', 'connected', 'associated', 'linked', 'similar',
      'typical', 'common', 'known', 'familiar', 'obvious'
    ];

    const available = fallbacks.filter(f => !excludeClues.includes(f.toLowerCase()));
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }

    return word.charAt(0).toUpperCase() + 'word'; // Last resort
  }

  // Get AI vote
  getVote(clues, secretWord, isChameleon, otherPlayerIds, difficulty = 'medium', personality = null) {
    if (isChameleon) {
      // Chameleon: Vote for someone who gave a weak clue
      return this.getChameleonVote(clues, otherPlayerIds, difficulty);
    } else {
      // Regular player: Vote for the most suspicious player
      return this.getRegularVote(clues, secretWord, otherPlayerIds, difficulty);
    }
  }

  // Get vote as a regular player
  getRegularVote(clues, secretWord, otherPlayerIds, difficulty) {
    const suspicionScores = {};

    // Initialize scores
    for (const playerId of otherPlayerIds) {
      suspicionScores[playerId] = 0;
    }

    // Analyze each clue
    for (const clueObj of clues) {
      if (!otherPlayerIds.includes(clueObj.playerId)) continue;

      const clue = clueObj.clue.toLowerCase();
      const allClues = getAllCluesForWord(secretWord);

      // Check how well the clue relates to the secret word
      let relevance = 0;

      for (const expectedClue of allClues) {
        if (expectedClue.toLowerCase() === clue) {
          relevance = 10; // Perfect match
          break;
        } else if (expectedClue.toLowerCase().includes(clue) || clue.includes(expectedClue.toLowerCase())) {
          relevance = Math.max(relevance, 5); // Partial match
        }
      }

      // Low relevance = more suspicious
      if (relevance === 0) {
        suspicionScores[clueObj.playerId] += 10;
      } else if (relevance < 5) {
        suspicionScores[clueObj.playerId] += 5;
      }

      // Too obvious clue might also be suspicious (trying to compensate)
      if (this.wordsAreSimilar(clue, secretWord.toLowerCase())) {
        suspicionScores[clueObj.playerId] += 3;
      }
    }

    // Add some randomness based on difficulty
    if (difficulty === 'easy') {
      // More random voting
      for (const playerId of otherPlayerIds) {
        suspicionScores[playerId] += Math.random() * 5;
      }
    }

    // Find most suspicious player
    let mostSuspicious = otherPlayerIds[0];
    let highestScore = suspicionScores[mostSuspicious] || 0;

    for (const playerId of otherPlayerIds) {
      if ((suspicionScores[playerId] || 0) > highestScore) {
        highestScore = suspicionScores[playerId];
        mostSuspicious = playerId;
      }
    }

    return mostSuspicious;
  }

  // Get vote as the chameleon
  getChameleonVote(clues, otherPlayerIds, difficulty) {
    // Strategy: Vote for someone who gave a "weak" clue to frame them
    // Or vote for a popular target to blend in

    const clueStrength = {};

    for (const clueObj of clues) {
      if (!otherPlayerIds.includes(clueObj.playerId)) continue;

      const clue = clueObj.clue.toLowerCase();
      // Measure clue "obviousness" - vague clues are weaker
      const vagueWords = ['common', 'typical', 'popular', 'famous', 'important', 'good', 'bad', 'nice'];
      const isVague = vagueWords.some(v => clue.includes(v) || clue === v);

      clueStrength[clueObj.playerId] = isVague ? 1 : clue.length > 3 ? 3 : 2;
    }

    // Vote for player with weakest clue
    let target = otherPlayerIds[Math.floor(Math.random() * otherPlayerIds.length)];
    let lowestStrength = Infinity;

    for (const playerId of otherPlayerIds) {
      const strength = clueStrength[playerId] || 2;
      if (strength < lowestStrength) {
        lowestStrength = strength;
        target = playerId;
      }
    }

    return target;
  }

  // Chameleon's final guess
  getChameleonGuess(topicWords, clues, difficulty, personality) {
    const likelyWords = this.analyzeCluesForSecretWord(clues, topicWords);

    if (likelyWords.length > 0) {
      // Based on difficulty, might pick correctly or not
      if (difficulty === 'hard') {
        // Smart chameleon - pick the most likely
        return likelyWords[0];
      } else if (difficulty === 'medium') {
        // Sometimes pick second best
        const index = Math.random() < 0.7 ? 0 : Math.min(1, likelyWords.length - 1);
        return likelyWords[index];
      } else {
        // Easy - more random
        const index = Math.floor(Math.random() * Math.min(3, likelyWords.length));
        return likelyWords[index];
      }
    }

    // No good analysis - random guess
    return topicWords[Math.floor(Math.random() * topicWords.length)];
  }
}

module.exports = new AIPlayer();
