import { CellDimensions } from "../constants/constants";

export default class Cell {
  width: number;
  height: number;
  constructor() {
    this.width = CellDimensions.WIDTH;
    this.height = CellDimensions.HEIGHT;
  }
}
