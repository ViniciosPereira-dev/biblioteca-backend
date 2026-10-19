const db = require('../database/connection');

class LeitorRepository {
    
    async salvar(leitor) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO leitores (id, nome, cpf, telefone) VALUES (?, ?, ?, ?)`;
            
            db.run(sql, [leitor.id, leitor.nome, leitor.cpf, leitor.telefone], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return reject(new Error('Este CPF já está cadastrado no sistema.'));
                    }
                    return reject(err);
                }
                resolve(leitor);
            });
        });
    }

    async listarTodos() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM leitores`;
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
}

module.exports = new LeitorRepository();