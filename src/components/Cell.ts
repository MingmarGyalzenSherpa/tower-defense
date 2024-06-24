import { CellDimensions } from "../constants/constants";
// import MoonTower from "../assets/tower/RedMoonTower_free_idle_animation..png";
export default class Cell {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  x: number;
  y: number;
  constructor(context: CanvasRenderingContext2D, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = CellDimensions.WIDTH;
    this.height = CellDimensions.HEIGHT;
    this.context = context;
  }

  draw() {
    this.context.beginPath();
    this.context.strokeRect(this.x, this.y, this.width, this.height);
    this.context.closePath();
  }
}
