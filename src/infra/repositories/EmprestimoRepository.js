const db = require('../database/connection');

class EmprestimoRepository {
    async salvar(emprestimo) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO emprestimos (id, livro_id, leitor_id, data_retirada, data_devolucao, status) VALUES (?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [emprestimo.id, emprestimo.livro_id, emprestimo.leitor_id, emprestimo.data_retirada, emprestimo.data_devolucao, emprestimo.status], function(err) {
                if (err) return reject(err);
                resolve(emprestimo);
            });
        });
    }
}

module.exports = new EmprestimoRepository();