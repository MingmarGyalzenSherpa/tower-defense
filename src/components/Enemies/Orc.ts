import { CellDimensions } from "../../constants/constants";

export default class Orc {
  x: number;
  y: number;
  w: number;
  h: number;
  dy: number;
  dx: number;
  curPath: number;
  nextPath: number;
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D, y: number) {
    this.context = context;
    this.curPath = -1;
    this.nextPath = 0;
    this.x = -50;
    this.y = y;
    this.dy = 0;
    this.dx = 2;
    this.w = CellDimensions.WIDTH;
    this.h = CellDimensions.HEIGHT;
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = "red";
    this.context.fillRect(this.x, this.y, this.w, this.h);
    this.context.closePath();
  }

  update(pathPos: { x: number; y: number }[]) {
    let targetX = pathPos[this.nextPath].x * CellDimensions.WIDTH;
    let targetY = pathPos[this.nextPath].y * CellDimensions.HEIGHT;
    // console.log({ targetX, targetY });

    if (targetX > this.x) {
      this.dx = 2;
      this.dy = 0;
    } else if (targetX < this.x) {
      this.dx = -2;
      this.dy = 0;
    }

    if (targetY > this.y) {
      this.dy = 2;
      this.dx = 0;
    } else if (targetY < this.y) {
      this.dy = -2;
      this.dx = 0;
    }
    if (
      this.x === targetX &&
      this.y === targetY &&
      this.nextPath < pathPos.length
    ) {
      this.nextPath++;
    }
    // console.log({ nextPth: this.nextPath });
    this.y += this.dy;
    this.x += this.dx;
    // console.log(this.x, "   ", this.y);
  }
}
