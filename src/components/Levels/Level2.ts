import { CanvasDimension, CellDimensions } from "../../constants/constants";
import collision from "../../utils/utils";
import Cell from "../Cell";
import Mouse from "../Mouse";
import Tiles from "../../assets/tileset/tileset.png";
import Orc from "../Enemies/Orc";
import HealthImg from "../../assets/health.png";
import MoonTowerImg from "../../assets/tower/redmoon_showcase.png";
import SlowPowerupSprite from "../../assets/PowerUp/slowPowerup.png";
import CannonL1TowerHead from "../../assets/tower/Cannon.png";
import MachineGunTowerHead from "../../assets/tower/MG.png";
import CatapultTowerImg from "../../assets/tower/tower-pulley_showcase.png";
import Cannon from "../Towers/Cannon";
import MachineGun from "../Towers/MachineGun";
import CoinImg from "../../assets/coin.png";
import MoonTower from "../Towers/MoonTower";
import Catapult from "../Towers/Catapult";
import IAvailableTower from "../../Interfaces/AvailableTowerInterface";
import Skeleton from "../Enemies/Skeleton";
import FireWorm from "../Enemies/FireWorm";
import Bat from "../Enemies/Bat";
import IAvailablePowerUp from "../../Interfaces/AvailablePowerupInterface";
import SlowEnemy from "../PowerUps/SlowEnemy";
export default class Level2 {
  context: CanvasRenderingContext2D;
  grids: Cell[];
  coin: number;
  pathsPos: { x: number; y: number }[];
  bgImg: CanvasImageSource;
  mouse: Mouse;
  frame: number;
  health: number;
  healthImg: CanvasImageSource;
  cannonL1Tower: IAvailableTower;
  machineGunTower: IAvailableTower;
  catapultTower: IAvailableTower;
  availablePowerups: IAvailablePowerUp[];
  slowEnemyPowerUp: IAvailablePowerUp;
  moonTower: IAvailableTower;
  coinImg: CanvasImageSource;
  towers: any[];
  powerups: any[];
  selectedPlacedTowerOptions: {
    upgrade: {
      x?: number;
      y?: number;
      width: number;
      height: number;
    };
    break: {
      x?: number;
      y?: number;
      width: number;
      height: number;
    };
  };
  selectedAvailableTower?: number;
  selectedAvailablePowerUp?: number;
  selectedDroppedTowerIndex?: number;
  enemies: any[];
  canvas: HTMLCanvasElement;
  availableTowers: IAvailableTower[];
  currentWave: number;
  waveTimer: number;
  waveConfig: { enemies: { type: string; count: number }[] }[];
  waveInProgress: boolean;
  waveEnemySpawned: boolean;
  waveInterval: number;
  initialEnemyX?: number;
  score: number;
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.mouse = new Mouse();
    this.coinImg = new Image();
    this.coinImg.src = CoinImg;
    this.score = 0;
    this.enemies = [];
    this.grids = [];
    this.coin = 280;
    this.frame = 0;
    this.bgImg = new Image();
    this.bgImg.src = Tiles;
    this.health = 10;
    this.healthImg = new Image();
    this.healthImg.src = HealthImg;
    this.cannonL1Tower = {
      img: new Image(),
      width: CellDimensions.WIDTH,
      height: CellDimensions.HEIGHT,
      cost: 80,
    };
    this.machineGunTower = {
      img: new Image(),
      width: CellDimensions.WIDTH,
      height: CellDimensions.HEIGHT,
      cost: 60,
    };
    this.moonTower = {
      img: new Image(),
      width: CellDimensions.WIDTH,
      height: CellDimensions.HEIGHT,
      cost: 100,
    };
    this.catapultTower = {
      img: new Image(),
      width: CellDimensions.WIDTH,
      height: CellDimensions.HEIGHT,
      cost: 40,
    };

