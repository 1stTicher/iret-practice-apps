/* Elevionis practice engine — unidades y juegos. Uso: window.EAPP = {...} antes de cargar este archivo. */
(function () {
  var A = window.EAPP || {};
  /* idioma de la interfaz: 'es' (por defecto) o 'en' (lecciones Elevate, solo inglés) */
  var EN = A.lang === 'en';
  var L = EN ? {
    game: 'Game', unit: 'Unit', foot: '<b>Elevionis</b> · elevionis.com', progress: 'Your progress', tap: 'Tap to flip', listen: '▶ Listen',
    order: 'Put the words in order.', check: 'Check', exact: '✓ Correct!', almost: 'Almost. Check the order and try again.', answer: 'answer',
    hint: function (c) { return 'Hint: it starts with “' + c + '…”. '; }, start: '▶ Start', reset: 'Reset', time: 'Time!', tick: 'Tick what you included:',
    secs: 'Seconds', pts: 'Points', best: 'Best', ready: 'Ready?', mrIntro: 'Match each pair. Every match is 10 points and +2 seconds.', go: 'Start',
    record: 'New record!', nice: 'Good try!', total: 'Total points. Can you beat it?', again: 'Play again', round: 'Round', combo: 'Combo', flag: '💬 ',
    gain: function (n) { return '✓ +' + n + ' points'; }, ans: 'Answer: ', extra: 'Almost… careful: one word doesn’t belong.', built: 'Sentences built!',
    comboTip: 'Answer with no mistakes in a row to reach a x5 combo.', bTitle: 'Build the sentence', bIntro: 'Read the cue and build the sentence. Careful: every round has one extra word.',
    ground: 'G', eIntro: function (s, f) { return 'A correct answer takes you up one floor; a wrong answer takes you down one. You have ' + s + ' seconds per question and 3 lives. Reach floor ' + f + '!'; },
    up: 'Go up', floor: function (a, b) { return 'Floor ' + a + ' of ' + b; }, upOne: '✓ Up one floor!', timeUp: '⏱ Time’s up. ', top: 'You reached the top!',
    stuck: function (f) { return 'You stopped on floor ' + f; }, win: 'Great job!', lose: 'No lives left. Try again!'
  } : {
    game: 'Juego', unit: 'Unidad', foot: '<b>Elevionis</b> · Aprende más, alcanza más', progress: 'Tu avance', tap: 'Toca para ver', listen: '▶ Escuchar',
    order: 'Ordena la oración.', check: 'Revisar', exact: '✓ ¡Exacto!', almost: 'Casi. Revisa el orden e inténtalo otra vez.', answer: 'respuesta',
    hint: function (c) { return 'Pista: empieza con “' + c + '…”. '; }, start: '▶ Empezar', reset: 'Reiniciar', time: '¡Tiempo!', tick: 'Marca lo que lograste incluir:',
    secs: 'Segundos', pts: 'Puntos', best: 'Récord', ready: '¿Listo?', mrIntro: 'Une cada frase en inglés con su significado. Cada acierto suma 10 puntos y +2 segundos.', go: 'Empezar',
    record: '¡Nuevo récord!', nice: '¡Buen intento!', total: 'Puntos totales. ¿Lo superas?', again: 'Jugar otra vez', round: 'Ronda', combo: 'Combo', flag: '🇲🇽 ',
    gain: function (n) { return '✓ +' + n + ' puntos'; }, ans: 'Respuesta: ', extra: 'Casi… ojo: hay una palabra que sobra.', built: '¡Oraciones construidas!',
    comboTip: 'Combo máximo x5 si respondes sin errores seguidos.', bTitle: 'Construye la oración', bIntro: 'Lee la frase en español y arma la versión en inglés. Cuidado: cada ronda trae una palabra trampa.',
    ground: 'PB', eIntro: function (s, f) { return 'Cada respuesta correcta te sube un piso; una incorrecta te baja uno. Tienes ' + s + ' segundos por pregunta y 3 vidas. ¡Llega al piso ' + f + '!'; },
    up: 'Subir', floor: function (a, b) { return 'Piso ' + a + ' de ' + b; }, upOne: '✓ ¡Subes un piso!', timeUp: '⏱ Se acabó el tiempo. ', top: '¡Llegaste a la cima!',
    stuck: function (f) { return 'Te quedaste en el piso ' + f; }, win: 'Aprende más, alcanza más.', lose: 'Sin vidas. ¡Vuelve a intentarlo!'
  };
  if (EN) document.documentElement.lang = 'en';
  var $ = function (t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var norm = function (s) { return String(s).toLowerCase().replace(/[’']/g, "'").replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim(); };
  function speak(text) {
    try { if (!window.speechSynthesis) return; speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.92; speechSynthesis.speak(u); } catch (e) {}
  }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- layout ---------- */
  document.title = A.title + ' | Elevionis';
  var head = $('header', 'top'); head.innerHTML = '<div class="wrap"><a href="' + (A.home || '../') + '"><img src="../assets/logo-color.svg" alt="Elevionis"></a><span class="pill">' + (A.kind === 'game' ? L.game : L.unit) + '</span></div>';
  var hero = $('section', 'hero'); hero.innerHTML = '<div class="wrap"><span class="pill">' + A.tag + '</span><h1>' + A.title + '</h1><p>' + A.sub + '</p></div>';
  var main = $('main'); var wrap = $('div', 'wrap'); main.appendChild(wrap);
  var foot = $('footer', 'foot', L.foot);
  document.body.append(head, hero, main, foot);

  /* ---------- score for units ---------- */
  var total = 0, got = 0, bar, scoreTxt;
  if (A.kind !== 'game') {
    var sc = $('div', 'card'); sc.innerHTML = '<div class="scorebar"><span>' + L.progress + '</span><span id="sc">0 / 0</span></div><div class="progress"><i id="bar"></i></div>';
    wrap.appendChild(sc); bar = sc.querySelector('#bar'); scoreTxt = sc.querySelector('#sc');
  }
  function addTotal(n) { total += n; upd(); }
  function point() { got++; upd(); }
  function upd() { if (!bar) return; scoreTxt.textContent = got + ' / ' + total; bar.style.width = (total ? (got / total) * 100 : 0) + '%'; }

  var R = {};

  R.cards = function (b, box) {
    var g = $('div', 'flip-grid');
    b.cards.forEach(function (c) {
      var f = $('div', 'flip');
      f.innerHTML = '<div class="in"><div class="f">' + c[0] + '<small>' + L.tap + '</small></div><div class="b"><div>' + c[1] + '</div><em>“' + c[2] + '”</em><button class="say" type="button">' + L.listen + '</button></div></div>';
      f.addEventListener('click', function (e) { if (e.target.classList.contains('say')) { speak(c[2]); return; } f.classList.toggle('on'); });
      g.appendChild(f);
    });
    box.appendChild(g);
  };

  R.mcq = function (b, box) {
    addTotal(b.qs.length);
    b.qs.forEach(function (q) {
      var d = $('div', 'q'); d.appendChild($('p', null, q[0]));
      var o = $('div', 'opts'); var why = $('div', 'why', q[3] || ''); var done = false;
      shuffle(q[1].map(function (t, i) { return [t, i]; })).forEach(function (p) {
        var bt = $('button', 'opt', p[0]); bt.type = 'button';
        bt.onclick = function () {
          if (done) return;
          if (p[1] === q[2]) { done = true; bt.classList.add('ok'); why.classList.add('show'); point(); }
          else { bt.classList.add('no'); why.classList.add('show'); }
        };
        o.appendChild(bt);
      });
      d.append(o, why); box.appendChild(d);
    });
  };

  R.order = function (b, box) {
    addTotal(b.items.length);
    b.items.forEach(function (it, n) {
      var target = it[0], words = target.split(' ');
      var d = $('div', 'q'); d.appendChild($('p', null, (n + 1) + '. ' + (it[1] || L.order)));
      var slot = $('div', 'slot'), bank = $('div', 'bank'), fb = $('div', 'feedback'), done = false;
      shuffle(words).forEach(function (w) {
        var c = $('button', 'chip', w); c.type = 'button';
        c.onclick = function () { if (done) return; (c.parentNode === bank ? slot : bank).appendChild(c); fb.textContent = ''; fb.className = 'feedback'; };
        bank.appendChild(c);
      });
      var chk = $('button', 'btn ghost', L.check); chk.type = 'button';
      chk.onclick = function () {
        if (done) return;
        var built = Array.prototype.map.call(slot.children, function (x) { return x.textContent; }).join(' ');
        if (norm(built) === norm(target)) { done = true; fb.textContent = L.exact; fb.className = 'feedback ok'; point(); speak(target); }
        else { fb.textContent = L.almost; fb.className = 'feedback no'; }
      };
      d.append(slot, bank, chk, fb); box.appendChild(d);
    });
  };

  R.gap = function (b, box) {
    addTotal(b.items.length);
    b.items.forEach(function (it) {
      var d = $('div', 'q gap'); var parts = it[0].split('___');
      var p = $('p'); p.append(document.createTextNode(parts[0]));
      var inp = $('input'); inp.setAttribute('autocomplete', 'off'); inp.setAttribute('aria-label', L.answer);
      p.append(inp, document.createTextNode(parts[1] || '')); d.appendChild(p);
      var why = $('div', 'why', it[2] || ''); var done = false;
      var ok = [].concat(it[1]).map(norm);
      var chk = $('button', 'btn ghost', L.check); chk.type = 'button';
      function run() {
        if (done) return;
        if (ok.indexOf(norm(inp.value)) > -1) { done = true; inp.className = 'ok'; inp.disabled = true; why.classList.add('show'); point(); }
        else { inp.className = 'no'; why.innerHTML = L.hint(String([].concat(it[1])[0]).charAt(0)) + (it[2] || ''); why.classList.add('show'); }
      }
      chk.onclick = run; inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(); });
      d.append(chk, why); box.appendChild(d);
    });
  };

  R.speak = function (b, box) {
    box.appendChild($('div', 'prompt', b.prompt));
    var t = $('div', 'timer', fmt(b.seconds)); var row = $('div', 'row');
    var go = $('button', 'btn', L.start), rs = $('button', 'btn ghost', L.reset); go.type = rs.type = 'button';
    var left = b.seconds, iv = null;
    function fmt(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
    go.onclick = function () { if (iv) return; iv = setInterval(function () { left--; t.textContent = fmt(Math.max(left, 0)); if (left <= 0) { clearInterval(iv); iv = null; t.textContent = L.time; } }, 1000); };
    rs.onclick = function () { clearInterval(iv); iv = null; left = b.seconds; t.textContent = fmt(left); };
    row.append(go, rs); box.append(t, row);
    var ul = $('div'); ul.style.marginTop = '14px'; ul.appendChild($('p', 'hint', L.tick));
    b.checklist.forEach(function (c) { var l = $('label', 'check'); l.innerHTML = '<input type="checkbox"><span>' + c + '</span>'; ul.appendChild(l); });
    box.appendChild(ul);
  };

  /* ---------- GAMES ---------- */
  R.matchrush = function (b, box) {
    var key = 'elev-best-' + location.pathname;
    var hud = $('div', 'hud'); hud.innerHTML = '<div><b id="t">' + b.seconds + '</b><span>' + L.secs + '</span></div><div><b id="p">0</b><span>' + L.pts + '</span></div><div><b id="be">' + (store(key) || 0) + '</b><span>' + L.best + '</span></div>';
    var area = $('div'); box.append(hud, area);
    var tEl = hud.querySelector('#t'), pEl = hud.querySelector('#p'), bEl = hud.querySelector('#be');
    var pts, left, iv, deck, sel, done;
    function intro() { area.innerHTML = ''; var o = $('div', 'overlay', '<div class="big">⚡</div><h3>' + L.ready + '</h3><p>' + (b.intro || L.mrIntro) + '</p>'); var s = $('button', 'btn gold', L.go); s.onclick = start; o.appendChild(s); area.appendChild(o); }
    function round() {
      area.innerHTML = ''; sel = null; done = 0;
      var batch = deck.splice(0, 4); if (batch.length < 4) { deck = shuffle(b.pairs); batch = batch.concat(deck.splice(0, 4 - batch.length)); }
      var L = shuffle(batch.map(function (p, i) { return { t: p[0], id: i, s: 'L' }; })), Rr = shuffle(batch.map(function (p, i) { return { t: p[1], id: i, s: 'R' }; }));
      var g = $('div', 'tiles');
      for (var i = 0; i < 4; i++) [L[i], Rr[i]].forEach(function (x) {
        var t = $('button', 'tile', x.t); t.type = 'button'; t._x = x;
        t.onclick = function () {
          if (t.classList.contains('done') || !iv) return;
          if (!sel) { sel = t; t.classList.add('sel'); return; }
          if (sel === t) { t.classList.remove('sel'); sel = null; return; }
          if (sel._x.s === x.s) { sel.classList.remove('sel'); sel = t; t.classList.add('sel'); return; }
          if (sel._x.id === x.id) { sel.className = t.className = 'tile done'; pts += 10; left += 2; pEl.textContent = pts; tEl.textContent = left; if (x.s === 'L') speak(x.t); else speak(sel._x.t); sel = null; if (++done === 4) setTimeout(round, 350); }
          else { var a = sel; [a, t].forEach(function (z) { z.classList.remove('sel'); z.classList.add('bad'); setTimeout(function () { z.classList.remove('bad'); }, 400); }); pts = Math.max(0, pts - 3); pEl.textContent = pts; sel = null; }
        };
        g.appendChild(t);
      });
      area.appendChild(g);
    }
    function start() { pts = 0; left = b.seconds; deck = shuffle(b.pairs); pEl.textContent = 0; tEl.textContent = left; clearInterval(iv); iv = setInterval(function () { left--; tEl.textContent = Math.max(left, 0); if (left <= 0) end(); }, 1000); round(); }
    function end() { clearInterval(iv); iv = null; var best = +(store(key) || 0); if (pts > best) { store(key, pts); bEl.textContent = pts; } area.innerHTML = ''; var o = $('div', 'overlay', '<div class="big">' + pts + '</div><h3>' + (pts > best ? L.record : L.nice) + '</h3><p>' + L.total + '</p>'); var s = $('button', 'btn gold', L.again); s.onclick = start; o.appendChild(s); area.appendChild(o); }
    intro();
  };

  R.builder = function (b, box) {
    var hud = $('div', 'hud'); hud.innerHTML = '<div><b id="r">1/' + b.items.length + '</b><span>' + L.round + '</span></div><div><b id="p">0</b><span>' + L.pts + '</span></div><div><b id="c">x1</b><span>' + L.combo + '</span></div>';
    var area = $('div'); box.append(hud, area);
    var rEl = hud.querySelector('#r'), pEl = hud.querySelector('#p'), cEl = hud.querySelector('#c');
    var items, i, pts, combo, tries;
    function start() { items = shuffle(b.items); i = 0; pts = 0; combo = 1; pEl.textContent = 0; cEl.textContent = 'x1'; next(); }
    function next() {
      if (i >= items.length) return end();
      tries = 0; rEl.textContent = (i + 1) + '/' + items.length; area.innerHTML = '';
      var it = items[i], target = it[0];
      area.appendChild($('div', 'prompt', L.flag + it[1]));
      var slot = $('div', 'slot'), bank = $('div', 'bank'), fb = $('div', 'feedback');
      shuffle(target.split(' ').concat(it[2] || [])).forEach(function (w) { var c = $('button', 'chip', w); c.type = 'button'; c.onclick = function () { (c.parentNode === bank ? slot : bank).appendChild(c); }; bank.appendChild(c); });
      var chk = $('button', 'btn', L.check); chk.type = 'button';
      chk.onclick = function () {
        var built = Array.prototype.map.call(slot.children, function (x) { return x.textContent; }).join(' ');
        if (norm(built) === norm(target)) { var gain = (tries ? 5 : 10) * combo; pts += gain; combo = tries ? 1 : Math.min(combo + 1, 5); pEl.textContent = pts; cEl.textContent = 'x' + combo; fb.textContent = L.gain(gain); fb.className = 'feedback ok'; speak(target); chk.disabled = true; i++; setTimeout(next, 1100); }
        else { tries++; combo = 1; cEl.textContent = 'x1'; fb.textContent = tries > 1 ? L.ans + target : L.extra; fb.className = 'feedback no'; }
      };
      area.append(slot, bank, chk, fb);
    }
    function end() { area.innerHTML = ''; var o = $('div', 'overlay', '<div class="big">' + pts + '</div><h3>' + L.built + '</h3><p>' + L.comboTip + '</p>'); var s = $('button', 'btn gold', L.again); s.onclick = start; o.appendChild(s); area.appendChild(o); }
    var o = $('div', 'overlay', '<div class="big">🧩</div><h3>' + (b.introTitle || L.bTitle) + '</h3><p>' + (b.intro || L.bIntro) + '</p>'); var s = $('button', 'btn gold', L.go); s.onclick = start; o.appendChild(s); area.appendChild(o);
  };

  R.elevator = function (b, box) {
    var FL = b.floors || 10, sec = b.seconds || 15;
    var lay = $('div', 'elev'), shaft = $('div', 'shaft'), side = $('div');
    for (var f = 0; f <= FL; f++) { var d = $('div', 'floor' + (f === FL ? ' top' : ''),  f === 0 ? L.ground : (f === FL ? '★ ' + f : f)); d.dataset.f = f; shaft.appendChild(d); }
    lay.append(shaft, side); box.appendChild(lay);
    var floor, qs, qi, iv, left, lives;
    function paint() { Array.prototype.forEach.call(shaft.children, function (x) { x.classList.toggle('here', +x.dataset.f === floor); }); }
    function intro() { floor = 0; paint(); side.innerHTML = ''; var o = $('div', 'overlay', '<div class="big">🛗</div><h3>Elevator Challenge</h3><p>' + L.eIntro(sec, FL) + '</p>'); var s = $('button', 'btn gold', L.up); s.onclick = start; o.appendChild(s); side.appendChild(o); }
    function start() { floor = 0; lives = 3; qs = shuffle(b.qs); qi = 0; paint(); ask(); }
    function ask() {
      clearInterval(iv); if (floor >= FL) return end(true); if (lives <= 0) return end(false);
      if (qi >= qs.length) { qs = shuffle(b.qs); qi = 0; }
      var q = qs[qi++]; side.innerHTML = '';
      side.appendChild($('div', 'scorebar', '<span>' + L.floor(floor, FL) + '</span><span>' + '❤️'.repeat(lives) + '</span>'));
      var tb = $('div', 'qtimer', '<i></i>'); side.appendChild(tb);
      side.appendChild($('p', null, '<b style="color:var(--ink);font-size:18px">' + q[0] + '</b>'));
      var o = $('div', 'opts'), fb = $('div', 'feedback'), locked = false;
      shuffle(q[1].map(function (t, i) { return [t, i]; })).forEach(function (p) {
        var bt = $('button', 'opt', p[0]); bt.type = 'button';
        bt.onclick = function () { if (locked) return; locked = true; clearInterval(iv); judge(p[1] === q[2], bt, q, fb); };
        o.appendChild(bt);
      });
      side.append(o, fb);
      left = sec * 10; var bar = tb.firstChild;
      iv = setInterval(function () { left--; bar.style.width = (left / (sec * 10) * 100) + '%'; if (left <= 0) { clearInterval(iv); locked = true; judge(false, null, q, fb, true); } }, 100);
    }
    function judge(ok, bt, q, fb, timeout) {
      if (ok) { floor = Math.min(FL, floor + 1); bt.classList.add('ok'); fb.textContent = L.upOne; fb.className = 'feedback ok'; }
      else { floor = Math.max(0, floor - 1); lives--; if (bt) bt.classList.add('no'); fb.textContent = (timeout ? L.timeUp : '✗ ') + L.ans + q[1][q[2]]; fb.className = 'feedback no'; }
      paint(); setTimeout(ask, ok ? 900 : 1700);
    }
    function end(win) { clearInterval(iv); side.innerHTML = ''; var o = $('div', 'overlay', '<div class="big">' + (win ? '🏆' : floor) + '</div><h3>' + (win ? L.top : L.stuck(floor)) + '</h3><p>' + (win ? L.win : L.lose) + '</p>'); var s = $('button', 'btn gold', L.again); s.onclick = start; o.appendChild(s); side.appendChild(o); }
    intro();
  };

  /* ---------- build ---------- */
  (A.blocks || []).forEach(function (b, n) {
    var c = $('section', 'card');
    if (b.title) c.appendChild($('h2', null, (A.kind === 'game' ? '' : '<span class="step">' + (n + 1) + '</span>') + b.title));
    if (b.hint) c.appendChild($('p', 'hint', b.hint));
    R[b.type](b, c); wrap.appendChild(c);
  });
})();
