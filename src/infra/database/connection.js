const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../biblioteca.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('[INFRA - ERRO] Falha ao conectar no SQLite:', err.message);
    } else {
        console.log('[INFRA - SUCESSO] Conectado ao banco de dados SQLite.');
    }
});

module.exports = db;