class HannahPet {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = [
      'position:fixed', 'bottom:0', 'left:0', 'width:100%', 'height:100px',
      'z-index:9999', 'pointer-events:none', 'image-rendering:pixelated'
    ].join(';');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.S = 5; // pixels per pixel

    // Color palette
    this.PAL = {
      '.': null,
      'C': '#F0DEB8', // cream
      'G': '#D4A060', // golden
      'D': '#9B6830', // dark paw
      'E': '#4A8E28', // eye green
      'K': '#1A1A1A', // pupil / eye line
      'R': '#CC2222', // collar
      'N': '#C07060', // nose
    };

    // Walking sprite: 12 wide x 11 tall, 2 frames
    // Side view, facing right
    this.WALK = [
      [
        '...GGGGG....',
        '..GCGCGCG...',
        '.GCCEKCKCG..',  // E=green iris, K=pupil
        '.GCCC.NCGG..',  // N=nose
        '..RRRRRR....',  // collar
        '.GCCCCCGG...',
        'GCCCCCCCGG..',
        'GCCCCCCCGG..',
        '..GG...GG...',  // legs
        '..GG...GG...',
        '..DD...DD...',  // paws
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
        '...GG...GG..',  // legs shifted slightly
        '...GG...GG..',
        '...DD...DD..',
      ],
    ];

    // Sleeping sprite: 16 wide x 7 tall (dog laid flat)
    this.SLEEP = [
      '....GGGGG.......',
      '...GCGCGCGGGGGGG',  // head + body
      '..GCKK.NRRRCCCCG',  // closed eyes (KK), nose, collar, body
      '..GCCCCCCCCCCCCG',  // body
      '...GGGGGGGGGGGGG',  // bottom
      '....GG.......GG.',  // legs
      '....DD.......DD.',  // paws
    ];

    this.x = 160;
    this.vx = 1.0;
    this.facing = 1;
    this.animFrame = 0;
    this.animTick = 0;
    this.state = 'walking';
    this.stateTick = 0;
    this.stateDuration = 220;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = 100;
  }

  update() {
    // Animate walk frames
    if (this.state === 'walking') {
      this.animTick++;
      if (this.animTick >= 14) { this.animFrame ^= 1; this.animTick = 0; }
    }

    // State transitions
    this.stateTick++;
    if (this.stateTick >= this.stateDuration) {
      this.stateTick = 0;
      if (this.state === 'walking') {
        this.state = 'sleeping';
        this.stateDuration = 200 + Math.floor(Math.random() * 220);
      } else {
        this.state = 'walking';
        this.stateDuration = 160 + Math.floor(Math.random() * 200);
        this.vx = (Math.random() > 0.5 ? 1 : -1) * (0.7 + Math.random() * 0.6);
        this.facing = this.vx > 0 ? 1 : -1;
      }
    }

    // Move when walking
    if (this.state === 'walking') {
      this.x += this.vx;
      const walkW = 12 * this.S;
      if (this.x > this.canvas.width - walkW - 8) {
        this.x = this.canvas.width - walkW - 8;
        this.vx = -Math.abs(this.vx);
        this.facing = -1;
      }
      if (this.x < 8) {
        this.x = 8;
        this.vx = Math.abs(this.vx);
        this.facing = 1;
      }
    }
  }

  drawSprite(grid, ox, oy, flip) {
    const S = this.S;
    const cols = grid[0].length;
    grid.forEach((row, ri) => {
      for (let ci = 0; ci < row.length; ci++) {
        const color = this.PAL[row[ci]];
        if (!color) continue;
        const px = flip ? (cols - 1 - ci) : ci;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(ox + px * S, oy + ri * S, S, S);
      }
    });
  }

  draw() {
    const { ctx, S } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const ground = this.canvas.height - 2;

    if (this.state === 'sleeping') {
      const h = this.SLEEP.length * S;
      const oy = ground - h;
      this.drawSprite(this.SLEEP, this.x, oy, this.facing === -1);

      // Floating zzz above head
      const t = Date.now() / 1000;
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#B0A090';
      const zx = this.facing === 1 ? this.x + 4 * S : this.x + 10 * S;
      ctx.fillText('z', zx, oy - 4 + Math.sin(t) * 2);
      ctx.font = 'bold 7px monospace';
      ctx.fillText('z', zx + 8, oy - 13 + Math.sin(t + 1) * 2);
      ctx.font = 'bold 5px monospace';
      ctx.fillText('z', zx + 14, oy - 20 + Math.sin(t + 2) * 2);
    } else {
      const frame = this.WALK[this.animFrame];
      const h = frame.length * S;
      const oy = ground - h;
      this.drawSprite(frame, this.x, oy, this.facing === -1);
    }
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }
}

document.addEventListener('DOMContentLoaded', () => new HannahPet());
