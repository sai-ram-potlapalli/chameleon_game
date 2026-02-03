// Client-side AI Host for additional commentary and reactions

const AIHost = {
  reactions: {
    clueReactions: [
      "Hmm, interesting choice!",
      "That's making me suspicious...",
      "Bold move!",
      "Could mean anything!",
      "The plot thickens!",
      "Someone knows something...",
      "Or do they?"
    ],

    voteReactions: [
      "The tension is rising!",
      "Trust no one!",
      "Choose wisely!",
      "The moment of truth approaches!",
      "Finger pointing time!",
      "Who's been lying?"
    ],

    waitingReactions: [
      "Tick tock...",
      "Time's running out!",
      "We're all waiting...",
      "The suspense!",
      "Any moment now..."
    ],

    celebrationReactions: [
      "What a game!",
      "Incredible!",
      "The Chameleon strikes again!",
      "Justice prevails!",
      "That was intense!"
    ]
  },

  getRandomReaction(category) {
    const reactions = this.reactions[category];
    if (!reactions) return null;
    return reactions[Math.floor(Math.random() * reactions.length)];
  },

  // Get contextual reaction based on game state
  getContextualComment(phase, context = {}) {
    switch (phase) {
      case 'clue-giving':
        if (context.clueCount === 1) {
          return "First clue is in! Let's see what everyone else has...";
        }
        if (context.clueCount > 3) {
          return "The clues are piling up. Can you spot the fake?";
        }
        return this.getRandomReaction('clueReactions');

      case 'discussion':
        return "Time to put your detective hats on!";

      case 'voting':
        return this.getRandomReaction('voteReactions');

      case 'results':
        return this.getRandomReaction('celebrationReactions');

      default:
        return null;
    }
  },

  // Analyze a clue and provide commentary
  analyzeClue(clue, isEarlyGame) {
    const clueLength = clue.length;

    if (clueLength <= 3) {
      return "Short and cryptic. Confident or nervous?";
    }
    if (clueLength > 10) {
      return "Quite a specific word there!";
    }
    if (isEarlyGame) {
      return "Setting the tone early!";
    }
    return this.getRandomReaction('clueReactions');
  },

  // Generate suspense text
  buildSuspense(secondsRemaining) {
    if (secondsRemaining <= 5) {
      return "Final countdown!";
    }
    if (secondsRemaining <= 10) {
      return "Time is almost up!";
    }
    if (secondsRemaining <= 30) {
      return this.getRandomReaction('waitingReactions');
    }
    return null;
  }
};

export default AIHost;
