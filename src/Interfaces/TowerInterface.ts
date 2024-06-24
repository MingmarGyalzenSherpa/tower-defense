import Projectile from "../components/Projectile";

export default interface ITower {
  x: number;
  y: number;
  cost: number;
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
}
