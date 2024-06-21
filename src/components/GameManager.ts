import { CanvasDimension, GameState } from "../constants/constants";
import Level1 from "./Level1";
import Mouse from "./Mouse";
import StartBtnImg from "../assets/start-btn.png";
export default class GameManager {
  levels: number[];
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  curLevel?: any;
  startBtnImg: CanvasImageSource;
  gameState: GameState;
  mouse: Mouse;
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.mouse = new Mouse();
    this.context.fillStyle = "black";
    this.gameState = GameState.WAITING;
    this.startBtnImg = new Image();
    this.startBtnImg.src = StartBtnImg;
    this.levels = [1, 2, 3];
    this.curLevel = new Level1(this.canvas, this.context);
    requestAnimationFrame(this.start);
    canvas.addEventListener("mousemove", this.handleMouseMove);
  }

  handleMouseMove = (e: MouseEvent) => {
    if (this.gameState === GameState.PLAYING) return;
    this.mouse.x = e.offsetX;
    this.mouse.y = e.offsetY;
  };

  handleClick = () => {};

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
    let x = CanvasDimension.WIDTH / 2.5;
    let y = CanvasDimension.HEIGHT / 2.5;
    this.context.beginPath();
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, CanvasDimension.WIDTH, CanvasDimension.HEIGHT);
    this.context.closePath();

    this.context.beginPath();
    this.context.drawImage(this.startBtnImg, x, y, 200, 100);
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
