/* Elevionis · juegos estilo Wordwall. Datos en window.WW:
   {tag,title,sub, pairs:[[word,meaning]], qs:[[q,[opts],correct]], items:[[sentence,cue,extra]],
    groups:{name:[words]}, speak:[prompts], games:[ids opcional]}  */
(function(){
const D=window.WW||{}, $=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const sh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pairs=D.pairs||[], qs=D.qs||[], items=D.items||[], words=pairs.map(p=>p[0]);
let AC; function tone(f,d=.12,type='sine'){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.value=.08;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.stop(AC.currentTime+d)}catch(e){}}
const good=()=>{tone(660);setTimeout(()=>tone(880),90)}, bad=()=>tone(180,.25,'square');
const KEY='ww:'+location.pathname;
function best(id,v){try{const o=JSON.parse(localStorage.getItem(KEY)||'{}');if(v!=null&&(o[id]==null||v>o[id])){o[id]=v;localStorage.setItem(KEY,JSON.stringify(o))}return o[id]}catch(e){return null}}

const G={
 matchup:{ic:'🧩',n:'Match up',d:'Put each word next to its meaning',ok:()=>pairs.length>=3},
 findmatch:{ic:'🎯',n:'Find the match',d:'Tap the word for each meaning',ok:()=>pairs.length>=4},
 memory:{ic:'🃏',n:'Flip tiles',d:'Find the pairs',ok:()=>pairs.length>=4},
 quiz:{ic:'❓',n:'Quiz',d:'Answer before time runs out',ok:()=>qs.length>=3},
 truefalse:{ic:'✅',n:'True or false',d:'Is the meaning right?',ok:()=>pairs.length>=4},
 whack:{ic:'🔨',n:'Whack-a-mole',d:'Hit the right word fast',ok:()=>pairs.length>=4},
 anagram:{ic:'🔤',n:'Anagram',d:'Put the letters in order',ok:()=>words.some(w=>/^[a-z' -]{3,12}$/i.test(w))},
 hangman:{ic:'🪢',n:'Hangman',d:'Guess the word, letter by letter',ok:()=>words.some(w=>/^[a-z' -]{3,14}$/i.test(w))},
 unscramble:{ic:'🧱',n:'Unscramble',d:'Build the sentence',ok:()=>items.length>=3},
 groupsort:{ic:'🗂️',n:'Group sort',d:'Drop each word in its group',ok:()=>D.groups&&Object.keys(D.groups).length>=2},
 wheel:{ic:'🎡',n:'Spin the wheel',d:'Spin and speak',ok:()=>(D.speak&&D.speak.length>=4)||words.length>=4}
};
const root=$('div','ww');document.body.appendChild(root);
function header(){return `<a href="${D.home||'https://app.elevionis.com'}"><img src="../assets/logo-color.svg" alt="Elevionis" style="height:28px"></a><div style="margin-top:12px"><span class="tag">${esc(D.tag||'')}</span></div><h1>${esc(D.title||'Play')}</h1><p class="sub">${esc(D.sub||'Choose a game.')}</p>`}
function menu(){
 root.innerHTML=header();const m=$('div','ww-menu');
 (D.games||Object.keys(G)).filter(k=>G[k]&&G[k].ok()).forEach(k=>{const b=$('button','ww-card',`<div class="ic">${G[k].ic}</div><b>${G[k].n}</b><small>${G[k].d}</small>${best(k)!=null?`<span class="ww-best">Best: ${best(k)}</span>`:''}`);b.onclick=()=>play(k);m.appendChild(b)});
 root.appendChild(m);
}
let timerId=null;
function play(id){
 clearInterval(timerId);root.innerHTML=header();
 const st=$('div','ww-stage'),bar=$('div','ww-bar'),body=$('div');
 bar.innerHTML=`<div class="left"><button class="ww-btn ghost" id="wwb">← Games</button><p class="ww-title">${G[id].ic} ${G[id].n}</p></div><div class="left"><span class="ww-chip" id="wws">⭐ 0</span><span class="ww-chip t" id="wwt">⏱ 0</span></div>`;
 st.append(bar,body);root.appendChild(st);bar.querySelector('#wwb').onclick=()=>{clearInterval(timerId);menu()};
 const S={score:0,right:0,total:0,t:0,down:null,body,st,id};
 S.add=n=>{S.score=Math.max(0,S.score+n);bar.querySelector('#wws').textContent='⭐ '+S.score};
 S.fb=ok=>{ok?good():bad();const f=$('div','ww-fb',ok?'✔️':'✖️');st.appendChild(f);setTimeout(()=>f.remove(),450)};
 S.clock=(down,onEnd)=>{S.down=down;S.t=down||0;const el=bar.querySelector('#wwt');const r=()=>el.textContent='⏱ '+S.t;r();timerId=setInterval(()=>{S.t+=down?-1:1;r();if(down&&S.t<=0){clearInterval(timerId);onEnd()}},1000)};
 S.end=(extra)=>{clearInterval(timerId);let sc=S.score;if(!S.down&&S.total)sc+=Math.max(0,S.total*5-S.t);const pct=S.total?S.right/S.total:1,stars=pct>=.9?3:pct>=.6?2:1;const b=best(id,sc);
  body.innerHTML=`<div class="ww-end"><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><div class="score">${sc}</div><p>${S.right} / ${S.total} correct${S.down==null?'':''} · Best: ${b}</p>${extra||''}<p><button class="ww-btn" id="wwa">Play again</button> <button class="ww-btn ghost" id="wwm">Other games</button></p></div>`;
  body.querySelector('#wwa').onclick=()=>play(id);body.querySelector('#wwm').onclick=menu;tone(523);setTimeout(()=>tone(659),120);setTimeout(()=>tone(784),240)};
 T[id](S);
}
const pick=(a,n)=>sh(a).slice(0,n);
const T={
 matchup(S){const P=pick(pairs,Math.min(8,pairs.length));S.total=P.length;S.clock(0);let sel=null;
  S.body.innerHTML='<p class="ww-hint">Tap a word, then tap its meaning. Press Submit to check.</p>';const tiles=$('div','ww-tiles'),grid=$('div','ww-match');grid.style.gridTemplateColumns='1fr';grid.style.marginTop='14px';
  const placed=new Map();
  sh(P).forEach(p=>{const t=$('button','ww-tile',esc(p[0]));t.onclick=()=>{if(t.classList.contains('gone'))return;tiles.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));sel=t;t.classList.add('sel')};t.dataset.w=p[0];tiles.appendChild(t)});
  P.forEach(p=>{const s=$('div','ww-slot'),d=$('div','drop','?');s.append(d,$('span','',esc(p[1])));s.onclick=()=>{if(placed.has(s)){const t=placed.get(s);t.classList.remove('gone');placed.delete(s);d.textContent='?';return}if(!sel)return;placed.set(s,sel);d.textContent=sel.dataset.w;sel.classList.remove('sel');sel.classList.add('gone');sel=null};s.dataset.m=p[0];grid.appendChild(s)});
  const go=$('button','ww-btn','Submit answers');go.style.marginTop='16px';go.onclick=()=>{grid.querySelectorAll('.ww-slot').forEach(s=>{const t=placed.get(s),ok=t&&t.dataset.w===s.dataset.m;s.classList.add(ok?'ok':'bad');if(ok){S.right++;S.add(10)}});setTimeout(()=>S.end(),900)};
  S.body.append(tiles,grid,go)},
 findmatch(S){let P=sh(pairs).slice(0,Math.min(10,pairs.length));S.total=P.length;S.clock(0);const q=$('div','ww-q'),tiles=$('div','ww-tiles');S.body.append($('p','ww-hint','Tap the word that matches the meaning.'),q,tiles);
  const order=sh(P);let i=0;P.forEach(p=>{const t=$('button','ww-tile',esc(p[0]));t.onclick=()=>{if(i>=order.length||t.classList.contains('gone'))return;if(p===order[i]){S.right++;S.add(10);S.fb(1);t.classList.add('gone');i++;i<order.length?ask():S.end()}else{S.add(-3);S.fb(0);t.classList.add('bad');setTimeout(()=>t.classList.remove('bad'),400);}};tiles.appendChild(t)});
  const ask=()=>q.textContent=order[i][1];ask()},
 memory(S){const P=pick(pairs,Math.min(8,pairs.length));S.total=P.length;S.clock(0);const g=$('div','ww-grid');S.body.append($('p','ww-hint','Flip two tiles: a word and its meaning.'),g);
  let open=[],tries=0;sh(P.flatMap((p,k)=>[[p[0],k],[p[1],k]])).forEach(c=>{const b=$('button','ww-flip','?');b.onclick=()=>{if(b.classList.contains('open')||b.classList.contains('done')||open.length==2)return;b.textContent=c[0];b.classList.add('open');open.push([b,c[1]]);if(open.length==2){tries++;const [x,y]=open;if(x[1]==y[1]){good();setTimeout(()=>{x[0].className=y[0].className='ww-flip done';open=[];S.right++;S.add(10);if(S.right==P.length)S.end(`<p>${tries} tries</p>`)},300)}else{setTimeout(()=>{x[0].className=y[0].className='ww-flip';x[0].textContent=y[0].textContent='?';open=[]},900)}}};g.appendChild(b)})},
 quiz(S){const Q=sh(qs).slice(0,Math.min(12,qs.length));S.total=Q.length;let i=0,lives=3;S.clock(Q.length*12,()=>S.end());const show=()=>{const [q,o,c]=Q[i];S.body.innerHTML=`<p class="ww-hint">Question ${i+1} / ${Q.length} · ${'❤️'.repeat(lives)}</p><div class="ww-q">${esc(q)}</div>`;const box=$('div','ww-opts');sh(o.map((t,k)=>[t,k])).forEach(([t,k],n)=>{const b=$('button','ww-opt c'+(n%6),esc(t));b.onclick=()=>{box.querySelectorAll('button').forEach(x=>x.disabled=true);const ok=k===c;if(ok){S.right++;S.add(10+Math.min(5,S.t%6))}else{lives--;box.children[[...box.children].findIndex(x=>x.textContent===o[c])].classList.add('ok');b.classList.add('bad')}S.fb(ok);setTimeout(()=>{i++;(i<Q.length&&lives>0)?show():S.end()},ok?600:1300)};box.appendChild(b)});S.body.appendChild(box)};show()},
 truefalse(S){const R=sh(pairs).slice(0,Math.min(14,pairs.length)).map(p=>{const t=Math.random()<.5;return[p[0],t?p[1]:sh(pairs.filter(x=>x!==p))[0][1],t]});S.total=R.length;let i=0;S.clock(Math.max(30,R.length*5),()=>S.end());
  const show=()=>{const [w,m,t]=R[i];S.body.innerHTML=`<p class="ww-hint">${i+1} / ${R.length}</p><div class="ww-big">${esc(w)}</div><div class="ww-q" style="font-weight:600">= ${esc(m)}</div>`;const box=$('div','ww-tf');[['True',true,'c3'],['False',false,'c1']].forEach(([l,v,c])=>{const b=$('button','ww-opt '+c,l);b.onclick=()=>{const ok=v===t;if(ok){S.right++;S.add(10)}else S.add(-2);S.fb(ok);i++;i<R.length?setTimeout(show,350):S.end()};box.appendChild(b)});S.body.appendChild(box)};show()},
 whack(S){const R=sh(pairs).slice(0,Math.min(10,pairs.length));S.total=R.length;let i=0,iv;const q=$('div','ww-q'),holes=$('div','ww-holes');S.body.append($('p','ww-hint','Hit the mole with the right word.'),q,holes);for(let k=0;k<6;k++)holes.appendChild($('div','ww-hole'));
  const next=()=>{if(i>=R.length){clearInterval(iv);return S.end()}q.textContent=R[i][1]};
  const pop=()=>{[...holes.children].forEach(h=>h.innerHTML='');const target=R[i];if(!target)return;const ws=sh([target[0],...pick(words.filter(w=>w!==target[0]),2)]);const hs=pick([...holes.children],3);ws.forEach((w,k)=>{const b=$('button','ww-mole',esc(w));b.onclick=()=>{const ok=w===target[0];S.fb(ok);if(ok){S.right++;S.add(10);i++;next()}else S.add(-3);[...holes.children].forEach(h=>h.innerHTML='');};hs[k].appendChild(b)})};
  next();pop();iv=setInterval(pop,1700);S.clock(45,()=>{clearInterval(iv);S.end()});const old=S.end;S.end=x=>{clearInterval(iv);old(x)}},
 anagram(S){const W=sh(words.filter(w=>/^[a-z' -]{3,12}$/i.test(w))).slice(0,8);S.total=W.length;let i=0;S.clock(0);
  const show=()=>{const w=W[i].toLowerCase(),letters=w.replace(/ /g,'').split('');let mix=sh(letters);if(mix.join('')===letters.join('')&&letters.length>1)mix=mix.reverse();const ans=[];S.body.innerHTML=`<p class="ww-hint">${i+1} / ${W.length} · ${esc((pairs.find(p=>p[0]===W[i])||[])[1]||'')}</p>`;const a=$('div','ww-answer'),k=$('div','ww-tiles');
   mix.forEach(ch=>{const t=$('button','ww-tile',esc(ch));t.onclick=()=>{if(t.classList.contains('gone'))return;t.classList.add('gone');ans.push([ch,t]);draw();if(ans.length===letters.length){const ok=ans.map(x=>x[0]).join('')===letters.join('');S.fb(ok);if(ok){S.right++;S.add(10)}setTimeout(()=>{i++;i<W.length?show():S.end()},ok?600:1200);if(!ok)a.innerHTML=`<span class="ww-big" style="margin:0">${esc(w)}</span>`}};k.appendChild(t)});
   const draw=()=>{a.innerHTML='';ans.forEach(([ch,t],n)=>{const b=$('button','ww-tile sel',esc(ch));b.onclick=()=>{t.classList.remove('gone');ans.splice(n,1);draw()};a.appendChild(b)})};
   S.body.append(a,k)};show()},
 hangman(S){const W=sh(words.filter(w=>/^[a-z' -]{3,14}$/i.test(w))).slice(0,6);S.total=W.length;let i=0;S.clock(0);
  const show=()=>{const w=W[i].toLowerCase();let miss=0;const got=new Set([' ','-',"'"]);S.body.innerHTML=`<p class="ww-hint">${i+1} / ${W.length} · Clue: ${esc((pairs.find(p=>p[0]===W[i])||[])[1]||'')}</p>`;const h=$('div','ww-hang'),wd=$('div','ww-word'),k=$('div','ww-keys');
   const draw=()=>{h.textContent='❤️'.repeat(6-miss)+'🤍'.repeat(miss);wd.innerHTML=w.split('').map(c=>`<div class="ww-box">${got.has(c)?esc(c):''}</div>`).join('')};
   'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c=>{const b=$('button','ww-key',c);b.onclick=()=>{b.disabled=true;if(w.includes(c)){got.add(c);good()}else{miss++;bad()}draw();const win=w.split('').every(x=>got.has(x));if(win||miss>=6){if(win){S.right++;S.add(10+(6-miss)*2)}else w.split('').forEach(x=>got.add(x)),draw();k.querySelectorAll('button').forEach(x=>x.disabled=true);setTimeout(()=>{i++;i<W.length?show():S.end()},1100)}};k.appendChild(b)});draw();S.body.append(h,wd,k)};show()},
 unscramble(S){const I=sh(items).slice(0,Math.min(8,items.length));S.total=I.length;let i=0;S.clock(0);
  const show=()=>{const [sent,cue]=I[i],target=sent.split(' ');const ans=[];S.body.innerHTML=`<p class="ww-hint">${i+1} / ${I.length}${cue?' · '+esc(cue):''}</p>`;const a=$('div','ww-answer'),k=$('div','ww-tiles');
   sh(target.map((w,n)=>[w,n])).forEach(([w])=>{const t=$('button','ww-tile',esc(w));t.onclick=()=>{if(t.classList.contains('gone'))return;t.classList.add('gone');ans.push([w,t]);draw()};k.appendChild(t)});
   const draw=()=>{a.innerHTML='';ans.forEach(([w,t],n)=>{const b=$('button','ww-tile sel',esc(w));b.onclick=()=>{t.classList.remove('gone');ans.splice(n,1);draw()};a.appendChild(b)})};
   const go=$('button','ww-btn','Check');go.onclick=()=>{if(ans.length<target.length)return;const ok=ans.map(x=>x[0]).join(' ')===sent;S.fb(ok);if(ok){S.right++;S.add(10)}else a.innerHTML=`<span style="font-weight:800;color:var(--ink)">${esc(sent)}</span>`;go.disabled=true;setTimeout(()=>{i++;i<I.length?show():S.end()},ok?600:1600)};
   const c=$('p');c.style.textAlign='center';c.appendChild(go);S.body.append(a,k,c)};show()},
 groupsort(S){const gs=Object.keys(D.groups),all=sh(gs.flatMap(g=>D.groups[g].map(w=>[w,g])));S.total=all.length;S.clock(0);let sel=null;
  const tiles=$('div','ww-tiles'),box=$('div','ww-groups');S.body.append($('p','ww-hint','Tap a word, then tap its group.'),tiles,box);
  all.forEach(([w,g])=>{const t=$('button','ww-tile',esc(w));t.onclick=()=>{tiles.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));sel=[t,g];t.classList.add('sel')};tiles.appendChild(t)});
  let left=all.length;gs.forEach(g=>{const d=$('div','ww-group',`<h4>${esc(g)}</h4>`);d.onclick=()=>{if(!sel)return;const [t,gg]=sel;if(gg===g){S.fb(1);S.right++;S.add(10);t.className='ww-tile ok';d.appendChild(t);t.onclick=null;sel=null;if(--left===0)S.end()}else{S.fb(0);S.add(-3);t.classList.add('bad');setTimeout(()=>t.classList.remove('bad'),400)}};box.appendChild(d)})},
 wheel(S){const P=(D.speak&&D.speak.length>=4?D.speak:words.map(w=>'Say a sentence with “'+w+'”.')).slice(0,12);S.total=0;S.clock(0);
  const n=P.length,cv=$('canvas','ww-wheel');cv.width=cv.height=360;const out=$('div','ww-big','Press Spin!'),btn=$('button','ww-btn','Spin');const c=$('p');c.style.textAlign='center';c.appendChild(btn);S.body.append(cv,c,out);
  const ctx=cv.getContext('2d'),cols=['#551CE3','#e0457b','#f39c12','#16a085','#2e86de','#8e44ad'];let ang=0;
  const draw=()=>{ctx.clearRect(0,0,360,360);for(let k=0;k<n;k++){ctx.beginPath();ctx.moveTo(180,180);ctx.arc(180,180,170,ang+k*2*Math.PI/n,ang+(k+1)*2*Math.PI/n);ctx.fillStyle=cols[k%6];ctx.fill();ctx.save();ctx.translate(180,180);ctx.rotate(ang+(k+.5)*2*Math.PI/n);ctx.fillStyle='#fff';ctx.font='bold 16px sans-serif';ctx.fillText(String(k+1),120,6);ctx.restore()}ctx.beginPath();ctx.moveTo(345,180);ctx.lineTo(370,168);ctx.lineTo(370,192);ctx.fillStyle='#220C47';ctx.fill();ctx.beginPath();ctx.arc(180,180,24,0,7);ctx.fillStyle='#fff';ctx.fill()};draw();
  btn.onclick=()=>{btn.disabled=true;let v=.35+Math.random()*.25;const spin=()=>{ang+=v;v*=.985;draw();if(v>.002){tone(300+(Math.random()*80),.03);requestAnimationFrame(spin)}else{const a=((-ang)%(2*Math.PI)+2*Math.PI)%(2*Math.PI),k=Math.floor(a/(2*Math.PI/n))%n;out.textContent=(k+1)+'. '+P[k];good();btn.disabled=false}};spin()}}
};
const h=location.hash.slice(1);h&&G[h]&&G[h].ok()?play(h):menu();
})();
