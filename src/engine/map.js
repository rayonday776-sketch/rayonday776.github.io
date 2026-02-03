import { TERRAIN } from "./constants.js";

export const createFixedMap = (width, height) => {
  const tiles = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      if ((x === 0 || y === 0 || x === width - 1 || y === height - 1) && (x + y) % 3 === 0) {
        return TERRAIN.WATER;
      }
      if ((x + y) % 7 === 0) {
        return TERRAIN.HILL;
      }
      if ((x + y) % 5 === 0) {
        return TERRAIN.FOREST;
      }
      return TERRAIN.PLAINS;
    })
  );

  return { width, height, tiles };
};

export const inBounds = (map, x, y) => x >= 0 && y >= 0 && x < map.width && y < map.height;

export const getTile = (map, x, y) => (inBounds(map, x, y) ? map.tiles[y][x] : null);
