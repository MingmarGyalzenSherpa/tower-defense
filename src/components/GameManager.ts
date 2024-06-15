import Level1 from "./Level1";

export default class GameManager {
  levels: number[];
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.context.fillStyle = "black";
    this.levels = [1, 2, 3];
    new Level1(this.context);
  }

  draw() {
    //draw levels
  }
}
