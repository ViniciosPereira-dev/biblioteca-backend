const Emprestimo = require('../domain/entities/Emprestimo');
const emprestimoRepository = require('../infra/repositories/EmprestimoRepository');
const livroRepository = require('../infra/repositories/LivroRepository');

class EmprestimoController {
    
    async registrarEmprestimo(req, res) {
        try {
            const { livro_id, leitor_id } = req.body;

            const livroDb = await livroRepository.buscarPorId(livro_id);
            if (!livroDb) {
                return res.status(404).json({ erro: 'Livro não encontrado no sistema.' });
            }

            if (livroDb.status !== 'DISPONIVEL') {
                return res.status(400).json({ erro: `Transação negada. O livro já consta como ${livroDb.status}.` });
            }

            const novoEmprestimo = new Emprestimo({ livro_id, leitor_id });

            const emprestimoSalvo = await emprestimoRepository.salvar(novoEmprestimo);

            await livroRepository.atualizarStatus(livro_id, 'EMPRESTADO');

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
}

module.exports = new EmprestimoController();