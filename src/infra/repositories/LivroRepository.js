const db = require('../database/connection');

class LivroRepository {
    
    async salvar(livro) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO livros (id, rfid_tag, titulo, autor, genero, isbn, status, estante, prateleira) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.run(sql, [livro.id, livro.rfid_tag, livro.titulo, livro.autor, livro.genero, livro.isbn, livro.status, livro.estante, livro.prateleira], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return reject(new Error('Esta Tag RFID já está cadastrada.'));
                    }
                    return reject(err);
                }
                resolve(livro);
            });
        });
    }
listar() {
        return new Promise((resolve, reject) => {
            // Pega os livros e cruza com o empréstimo MAIS RECENTE daquele livro
            const query = `
                SELECT 
                    l.*, 
                    le.nome AS leitor_nome, 
                    e.telefone AS leitor_telefone,
                    e.data_devolucao 
                FROM livros l
                LEFT JOIN (
                    SELECT livro_id, leitor_id, data_devolucao, telefone
                    FROM emprestimos 
                    ORDER BY id DESC
                ) e ON l.id = e.livro_id
                LEFT JOIN leitores le ON e.leitor_id = le.cpf
                GROUP BY l.id
            `;

            db.all(query, [], (err, rows) => {
                if (err) {
                    console.error('[ERRO SQL - Listar Livros]', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async buscarPorRfid(rfid_tag) {
            return new Promise((resolve, reject) => {
                const sql = `SELECT * FROM livros WHERE rfid_tag = ?`;
                db.get(sql, [rfid_tag], (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                });
            });
        }

        async buscarPorId(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM livros WHERE id = ?`;
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

async atualizarStatus(id, status) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE livros SET status = ? WHERE id = ?`;
            
            db.run(query, [status, id], function (err) {
                if (err) {
                    console.error('[REPO - ERRO] Falha ao atualizar status:', err.message);
                    reject(err);
                } else {
                    // this.changes indica quantas linhas foram alteradas no SQLite. 
                    // Se for > 0, significa que deu certo.
                    resolve(this.changes > 0); 
                }
            });
        });
    }
}

module.exports = new LivroRepository();