    //power ups
    this.powerups = [];
    this.slowEnemyPowerUp = {
      img: new Image(),
      width: CellDimensions.WIDTH,
      height: CellDimensions.HEIGHT,
      cost: 200,
    };
    this.slowEnemyPowerUp.img.src = SlowPowerupSprite;
    this.availablePowerups = [];
    this.availablePowerups.push(this.slowEnemyPowerUp);
    this.catapultTower.img.src = CatapultTowerImg;
    this.cannonL1Tower.img.src = CannonL1TowerHead;
    this.moonTower.img.src = MoonTowerImg;
    this.machineGunTower.img.src = MachineGunTowerHead;
    this.availableTowers = [];
    this.availableTowers.push(this.cannonL1Tower);
    this.availableTowers.push(this.machineGunTower);
    this.availableTowers.push(this.moonTower);
    this.availableTowers.push(this.catapultTower);
    this.selectedPlacedTowerOptions = {
      upgrade: {
        width: CellDimensions.WIDTH,
        height: CellDimensions.HEIGHT / 3,
      },
      break: {
        width: CellDimensions.WIDTH,
        height: CellDimensions.HEIGHT / 3,
      },
    };

    this.towers = [];
    //positions for path
    this.pathsPos = [
      {
        x: 0,
        y: 3,
      },
      {
        x: 1,
        y: 3,
      },
      {
        x: 2,
        y: 3,
      },
      {
        x: 2,
        y: 4,
      },
      {
        x: 2,
        y: 5,
      },
      {
        x: 3,
        y: 5,
      },
      {
        x: 4,
        y: 5,
      },
      {
        x: 5,
        y: 5,
      },
      {
        x: 5,
        y: 4,
      },
      {
        x: 5,
        y: 3,
      },
      {
        x: 6,
        y: 3,
      },
      {
        x: 7,
        y: 3,
      },
      {
        x: 8,
        y: 3,
      },
      {
        x: 8,
        y: 4,
      },
      {
        x: 8,
        y: 5,
      },
      {
        x: 8,
        y: 6,
      },
      {
        x: 7,
        y: 6,
      },
      {
        x: 7,
        y: 7,
      },
      {
        x: 7,
        y: 8,
      },
      {
        x: 8,
        y: 8,
      },
      {
        x: 9,
        y: 8,
      },
      {
        x: 10,
        y: 8,
      },
      {
        x: 11,
        y: 7,
      },
      {
        x: 11,
        y: 8,
      },
      {
        x: 11,
        y: 6,
      },
      {
        x: 11,
        y: 5,
      },
      {
        x: 11,
        y: 4,
      },
      {
        x: 12,
        y: 4,
      },
      {
        x: 13,
        y: 4,
      },
      {
        x: 14,
        y: 4,
      },
    ];

