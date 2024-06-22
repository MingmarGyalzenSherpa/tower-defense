import { CanvasDimension, CellDimensions } from "../constants/constants";
import collision from "../utils/utils";
import Cell from "./Cell";
import Mouse from "./Mouse";
import Tiles from "../assets/tileset/tileset.png";
import Orc from "./Enemies/Orc";
import MoonTowerImg from "../assets/tower/redmoon_showcase.png";
import CannonL1TowerHead from "../assets/tower/Cannon.png";
import CannonL1 from "./Towers/CannonL1";
import CannonL2TowerHead from "../assets/tower/Cannon2.png";
import CannonL2 from "./Towers/CannonL2";
import CoinImg from "../assets/coin.png";
import MoonTower from "./Towers/MoonTower";
interface IAvailableTower {
  x?: number;
  y?: number;
  img: any;
  width: number;
  height: number;
}
export default class Level1 {
  context: CanvasRenderingContext2D;
  grids: Cell[];
  coin: number;
  pathsPos: { x: number; y: number }[];
  bgImg: CanvasImageSource;
  mouse: Mouse;
  frame: number;
  cannonL1Tower: IAvailableTower;
  cannonL2Tower: IAvailableTower;
  moonTower: IAvailableTower;
  coinImg: CanvasImageSource;
  towers: any[];
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
  selectedDroppedTowerIndex?: number;
  enemies: any[];
  canvas: HTMLCanvasElement;
  availableTowers: IAvailableTower[];
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.mouse = new Mouse();
    this.coinImg = new Image();
    this.coinImg.src = CoinImg;
    this.enemies = [];
    this.grids = [];
    this.coin = 200;
    this.frame = 0;
    this.bgImg = new Image();
    this.bgImg.src = Tiles;
    this.cannonL1Tower = {
      img: new Image(),
      width: CellDimensions.WIDTH,
      height: CellDimensions.HEIGHT,
    };
    this.cannonL1Tower.img.src = CannonL1TowerHead;
    this.cannonL2Tower = {
      img: new Image(),
      width: CellDimensions.WIDTH,
      height: CellDimensions.HEIGHT,
    };
    this.moonTower = {
      img: new Image(),
      width: CellDimensions.WIDTH,
      height: CellDimensions.HEIGHT,
    };
    this.moonTower.img.src = MoonTowerImg;
    this.cannonL2Tower.img.src = CannonL2TowerHead;
    this.availableTowers = [];
    this.availableTowers.push(this.cannonL1Tower);
    this.availableTowers.push(this.cannonL2Tower);
    this.availableTowers.push(this.moonTower);

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
        y: 5,
      },
      {
        x: 1,
        y: 5,
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
        x: 3,
        y: 4,
      },
      {
        x: 3,
        y: 3,
      },
      {
        x: 4,
        y: 3,
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
        x: 7,
        y: 4,
      },
      {
        x: 7,
        y: 5,
      },
      {
        x: 7,
        y: 6,
      },
      {
        x: 8,
        y: 6,
      },
      {
        x: 9,
        y: 6,
      },
      {
        x: 10,
        y: 6,
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
        x: 12,
        y: 5,
      },
      {
        x: 13,
        y: 5,
      },
      {
        x: 14,
        y: 5,
      },
    ];
    this.enemies.push(
      new Orc(this.context, this.pathsPos[0].y * CellDimensions.HEIGHT)
    );
    this.createGrid();
    this.drawGrid();
    this.canvas.addEventListener("mousemove", this.handleMouse);
    this.canvas.addEventListener("click", this.handleClick);
  }

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
      }
    }

    //place tower
    this.placeTower();

    //handle placed tower options clicked
    this.handlePlaceTowersOptionClick();

    this.handlePlacedTowerClick();
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
      } else {
        this.selectedDroppedTowerIndex = undefined;
        console.log("huhu");
      }
    }
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
    this.context.font = "20px sans-serif";
    this.context.fillStyle = "black";
    this.context.fillText(
      `Coins: ${this.coin}`,
      offsetX + CellDimensions.WIDTH,
      offsetY + CellDimensions.HEIGHT / 2
    );
    this.context.closePath();
  }

  generateEnemy() {
    if (this.frame % 200 === 0 && this.frame % 600 != 0) {
      this.enemies.push(
        new Orc(this.context, this.pathsPos[0].y * CellDimensions.HEIGHT)
      );
    }
  }

  drawEnemy() {
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].draw();
    }
  }

  draw() {
    this.drawResources();
    this.drawCoin();
    this.drawAvailableTowers();
    this.drawBackground();
    this.drawPath();
    this.drawGrid();
    this.drawSelectedAvailableTower();
    this.drawTowers();
    this.drawSelectedPlacedTowerOptions();
    this.drawEnemy();
  }

  update() {
    this.frame++;
    this.generateEnemy();
    this.updateEnemies();
    this.updateTowers();
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
      this.enemies[i].update(this.pathsPos);
      if (!this.enemies[i].getHp()) {
        this.coin += this.enemies[i].coinGain;
        this.enemies.splice(i, 1);

        i--;
      }
    }
  }

  drawResources() {
    this.context.beginPath();
    this.context.fillStyle = "lightgreen";
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
    for (let x = 9; x <= 12 && i < this.availableTowers.length; x++) {
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

  /* The method called `handleMouse` that takes a MouseEvent as a parameter.
Inside the method, it updates the x and y coordinates of a `mouse` object based on the offsetX and
offsetY properties of the MouseEvent. */
  handleMouse = (e: MouseEvent) => {
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
    if (this.selectedAvailableTower === undefined || gridY < 2) {
      return;
    }
    let tower;
    switch (this.selectedAvailableTower) {
      case 0:
        tower = new CannonL1(
          gridX * CellDimensions.WIDTH,
          gridY * CellDimensions.HEIGHT,
          this.context
        );
        break;
      case 1:
        tower = new CannonL2(
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
    }

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
