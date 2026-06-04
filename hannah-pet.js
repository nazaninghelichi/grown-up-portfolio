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
    if (this.state === 'sleeping') {
      this.drawSleeping(x, y);
    } else {
      this.drawWalking(x, y);
    }
  }

  drawSleeping(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    if (this.facing === -1) ctx.scale(-1, 1);

    const cream = '#F2DFB6';
    const golden = '#D4A262';
    const dark = '#A87840';

    // Legs stretched out front
    ctx.beginPath();
    ctx.roundRect(18, -8, 28, 7, 4);
    ctx.fillStyle = golden;
    ctx.fill();

    // Body — wide flat ellipse lying down
    ctx.beginPath();
    ctx.ellipse(0, -12, 32, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();

    // Fluffy body curls on top
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.arc(-28 + i * 7, -17 + Math.sin(i * 1.2) * 3, 5, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#EDD5A0' : cream;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.ellipse(0, -13, 26, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();

    // Tail curled behind body
    const tailWag = Math.sin(this.bobTick * 0.4) * 6;
    ctx.save();
    ctx.translate(-30, -8);
    ctx.rotate((tailWag * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-10, -12, -6, -22);
    ctx.strokeStyle = golden;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-6, -22, 6, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();
    ctx.restore();

    // Head resting flat — to the right, chin on paws
    const hx = 28, hy = -14;

    // Ear flopped down
    ctx.beginPath();
    ctx.ellipse(hx + 2, hy + 6, 10, 6, 0.3, 0, Math.PI * 2);
    ctx.fillStyle = golden;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(hx - 2, hy - 10, 6, 10, -0.1, 0, Math.PI * 2);
    ctx.fillStyle = golden;
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(hx, hy, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#EDD5A0';
    ctx.fill();

    // Fluffy head
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(hx + Math.cos(a) * 11, hy + Math.sin(a) * 11, 5, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#EDD5A0' : cream;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(hx, hy, 10, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();

    // Closed eyes
    [hx - 4, hx + 4].forEach(ex => {
      ctx.beginPath();
      ctx.arc(ex, hy - 1, 3, Math.PI + 0.5, Math.PI * 2 - 0.5);
      ctx.strokeStyle = dark;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    });

    // Nose
    ctx.beginPath();
    ctx.ellipse(hx, hy + 5, 3.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#C87070';
    ctx.fill();

    // Collar
    ctx.beginPath();
    ctx.roundRect(hx - 12, hy + 8, 22, 5, 2);
    ctx.fillStyle = '#CC2222';
    ctx.fill();

    // zzz
    ctx.fillStyle = dark;
    ctx.textAlign = 'left';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('z', hx + 16, hy - 16);
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('z', hx + 22, hy - 26);
    ctx.font = 'bold 6px sans-serif';
    ctx.fillText('z', hx + 27, hy - 34);

    ctx.restore();
  }

  drawWalking(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    if (this.facing === -1) ctx.scale(-1, 1);

    const cream = '#F2DFB6';
    const golden = '#D4A262';
    const dark = '#A87840';
    const legSwing = Math.sin(this.frame * Math.PI / 2) * 10;

    // Tail
    const tailWag = Math.sin(this.bobTick * 3) * 18;
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

    // Body
    ctx.beginPath();
    ctx.ellipse(2, -18, 26, 16, 0, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();

    // Body curls
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(-20 + i * 6, -22 + Math.sin(i * 1.4) * 6, 5, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#EDD5A0' : cream;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.ellipse(2, -18, 20, 11, 0, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();

    // Collar
    ctx.beginPath();
    ctx.roundRect(-12, -12, 26, 5, 2);
    ctx.fillStyle = '#CC2222';
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.ellipse(10, -48, 7, 12, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = golden;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(28, -48, 7, 12, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = golden;
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(18, -38, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#EDD5A0';
    ctx.fill();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(18 + Math.cos(a) * 13, -38 + Math.sin(a) * 13, 6, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#EDD5A0' : cream;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(18, -38, 11, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();

    // Eyes
    [14, 22].forEach(ex => {
      ctx.beginPath();
      ctx.arc(ex, -39, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#5BA33A';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex, -39, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#111';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex + 1, -40, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    });

    // Nose
    ctx.beginPath();
    ctx.ellipse(18, -33, 4, 3, 0, 0, Math.PI * 2);
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
