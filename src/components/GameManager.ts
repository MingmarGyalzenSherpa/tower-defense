import { CellDimensions, Grid } from "../constants/constants";

export default class GameManager {
  context: CanvasRenderingContext2D;
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.context.fillStyle = "black";

    for (let i = 0; i < Grid.COLUMN; i++) {
      for (let j = 0; j < Grid.ROW; j++) {
        this.context.strokeRect(
          j * CellDimensions.WIDTH,
          i * CellDimensions.HEIGHT,
          CellDimensions.WIDTH,
          CellDimensions.HEIGHT
        );
        console.log(j);
      }
      console.log("i " + i);
      console.log(Grid.COLUMN);
    }
  }
}
