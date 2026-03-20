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
    wrap.innerHTML = `<img src="pacobot-mascot.png" class="msg-avatar bot-avatar" alt="PacoBot"><div class="msg-bubble">${html}</div>`;
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
    typingEl.innerHTML = `<img src="pacobot-mascot.png" class="msg-avatar bot-avatar" alt="PacoBot">
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
    state.mode = 'idle';
    await say('¿Qué más quieres hacer? 😊', false, 500);
    showMenuOptions();
  }

  // ═══════════════════════════════════════════════════════════════
  //  GENERADOR DE JUEGOS
  // ═══════════════════════════════════════════════════════════════

  function startGenerator() {
    document.getElementById('gen-modal').classList.remove('hidden');
  }

  function closeModal() {
    document.getElementById('gen-modal').classList.add('hidden');
    showMenuOptions();
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
    state.mode = 'idle';
    await say('¡Espero que les guste! 🎉 ¿Qué más quieres hacer?', false, 500);
    showMenuOptions();
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
    state.mode = 'idle';
    state.surveyGame = null;
    await say('¡Gracias! 🌟 Tu respuesta quedó guardada en la encuesta.', false, 400);
    await say('¿Qué más quieres hacer? 😊', false, 300);
    showMenuOptions();
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
      showMenuOptions();
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
    await say('¿Qué más quieres hacer? 😊', false, 300);
    showMenuOptions();
  }

  // ═══════════════════════════════════════════════════════════════
  //  GROQ IA — PacoBot con inteligencia artificial real
  // ═══════════════════════════════════════════════════════════════

    const IA_SYSTEM_PROMPT = `Eres PacoBot, un compañero de viajes muy alegre y curioso que acompañó a Simón Parra Morales en un viaje de investigación al municipio de Pácora (Caldas, Colombia).
Simón es estudiante muy inteligente de grado 4º del Colegio Anglohispano de Manizales. A su grado les asignaron Pácora para investigar y presentar en la Feria de Ciencias 2026.
Tú fuiste con él, lo viste todo, lo viviste, y ahora quieres contarle a todo el mundo lo chévere que es Pácora. Hablas como un niño emocionado que acaba de llegar de un viaje increíble.

═══ LO QUE VIVISTE EN PÁCORA ═══

📍 GEOGRAFÍA Y UBICACIÓN:
- Pácora es un municipio del norte del departamento de Caldas, Colombia.
- Hace parte del Alto Occidente de Caldas.
- Está aproximadamente a 50 km al norte de Manizales.
- Fue fundado en 1834.
- Es conocido como “La Atenas de Caldas” por su tradición cultural.
- Está ubicado en zona montañosa del Eje Cafetero.
- El clima es fresco, típico de tierra templada–fría andina.
- Está rodeado de veredas y fincas cafeteras.

🏫 EDUCACIÓN Y COLEGIOS:
- Institución Educativa Pácora (una de las principales del municipio).
- Institución Educativa Elías Mejía Ángel.
- Colegio Diocesano San José.
- La Casa de la Cultura promueve actividades artísticas y educativas.
- Pácora es reconocido por su tradición educativa y cultural.

🏘️ EL PUEBLO Y SU GENTE:
- Tiene alrededor de 12.000 habitantes.
- El parque principal se llama Parque Simón Bolívar y es el corazón del pueblo.
- La Iglesia de San José está frente al parque y es uno de los edificios más representativos.
- Las casas tienen arquitectura tradicional antioqueña con balcones coloridos.
- La gente es muy amable, trabajadora y orgullosa de su tierra.
- Madrugan mucho porque muchos trabajan en el campo.

☕ ECONOMÍA Y CAFÉ:
- La economía principal es el café.
- Muchas familias tienen fincas cafeteras en las veredas.
- También cultivan plátano y caña de azúcar.
- Hay ganadería en zonas rurales.
- En el parque se ven tiendas tradicionales y cafeterías donde venden tinto.

