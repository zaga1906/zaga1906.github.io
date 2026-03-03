// app.js — PacoBot: lógica principal de la aplicación
'use strict';

const App = (() => {

  // ═══════════════════════════════════════════════════════════════
  //  DATOS DE JUEGOS TRADICIONALES
  // ═══════════════════════════════════════════════════════════════

  const GAMES = {
    trompo: {
      name: 'El Trompo', emoji: '🌀',
      desc: 'Enrollas una cuerda en la peonza, la lanzas con fuerza y la haces girar. ¡El que más tiempo la mantenga bailando, gana!',
      players: '1–4 jugadores', space: 'Pequeño (dentro de casa o patio)',
      materials: 'Un trompo y una cuerda',
      why: 'perfecto si son pocos, entrena la coordinación y la destreza de las manos.'
    },
    canicas: {
      name: 'Las Canicas', emoji: '🔮',
      desc: 'Dibuja un círculo en el piso. Lanza tus bolitas para sacar las del rival. ¡El que más canicas gane, gana el juego!',
      players: '2–4 jugadores', space: 'Muy pequeño (piso liso)',
      materials: 'Canicas o bolitas de vidrio',
      why: 'desarrolla la puntería y la concentración. ¡Fácil de aprender!'
    },
    golosa: {
      name: 'La Golosa (Rayuela)', emoji: '🦘',
      desc: 'Dibuja cuadros con tiza en el piso, lanza una piedra y salta en un pie sin pisar las líneas. ¡No te caigas!',
      players: '2–6 jugadores', space: 'Patio mediano',
      materials: 'Tiza + una piedra pequeña',
      why: 'mejora el equilibrio y la coordinación. ¡Todos participan por turnos!'
    },
    cuerda: {
      name: 'Saltar la Cuerda', emoji: '🪢',
      desc: 'Dos personas mueven la cuerda y los demás saltan al ritmo sin tropezar. ¡A ver quién aguanta más!',
      players: '3–8 jugadores', space: 'Patio mediano',
      materials: 'Una cuerda larga',
      why: 'combina ritmo, energía y diversión. ¡Pueden inventar rimas mientras saltan!'
    },
    lleva: {
      name: 'La Lleva / La Pillada', emoji: '🏃',
      desc: 'Quien "la lleva" debe correr y tocar a otro jugador para pasársela. ¡No dejes que te atrapen!',
      players: '4–15 jugadores', space: 'Parque o cancha grande',
      materials: '¡Ninguno!',
      why: 'el juego más universal. Solo necesitas espacio y muchas ganas de correr.'
    },
    lobo: {
      name: 'El Lobo', emoji: '🐺',
      desc: 'Un jugador es el lobo. Todos cantan "¿Lobo estás?" mientras él se prepara. ¡Cuando responde "¡Aquí voy!" todos corren!',
      players: '5–12 jugadores', space: 'Parque o patio grande',
      materials: '¡Ninguno!',
      why: 'la tensión y el suspenso de esperar hacen que sea muy emocionante.'
    },
    ponchado: {
      name: 'El Ponchado / Quemado', emoji: '⚽',
      desc: 'Dos equipos se enfrentan. Si la pelota te toca estás "ponchado" y sales. ¡El equipo que ponche a todos gana!',
      players: '6–20 jugadores', space: 'Cancha grande',
      materials: 'Una pelota de caucho',
      why: 'combina velocidad, estrategia y trabajo en equipo. ¡Ideal para grupos!'
    },
    yermis: {
      name: 'Los Yermis', emoji: '🏛️',
      desc: 'Un equipo construye una torre de piedras; el otro lanza una pelota para tumbarla e intenta ponchar a los que la reconstruyen.',
      players: '6–16 jugadores (2 equipos)', space: 'Patio o cancha grande',
      materials: 'Pelota + 7 piedras planas o discos',
      why: 'requiere estrategia y trabajo en equipo. ¡Muy emocionante!'
    },
    encostalados: {
      name: 'Los Encostalados', emoji: '🥜',
      desc: 'Te metes en un costal y saltas hasta la meta. ¡El primero en llegar gana! Hay muchas caídas graciosas.',
      players: '4–10 jugadores', space: 'Terreno largo y abierto',
      materials: 'Un costal o bolsa grande por jugador',
      why: 'es muy gracioso, hace reír a todos y es perfecto para eventos y ferias.'
    },
    cuatroEsquinas: {
      name: 'Cuatro Esquinas', emoji: '🔷',
      desc: '4 jugadores en las esquinas, 1 en el centro. Al señal se cambian de esquina y el del centro intenta robar una. ¡Sin esquina, al centro!',
      players: 'Exactamente 5 jugadores', space: 'Patio mediano',
      materials: '¡Ninguno! (solo 4 puntos marcados)',
      why: 'solo necesitan 5 personas y trabaja la velocidad de reacción.'
    }
  };

  const GAME_KEYS = Object.keys(GAMES);

  // ═══════════════════════════════════════════════════════════════
  //  PREGUNTAS DEL RECOMENDADOR (sistema de puntuación)
  // ═══════════════════════════════════════════════════════════════

  const REC_QUESTIONS = [
    {
      text: '👥 ¿Cuántos van a jugar?',
      options: [
        { label: '🧍 Solo o de a 2',
          scores: { trompo: 3, canicas: 3 } },
        { label: '👫 3 a 5 amigos',
          scores: { golosa: 3, cuerda: 3, cuatroEsquinas: 3, trompo: 1, canicas: 1, lleva: 1, lobo: 1 } },
        { label: '🎉 6 o más amigos',
          scores: { lleva: 3, lobo: 3, ponchado: 3, yermis: 3, encostalados: 3, cuerda: 1 } }
      ]
    },
    {
      text: '📍 ¿Dónde van a jugar?',
      options: [
        { label: '🏠 Dentro de casa',
          scores: { trompo: 3, canicas: 3, cuatroEsquinas: 1 } },
        { label: '🌿 Patio pequeño',
          scores: { golosa: 3, cuatroEsquinas: 2, cuerda: 2, trompo: 1, canicas: 2 } },
        { label: '🏟️ Parque o cancha grande',
          scores: { lleva: 3, lobo: 3, ponchado: 3, yermis: 3, encostalados: 3, cuerda: 2, golosa: 1 } }
      ]
    },
    {
      text: '❤️ ¿Qué prefieres hacer?',
      options: [
        { label: '🏃 Correr y ser muy ágil',
          scores: { lleva: 3, lobo: 3, encostalados: 2, ponchado: 2, cuatroEsquinas: 1 } },
        { label: '🎯 Tener buena puntería',
          scores: { trompo: 3, canicas: 3, yermis: 2, ponchado: 1 } },
        { label: '🦘 Saltar y moverte con ritmo',
          scores: { golosa: 3, cuerda: 3, encostalados: 1 } },
        { label: '🧠 Pensar y tener estrategia',
          scores: { cuatroEsquinas: 3, yermis: 3, lobo: 2, ponchado: 1 } }
      ]
    },
    {
      text: '🎒 ¿Qué materiales tienen?',
      options: [
        { label: '🤸 Nada (solo el cuerpo)',
          scores: { lleva: 3, lobo: 3, cuatroEsquinas: 3 } },
        { label: '⚽ Una pelota',
          scores: { ponchado: 3, yermis: 2 } },
        { label: '🪢 Cuerda o tiza',
          scores: { golosa: 3, cuerda: 3 } },
        { label: '🌀 Trompo o canicas',
          scores: { trompo: 3, canicas: 3 } }
      ]
    }
  ];

  // ═══════════════════════════════════════════════════════════════
  //  GENERADOR PROCEDURAL DE JUEGOS
  // ═══════════════════════════════════════════════════════════════

  const MATERIAL_LABELS = {
    none: 'sin materiales', ball: 'una pelota',
    rope: 'una cuerda',    chalk: 'tiza', mixed: 'varios objetos'
  };
  const SPACE_LABELS = {
    indoor: 'dentro de casa', small: 'patio pequeño',
    medium: 'patio mediano',  large: 'parque o cancha'
  };

  const TEMPLATES = {
    tag: {
      names:  ['La Sombra Mágica', 'Cazadores de Pácora', 'El Dragón Veloz', 'Escapa del Gigante'],
      emojis: ['👻', '🦅', '🐲', '👾'],
      obj:    'Ser el último jugador sin ser tocado.',
      rules:  (p) => [
        `Un jugador empieza como perseguidor (si son ${p} jugadores, pueden ser ${Math.max(1, Math.floor(p / 4))} perseguidores).`,
        'Al contar hasta 10, el perseguidor sale a atrapar a los demás.',
        'Si te tocan, debes quedarte quieto con los brazos arriba hasta que un compañero libre te rescate tocándote.',
        'Existe una "zona base" (un árbol o pared): quien la toca está a salvo temporalmente.',
        `Gana el perseguidor si atrapa a todos antes de ${Math.floor(p * 1.5)} minutos.`
      ]
    },
    relay: {
      names:  ['La Gran Carrera de Equipos', 'El Desafío de Pácora', 'Relevos de Campeones'],
      emojis: ['🏆', '⚡', '🎯'],
      obj:    'Completar la carrera de relevos primero que el otro equipo.',
      rules:  (p, m) => [
        `Formen 2 equipos de ${Math.ceil(p / 2)} personas.`,
        'Definan una salida y una meta (mínimo 8 metros de distancia).',
        `El primer jugador corre, llega a la meta, ${m === 'ball' ? 'pasa la pelota' : 'toca la mano del compañero'} y vuelve al inicio.`,
        'El siguiente solo puede salir cuando el anterior regresa y lo toca.',
        '¡Gana el equipo que complete todos sus turnos primero!'
      ]
    },
    ballTarget: {
      names:  ['Puntería de Campeones', 'El Cazador de Blancos', 'Bombardeo Estratégico'],
      emojis: ['🎯', '💥', '🏹'],
      obj:    'Golpear el blanco más veces que los rivales.',
      rules:  (p, m, s) => [
        `Marquen un círculo o blanco en el piso con ${m === 'chalk' ? 'tiza' : 'una botella vacía o palito'}.`,
        `Cada jugador tiene ${Math.max(3, Math.floor(9 / p))} turnos para lanzar la pelota desde una línea a ${s === 'large' ? '5' : '3'} metros.`,
        'Cada lanzamiento que toque el blanco vale 1 punto; caer dentro del círculo interior vale 2 puntos.',
        'Si hay empate al final, cada jugador hace 1 lanzamiento extra hasta desempatar.',
        '¡El lanzador debe pararse detrás de la línea; cruzarla no vale!'
      ]
    },
    hotPotato: {
      names:  ['La Patata Caliente', 'Círculo de Fuego', 'Pasa y Atrapa Veloz'],
      emojis: ['🔥', '⚽', '🌀'],
      obj:    'No quedarte con la pelota cuando se dé la señal.',
      rules:  () => [
        'Formen un círculo con todos los jugadores.',
        'Pasen la pelota rápido mientras alguien cuenta hasta un número secreto (entre 10 y 30) sin decirlo en voz alta.',
        'Cuando el contador diga "¡STOP!", quien tenga la pelota queda eliminado.',
        'Pueden lanzar, hacer pique o rodar la pelota según lo acuerden.',
        '¡El último jugador en el círculo gana!'
      ]
    },
    jumping: {
      names:  ['Saltarines Locos', 'La Cuerda Mágica de Pácora', 'SuperJump Challenge'],
      emojis: ['🪢', '⭐', '🌈'],
      obj:    'Saltar la cuerda más veces seguidas sin tropezar.',
      rules:  (p) => [
        'Dos jugadores mueven la cuerda; los demás forman fila para saltar.',
        'Cada jugador salta lo más que pueda sin pisar la cuerda. ¡Se cuenta en voz alta!',
        'Si tropiezas, sales y entra el siguiente. ¡Rotamos también quién mueve la cuerda!',
        `Reto especial: saltar mientras recitas el abecedario (cada letra = 1 salto).`,
        `Gana quien llegue al mayor número en ${Math.ceil(p / 2)} rondas.`
      ]
    },
    memory: {
      names:  ['El Círculo de los Sabios', 'La Ronda Mágica', 'Memoria de Campeón'],
      emojis: ['⭕', '🌟', '💡'],
      obj:    'Repetir la secuencia más larga sin cometer errores.',
      rules:  () => [
        'Formen un círculo con todos los jugadores.',
        'El jugador 1 hace un gesto o sonido; el jugador 2 lo repite y añade uno nuevo.',
        'Así sucesivamente: cada jugador repite toda la secuencia y añade su elemento.',
        'Quien olvide o se equivoque en la secuencia queda eliminado (o recibe una "penitencia" divertida).',
        '¡El último sin equivocarse es el Campeón de la Memoria!'
      ]
    },
    elimination: {
      names:  ['El Último en Pie', 'La Isla de Campeones', 'Gran Torneo de Pácora'],
      emojis: ['🏆', '👑', '⚔️'],
      obj:    'Ser el último jugador dentro de la zona.',
      rules:  (p, m, s) => [
        `Marquen una zona de juego (${s === 'large' ? 'toda la cancha' : 'un círculo de 5 metros en el patio'}).`,
        'Si sales de la zona, quedas eliminado automáticamente.',
        m !== 'none'
          ? `Con ${MATERIAL_LABELS[m]}, los jugadores intentan "marcar" (tocar suavemente) a los demás para eliminarlos.`
          : 'Los jugadores intentan empujar suavemente (solo con un dedo) a los demás fuera de la zona.',
        'Solo se puede caminar rápido dentro de la zona. ¡Prohibido correr!',
        `¡El último dentro de la zona gana el Gran Torneo de Pácora!`
      ]
    }
  };

  function pickGameType(p, m, s) {
    const opts = [];
    if (p >= 4 && s !== 'indoor') { opts.push('tag'); opts.push('relay'); }
    if (m === 'ball')             { opts.push('ballTarget'); opts.push('hotPotato'); }
    if (m === 'rope')             { opts.push('jumping'); }
    if (p >= 6)                   { opts.push('elimination'); }
    if (p <= 3)                   { opts.push('memory'); }
    if (!opts.length)             { opts.push('memory', 'tag'); }
    return opts[Math.floor(Math.random() * opts.length)];
  }

  function buildGame(p, m, s) {
    const type = pickGameType(p, m, s);
    const tpl  = TEMPLATES[type];
    const i    = Math.floor(Math.random() * tpl.names.length);
    return {
      name:  tpl.names[i],
      emoji: tpl.emojis[i % tpl.emojis.length],
      obj:   tpl.obj,
      rules: tpl.rules(p, m, s)
    };
  }

  // ═══════════════════════════════════════════════════════════════
  //  ENCUESTA — lista de juegos disponibles
  // ═══════════════════════════════════════════════════════════════

  const SURVEY_GAMES = [
    'La Lleva', 'El Trompo', 'Las Canicas', 'La Golosa',
    'Saltar la Cuerda', 'El Ponchado', 'Los Yermis',
    'El Lobo', 'Los Encostalados', 'Cuatro Esquinas'
  ];

  // ═══════════════════════════════════════════════════════════════
  //  ESTADO
  // ═══════════════════════════════════════════════════════════════

  const state = {
    mode:       'idle',
    qIndex:     0,
    scores:     {},
    surveyGame: null
  };

  // ═══════════════════════════════════════════════════════════════
  //  UTILIDADES DE CHAT
  // ═══════════════════════════════════════════════════════════════

  async function addBotMsg(html, isCard = false, saveText = '') {
    const wrap = document.createElement('div');
    wrap.className = `message bot${isCard ? ' result-card' : ''}`;
    wrap.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble">${html}</div>`;
    document.getElementById('chat-messages').appendChild(wrap);
    scrollBottom();
    if (saveText || !isCard) {
      const text = saveText || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
      DB.saveMessage('bot', text, state.mode);
    }
  }

  async function addUserMsg(text) {
    const wrap = document.createElement('div');
    wrap.className = 'message user';
    wrap.innerHTML = `<div class="msg-avatar">😊</div><div class="msg-bubble">${esc(text)}</div>`;
    document.getElementById('chat-messages').appendChild(wrap);
    scrollBottom();
    DB.saveMessage('user', text, state.mode);
  }

  function showOptions(options, cb) {
    const area = document.getElementById('quick-options');
    area.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = typeof opt === 'string' ? opt : opt.label;
      btn.onclick = () => { area.innerHTML = ''; cb(opt); };
      area.appendChild(btn);
    });
  }

  function clearOptions() { document.getElementById('quick-options').innerHTML = ''; }

  function showInput(placeholder) {
    const form  = document.getElementById('input-form');
    const input = document.getElementById('text-input');
    input.placeholder = placeholder || 'Escribe tu respuesta...';
    input.value = '';
    form.classList.remove('hidden');
    input.focus();
  }

  function hideInput() { document.getElementById('input-form').classList.add('hidden'); }

  function scrollBottom() {
    const el = document.getElementById('chat-messages');
    setTimeout(() => { el.scrollTop = el.scrollHeight; }, 80);
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Typing indicator + delay helper
  let typingEl = null;

  function showTyping() {
    typingEl = document.createElement('div');
    typingEl.className = 'message bot';
    typingEl.id = 'typing';
    typingEl.innerHTML = `<div class="msg-avatar">🤖</div>
      <div class="msg-bubble"><div class="dots"><span></span><span></span><span></span></div></div>`;
    document.getElementById('chat-messages').appendChild(typingEl);
    scrollBottom();
  }

  function hideTyping() {
    const el = document.getElementById('typing');
    if (el) el.remove();
    typingEl = null;
  }

  async function say(html, isCard = false, ms = 550, saveText = '') {
    showTyping();
    await sleep(ms);
    hideTyping();
    await addBotMsg(html, isCard, saveText);
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ═══════════════════════════════════════════════════════════════
  //  RECOMENDADOR
  // ═══════════════════════════════════════════════════════════════

  async function startRecommender() {
    clearOptions(); hideInput();
    state.mode   = 'recommending';
    state.qIndex = 0;
    GAME_KEYS.forEach(k => { state.scores[k] = 0; });

    await say('¡Hola! 🎮 Voy a recomendarte el juego tradicional <strong>perfecto para ti</strong>.<br>Solo responde <strong>4 preguntas rápidas</strong>:', false, 400);
    askRecQ();
  }

  async function askRecQ() {
    const q = REC_QUESTIONS[state.qIndex];
    await say(q.text, false, 500);
    showOptions(q.options, async (opt) => {
      await addUserMsg(opt.label);
      Object.entries(opt.scores).forEach(([g, pts]) => { state.scores[g] = (state.scores[g] || 0) + pts; });
      state.qIndex++;
      if (state.qIndex < REC_QUESTIONS.length) {
        askRecQ();
      } else {
        showRecResult();
      }
    });
  }

  async function showRecResult() {
    const sorted = [...GAME_KEYS].sort((a, b) => state.scores[b] - state.scores[a]);
    const winner = GAMES[sorted[0]];

    await say('¡Perfecto! Analicé tus respuestas y encontré el juego ideal para ti... 🎯', false, 700);

    const html = `
      <div class="result-inner">
        <div class="game-emoji-big">${winner.emoji}</div>
        <h3>🏆 Te recomiendo:<br>${winner.name}</h3>
        <p>${winner.desc}</p>
        <div class="detail-row">👥 <strong>Jugadores:</strong> ${winner.players}</div>
        <div class="detail-row">📍 <strong>Espacio:</strong> ${winner.space}</div>
        <div class="detail-row">🎒 <strong>Materiales:</strong> ${winner.materials}</div>
        <p class="why-text">💡 <em>¿Por qué este juego? Porque es ${winner.why}</em></p>
      </div>`;

    await say(html, true, 600, `Recomendación: ${winner.name}`);
    await say(`¿Quieres otro juego? ${menuHint()}`, false, 700);
    state.mode = 'idle';
  }

  // ═══════════════════════════════════════════════════════════════
  //  GENERADOR DE JUEGOS
  // ═══════════════════════════════════════════════════════════════

  function startGenerator() {
    document.getElementById('gen-modal').classList.remove('hidden');
  }

  function closeModal() {
    document.getElementById('gen-modal').classList.add('hidden');
  }

  async function generateGame() {
    const p = parseInt(document.getElementById('gen-players').value);
    const m = document.getElementById('gen-material').value;
    const s = document.getElementById('gen-space').value;
    closeModal();

    state.mode = 'generating';
    await say(`¡Genial! Voy a inventar un juego para <strong>${p} jugadores</strong> con <strong>${MATERIAL_LABELS[m]}</strong> en <strong>${SPACE_LABELS[s]}</strong>... 🎲`, false, 400);
    await say('Pensando las reglas... ✨', false, 700);

    const game = buildGame(p, m, s);

    const rulesHtml = game.rules.map((r, i) => `
      <div class="rule-step">
        <div class="rule-num">${i + 1}</div>
        <div>${r}</div>
      </div>`).join('');

    const html = `
      <div class="gen-card">
        <div class="gen-title">${game.emoji} ${game.name}</div>
        <div class="gen-meta">👥 ${p} jugadores &nbsp;·&nbsp; 📍 ${SPACE_LABELS[s]} &nbsp;·&nbsp; 🎒 ${MATERIAL_LABELS[m]}</div>
        <div class="gen-obj"><strong>🎯 Objetivo:</strong> ${game.obj}</div>
        <div class="gen-rules-label"><strong>📋 Reglas:</strong></div>
        ${rulesHtml}
        <div class="gen-footer">⭐ ¡Juego inventado por PacoBot solo para ti!</div>
      </div>`;

    await say(html, true, 500, `Juego generado: ${game.name}`);
    await say('¡Espero que les guste! 🎉 ¿Quieres inventar otro? ¡Pulsa el botón "Inventar Juego" de nuevo!', false, 600);
    state.mode = 'idle';
  }

  // ═══════════════════════════════════════════════════════════════
  //  ENCUESTA
  // ═══════════════════════════════════════════════════════════════

  async function startSurvey() {
    clearOptions(); hideInput();
    state.mode      = 'surveying';
    state.surveyGame = null;

    await say('¡Hola! Voy a hacerte <strong>2 preguntas rápidas</strong> para la encuesta. 📊<br>¡Tus respuestas ayudan a saber qué juegos gustan más en Pácora!', false, 400);
    await askSurveyQ1();
  }

  async function askSurveyQ1() {
    await say('1️⃣ ¿Cuál es tu <strong>juego favorito</strong>?', false, 600);
    showOptions(SURVEY_GAMES, async (gameName) => {
      state.surveyGame = gameName;
      await addUserMsg(gameName);
      await askSurveyQ2();
    });
  }

  async function askSurveyQ2() {
    await say('2️⃣ ¿<strong>Por qué</strong> te gusta ese juego? (escribe con tus palabras 😊)', false, 500);
    showInput('Ej: porque me gusta correr con mis amigos...');
    state.mode = 'survey_why';
  }

  async function submitSurveyWhy(text) {
    hideInput();
    await addUserMsg(text);
    await DB.saveSurvey(state.surveyGame, text);
    await say('¡Gracias! 🌟 Tu respuesta quedó guardada en la encuesta.', false, 400);
    await say('¿Quieres ver los resultados? ¡Pulsa <strong>"Ver Resultados"</strong>! 📊', false, 600);
    state.mode = 'idle';
    state.surveyGame = null;
  }

  // ═══════════════════════════════════════════════════════════════
  //  RESULTADOS DE ENCUESTA
  // ═══════════════════════════════════════════════════════════════

  async function showResults() {
    clearOptions(); hideInput();
    state.mode = 'results';

    await say('📊 Calculando resultados...', false, 300);

    const results = await DB.getSurveyResults();

    if (results.total === 0) {
      await say('No hay respuestas de encuesta todavía.<br>¡Pídele a alguien que participe primero! 📊', false, 300);
      state.mode = 'idle';
      return;
    }

    const gameCounts = results.gameCounts;
    const wordCounts = results.wordCounts;
    const maxCount   = Math.max(...Object.values(gameCounts), 1);
    const sortedG    = Object.entries(gameCounts).sort((a, b) => b[1] - a[1]);
    const sortedW    = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const popular    = sortedG[0]?.[0] || '—';

    const medals = ['🥇', '🥈', '🥉'];

    const barsHtml = sortedG.map(([game, cnt], i) => {
      const w = Math.max(Math.round((cnt / maxCount) * 160), 24);
      return `
        <div class="bar-row">
          <div class="bar-label">${medals[i] || '🎮'} ${game}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${w}px">${cnt}</div></div>
        </div>`;
    }).join('');

    const wordsHtml = sortedW.length
      ? `<div class="word-cloud">${sortedW.map(([w, c], i) =>
          `<span class="wtag r${Math.min(i + 1, 3)}">${w} (${c})</span>`
        ).join('')}</div>`
      : '';

    const html = `
      <div class="survey-res">
        <div class="res-title">📊 Resultados de la Encuesta</div>
        <div class="res-sub">${results.total} respuesta${results.total !== 1 ? 's' : ''} en total</div>
        <div class="popular">🏆 Juego más popular: <strong>${popular}</strong></div>
        <div class="res-section"><strong>📈 Votos por juego:</strong></div>
        ${barsHtml}
        ${sortedW.length ? `<div class="res-section"><strong>💬 Palabras más repetidas al explicar por qué:</strong></div>${wordsHtml}` : ''}
      </div>`;

    await say(html, true, 600, `Resultados: popular=${popular}, total=${results.total}`);
    state.mode = 'idle';
  }

  // ═══════════════════════════════════════════════════════════════
  //  INPUT DE TEXTO
  // ═══════════════════════════════════════════════════════════════

  async function submitTextInput() {
    const input = document.getElementById('text-input');
    const text  = input.value.trim();
    if (!text) return;
    input.value = '';
    if (state.mode === 'survey_why') await submitSurveyWhy(text);
  }

  // ═══════════════════════════════════════════════════════════════
  //  LIMPIAR Y EXPORTAR
  // ═══════════════════════════════════════════════════════════════

  async function confirmClear() {
    if (!confirm('¿Borrar todo el historial y la encuesta?\n\n¡Esta acción no se puede deshacer!')) return;
    await DB.clearAll();
    document.getElementById('chat-messages').innerHTML = '';
    clearOptions(); hideInput();
    await say('¡Datos borrados! 🗑️ Empezamos de cero.', false, 200);
  }

  async function exportData() {
    try {
      const data = await DB.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `pacobot-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      await say('💾 ¡Datos exportados! Revisa la carpeta de Descargas.', false, 200);
    } catch {
      await say('❌ Error al exportar. Intenta de nuevo.', false, 200);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  INICIALIZACIÓN
  // ═══════════════════════════════════════════════════════════════

  // Helper: devuelve la pista de dirección según el dispositivo
  function menuHint() {
    return window.matchMedia('(max-width: 640px)').matches
      ? '¡Usa los botones del menú de abajo! 👇'
      : '¡Usa los botones del menú de la izquierda! 👈';
  }

  async function init() {
    try { await DB.init(); } catch { /* sin persistencia: ok */ }

    document.getElementById('text-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') submitTextInput();
    });

    await say(
      `¡Hola! Soy <strong>PacoBot</strong> 🤖, el asistente de juegos tradicionales de Pácora.<br>Fui creado por Simón Parra Morales de grado 4º del colegio Anglohispano<br><br>
      Puedo ayudarte a:<br>
      🎯 <strong>Recomendar</strong> el juego perfecto para ti<br>
      ✨ <strong>Inventar</strong> un juego nuevo y divertido<br>
      📊 <strong>Encuesta</strong> para saber qué juegos gustan más<br>
      🏆 <strong>Ver resultados</strong> de la encuesta<br><br>
      ${menuHint()}`,
      false, 300
    );
  }

  // ── Auto-arranque ─────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── API pública ───────────────────────────────────────────────
  return {
    startRecommender,
    startGenerator, generateGame, closeModal,
    startSurvey,
    showResults,
    confirmClear, exportData,
    submitTextInput
  };

})();
