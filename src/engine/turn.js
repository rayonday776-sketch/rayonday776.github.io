import { PLAYERS } from "./constants.js";
import { processProduction, resetMoves } from "./game.js";
import { takeAiTurn } from "./ai.js";

export const endTurn = (state) => {
  state.activePlayerId =
    state.activePlayerId === PLAYERS.HUMAN.id ? PLAYERS.AI.id : PLAYERS.HUMAN.id;

  if (state.activePlayerId === PLAYERS.AI.id) {
    resetMoves(state);
    takeAiTurn(state, PLAYERS.AI.id);
    state.activePlayerId = PLAYERS.HUMAN.id;
  }

  processProduction(state);
  resetMoves(state);
  state.turn += 1;
};
