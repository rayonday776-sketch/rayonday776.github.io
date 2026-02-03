import { PLAYERS, TERRAIN, UNIT_TYPES } from "../engine/constants.js";
import { createGame, moveUnit, setCityBuild, unitAt } from "../engine/game.js";
import { endTurn } from "../engine/turn.js";

const state = createGame();

const tileSize = 48;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const logEl = document.querySelector("#log");
const turnEl = document.querySelector("#turn");
const endTurnButton = document.querySelector("#endTurn");
const cityInfoEl = document.querySelector("#cityInfo");
const buildSelect = document.querySelector("#buildSelect");
const buildButton = document.querySelector("#setBuild");

canvas.width = state.map.width * tileSize;
canvas.height = state.map.height * tileSize;

let selectedUnit = null;

const terrainColors = {
  [TERRAIN.PLAINS.id]: "#cfe8a9",
  [TERRAIN.FOREST.id]: "#7fbf7f",
  [TERRAIN.HILL.id]: "#c7b299",
  [TERRAIN.WATER.id]: "#7db7e8"
};

const updateCityPanel = () => {
  const humanCity = state.cities.find((city) => city.ownerId === PLAYERS.HUMAN.id);
  if (!humanCity) {
    cityInfoEl.textContent = "Aucune ville.";
    return;
  }
  const buildLabel = humanCity.buildTypeId ?? "aucune";
  cityInfoEl.textContent = `Ville: pop ${humanCity.population} | prod ${humanCity.production}/${humanCity.productionRate} | build ${buildLabel}`;
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < state.map.height; y += 1) {
    for (let x = 0; x < state.map.width; x += 1) {
      const tile = state.map.tiles[y][x];
      ctx.fillStyle = terrainColors[tile.id] ?? "#eee";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      ctx.strokeStyle = "#333";
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  state.cities.forEach((city) => {
    ctx.fillStyle = city.ownerId === PLAYERS.HUMAN.id ? "#2b5797" : "#a61e4d";
    ctx.fillRect(city.x * tileSize + 12, city.y * tileSize + 12, 24, 24);
  });

  state.units.forEach((unit) => {
    ctx.beginPath();
    ctx.fillStyle = unit.ownerId === PLAYERS.HUMAN.id ? "#1c7ed6" : "#c2255c";
    ctx.arc(unit.x * tileSize + 24, unit.y * tileSize + 24, 12, 0, Math.PI * 2);
    ctx.fill();
  });

  if (selectedUnit) {
    ctx.strokeStyle = "#f59f00";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      selectedUnit.x * tileSize + 3,
      selectedUnit.y * tileSize + 3,
      tileSize - 6,
      tileSize - 6
    );
    ctx.lineWidth = 1;
  }

  turnEl.textContent = `Tour ${state.turn} - ${state.activePlayerId}`;
  logEl.innerHTML = state.log.slice(-6).map((entry) => `<div>${entry}</div>`).join("");
  updateCityPanel();
};

const fillBuildOptions = () => {
  buildSelect.innerHTML = "";
  Object.values(UNIT_TYPES).forEach((type) => {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = `${type.id} (${type.cost})`;
    buildSelect.appendChild(option);
  });
};

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / tileSize);
  const y = Math.floor((event.clientY - rect.top) / tileSize);
  const clickedUnit = unitAt(state, x, y);

  if (clickedUnit && clickedUnit.ownerId === PLAYERS.HUMAN.id) {
    selectedUnit = clickedUnit;
    draw();
    return;
  }

  if (selectedUnit) {
    const moved = moveUnit(state, selectedUnit, x, y);
    if (!moved) {
      state.log.push("Déplacement impossible.");
    }
    selectedUnit = null;
    draw();
  }
});

endTurnButton.addEventListener("click", () => {
  endTurn(state);
  draw();
});

buildButton.addEventListener("click", () => {
  const humanCity = state.cities.find((city) => city.ownerId === PLAYERS.HUMAN.id);
  if (!humanCity) {
    return;
  }
  setCityBuild(state, humanCity.id, buildSelect.value);
  draw();
});

fillBuildOptions();
draw();
