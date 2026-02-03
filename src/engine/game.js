import { PLAYERS, UNIT_TYPES } from "./constants.js";
import { createFixedMap, getTile, inBounds } from "./map.js";

export const createGame = ({ width = 12, height = 10 } = {}) => {
  const map = createFixedMap(width, height);
  const units = [
    createUnit("u1", PLAYERS.HUMAN.id, UNIT_TYPES.WARRIOR.id, 1, 1),
    createUnit("u2", PLAYERS.AI.id, UNIT_TYPES.WARRIOR.id, width - 2, height - 2)
  ];
  const cities = [
    createCity("c1", PLAYERS.HUMAN.id, 2, 2),
    createCity("c2", PLAYERS.AI.id, width - 3, height - 3)
  ];

  return {
    turn: 1,
    activePlayerId: PLAYERS.HUMAN.id,
    map,
    units,
    cities,
    log: []
  };
};

export const createUnit = (id, ownerId, typeId, x, y) => ({
  id,
  ownerId,
  typeId,
  x,
  y,
  hp: 10,
  moves: UNIT_TYPES[typeId.toUpperCase()]?.moves ?? 2
});

export const createCity = (id, ownerId, x, y) => ({
  id,
  ownerId,
  x,
  y,
  population: 1,
  production: 0,
  productionRate: 3,
  buildTypeId: null
});

export const getUnitType = (unit) => UNIT_TYPES[unit.typeId.toUpperCase()];

export const resetMoves = (state) => {
  state.units.forEach((unit) => {
    const type = getUnitType(unit);
    unit.moves = type.moves;
  });
};

export const unitAt = (state, x, y) => state.units.find((unit) => unit.x === x && unit.y === y);

export const cityAt = (state, x, y) => state.cities.find((city) => city.x === x && city.y === y);

export const canMoveTo = (state, unit, x, y) => {
  if (!inBounds(state.map, x, y)) {
    return false;
  }
  const tile = getTile(state.map, x, y);
  if (!tile || tile.moveCost >= 99) {
    return false;
  }
  if (unitAt(state, x, y)) {
    return false;
  }
  return unit.moves >= tile.moveCost;
};

export const moveUnit = (state, unit, x, y) => {
  if (!canMoveTo(state, unit, x, y)) {
    return false;
  }
  const tile = getTile(state.map, x, y);
  unit.x = x;
  unit.y = y;
  unit.moves -= tile.moveCost;
  return true;
};

export const resolveCombat = (state, attacker, defender) => {
  const atkType = getUnitType(attacker);
  const defType = getUnitType(defender);
  const defTile = getTile(state.map, defender.x, defender.y);
  const defenseBonus = defTile?.defense ?? 0;

  const attackScore = atkType.attack;
  const defenseScore = defType.defense + defenseBonus;
  const damage = Math.max(1, attackScore - Math.floor(defenseScore / 2));

  defender.hp -= damage;
  state.log.push(
    `${attacker.ownerId} attaque ${defender.ownerId} (${damage} dégâts).`
  );

  if (defender.hp <= 0) {
    state.units = state.units.filter((unit) => unit.id !== defender.id);
    state.log.push(`${defender.ownerId} perd une unité.`);
  }
};

export const attackIfAdjacent = (state, unit) => {
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];

  for (const [dx, dy] of directions) {
    const target = unitAt(state, unit.x + dx, unit.y + dy);
    if (target && target.ownerId !== unit.ownerId) {
      resolveCombat(state, unit, target);
      return true;
    }
  }

  return false;
};

export const setCityBuild = (state, cityId, typeId) => {
  const city = state.cities.find((entry) => entry.id === cityId);
  if (!city) {
    return false;
  }
  city.buildTypeId = typeId;
  state.log.push(`${city.ownerId} prépare ${typeId}.`);
  return true;
};

const findSpawnTile = (state, city) => {
  const options = [
    { x: city.x, y: city.y },
    { x: city.x + 1, y: city.y },
    { x: city.x - 1, y: city.y },
    { x: city.x, y: city.y + 1 },
    { x: city.x, y: city.y - 1 }
  ];

  return options.find((pos) => {
    if (!inBounds(state.map, pos.x, pos.y)) {
      return false;
    }
    const tile = getTile(state.map, pos.x, pos.y);
    if (!tile || tile.moveCost >= 99) {
      return false;
    }
    return !unitAt(state, pos.x, pos.y);
  });
};

let unitSequence = 3;

export const processProduction = (state) => {
  state.cities.forEach((city) => {
    city.production += city.productionRate;

    if (!city.buildTypeId) {
      return;
    }

    const type = UNIT_TYPES[city.buildTypeId.toUpperCase()];
    if (!type) {
      return;
    }

    if (city.production < type.cost) {
      return;
    }

    const spawn = findSpawnTile(state, city);
    if (!spawn) {
      state.log.push(`${city.ownerId} manque d'espace pour produire.`);
      return;
    }

    city.production -= type.cost;
    const newUnit = createUnit(
      `u${unitSequence}`,
      city.ownerId,
      type.id,
      spawn.x,
      spawn.y
    );
    unitSequence += 1;
    state.units.push(newUnit);
    state.log.push(`${city.ownerId} produit ${type.id}.`);
  });
};
