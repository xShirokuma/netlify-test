export class Perlin3D {
  private grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
  ];
  private perm: number[];

  constructor(seed = 0) {
    this.perm = this.buildPermutation(seed);
  }

  private buildPermutation(seed: number): number[] {
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) {
      const j = (Math.floor(this.random(seed + i) * (i + 1))) % 256;
      [p[i], p[j]] = [p[j], p[i]];
    }
    return p.concat(p);
  }

  private random(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number, z: number): number {
    const [gx, gy, gz] = this.grad3[hash % 12];
    return gx * x + gy * y + gz * z;
  }

  noise(x: number, y: number, z: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);

    const u = this.fade(xf);
    const v = this.fade(yf);
    const w = this.fade(zf);

    const A = this.perm[X] + Y;
    const AA = this.perm[A] + Z;
    const AB = this.perm[A + 1] + Z;
    const B = this.perm[X + 1] + Y;
    const BA = this.perm[B] + Z;
    const BB = this.perm[B + 1] + Z;

    const x1 = this.lerp(
      this.grad(this.perm[AA], xf, yf, zf),
      this.grad(this.perm[BA], xf - 1, yf, zf),
      u
    );
    const x2 = this.lerp(
      this.grad(this.perm[AB], xf, yf - 1, zf),
      this.grad(this.perm[BB], xf - 1, yf - 1, zf),
      u
    );
    const y1 = this.lerp(x1, x2, v);

    const x3 = this.lerp(
      this.grad(this.perm[AA + 1], xf, yf, zf - 1),
      this.grad(this.perm[BA + 1], xf - 1, yf, zf - 1),
      u
    );
    const x4 = this.lerp(
      this.grad(this.perm[AB + 1], xf, yf - 1, zf - 1),
      this.grad(this.perm[BB + 1], xf - 1, yf - 1, zf - 1),
      u
    );
    const y2 = this.lerp(x3, x4, v);

    return (this.lerp(y1, y2, w) + 1) / 2;
  }
}
