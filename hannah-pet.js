(() => {
  const BANDANA = '#4A5E3A';
  const CREAM   = '#F5E4A8';
  const GOLDEN  = '#E8C870';
  const DARK    = '#C9A84C';

  const SIGNS = [
    'entry level: 8+ yrs exp',
    'must know LLMs since 1995',
    'competitive salary: $18/hr',
    'just one more round',
    'we move fast 🚀',
    'unlimited PTO*',
    'great culture fit tho',
    '*offer rescinded',
    'new grad: led 3 IPOs pref.',
    'we\'re a family here 🥹',
  ];

  // ── Drawing helpers ──────────────────────────────────────────────

  function fluff(ctx, cx, cy, r, color, n=9) {
    for (let i=0; i<n; i++) {
      const a=(i/n)*Math.PI*2;
      ctx.beginPath();
      ctx.arc(cx+Math.cos(a)*r*0.72, cy+Math.sin(a)*r*0.72, r*0.42, 0, Math.PI*2);
      ctx.fillStyle=color; ctx.fill();
    }
    ctx.beginPath(); ctx.arc(cx,cy,r*0.65,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();
  }

  function bigEye(ctx, x, y) {
    ctx.beginPath(); ctx.ellipse(x,y,6,7,0,0,Math.PI*2); ctx.fillStyle='white'; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y+0.5,5,0,Math.PI*2); ctx.fillStyle='#4A8A28'; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y+0.5,3,0,Math.PI*2); ctx.fillStyle='#111'; ctx.fill();
    ctx.beginPath(); ctx.arc(x+2,y-2,1.8,0,Math.PI*2); ctx.fillStyle='white'; ctx.fill();
    ctx.beginPath(); ctx.arc(x-1.5,y+1,0.8,0,Math.PI*2); ctx.fillStyle='white'; ctx.fill();
  }

  function drawSign(ctx, x, y, text) {
    ctx.font='11px -apple-system,sans-serif';
    const tw=ctx.measureText(text).width;
    const bx=x-tw/2-9, by=y-22, bw=tw+18, bh=22;
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,5);
    ctx.fillStyle='white'; ctx.fill();
    ctx.strokeStyle='#ddd'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x,by+bh); ctx.lineTo(x,y+2);
    ctx.strokeStyle='#ddd'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.fillStyle='#444'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(text, x, by+bh/2);
  }

  function drawWalking(ctx, t, legSwing, bob) {
    const tailWag = Math.sin(t*2)*18;

    // tail
    ctx.save(); ctx.translate(-20,-22+bob);
    ctx.rotate(((tailWag-10)*Math.PI)/180);
    ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(-10,-16,-4,-30);
    ctx.strokeStyle=GOLDEN; ctx.lineWidth=8; ctx.lineCap='round'; ctx.stroke();
    fluff(ctx,-4,-30,8,CREAM,5);
    ctx.restore();

    // back legs
    [-12,8].forEach((lx,i) => {
      const s = i===0 ? -legSwing : legSwing;
      ctx.save(); ctx.translate(lx,-6+bob); ctx.rotate((s*Math.PI)/180);
      ctx.beginPath(); ctx.roundRect(-5,0,10,16,5); ctx.fillStyle=GOLDEN; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0,17,6,4,0,0,Math.PI*2); ctx.fillStyle=DARK; ctx.fill();
      ctx.restore();
    });

    // body
    fluff(ctx,0,-18+bob,22,GOLDEN,10);
    ctx.beginPath(); ctx.ellipse(0,-18+bob,19,15,0,0,Math.PI*2); ctx.fillStyle=CREAM; ctx.fill();

    // bandana at neck
    ctx.save(); ctx.translate(16,-28+bob);
    ctx.beginPath(); ctx.moveTo(-11,-4); ctx.lineTo(11,-4); ctx.lineTo(0,9); ctx.closePath();
    ctx.fillStyle=BANDANA; ctx.fill();
    ctx.fillStyle='white'; ctx.font='bold 6px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('</>',0,2);
    ctx.restore();

    // front legs
    [[-8,legSwing],[10,-legSwing]].forEach(([lx,s]) => {
      ctx.save(); ctx.translate(lx,-8+bob); ctx.rotate((s*Math.PI)/180);
      ctx.beginPath(); ctx.roundRect(-5,0,10,16,5); ctx.fillStyle=CREAM; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0,17,6,4,0,0,Math.PI*2); ctx.fillStyle=DARK; ctx.fill();
      ctx.restore();
    });

    // head
    fluff(ctx,16,-38+bob,20,GOLDEN,10);
    ctx.beginPath(); ctx.arc(16,-38+bob,17,0,Math.PI*2); ctx.fillStyle=CREAM; ctx.fill();

    // floppy ears
    ctx.beginPath(); ctx.ellipse(4,-46+bob,8,13,0.5,0,Math.PI*2); ctx.fillStyle=GOLDEN; ctx.fill();
    ctx.beginPath(); ctx.ellipse(28,-46+bob,8,13,-0.5,0,Math.PI*2); ctx.fillStyle=GOLDEN; ctx.fill();

    // blush
    ctx.beginPath(); ctx.ellipse(7,-34+bob,6,4,0,0,Math.PI*2); ctx.fillStyle='rgba(255,150,120,0.3)'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(25,-34+bob,6,4,0,0,Math.PI*2); ctx.fillStyle='rgba(255,150,120,0.3)'; ctx.fill();

    bigEye(ctx,11,-40+bob);
    bigEye(ctx,21,-40+bob);

    ctx.beginPath(); ctx.ellipse(16,-33+bob,4.5,3,0,0,Math.PI*2); ctx.fillStyle='#222'; ctx.fill();
    ctx.beginPath(); ctx.arc(15,-32.5+bob,1.2,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(12,-29+bob); ctx.quadraticCurveTo(16,-25,20,-29+bob);
    ctx.strokeStyle='#555'; ctx.lineWidth=1.5; ctx.stroke();
  }

  function drawSleeping(ctx, t) {
    const bob = Math.sin(t*1.2)*1.5;

    // curled body blob
    fluff(ctx,0,-14+bob,28,GOLDEN,10);
    ctx.beginPath(); ctx.ellipse(0,-14+bob,24,17,0,0,Math.PI*2); ctx.fillStyle=CREAM; ctx.fill();

    // tail curled on top
    ctx.save(); ctx.translate(18,-20+bob);
    ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(16,-8,12,-20);
    ctx.strokeStyle=GOLDEN; ctx.lineWidth=8; ctx.lineCap='round'; ctx.stroke();
    fluff(ctx,12,-20,7,CREAM,5);
    ctx.restore();

    // head resting
    fluff(ctx,-14,-10+bob,16,GOLDEN,8);
    ctx.beginPath(); ctx.arc(-14,-10+bob,13,0,Math.PI*2); ctx.fillStyle=CREAM; ctx.fill();

    // floppy ear
    ctx.beginPath(); ctx.ellipse(-20,-20+bob,7,11,-0.4,0,Math.PI*2); ctx.fillStyle=GOLDEN; ctx.fill();

    // closed eyes
    [[-18,-12+bob],[-10,-12+bob]].forEach(([ex,ey]) => {
      ctx.beginPath(); ctx.arc(ex,ey,4,Math.PI+0.5,Math.PI*2-0.5);
      ctx.strokeStyle='#333'; ctx.lineWidth=2; ctx.stroke();
    });

    ctx.beginPath(); ctx.ellipse(-14,-6+bob,3.5,2.5,0,0,Math.PI*2); ctx.fillStyle='#222'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(-20,-5+bob,5,3,0,0,Math.PI*2); ctx.fillStyle='rgba(255,150,120,0.3)'; ctx.fill();

    // paws
    ctx.beginPath(); ctx.ellipse(-4,0+bob,10,5,0.1,0,Math.PI*2); ctx.fillStyle=CREAM; ctx.fill();
    ctx.beginPath(); ctx.ellipse(8,1+bob,10,5,-0.1,0,Math.PI*2); ctx.fillStyle=CREAM; ctx.fill();

    // zzz
    ctx.fillStyle='#8A9A6A'; ctx.textAlign='left';
    ctx.font='bold 12px sans-serif'; ctx.fillText('z',2,-36+Math.sin(t)*3);
    ctx.font='bold 9px sans-serif';  ctx.fillText('z',12,-46+Math.sin(t+1)*3);
    ctx.font='bold 7px sans-serif';  ctx.fillText('z',19,-54+Math.sin(t+2)*3);
  }

  // ── Dog instance ─────────────────────────────────────────────────

  class Dog {
    constructor(canvasW, canvasH, sign) {
      this.sign = sign;
      this.x = 60 + Math.random() * (canvasW - 160);
      this.y = -80; // start above screen for drop
      this.vy = 0;
      this.dropping = true;
      this.groundY = canvasH - 10;
      this.vx = (Math.random()>0.5?1:-1)*(0.2+Math.random()*0.25);
      this.facing = this.vx>0?1:-1;
      this.t = Math.random()*100;
      this.state = Math.random() < 0.5 ? 'sleeping' : 'walking';
      this.stateTick = Math.floor(Math.random()*120);
      this.stateDuration = this.state==='sleeping'
        ? 400+Math.floor(Math.random()*400)
        : 80+Math.floor(Math.random()*100);
      this.showSign = false;
      this.signTick = 0;
      this.bounce = 0;
    }

    update(canvasW) {
      this.t += 0.016;

      // drop from sky
      if (this.dropping) {
        this.vy += 1.2;
        this.y += this.vy;
        if (this.y >= this.groundY) {
          this.y = this.groundY;
          this.bounce = 12;
          this.dropping = false;
          this.vy = 0;
        }
        return;
      }

      if (this.bounce > 0) this.bounce -= 1.5;

      // sign timer
      if (this.showSign) {
        this.signTick--;
        if (this.signTick <= 0) this.showSign = false;
      }

      // state
      this.stateTick++;
      if (this.stateTick >= this.stateDuration) {
        this.stateTick = 0;
        if (this.state==='walking') {
          // 70% chance to sleep, 30% chance to sit with sign
          if (Math.random() < 0.7) {
            this.state='sleeping';
            this.stateDuration=350+Math.floor(Math.random()*400);
            this.vx=0;
          } else {
            this.state='sitting';
            this.stateDuration=150+Math.floor(Math.random()*100);
            this.showSign=true;
            this.signTick=200;
            this.vx=0;
          }
        } else {
          this.state='walking';
          this.stateDuration=60+Math.floor(Math.random()*80);
          this.vx=(Math.random()>0.5?1:-1)*(0.2+Math.random()*0.25);
          this.facing=this.vx>0?1:-1;
        }
      }

      if (this.state==='walking') {
        this.x += this.vx;
        if (this.x>canvasW-100){this.x=canvasW-100;this.vx=-Math.abs(this.vx);this.facing=-1;}
        if (this.x<20){this.x=20;this.vx=Math.abs(this.vx);this.facing=1;}
      }
    }

    draw(ctx) {
      const groundY = this.groundY;
      const drawY = this.dropping ? this.y : groundY - Math.max(0,this.bounce);

      ctx.save();
      ctx.translate(this.x, drawY);
      if (this.facing===-1) ctx.scale(-1,1);

      const bob = this.state==='walking' ? Math.sin(this.t*6)*1.5 : 0;
      const legSwing = this.state==='walking' ? Math.sin(this.t*6)*14 : 0;

      if (this.state==='sleeping') {
        drawSleeping(ctx, this.t);
      } else if (this.state==='sitting') {
        drawWalking(ctx, this.t, 0, 0);
      } else {
        drawWalking(ctx, this.t, legSwing, bob);
      }

      ctx.restore();

      // sign (not flipped)
      if (this.showSign && !this.dropping) {
        const sx = this.facing===1 ? this.x+16 : this.x-16;
        drawSign(ctx, sx, drawY-72, this.sign);
      }
    }

    hitTest(cx, cy) {
      return Math.abs(cx-this.x)<40 && Math.abs(cy-(this.groundY-30))<50;
    }
  }

  // ── World ────────────────────────────────────────────────────────

  const canvas = document.createElement('canvas');
  canvas.style.cssText='position:fixed;bottom:0;left:0;width:100%;height:140px;z-index:9999;pointer-events:auto';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let dogs = [];
  let signPool = [...SIGNS].sort(()=>Math.random()-0.5);
  let signIdx = 0;

  function nextSign() {
    const s = signPool[signIdx % signPool.length];
    signIdx++;
    return s;
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = 140;
    dogs.forEach(d => d.groundY = canvas.height-10);
  }

  function spawnDrop() {
    if (dogs.length >= 100) return;
    const d = new Dog(canvas.width, canvas.height, nextSign());
    d.x = 60 + Math.random()*(canvas.width-160);
    dogs.push(d);
  }

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX-rect.left, cy = e.clientY-rect.top;
    dogs.forEach(d => { if (d.hitTest(cx,cy)) spawnDrop(); });
  });

  window.addEventListener('resize', resize);
  resize();

  // first dog — no drop, just walks in
  const first = new Dog(canvas.width, canvas.height, nextSign());
  first.dropping = false;
  first.y = first.groundY;
  dogs.push(first);

  function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    dogs.forEach(d => { d.update(canvas.width); d.draw(ctx); });
    requestAnimationFrame(loop);
  }
  loop();
})();
