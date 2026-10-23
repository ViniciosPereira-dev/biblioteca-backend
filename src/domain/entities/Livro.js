const crypto = require('crypto');

class Livro {
    constructor({ id, rfid_tag, titulo, autor, genero, isbn, status, estante, prateleira }) {
        this.id = id || crypto.randomUUID();
        this.rfid_tag = rfid_tag;
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero || 'Não Informado';
        this.isbn = isbn;
        this.status = status || 'DISPONIVEL';
        this.estante = estante || 'Não Informado';
        this.prateleira = prateleira || 'Não Informado';

        this.validar(); 
    }

    validar() {
        if (!this.rfid_tag) throw new Error("A Tag RFID é obrigatória.");
        if (!this.titulo) throw new Error("O Título do livro é obrigatório.");
        if (!this.isbn) throw new Error("O ISBN do livro é obrigatório.");
    }

    emprestar() {
        if (this.status !== 'DISPONIVEL') {
            throw new Error(`O livro não pode ser emprestado. Status atual: ${this.status}`);
        }
        this.status = 'EMPRESTADO';
    }
}

module.exports = Livro;