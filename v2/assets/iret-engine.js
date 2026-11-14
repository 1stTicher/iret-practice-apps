/* IRET practice-app engine v1 (Nov 2026). Page sets window.APPSPEC={title,sub,footer,acts}. */
(function(){const S=window.APPSPEC;document.title=S.title;
const st=document.createElement('style');st.textContent=':root{--wine:#6B3A33;--gold:#C5A059;--bg:#FBF6EC;--card:#FFFFFF;--soft:#F6ECE4;--text:#1A1A1A;--muted:#555555;--ok:#2D7A4A;--okbg:#E3F1E8;--bad:#B04545;--badbg:#F8E5E5;--line:#EADFC8}*{box-sizing:border-box}body{margin:0;font-family:Arial,Helvetica,sans-serif;background:var(--bg);color:var(--text)}header{background:var(--wine);color:#fff;padding:14px 18px}header h1{margin:0;font-size:22px}header p{margin:4px 0 0;font-size:14px;opacity:.9}main{max-width:860px;margin:0 auto;padding:16px}.progress{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 14px}.dot{width:34px;height:34px;border-radius:50%;border:2px solid var(--gold);background:#fff;color:var(--wine);font-weight:bold;cursor:pointer}.dot.done{background:var(--okbg)}.dot.active{background:var(--wine)!important;color:#fff!important;border-color:var(--wine)}.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px}.card h2{margin:0 0 4px;color:var(--wine);font-size:20px}.instr{margin:0 0 14px;color:var(--muted)}.item{border-top:1px solid var(--line);padding:12px 0}.item:first-of-type{border-top:none}.q{font-weight:bold;margin-bottom:8px}.opts{display:flex;flex-wrap:wrap;gap:8px}.opt{border:2px solid var(--line);background:#fff;border-radius:20px;padding:7px 14px;cursor:pointer;font-size:15px}.opt.sel{border-color:var(--wine);background:var(--soft)}.item.correct .opt.sel,.item.correct .answerline{border-color:var(--ok);background:var(--okbg)}.item.wrong .opt.sel,.item.wrong .answerline{border-color:var(--bad);background:var(--badbg)}.fb{margin-top:6px;font-size:14px;min-height:18px}.item.correct .fb{color:var(--ok)}.item.wrong .fb{color:var(--bad)}.hint{display:none;margin-top:6px;font-size:14px;color:var(--wine);background:var(--soft);padding:6px 10px;border-radius:8px}.showhints .hint{display:block}.tiles{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}.tile{border:1px solid var(--gold);background:#FBF3E4;border-radius:6px;padding:6px 10px;cursor:pointer;font-size:15px}.tile.used{visibility:hidden}.answerline{min-height:40px;border:2px dashed var(--line);border-radius:8px;padding:6px;display:flex;flex-wrap:wrap;gap:6px}.answerline .tile{background:#fff}.controls{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}button.ctl{font-family:inherit;font-size:15px;border-radius:8px;padding:9px 14px;cursor:pointer;border:2px solid var(--wine);background:#fff;color:var(--wine)}button.ctl.primary{background:var(--wine);color:#fff}.score{margin-top:10px;font-weight:bold;color:var(--wine);min-height:20px}.nav{display:flex;justify-content:space-between;margin-top:14px}table.sum{width:100%;border-collapse:collapse;margin-top:10px}table.sum td,table.sum th{border-bottom:1px solid var(--line);padding:8px;text-align:left}footer{text-align:center;color:var(--muted);font-size:12px;padding:18px}.passage{background:var(--soft);border-left:4px solid var(--gold);border-radius:8px;padding:12px 14px;margin:0 0 12px;line-height:1.55}.frame li{margin:6px 0;line-height:1.45}.prompt{font-size:18px;font-weight:bold;color:var(--wine);background:var(--soft);border-radius:10px;padding:12px;margin:10px 0}.clock{font-size:44px;font-weight:bold;text-align:center;color:var(--wine);margin:8px 0}.phase{text-align:center;color:var(--muted);font-weight:bold}.model{display:none;background:#fff;border:1px dashed var(--gold);border-radius:8px;padding:10px;margin-top:10px;line-height:1.5}.showmodel .model{display:block}.check li{margin:4px 0}';document.head.appendChild(st);
document.body.innerHTML=`<header style="display:flex;align-items:center;gap:14px"><img src="https://images.squarespace-cdn.com/content/v1/6421111b671d492484830eb6/73928abf-12ab-451f-8998-35176406f598/logotipo.png?format=300w" alt="Irvin Romo English Teacher" style="height:46px;border-radius:6px;background:#fff;padding:2px"><div><h1>${S.title}</h1><p>${S.sub}</p></div></header><main><div class="progress" id="progress"></div><div class="card" id="stage"></div><div class="nav"><button class="ctl" id="back">← Back</button><button class="ctl primary" id="next">Next →</button></div></main><footer>Irvin Romo · English Teacher · ${S.footer}</footer>`;})();
const ACTIVITIES=window.APPSPEC.acts;

