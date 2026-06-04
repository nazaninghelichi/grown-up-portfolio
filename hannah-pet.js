const SCALE = 5;

const PAL = {
  '.': null,
  'C': '#F0DEB8',
  'G': '#D4A060',
  'D': '#9B6830',
  'E': '#4A8E28',
  'K': '#1A1A1A',
  'R': '#CC2222',
  'N': '#C07060',
};

const WALK = [
  [
    '...GGGGG....',
    '..GCGCGCG...',
    '.GCCEKCKCG..',
    '.GCCC.NCGG..',
    '..RRRRRR....',
    '.GCCCCCGG...',
    'GCCCCCCCGG..',
    'GCCCCCCCGG..',
    '..GG...GG...',
    '..GG...GG...',
    '..DD...DD...',
  ],
  [
    '...GGGGG....',
    '..GCGCGCG...',
    '.GCCEKCKCG..',
    '.GCCC.NCGG..',
    '..RRRRRR....',
    '.GCCCCCGG...',
    'GCCCCCCCGG..',
    'GCCCCCCCGG..',
    '...GG...GG..',
    '...GG...GG..',
    '...DD...DD..',
  ],
];

const SLEEP = [
  '....GGGGG.......',
  '...GCGCGCGGGGGGG',
  '..GCKK.NRRRCCCCG',
  '..GCCCCCCCCCCCCG',
  '...GGGGGGGGGGGGG',
  '....GG.......GG.',
  '....DD.......DD.',
];

function drawSprite(ctx, grid, ox, oy, flip) {
  const cols = grid[0].length;
  grid.forEach((row, ri) => {
    for (let ci = 0; ci < row.length; ci++) {
      const color = PAL[row[ci]];
      if (!color) continue;
      const px = flip ? (cols - 1 - ci) : ci;
      ctx.fillStyle = color;
      ctx.fillRect(ox + px * SCALE, oy + ri * SCALE, SCALE, SCALE);
    }
  });
}

class Dog {
  constructor(x, canvasH) {
    this.x = x;
    this.canvasH = canvasH;
    this.vx = (Math.random() > 0.5 ? 1 : -1) * (0.7 + Math.random() * 0.8);
    this.facing = this.vx > 0 ? 1 : -1;
    this.animFrame = 0;
    this.animTick = 0;
    this.state = 'walking';
    this.stateTick = Math.floor(Math.random() * 180); // stagger so not all sleep at once
    this.stateDuration = 180 + Math.floor(Math.random() * 200);
    this.popup = null;
    this.popupTick = 0;
    this.shaking = 0;
    this.flipped = false;
  }

  click() {
    this.popup = ['👀', '!!', 'hey!', 'ow', '???', 'stop'][Math.floor(Math.random() * 6)];
    this.popupTick = 80;
    this.shaking = 20;
    // 30% chance she flips upside down briefly
    if (Math.random() < 0.3) {
      this.flipped = true;
      setTimeout(() => this.flipped = false, 1200);
    }
  }

  update(canvasW) {
    if (this.animTick++ >= 14) { this.animFrame ^= 1; this.animTick = 0; }
    if (this.popupTick > 0) this.popupTick--;
    if (this.shaking > 0) this.shaking--;

    this.stateTick++;
    if (this.stateTick >= this.stateDuration) {
      this.stateTick = 0;
      this.state = this.state === 'walking' ? 'sleeping' : 'walking';
      this.stateDuration = 150 + Math.floor(Math.random() * 200);
      if (this.state === 'walking') {
        this.vx = (Math.random() > 0.5 ? 1 : -1) * (0.7 + Math.random() * 0.8);
        this.facing = this.vx > 0 ? 1 : -1;
      }
    }

    if (this.state === 'walking') {
      this.x += this.vx;
      if (this.x > canvasW - 12 * SCALE - 8) { this.x = canvasW - 12 * SCALE - 8; this.vx = -Math.abs(this.vx); this.facing = -1; }
      if (this.x < 8) { this.x = 8; this.vx = Math.abs(this.vx); this.facing = 1; }
    }
  }

  draw(ctx, ground) {
    const shakeX = this.shaking > 0 ? (Math.random() * 6 - 3) : 0;
    const ox = this.x + shakeX;

    ctx.save();
    if (this.flipped) {
      const cx = ox + 6 * SCALE;
      const cy = ground - 5 * SCALE;
      ctx.translate(cx, cy);
      ctx.scale(1, -1);
      ctx.translate(-cx, -cy);
    }

    if (this.state === 'sleeping') {
      const h = SLEEP.length * SCALE;
      drawSprite(ctx, SLEEP, ox, ground - h, this.facing === -1);
      // zzz
      const t = Date.now() / 1000;
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#B0A090';
      const zx = this.facing === 1 ? ox + 4 * SCALE : ox + 10 * SCALE;
      ctx.fillText('z', zx, ground - SLEEP.length * SCALE - 4 + Math.sin(t) * 2);
      ctx.font = '7px monospace';
      ctx.fillText('z', zx + 8, ground - SLEEP.length * SCALE - 13 + Math.sin(t + 1) * 2);
    } else {
      const frame = WALK[this.animFrame];
      const h = frame.length * SCALE;
      drawSprite(ctx, frame, ox, ground - h, this.facing === -1);
    }

    ctx.restore();

    // Popup
    if (this.popupTick > 0 && this.popup) {
      const frame = this.state === 'walking' ? WALK[0] : SLEEP;
      const dogH = frame.length * SCALE;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#333';
      ctx.fillText(this.popup, ox + 2 * SCALE, ground - dogH - 8);
    }
  }

  hitTest(cx, cy, ground) {
    const frame = this.state === 'walking' ? WALK[0] : SLEEP;
    const h = frame.length * SCALE;
    const w = frame[0].length * SCALE;
    return cx >= this.x && cx <= this.x + w && cy >= ground - h && cy <= ground;
  }
}

class HannahWorld {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'position:fixed;bottom:0;left:0;width:100%;height:110px;z-index:9999;pointer-events:auto;image-rendering:pixelated';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.dogs = [];
    this.resize();
    this.spawnDog();

    // New Hannah every 30 seconds
    setInterval(() => this.spawnDog(), 30000);

    this.canvas.addEventListener('click', e => {
      const rect = this.canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const ground = this.canvas.height - 2;
      let hit = false;
      this.dogs.forEach(dog => {
        if (dog.hitTest(cx, cy, ground)) {
          dog.click();
          // Spawn 2 more on click (max 25)
          if (this.dogs.length < 25) this.spawnDog();
          if (this.dogs.length < 25) this.spawnDog();
          hit = true;
        }
      });
    });

    window.addEventListener('resize', () => this.resize());
    this.loop();
  }

  spawnDog() {
    const x = 20 + Math.random() * (this.canvas.width - 100);
    this.dogs.push(new Dog(x, this.canvas.height));
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = 110;
  }

  loop() {
    const { ctx } = this;
    const ground = this.canvas.height - 2;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.dogs.forEach(d => { d.update(this.canvas.width); d.draw(ctx, ground); });
    requestAnimationFrame(() => this.loop());
  }
}

document.addEventListener('DOMContentLoaded', () => new HannahWorld());
