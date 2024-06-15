import { CanvasDimension, CellDimensions } from "../constants/constants";
import Cell from "./Cell";

export default class Level1 {
  context: CanvasRenderingContext2D;
  grids: Cell[];
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.grids = [];
    this.createGrid();
  }

  createGrid() {
    for (
      let i = CellDimensions.HEIGHT * 2;
      i < CanvasDimension.HEIGHT;
      i += CellDimensions.HEIGHT
    ) {
      for (let j = 0; j < CanvasDimension.WIDTH; j += CellDimensions.WIDTH) {
        this.context.strokeRect(
          j,
          i,
          CellDimensions.WIDTH,
          CellDimensions.HEIGHT
        );
        this.grids.push(new Cell(j, i));
      }
    }
  }
}
