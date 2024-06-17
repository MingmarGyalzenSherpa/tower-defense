interface IObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function collision(first: IObject, second: IObject) {
  return (
    first.x < second.x + second.width &&
    first.x + first.width > second.x &&
    first.y < second.y + second.height &&
    first.y + first.height > second.y
  );
}
