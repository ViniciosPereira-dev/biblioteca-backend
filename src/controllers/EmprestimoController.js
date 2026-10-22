const Emprestimo = require('../domain/entities/Emprestimo');
const emprestimoRepository = require('../infra/repositories/EmprestimoRepository');
const livroRepository = require('../infra/repositories/LivroRepository');

class EmprestimoController {
    
    async registrarEmprestimo(req, res) {
        try {
            const { rfid_tag, leitor_id, telefone } = req.body;

            const livroDb = await livroRepository.buscarPorRfid(rfid_tag);
            if (!livroDb) {
                return res.status(404).json({ erro: 'Livro não encontrado no sistema.' });
            }

            if (livroDb.status !== 'DISPONIVEL') {
                return res.status(400).json({ erro: `Transação negada. O livro já consta como ${livroDb.status}.` });
            }

            const novoEmprestimo = new Emprestimo({ livro_id: livroDb.id, leitor_id, telefone });

            const emprestimoSalvo = await emprestimoRepository.salvar(novoEmprestimo);

            await livroRepository.atualizarStatus(livroDb.id, 'EMPRESTADO');

            return res.status(201).json({
                mensagem: 'Empréstimo registrado com sucesso!',
                emprestimo: emprestimoSalvo,
                prazo_devolucao: emprestimoSalvo.data_devolucao
            });

        } catch (error) {
            console.error('[CTRL - ERRO] Falha ao registrar empréstimo:', error);
            return res.status(500).json({ erro: error.message });
        }
    }

    // Exemplo de lógica para a rota de devolução
async devolverLivro(req, res) {
        const { rfid_tag } = req.body;

        try {
            // 1. Acha o livro pela TAG NFC usando o repositório de livros
            const livroDb = await livroRepository.buscarPorRfid(rfid_tag);
            
            if (!livroDb) {
                return res.status(404).json({ erro: 'Livro não encontrado no sistema.' });
            }

            // 2. Muda o status do empréstimo ATIVO desse livro para 'DEVOLVIDO'
            await emprestimoRepository.encerrarEmprestimo(livroDb.id);

            // 3. Muda o status do livro no banco para 'DISPONIVEL'
            await livroRepository.atualizarStatus(livroDb.id, 'DISPONIVEL');

            return res.status(200).json({ mensagem: 'Livro devolvido com sucesso!' });
            
        } catch (erro) {
            console.error('[CTRL - ERRO] Falha ao devolver livro:', erro);
            return res.status(500).json({ erro: 'Erro interno ao devolver o livro.' });
        }
    }
}

module.exports = new EmprestimoController();