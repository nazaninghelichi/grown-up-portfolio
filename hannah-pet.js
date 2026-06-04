(() => {
  // ── Colors ───────────────────────────────────────────────────────
  const C = {
    cream:'#F5E4A8', golden:'#E8C870', dark:'#C9A84C',
    bandana:'#4A5E3A', grass:'#C8E8A0', grassB:'#7CB87A',
  };

  // ── Canvas ───────────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;bottom:0;left:0;width:100%;height:260px;z-index:9999;cursor:default';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = 260; updateZones(); }
  window.addEventListener('resize', resize);

  // ── Zones ─────────────────────────────────────────────────────────
  let Z = {};
  function updateZones() {
    const w = canvas.width, h = canvas.height;
    Z.grass  = { x:w*0.25, y:h-120, w:w*0.5, h:120 };
    Z.bedX   = 55;
    Z.bedY   = h - 78;
    Z.trashX = w - 75;
    Z.trashY = h - 88;
    Z.ground = h - 18;
  }

  // ── Drawing: Hannah ───────────────────────────────────────────────
  function fluff(cx,cy,r,col,n=8) {
    for (let i=0;i<n;i++) {
      const a=(i/n)*Math.PI*2;
      ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r*.72,cy+Math.sin(a)*r*.72,r*.42,0,Math.PI*2);
      ctx.fillStyle=col; ctx.fill();
    }
    ctx.beginPath(); ctx.arc(cx,cy,r*.65,0,Math.PI*2); ctx.fillStyle=col; ctx.fill();
  }

  function bigEye(x,y,open=true) {
    if (!open) {
      ctx.beginPath(); ctx.arc(x,y,4,Math.PI+0.5,Math.PI*2-0.5);
      ctx.strokeStyle='#333'; ctx.lineWidth=2; ctx.stroke(); return;
    }
    ctx.beginPath(); ctx.ellipse(x,y,6,7,0,0,Math.PI*2); ctx.fillStyle='white'; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y+.5,5,0,Math.PI*2); ctx.fillStyle='#4A8A28'; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y+.5,3,0,Math.PI*2); ctx.fillStyle='#111'; ctx.fill();
    ctx.beginPath(); ctx.arc(x+2,y-2,1.8,0,Math.PI*2); ctx.fillStyle='white'; ctx.fill();
  }

  function drawHannahWalking(t, legSwing, bob, happy=true) {
    const tailWag = Math.sin(t*2)*18;
    ctx.save(); ctx.translate(-20,-22+bob); ctx.rotate((tailWag-10)*Math.PI/180);
    ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(-10,-16,-4,-30);
    ctx.strokeStyle=C.golden; ctx.lineWidth=8; ctx.lineCap='round'; ctx.stroke();
    fluff(-4,-30,8,C.cream,5); ctx.restore();

    [-12,8].forEach((lx,i) => {
      const s=i===0?-legSwing:legSwing;
      ctx.save(); ctx.translate(lx,-6+bob); ctx.rotate(s*Math.PI/180);
      ctx.beginPath(); ctx.roundRect(-5,0,10,16,5); ctx.fillStyle=C.golden; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0,17,6,4,0,0,Math.PI*2); ctx.fillStyle=C.dark; ctx.fill();
      ctx.restore();
    });

    fluff(0,-18+bob,22,C.golden,10);
    ctx.beginPath(); ctx.ellipse(0,-18+bob,19,15,0,0,Math.PI*2); ctx.fillStyle=C.cream; ctx.fill();

    // bandana
    ctx.save(); ctx.translate(16,-28+bob);
    ctx.beginPath(); ctx.moveTo(-11,-4); ctx.lineTo(11,-4); ctx.lineTo(0,9); ctx.closePath();
    ctx.fillStyle=C.bandana; ctx.fill();
    ctx.fillStyle='white'; ctx.font='bold 6px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('</>',0,2); ctx.restore();

    [[-8,legSwing],[10,-legSwing]].forEach(([lx,s]) => {
      ctx.save(); ctx.translate(lx,-8+bob); ctx.rotate(s*Math.PI/180);
      ctx.beginPath(); ctx.roundRect(-5,0,10,16,5); ctx.fillStyle=C.cream; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0,17,6,4,0,0,Math.PI*2); ctx.fillStyle=C.dark; ctx.fill();
      ctx.restore();
    });

    fluff(16,-38+bob,20,C.golden,10);
    ctx.beginPath(); ctx.arc(16,-38+bob,17,0,Math.PI*2); ctx.fillStyle=C.cream; ctx.fill();
    ctx.beginPath(); ctx.ellipse(4,-46+bob,8,13,.5,0,Math.PI*2); ctx.fillStyle=C.golden; ctx.fill();
    ctx.beginPath(); ctx.ellipse(28,-46+bob,8,13,-.5,0,Math.PI*2); ctx.fillStyle=C.golden; ctx.fill();
    ctx.beginPath(); ctx.ellipse(7,-34+bob,6,4,0,0,Math.PI*2); ctx.fillStyle='rgba(255,150,120,0.3)'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(25,-34+bob,6,4,0,0,Math.PI*2); ctx.fillStyle='rgba(255,150,120,0.3)'; ctx.fill();

    bigEye(11,-40+bob); bigEye(21,-40+bob);
    ctx.beginPath(); ctx.ellipse(16,-33+bob,4.5,3,0,0,Math.PI*2); ctx.fillStyle='#222'; ctx.fill();
    if (happy) {
      ctx.beginPath(); ctx.moveTo(12,-29+bob); ctx.quadraticCurveTo(16,-25,20,-29+bob);
      ctx.strokeStyle='#555'; ctx.lineWidth=1.5; ctx.stroke();
    }
  }

  function drawHannahSleeping(t) {
    const bob=Math.sin(t*1.2)*1.5;
    fluff(0,-14+bob,28,C.golden,10);
    ctx.beginPath(); ctx.ellipse(0,-14+bob,24,17,0,0,Math.PI*2); ctx.fillStyle=C.cream; ctx.fill();
    ctx.save(); ctx.translate(18,-20+bob);
    ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(16,-8,12,-20);
    ctx.strokeStyle=C.golden; ctx.lineWidth=8; ctx.lineCap='round'; ctx.stroke();
    fluff(12,-20,7,C.cream,5); ctx.restore();
    fluff(-14,-10+bob,16,C.golden,8);
    ctx.beginPath(); ctx.arc(-14,-10+bob,13,0,Math.PI*2); ctx.fillStyle=C.cream; ctx.fill();
    ctx.beginPath(); ctx.ellipse(-20,-20+bob,7,11,-.4,0,Math.PI*2); ctx.fillStyle=C.golden; ctx.fill();
    [[-18,-12+bob],[-10,-12+bob]].forEach(([ex,ey]) => {
      ctx.beginPath(); ctx.arc(ex,ey,4,Math.PI+.5,Math.PI*2-.5);
      ctx.strokeStyle='#333'; ctx.lineWidth=2; ctx.stroke();
    });
    ctx.beginPath(); ctx.ellipse(-14,-6+bob,3.5,2.5,0,0,Math.PI*2); ctx.fillStyle='#222'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(-4,0+bob,10,5,.1,0,Math.PI*2); ctx.fillStyle=C.cream; ctx.fill();
    ctx.beginPath(); ctx.ellipse(8,1+bob,10,5,-.1,0,Math.PI*2); ctx.fillStyle=C.cream; ctx.fill();
    ctx.fillStyle='#8A9A6A'; ctx.textAlign='left';
    ctx.font='bold 12px sans-serif'; ctx.fillText('z',2,-36+Math.sin(t)*3);
    ctx.font='bold 9px sans-serif'; ctx.fillText('z',12,-46+Math.sin(t+1)*3);
    ctx.font='bold 7px sans-serif'; ctx.fillText('z',19,-54+Math.sin(t+2)*3);
  }

  // ── Drawing: Scene ────────────────────────────────────────────────
  function drawScene() {
    const w=canvas.width, h=canvas.height;

    // background
    ctx.fillStyle='rgba(250,248,244,0.97)';
    ctx.fillRect(0,0,w,h);

    // grass zone — ground strip with tufts + trees, no filled rectangle
    const g=Z.grass;
    const groundY=Z.ground;

    // green ground strip
    ctx.beginPath(); ctx.roundRect(g.x, groundY-6, g.w, 10, 3);
    ctx.fillStyle='#7CB87A'; ctx.fill();

    // grass tufts along the strip
    for (let i=0;i<14;i++) {
      const gx=g.x+12+(i/13)*(g.w-24);
      ctx.strokeStyle='#5A9A5A'; ctx.lineWidth=2; ctx.lineCap='round';
      [[-4,10],[-1,13],[2,11]].forEach(([ox,h2]) => {
        ctx.beginPath(); ctx.moveTo(gx+ox,groundY-6); ctx.lineTo(gx+ox,groundY-6-h2); ctx.stroke();
      });
    }

    // small trees
    [g.x+g.w*0.18, g.x+g.w*0.5, g.x+g.w*0.82].forEach(tx => {
      const ty=groundY-6;
      // trunk
      ctx.beginPath(); ctx.roundRect(tx-3,ty-22,6,22,2); ctx.fillStyle='#8B6030'; ctx.fill();
      // foliage layers
      [[0,-38,20],[0,-52,15],[0,-62,11]].forEach(([ox,oy,r]) => {
        ctx.beginPath(); ctx.arc(tx+ox,ty+oy,r,0,Math.PI*2); ctx.fillStyle='#5A9A3A'; ctx.fill();
      });
    });

    // label above the strip
    ctx.fillStyle='#6A9A6A'; ctx.font='10px -apple-system,sans-serif'; ctx.textAlign='center';
    ctx.fillText('drag Hannah here to walk',g.x+g.w/2,groundY-80);

    // bed
    const bx=Z.bedX, by=Z.bedY;
    ctx.beginPath(); ctx.roundRect(bx,by,88,58,8); ctx.fillStyle='#DCBF9A'; ctx.fill();
    ctx.strokeStyle='#A88860'; ctx.lineWidth=2; ctx.stroke();
    ctx.beginPath(); ctx.roundRect(bx+5,by+5,38,28,6); ctx.fillStyle='white'; ctx.fill();
    ctx.strokeStyle='#ddd'; ctx.lineWidth=1; ctx.stroke();
    ctx.beginPath(); ctx.roundRect(bx+4,by+30,80,22,5); ctx.fillStyle='#F0A0A0'; ctx.fill();
    ctx.strokeStyle='#D08080'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='#777'; ctx.font='11px sans-serif'; ctx.textAlign='center';
    ctx.fillText('🛏️ Bed', bx+44, by-6);

    // trashcan
    const tx=Z.trashX, ty=Z.trashY;
    ctx.beginPath(); ctx.roundRect(tx,ty+14,44,54,5); ctx.fillStyle='#8A8A8A'; ctx.fill();
    ctx.strokeStyle='#666'; ctx.lineWidth=2; ctx.stroke();
    [.33,.66].forEach(f => {
      ctx.beginPath(); ctx.moveTo(tx+6,ty+14+f*54); ctx.lineTo(tx+38,ty+14+f*54);
      ctx.strokeStyle='#777'; ctx.lineWidth=1; ctx.stroke();
    });
    ctx.beginPath(); ctx.roundRect(tx-4,ty+6,52,12,4); ctx.fillStyle='#999'; ctx.fill();
    ctx.strokeStyle='#666'; ctx.lineWidth=2; ctx.stroke();
    ctx.beginPath(); ctx.roundRect(tx+14,ty,16,8,3); ctx.fillStyle='#888'; ctx.fill();
    ctx.strokeStyle='#666'; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle='#777'; ctx.font='11px sans-serif'; ctx.textAlign='center';
    ctx.fillText('🗑️', tx+22, ty-6);
  }

  function drawTeddy(x,y) {
    const tc='#D0C8BE', td='#9A9490';
    ctx.save(); ctx.translate(x,y);
    ctx.beginPath(); ctx.ellipse(0,4,11,13,0,0,Math.PI*2); ctx.fillStyle=tc; ctx.fill(); ctx.strokeStyle=td; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(0,-13,11,0,Math.PI*2); ctx.fillStyle=tc; ctx.fill(); ctx.stroke();
    [[-8,-23],[8,-23]].forEach(([ex,ey]) => {
      ctx.beginPath(); ctx.arc(ex,ey,6,0,Math.PI*2); ctx.fillStyle=tc; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(ex,ey,3,0,Math.PI*2); ctx.fillStyle='#F0A0A0'; ctx.fill();
    });
    ctx.beginPath(); ctx.arc(-4,-14,2,0,Math.PI*2); ctx.fillStyle=td; ctx.fill();
    ctx.beginPath(); ctx.arc(4,-14,2,0,Math.PI*2); ctx.fillStyle=td; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0,-9,3,2,0,0,Math.PI*2); ctx.fillStyle=td; ctx.fill();
    [[-15,-2],[15,-2]].forEach(([ax,ay]) => {
      ctx.beginPath(); ctx.ellipse(ax,ay,5,9,ax<0?.5:-.5,0,Math.PI*2); ctx.fillStyle=tc; ctx.fill(); ctx.stroke();
    });
    ctx.restore();
  }

  function drawFoodBowl(x,y) {
    ctx.save(); ctx.translate(x,y);
    ctx.beginPath(); ctx.ellipse(0,2,22,10,0,0,Math.PI*2); ctx.fillStyle='#BCBCBC'; ctx.fill(); ctx.strokeStyle='#999'; ctx.lineWidth=2; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0,-2,22,8,0,0,Math.PI); ctx.fillStyle='#A0A0A0'; ctx.fill();
    [[-8,-6],[0,-8],[8,-6],[-4,-3],[4,-3]].forEach(([kx,ky]) => {
      ctx.beginPath(); ctx.arc(kx,ky,3,0,Math.PI*2); ctx.fillStyle='#D4A060'; ctx.fill();
    });
    ctx.restore();
    ctx.fillStyle='#666'; ctx.font='11px sans-serif'; ctx.textAlign='center';
    ctx.fillText('🥣 Food', x, y-14);
  }

  function drawSpeechBubble(x,y,text) {
    ctx.font='12px -apple-system,sans-serif';
    const tw=ctx.measureText(text).width;
    const bx=x-tw/2-10, by=y-30, bw=tw+20, bh=24;
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,8); ctx.fillStyle='white'; ctx.fill();
    ctx.strokeStyle='#ddd'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-6,by+bh); ctx.lineTo(x+6,by+bh); ctx.lineTo(x,by+bh+8); ctx.closePath();
    ctx.fillStyle='white'; ctx.fill();
    ctx.fillStyle='#333'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(text,x,by+bh/2);
  }

  function drawHUD() {
    const w=canvas.width;
    ctx.fillStyle='rgba(255,255,255,0.94)';
    ctx.fillRect(0,0,w,48);
    ctx.strokeStyle='#eaeaea'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(0,48); ctx.lineTo(w,48); ctx.stroke();

    const bars=[
      {label:'🍖 Hunger', val:G.hunger, col:'#E8803A'},
      {label:'😊 Happy',  val:G.happy,  col:'#E8C830'},
      {label:'💤 Energy', val:G.energy, col:'#6090E8'},
      {label:'💧 Bladder',val:G.bladder,col:'#50C8E8'},
    ];
    const bw=Math.min(140,(w-60)/4-24), gap=24;
    const totalW=bars.length*(bw+gap)-gap;
    let bx=(w-totalW)/2;

    bars.forEach(b => {
      ctx.fillStyle='#555'; ctx.font='11px -apple-system,sans-serif'; ctx.textAlign='left'; ctx.textBaseline='middle';
      ctx.fillText(b.label,bx,16);
      ctx.beginPath(); ctx.roundRect(bx,26,bw,10,5); ctx.fillStyle='#f0f0f0'; ctx.fill();
      const fw=(b.val/100)*bw;
      if (fw>0) {
        ctx.beginPath(); ctx.roundRect(bx,26,fw,10,5);
        ctx.fillStyle=b.val<25?'#E85050':b.col; ctx.fill();
      }
      bx+=bw+gap;
    });
  }

  // ── Game state ────────────────────────────────────────────────────
  const G = {
    t: 0,
    // hannah
    hx: 100, hy: 0,
    hFacing: 1,
    hVx: 0.3,
    hState: 'idle',   // idle | grass | to_bed | sleeping | to_grass_edge
    hDragging: false, hDragOx:0, hDragOy:0,
    // needs
    hunger: 80, happy: 75, energy: 85, bladder: 0,
    // grass timer
    grassTime: 0,
    // request
    request: null, reqTimer: 0, lastReqTime: -20,
    // petting
    petting: 0, hearts: [],
    // objects
    teddyX:60, teddyY:0, teddyDrag:false, teddyDragOx:0, teddyDragOy:0,
    foodX:0, foodY:0, foodDrag:false, foodDragOx:0, foodDragOy:0,
    poops: [],
    // particles
    particles: [],
  };

  const REQUESTS = {
    food:  '🍖 hungry!',
    bed:   '💤 sleepy...',
    teddy: '🧸 teddy please?',
    pet:   '🐾 pet me!',
  };

  // ── Input ─────────────────────────────────────────────────────────
  let mx=0, my=0, pmx=0, pmy=0, dragTarget=null;

  function pos(e) {
    const r=canvas.getBoundingClientRect(), sx=canvas.width/r.width, sy=canvas.height/r.height;
    const src=e.touches?e.touches[0]:e;
    return { x:(src.clientX-r.left)*sx, y:(src.clientY-r.top)*sy };
  }

  function nearHannah(x,y,r=50) { return Math.hypot(x-G.hx-16, y-G.hy+30)<r; }
  function inGrass(x,y) { return x>=Z.grass.x&&x<=Z.grass.x+Z.grass.w&&y>=Z.grass.y&&y<=Z.grass.y+Z.grass.h; }
  function inTrash(x,y) { return x>=Z.trashX-10&&x<=Z.trashX+54&&y>=Z.trashY&&y<=canvas.height-10; }
  function inBed(x,y)   { return x>=Z.bedX&&x<=Z.bedX+88&&y>=Z.bedY&&y<=canvas.height-10; }

  function onDown(e) {
    e.preventDefault();
    const {x,y}=pos(e); mx=x; my=y;
    // poops first
    for (const p of G.poops) {
      if (Math.abs(x-p.x)<16&&Math.abs(y-p.y)<16) { dragTarget=p; p.drag=true; p.ox=x-p.x; p.oy=y-p.y; return; }
    }
    // hannah
    if (nearHannah(x,y,40)) { dragTarget='hannah'; G.hDragging=true; G.hDragOx=x-G.hx; G.hDragOy=y-G.hy; return; }
    // teddy
    if (!G.teddyDrag&&Math.abs(x-G.teddyX)<18&&Math.abs(y-G.teddyY)<28) { dragTarget='teddy'; G.teddyDrag=true; G.teddyDragOx=x-G.teddyX; G.teddyDragOy=y-G.teddyY; return; }
    // food
    if (Math.abs(x-G.foodX)<25&&Math.abs(y-G.foodY)<18) { dragTarget='food'; G.foodDrag=true; G.foodDragOx=x-G.foodX; G.foodDragOy=y-G.foodY; }
  }

  function onMove(e) {
    e.preventDefault();
    const {x,y}=pos(e); pmx=mx; pmy=my; mx=x; my=y;
    // petting
    if (!dragTarget&&nearHannah(x,y,48)) {
      const spd=Math.hypot(x-pmx,y-pmy);
      if (spd>0.3&&spd<3.5) {
        G.petting=Math.min(100,G.petting+2.5);
        if (G.petting>25&&Math.random()<0.06) {
          G.hearts.push({x:G.hx+16+(Math.random()-.5)*30,y:G.hy-55,life:1.2,max:1.2,a:1});
        }
      }
    }
    if (!dragTarget) return;
    if (dragTarget==='hannah') { G.hx=x-G.hDragOx; G.hy=y-G.hDragOy; }
    else if (dragTarget==='teddy') { G.teddyX=x-G.teddyDragOx; G.teddyY=y-G.teddyDragOy; }
    else if (dragTarget==='food') { G.foodX=x-G.foodDragOx; G.foodY=y-G.foodDragOy; }
    else { dragTarget.x=x-dragTarget.ox; dragTarget.y=y-dragTarget.oy; }
  }

  function onUp(e) {
    e.preventDefault();
    const {x,y}=pos(e);

    if (dragTarget==='hannah') {
      G.hDragging=false;
      G.hy=Z.ground;
      if (inGrass(x,y)&&G.hState!=='grass') {
        G.hState='grass'; G.grassTime=0; G.hVx=0.3; G.request=null;
      } else if (!inGrass(x,y)&&G.hState==='grass') {
        G.hState='to_bed'; G.request=null;
      } else if (inBed(x,y)&&G.hState==='idle') {
        G.hState='to_bed';
      }
    } else if (dragTarget==='teddy') {
      G.teddyDrag=false;
      if (nearHannah(x,y,65)) {
        G.happy=Math.min(100,G.happy+35); G.request=null;
        // bounce teddy back
        G.teddyX=Z.bedX+25; G.teddyY=Z.ground;
        spawnParticles(G.hx+16,G.hy-30,'#FFD700');
      }
    } else if (dragTarget==='food') {
      G.foodDrag=false;
      if (nearHannah(x,y,65)) {
        G.hunger=Math.min(100,G.hunger+40); G.request=null;
        G.foodX=Z.bedX+80; G.foodY=Z.ground;
        spawnParticles(G.hx+16,G.hy-30,'#E8803A');
      }
    } else if (dragTarget&&typeof dragTarget==='object') {
      dragTarget.drag=false;
      if (inTrash(x,y)) {
        const i=G.poops.indexOf(dragTarget);
        if (i!==-1) { G.poops.splice(i,1); spawnParticles(x,y,'#888'); }
      }
    }
    dragTarget=null;
  }

  canvas.addEventListener('mousedown',onDown); canvas.addEventListener('mousemove',onMove); canvas.addEventListener('mouseup',onUp);
  canvas.addEventListener('touchstart',onDown,{passive:false}); canvas.addEventListener('touchmove',onMove,{passive:false}); canvas.addEventListener('touchend',onUp,{passive:false});

  // ── Helpers ───────────────────────────────────────────────────────
  function spawnParticles(x,y,col) {
    for (let i=0;i<10;i++) G.particles.push({x,y,vx:(Math.random()-.5)*5,vy:-Math.random()*4,life:.7,col});
  }

  // ── Update ────────────────────────────────────────────────────────
  let lastT=0;
  function update(dt) {
    G.t+=dt;

    // drain needs
    if (G.hState!=='sleeping') {
      G.hunger=Math.max(0,G.hunger-.025*dt*60);
      G.happy =Math.max(0,G.happy -.018*dt*60);
      G.energy=Math.max(0,G.energy-.012*dt*60);
    } else {
      G.energy=Math.min(100,G.energy+.10*dt*60);
      G.hunger=Math.max(0,G.hunger-.008*dt*60);
    }
    G.petting=Math.max(0,G.petting-.4*dt*60);
    if (G.petting>20) G.happy=Math.min(100,G.happy+.04*dt*60);

    // bladder on grass
    if (G.hState==='grass') {
      G.grassTime+=dt;
      G.bladder=Math.min(100,G.bladder+.12*dt*60);
      if (G.bladder>=100) {
        G.bladder=0;
        G.poops.push({x:G.hx+10,y:Z.ground,drag:false,ox:0,oy:0});
      }
    } else {
      G.bladder=Math.max(0,G.bladder-.02*dt*60);
    }

    // requests
    if (G.reqTimer>0) { G.reqTimer-=dt; if (G.reqTimer<=0) G.request=null; }
    if (!G.request&&G.t-G.lastReqTime>12) {
      if      (G.hunger<35)                            { G.request='food'; }
      else if (G.energy<25&&G.hState!=='sleeping')     { G.request='bed'; }
      else if (G.happy<35)                             { G.request=Math.random()<.5?'teddy':'pet'; }
      if (G.request) { G.reqTimer=7; G.lastReqTime=G.t; }
    }

    // hearts
    G.hearts=G.hearts.filter(h=>{ h.y-=.5; h.life-=dt; h.a=h.life/h.max; return h.life>0; });

    // particles
    G.particles=G.particles.filter(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=.15; p.life-=dt; return p.life>0; });

    // Hannah movement
    if (!G.hDragging) moveHannah(dt);
  }

  function moveHannah(dt) {
    G.hy=Z.ground;
    if (G.hState==='idle') {
      G.hx+=G.hVx;
      const maxX=Z.grass.x-50;
      if (G.hx>maxX){G.hx=maxX;G.hVx=-Math.abs(G.hVx);G.hFacing=-1;}
      if (G.hx<20){G.hx=20;G.hVx=Math.abs(G.hVx);G.hFacing=1;}
      if (Math.random()<.003) G.hVx=-G.hVx;
      G.hFacing=G.hVx>0?1:-1;
    } else if (G.hState==='grass') {
      G.hx+=G.hVx;
      if (G.hx>Z.grass.x+Z.grass.w-55){G.hx=Z.grass.x+Z.grass.w-55;G.hVx=-Math.abs(G.hVx);G.hFacing=-1;}
      if (G.hx<Z.grass.x+15){G.hx=Z.grass.x+15;G.hVx=Math.abs(G.hVx);G.hFacing=1;}
      G.hFacing=G.hVx>0?1:-1;
    } else if (G.hState==='to_bed') {
      const tx=Z.bedX+50, dx=tx-G.hx;
      if (Math.abs(dx)<3){G.hx=tx;G.hState='sleeping';}
      else{G.hx+=Math.sign(dx)*.9;G.hFacing=dx>0?1:-1;}
    } else if (G.hState==='sleeping') {
      G.hx=Z.bedX+50; G.hy=Z.ground;
    }
  }

  // ── Draw ──────────────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawScene();

    // food bowl and teddy (reset positions to ground on first frame)
    drawTeddy(G.teddyX, G.teddyY);
    drawFoodBowl(G.foodX, G.foodY);

    // poops
    G.poops.forEach(p=>{ ctx.font='22px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('💩',p.x,p.y); });

    // hannah
    ctx.save(); ctx.translate(G.hx,G.hy); if(G.hFacing===-1) ctx.scale(-1,1);
    const walking=G.hState==='idle'||G.hState==='grass'||G.hState==='to_bed';
    if (G.hState==='sleeping') { drawHannahSleeping(G.t); }
    else { drawHannahWalking(G.t, walking?Math.sin(G.t*6)*14:0, walking?Math.sin(G.t*6)*1.5:0, G.happy>20); }
    ctx.restore();

    // hearts
    G.hearts.forEach(h=>{ ctx.globalAlpha=h.a; ctx.font='16px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('❤️',h.x,h.y); ctx.globalAlpha=1; });

    // speech bubble
    if (G.request&&REQUESTS[G.request]) drawSpeechBubble(G.hx+16,G.hy-68,REQUESTS[G.request]);

    // particles
    G.particles.forEach(p=>{ ctx.save(); ctx.globalAlpha=p.life; ctx.fillStyle=p.col; ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2); ctx.fill(); ctx.restore(); });

    // poop hint
    if (G.poops.length>0) {
      ctx.fillStyle='#E85050'; ctx.font='bold 11px -apple-system,sans-serif'; ctx.textAlign='center';
      ctx.fillText('drag 💩 to the trashcan!',canvas.width/2,62);
    }

    // drag hint
    if (G.hState==='idle'&&G.poops.length===0) {
      ctx.fillStyle='#aaa'; ctx.font='10px -apple-system,sans-serif'; ctx.textAlign='center';
      ctx.fillText('drag Hannah to 🌿 for a walk • drag 🧸 or 🥣 to her • pet her with cursor',canvas.width/2,62);
    }

    drawHUD();
  }

  // ── Boot ──────────────────────────────────────────────────────────
  resize();
  G.hy = Z.ground;
  G.hx = Z.bedX + 120;
  G.teddyX = Z.bedX + 25; G.teddyY = Z.ground;
  G.foodX  = Z.bedX + 80; G.foodY  = Z.ground;

  function loop(ts) {
    const dt=Math.min((ts-lastT)/1000,.05); lastT=ts;
    update(dt); draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(ts=>{lastT=ts;requestAnimationFrame(loop);});
})();
