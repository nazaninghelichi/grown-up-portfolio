(() => {
  // ── Palette ─────────────────────────────────────────────────────
  const CREAM='#F5E4A8', GOLDEN='#E8C870', DARK='#C9A84C', BANDANA='#4A5E3A';

  // ── Canvas ───────────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;bottom:0;left:0;width:100%;height:150px;z-index:9999;cursor:default';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let CW = 0, CH = 150;
  const GROUND = 132;         // y of ground line
  const HOUSE_X = 24;         // left edge of house
  const HOUSE_W = 100;
  const HOUSE_H = 95;
  const HOUSE_TOP = GROUND - HOUSE_H;
  const HOME_ZONE = 170;      // x threshold: left of this = home, right = walking

  function resize() { CW = canvas.width = window.innerWidth; canvas.height = CH = 150; }
  window.addEventListener('resize', resize); resize();

  // ── Dashboard (HTML) ─────────────────────────────────────────────
  const dash = document.createElement('div');
  const btnStyle = `cursor:pointer;border:none;border-radius:20px;padding:5px 10px;font-size:13px;background:rgba(255,255,255,0.88);box-shadow:0 1px 4px rgba(0,0,0,0.12);transition:transform .1s;`;
  dash.style.cssText = 'position:fixed;bottom:158px;left:20px;z-index:10000;display:flex;gap:6px;align-items:center;';
  dash.innerHTML = `
    <button id="h-feed" title="Feed Hannah" style="${btnStyle}">🍖</button>
    <button id="h-toy"  title="Give toy"    style="${btnStyle}">🧸</button>
    <button id="h-pet"  title="Pet Hannah"  style="${btnStyle}">🐾</button>
  `;
  document.body.appendChild(dash);

  // ── Game state ────────────────────────────────────────────────────
  const G = {
    t: 0,
    // needs
    hunger: 80, happy: 75, energy: 90, bladder: 0,
    // hannah
    x: HOUSE_X + HOUSE_W/2, y: GROUND,
    vx: 0.5, facing: 1,
    state: 'inside',   // inside | idle | walking | to_house | dragging
    prevState: 'inside',
    dragging: false, dragOx: 0, dragOy: 0,
    // walk
    grassTime: 0,
    // anim
    t_anim: 0,
    // poop
    poops: [],         // {x, y, r, popping, popT}
    // hearts / particles
    hearts: [],
    particles: [],
    // request
    request: null, reqTimer: 0, lastReq: -20,
    // feedback
    flash: null, flashTimer: 0,
  };

  // ── Drawing: Hannah ───────────────────────────────────────────────
  function fluff(cx,cy,r,c,n=8) {
    for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2;ctx.beginPath();ctx.arc(cx+Math.cos(a)*r*.72,cy+Math.sin(a)*r*.72,r*.42,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();}
    ctx.beginPath();ctx.arc(cx,cy,r*.65,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();
  }
  function bEye(x,y,open=true){
    if(!open){ctx.beginPath();ctx.arc(x,y,4,Math.PI+.5,Math.PI*2-.5);ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.stroke();return;}
    ctx.beginPath();ctx.ellipse(x,y,6,7,0,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();
    ctx.beginPath();ctx.arc(x,y+.5,5,0,Math.PI*2);ctx.fillStyle='#4A8A28';ctx.fill();
    ctx.beginPath();ctx.arc(x,y+.5,3,0,Math.PI*2);ctx.fillStyle='#111';ctx.fill();
    ctx.beginPath();ctx.arc(x+2,y-2,1.8,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();
  }

  function drawHannah(t, legSwing, bob, sleeping=false, scale=1) {
    ctx.scale(scale, scale);
    if(sleeping){ drawSleeping(t); return; }
    const tw=Math.sin(t*2)*18;
    ctx.save();ctx.translate(-20,-22+bob);ctx.rotate((tw-10)*Math.PI/180);
    ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-10,-16,-4,-30);
    ctx.strokeStyle=GOLDEN;ctx.lineWidth=8;ctx.lineCap='round';ctx.stroke();
    fluff(-4,-30,8,CREAM,5);ctx.restore();
    [-12,8].forEach((lx,i)=>{
      const s=i===0?-legSwing:legSwing;
      ctx.save();ctx.translate(lx,-6+bob);ctx.rotate(s*Math.PI/180);
      ctx.beginPath();ctx.roundRect(-5,0,10,16,5);ctx.fillStyle=GOLDEN;ctx.fill();
      ctx.beginPath();ctx.ellipse(0,17,6,4,0,0,Math.PI*2);ctx.fillStyle=DARK;ctx.fill();
      ctx.restore();
    });
    fluff(0,-18+bob,22,GOLDEN,10);
    ctx.beginPath();ctx.ellipse(0,-18+bob,19,15,0,0,Math.PI*2);ctx.fillStyle=CREAM;ctx.fill();
    ctx.save();ctx.translate(16,-28+bob);
    ctx.beginPath();ctx.moveTo(-11,-4);ctx.lineTo(11,-4);ctx.lineTo(0,9);ctx.closePath();
    ctx.fillStyle=BANDANA;ctx.fill();
    ctx.fillStyle='white';ctx.font='bold 6px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('</>',0,2);
    ctx.restore();
    [[-8,legSwing],[10,-legSwing]].forEach(([lx,s])=>{
      ctx.save();ctx.translate(lx,-8+bob);ctx.rotate(s*Math.PI/180);
      ctx.beginPath();ctx.roundRect(-5,0,10,16,5);ctx.fillStyle=CREAM;ctx.fill();
      ctx.beginPath();ctx.ellipse(0,17,6,4,0,0,Math.PI*2);ctx.fillStyle=DARK;ctx.fill();
      ctx.restore();
    });
    fluff(16,-38+bob,20,GOLDEN,10);
    ctx.beginPath();ctx.arc(16,-38+bob,17,0,Math.PI*2);ctx.fillStyle=CREAM;ctx.fill();
    ctx.beginPath();ctx.ellipse(4,-46+bob,8,13,.5,0,Math.PI*2);ctx.fillStyle=GOLDEN;ctx.fill();
    ctx.beginPath();ctx.ellipse(28,-46+bob,8,13,-.5,0,Math.PI*2);ctx.fillStyle=GOLDEN;ctx.fill();
    ctx.beginPath();ctx.ellipse(7,-34+bob,6,4,0,0,Math.PI*2);ctx.fillStyle='rgba(255,150,120,0.3)';ctx.fill();
    ctx.beginPath();ctx.ellipse(25,-34+bob,6,4,0,0,Math.PI*2);ctx.fillStyle='rgba(255,150,120,0.3)';ctx.fill();
    bEye(11,-40+bob);bEye(21,-40+bob);
    ctx.beginPath();ctx.ellipse(16,-33+bob,4.5,3,0,0,Math.PI*2);ctx.fillStyle='#222';ctx.fill();
    ctx.beginPath();ctx.moveTo(12,-29+bob);ctx.quadraticCurveTo(16,-25,20,-29+bob);
    ctx.strokeStyle='#555';ctx.lineWidth=1.5;ctx.stroke();
  }

  function drawSleeping(t){
    const bob=Math.sin(t*1.2)*1.5;
    fluff(0,-14+bob,28,GOLDEN,10);
    ctx.beginPath();ctx.ellipse(0,-14+bob,24,17,0,0,Math.PI*2);ctx.fillStyle=CREAM;ctx.fill();
    ctx.save();ctx.translate(18,-20+bob);
    ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(16,-8,12,-20);
    ctx.strokeStyle=GOLDEN;ctx.lineWidth=8;ctx.lineCap='round';ctx.stroke();
    fluff(12,-20,7,CREAM,5);ctx.restore();
    fluff(-14,-10+bob,16,GOLDEN,8);
    ctx.beginPath();ctx.arc(-14,-10+bob,13,0,Math.PI*2);ctx.fillStyle=CREAM;ctx.fill();
    ctx.beginPath();ctx.ellipse(-20,-20+bob,7,11,-.4,0,Math.PI*2);ctx.fillStyle=GOLDEN;ctx.fill();
    [[-18,-12+bob],[-10,-12+bob]].forEach(([ex,ey])=>{
      ctx.beginPath();ctx.arc(ex,ey,4,Math.PI+.5,Math.PI*2-.5);ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.stroke();
    });
    ctx.beginPath();ctx.ellipse(-14,-6+bob,3.5,2.5,0,0,Math.PI*2);ctx.fillStyle='#222';ctx.fill();
    ctx.beginPath();ctx.ellipse(-4,0+bob,10,5,.1,0,Math.PI*2);ctx.fillStyle=CREAM;ctx.fill();
    ctx.beginPath();ctx.ellipse(8,1+bob,10,5,-.1,0,Math.PI*2);ctx.fillStyle=CREAM;ctx.fill();
    ctx.fillStyle='#8A9A6A';ctx.textAlign='left';
    ctx.font='bold 11px sans-serif';ctx.fillText('z',2,-36+Math.sin(t)*3);
    ctx.font='bold 8px sans-serif';ctx.fillText('z',11,-45+Math.sin(t+1)*3);
    ctx.font='bold 6px sans-serif';ctx.fillText('z',17,-52+Math.sin(t+2)*3);
  }

  // ── Drawing: House ────────────────────────────────────────────────
  function drawHouse() {
    const x=HOUSE_X, y=HOUSE_TOP, w=HOUSE_W, h=HOUSE_H;
    // shadow
    ctx.beginPath();ctx.ellipse(x+w/2,GROUND+2,w*.45,5,0,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fill();
    // walls
    ctx.beginPath();ctx.roundRect(x,y+22,w,h-22,4);
    ctx.fillStyle='#D4956A';ctx.fill();
    ctx.strokeStyle='#A8724A';ctx.lineWidth=2;ctx.stroke();
    // wood planks
    for(let i=0;i<3;i++){
      ctx.beginPath();ctx.moveTo(x+2,y+36+i*16);ctx.lineTo(x+w-2,y+36+i*16);
      ctx.strokeStyle='rgba(0,0,0,0.08)';ctx.lineWidth=1;ctx.stroke();
    }
    // roof
    ctx.beginPath();ctx.moveTo(x-8,y+26);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w+8,y+26);ctx.closePath();
    ctx.fillStyle='#8B4A2A';ctx.fill();
    ctx.strokeStyle='#6B3A1A';ctx.lineWidth=2;ctx.stroke();
    // roof ridge detail
    ctx.beginPath();ctx.moveTo(x+w/2-4,y+4);ctx.lineTo(x+w/2+4,y+4);
    ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=2;ctx.stroke();
    // door arch
    const dx=x+w/2-14, dw=28, dh=38, dy=GROUND-dh;
    ctx.beginPath();ctx.roundRect(dx,dy,dw,dh+4,[14,14,0,0]);
    ctx.fillStyle='#5A3010';ctx.fill();
    // door frame
    ctx.beginPath();ctx.roundRect(dx-2,dy-2,dw+4,dh+6,[15,15,0,0]);
    ctx.strokeStyle='#8B6040';ctx.lineWidth=2;ctx.stroke();
    // name sign
    ctx.beginPath();ctx.roundRect(x+w/2-18,y+30,36,14,3);
    ctx.fillStyle='#F5E0C0';ctx.fill();ctx.strokeStyle='#C4A070';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle='#8B5030';ctx.font='bold 8px -apple-system,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('Hannah',x+w/2,y+37);
  }

  // ── Drawing: Ground + Nature ──────────────────────────────────────
  function drawGround() {
    // full-width ground strip
    ctx.beginPath();ctx.rect(0,GROUND,CW,CH-GROUND);ctx.fillStyle='#7CB87A';ctx.fill();
    // grass tufts
    for(let i=0;i<24;i++){
      const gx=8+(i/23)*(CW-16);
      ctx.strokeStyle=i%3===0?'#4A8A4A':'#5A9A5A';ctx.lineWidth=1.8;ctx.lineCap='round';
      [[-3,9],[0,11],[3,8]].forEach(([ox,th])=>{
        ctx.beginPath();ctx.moveTo(gx+ox,GROUND-1);ctx.lineTo(gx+ox,GROUND-1-th);ctx.stroke();
      });
    }
    // trees
    [CW*.3,CW*.5,CW*.7,CW*.88].forEach((tx,i)=>{
      ctx.beginPath();ctx.roundRect(tx-3,GROUND-22,6,22,2);ctx.fillStyle='#8B6030';ctx.fill();
      [[0,-36,18],[0,-50,13],[0,-59,9]].forEach(([ox,oy,r])=>{
        ctx.beginPath();ctx.arc(tx+ox,GROUND+oy,r,0,Math.PI*2);
        ctx.fillStyle=i%2===0?'#5A9A3A':'#4A8A30';ctx.fill();
      });
    });
  }

  // ── Drawing: Speech bubble ────────────────────────────────────────
  function drawBubble(x,y,text){
    ctx.font='11px -apple-system,sans-serif';
    const tw=ctx.measureText(text).width,bw=tw+18,bh=22;
    const bx=Math.max(4,Math.min(x-bw/2,CW-bw-4)),by=y-bh-8;
    ctx.beginPath();ctx.roundRect(bx,by,bw,bh,7);ctx.fillStyle='white';ctx.fill();
    ctx.strokeStyle='#ddd';ctx.lineWidth=1.2;ctx.stroke();
    ctx.beginPath();ctx.moveTo(x-5,by+bh);ctx.lineTo(x+5,by+bh);ctx.lineTo(x,by+bh+7);ctx.closePath();
    ctx.fillStyle='white';ctx.fill();
    ctx.fillStyle='#333';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,bx+bw/2,by+bh/2);
  }

  // ── Input ─────────────────────────────────────────────────────────
  let mx=0,my=0,pmx=0,pmy=0;

  function pos(e){
    const r=canvas.getBoundingClientRect(),sx=CW/r.width,sy=CH/r.height;
    const s=e.touches?e.touches[0]:e;
    return{x:(s.clientX-r.left)*sx,y:(s.clientY-r.top)*sy};
  }

  function nearHannah(x,y,r=45){return Math.hypot(x-G.x-16,y-G.y+30)<r;}
  function nearHouse(x){return x<HOME_ZONE;}

  canvas.addEventListener('mousedown',e=>{
    const{x,y}=pos(e);
    // click poop
    for(let i=G.poops.length-1;i>=0;i--){
      const p=G.poops[i];
      if(!p.popping&&Math.hypot(x-p.x,y-p.y)<p.r+8){
        p.popping=true;p.popT=0;
        for(let j=0;j<8;j++) G.particles.push({x:p.x,y:p.y,vx:(Math.random()-.5)*4,vy:-Math.random()*3-.5,life:.5,col:'#3D1A08'});
        return;
      }
    }
    // drag hannah (or from house door)
    const fromHouse=G.state==='inside'&&x>=HOUSE_X&&x<=HOUSE_X+HOUSE_W&&y>=HOUSE_TOP;
    if(fromHouse||nearHannah(x,y)){
      G.dragging=true;G.prevState=G.state;G.state='dragging';
      G.dragOx=x-G.x;G.dragOy=y-G.y;
    }
  });

  canvas.addEventListener('mousemove',e=>{
    const{x,y}=pos(e);pmx=mx;pmy=my;mx=x;my=y;
    // petting
    if(!G.dragging&&G.state!=='inside'&&nearHannah(x,y,48)){
      const spd=Math.hypot(x-pmx,y-pmy);
      if(spd>.3&&spd<4){
        G.happy=Math.min(100,G.happy+.15);
        if(Math.random()<.05) G.hearts.push({x:G.x+16+(Math.random()-.5)*28,y:G.y-52,life:1.2,max:1.2,a:1});
      }
    }
    if(G.dragging){G.x=x-G.dragOx;G.y=y-G.dragOy;}
  });

  canvas.addEventListener('mouseup',e=>{
    if(!G.dragging)return;
    const{x}=pos(e);
    G.dragging=false;
    G.y=GROUND;
    if(nearHouse(x)){
      G.state='to_house';
    } else {
      G.state='walking';
      G.vx=(Math.random()>.5?1:-1)*.5;
      G.facing=G.vx>0?1:-1;
    }
  });

  // touch
  ['touchstart','touchmove','touchend'].forEach(ev=>{
    canvas.addEventListener(ev,e=>{e.preventDefault();canvas.dispatchEvent(new MouseEvent(ev==='touchstart'?'mousedown':ev==='touchend'?'mouseup':'mousemove',{clientX:e.touches[0]?.clientX||e.changedTouches[0].clientX,clientY:e.touches[0]?.clientY||e.changedTouches[0].clientY}));},{passive:false});
  });

  // Dashboard buttons
  document.getElementById('h-feed').onclick=()=>{
    G.hunger=Math.min(100,G.hunger+40);G.flash='yum! 😋';G.flashTimer=2;
    spawnParticles(G.x+16,G.y-30,'#E8803A');
  };
  document.getElementById('h-toy').onclick=()=>{
    G.happy=Math.min(100,G.happy+35);G.flash='yay! 🧸';G.flashTimer=2;
    spawnParticles(G.x+16,G.y-30,'#E8C830');
  };
  document.getElementById('h-pet').onclick=()=>{
    G.happy=Math.min(100,G.happy+20);
    G.hearts.push({x:G.x+16,y:G.y-52,life:1.2,max:1.2,a:1});
    G.hearts.push({x:G.x+30,y:G.y-60,life:1.0,max:1.0,a:1});
  };

  // ── Helpers ───────────────────────────────────────────────────────
  function spawnParticles(x,y,col){
    for(let i=0;i<10;i++) G.particles.push({x,y,vx:(Math.random()-.5)*5,vy:-Math.random()*4,life:.7,col});
  }

  // ── Update ────────────────────────────────────────────────────────
  let lastT=0;
  function update(dt){
    G.t+=dt;G.t_anim+=dt;

    // needs drain
    if(G.state!=='inside'){
      G.hunger=Math.max(0,G.hunger-.025*dt*60);
      G.happy =Math.max(0,G.happy -.018*dt*60);
      G.energy=Math.max(0,G.energy-.012*dt*60);
    } else {
      G.energy=Math.min(100,G.energy+.12*dt*60);
      G.hunger=Math.max(0,G.hunger-.006*dt*60);
    }

    // bladder on walk
    if(G.state==='walking'){
      G.bladder=Math.min(100,G.bladder+.10*dt*60);
      if(G.bladder>=100){
        G.bladder=0;
        G.poops.push({x:G.x+10,y:GROUND-6,r:8,popping:false,popT:0});
      }
    } else {
      G.bladder=Math.max(0,G.bladder-.015*dt*60);
    }

    // request
    if(G.reqTimer>0){G.reqTimer-=dt;if(G.reqTimer<=0)G.request=null;}
    if(!G.request&&G.t-G.lastReq>15){
      if(G.hunger<30)      G.request='🍖 hungry!';
      else if(G.energy<25) G.request='💤 sleepy...';
      else if(G.happy<30)  G.request=Math.random()<.5?'🧸 teddy?':'🐾 pet me!';
      if(G.request){G.reqTimer=7;G.lastReq=G.t;}
    }

    if(G.flashTimer>0) G.flashTimer-=dt;
    else G.flash=null;

    // hearts
    G.hearts=G.hearts.filter(h=>{h.y-=.5;h.life-=dt;h.a=h.life/h.max;return h.life>0;});

    // particles
    G.particles=G.particles.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.life-=dt;return p.life>0;});

    // poops
    G.poops=G.poops.filter(p=>{if(p.popping){p.popT+=dt;return p.popT<.4;}return true;});

    // movement
    if(!G.dragging) move(dt);
  }

  function move(dt){
    G.y=GROUND;
    if(G.state==='walking'){
      G.x+=G.vx;
      const minX=HOME_ZONE+20,maxX=CW-60;
      if(G.x>maxX){G.x=maxX;G.vx=-Math.abs(G.vx);G.facing=-1;}
      if(G.x<minX){G.x=minX;G.vx=Math.abs(G.vx);G.facing=1;}
      G.facing=G.vx>0?1:-1;
      if(Math.random()<.002)G.vx=-G.vx;
    } else if(G.state==='to_house'){
      const tx=HOUSE_X+HOUSE_W/2-16,dx=tx-G.x;
      if(Math.abs(dx)<3){G.x=tx;G.state='inside';}
      else{G.x+=Math.sign(dx)*1.2;G.facing=dx>0?1:-1;}
    } else if(G.state==='inside'){
      G.x=HOUSE_X+HOUSE_W/2-16;
    } else if(G.state==='idle'){
      G.x=HOUSE_X+HOUSE_W+10;
    }
  }

  // ── Draw ──────────────────────────────────────────────────────────
  function draw(){
    ctx.clearRect(0,0,CW,CH);
    drawGround();
    drawHouse();

    // poops (brown circles)
    G.poops.forEach(p=>{
      const sc=p.popping?Math.max(0,1+p.popT*3):1;
      ctx.save();ctx.translate(p.x,p.y);ctx.scale(sc,sc);
      ctx.globalAlpha=p.popping?Math.max(0,1-p.popT*2.5):1;
      ctx.beginPath();ctx.arc(0,0,p.r,0,Math.PI*2);
      ctx.fillStyle='#3D1A08';ctx.fill();
      ctx.beginPath();ctx.arc(-2,-2,p.r*.4,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fill();
      ctx.globalAlpha=1;ctx.restore();
    });

    // hannah
    if(G.state!=='inside'){
      ctx.save();ctx.translate(G.x,G.y);
      if(G.hFacing!=null&&G.facing===-1)ctx.scale(-1,1);
      const walking=G.state==='walking'||G.state==='to_house'||G.state==='dragging';
      drawHannah(G.t, walking?Math.sin(G.t*6)*14:0, walking?Math.sin(G.t*6)*1.5:0, false);
      ctx.restore();
    } else {
      // peek from door
      ctx.save();ctx.translate(HOUSE_X+HOUSE_W/2-8,GROUND);
      ctx.scale(.55,.55);
      drawHannah(G.t,0,Math.sin(G.t*.8)*2,false);
      ctx.restore();
    }

    // hearts
    G.hearts.forEach(h=>{ctx.globalAlpha=h.a;ctx.font='15px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('❤️',h.x,h.y);ctx.globalAlpha=1;});

    // speech / flash
    if(G.flash&&G.flashTimer>0) drawBubble(G.x+16,G.y-65,G.flash);
    else if(G.request&&G.reqTimer>0) drawBubble(G.x+16,G.y-65,G.request);

    // particles
    G.particles.forEach(p=>{ctx.save();ctx.globalAlpha=p.life*1.5;ctx.fillStyle=p.col;ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fill();ctx.restore();});

    // drag hint on house when inside
    if(G.state==='inside'){
      ctx.fillStyle='rgba(100,120,80,0.6)';ctx.font='9px -apple-system,sans-serif';ctx.textAlign='center';
      ctx.fillText('drag to walk',HOUSE_X+HOUSE_W/2,HOUSE_TOP-6);
    }
  }

  // fix facing ref
  Object.defineProperty(G,'hFacing',{get:()=>G.facing,configurable:true});

  // ── Loop ──────────────────────────────────────────────────────────
  G.x=HOUSE_X+HOUSE_W/2-16; G.y=GROUND;

  function loop(ts){
    const dt=Math.min((ts-lastT)/1000,.05);lastT=ts;
    update(dt);draw();requestAnimationFrame(loop);
  }
  requestAnimationFrame(ts=>{lastT=ts;requestAnimationFrame(loop);});
})();