// ---- speaking trainer (open speaking; no automatic score) ----
let tmr=null;
function renderTimer(a,s){
  s.p = s.p||0;
  stage.innerHTML=`<h2>${current+1}. ${a.title}</h2><p class="instr">${a.instr}</p>
  <ol class="frame">${a.frame.map(f=>`<li>${f}</li>`).join('')}</ol>
  <div class="prompt" id="prompt">${a.prompts[s.p]}</div>
  <div class="phase" id="phase">Ready?</div><div class="clock" id="clock">0:${String(a.prep||15).padStart(2,"0")}</div>
  <div class="controls"><button class="ctl primary" id="go">Start (${a.prep||15} s prepare → ${a.speak||45} s speak)</button><button class="ctl" id="stop">Stop</button><button class="ctl" id="newq">Another question</button><button class="ctl" id="mdl">Show model answer</button></div>
  <div class="${s.model?'showmodel':''}"><div class="model">${a.model}</div></div>
  <p class="instr" style="margin-top:12px"><strong>After speaking, check:</strong></p>
  <ul class="check">${(a.checks||[]).map(c=>`<li><label><input type="checkbox"> ${c}</label></li>`).join("")}</ul>
  <div class="score">Open speaking practice — self-check only, no automatic score.</div>`;
  const clock=document.getElementById('clock'), phase=document.getElementById('phase');
  const fmt=t=>`${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`;
  function run(sec,label,next){ let t=sec; phase.textContent=label; clock.textContent=fmt(t); clearInterval(tmr);
    tmr=setInterval(()=>{ t--; clock.textContent=fmt(Math.max(t,0)); if(t<=0){ clearInterval(tmr); next&&next(); } },1000); }
  document.getElementById('go').onclick=()=>{ s.started=true; renderProgress(); run(a.prep||15,'Prepare: key words only',()=>run(a.speak||45,'Speak now!',()=>{phase.textContent='Time! Did you finish your closing sentence?';})); };
  document.getElementById('stop').onclick=()=>{ clearInterval(tmr); phase.textContent='Stopped'; };
  document.getElementById('newq').onclick=()=>{ clearInterval(tmr); s.p=(s.p+1)%a.prompts.length; renderTimer(a,s); };
  document.getElementById('mdl').onclick=()=>{ s.model=!s.model; renderTimer(a,s); };
  document.getElementById('back').disabled = current===0;
  document.getElementById('next').textContent = current===ACTIVITIES.length-1 ? 'Finish ✓' : 'Next →';
}
// deterministic shuffle so the correct option is not always first
function seeded(s){ let h=2166136261; for(const c of s){ h^=c.charCodeAt(0); h=Math.imul(h,16777619);} return ()=>{ h^=h<<13; h^=h>>>17; h^=h<<5; return ((h>>>0)%1000)/1000; }; }
function shuffle(arr, key){ const r=seeded(key), a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

const state = ACTIVITIES.map(a => ({answers:a.items.map(()=>a.type==='order'?[]:null), checked:false, score:null, hints:false}));
let current = 0, finished = false;
const stage = document.getElementById('stage');

function render(){
  clearInterval(tmr);
  renderProgress();
  if(finished){ return renderSummary(); }
  const a=ACTIVITIES[current], s=state[current];
  if(a.type==='timer') return renderTimer(a,s);
  let html=`<h2>${current+1}. ${a.title}</h2><p class="instr">${a.instr}</p>${a.passage?`<div class="passage">${a.passage}</div>`:''}${a.audio?`<p><a href="https://drive.google.com/file/d/${a.audio}/view" target="_blank" rel="noopener">Open recording in Drive</a></p><iframe title="Recording" src="https://drive.google.com/file/d/${a.audio}/preview" width="100%" height="100" allow="autoplay"></iframe><p>Listen once: overall meaning. Listen again: details.</p><button class="ctl" id="transcript">${s.transcript?'Hide transcript':'Review transcript'}</button>${s.transcript?`<div class="item"><h3>Transcript — review mode</h3><p>${a.transcript}</p></div>`:''}`:''}<div class="items ${s.hints?'showhints':''}" data-activity="${a.id}">`;
  a.items.forEach((it,i)=>{
    if(a.type==='mcq'){
      const opts=shuffle(it[1], a.id+i);
      html+=`<div class="item" data-i="${i}"><div class="q">${i+1}. ${it[0]}</div><div class="opts">${opts.map(o=>`<button class="opt${s.answers[i]===o?' sel':''}" data-v="${encodeURIComponent(o)}">${o}</button>`).join('')}</div><div class="hint">Hint: ${it[3]}</div><div class="fb"></div></div>`;
    } else {
      const tiles=shuffle(it[0], a.id+i), used=s.answers[i];
      html+=`<div class="item" data-i="${i}"><div class="q">${i+1}.</div><div class="tiles">${tiles.map((w,k)=>`<button class="tile${used.includes(k)?' used':''}" data-k="${k}">${w}</button>`).join('')}</div><div class="answerline">${used.map(k=>`<button class="tile placed" data-k="${k}">${tiles[k]}</button>`).join('')}</div><div class="hint">Hint: ${it[2]}</div><div class="fb"></div></div>`;
    }
  });
  html+=`</div><div class="controls"><button class="ctl" id="hint">Hint</button><button class="ctl primary" id="check">Check</button><button class="ctl" id="show">Show answers</button><button class="ctl" id="retry">Try again</button></div><div class="score" id="score">${s.revealed?'Review mode — answers shown; no independent score.':s.score!==null?scoreText(s.score,a.items.length):''}</div>`;
  stage.innerHTML=html;
  if(s.checked) paintCheck(false);
  bind();
  document.getElementById('back').disabled = current===0;
  document.getElementById('next').textContent = current===ACTIVITIES.length-1 ? 'Finish ✓' : 'Next →';
}

function renderProgress(){
  const p=document.getElementById('progress');
  p.innerHTML=ACTIVITIES.map((a,i)=>`<button class="dot${i===current&&!finished?' active':''}${(state[i].checked||state[i].started)?' done':''}" data-go="${i}" title="${a.title}">${i+1}</button>`).join('');
  p.querySelectorAll('.dot').forEach(d=>d.onclick=()=>{ finished=false; current=+d.dataset.go; render(); });
}

function tilesFor(i){ const a=ACTIVITIES[current]; return shuffle(a.items[i][0], a.id+i); }

function bind(){
  const a=ACTIVITIES[current], s=state[current];
  stage.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{ const i=+b.closest('.item').dataset.i; s.answers[i]=decodeURIComponent(b.dataset.v); s.checked=false; s.score=null; render(); });
  stage.querySelectorAll('.tiles .tile').forEach(b=>b.onclick=()=>{ const i=+b.closest('.item').dataset.i, k=+b.dataset.k; if(!s.answers[i].includes(k)) s.answers[i].push(k); s.checked=false; s.score=null; render(); });
  stage.querySelectorAll('.answerline .tile').forEach(b=>b.onclick=()=>{ const i=+b.closest('.item').dataset.i, k=+b.dataset.k; s.answers[i]=s.answers[i].filter(x=>x!==k); s.checked=false; s.score=null; render(); });
  if(a.audio) document.getElementById('transcript').onclick=()=>{s.transcript=!s.transcript; if(s.transcript){s.revealed=true;s.score=null;} render();};
  document.getElementById('hint').onclick=()=>{ s.hints=!s.hints; render(); };
  document.getElementById('check').onclick=()=>{ s.checked=true; s.score=s.revealed?null:countCorrect(); render(); };
  document.getElementById('show').onclick=()=>{ showAnswers(); s.checked=true; s.score=null; s.revealed=true; render(); };
  document.getElementById('retry').onclick=()=>{ state[current]={answers:a.items.map(()=>a.type==='order'?[]:null), checked:false, score:null, hints:false}; render(); };
}

