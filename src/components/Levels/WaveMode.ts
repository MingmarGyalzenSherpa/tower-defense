import {
  CanvasDimension,
  CellDimensions,
  WaveModeState,
} from "../../constants/constants";
import collision from "../../utils/utils";
import Cell from "../Cell";
import Mouse from "../Mouse";
import Tiles from "../../assets/tileset/tileset.png";
import HealthImg from "../../assets/health.png";
import MoonTowerImg from "../../assets/tower/redmoon_showcase.png";
import CannonL1TowerHead from "../../assets/tower/Cannon.png";
import MachineGunTowerHead from "../../assets/tower/MG.png";
import CatapultTowerImg from "../../assets/tower/tower-pulley_showcase.png";
import Cannon from "../Towers/Cannon";
import MachineGun from "../Towers/MachineGun";
import CoinImg from "../../assets/coin.png";
import MoonTower from "../Towers/MoonTower";
import Catapult from "../Towers/Catapult";
import IAvailableTower from "../../Interfaces/AvailableTowerInterface";
import Orc from "../Enemies/Orc";
import Golem from "../Enemies/Golem";
import FireWorm from "../Enemies/FireWorm";
import Skeleton from "../Enemies/Skeleton";
import Bat from "../Enemies/Bat";
export default class WaveMode {
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
  moonTower: IAvailableTower;
  coinImg: CanvasImageSource;
  towers: any[];
  hoverPath: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
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
  startBtn: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  selectedAvailableTower?: number;
  selectedDroppedTowerIndex?: number;
  enemies: any[];
  canvas: HTMLCanvasElement;
  availableTowers: IAvailableTower[];
  waveModeState: WaveModeState;
  currentWave: number;
  waveTimer: number;
  waveConfig: { enemies: { type: string; count: number }[] }[];
  waveInProgress: boolean;
  waveEnemySpawned: boolean;
  waveInterval: number;
  initialEnemyX?: number;
  score: number;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.waveModeState = WaveModeState.EDITOR;
    this.startBtn = {
      x: CanvasDimension.WIDTH / 2 - 100,
      y: CellDimensions.HEIGHT,
      width: CellDimensions.WIDTH * 2,
      height: 50,
    };
    this.canvas = canvas;
    this.context = context;
    this.mouse = new Mouse();
    this.coinImg = new Image();
    this.coinImg.src = CoinImg;
    this.score = 0;
    this.enemies = [];
    this.grids = [];
    this.coin = 200;
    this.frame = 0;
    this.bgImg = new Image();
    this.bgImg.src = Tiles;
    this.health = 10;
    this.healthImg = new Image();
    this.healthImg.src = HealthImg;

    this.hoverPath = {
      x: 0,
      y: 0,
      width: CellDimensions.WIDTH,
      height: CellDimensions.HEIGHT,
    };
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
    this.pathsPos = [];
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

  clean() {
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("click", this.handleClick);
  }

  handleClick = () => {
    if (this.waveModeState === WaveModeState.EDITOR) {
      //check if start btn is clicked
      if (collision(this.mouse, this.startBtn)) {
        this.waveModeState = WaveModeState.PLAYING;
      }

      //add or remove path
      let gridX = Math.floor(this.mouse.x / CellDimensions.WIDTH);
      let gridY = Math.floor(this.mouse.y / CellDimensions.HEIGHT);

      if (gridY < 2) return;
      if (this.pathsPos.find((path) => path.x === gridX && path.y === gridY)) {
        this.pathsPos = this.pathsPos.filter(
          (path) => !(path.x === gridX && path.y === gridY)
        );
      } else {
        this.pathsPos.push({ x: gridX, y: gridY });
      }
    } else {
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
        }
      }

      //place tower
      this.placeTower();

      //handle placed tower options clicked
      this.handlePlaceTowersOptionClick();

      this.handlePlacedTowerClick();
    }
  };

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

    console.log(this.selectedDroppedTowerIndex);
  }

  handlePlaceTowersOptionClick() {
    if (
      collision(this.mouse, {
        ...this.selectedPlacedTowerOptions.upgrade,
        x: this.selectedPlacedTowerOptions.upgrade.x!,
        y: this.selectedPlacedTowerOptions.upgrade.y!,
      })
    ) {
      console.log("hehe");
      this.towers[this.selectedDroppedTowerIndex!].upgrade();
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

  drawSelectedPlacedTowerOptions() {
    if (this.selectedDroppedTowerIndex === undefined) return;

    let selectedDroppedTower = this.towers[this.selectedDroppedTowerIndex];
    if (selectedDroppedTower.curLevel === selectedDroppedTower.maxLevel) return;

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
  }

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

  // generateEnemy() {
  //   if (this.frame % 200 === 0 && this.frame % 600 != 0) {
  //   }
  // }

  drawEnemy() {
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].draw();
    }
  }

  drawStartButton() {
    this.context.beginPath();
    this.context.fillStyle = "white";
    this.context.fillRect(
      this.startBtn.x,
      this.startBtn.y,
      this.startBtn.width,
      this.startBtn.height
    );
    let textOffsetY = 30;
    this.context.fillStyle = "black";
    this.context.textAlign = "center";
    this.context.fillText(
      "START",
      this.startBtn.x + this.startBtn.width / 2,
      this.startBtn.y + textOffsetY,
      this.startBtn.width
    );
    this.context.textAlign = "start";
    this.context.closePath();
  }

  drawScore() {
    let scoreGridX = 11;
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

    switch (this.waveModeState) {
      case WaveModeState.EDITOR:
        this.drawStartButton();
        this.drawBackground();
        this.drawHoverPath();
        this.drawPath();

        break;

      case WaveModeState.PLAYING:
        this.drawCoin();
        this.drawScore();
        this.drawHealth();
        this.drawAvailableTowers();
        this.drawBackground();
        this.drawPath();
        this.drawGrid();
        this.drawSelectedAvailableTower();
        this.drawTowers();
        this.drawSelectedPlacedTowerRange();
        this.drawSelectedPlacedTowerOptions();
        this.drawEnemy();
        break;
    }
  }

  update() {
    this.frame++;
    // this.generateEnemy();

    if (this.waveModeState === WaveModeState.EDITOR) {
    } else {
      this.updateWave();
      this.updateEnemies();
      this.updateTowers();
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
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].update();
      if (!this.enemies[i].getHp()) {
        this.coin += this.enemies[i].coinGain;
        this.enemies.splice(i, 1);

        i--;
      }
      if (this.enemies[i].x > CanvasDimension.WIDTH) {
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
    for (let x = 5; x <= 12 && i < this.availableTowers.length; x++) {
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

    this.towers.push(tower!);
    this.selectedAvailableTower = undefined;
  }

  drawHoverPath() {
    let gridX = Math.floor(this.mouse.x / CellDimensions.WIDTH);
    let gridY = Math.floor(this.mouse.y / CellDimensions.HEIGHT);
    if (gridY < 2) return;
    this.hoverPath.x = gridX * CellDimensions.WIDTH;
    this.hoverPath.y = gridY * CellDimensions.HEIGHT;
    this.context.drawImage(
      this.bgImg,
      220,
      50,
      100,
      100,
      this.hoverPath.x,
      this.hoverPath.y,
      CellDimensions.WIDTH,
      CellDimensions.HEIGHT
    );
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