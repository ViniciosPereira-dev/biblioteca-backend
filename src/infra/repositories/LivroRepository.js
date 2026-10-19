const db = require('../database/connection');

class LivroRepository {
    
    async salvar(livro) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO livros (id, rfid_tag, titulo, autor, genero, status) VALUES (?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [livro.id, livro.rfid_tag, livro.titulo, livro.autor, livro.genero, livro.status], function(err) {
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

}

module.exports = new LivroRepository();