🍽️ COMIDA TÍPICA:
- Bandeja paisa.
- Fríjoles antioqueños.
- Arepas de chócolo con queso.
- Tamales caldenses.
- Mazamorra con panela.
- Aguapanela con queso.
- Chocolate caliente con pan y queso.
- Empanadas y buñuelos en las mañanas.
- Postres tradicionales hechos con panela.

🎉 CULTURA Y FIESTAS:
- Fiestas del Municipio (aniversario).
- Fiestas del Agua.
- Celebraciones religiosas como Semana Santa.
- Eventos culturales en la Casa de la Cultura.
- Música carrilera, parrandera, trova y música popular.
- Reuniones familiares los fines de semana en el parque.

🏞️ LUGARES EMBLEMÁTICOS:
- Parque Simón Bolívar.
- Iglesia de San José.
- Casa de la Cultura.
- Cementerio municipal con arquitectura antigua.
- Miradores naturales en las montañas.
- Fincas cafeteras tradicionales.
- Caminos veredales rodeados de naturaleza.
- Quebradas rurales donde la gente se refresca.

🎮 JUEGOS TRADICIONALES QUE VISTE JUGAR:
1. El Trompo.
2. Las Canicas.
3. La Golosa (Rayuela).
4. Saltar la Cuerda.
5. La Lleva / La Pillada.
6. El Lobo.
7. El Ponchado / Quemado.
8. Los Yermis.
9. Los Encostalados.
10. Cuatro Esquinas.
11. Escondite.
12. Policía y Ladrón.
13. Stop.
14. Fútbol en la calle o en la cancha del barrio.
15. Microfútbol en coliseo municipal.
16. Carrera de bicicletas por el parque.
17. Balón prisionero.
18. Carrera de observación en las fiestas.
19. Juegos tradicionales campesinos en ferias.
20. Dominó y parques jugados por los adultos en el parque.

═══ FORMA DE HABLAR Y EXPRESIONES PERMITIDAS ═══

Puedes usar expresiones como:
- ¡Eso fue súper chévere!
- ¡No te imaginas!
- ¡Me encantó demasiado!
- ¡Fue lo más bacano del mundo!
- ¡Qué cosa tan espectacular!
- ¡Quedé con la boca abierta!
- ¡Me voló la cabeza!
- ¡Eso sí estuvo brutal!
- ¡Fue una locura pero de las buenas!
- ¡Yo quería quedarme a vivir allá!
- ¡Qué cosa tan linda!
- ¡Eso sí es una maravilla!
- ¡Me pareció lo máximo!
- ¡Yo estaba feliz feliz!
- ¡Casi no me quería devolver!
- ¡Fue demasiado increíble!
- ¡Eso estuvo una chimba!
- ¡Parcero, eso fue lo mejor!
- ¡Te lo juro que fue impresionante!
- ¡Eso sí fue una aventura!
- ¡Me sentí como explorador!
- ¡Era como estar en una película!
- ¡Qué parche tan bueno!
- ¡Eso sí estuvo de otro nivel!
- ¡Yo estaba súper emocionado!
- ¡Eso fue re bacano!
- ¡Qué cosa tan hermosa, parce!
- ¡Yo quería contarle a todo el mundo!
- ¡Me dieron ganas de volver ya mismo!
- ¡Eso fue una experiencia inolvidable!

También puedes usar conectores naturales como:
- "Pues imagínate que..."
- "Y lo más chévere fue que..."
- "¿Sabes qué fue lo mejor?"
- "Y entonces yo dije: ¡wow!"
- "Te cuento que..."
- "Y lo que más me gustó fue..."
- "Yo estaba como que no lo podía creer"
- "Literal, parecía un sueño"
- "O sea, era demasiado bonito"
- "Y todos estaban felices, pues"

⚠️ Varía las expresiones. No repitas siempre la misma frase.

═══ REGLAS IMPORTANTES ═══

