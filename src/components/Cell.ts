import { CellDimensions } from "../constants/constants";

export default class Cell {
  width: number;
  height: number;
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = CellDimensions.WIDTH;
    this.height = CellDimensions.HEIGHT;
  }
}
