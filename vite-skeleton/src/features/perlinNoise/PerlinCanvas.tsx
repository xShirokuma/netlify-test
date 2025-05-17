import React, { useRef, useEffect } from 'react';
import { Perlin2D } from './perlin';

const WIDTH = 256;
const HEIGHT = 256;
const SCALE = 0.05;

export const PerlinCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const perlin = new Perlin2D(42);
    const imageData = ctx.createImageData(WIDTH, HEIGHT);

    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const value = perlin.noise(x * SCALE, y * SCALE);
        const color = Math.floor(value * 255);
        const i = (y * WIDTH + x) * 4;
        imageData.data[i + 0] = color;
        imageData.data[i + 1] = color;
        imageData.data[i + 2] = color;
        imageData.data[i + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  return <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />;
};
