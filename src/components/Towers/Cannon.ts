import { CellDimensions } from "../../constants/constants";
import CannonHeadL1 from "../../assets/tower/Cannon.png";
import CannonHeadL2 from "../../assets/tower/Cannon2.png";
import CannonBase from "../../assets/tower/Tower.png";
import Projectile from "../Projectile";
import ProjectileImg from "../../assets/tower/Bullet_Cannon.png";
import collision from "../../utils/utils";
import Explosion from "../Explosion";
export default class Cannon {
  x: number;
  y: number;
  cost: number[];
  upgradeCost: number;
  curLevel: number;
  maxLevel: number;
  numberOfProjectilePerFire: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  baseImg: CanvasImageSource;
  headImg: CanvasImageSource;
  range: number;
  explosions: Explosion[];
  isLocked: boolean;
  targetEnemy: any;
  prevTargetEnemy: any;
  lastFireTime: number;
  fireRate: number;
  projectiles: Projectile[];
  projectileSpeed: number;
  damage: number;
  projectileImg: CanvasImageSource;
  constructor(x: number, y: number, context: CanvasRenderingContext2D) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.curLevel = 1;
    this.maxLevel = 2;
    this.range = 200;
    this.cost = [80, 150];
    this.isLocked = false;
    this.explosions = [];
    this.width = CellDimensions.WIDTH;
    this.height = CellDimensions.HEIGHT;
    this.baseImg = new Image();
    this.headImg = new Image();
    this.baseImg.src = CannonBase;
    this.headImg.src = CannonHeadL1;
    this.lastFireTime = 0;
    this.upgradeCost = 400;
    this.fireRate = 1500;
    this.projectiles = [];
    this.projectileImg = new Image();
    this.projectileSpeed = 0.2;
    this.damage = 50;
    this.projectileImg.src = ProjectileImg;
    this.numberOfProjectilePerFire = 1;
  }

/* The `draw()` method in the provided TypeScript class `Cannon` is responsible for rendering the
cannon tower on a canvas. Here's a breakdown of what it does: */
  draw() {
    //draw projectiles
    this.drawProjectiles();

    //draw tower
    this.context.beginPath();
    this.context.drawImage(
      this.baseImg,
      this.x,
      this.y,
      this.width,
      this.height
    );

    //rotating the tower head
    if (this.isLocked && this.targetEnemy) {
      const cannonCenterX = this.x + this.width / 2;
      const cannonCenterY = this.y + this.height / 2;
      const enemyCenterX = this.targetEnemy.x + this.targetEnemy.width / 2;
      const enemyCenterY = this.targetEnemy.y + this.targetEnemy.height / 2;

      const dx = enemyCenterX - cannonCenterX;
      const dy = enemyCenterY - cannonCenterY;
      const headAngle = Math.atan2(dy, dx);
      this.context.save();
      this.context.translate(cannonCenterX, cannonCenterY);
      this.context.rotate(headAngle + Math.PI / 2);
      this.context.drawImage(
        this.headImg,
        -this.width / 2.5,
        -this.height / 2.5,
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
    this.context.closePath();
    this.drawExplosions();
  }

  /**
   * It is used to upgrade a tower
   */
  upgrade() {
    switch (this.curLevel) {
      case 1:
        this.numberOfProjectilePerFire = 2;
        this.fireRate = 1500;
        this.headImg = new Image();
        this.headImg.src = CannonHeadL2;
        break;
      case 2:
        break;
    }
  }

  update(enemy: any) {
    //calculate the distance
    const cannonCenterX = this.x + this.width / 2;
    const cannonCenterY = this.y + this.height / 2;
    const enemyCenterX = enemy.x + enemy.width / 2;
    const enemyCenterY = enemy.y + enemy.height / 2;
    const distance = Math.sqrt(
      (enemyCenterX - cannonCenterX) ** 2 + (enemyCenterY - cannonCenterY) ** 2
    );

    //lock the enemy if dist is less
    if (!this.isLocked && distance < this.range) {
      this.isLocked = true;
      this.targetEnemy = enemy;
    }

    if (this.isLocked && enemy === this.targetEnemy) {
      //check if the locked enemy is out of range
      if (distance > this.range) {
        this.isLocked = false;
        this.prevTargetEnemy = this.targetEnemy;
        this.targetEnemy = undefined;
        return;
      }

      //fire new projectile

      //current time
      const curTime = performance.now();
      if (curTime - this.lastFireTime >= this.fireRate) {
        for (let i = 0; i < this.numberOfProjectilePerFire; i++) {
          this.projectiles.push(
            new Projectile(
              this.context,
              cannonCenterX + i * 20,
              cannonCenterY,
              this.projectileSpeed,
              10,
              10,
              this.damage,
              this.projectileImg,
              this.targetEnemy
            )
          );
        }

        this.lastFireTime = curTime;
      }
      this.updateExplosions();
    }

    //update projectiles
    this.updateProjectiles();

    //check for projectile hit
    this.checkProjectileCollision();

    //check if enemy is dead
    if (!this.targetEnemy?.hp) {
      this.isLocked = false;
      this.targetEnemy = undefined;
    }
  }
/**
 * The function `drawExplosions` iterates through an array of explosions and calls the `draw` method on
 * each explosion.
 */

  drawExplosions() {
    for (let i = 0; i < this.explosions.length; i++) {
      this.explosions[i].draw();
    }
  }

  updateExplosions() {
    for (let i = 0; i < this.explosions.length; i++) {
      if (this.explosions[i].srcX === this.explosions[i].spriteFrame) {
        this.explosions.splice(i, 1);
        i--;
      }
    }
  }

  drawProjectiles() {
    for (let i = 0; i < this.projectiles.length; i++) {
      if (this.isLocked) this.projectiles[i].draw(this.targetEnemy);
    }
  }

  updateProjectiles() {
    for (let i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i].update();
    }
  }

  checkProjectileCollision() {
    if (!this.targetEnemy) return;

    for (let i = 0; i < this.projectiles.length; i++) {
      //decrease the hp
      if (
        collision(this.targetEnemy, this.projectiles[i]) ||
        this.projectiles[i].targetEnemy.hp <= 0
      ) {
        this.targetEnemy.decreaseHp(this.damage);
        this.explosions.push(
          new Explosion(this.targetEnemy.x, this.targetEnemy.y, this.context)
        );
        this.projectiles.splice(i, 1);
        i--;
      }
    }
  }
}
