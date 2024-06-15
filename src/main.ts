import GameManager from "./components/GameManager";
import { CanvasDimension } from "./constants/constants";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

canvas.width = CanvasDimension.WIDTH;
canvas.height = CanvasDimension.HEIGHT;

const context = canvas.getContext("2d");
new GameManager(context!);
