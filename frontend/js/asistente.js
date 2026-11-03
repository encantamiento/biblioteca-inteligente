/* ==================================================
   ASISTENTE DE ESTUDIO IA — LÓGICA
   Biblioteca Virtual Inteligente · I.E. Javier Pérez de Cuéllar
   Prototipo funcional (búsqueda semántica local sobre el catálogo
   + base de conocimiento adaptada por grado + quiz + voz).
================================================== */
(function () {
  'use strict';

  var CATALOG = window.LIB_CATALOG || [];
  var KB = window.LIB_KB || [];
  var QUIZ = window.LIB_QUIZ || {};

  /* ---- Modos / personalidades por grado ---- */
  var MODES = {
    peque:       { key:'peque',       level:'peque',       emoji:'👧', name:'Modo peque',       grades:[1,2], tag:'1.º–2.º' },
    explorador:  { key:'explorador',  level:'explorador',  emoji:'🧒', name:'Modo explorador', grades:[3,4], tag:'3.º–4.º' },
    investigador:{ key:'investigador',level:'investigador',emoji:'🎓', name:'Modo investigador',grades:[5,6], tag:'5.º–6.º' }
  };
  var state = { mode: 'explorador', quiz: null };

  /* ---- Utilidades ---- */
  function esc(s){ var d=document.createElement('div'); d.textContent=(s==null?'':String(s)); return d.innerHTML; }
  function norm(s){
    return (s||'').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9\u00f1 ]/g,' ').replace(/\s+/g,' ').trim();
  }
  function el(tag, cls, html){ var e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }

  /* ---- Construir el widget ---- */
  var fab, panel, body, input, micBtn;

  function buildWidget(){
    fab = el('button','ia-fab');
    fab.setAttribute('aria-label','Abrir Asistente de Estudio');
    fab.innerHTML = '<span class="ia-fab-ico">🤖</span>'+
      '<span class="ia-fab-txt">Asistente de Estudio<small>Pregúntame lo que quieras</small></span>';
    document.body.appendChild(fab);

    panel = el('div','ia-panel');
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-label','Asistente de Estudio con IA');
    panel.innerHTML =
      '<div class="ia-head">'+
        '<div class="ia-ava" id="iaAva">🤖</div>'+
        '<div class="ia-head-tt"><h3>Asistente de Estudio</h3>'+
          '<p><span class="ia-dot"></span> <span id="iaStatus">En línea · listo para ayudarte</span></p></div>'+
        '<div class="ia-head-sp"></div>'+
        '<button class="ia-xbtn" id="iaClose" aria-label="Cerrar">✕</button>'+
      '</div>'+
      '<div class="ia-modes" id="iaModes"></div>'+
      '<div class="ia-body" id="iaBody"></div>'+
      '<div class="ia-foot">'+
        '<div class="ia-inrow">'+
          '<button class="ia-micbtn" id="iaMic" aria-label="Hablar" title="Preguntar con la voz">🎙️</button>'+
          '<input id="iaInput" type="text" placeholder="Escribe tu pregunta..." autocomplete="off">'+
          '<button class="ia-sendbtn" id="iaSend" aria-label="Enviar">→</button>'+
        '</div>'+
        '<div class="ia-note">Asistente educativo · responde con los libros de la biblioteca 📚</div>'+
      '</div>';
    document.body.appendChild(panel);

    body = panel.querySelector('#iaBody');
    input = panel.querySelector('#iaInput');
    micBtn = panel.querySelector('#iaMic');

    buildModes();
    bindEvents();
  }
  /* ---- Selector de modo ---- */
  function buildModes(){
    var wrap = panel.querySelector('#iaModes');
    Object.keys(MODES).forEach(function(k){
      var m = MODES[k];
      var b = el('button','ia-mode'+(k===state.mode?' active':''));
      b.dataset.mode = k;
      b.innerHTML = '<span class="e">'+m.emoji+'</span>'+m.name.replace('Modo ','')+'<small>'+m.tag+'</small>';
      b.addEventListener('click', function(){ setMode(k, true); });
      wrap.appendChild(b);
    });
  }

  function setMode(k, announce){
    state.mode = k;
    panel.querySelectorAll('.ia-mode').forEach(function(b){
      b.classList.toggle('active', b.dataset.mode===k);
    });
    var m = MODES[k];
    panel.querySelector('#iaAva').textContent = m.emoji;
    if (announce){
      addMsg('bot', '¡Perfecto! Activé el <b>'+esc(m.name)+'</b> ('+m.tag+' de primaria). Ahora te explicaré las cosas a tu medida. ¿Qué quieres aprender?');
    }
  }

  /* ---- Eventos ---- */
  function bindEvents(){
    fab.addEventListener('click', openPanel);
    panel.querySelector('#iaClose').addEventListener('click', closePanel);
    panel.querySelector('#iaSend').addEventListener('click', onSend);
    input.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); onSend(); } });
    micBtn.addEventListener('click', toggleVoice);
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && panel.classList.contains('open')) closePanel(); });
  }

  var welcomed = false;
  function openPanel(){
    panel.classList.add('open');
    fab.classList.add('hide');
    if (!welcomed){ welcomed = true; welcome(); }
    setTimeout(function(){ input.focus(); }, 300);
  }
  function closePanel(){
    panel.classList.remove('open');
    fab.classList.remove('hide');
    stopVoice();
  }

  /* ---- Bienvenida ---- */
  function welcome(){
    addMsg('bot',
      '¡Hola! 👋 Soy tu <b>Asistente de Estudio</b> de la Biblioteca Virtual. '+
      'Puedo explicarte temas, recomendarte libros de la biblioteca y crear un <b>quiz</b> para practicar.<br><br>'+
      'Primero elige tu grado arriba ⬆️ y luego pregúntame algo. ¿Qué te gustaría saber?');
    addChips([
      '¿Qué es la fotosíntesis?',
      '¿Qué es el sistema solar?',
      'Explícame las fracciones',
      '📝 Quiero un quiz'
    ]);
  }

  /* ---- Render de mensajes ---- */
  function addMsg(who, html){
    var m = el('div','ia-msg '+who);
    var ava = el('div','ia-bub-ava', who==='bot' ? MODES[state.mode].emoji : '🙂');
    var bub = el('div','ia-bub', html);
    m.appendChild(ava); m.appendChild(bub);
    body.appendChild(m);
    scrollDown();
    return bub;
  }

  function addChips(arr){
    var last = body.lastElementChild;
    var bub = last && last.querySelector('.ia-bub');
    if (!bub) return;
    var box = el('div','ia-chips');
    arr.forEach(function(t){
      var c = el('button','ia-chip', esc(t));
      c.addEventListener('click', function(){ sendUserText(t.replace(/^📝\s*/,'')); });
      box.appendChild(c);
    });
    bub.appendChild(box);
    scrollDown();
  }

  function showTyping(){
    var m = el('div','ia-msg bot');
    m.id = 'iaTyping';
    m.innerHTML = '<div class="ia-bub-ava">'+MODES[state.mode].emoji+'</div>'+
                  '<div class="ia-bub"><div class="ia-typing"><span></span><span></span><span></span></div></div>';
    body.appendChild(m); scrollDown();
  }
  function hideTyping(){ var t=body.querySelector('#iaTyping'); if(t) t.remove(); }
  function scrollDown(){ body.scrollTop = body.scrollHeight; }
  /* ---- Envío de mensaje ---- */
  function onSend(){
    var t = input.value.trim();
    if (!t) return;
    input.value = '';
    sendUserText(t);
  }

  function sendUserText(text){
    addMsg('user', esc(text));
    if (state.quiz){ answerQuiz(text); return; }
    showTyping();
    setTimeout(function(){ hideTyping(); respond(text); }, 650);
  }

  /* ---- Motor de respuesta ---- */
  function respond(text){
    var q = norm(text);

    // 1) Intención de quiz
    if (/\b(quiz|examen|prueba|preguntas|evaluacion|evaluame|practicar)\b/.test(q)){
      offerQuiz();
      return;
    }

    // 2) Buscar tema en la base de conocimiento
    var topic = matchTopic(q);
    if (topic){
      var ans = topic[state.mode] || topic.explorador;
      var bub = addMsg('bot', ans);
      var recs = recommendBooks(topic.rel.concat([topic.titulo]), 3);
      if (recs.length){
        bub.insertAdjacentHTML('beforeend',
          '<span class="ia-src">📖 Libros de la biblioteca para seguir leyendo:</span>');
        bub.appendChild(renderBooks(recs));
      }
      speak(stripHtml(ans));
      addQuizHint(topic.titulo);
      return;
    }

    // 3) Sin tema exacto: búsqueda de libros por palabras
    var found = searchCatalog(q, 4);
    if (found.length){
      var b2 = addMsg('bot',
        'No tengo una explicación exacta para eso, pero encontré <b>'+found.length+
        ' libro(s)</b> en la biblioteca que pueden ayudarte. 👇');
      b2.appendChild(renderBooks(found));
      return;
    }

    // 4) Fallback
    var fb = addMsg('bot',
      'Mmm, todavía no aprendí sobre eso 🤔. Prueba preguntarme por temas como '+
      '<b>la fotosíntesis</b>, <b>el sistema solar</b>, <b>las fracciones</b> o <b>el cuidado del medio ambiente</b>. '+
      'También puedo buscarte un libro o crear un quiz.');
    addChips(['¿Qué es la fotosíntesis?','El ciclo del agua','📝 Quiero un quiz']);
  }

  /* ---- Coincidencia de tema (búsqueda semántica simple) ---- */
  function matchTopic(q){
    var best=null, bestScore=0;
    KB.forEach(function(t){
      var score=0;
      t.kw.forEach(function(k){
        var nk=norm(k);
        if (q.indexOf(nk)>-1) score += nk.length>6 ? 3 : 2;
      });
      // también por palabras sueltas del título
      norm(t.titulo).split(' ').forEach(function(w){
        if (w.length>3 && q.indexOf(w)>-1) score += 1;
      });
      if (score>bestScore){ bestScore=score; best=t; }
    });
    return bestScore>=2 ? best : null;
  }

  /* ---- Recomendador / búsqueda en el catálogo ---- */
  function gradeRange(){ return MODES[state.mode].grades; }

  // Texto buscable del libro: título + nombre derivado del archivo de imagen
  // (muchos libros tienen título genérico "Libro NN" pero su nombre real está en la imagen)
  function bookText(b){
    var fromImg = '';
    if (b.i){
      try {
        var f = decodeURIComponent(b.i.split('/').pop().replace(/\.webp$/i,''));
        f = f.replace(/([a-z\u00e0-\u00ff])([A-Z])/g,'$1 $2')
             .replace(/([A-Z]+)([A-Z][a-z])/g,'$1 $2')
             .replace(/([a-zA-Z])(\d)/g,'$1 $2');
        fromImg = f;
      } catch(e){ fromImg = b.i; }
    }
    return norm(b.t + ' ' + fromImg);
  }

  function recommendBooks(keys, n){
    var grades = gradeRange();
    var scored = CATALOG.map(function(b){
      var nt = bookText(b), s=0;
      keys.forEach(function(k){
        var nk=norm(k);
        if (nk && nt.indexOf(nk)>-1) s+=2;
        nk.split(' ').forEach(function(w){ if(w.length>3 && nt.indexOf(w)>-1) s+=1; });
      });
      if (grades.indexOf(b.g)>-1 && s>0) s+=1; // preferir el grado del alumno
      return { b:b, s:s };
    }).filter(function(x){ return x.s>0; })
      .sort(function(a,b){ return b.s-a.s; });
    return scored.slice(0,n).map(function(x){ return x.b; });
  }

  function searchCatalog(q, n){
    var words = q.split(' ').filter(function(w){ return w.length>3; });
    if (!words.length) return [];
    var scored = CATALOG.map(function(b){
      var nt=bookText(b), s=0;
      words.forEach(function(w){ if(nt.indexOf(w)>-1) s+=1; });
      return { b:b, s:s };
    }).filter(function(x){ return x.s>0; })
      .sort(function(a,b){ return b.s-a.s; });
    return scored.slice(0,n).map(function(x){ return x.b; });
  }

  function bookName(b){
    if (b.t && !/^libro\s*\d+/i.test(b.t)) return b.t;
    if (b.i){
      try {
        var f = decodeURIComponent(b.i.split('/').pop().replace(/\.webp$/i,''));
        f = f.replace(/([a-z\u00e0-\u00ff])([A-Z])/g,'$1 $2')
             .replace(/([A-Z]+)([A-Z][a-z])/g,'$1 $2')
             .replace(/([a-zA-Z])(\d)/g,'$1 $2').trim();
        if (f) return f.charAt(0).toUpperCase()+f.slice(1);
      } catch(e){}
    }
    return b.t;
  }

  function renderBooks(list){
    var box = el('div','ia-books');
    list.forEach(function(b){
      var card = el('button','ia-book');
      var nm = bookName(b);
      var img = b.i ? '<img src="'+esc(b.i)+'" alt="" onerror="this.style.visibility=\'hidden\'">' : '<img alt="">';
      card.innerHTML = img +
        '<span class="ia-book-i"><strong>'+esc(nm)+'</strong><small>'+esc('Grado '+b.g)+'</small></span>'+
        '<span class="ia-book-go">▶</span>';
      card.addEventListener('click', function(){
        if (typeof window.abrirLibro === 'function'){
          window.abrirLibro(b.u, nm, 'Grado '+b.g);
        } else { window.open(b.u, '_blank'); }
      });
      box.appendChild(card);
    });
    return box;
  }

  function addQuizHint(topic){
    var bub = body.lastElementChild && body.lastElementChild.querySelector('.ia-bub');
    if (!bub) return;
    var box = el('div','ia-chips');
    var c = el('button','ia-chip','📝 Hazme un quiz de esto');
    c.addEventListener('click', function(){ startQuiz(pickQuizByTopic(topic)); });
    box.appendChild(c);
    bub.appendChild(box);
    scrollDown();
  }

  function stripHtml(h){ var d=el('div',null,h); return d.textContent||''; }
  /* ================= QUIZ ================= */
  function quizTopics(){ return Object.keys(QUIZ); }

  function offerQuiz(){
    addMsg('bot','¡Genial! 📝 Elige un tema y prepararé un quiz de 5 preguntas para ti:');
    var bub = body.lastElementChild.querySelector('.ia-bub');
    var box = el('div','ia-chips');
    quizTopics().forEach(function(tp){
      var c = el('button','ia-chip', esc(tp));
      c.addEventListener('click', function(){ startQuiz(tp); });
      box.appendChild(c);
    });
    bub.appendChild(box); scrollDown();
  }

  function pickQuizByTopic(titulo){
    var n = norm(titulo), tops = quizTopics();
    for (var i=0;i<tops.length;i++){
      var nt = norm(tops[i]);
      if (n.indexOf(nt)>-1 || nt.indexOf(n)>-1) return tops[i];
      var parts = nt.split(' ');
      for (var j=0;j<parts.length;j++){ if(parts[j].length>4 && n.indexOf(parts[j])>-1) return tops[i]; }
    }
    return tops[0];
  }

  function startQuiz(topic){
    if (!QUIZ[topic]){ topic = quizTopics()[0]; }
    state.quiz = { topic:topic, qs:QUIZ[topic], i:0, correct:0 };
    addMsg('bot','📝 <b>Quiz: '+esc(topic)+'</b><br>Son '+QUIZ[topic].length+' preguntas. ¡Mucha suerte!');
    renderQuestion();
  }

  function renderQuestion(){
    var qz = state.quiz, item = qz.qs[qz.i];
    var pct = Math.round((qz.i/qz.qs.length)*100);
    var bub = addMsg('bot','');
    var card = el('div','ia-quiz');
    card.innerHTML =
      '<div class="ia-q-top"><b>Pregunta '+(qz.i+1)+'</b>'+
        '<span class="ia-q-prog">'+(qz.i+1)+' / '+qz.qs.length+'</span></div>'+
      '<div class="ia-quiz-bar"><span style="width:'+pct+'%"></span></div>'+
      '<div class="ia-q-text">'+esc(item.q)+'</div>';
    var opts = el('div','ia-opts');
    item.o.forEach(function(opt, idx){
      var b = el('button','ia-opt', esc(opt));
      b.addEventListener('click', function(){ chooseOption(idx, opts, item.c); });
      opts.appendChild(b);
    });
    card.appendChild(opts);
    bub.appendChild(card);
    scrollDown();
  }

  function chooseOption(idx, opts, correct){
    var btns = opts.querySelectorAll('.ia-opt');
    btns.forEach(function(b,i){
      b.disabled = true;
      if (i===correct) b.classList.add('ok');
      if (i===idx && idx!==correct) b.classList.add('bad');
    });
    if (idx===correct) state.quiz.correct++;
    state.quiz.i++;
    setTimeout(function(){
      if (state.quiz.i < state.quiz.qs.length) renderQuestion();
      else finishQuiz();
    }, 750);
  }

  function answerQuiz(){
    addMsg('bot','Para responder el quiz, toca una de las opciones de arriba 👆');
  }

  function finishQuiz(){
    var qz = state.quiz, total = qz.qs.length, c = qz.correct;
    var stars = Math.round((c/total)*5);
    var starStr = '⭐'.repeat(stars) + '☆'.repeat(5-stars);
    var msg = c===total ? '¡Excelente! Dominas el tema 🎉' :
              c>=total*0.6 ? 'Muy buen trabajo 👏' :
              'Sigue practicando, ¡tú puedes! 💪';
    var bub = addMsg('bot','');
    var r = el('div','ia-result');
    r.innerHTML = '<div class="ia-score">'+c+' / '+total+'</div>'+
      '<div class="ia-stars">'+starStr+'</div><p>'+esc(msg)+'</p>';
    bub.appendChild(r);
    var topic = qz.topic;
    state.quiz = null;
    addChips(['📝 Otro quiz','Recomiéndame un libro de '+topic]);
    speak('Obtuviste '+c+' de '+total+'. '+msg);
  }
  /* ================= VOZ (opcional) ================= */
  var recog = null, recognizing = false, ttsOn = true;

  function getRecognizer(){
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    var r = new SR();
    r.lang = 'es-PE'; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = function(e){
      var txt = e.results[0][0].transcript;
      sendUserText(txt);
    };
    r.onend = function(){ recognizing=false; micBtn.classList.remove('rec'); setStatus('En línea · listo para ayudarte'); };
    r.onerror = function(){ recognizing=false; micBtn.classList.remove('rec'); setStatus('En línea · listo para ayudarte'); };
    return r;
  }

  function toggleVoice(){
    if (recognizing){ stopVoice(); return; }
    if (!recog) recog = getRecognizer();
    if (!recog){
      addMsg('bot','Tu navegador no permite el micrófono. Prueba con Google Chrome 🎙️, o escríbeme tu pregunta.');
      return;
    }
    try {
      recog.start(); recognizing=true;
      micBtn.classList.add('rec'); setStatus('Escuchando... habla ahora 🎙️');
    } catch(e){}
  }
  function stopVoice(){ if (recog && recognizing){ try{ recog.stop(); }catch(e){} } }
  function setStatus(t){ var s=panel.querySelector('#iaStatus'); if(s) s.textContent=t; }

  function speak(text){
    if (!ttsOn || !('speechSynthesis' in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text.slice(0,320));
      u.lang = 'es-ES';
      u.rate = state.mode==='peque' ? 0.92 : 1;
      window.speechSynthesis.speak(u);
    } catch(e){}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function init(){ buildWidget(); }
})();
