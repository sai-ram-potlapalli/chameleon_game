const { v4: uuidv4 } = require('uuid');

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Ensure uniqueness
    if (this.rooms.has(code)) {
      return this.generateRoomCode();
    }
    return code;
  }

  createRoom(hostId, hostName) {
    const roomCode = this.generateRoomCode();
    const room = {
      code: roomCode,
      hostId: hostId,
      createdAt: Date.now(),
      status: 'lobby', // lobby, playing, ended
      players: [{
        id: hostId,
        name: hostName,
        isHost: true,
        isAI: false,
        isReady: true,
        avatar: this.getRandomAvatar(),
        score: 0,
        connected: true
      }],
      settings: {
        minPlayers: 4,
        maxPlayers: 8,
        turnTime: 30,
        discussionTime: 120,
        aiDifficulty: 'medium' // easy, medium, hard
      },
      game: null
    };

    this.rooms.set(roomCode, room);
    return room;
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode?.toUpperCase());
  }

  joinRoom(roomCode, playerId, playerName) {
    const room = this.getRoom(roomCode);
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.status !== 'lobby') {
      return { success: false, error: 'Game already in progress' };
    }

    // Check if player already in room by ID
    const existingPlayer = room.players.find(p => p.id === playerId);
    if (existingPlayer) {
      existingPlayer.connected = true;
      existingPlayer.disconnectedAt = null;
      return { success: true, room, reconnected: true };
    }

    // Check for disconnected player with same name (reconnection with new socket ID)
    const disconnectedPlayer = room.players.find(
      p => p.name.toLowerCase() === playerName.toLowerCase() && !p.isAI && !p.connected
    );
    if (disconnectedPlayer) {
      disconnectedPlayer.id = playerId;
      disconnectedPlayer.connected = true;
      disconnectedPlayer.disconnectedAt = null;
      // Update hostId if this was the host
      if (disconnectedPlayer.isHost) {
        room.hostId = playerId;
      }
      return { success: true, room, reconnected: true };
    }

    // Check if room is full
    if (room.players.length >= room.settings.maxPlayers) {
      return { success: false, error: 'Room is full' };
    }

    // Check for duplicate name (connected player)
    const nameTaken = room.players.some(p => p.name.toLowerCase() === playerName.toLowerCase() && p.connected);
    if (nameTaken) {
      playerName = `${playerName}${room.players.length + 1}`;
    }

    room.players.push({
      id: playerId,
      name: playerName,
      isHost: false,
      isAI: false,
      isReady: false,
      avatar: this.getRandomAvatar(),
      score: 0,
      connected: true
    });

    return { success: true, room };
  }

  // Mark player as disconnected (don't remove immediately)
  markDisconnected(roomCode, playerId) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };

    const player = room.players.find(p => p.id === playerId);
    if (!player) return { success: false, error: 'Player not in room' };

    player.connected = false;
    player.disconnectedAt = Date.now();

    return { success: true, room, player };
  }

  // Reconnect a player with a new socket ID
  reconnectPlayer(roomCode, oldPlayerId, newPlayerId, playerName) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };

    // Find by name if ID doesn't match (new socket connection)
    let player = room.players.find(p => p.id === oldPlayerId);
    if (!player) {
      player = room.players.find(p => p.name.toLowerCase() === playerName.toLowerCase() && !p.isAI);
    }

    if (player) {
      player.id = newPlayerId;
      player.connected = true;
      player.disconnectedAt = null;
      return { success: true, room, reconnected: true };
    }

    return { success: false, error: 'Player not found' };
  }

  leaveRoom(roomCode, playerId, forceRemove = false) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };

    const playerIndex = room.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return { success: false, error: 'Player not in room' };

    const player = room.players[playerIndex];

    // If not forcing removal, just mark as disconnected
    if (!forceRemove) {
      player.connected = false;
      player.disconnectedAt = Date.now();
      return { success: true, room, playerLeft: player, markedDisconnected: true };
    }

    // Force remove - actually remove the player
    room.players.splice(playerIndex, 1);

    // If host left, assign new host
    if (player.isHost && room.players.length > 0) {
      const humanPlayers = room.players.filter(p => !p.isAI && p.connected);
      if (humanPlayers.length > 0) {
        humanPlayers[0].isHost = true;
        room.hostId = humanPlayers[0].id;
      }
    }

    // Delete room if no connected human players
    const connectedHumans = room.players.filter(p => !p.isAI && p.connected);
    if (connectedHumans.length === 0) {
      this.deleteRoom(roomCode);
      return { success: true, roomDeleted: true };
    }

    return { success: true, room, playerLeft: player };
  }

  // Clean up disconnected players after timeout
  cleanupDisconnectedPlayers(roomCode, timeoutMs = 60000) {
    const room = this.getRoom(roomCode);
    if (!room) return;

    const now = Date.now();
    const playersToRemove = room.players.filter(
      p => !p.isAI && !p.connected && p.disconnectedAt && (now - p.disconnectedAt > timeoutMs)
    );

    for (const player of playersToRemove) {
      this.leaveRoom(roomCode, player.id, true);
    }
  }

  addAIPlayer(roomCode, aiName = null) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };

    if (room.players.length >= room.settings.maxPlayers) {
      return { success: false, error: 'Room is full' };
    }

    const aiNames = [
      'Suspicious Steve', 'Sneaky Sarah', 'Cunning Carl', 'Bluffing Betty',
      'Tricky Tom', 'Mysterious Maya', 'Dodgy Dave', 'Clever Claire',
      'Wily Winston', 'Shifty Shelly', 'Artful Arthur', 'Cryptic Cathy'
    ];

    const usedNames = room.players.map(p => p.name);
    const availableNames = aiNames.filter(n => !usedNames.includes(n));

    if (!aiName) {
      aiName = availableNames.length > 0
        ? availableNames[Math.floor(Math.random() * availableNames.length)]
        : `Bot ${room.players.filter(p => p.isAI).length + 1}`;
    }

    const aiPlayer = {
      id: `ai_${uuidv4()}`,
      name: aiName,
      isHost: false,
      isAI: true,
      isReady: true,
      avatar: this.getRandomAvatar(),
      score: 0,
      connected: true,
      personality: this.getRandomPersonality()
    };

    room.players.push(aiPlayer);
    return { success: true, room, aiPlayer };
  }

  removeAIPlayer(roomCode, aiPlayerId) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };

    const aiIndex = room.players.findIndex(p => p.id === aiPlayerId && p.isAI);
    if (aiIndex === -1) return { success: false, error: 'AI player not found' };

    const removed = room.players.splice(aiIndex, 1)[0];
    return { success: true, room, removed };
  }

  setPlayerReady(roomCode, playerId, isReady) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };

    const player = room.players.find(p => p.id === playerId);
    if (!player) return { success: false, error: 'Player not found' };

    player.isReady = isReady;
    return { success: true, room };
  }

  canStartGame(roomCode) {
    const room = this.getRoom(roomCode);
    if (!room) return { canStart: false, reason: 'Room not found' };

    if (room.players.length < room.settings.minPlayers) {
      return { canStart: false, reason: `Need at least ${room.settings.minPlayers} players` };
    }

    const allReady = room.players.every(p => p.isReady);
    if (!allReady) {
      return { canStart: false, reason: 'Not all players are ready' };
    }

    return { canStart: true };
  }

  updateSettings(roomCode, settings) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Room not found' };

    room.settings = { ...room.settings, ...settings };
    return { success: true, room };
  }

  deleteRoom(roomCode) {
    this.rooms.delete(roomCode?.toUpperCase());
  }

  getRandomAvatar() {
    const avatars = ['🦎', '🐸', '🦊', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐵', '🐶', '🐱'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  getRandomPersonality() {
    const personalities = [
      { type: 'aggressive', description: 'Quick to accuse, gives obvious clues' },
      { type: 'cautious', description: 'Gives subtle clues, careful voter' },
      { type: 'analytical', description: 'Tracks clues carefully, logical voter' },
      { type: 'random', description: 'Unpredictable clues and votes' }
    ];
    return personalities[Math.floor(Math.random() * personalities.length)];
  }

  // Cleanup old rooms (call periodically)
  cleanupOldRooms(maxAgeMs = 3600000) { // 1 hour default
    const now = Date.now();
    for (const [code, room] of this.rooms) {
      if (now - room.createdAt > maxAgeMs && room.status !== 'playing') {
        this.rooms.delete(code);
      }
    }
  }
}

module.exports = new RoomManager();
