const { v4: uuidv4 } = require('uuid');

class Livro {
    constructor({ id, rfid_tag, titulo, autor, genero, status }) {
        this.id = id || uuidv4();
        this.rfid_tag = rfid_tag;
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero || 'Não Informado';
        this.status = status || 'DISPONIVEL';

        this.validar(); 
    }

    validar() {
        if (!this.rfid_tag) throw new Error("A Tag RFID é obrigatória.");
        if (!this.titulo) throw new Error("O Título do livro é obrigatório.");
    }

    emprestar() {
        if (this.status !== 'DISPONIVEL') {
            throw new Error(`O livro não pode ser emprestado. Status atual: ${this.status}`);
        }
        this.status = 'EMPRESTADO';
    }
}

module.exports = Livro;