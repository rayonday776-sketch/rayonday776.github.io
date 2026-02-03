import { attackIfAdjacent, canMoveTo, cityAt, moveUnit, setCityBuild } from "./game.js";
import { UNIT_TYPES } from "./constants.js";

const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const getEnemyCity = (state, unit) =>
  state.cities
    .filter((city) => city.ownerId !== unit.ownerId)
    .sort((a, b) => manhattan(unit, a) - manhattan(unit, b))[0];

export const takeAiTurn = (state, playerId) => {
  const units = state.units.filter((unit) => unit.ownerId === playerId);

  state.cities
    .filter((city) => city.ownerId === playerId)
    .forEach((city) => {
      if (!city.buildTypeId) {
        const choice = city.population < 2 ? UNIT_TYPES.SCOUT.id : UNIT_TYPES.WARRIOR.id;
        setCityBuild(state, city.id, choice);
      }
    });

  units.forEach((unit) => {
    while (unit.moves > 0) {
      if (attackIfAdjacent(state, unit)) {
        unit.moves = 0;
        break;
      }

      const targetCity = getEnemyCity(state, unit);
      if (!targetCity) {
        unit.moves = 0;
        break;
      }

      const move = chooseStepToward(state, unit, targetCity);
      if (!move) {
        unit.moves = 0;
        break;
      }

      moveUnit(state, unit, move.x, move.y);
      if (cityAt(state, unit.x, unit.y) && cityAt(state, unit.x, unit.y)?.ownerId !== unit.ownerId) {
        state.log.push(`${unit.ownerId} capture une ville !`);
      }
    }
  });
};

const chooseStepToward = (state, unit, target) => {
  const candidates = [
    { x: unit.x + 1, y: unit.y },
    { x: unit.x - 1, y: unit.y },
    { x: unit.x, y: unit.y + 1 },
    { x: unit.x, y: unit.y - 1 }
  ].filter((pos) => canMoveTo(state, unit, pos.x, pos.y));

  if (!candidates.length) {
    return null;
  }

  return candidates.sort((a, b) => manhattan(a, target) - manhattan(b, target))[0];
};
