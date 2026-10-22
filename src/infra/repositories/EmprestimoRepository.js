const db = require('../database/connection');

class EmprestimoRepository {
    async salvar(emprestimo) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO emprestimos (id, livro_id, leitor_id, telefone, data_retirada, data_devolucao, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            db.run(sql, [emprestimo.id, emprestimo.livro_id, emprestimo.leitor_id, emprestimo.telefone, emprestimo.data_retirada, emprestimo.data_devolucao, emprestimo.status], function(err) {
                if (err) return reject(err);
                resolve(emprestimo);
            });
        });
    }

    async encerrarEmprestimo(livro_id) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE emprestimos SET status = 'DEVOLVIDO' WHERE livro_id = ? AND status = 'ATIVO'`;
            db.run(sql, [livro_id], function(err) {
                if (err) return reject(err);
                resolve(this.changes); // Retorna quantas linhas foram alteradas
            });
        });
    }
}

module.exports = new EmprestimoRepository();