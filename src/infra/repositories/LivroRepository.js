const db = require('../database/connection');

class LivroRepository {
    
    async salvar(livro) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO livros (id, rfid_tag, titulo, autor, genero, isbn, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [livro.id, livro.rfid_tag, livro.titulo, livro.autor, livro.genero, livro.isbn, livro.status], function(err) {
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

    async listarTodos() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM livros`;
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
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
            const sql = `UPDATE livros SET status = ? WHERE id = ?`;
            db.run(sql, [status, id], function(err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports = new LivroRepository();