function isCorrect(i){
  const a=ACTIVITIES[current], s=state[current], it=a.items[i];
  if(a.type==='mcq') return s.answers[i]===it[2];
  const tiles=tilesFor(i); return s.answers[i].map(k=>tiles[k]).join(' ')===it[1];
}
function countCorrect(){ return ACTIVITIES[current].items.reduce((n,_,i)=>n+(isCorrect(i)?1:0),0); }
function scoreText(n,t){ return `Score: ${n} / ${t}` + (n===t?' — excellent!':''); }

function paintCheck(){
  const a=ACTIVITIES[current], s=state[current];
  stage.querySelectorAll('.item').forEach(el=>{
    const i=+el.dataset.i, ok=isCorrect(i), empty=a.type==='mcq'?s.answers[i]===null:s.answers[i].length===0;
    el.classList.add(ok?'correct':'wrong');
    const right=a.type==='mcq'?a.items[i][2]:a.items[i][1].replace(' ?','?');
    el.querySelector('.fb').textContent = s.revealed ? 'Review answer: '+right : ok ? 'Correct!' : (empty ? 'Choose an answer. ' : 'Not yet. ') + 'Try the hint.';
  });
}

function showAnswers(){
  const a=ACTIVITIES[current], s=state[current];
  a.items.forEach((it,i)=>{
    if(a.type==='mcq') s.answers[i]=it[2];
    else { s.answers[i]=tileOrder(tilesFor(i), it[1]); }
  });
}

