export const distL2 = (
  a: CanvasCoords | WorldCoords,
  b: CanvasCoords | WorldCoords
): number => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

export const vectorLength = (a: CanvasCoords | WorldCoords): number =>
  Math.sqrt(a.x ** 2 + a.y ** 2);
