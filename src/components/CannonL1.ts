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
  range: number;
  isLocked: boolean;
  targetEnemy: any;
  constructor(x: number, y: number, context: CanvasRenderingContext2D) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.range = 200;
    this.isLocked = false;
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

    if (this.isLocked && this.targetEnemy) {
      const cannonCenterX = this.x + this.width / 2;
      const cannonCenterY = this.y + this.height / 2;
      const enemyCenterX = this.targetEnemy.x + this.targetEnemy.width / 2;
      const enemyCenterY = this.targetEnemy.y + this.targetEnemy.height / 2;

      const dx = enemyCenterX - cannonCenterX;
      const dy = enemyCenterY - cannonCenterY;
      const headAngle = Math.atan2(dy, dx);
      console.log(headAngle);
      this.context.save();
      this.context.translate(cannonCenterX, cannonCenterY);

      this.context.rotate(headAngle + Math.PI / 2);
      this.context.drawImage(
        this.headImg,
        -this.width / 2.6,
        -this.height / 2.6,
        this.width / 1.3,
        this.height / 1.3
      );
      this.context.restore();
    } else {
      this.context.drawImage(
        this.headImg,
        this.x + 10,
        this.y,
        this.width / 1.3,
        this.height / 1.3
      );
    }

    console.log(this.targetEnemy);
    this.context.closePath();
  }

  update(enemy: { x: number; y: number; width: number; height: number }) {
    const cannonCenterX = this.x + this.width / 2;
    const cannonCenterY = this.y + this.height / 2;
    const enemyCenterX = enemy.x + enemy.width / 2;
    const enemyCenterY = enemy.y + enemy.height / 2;
    const distance = Math.sqrt(
      (enemyCenterX - cannonCenterX) ** 2 + (enemyCenterY - cannonCenterY) ** 2
    );

    //lock the enemy if dist is less
    if (distance < this.range) {
      this.isLocked = true;
      this.targetEnemy = enemy;
    }

    //check if the locked enemy is out of range
    if (this.isLocked && enemy === this.targetEnemy) {
      if (distance > this.range) {
        this.isLocked = false;
        this.targetEnemy = undefined;
      }
    }
  }
}
