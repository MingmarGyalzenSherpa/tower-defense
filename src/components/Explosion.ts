import ExplosionSprite from "../assets/explosion.png";
import { CellDimensions } from "../constants/constants";

export default class Explosion {
  x: number;
  y: number;
  width: number;
  height: number;
  srcX: number;
  spriteFrame: number;
  frame: number;
  img: CanvasImageSource;
  context: CanvasRenderingContext2D;
  constructor(x: number, y: number, context: CanvasRenderingContext2D) {
    this.x = x;
    this.y = y;
    this.srcX = 0;
    this.spriteFrame = 7;
    this.width = 100;
    this.height = 100;
    this.frame = 0;
    this.context = context;
    this.img = new Image();
    this.img.src = ExplosionSprite;
  }

  draw() {
    this.frame++;
    if (this.frame % 10 === 0) {
      this.srcX = this.srcX + 1;
    }
    this.context.beginPath();
    this.context.drawImage(
      this.img,
      this.srcX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      CellDimensions.WIDTH,
      CellDimensions.HEIGHT
    );
  }
}
