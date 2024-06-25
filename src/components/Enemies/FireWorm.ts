import { CellDimensions } from "../../constants/constants";
import FireWormSprite from "../../assets/enemy/fireworm.png";
export default class FireWorm {
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
  maxSpriteFrame: number;
  imgWidth: number;
  imgHeight: number;
  frame: number;
  velocity: number;
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
    this.maxSpriteFrame = 9;
    this.dy = 0;
    this.velocity = 1;
    this.dx = this.velocity;
    this.coinGain = 50;
    this.srcX = 0;
    this.hp = 250;
    this.maxHp = this.hp;
    this.imgWidth = 70;
    this.imgHeight = 90;
    this.img = new Image();
    this.img.src = FireWormSprite;
    this.width = CellDimensions.WIDTH;
    this.height = CellDimensions.HEIGHT;
    this.frame = 0;
    this.pathPos = pathPos;
    this.prevPath = [];
  }

  /**
   * The `getHp` function in TypeScript returns the value of the `hp` property.
   * @returns The `hp` property of the object.
   */

  getHp(): number {
    return this.hp;
  }

  /**
   * The draw function updates the sprite frame and draws an image on a canvas along with a health bar.
   * @returns If the `this.y` property is `undefined`, the `draw()` function will return early and not
   * execute the rest of the code.
   */
  draw() {
    if (this.y === undefined) return;
    if (this.frame % 10 === 0) {
      this.srcX = (this.srcX + 1) % this.maxSpriteFrame;
    }
    this.context.beginPath();
    this.context.fillStyle = "red";
    this.context.drawImage(
      this.img,
      this.srcX * (this.imgWidth + 20),
      0,
      this.imgWidth,
      this.imgHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.context.closePath();

    this.drawHpBar();
  }

  /**
   * The `drawHpBar` function draws a health bar on a canvas based on the current and maximum health
   * values of an object.
   */

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

  /**
   * The function "decreaseHp" reduces the hit points (hp) by a specified amount of damage and ensures
   * the hp does not go below 0.
   * @param {number} damage - The `damage` parameter represents the amount of damage that will be
   * subtracted from the current hit points (`hp`) of an entity or character.
   */
  decreaseHp(damage: number) {
    this.hp -= damage;
    if (this.hp < 0) this.hp = 0;
  }

  /**
   * The function updates the position of an object based on a grid system and moves it towards target
   * paths while avoiding previous paths.
   * @returns The `update()` function returns nothing explicitly. It performs various calculations and
   * updates the position of an object based on certain conditions and parameters, but it does not have
   * a return value specified.
   */
  update() {
    this.frame++;
    if (this.y === undefined) return;

    //find grid value
    let gridX = Math.floor(this.x / CellDimensions.WIDTH);
    let gridY = Math.floor(this.y / CellDimensions.HEIGHT);

    if (this.x < 0) {
      this.dx = 1;
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
      this.dx = this.velocity;
      this.dy = 0;
    }
    if (targetX < this.x) {
      this.dx = -this.velocity;
      this.dy = 0;
    }

    if (targetY > this.y) {
      this.dx = 0;
      this.dy = this.velocity;
    }
    if (targetY < this.y) {
      this.dx = 0;
      this.dy = -this.velocity;
    }
    if (this.prevPath.length === this.pathPos.length) {
      this.dx = this.velocity;
      this.dy = 0;
    }
    this.x += this.dx;
    this.y += this.dy;
  }

  /* The `resetVelocity()` method  is setting the `velocity` property of the `Bat`
 object back to its default value of 2. This method is used to reset the velocity of the bat entity
 to a specific value, in this case, 2. This can be useful when you want to reset the velocity of the
 bat to a default value during certain game events or conditions. */
  resetVelocity() {
    this.velocity = 1;
  }

  /**
   * The function `changeVelocity` updates the velocity property of an object with a new value.
   * @param {number} newVelocity - The `newVelocity` parameter in the `changeVelocity` function is a
   * number that represents the new velocity value that will be assigned to the `velocity` property of
   * the object.
   */
  changeVelocity(newVelocity: number) {
    this.velocity = newVelocity;
  }
}