    //wave
    this.waveConfig = [
      {
        enemies: [
          {
            type: "Bat",
            count: 5,
          },
        ],
      },
      {
        enemies: [
          {
            type: "Bat",
            count: 4,
          },
          {
            type: "Skeleton",
            count: 3,
          },
        ],
      },
      {
        enemies: [
          {
            type: "Skeleton",
            count: 4,
          },
          {
            type: "Orc",
            count: 4,
          },
        ],
      },
      {
        enemies: [
          {
            type: "Skeleton",
            count: 3,
          },
          {
            type: "Orc",
            count: 3,
          },
          {
            type: "FireWorm",
            count: 5,
          },
        ],
      },
    ];
    this.currentWave = 0;
    this.waveInProgress = false;
    this.waveTimer = 0;
    this.waveEnemySpawned = false;
    this.waveInterval = 5000;
    this.createGrid();
    this.drawGrid();
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("click", this.handleClick);
  }

  /* The above TypeScript code defines a `handleClick` method that performs the following actions:
  1. It iterates over the `availableTowers` array to check if the mouse cursor position collides
  with any of the available towers.
  2. If a collision is detected, it sets the `selectedAvailableTower` property to the index of the
  tower that was clicked.
  3. It then calls the `placeTower` method to place the tower.
  4. It calls the `handlePlaceTowersOptionClick` method to handle any options related to placing
  towers.
*/
  handleClick = () => {
    //check if resource tower is clicked
    for (let i = 0; i < this.availableTowers.length; i++) {
      if (
        collision(this.mouse, {
          x: this.availableTowers[i].x!,
          y: this.availableTowers[i].y!,
          width: this.availableTowers[i].width,
          height: this.availableTowers[i].height,
        })
      ) {
        this.selectedAvailableTower = i;
        this.selectedAvailablePowerUp = undefined;
      }
    }

    //check if powerup is clicked
    for (let i = 0; i < this.availablePowerups.length; i++) {
      if (
        collision(this.mouse, {
          x: this.availablePowerups[i].x!,
          y: this.availablePowerups[i].y!,
          width: this.availablePowerups[i].width,
          height: this.availablePowerups[i].height,
        })
      ) {
        this.selectedAvailablePowerUp = i;
        this.selectedAvailableTower = undefined;
      }
    }

    //place tower
    this.placeTower();

    //place powerup
    this.placePowerUp();

    //handle placed tower options clicked
    this.handlePlaceTowersOptionClick();

    this.handlePlacedTowerClick();
  };

  /**
   * The function `handlePlacedTowerClick` iterates through the towers and sets the
   * selectedDroppedTowerIndex based on collision detection with the mouse.
   */
  handlePlacedTowerClick() {
    for (let i = 0; i < this.towers.length; i++) {
      if (
        collision(this.mouse, {
          x: this.towers[i].x,
          y: this.towers[i].y,
          width: this.towers[i].width,
          height: this.towers[i].height,
        })
      ) {
        this.selectedDroppedTowerIndex = i;
        break;
      } else if (i === this.towers.length - 1) {
        this.selectedDroppedTowerIndex = undefined;
      }
    }
  }

  /**
   * The `clean` function removes event listeners for mousemove and click events from a canvas element.
   */
  clean() {
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("click", this.handleClick);
  }

  /**
   * The function `handlePlaceTowersOptionClick` checks for collision with upgrade and break options for
   * a selected tower and performs corresponding actions.
   * @returns If the condition `tower.cost[tower.curLevel] > this.coin` is true, then `undefined` will
   * be returned. Otherwise, the function will continue executing without explicitly returning a value.
   */
  handlePlaceTowersOptionClick() {
    let tower = this.towers[this.selectedDroppedTowerIndex!];
    if (
      collision(this.mouse, {
        ...this.selectedPlacedTowerOptions.upgrade,
        x: this.selectedPlacedTowerOptions.upgrade.x!,
        y: this.selectedPlacedTowerOptions.upgrade.y!,
      })
    ) {
      console.log(tower);
      console.log(tower.cost);
      console.log(tower.curLevel);
      console.log(tower.cost[tower.curLevel]);
      console.log(this.coin);
      if (tower.cost[tower.curLevel] > this.coin) return;
      this.coin -= tower.cost[tower.curLevel];
      tower.upgrade();
    }

    if (
      collision(this.mouse, {
        ...this.selectedPlacedTowerOptions.break,
        x: this.selectedPlacedTowerOptions.break.x!,
        y: this.selectedPlacedTowerOptions.break.y!,
      })
    ) {
      this.towers.splice(this.selectedDroppedTowerIndex!, 1);
      this.selectedDroppedTowerIndex = undefined;
    }
  }

  /**
   * The function `drawSelectedPlacedTowerRange` draws a red circular range indicator around a selected
   * tower on a canvas with reduced opacity.
   * @returns If the `selectedDroppedTowerIndex` is `undefined`, the function will return early and
   * nothing will be drawn.
   */
  drawSelectedPlacedTowerRange() {
    if (this.selectedDroppedTowerIndex === undefined) return;
    let selectedDroppedTower = this.towers[this.selectedDroppedTowerIndex];
    let range = selectedDroppedTower.range;
    let cx = selectedDroppedTower.x + selectedDroppedTower.width / 2;
    let cy = selectedDroppedTower.y + selectedDroppedTower.height / 2;
    this.context.beginPath();
    this.context.fillStyle = "red";
    this.context.save();
    this.context.globalAlpha = 0.5;
    this.context.arc(cx, cy, range, 0, 2 * Math.PI);
    this.context.fill();
    this.context.restore();
    this.context.closePath();
  }

  /**
   * The function `drawSelectedPlacedTowerOptions` draws upgrade and break options for a selected tower
   * if it is not at max level, otherwise it only displays the break option.
   * @returns The `drawSelectedPlacedTowerOptions()` function is returning nothing (`undefined`) if the
   * `selectedDroppedTowerIndex` is undefined.
   */
  drawSelectedPlacedTowerOptions() {
    if (this.selectedDroppedTowerIndex === undefined) return;

    let selectedDroppedTower = this.towers[this.selectedDroppedTowerIndex];
    if (selectedDroppedTower.curLevel !== selectedDroppedTower.maxLevel) {
      //update the x,y of selectedPlacedTowerOptions
      this.selectedPlacedTowerOptions.upgrade.x = selectedDroppedTower.x;
      this.selectedPlacedTowerOptions.upgrade.y =
        selectedDroppedTower.y + CellDimensions.HEIGHT;

      this.selectedPlacedTowerOptions.break.x = selectedDroppedTower.x;
      this.selectedPlacedTowerOptions.break.y =
        this.selectedPlacedTowerOptions.upgrade.y! +
        this.selectedPlacedTowerOptions.upgrade.height;

      this.context.beginPath();
      this.context.fillStyle = "green";
      this.context.fillRect(
        this.selectedPlacedTowerOptions.upgrade.x!,
        this.selectedPlacedTowerOptions.upgrade.y!,
        this.selectedPlacedTowerOptions.upgrade.width,
        this.selectedPlacedTowerOptions.upgrade.height
      );
      this.context.closePath();

      this.context.beginPath();
      this.context.fillStyle = "black";
      this.context.font = "bold 14px Audiowide";
      this.context.fillText(
        "UPGRADE",
        selectedDroppedTower.x,
        selectedDroppedTower.y +
          CellDimensions.HEIGHT +
          selectedDroppedTower.height / 4
      );

      this.context.closePath();
      this.context.beginPath();
      this.context.fillStyle = "red";
      this.context.fillRect(
        this.selectedPlacedTowerOptions.break.x!,
        this.selectedPlacedTowerOptions.break.y!,
        this.selectedPlacedTowerOptions.break.width,
        this.selectedPlacedTowerOptions.break.height
      );
      this.context.closePath();
      this.context.font = "bold 14px Audiowide";
      this.context.fillStyle = "black";

      this.context.fillText(
        "BREAK",
        selectedDroppedTower.x,
        selectedDroppedTower.y +
          CellDimensions.HEIGHT +
          selectedDroppedTower.height / 2
      );
    } else {
      this.selectedPlacedTowerOptions.break.x = selectedDroppedTower.x;
      this.selectedPlacedTowerOptions.break.y =
        selectedDroppedTower.y + CellDimensions.HEIGHT;
      this.context.closePath();
      this.context.beginPath();
      this.context.fillStyle = "red";

      this.context.fillRect(
        this.selectedPlacedTowerOptions.break.x!,
        this.selectedPlacedTowerOptions.break.y!,
        this.selectedPlacedTowerOptions.break.width,
        this.selectedPlacedTowerOptions.break.height
      );
      this.context.closePath();
      this.context.font = "bold 14px Audiowide";
      this.context.fillStyle = "black";

      this.context.fillText(
        "BREAK",
        selectedDroppedTower.x,
        selectedDroppedTower.y +
          CellDimensions.HEIGHT +
          selectedDroppedTower.height / 4
      );
    }
  }

  /**
   * The drawHealth function in TypeScript draws a health image and text on a canvas with specified
   * dimensions and styles.
   */
  drawHealth() {
    let offsetX = 10;
    this.context.beginPath();
    this.context.drawImage(
      this.healthImg,
      20,
      20,
      700,
      700,
      offsetX,
      CellDimensions.HEIGHT,
      CellDimensions.WIDTH,
      CellDimensions.HEIGHT
    );
    this.context.font = "30px Audiowide";
    this.context.fillStyle = "white";
    this.context.fillText(
      `${this.health}`,
      offsetX + CellDimensions.WIDTH,
      CellDimensions.HEIGHT + 40
    );
  }

  /**
   * The `drawCoin` function in TypeScript draws a coin image on a canvas along with the current number
   * of coins.
   */
  drawCoin() {
    let offsetX = 10;
    let offsetY = 10;

    this.context.beginPath();
    this.context.drawImage(
      this.coinImg,
      offsetX,
      offsetY,
      CellDimensions.WIDTH,
      CellDimensions.HEIGHT
    );
    this.context.font = "20px Audiowide";
    this.context.fillStyle = "white";
    this.context.fillText(
      `Coins: ${this.coin}`,
      offsetX + CellDimensions.WIDTH,
      offsetY + CellDimensions.HEIGHT / 1.5
    );
    this.context.closePath();
  }

  /**
   * The drawEnemy function iterates through an array of enemies and calls the draw method for each
   * enemy.
   */
  drawEnemy() {
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].draw();
    }
  }

  drawAvailablePowerUps() {
    let i = 0;
    for (let x = 10; x <= 12 && i < this.availablePowerups.length; x++) {
      this.context.beginPath();

      //set property
      this.availablePowerups[i].x = x * CellDimensions.WIDTH;
      this.availablePowerups[i].y = CellDimensions.HEIGHT;
      //check collision for  stroke
      if (
        collision(this.mouse, {
          x: this.availablePowerups[i].x!,
          y: this.availablePowerups[i].y!,
          width: this.availablePowerups[i].width,
          height: this.availablePowerups[i].height,
        })
      ) {
        this.context.beginPath();
        this.context.strokeRect(
          this.availablePowerups[i].x!,
          this.availablePowerups[i].y!,
          this.availablePowerups[i].width,
          this.availablePowerups[i].height
        );
      }

      //draw cost
      let textOffsetX = 30;
      let textOffsetY = -20;
      this.context.font = "16px Audiowide";
      this.context.fillText(
        `${this.availablePowerups[i].cost}`,
        this.availablePowerups[i].x! + textOffsetX,
        this.availablePowerups[i].y! + textOffsetY
      );
      //draw image
      let srcX = 0;
      let srcY = 0;
      let srcWidth = 16;
      let srcHeight = 16;

      this.context.drawImage(
        this.availablePowerups[i].img as CanvasImageSource,
        srcX,
        srcY,
        srcWidth,
        srcHeight,
        this.availablePowerups[i].x!,
        this.availablePowerups[i].y!,
        CellDimensions.WIDTH,
        CellDimensions.HEIGHT
      );
      i++;
    }
  }

  drawPowerUps() {
    for (let i = 0; i < this.powerups.length; i++) {
      this.powerups[i].draw();
    }
  }

  /**
   * The function `drawScore` in TypeScript draws the current score on a canvas at a specific position.
   */
  drawScore() {
    let scoreGridX = 12;
    let scoreY = 60;
    this.context.beginPath();
    this.context.font = "20px Audiowide";
    this.context.fillStyle = "white";
    this.context.fillText(
      `Score: ${this.score}`,
      scoreGridX * CellDimensions.WIDTH,
      scoreY
    );
  }

  draw() {
    this.drawResources();
    this.drawScore();
    this.drawCoin();
    this.drawHealth();
    this.drawAvailableTowers();
    this.drawAvailablePowerUps();
    this.drawBackground();
    this.drawPath();
    this.drawGrid();
    this.drawSelectedAvailableTower();
    this.drawSelectedAvailablePowerUp();
    this.drawTowers();
    this.drawPowerUps();
    this.drawSelectedPlacedTowerRange();
    this.drawSelectedPlacedTowerOptions();
    this.drawEnemy();
  }

  update() {
    this.frame++;
    // this.generateEnemy();
    // this.increaseCoin();
    this.updateWave();
    this.updateEnemies();
    this.updatePowerUps();
    this.updateTowers();
  }

  updatePowerUps() {
    for (let i = 0; i < this.powerups.length; i++) {
      if (this.powerups[i].update()) {
        this.powerups.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < this.powerups.length; i++) {
      //collision between powerUp and enemy
      for (let j = 0; j < this.enemies.length; j++) {
        if (!collision(this.powerups[i], this.enemies[j])) {
          this.enemies[j].resetVelocity();
          console.log("not collided");
          return;
        }
        console.log("heree");
        this.enemies[j].changeVelocity(1);
      }
    }
  }

  increaseCoin() {
    if (this.frame % 200 === 0) {
      this.coin += 20;
    }
  }

  updateTowers() {
    //check for enemy within range
    for (let i = 0; i < this.towers.length; i++) {
      for (let j = 0; j < this.enemies.length; j++) {
        this.towers[i].update(this.enemies[j]);
      }
    }
  }

  updateEnemies() {
    console.log(this.enemies);
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].update();
      if (this.powerups.length === 0) {
        this.enemies[i].resetVelocity();
      }
      if (!this.enemies[i].getHp()) {
        this.coin += this.enemies[i].coinGain;
        this.score += this.enemies[i].coinGain;
        this.enemies.splice(i, 1);

        i--;
      }
      if (this.enemies[i]?.x > CanvasDimension.WIDTH) {
        this.health--;
        this.enemies.splice(i, 1);
        i--;
      }
    }
  }

  updateWave() {
    //check if  wave is ongoing
    if (!this.waveInProgress && this.currentWave < this.waveConfig.length) {
      this.waveInProgress = true;
      this.waveTimer = 0;
    }

    //if wave is in progress
    if (this.waveInProgress) {
      this.waveTimer++;
      this.spawnEnemy();
      if (this.enemies.length === 0 || this.waveTimer >= this.waveInterval) {
        this.waveTimer = 0;
        this.waveEnemySpawned = false;
        this.currentWave++;
      }
    }
  }

  spawnEnemy() {
    this.initialEnemyX = -100;
    let gapBetweenEnemyX = 150;
    if (this.waveEnemySpawned) return;
    const currentWaveDetail = this.waveConfig[this.currentWave];
    for (const enemyDetail of currentWaveDetail.enemies) {
      let enemy;
      for (let i = 0; i < enemyDetail.count; i++) {
        this.initialEnemyX = this.initialEnemyX - gapBetweenEnemyX;
        switch (enemyDetail.type) {
          case "Bat":
            enemy = new Bat(this.context, this.initialEnemyX, this.pathsPos);
            break;

          case "Skeleton":
            enemy = new Skeleton(
              this.context,
              this.initialEnemyX,
              this.pathsPos
            );
            break;

          case "Orc":
            enemy = new Orc(this.context, this.initialEnemyX, this.pathsPos);
            break;
          case "FireWorm":
            enemy = new FireWorm(
              this.context,
              this.initialEnemyX,
              this.pathsPos
            );
            break;
        }
        this.enemies.push(enemy);
      }
    }
    this.waveEnemySpawned = true;
  }

  drawResources() {
    this.context.beginPath();
    this.context.fillStyle = "#E0A75E";
    this.context.fillRect(0, 0, this.canvas.width, CellDimensions.HEIGHT * 2);
    this.context.closePath();
  }

  drawTowers() {
    if (this.towers.length == 0) return;
    for (let i = 0; i < this.towers.length; i++) {
      this.towers[i].draw();
    }
  }
  /**
   * The `drawAvailableTowers` function iterates through available towers, sets their properties, checks
   * for collision with the mouse, and draws the towers on a canvas.
   */
  drawAvailableTowers() {
    let i = 0;
    for (let x = 5; x <= 8 && i < this.availableTowers.length; x++) {
      this.context.beginPath();

      //set property
      this.availableTowers[i].x = x * CellDimensions.WIDTH;
      this.availableTowers[i].y = CellDimensions.HEIGHT;
      //check collision for  stroke
      if (
        collision(this.mouse, {
          x: this.availableTowers[i].x!,
          y: this.availableTowers[i].y!,
          width: this.availableTowers[i].width,
          height: this.availableTowers[i].height,
        })
      ) {
        this.context.beginPath();
        this.context.strokeRect(
          this.availableTowers[i].x!,
          this.availableTowers[i].y!,
          this.availableTowers[i].width,
          this.availableTowers[i].height
        );
      }

      //draw cost
      let textOffsetX = 30;
      let textOffsetY = -20;
      this.context.font = "16px Audiowide";
      this.context.fillText(
        `${this.availableTowers[i].cost}`,
        this.availableTowers[i].x! + textOffsetX,
        this.availableTowers[i].y! + textOffsetY
      );
      //draw image
      this.context.drawImage(
        this.availableTowers[i].img as CanvasImageSource,
        this.availableTowers[i].x!,
        this.availableTowers[i].y!,
        CellDimensions.WIDTH,
        CellDimensions.HEIGHT
      );
      i++;
    }
  }

  /**
   * The function `drawSelectedAvailableTower` draws a selected available tower image on a grid based
   * on mouse position.
   * @returns If the `selectedAvailableTower` is undefined or if `gridY` is less than 2, the function
   * will return early and not draw anything on the canvas.
   */
  drawSelectedAvailableTower() {
    let gridX = Math.floor(this.mouse.x / CellDimensions.WIDTH);
    let gridY = Math.floor(this.mouse.y / CellDimensions.HEIGHT);
    if (this.selectedAvailableTower === undefined || gridY < 2) return;
    this.context.beginPath();
    this.context.globalAlpha = 0.2;
    this.context.drawImage(
      this.availableTowers[this.selectedAvailableTower].img,
      gridX * this.availableTowers[this.selectedAvailableTower].width,
      gridY * this.availableTowers[this.selectedAvailableTower].height,
      this.availableTowers[this.selectedAvailableTower].width,
      this.availableTowers[this.selectedAvailableTower].height
    );
    this.context.globalAlpha = 1;
    this.context.closePath();
  }

  drawSelectedAvailablePowerUp() {
    let gridX = Math.floor(this.mouse.x / CellDimensions.WIDTH);
    let gridY = Math.floor(this.mouse.y / CellDimensions.HEIGHT);
    if (this.selectedAvailablePowerUp === undefined || gridY < 2) return;
    this.context.beginPath();
    this.context.globalAlpha = 0.2;
    let srcX = 0;
    let srcY = 0;
    let srcWidth = 16;
    let srcHeight = 16;
    this.context.drawImage(
      this.availablePowerups[this.selectedAvailablePowerUp].img,
      srcX,
      srcY,
      srcWidth,
      srcHeight,
      gridX * this.availablePowerups[this.selectedAvailablePowerUp].width,
      gridY * this.availablePowerups[this.selectedAvailablePowerUp].height,
      this.availablePowerups[this.selectedAvailablePowerUp].width,
      this.availablePowerups[this.selectedAvailablePowerUp].height
    );
    this.context.globalAlpha = 1;
    this.context.closePath();
  }

  placePowerUp() {
    let gridX = Math.floor(this.mouse.x / CellDimensions.WIDTH);
    let gridY = Math.floor(this.mouse.y / CellDimensions.HEIGHT);
    if (this.selectedAvailablePowerUp === undefined || gridY < 2) return;

    //if co-ordinate matches already placed powerups
    if (
      this.powerups.some((powerup) => {
        let powerupGridX = Math.floor(powerup.x / CellDimensions.WIDTH);
        let powerupGridY = Math.floor(powerup.y / CellDimensions.HEIGHT);
        return powerupGridX === gridX && powerupGridY === gridY;
      })
    ) {
      this.selectedAvailablePowerUp = undefined;
      return;
    }

    let powerup;
    switch (this.selectedAvailablePowerUp) {
      case 0:
        powerup = new SlowEnemy(
          gridX * CellDimensions.WIDTH,
          gridY * CellDimensions.HEIGHT,
          this.context
        );
        break;
    }
    if (powerup!.cost > this.coin) return;
    this.coin -= powerup!.cost;
    this.powerups.push(powerup);
    this.selectedAvailablePowerUp = undefined;
  }

  /* The method called `handleMouseMove` that takes a MouseEvent as a parameter.
Inside the method, it updates the x and y coordinates of a `mouse` object based on the offsetX and
offsetY properties of the MouseEvent. */
  handleMouseMove = (e: MouseEvent) => {
    this.mouse.x = e.offsetX;
    this.mouse.y = e.offsetY;
  };
  createGrid() {
    for (
      let i = CellDimensions.HEIGHT * 2;
      i < CanvasDimension.HEIGHT;
      i += CellDimensions.HEIGHT
    ) {
      for (let j = 0; j < CanvasDimension.WIDTH; j += CellDimensions.WIDTH) {
        this.grids.push(new Cell(this.context, j, i));
      }
    }
  }

  placeTower() {
    let gridX = Math.floor(this.mouse.x / CellDimensions.WIDTH);
    let gridY = Math.floor(this.mouse.y / CellDimensions.HEIGHT);

    //check if blocks the path
    if (this.pathsPos.some((path) => path.x === gridX && path.y === gridY)) {
      return;
    }
    //if the co-ordinates are outside the ground
    if (this.selectedAvailableTower === undefined || gridY < 2) {
      return;
    }

    //if co-ordinate matches already placed towers
    if (
      this.towers.some((tower) => {
        let towerGridX = Math.floor(tower.x / CellDimensions.WIDTH);
        let towerGridY = Math.floor(tower.y / CellDimensions.HEIGHT);
        return towerGridX === gridX && towerGridY === gridY;
      })
    ) {
      this.selectedAvailableTower = undefined;
      return;
    }
    let tower;
    switch (this.selectedAvailableTower) {
      case 0:
        tower = new Cannon(
          gridX * CellDimensions.WIDTH,
          gridY * CellDimensions.HEIGHT,
          this.context
        );
        break;
      case 1:
        tower = new MachineGun(
          gridX * CellDimensions.WIDTH,
          gridY * CellDimensions.HEIGHT,
          this.context
        );
        break;
      case 2:
        tower = new MoonTower(
          gridX * CellDimensions.WIDTH,
          gridY * CellDimensions.HEIGHT,
          this.context
        );
        break;
      case 3:
        tower = new Catapult(
          gridX * CellDimensions.WIDTH,
          gridY * CellDimensions.HEIGHT,
          this.context
        );
        break;
    }
    console.log(tower!.cost);
    console.log(tower!.cost[tower!.curLevel - 1]);
    if (tower!.cost[tower!.curLevel - 1] > this.coin) return;
    this.coin -= tower!.cost[tower!.curLevel - 1];
    this.towers.push(tower!);
    this.selectedAvailableTower = undefined;
  }

  drawGrid() {
    for (let i = 0; i < this.grids.length; i++) {
      if (collision(this.mouse, this.grids[i])) {
        this.grids[i].draw();
      }
    }
  }

  drawBackground() {
    for (
      let y = CellDimensions.HEIGHT * 2;
      y < this.canvas.height;
      y += CellDimensions.HEIGHT
    ) {
      for (let x = 0; x < this.canvas.width; x += CellDimensions.WIDTH) {
        this.context.beginPath();
        this.context.drawImage(
          this.bgImg,
          10,
          5,
          100,
          100,
          x,
          y,
          CellDimensions.WIDTH,
          CellDimensions.HEIGHT
        );
        this.context.closePath();
      }
    }
  }

  drawPath() {
    for (let i = 0; i < this.pathsPos.length; i++) {
      this.context.beginPath();
      this.context.fillStyle = "blue";

      this.context.drawImage(
        this.bgImg,
        220,
        50,
        100,
        100,
        this.pathsPos[i].x * CellDimensions.HEIGHT,
        this.pathsPos[i].y * CellDimensions.HEIGHT,
        CellDimensions.WIDTH,
        CellDimensions.HEIGHT
      );
    }
  }
}
