// db.js — PacoBotDB: wrapper robusto de IndexedDB
// API pública: saveMessage, getMessages, saveSurvey, getSurveyResults, clearAll, exportData

class PacoBotDB {
  constructor() {
    this.dbName = 'PacoBotDB';
    this.version = 1;
    this.db = null;
  }

  init() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.version);

      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('messages')) {
          const ms = db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
          ms.createIndex('timestamp', 'timestamp');
          ms.createIndex('mode', 'mode');
        }
        if (!db.objectStoreNames.contains('surveys')) {
          const ss = db.createObjectStore('surveys', { keyPath: 'id', autoIncrement: true });
          ss.createIndex('timestamp', 'timestamp');
        }
      };

      req.onsuccess = (e) => { this.db = e.target.result; resolve(this); };
      req.onerror  = ()  => reject(req.error);
    });
  }

  // ── Mensajes del chat ────────────────────────────────────────────────────

  saveMessage(role, content, mode = 'general') {
    if (!this.db) return Promise.resolve(null);
    return this._add('messages', {
      role,
      content: String(content).slice(0, 2000), // evitar guardar HTML largo
      mode,
      timestamp: Date.now()
    });
  }

  getMessages(limit = 100) {
    if (!this.db) return Promise.resolve([]);
    return this._getAll('messages').then(rows => rows.slice(-limit));
  }

  // ── Encuesta (localStorage) ───────────────────────────────────────────────

  static get SURVEY_KEY() { return 'pacobot_surveys'; }

  _loadSurveys() {
    try {
      return JSON.parse(localStorage.getItem(PacoBotDB.SURVEY_KEY) || '[]');
    } catch { return []; }
  }

  _saveSurveys(surveys) {
    localStorage.setItem(PacoBotDB.SURVEY_KEY, JSON.stringify(surveys));
  }

  saveSurvey(favoriteGame, whyReason) {
    const surveys = this._loadSurveys();
    surveys.push({
      favoriteGame: String(favoriteGame).trim(),
      whyReason:    String(whyReason).trim().toLowerCase(),
      timestamp:    Date.now()
    });
    this._saveSurveys(surveys);
    return Promise.resolve();
  }

  getSurveyResults() {
    const surveys = this._loadSurveys();

    // Popularidad de juegos
    const gameCounts = {};
    surveys.forEach(s => {
      gameCounts[s.favoriteGame] = (gameCounts[s.favoriteGame] || 0) + 1;
    });

    // Frecuencia de palabras (sin stop-words en español)
    const STOP = new Set([
      'me','mi','el','la','los','las','de','que','en','a','y','es','por',
      'con','un','una','lo','le','se','al','del','su','muy','más','porque',
      'si','no','este','esta','pero','como','para','que','yo','tu','nos'
    ]);
    const wordCounts = {};
    surveys.forEach(s => {
      if (!s.whyReason) return;
      s.whyReason.split(/\s+/).forEach(w => {
        const clean = w.replace(/[^a-záéíóúñü]/gi, '').toLowerCase();
        if (clean.length > 2 && !STOP.has(clean)) {
          wordCounts[clean] = (wordCounts[clean] || 0) + 1;
        }
      });
    });

    return Promise.resolve({ gameCounts, wordCounts, total: surveys.length });
  }

  // ── Utilidades ────────────────────────────────────────────────────────────

  clearAll() {
    localStorage.removeItem(PacoBotDB.SURVEY_KEY);
    if (!this.db) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['messages'], 'readwrite');
      tx.objectStore('messages').clear();
      tx.oncomplete = resolve;
      tx.onerror    = () => reject(tx.error);
    });
  }

  async exportData() {
    const messages = await this.getMessages(5000);
    const surveys  = this._loadSurveys();
    return { messages, surveys, exportedAt: new Date().toISOString() };
  }

  // ── Helpers privados ──────────────────────────────────────────────────────

  _add(store, data) {
    return new Promise((resolve, reject) => {
      const tx  = this.db.transaction(store, 'readwrite');
      const req = tx.objectStore(store).add(data);
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }

  _getAll(store) {
    return new Promise((resolve, reject) => {
      const tx  = this.db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror   = () => reject(req.error);
    });
  }
}

const DB = new PacoBotDB();