export default class Projectile {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  damage: number;
  img: CanvasImageSource;
  speed: number;
  unitVector: {
    x: number;
    y: number;
  };
  targetEnemy: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  prevTime: number;
  timeRate: number;

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    speed: number,
    width: number,
    height: number,
    damage: number,
    img: CanvasImageSource,
    targetEnemy: {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  ) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = img;
    this.speed = speed;
    this.damage = damage;
    this.targetEnemy = targetEnemy;
    this.prevTime = performance.now();
    this.timeRate = 1000;

    //set initial unit vector
    this.unitVector = {
      x: 0,
      y: 0,
    };
  }

  draw(targetEnemy: any) {
    let enemyCenterX = targetEnemy.x + targetEnemy.width / 2;
    let enemyCenterY = targetEnemy.y + targetEnemy.height / 2;
    let projectileCenterX = this.x + this.width / 2;
    let projectileCenterY = this.y + this.height / 2;
    let dy = enemyCenterY - projectileCenterY;
    let dx = enemyCenterX - projectileCenterX;
    let angle = Math.atan2(dy, dx);
    this.context.save();
    this.context.beginPath();
    this.context.translate(projectileCenterX, projectileCenterY);
    this.context.rotate(angle + Math.PI / 2);
    this.context.drawImage(
      this.img,
      -this.width,
      -this.height,
      this.width,
      this.height
    );
    this.context.restore();
    this.context.closePath();
  }
  update() {
    let curTime = performance.now();
    let diff = curTime - this.prevTime;
    this.prevTime = curTime;
    if (this.targetEnemy) {
      let enemyCenterX = this.targetEnemy.x + this.targetEnemy.width / 2;
      let enemyCenterY = this.targetEnemy.y + this.targetEnemy.height / 2;
      let towerCenterX = this.x + this.width / 2;
      let towerCenterY = this.y + this.height / 2;
      let vector = {
        x: enemyCenterX - towerCenterX,
        y: enemyCenterY - towerCenterY,
      };

      let dist = Math.hypot(vector.x, vector.y);
      this.unitVector = {
        x: vector.x / dist,
        y: vector.y / dist,
      };
    }
    this.x += this.unitVector.x * this.speed * diff;
    this.y += this.unitVector.y * this.speed * diff;
    console.log({ x: this.x, y: this.y });
  }

  checkCollision() {}
}
