import { CellDimensions } from "../../constants/constants";
import MachineGunHeadL1 from "../../assets/tower/MG.png";
import MachineGunHeadL2 from "../../assets/tower/MG2.png";
import CannonBase from "../../assets/tower/Tower.png";
import Projectile from "../Projectile";
import ProjectileImg from "../../assets/tower/Bullet_MG.png";
import collision from "../../utils/utils";
export default class MachineGun {
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
    this.maxLevel = 3;
    this.range = 200;
    this.cost = [60, 140];
    this.isLocked = false;
    this.width = CellDimensions.WIDTH;
    this.height = CellDimensions.HEIGHT;
    this.baseImg = new Image();
    this.headImg = new Image();
    this.baseImg.src = CannonBase;
    this.headImg.src = MachineGunHeadL1;
    this.lastFireTime = 0;
    this.upgradeCost = 400;
    this.fireRate = 500;
    this.projectiles = [];
    this.projectileImg = new Image();
    this.projectileSpeed = 2;
    this.damage = 10;
    this.projectileImg.src = ProjectileImg;
    this.numberOfProjectilePerFire = 1;
  }

  draw() {
    //draw tower
    this.context.beginPath();
    this.context.drawImage(
      this.baseImg,
      this.x,
      this.y,
      this.width,
      this.height
    );
    //draw projectiles
    this.drawProjectiles();

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
  }

  upgrade() {
    switch (this.curLevel) {
      case 1:
        this.numberOfProjectilePerFire = 2;
        this.fireRate = 1500;
        this.headImg = new Image();
        this.headImg.src = MachineGunHeadL2;
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
              this.numberOfProjectilePerFire === 1
                ? cannonCenterX + 20
                : cannonCenterX + i * 20,
              cannonCenterY - 20,
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
      console.log(this.projectiles[i].targetEnemy);
      //decrease the hp
      if (
        collision(this.targetEnemy, this.projectiles[i]) ||
        this.projectiles[i].targetEnemy.hp <= 0
      ) {
        this.targetEnemy.decreaseHp(this.damage);
        this.projectiles.splice(i, 1);
        i--;
      }
    }
  }
}
