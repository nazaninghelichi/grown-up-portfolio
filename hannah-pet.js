class HannahPet {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = [
      'position:fixed', 'bottom:0', 'left:0', 'width:100%',
      'height:130px', 'z-index:9999', 'pointer-events:none'
    ].join(';');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.x = 150;
    this.vx = 1.4;
    this.facing = 1;
    this.frame = 0;
    this.frameTick = 0;

    this.state = 'walking';
    this.stateTick = 0;
    this.stateDuration = 300;

    this.speech = null;
    this.speechTick = 0;

    this.hasTeddy = true;
    this.bobOffset = 0;
    this.bobTick = 0;

    this.recruiterLines = [
      'do you know Excel? 👀',
      "salary is... competitive",
      "we'll be in touch!",
      "5+ yrs exp (entry level)",
      "fast-paced environment ✨",
      "just one more round",
      "great culture fit tho",
      "*ghosts after 3 rounds*",
      "unlimited PTO*",
      "*offer rescinded*",
    ];

    this.hypeLines = [
      'HIRE HER!! 🐾',
      'she built all this!!',
      '10/10 would deploy 🚀',
      '*aggressive tail wag*',
      'WOOF!! WOOF!!',
      'best engineer. period.',
    ];

    this.canvas.style.pointerEvents = 'auto';
    this.canvas.addEventListener('click', e => this.handleClick(e));

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = 130;
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const groundY = this.canvas.height - 14;
    if (Math.abs(cx - this.x) < 45 && Math.abs(cy - (groundY - 30)) < 45) {
      this.state = 'excited';
      this.stateDuration = 140;
      this.stateTick = 0;
      this.vx = this.facing * 4.5;
      this.say(this.hypeLines[Math.floor(Math.random() * this.hypeLines.length)], 200);
    }
  }

  say(text, duration = 180) {
    this.speech = text;
    this.speechTick = duration;
  }

  update() {
    this.frameTick++;
    if (this.frameTick >= 7) { this.frame = (this.frame + 1) % 4; this.frameTick = 0; }

    this.bobTick += 0.12;
    this.bobOffset = Math.sin(this.bobTick) * 2;

    this.stateTick++;
    if (this.stateTick >= this.stateDuration) {
      this.stateTick = 0;
      this.pickState();
    }

    if (this.state === 'walking' || this.state === 'excited') {
      this.x += this.vx;
      const maxX = this.canvas.width - 55;
      if (this.x > maxX) { this.x = maxX; this.vx = -Math.abs(this.vx); this.facing = -1; }
      if (this.x < 55) { this.x = 55; this.vx = Math.abs(this.vx); this.facing = 1; }
      if (this.vx > 0) this.facing = 1;
      if (this.vx < 0) this.facing = -1;
    }

    if (this.speechTick > 0) { this.speechTick--; if (this.speechTick === 0) this.speech = null; }
  }

  pickState() {
    const r = Math.random();
    if (r < 0.55) {
      this.state = 'walking';
      this.stateDuration = 180 + Math.floor(Math.random() * 220);
      this.vx = (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.6);
      if (this.vx > 0) this.facing = 1; else this.facing = -1;
    } else if (r < 0.78) {
      this.state = 'sitting';
      this.stateDuration = 120 + Math.floor(Math.random() * 160);
      this.vx = 0;
      const line = this.recruiterLines[Math.floor(Math.random() * this.recruiterLines.length)];
      setTimeout(() => this.say(line, 200), 600);
    } else if (r < 0.92) {
      this.state = 'sleeping';
      this.stateDuration = 160 + Math.floor(Math.random() * 180);
      this.vx = 0;
      setTimeout(() => this.say('...zzz 💤', 220), 400);
    } else {
      this.state = 'excited';
      this.stateDuration = 100;
      this.vx = this.facing * 4;
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const groundY = this.canvas.height - 14;
    if (this.speech) this.drawBubble(this.x, groundY - 68, this.speech);
    this.drawHannah(this.x, groundY + this.bobOffset);
  }

  drawHannah(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    if (this.facing === -1) ctx.scale(-1, 1);

    const cream = '#F2DFB6';
    const golden = '#D4A262';
    const darkFur = '#A87840';
    const eyeGreen = '#5BA33A';
    const nosePink = '#C87070';
    const collarRed = '#CC2222';

    const isWalking = this.state === 'walking' || this.state === 'excited';
    const legSwing = isWalking ? Math.sin(this.frame * Math.PI / 2) * 10 : 0;
    const isSleeping = this.state === 'sleeping';
    const isSitting = this.state === 'sitting';

    // Tail
    const tailWag = Math.sin(this.frame * Math.PI / 2 + this.bobTick) * (this.state === 'excited' ? 30 : 18);
    ctx.save();
    ctx.translate(-22, -22);
    ctx.rotate((tailWag * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-8, -18, -4, -34);
    ctx.strokeStyle = golden;
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-4, -34, 8, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();
    ctx.restore();

    // Legs
    if (isSitting) {
      [[8, 6], [18, 6]].forEach(([lx, ly]) => {
        ctx.beginPath();
        ctx.roundRect(lx - 4, ly, 8, 14, 4);
        ctx.fillStyle = golden;
        ctx.fill();
      });
    } else {
      [[-14, legSwing], [-4, -legSwing], [6, -legSwing], [16, legSwing]].forEach(([lx, swing]) => {
        ctx.save();
        ctx.translate(lx, -4);
        ctx.rotate((swing * Math.PI) / 180);
        ctx.beginPath();
        ctx.roundRect(-4, 0, 8, 18, 4);
        ctx.fillStyle = golden;
        ctx.fill();
        ctx.restore();
      });
    }

    // Body
    ctx.beginPath();
    ctx.ellipse(2, -20, 26, isSitting ? 14 : 17, 0, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();

    // Fluffy body curls
    for (let i = 0; i < 9; i++) {
      const bx = -22 + i * 5.5;
      const by = -26 + Math.sin(i * 1.3) * 7;
      ctx.beginPath();
      ctx.arc(bx, by, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#EDD5A0' : cream;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.ellipse(2, -20, 20, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();

    // Collar
    ctx.beginPath();
    ctx.roundRect(-14, -12, 28, 6, 3);
    ctx.fillStyle = collarRed;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(2, -5, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.fillStyle = '#B8960A';
    ctx.font = 'bold 4px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', 2, -5);

    // Head
    ctx.beginPath();
    ctx.arc(18, -38, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#EDD5A0';
    ctx.fill();

    // Fluffy head curls
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(18 + Math.cos(angle) * 15, -38 + Math.sin(angle) * 15, 7, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#EDD5A0' : cream;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(18, -38, 13, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.ellipse(7, -48, 8, 14, -0.25, 0, Math.PI * 2);
    ctx.fillStyle = golden;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(29, -48, 8, 14, 0.25, 0, Math.PI * 2);
    ctx.fillStyle = golden;
    ctx.fill();

    // Face fur patches
    [[12, -42], [24, -42]].forEach(([fx, fy]) => {
      ctx.beginPath();
      ctx.arc(fx, fy, 5, 0, Math.PI * 2);
      ctx.fillStyle = golden;
      ctx.fill();
    });

    // Eyes
    if (isSleeping) {
      [[13, -40], [23, -40]].forEach(([ex, ey]) => {
        ctx.beginPath();
        ctx.arc(ex, ey, 3.5, Math.PI + 0.3, Math.PI * 2 - 0.3);
        ctx.strokeStyle = darkFur;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    } else {
      [[13, -40], [23, -40]].forEach(([ex, ey]) => {
        ctx.beginPath();
        ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = eyeGreen;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#111';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex + 1.2, ey - 1.2, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      });
    }

    // Nose
    ctx.beginPath();
    ctx.ellipse(18, -33, 5, 3.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = nosePink;
    ctx.fill();

    // Mouth / smile
    if (!isSleeping) {
      ctx.beginPath();
      ctx.moveTo(15, -30);
      ctx.quadraticCurveTo(18, -27, 21, -30);
      ctx.strokeStyle = darkFur;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Teddy bear
    if (this.hasTeddy && !isSleeping) {
      this.drawTeddy(ctx, 38, -10);
    }

    ctx.restore();
  }

  drawTeddy(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    const t = '#CFC8BE', td = '#8C8680';
    ctx.beginPath(); ctx.ellipse(0, 2, 7, 9, 0, 0, Math.PI * 2); ctx.fillStyle = t; ctx.fill();
    ctx.beginPath(); ctx.arc(0, -12, 7, 0, Math.PI * 2); ctx.fillStyle = t; ctx.fill();
    ctx.beginPath(); ctx.arc(-5, -18, 3.5, 0, Math.PI * 2); ctx.fillStyle = t; ctx.fill();
    ctx.beginPath(); ctx.arc(5, -18, 3.5, 0, Math.PI * 2); ctx.fillStyle = t; ctx.fill();
    [[-2.5, -13], [2.5, -13]].forEach(([ex, ey]) => {
      ctx.beginPath(); ctx.arc(ex, ey, 1.5, 0, Math.PI * 2); ctx.fillStyle = td; ctx.fill();
    });
    ctx.beginPath(); ctx.ellipse(0, -10, 2.5, 1.5, 0, 0, Math.PI * 2); ctx.fillStyle = td; ctx.fill();
    ctx.restore();
  }

  drawBubble(x, y, text) {
    const ctx = this.ctx;
    ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
    const tw = ctx.measureText(text).width;
    const pad = 11, bw = tw + pad * 2, bh = 30;
    let bx = x - bw / 2;
    bx = Math.max(8, Math.min(bx, this.canvas.width - bw - 8));
    const by = y - bh;
    const tailX = Math.min(Math.max(x, bx + 12), bx + bw - 12);

    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 8);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tailX - 6, by + bh - 1);
    ctx.lineTo(tailX + 6, by + bh - 1);
    ctx.lineTo(tailX, by + bh + 9);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(tailX - 6, by + bh);
    ctx.lineTo(tailX, by + bh + 9);
    ctx.lineTo(tailX + 6, by + bh);
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#1A1A1A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, bx + bw / 2, by + bh / 2);
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }
}

document.addEventListener('DOMContentLoaded', () => new HannahPet());