// Tile indexes that spell the answer; tiles can hold more than one word.
function tileOrder(tiles, answer){
  const taken=[]; let rest=answer;
  while(rest.length){
    const k=tiles.map((t,idx)=>idx).filter(idx=>!taken.includes(idx)&&(rest===tiles[idx]||rest.startsWith(tiles[idx]+' ')))
                 .sort((x,y)=>tiles[y].length-tiles[x].length)[0];
    if(k===undefined) break;
    taken.push(k); rest=rest.slice(tiles[k].length).trimStart();
  }
  return taken;
}

function renderSummary(){
  const total=ACTIVITIES.reduce((n,a)=>n+a.items.length,0);
  const got=state.reduce((n,s)=>n+(s.revealed?0:(s.score||0)),0);
  stage.innerHTML=`<h2>Well done!</h2><p class="instr">Here is your score for each activity. Choose an activity to practice again.</p>
   <table class="sum"><tr><th>Activity</th><th>Score</th></tr>${ACTIVITIES.map((a,i)=>`<tr><td>${i+1}. ${a.title}</td><td>${a.type==='timer'?(state[i].started?'practised — self-check':'not started'):state[i].revealed?'reviewed — no score':state[i].score===null?'not checked':state[i].score+' / '+a.items.length}</td></tr>`).join('')}
   <tr><th>Total</th><th id="total">${got} / ${total}</th></tr></table>
   <div class="controls"><button class="ctl primary" id="restart">Start again</button></div>`;
  document.getElementById('restart').onclick=()=>{ ACTIVITIES.forEach((a,i)=>state[i]={answers:a.items.map(()=>a.type==='order'?[]:null), checked:false, score:null, hints:false}); finished=false; current=0; render(); };
  document.getElementById('back').disabled=false;
  document.getElementById('next').textContent='Finish ✓';
}

document.getElementById('back').onclick=()=>{ if(finished){ finished=false; } else if(current>0){ current--; } render(); };
document.getElementById('next').onclick=()=>{ if(current<ACTIVITIES.length-1 && !finished){ current++; } else { finished=true; } render(); };
render();
