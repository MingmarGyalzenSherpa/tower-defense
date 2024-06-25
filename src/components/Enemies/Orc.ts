import { CellDimensions } from "../../constants/constants";
import OrcSprite from "../../assets/enemy/orc.png";
export default class Orc {
  x: number;
  y?: number;
  width: number;
  height: number;
  dy: number;
  dx: number;
  hp: number;
  maxHp: number;
  coinGain: number;
  prevPath: { x: number; y: number }[];
  targetPath?: { x: number; y: number };
  context: CanvasRenderingContext2D;
  img: CanvasImageSource;
  srcX: number;
  imgWidth: number;
  frame: number;
  pathPos: { x: number; y: number }[];
  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    pathPos: { x: number; y: number }[]
  ) {
    this.context = context;
    //set x to -100
    this.x = x;
    //set y to path whose x is 0
    let startingPath = pathPos.find((path) => path.x === 0);
    if (startingPath) {
      this.y = startingPath.y * CellDimensions.HEIGHT;
      this.targetPath = startingPath;
    }
    this.dy = 0;
    this.dx = 0.5;
    this.coinGain = 100;
    this.srcX = 0;
    this.hp = 500;
    this.maxHp = this.hp;
    this.imgWidth = 105;
    this.img = new Image();
    this.img.src = OrcSprite;
    this.width = CellDimensions.WIDTH;
    this.height = CellDimensions.HEIGHT;
    this.frame = 0;
    this.pathPos = pathPos;
    this.prevPath = [];
  }

  getHp(): number {
    return this.hp;
  }

  draw() {
    if (this.y === undefined) return;

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
    this.context.fillRect(this.x, this.y! - offsetY, this.width, hpBarHeight);
    this.context.fillStyle = "green";
    this.context.fillRect(
      this.x,
      this.y! - offsetY,
      (hpPercentage / 100) * this.width,
      hpBarHeight
    );
    this.context.closePath();
  }

  decreaseHp(damage: number) {
    this.hp -= damage;
    if (this.hp < 0) this.hp = 0;
  }

  // update() {

  //   this.frame++;

  //   let nextX, nextY;
  //   if (this.x != this.targetPath?.x && this.y != this.targetPath?.y) {
  //     nextX = this.x;
  //     nextY = this.y;
  //     //search left
  //   }

  //   let targetX = pathPos[this.nextPath].x * CellDimensions.WIDTH;
  //   let targetY = pathPos[this.nextPath].y * CellDimensions.HEIGHT;

  //   if (targetX > this.x) {
  //     this.dx = 2;
  //     this.dy = 0;
  //   } else if (targetX < this.x) {
  //     this.dx = -0.25;
  //     this.dy = 0;
  //   }

  //   if (targetY > this.y) {
  //     this.dy = 0.25;
  //     this.dx = 0;
  //   } else if (targetY < this.y) {
  //     this.dy = -0.25;
  //     this.dx = 0;
  //   }
  //   if (
  //     this.x === targetX &&
  //     this.y === targetY &&
  //     this.nextPath < pathPos.length
  //   ) {
  //     this.nextPath++;
  //   }
  //   this.y += this.dy;
  //   this.x += this.dx;
  // }
  update() {
    this.frame++;
    if (this.y === undefined) return;

    //find grid value
    let gridX = Math.floor(this.x / CellDimensions.WIDTH);
    let gridY = Math.floor(this.y / CellDimensions.HEIGHT);

    if (this.x < 0) {
      this.dx = 0.5;
      this.x += this.dx;
      this.y += this.dy;

      return;
    }
    let newTargetPath: { x: number; y: number };

    if (gridX === this.targetPath?.x && gridY === this.targetPath?.y) {
      //if reaches the targetPath then search for another target Path
      this.prevPath.push(this.targetPath);
      let possibleTargetPath = [
        { x: gridX - 1, y: gridY },
        { x: gridX, y: gridY - 1 },
        { x: gridX + 1, y: gridY },
        { x: gridX, y: gridY + 1 },
      ];
      for (let i = 0; i < possibleTargetPath.length; i++) {
        newTargetPath = possibleTargetPath[i];
        //check if it is in the prev path array
        if (
          this.prevPath.find(
            (path) => path.x === newTargetPath.x && path.y === newTargetPath.y
          )
        ) {
          continue;
        }

        //check if it is in the path array
        if (
          this.pathPos.find(
            (path) => path.x === newTargetPath.x && path.y === newTargetPath.y
          )
        ) {
          break;
        }
      }
      this.targetPath = newTargetPath!;
      console.log(this.targetPath);
    }

    if (!this.targetPath) return;
    let targetX = this.targetPath!.x * CellDimensions.WIDTH;
    let targetY = this.targetPath!.y * CellDimensions.WIDTH;
    if (targetX > this.x) {
      this.dx = 0.5;
      this.dy = 0;
    }
    if (targetX < this.x) {
      this.dx = -0.5;
      this.dy = 0;
    }

    if (targetY > this.y) {
      this.dx = 0;
      this.dy = 0.5;
    }
    if (targetY < this.y) {
      this.dx = 0;
      this.dy = -0.5;
    }
    if (this.prevPath.length === this.pathPos.length) {
      this.dx = 0.5;
      this.dy = 0;
    }
    this.x += this.dx;
    this.y += this.dy;
  }
}
