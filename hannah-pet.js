class HannahPet {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'position:fixed;bottom:0;left:0;width:100%;height:110px;z-index:9999;pointer-events:none';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.x = 200;
    this.vx = 1.2;
    this.facing = 1;
    this.frame = 0;
    this.frameTick = 0;
    this.state = 'walking';
    this.stateTick = 0;
    this.stateDuration = 200;
    this.bobTick = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = 110;
  }

  update() {
    this.bobTick += 0.1;
    this.frameTick++;
    if (this.frameTick >= 10) { this.frame = (this.frame + 1) % 4; this.frameTick = 0; }

    this.stateTick++;
    if (this.stateTick >= this.stateDuration) {
      this.stateTick = 0;
      if (this.state === 'walking') {
        this.state = 'sleeping';
        this.stateDuration = 180 + Math.floor(Math.random() * 200);
      } else {
        this.state = 'walking';
        this.stateDuration = 160 + Math.floor(Math.random() * 180);
        this.vx = (Math.random() > 0.5 ? 1 : -1) * (0.9 + Math.random() * 0.6);
        if (this.vx > 0) this.facing = 1; else this.facing = -1;
      }
    }

    if (this.state === 'walking') {
      this.x += this.vx;
      const maxX = this.canvas.width - 60;
      if (this.x > maxX) { this.x = maxX; this.vx = -Math.abs(this.vx); this.facing = -1; }
      if (this.x < 60) { this.x = 60; this.vx = Math.abs(this.vx); this.facing = 1; }
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const groundY = this.canvas.height - 12;
    const bob = this.state === 'walking' ? Math.sin(this.bobTick * 2) * 1.5 : 0;
    this.drawHannah(this.x, groundY + bob);
  }

  drawHannah(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    if (this.facing === -1) ctx.scale(-1, 1);

    const cream = '#F2DFB6';
    const golden = '#D4A262';
    const dark = '#A87840';
    const sleeping = this.state === 'sleeping';
    const legSwing = !sleeping ? Math.sin(this.frame * Math.PI / 2) * 10 : 0;

    // Tail wag
    const tailWag = Math.sin(this.bobTick * (sleeping ? 0.5 : 3)) * (sleeping ? 5 : 15);
    ctx.save();
    ctx.translate(-22, -20);
    ctx.rotate((tailWag * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-8, -16, -4, -30);
    ctx.strokeStyle = golden;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-4, -30, 7, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();
    ctx.restore();

    // Legs
    if (sleeping) {
      [[-10, 0], [0, 0], [10, 0], [20, 0]].forEach(([lx]) => {
        ctx.beginPath();
        ctx.roundRect(lx - 3, 2, 7, 8, 3);
        ctx.fillStyle = golden;
        ctx.fill();
      });
    } else {
      [[-14, legSwing], [-4, -legSwing], [6, -legSwing], [16, legSwing]].forEach(([lx, swing]) => {
        ctx.save();
        ctx.translate(lx, -4);
        ctx.rotate((swing * Math.PI) / 180);
        ctx.beginPath();
        ctx.roundRect(-3, 0, 7, 17, 3);
        ctx.fillStyle = golden;
        ctx.fill();
        ctx.restore();
      });
    }

    // Body
    ctx.beginPath();
    ctx.ellipse(2, sleeping ? -10 : -18, 26, sleeping ? 12 : 16, sleeping ? 0.15 : 0, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();

    // Body curls
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(-20 + i * 6, (sleeping ? -14 : -22) + Math.sin(i * 1.4) * 6, 5, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#EDD5A0' : cream;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.ellipse(2, sleeping ? -10 : -18, 20, sleeping ? 8 : 11, sleeping ? 0.15 : 0, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();

    // Red collar
    ctx.beginPath();
    ctx.roundRect(-12, sleeping ? -4 : -12, 26, 5, 2);
    ctx.fillStyle = '#CC2222';
    ctx.fill();

    // Head position changes when sleeping
    const hx = sleeping ? -5 : 18;
    const hy = sleeping ? -16 : -36;

    // Ears
    ctx.beginPath();
    ctx.ellipse(hx - 10, hy - 10, 7, 12, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = golden;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(hx + 10, hy - 10, 7, 12, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = golden;
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(hx, hy, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#EDD5A0';
    ctx.fill();

    // Head curls
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(hx + Math.cos(a) * 13, hy + Math.sin(a) * 13, 6, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#EDD5A0' : cream;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(hx, hy, 11, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();

    // Eyes
    if (sleeping) {
      [hx - 4, hx + 4].forEach(ex => {
        ctx.beginPath();
        ctx.arc(ex, hy + 1, 3, Math.PI + 0.4, Math.PI * 2 - 0.4);
        ctx.strokeStyle = dark;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      });
      // zzz
      ctx.fillStyle = dark;
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('z', hx + 14, hy - 14);
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('z', hx + 20, hy - 22);
      ctx.font = 'bold 5px sans-serif';
      ctx.fillText('z', hx + 25, hy - 28);
    } else {
      [hx - 4, hx + 4].forEach(ex => {
        ctx.beginPath();
        ctx.arc(ex, hy - 1, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#5BA33A';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex, hy - 1, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#111';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex + 1, hy - 2, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      });
    }

    // Nose
    ctx.beginPath();
    ctx.ellipse(hx, hy + 5, 4, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#C87070';
    ctx.fill();

    ctx.restore();
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }
}

document.addEventListener('DOMContentLoaded', () => new HannahPet());
