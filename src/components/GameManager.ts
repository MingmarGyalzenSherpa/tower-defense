import { CanvasDimension, GameState } from "../constants/constants";
import Level1 from "./Level1";
import Mouse from "./Mouse";
import StartBtnImg from "../assets/start-btn.png";
import collision from "../utils/utils";
import LevelBg from "../assets/levelBackground.png";
export default class GameManager {
  levels: { x?: number; y?: number; width?: number; height?: number }[];
  levelBg: CanvasImageSource;
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  curLevel?: any;
  startBtn: {
    x: number;
    y: number;
    width: number;
    height: number;
    img?: CanvasImageSource;
  };
  gameState: GameState;
  mouse: Mouse;
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.mouse = new Mouse();
    this.context.fillStyle = "black";
    this.gameState = GameState.PLAYING;
    this.startBtn = {
      x: CanvasDimension.WIDTH / 2.5,
      y: CanvasDimension.HEIGHT / 2.5,
      width: 200,
      height: 100,
    };
    this.startBtn.img = new Image();
    this.startBtn.img.src = StartBtnImg;
    this.levels = [];
    for (let i = 0; i < 3; i++) {
      this.levels.push({});
    }
    this.levelBg = new Image();
    this.levelBg.src = LevelBg;
    this.curLevel = new Level1(this.canvas, this.context);
    requestAnimationFrame(this.start);
    canvas.addEventListener("mousemove", this.handleMouseMove);
    canvas.addEventListener("click", this.handleClick);
  }

  handleMouseMove = (e: MouseEvent) => {
    if (this.gameState === GameState.PLAYING) return;
    this.mouse.x = e.offsetX;
    this.mouse.y = e.offsetY;
  };

  handleClick = () => {
    this.clickStartBtn();
  };

  clickStartBtn() {
    if (
      collision(this.mouse, this.startBtn) &&
      this.gameState === GameState.WAITING
    ) {
      this.gameState = GameState.MENU;
    }
  }

  start = () => {
    this.draw();
    this.update();
    requestAnimationFrame(this.start);
  };

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    switch (this.gameState) {
      case GameState.WAITING:
        //menu render
        this.renderWaitingState();
        break;

      case GameState.MENU:
        this.renderMenuState();
        break;
      case GameState.PLAYING:
        this.renderRunningState();
        break;
      case GameState.PAUSED:
        break;
      case GameState.OVER:
        break;
    }
  }

  renderWaitingState() {
    this.context.beginPath();
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, CanvasDimension.WIDTH, CanvasDimension.HEIGHT);
    this.context.closePath();

    this.context.beginPath();
    this.context.drawImage(
      this.startBtn.img!,
      this.startBtn.x,
      this.startBtn.y,
      this.startBtn.width,
      this.startBtn.height
    );
  }

  renderMenuState() {
    //draw black background
    this.context.beginPath();
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, CanvasDimension.WIDTH, CanvasDimension.HEIGHT);
    this.context.closePath();
    let x = 20,
      y = 100,
      gap = 100,
      width = 200,
      height = 100;
    for (let i = 0; i < this.levels.length; i++) {
      this.context.beginPath();
      this.context.fillStyle = "green";
      this.levels[i].x = x + (width + gap) * i;
      this.levels[i].y = y;
      this.levels[i].width = width;
      this.levels[i].height = height;
      // this.context.drawImage(
      //   this.levelBg,
      //   this.levels[i].x,
      //   this.levels[i].y,
      //   this.levels[i].width,
      //   this.levels[i].height
      // );
      this.context.font = "20px Audiowide";
      this.context.fillStyle = "black";
      this.context.fillText(
        `${i === this.levels.length - 1 ? "Wave mode" : `Level ${i + 1}`}`,
        x + 50 + (width + gap) * i,
        y + 50
      );
      this.context.closePath();
    }
  }

  renderRunningState() {
    this.curLevel.draw();
  }

  collision() {
    if (this.gameState !== GameState.PLAYING) return;
  }
  update() {
    switch (this.gameState) {
      case GameState.PLAYING:
        this.curLevel.update();
        break;
    }
  }
}