- SOLO puedes usar información que esté en este prompt.
- NO inventes fechas exactas, cifras exactas ni nombres adicionales.
- Si no sabes algo, responde: "Eso sí no lo sé bien, ¡pero me encantaría averiguarlo contigo! 😊"
- Si preguntan algo que no tenga que ver con Pácora, responde con humor y redirige.
- Habla como un niño de 10 años emocionado.
- Usa expresiones como: "¡Eso fue súper chévere!", "¡No te imaginas!", "¡Me encantó!"
- Respuestas cortas: máximo 2-3 oraciones.
- Habla en español colombiano paisa con emojis 🎉☕🏔️.
`;

  const IA_MODES = [
    { label: '💬 Cuéntame del viaje',  mode: 'chat',   starter: null },
    { label: '❓ Trivia: ¿Cuánto sabes?',   mode: 'trivia', starter: 'Vamos a jugar trivia. Hazme UNA pregunta de trivia sobre Pácora (historia, cultura o juegos tradicionales colombianos). Espera mi respuesta para evaluarla.' },
    { label: '🎲 Adivina el juego',          mode: 'guess',  starter: 'Vamos a jugar "Adivina el juego". Piensa en un juego tradicional colombiano, pero NO lo digas. Dame solo la primera pista. Yo intentaré adivinar cuál es.' },
    { label: '🪢 Rimas para saltar la cuerda', mode: 'rhymes', starter: 'Inventa una rima corta y divertida para saltar la cuerda, al estilo de los niños de Pácora. Luego pregúntame si quiero otra.' },
  ];

  let iaHistory = [];

  const GROQ_LS_KEY = 'pacobot_groq_key';
  function getGroqKey()   { return localStorage.getItem(GROQ_LS_KEY) || ''; }
  function clearGroqKey() { localStorage.removeItem(GROQ_LS_KEY); }

  async function startIA() {
    clearOptions(); hideInput();
    state.mode = 'ia';
    if (!getGroqKey()) { showAPIKeyModal(); return; }
    await showIAModes();
  }

  function showAPIKeyModal() {
    document.getElementById('ia-key-input').value = '';
    document.getElementById('ia-key-error').textContent = '';
    document.getElementById('ia-modal').classList.remove('hidden');
  }

  function closeIAModal() {
    document.getElementById('ia-modal').classList.add('hidden');
  }

  function saveAPIKey() {
    const key = document.getElementById('ia-key-input').value.trim();
    const err = document.getElementById('ia-key-error');
    if (!key) { err.textContent = '⚠️ Escribe la clave antes de continuar.'; return; }
    if (!key.startsWith('gsk_')) { err.textContent = '⚠️ La clave debe empezar con gsk_'; return; }
    localStorage.setItem(GROQ_LS_KEY, key);
    closeIAModal();
    showIAModes();
  }

  function showMenuOptions() {
    state.mode = 'ia';
    const allOptions = [
      ...IA_MODES.map(m => ({ ...m, type: 'ia' })),
      { label: '🎯 Recomendar Juego',     type: 'rec' },
      { label: '✨ Inventar Juego Nuevo', type: 'gen' },
      { label: '📊 Encuesta de Juegos',   type: 'survey' },
      { label: '🏆 Ver Resultados',       type: 'results' },
      { label: '🗑️ Limpiar Todo',         type: 'clear' }
    ];
    showOptions(allOptions, async (opt) => {
      await addUserMsg(opt.label);
      if      (opt.type === 'rec')     { await startRecommender(); }
      else if (opt.type === 'gen')     { startGenerator(); }
      else if (opt.type === 'survey')  { await startSurvey(); }
      else if (opt.type === 'results') { await showResults(); }
      else if (opt.type === 'clear')   { await confirmClear(); }
      else                             { await startIAMode(opt.starter); }
    });
  }

  async function showIAModes() {
    iaHistory = [];
    state.mode = 'ia';
    await say('¿Qué quieres hacer? 😊', false, 300);
    showMenuOptions();
  }

  function showBackButton() {
    showOptions([{ label: '🏠 Volver al menú' }], async () => {
      hideInput();
      clearOptions();
      await showIAModes();
    });
  }

  async function startIAMode(starter) {
    iaHistory = [];
    state.mode = 'ia_chat';
    if (starter) {
      const reply = await callGroq(starter, true);
      if (reply) await addBotMsg(reply);
    } else {
      await say('¡Genial! Pregúntame lo que quieras sobre Pácora', false, 300);
    }
    showInput('Escribe tu mensaje...');
    showBackButton();
  }

  async function handleIAInput(text) {
    hideInput();
    clearOptions();
    await addUserMsg(text);
    const reply = await callGroq(text, false);
    if (reply) await addBotMsg(reply);
    showInput('Escribe tu mensaje...');
    showBackButton();
  }

  async function callGroq(userMessage, isStarter) {
    const key = getGroqKey();

    // Construir historial: si es starter va como primer turno user sin guardarlo en iaHistory
    const messages = [{ role: 'system', content: IA_SYSTEM_PROMPT }];
    if (isStarter) {
      messages.push({ role: 'user', content: userMessage });
    } else {
      iaHistory.push({ role: 'user', content: userMessage });
      messages.push(...iaHistory);
    }

    showTyping();
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          max_tokens: 220,
          temperature: 0.4
        })
      });

      hideTyping();

      if (res.status === 401) {
        clearGroqKey();
        await say('❌ La clave de API no es válida o venció. Pulsa <strong>PacoBot IA</strong> para ingresar una nueva.', false, 200);
        state.mode = 'idle';
        return null;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        await say(`❌ Error ${res.status}: ${err.error?.message || 'intenta de nuevo'}`, false, 200);
        return null;
      }

      const data  = await res.json();
      const reply = data.choices[0].message.content;

      // Guardar en historial de conversación (máx. 10 turnos para no crecer indefinidamente)
      iaHistory.push({ role: 'assistant', content: reply });
      if (iaHistory.length > 20) iaHistory = iaHistory.slice(-20);

      DB.saveMessage('ia', reply.slice(0, 300), 'ia_chat');
      return reply;

    } catch {
      hideTyping();
      await say('❌ Sin conexión a internet. Verifica tu red e intenta de nuevo.', false, 200);
      return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  INPUT DE TEXTO
  // ═══════════════════════════════════════════════════════════════

  async function submitTextInput() {
    const input = document.getElementById('text-input');
    const text  = input.value.trim();
    if (!text) return;
    input.value = '';
    if (state.mode === 'survey_why')  await submitSurveyWhy(text);
    else if (state.mode === 'ia_chat')  await handleIAInput(text);
  }

  // ═══════════════════════════════════════════════════════════════
  //  LIMPIAR Y EXPORTAR
  // ═══════════════════════════════════════════════════════════════

  async function confirmClear() {
    if (!confirm('¿Borrar todo el historial y la encuesta?\n\n¡Esta acción no se puede deshacer!')) {
      showMenuOptions();
      return;
    }
    await DB.clearAll();
    document.getElementById('chat-messages').innerHTML = '';
    clearOptions(); hideInput();
    await say('¡Datos borrados! 🗑️ Empezamos de cero.', false, 200);
    await showIAModes();
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

  async function init() {
    try { await DB.init(); } catch { /* sin persistencia: ok */ }

    document.getElementById('text-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') submitTextInput();
    });

    await say(
      '¡Hola! Soy <img src="pacobot-mascot.png" class="inline-mascot" alt="PacoBot"><strong>PacoBot</strong> ✨, ¡acabo de volver de un viaje increíble a <strong>Pácora</strong> con <strong>Simón Parra Morales</strong>!<br>' +
      'Simón es estudiante de grado <strong>4º</strong> del Colegio Anglohispano de Manizales, a quienes les tocó investigar el municipio de <strong>Pácora</strong> 🗺️<br>' +
      'Aprendí sobre su gente, su comida, su café, sus lugares y sus juegos tradicionales. 🏔️☕🎮<br>' +
      '¡Tengo mucho que contarte! ¿Por dónde empezamos?',
      false, 300
    );
    iaHistory = [];
    state.mode = 'ia';
    showMenuOptions();
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
    startIA, saveAPIKey, closeIAModal,
    confirmClear, exportData,
    submitTextInput
  };

})();
