import { CellDimensions } from "../constants/constants";
import CannonHead from "../assets/tower/Cannon.png";
import CannonBase from "../assets/tower/Tower.png";
export default class CannonL1 {
  x: number;
  y: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  baseImg: CanvasImageSource;
  headImg: CanvasImageSource;
  constructor(x: number, y: number, context: CanvasRenderingContext2D) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.width = CellDimensions.WIDTH;
    this.height = CellDimensions.HEIGHT;
    this.baseImg = new Image();
    this.headImg = new Image();
    this.baseImg.src = CannonBase;
    this.headImg.src = CannonHead;
  }

  draw() {
    this.context.beginPath();
    this.context.drawImage(
      this.baseImg,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.context.drawImage(
      this.headImg,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.context.closePath();
  }
}
