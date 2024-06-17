export const CellDimensions = {
  WIDTH: 80,
  HEIGHT: 80,
};

export const Grid = {
  ROW: 9,
  COLUMN: 15,
};

export const CanvasDimension = {
  WIDTH: CellDimensions.WIDTH * Grid.COLUMN,
  HEIGHT: CellDimensions.HEIGHT * Grid.ROW,
};

export enum GameState {
  WAITING = "Waiting",
  PLAYING = "Playing",
  PAUSED = "Paused",
  OVER = "Over",
}
