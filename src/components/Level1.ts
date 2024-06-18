import { CanvasDimension, CellDimensions } from "../constants/constants";
import collision from "../utils/utils";
import Cell from "./Cell";
import Mouse from "./Mouse";
import Tiles from "../assets/tileset/tileset.png";
import Orc from "./Orc";
import CannonL1TowerHead from "../assets/tower/Cannon.png";
export default class Level1 {
  context: CanvasRenderingContext2D;
  grids: Cell[];
  pathsPos: { x: number; y: number }[];
  bgImg: CanvasImageSource;
  mouse: Mouse;
  frame: number;
  cannonL1Tower: CanvasImageSource;
  towers: [];
  enemies: Orc[];
  canvas: HTMLCanvasElement;
  availableTowers: CanvasImageSource[];
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.mouse = new Mouse();
    this.enemies = [];
    this.grids = [];
    this.frame = 0;
    this.bgImg = new Image();
    this.bgImg.src = Tiles;
    this.cannonL1Tower = new Image();
    this.cannonL1Tower.src = CannonL1TowerHead;
    this.availableTowers = [];
    this.availableTowers.push(this.cannonL1Tower);
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
  }

  generateEnemy() {
    // if (this.frame % 10 === 0) {
    // this.enemies.push(
    //   new Orc(this.context, this.pathsPos[0].y * CellDimensions.HEIGHT)
    // );
    // }
  }

  drawEnemy() {
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].draw();
    }
  }

  draw() {
    this.drawResources();
    this.drawAvailableTowers();
    this.drawBackground();
    this.drawPath();
    this.drawGrid();
    this.drawEnemy();
  }

  update() {
    this.frame++;
    this.generateEnemy();
    this.updateEnemies();
  }

  updateEnemies() {
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].update(this.pathsPos);
    }
  }

  drawResources() {
    this.context.beginPath();
    this.context.fillStyle = "lightgreen";
    this.context.fillRect(0, 0, this.canvas.width, CellDimensions.HEIGHT * 2);
    this.context.closePath();
  }

  drawAvailableTowers() {
    let i = 0;
    for (let x = 9; x <= 10 && i < this.availableTowers.length; x++) {
      this.context.beginPath();
      CellDimensions.HEIGHT;
      if (
        collision(this.mouse, {
          x: x * CellDimensions.WIDTH,
          y: CellDimensions.HEIGHT,
          width: CellDimensions.WIDTH,
          height: CellDimensions.HEIGHT,
        })
      ) {
        this.context.strokeRect(
          x * CellDimensions.WIDTH,
          CellDimensions.HEIGHT,
          CellDimensions.WIDTH,
          CellDimensions.HEIGHT
        );
      }
      this.context.drawImage(
        this.availableTowers[i],
        x * CellDimensions.WIDTH,
        CellDimensions.HEIGHT,
        CellDimensions.WIDTH,
        CellDimensions.HEIGHT
      );
      this.context.closePath();
      i++;
    }
  }

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
