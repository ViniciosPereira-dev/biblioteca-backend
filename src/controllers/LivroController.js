const crypto = require('crypto');
const Livro = require('../domain/entities/Livro');
const livroRepository = require('../infra/repositories/LivroRepository');

class LivroController {
    
    async cadastrar(req, res) {
        try {
            const { rfid_tag, titulo, autor, genero, isbn, estante, prateleira } = req.body;

            const id = crypto.randomUUID();

            const novoLivro = new Livro({ 
                id, 
                rfid_tag, 
                titulo, 
                autor, 
                genero, 
                isbn, 
                estante, 
                prateleira 
            });

            const livroSalvo = await livroRepository.salvar(novoLivro);

            return res.status(201).json({
                mensagem: 'Livro cadastrado com sucesso!',
                livro: livroSalvo
            });

        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async listar(req, res) {
        try {
            const livros = await livroRepository.listar();
            return res.status(200).json(livros);
        } catch (error) {
            console.error('[CTRL - ERRO] Falha ao listar livros:', error);
            return res.status(500).json({ erro: 'Erro interno ao buscar o acervo.' });
        }
    }

    async buscar(req, res) {
        try {
            const { rfid } = req.params; 
            const livro = await livroRepository.buscarPorRfid(rfid);

            if (!livro) {
                return res.status(404).json({ erro: 'Nenhum livro encontrado com esta Tag RFID.' });
            }

            return res.status(200).json(livro);
        } catch (error) {
            console.error('[CTRL - ERRO] Falha ao buscar livro por RFID:', error);
            return res.status(500).json({ erro: 'Erro interno ao buscar o livro.' });
        }
    }
}

module.exports = new LivroController();