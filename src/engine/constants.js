export const TERRAIN = {
  PLAINS: { id: "plains", moveCost: 1, defense: 0 },
  FOREST: { id: "forest", moveCost: 2, defense: 1 },
  HILL: { id: "hill", moveCost: 2, defense: 2 },
  WATER: { id: "water", moveCost: 99, defense: 0 }
};

export const UNIT_TYPES = {
  SCOUT: { id: "scout", attack: 1, defense: 1, moves: 3, cost: 12 },
  WARRIOR: { id: "warrior", attack: 2, defense: 2, moves: 2, cost: 18 }
};

export const PLAYERS = {
  HUMAN: { id: "human", name: "Humain" },
  AI: { id: "ai", name: "IA" }
};
