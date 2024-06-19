import { GameState } from "../constants/constants";
import Level1 from "./Level1";

export default class GameManager {
  levels: number[];
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  curLevel?: any;
  gameState: GameState;
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.context.fillStyle = "black";
    this.gameState = GameState.PLAYING;
    this.levels = [1, 2, 3];
    this.curLevel = new Level1(this.canvas, this.context);
    requestAnimationFrame(this.start);
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

  renderRunningState() {
    this.curLevel.draw();
  }

  collision() {
    if (this.gameState !== GameState.PLAYING) return;
  }
sfsff
  update() {
    if (!this.curLevel) return;
    this.curLevel.update();
  }
}
