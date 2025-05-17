import React, { useRef, useEffect, useState } from 'react';
import { Perlin3D } from './perlin';
import { PERLIN_CANVAS_WIDTH, PERLIN_CANVAS_HEIGHT, PERLIN_CANVAS_SCALE } from './config';

const WIDTH = PERLIN_CANVAS_WIDTH;
const HEIGHT = PERLIN_CANVAS_HEIGHT;
const SCALE = PERLIN_CANVAS_SCALE;

export const PerlinCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);
  const perlinRef = useRef(new Perlin3D(42));
  const zRef = useRef(0);
  useEffect(() => {
    let animationFrame: number;

    const draw = (z: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      const imageData = ctx.createImageData(WIDTH, HEIGHT);
      const perlin = perlinRef.current;

      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
          const value = perlin.noise(x * SCALE, y * SCALE, z);
          const color = Math.floor(value * 255);
          const i = (y * WIDTH + x) * 4;
          imageData.data[i + 0] = color;
          imageData.data[i + 1] = color;
          imageData.data[i + 2] = color;
          imageData.data[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (playing) {
        zRef.current += 0.01; // ✅ update mutable ref
        draw(zRef.current);
        animationFrame = requestAnimationFrame(loop);
      }
    };

    if (playing) {
      animationFrame = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [playing]);

  return (
    <div>
      <div className="mb-2 space-x-2">
        <button
          onClick={() => setPlaying(p => !p)}
          className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
      </div>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
};
