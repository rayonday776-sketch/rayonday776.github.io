import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createGame, moveUnit, setCityBuild, unitAt } from "../src/engine/game.js";
import { endTurn } from "../src/engine/turn.js";

describe("engine", () => {
  it("moves a unit when tile is passable", () => {
    const state = createGame({ width: 6, height: 6 });
    const unit = unitAt(state, 1, 1);

    const moved = moveUnit(state, unit, 2, 1);

    assert.equal(moved, true);
    assert.equal(unit.x, 2);
    assert.equal(unit.y, 1);
  });

  it("AI ends its turn without crashing", () => {
    const state = createGame({ width: 6, height: 6 });
    endTurn(state);

    assert.equal(state.activePlayerId, "human");
    assert.equal(state.turn, 2);
  });

  it("produces a unit when enough production", () => {
    const state = createGame({ width: 6, height: 6 });
    const city = state.cities.find((entry) => entry.ownerId === "human");
    setCityBuild(state, city.id, "scout");
    city.production = 12;

    endTurn(state);

    const produced = state.units.find((unit) => unit.ownerId === "human" && unit.typeId === "scout");
    assert.ok(produced);
  });
});
