import { CellDimensions } from "../../constants/constants";

export default class SlowEnemy {
  x: number;
  y: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  duration: number;
  curFrame: number;
  cost: number;
  constructor(x: number, y: number, context: CanvasRenderingContext2D) {
    this.x = x;
    this.y = y;
    this.width = CellDimensions.WIDTH;
    this.height = CellDimensions.HEIGHT;
    this.context = context;
    this.curFrame = 0;
    this.duration = 500;
    this.cost = 200;
  }

  draw() {
    this.context.beginPath();
    this.context.globalAlpha = 0.5;
    this.context.fillStyle = "skyblue";
    this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.globalAlpha = 1;
    this.context.closePath();
  }

  update(): boolean {
    this.curFrame++;
    console.log(this.curFrame);
    if (this.curFrame >= this.duration) {
      console.log("this");
      return true;
    }
    return false;
  }
}
