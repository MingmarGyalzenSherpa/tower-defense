import { CellDimensions } from "../../constants/constants";
import OrcSprite from "../../assets/enemy/orc.png";
export default class Orc {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
  dx: number;
  hp: number;
  maxHp: number;
  curPath: number;
  nextPath: number;
  context: CanvasRenderingContext2D;
  img: CanvasImageSource;
  srcX: number;
  imgWidth: number;
  frame: number;
  constructor(context: CanvasRenderingContext2D, y: number) {
    this.context = context;
    this.curPath = -1;
    this.nextPath = 0;
    this.x = -50;
    this.y = y;
    this.dy = 0;
    this.dx = 0.25;
    this.srcX = 0;
    this.hp = 400;
    this.maxHp = 400;
    this.imgWidth = 105;
    this.img = new Image();
    this.img.src = OrcSprite;
    this.width = CellDimensions.WIDTH;
    this.height = CellDimensions.HEIGHT;
    this.frame = 0;
  }

  getHp(): number {
    return this.hp;
  }

  draw() {
    if (this.frame % 10 === 0) {
      this.srcX = (this.srcX + 1) % 5;
    }
    this.context.beginPath();
    this.context.fillStyle = "red";
    this.context.drawImage(
      this.img,
      this.srcX * this.imgWidth,
      0,
      this.imgWidth,
      100,
      this.x,
      this.y,
      this.width,
      this.height
    );
    // this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.closePath();

    this.drawHpBar();
  }

  drawHpBar() {
    let hpPercentage = (this.hp / this.maxHp) * 100;
    let offsetY = 10;
    let hpBarHeight = 10;
    this.context.beginPath();
    this.context.fillStyle = "red";
    this.context.fillRect(this.x, this.y - offsetY, this.width, hpBarHeight);
    this.context.fillStyle = "green";
    this.context.fillRect(
      this.x,
      this.y - offsetY,
      (hpPercentage / 100) * this.width,
      hpBarHeight
    );
    this.context.closePath();
  }

  decreaseHp(damage: number) {
    this.hp -= damage;
    if (this.hp < 0) this.hp = 0;
  }

  update(pathPos: { x: number; y: number }[]) {
    this.frame++;
    let targetX = pathPos[this.nextPath].x * CellDimensions.WIDTH;
    let targetY = pathPos[this.nextPath].y * CellDimensions.HEIGHT;

    if (targetX > this.x) {
      this.dx = 0.25;
      this.dy = 0;
    } else if (targetX < this.x) {
      this.dx = -0.25;
      this.dy = 0;
    }

    if (targetY > this.y) {
      this.dy = 0.25;
      this.dx = 0;
    } else if (targetY < this.y) {
      this.dy = -0.25;
      this.dx = 0;
    }
    if (
      this.x === targetX &&
      this.y === targetY &&
      this.nextPath < pathPos.length
    ) {
      this.nextPath++;
    }
    this.y += this.dy;
    this.x += this.dx;
  }
}