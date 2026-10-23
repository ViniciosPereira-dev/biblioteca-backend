const db = require('./connection');

function criarTabelas() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS livros (
                id TEXT PRIMARY KEY,
                rfid_tag TEXT UNIQUE NOT NULL,
                titulo TEXT NOT NULL,
                autor TEXT,
                genero TEXT,
                isbn TEXT NOT NULL,
                status TEXT DEFAULT 'DISPONIVEL',
                estante TEXT,
                prateleira TEXT
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS leitores (
                id TEXT PRIMARY KEY,
                nome TEXT NOT NULL,
                cpf TEXT UNIQUE NOT NULL,
                telefone TEXT
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS emprestimos (
                id TEXT PRIMARY KEY,
                livro_id TEXT NOT NULL,
                leitor_id TEXT NOT NULL,
                telefone TEXT,
                data_retirada DATETIME DEFAULT CURRENT_TIMESTAMP,
                data_devolucao DATETIME,
                status TEXT DEFAULT 'ATIVO',
                FOREIGN KEY (livro_id) REFERENCES livros (id),
                FOREIGN KEY (leitor_id) REFERENCES leitores (id)
            )
        `, (err) => {
            if (err) {
                console.error('[SQL - ERRO] Falha ao criar tabelas:', err.message);
            } else {
                console.log('[SQL - SUCESSO] Estrutura do banco garantida e atualizada.');
            }
        });
    });
}
module.exports = criarTabelas;