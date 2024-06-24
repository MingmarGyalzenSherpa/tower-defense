import { CanvasDimension, GameState } from "../constants/constants";
import Level1 from "./Level1";
import Mouse from "./Mouse";
import StartBtnImg from "../assets/start-btn.png";
import collision from "../utils/utils";
import LevelBg from "../assets/levelBackground.png";
import WaveMode from "./WaveMode";
export default class GameManager {
  levels: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    color: string;
  }[];
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

  resumeBtn?: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  };

  quitBtn?: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  };
  gameState: GameState;
  mouse: Mouse;
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.mouse = new Mouse();
    this.context.fillStyle = "black";
    this.gameState = GameState.WAITING;
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
      this.levels.push({
        x: undefined,
        y: undefined,
        width: undefined,
        height: undefined,
        color: "white",
      });
    }
    this.resumeBtn = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      color: "white",
    };
    this.quitBtn = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      color: "white",
    };
    this.levelBg = new Image();
    this.levelBg.src = LevelBg;
    this.curLevel = new Level1(this.canvas, this.context);
    requestAnimationFrame(this.start);
    canvas.addEventListener("mousemove", this.handleMouseMove);
    canvas.addEventListener("click", this.handleClick);

    document.addEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress = (e: KeyboardEvent) => {
    //pause game
    switch (e.code) {
      case "Escape":
        if (
          this.gameState != GameState.PAUSED &&
          this.gameState != GameState.PLAYING
        )
          break;
        this.gameState =
          this.gameState === GameState.PAUSED
            ? GameState.PLAYING
            : GameState.PAUSED;
        break;
    }
  };

  handleMouseMove = (e: MouseEvent) => {
    if (this.gameState === GameState.PLAYING) return;
    this.mouse.x = e.offsetX;
    this.mouse.y = e.offsetY;

    if (this.gameState === GameState.MENU) {
      for (let i = 0; i < this.levels.length; i++) {
        const levelTextRect = {
          x: this.levels[i].x!,
          y: this.levels[i].y!,
          width: this.levels[i].width!,
          height: this.levels[i].height!,
        };
        if (collision(this.mouse, levelTextRect)) {
          this.levels[i].color = "green";
        } else {
          this.levels[i].color = "white";
        }
      }
    }

    if (this.gameState === GameState.PAUSED) {
      if (collision(this.mouse, this.resumeBtn!)) {
        this.resumeBtn!.color = "green";
      } else {
        this.resumeBtn!.color = "white";
      }

      if (collision(this.mouse, this.quitBtn!)) {
        this.quitBtn!.color = "red";
      } else {
        this.quitBtn!.color = "white";
      }
    }
  };

  handleClick = () => {
    this.clickStartBtn();
    this.handleMenuClick();
    this.handlePausedClick();
  };

  handlePausedClick() {
    if (this.gameState != GameState.PAUSED) return;
    if (collision(this.mouse, this.resumeBtn!)) {
      this.gameState = GameState.PLAYING;
    }

    if (collision(this.mouse, this.quitBtn!)) {
      this.gameState = GameState.MENU;
    }
  }

  renderPausedState() {
    this.context.beginPath();
    this.context.fillStyle = "black";
    this.context.globalAlpha = 0.1;
    this.context.fillRect(0, 0, CanvasDimension.WIDTH, CanvasDimension.HEIGHT);
    this.context.fillStyle = "white";
    this.context.font = "20px Audiowide";
    let btnOffsetX = 100;
    let resumeBtnOffsetY = 100;
    this.resumeBtn = {
      ...this.resumeBtn!,
      x: CanvasDimension.WIDTH / 2 - btnOffsetX,
      y: CanvasDimension.HEIGHT / 2 - resumeBtnOffsetY,
      width: 100,
      height: 40,
    };
    this.quitBtn = {
      ...this.quitBtn!,
      x: CanvasDimension.WIDTH / 2 - btnOffsetX,
      y: this.resumeBtn.y + this.resumeBtn.height,
      width: 100,
      height: 40,
    };

    this.context.textAlign = "center";
    //draw resume button

    let textOffsetY = 20;
    this.context.fillStyle = this.resumeBtn.color;

    this.context.fillText(
      "RESUME",
      this.resumeBtn.x + this.resumeBtn.width / 2,
      this.resumeBtn.y + textOffsetY,
      this.resumeBtn.width
    );

    this.context.fillStyle = this.quitBtn.color;

    //draw quite button

    this.context.fillText(
      "QUIT",
      this.quitBtn.x + this.quitBtn.width / 2,
      this.quitBtn.y + textOffsetY,
      this.quitBtn.width
    );
    this.context.textAlign = "start";
    this.context.globalAlpha = 1;
  }

  handleMenuClick() {
    if (this.gameState !== GameState.MENU) return;
    for (let i = 0; i < this.levels.length; i++) {
      if (
        collision(this.mouse, {
          x: this.levels[i].x!,
          y: this.levels[i].y!,
          width: this.levels[i].width!,
          height: this.levels[i].height!,
        })
      ) {
        switch (i) {
          case 0:
            this.curLevel = new Level1(this.canvas, this.context);
            this.gameState = GameState.PLAYING;
            break;

          case 1:
            break;

          case 2:
            this.curLevel = new WaveMode(this.canvas, this.context);
            this.gameState = GameState.PLAYING;
            break;
        }
      }
    }
  }

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
    // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
        this.renderPausedState();
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
      this.levels[i].x = x + (width + gap) * i;
      this.levels[i].y = y;
      this.levels[i].width = width;
      this.levels[i].height = height;

      this.context.font = "20px Audiowide";
      this.context.fillStyle = this.levels[i].color;
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
