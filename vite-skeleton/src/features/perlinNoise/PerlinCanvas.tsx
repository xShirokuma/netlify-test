import React, { useRef, useEffect, useState } from 'react';
import { Perlin3D } from './perlin';
import {
  PERLIN_CANVAS_WIDTH as WIDTH,
  PERLIN_CANVAS_HEIGHT as HEIGHT,
  PERLIN_NOISE_SCALE as SCALE,
  PERLIN_Z_INCREMENT,
  PERLIN_SEED
} from './config';

export const PerlinCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);
  const perlinRef = useRef(new Perlin3D(PERLIN_SEED));
  const zRef = useRef(0);
  const frameRef = useRef<number | null>(null);

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

  const animate = () => {
    zRef.current += PERLIN_Z_INCREMENT;
    draw(zRef.current);
    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (playing) {
      frameRef.current = requestAnimationFrame(animate);
    } else if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
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
