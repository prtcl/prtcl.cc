
export const color = (r: number, g: number, b: number, a = 255) => `rgba(${r}, ${g}, ${b}, ${a})`;

type ColorArgs = Parameters<typeof color>;

export const clear = (context: CanvasRenderingContext2D) => (width: number, height: number) => {
  context.clearRect(0, 0, width, height);
};

export const alpha = (context: CanvasRenderingContext2D) => (alpha: number) => {
  context.globalAlpha = alpha;
};

export const fill = (context: CanvasRenderingContext2D) => (...args: ColorArgs) => {
  context.fillStyle = color(...args);
};

export const strokeWeight = (context: CanvasRenderingContext2D) => (width: number) => {
  context.lineWidth = Math.max(width, 0.0001);
};

export const stroke = (context: CanvasRenderingContext2D) => (...args: ColorArgs) => {
  context.strokeStyle = color(...args);
};

export const rect = (context: CanvasRenderingContext2D) => (x: number, y: number, width: number, height: number) => {
  context.fillRect(x, y, width, height);
};
