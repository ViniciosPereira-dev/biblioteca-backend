const { v4: uuidv4 } = require('uuid');

class Emprestimo {
    constructor({ id, livro_id, leitor_id }) {
        this.id = id || uuidv4();
        this.livro_id = livro_id;
        this.leitor_id = leitor_id;
        
        this.data_retirada = new Date().toISOString(); 
        
        const dataDevolucao = new Date();
        dataDevolucao.setDate(dataDevolucao.getDate() + 7);
        this.data_devolucao = dataDevolucao.toISOString();

        this.status = 'ATIVO';

        this.validar();
    }

    validar() {
        if (!this.livro_id) throw new Error("A ID do livro é obrigatória para o empréstimo.");
        if (!this.leitor_id) throw new Error("A ID do leitor é obrigatória para o empréstimo.");
    }
}

module.exports = Emprestimo;