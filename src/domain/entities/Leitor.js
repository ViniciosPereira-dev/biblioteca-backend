const { v4: uuidv4 } = require('uuid');

class Leitor {
    constructor({ id, nome, cpf, telefone }) {
        this.id = id || uuidv4();
        this.nome = nome;
        this.cpf = this.limparCpf(cpf);
        this.telefone = telefone || 'Não Informado';

        this.validar();
    }

    limparCpf(cpf) {
        if (!cpf) return null;
        return cpf.replace(/\D/g, '');
    }

    validar() {
        if (!this.nome) throw new Error("O Nome do leitor é obrigatório.");
        if (!this.cpf) throw new Error("O CPF do leitor é obrigatório.");
        if (this.cpf.length !== 11) throw new Error("CPF inválido. Deve conter 11 dígitos.");
    }
}

module.exports = Leitor;