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
                status: 'DISPONIVEL',
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

    async atualizarStatus(req, res) {
        try {
            const { id } = req.params; // Pega o ID da URL
            const { status } = req.body; // Pega o novo status (EMPRESTADO ou DISPONIVEL) do corpo

            // Validação de segurança
            if (!status || (status !== 'EMPRESTADO' && status !== 'DISPONIVEL')) {
                return res.status(400).json({ erro: "Status inválido. Use 'EMPRESTADO' ou 'DISPONIVEL'." });
            }

            // Chama o repositório para fazer a alteração no banco
            const foiAtualizado = await livroRepository.atualizarStatus(id, status);

            if (!foiAtualizado) {
                return res.status(404).json({ erro: 'Livro não encontrado.' });
            }

            return res.status(200).json({ 
                mensagem: `Status atualizado com sucesso para ${status}!`,
                id: id,
                novoStatus: status
            });
        } catch (error) {
            console.error('[CTRL - ERRO] Falha ao atualizar status:', error);
            return res.status(500).json({ erro: 'Erro interno ao atualizar o status.' });
        }
    }
}

module.exports = new LivroController();