import { CellDimensions } from "../../constants/constants";

import MoonTowerImg from "../../assets/tower/RedMoonTower_free_idle_animation..png";
import Projectile from "../Projectile";
import ProjectileImg from "../../assets/tower/Bullet_Cannon.png";
import collision from "../../utils/utils";
export default class MoonTower {
  x: number;
  y: number;
  cost: number;
  srcX: number;
  upgradeCost: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  towerImg: CanvasImageSource;
  frame: number;
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
    this.srcX = 0;
    this.context = context;
    this.range = 200;
    this.cost = 100;
    this.isLocked = false;
    this.width = CellDimensions.WIDTH;
    this.height = CellDimensions.HEIGHT;
    this.towerImg = new Image();
    this.towerImg.src = MoonTowerImg;
    this.frame = 0;
    this.lastFireTime = 0;
    this.upgradeCost = 400;
    this.fireRate = 1000;
    this.projectiles = [];
    this.projectileImg = new Image();
    this.projectileSpeed = 2;
    this.damage = 50;
    this.projectileImg.src = ProjectileImg;
  }

  draw() {
    //draw projectiles
    this.drawProjectiles();
    let imgWidth = 100;
    if (this.frame % 10 === 0) this.srcX = (this.srcX + 1) % 11;
    //draw tower
    this.context.beginPath();
    this.context.drawImage(
      this.towerImg,
      this.srcX * imgWidth,
      40,
      imgWidth,
      imgWidth,
      this.x,
      this.y,
      this.width,
      this.height
    );

    this.context.closePath();
  }

  update(enemy: any) {
    this.frame++;
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
        console.log("firing");
        this.projectiles.push(
          new Projectile(
            this.context,
            cannonCenterX,
            cannonCenterY,
            this.projectileSpeed,
            10,
            10,
            this.damage,
            this.projectileImg,
            this.targetEnemy
          )
        );
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
    let unitVector;
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
      unitVector = {
        x: vector.x / dist,
        y: vector.y / dist,
      };
    }
    for (let i = 0; i < this.projectiles.length; i++) {
      if (this.targetEnemy) {
        this.projectiles[i].unitVector = unitVector!;
      }
      this.projectiles[i].update();
    }
  }

  checkProjectileCollision() {
    if (!this.targetEnemy) return;
    for (let i = 0; i < this.projectiles.length; i++) {
      //decrease the hp
      if (collision(this.targetEnemy, this.projectiles[i])) {
        this.targetEnemy.decreaseHp(this.damage);
        this.projectiles.splice(i, 1);
        i--;
      }
    }
  }
}
