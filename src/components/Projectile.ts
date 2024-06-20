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
    this.x += this.unitVector.x * this.speed;
    this.y += this.unitVector.y * this.speed;
  }
}
