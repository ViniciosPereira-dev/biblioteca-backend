const Emprestimo = require('../domain/entities/Emprestimo');
const emprestimoRepository = require('../infra/repositories/EmprestimoRepository');
const livroRepository = require('../infra/repositories/LivroRepository');
const leitorRepository = require('../infra/repositories/LeitorRepository');

class EmprestimoController {
    
async registrarEmprestimo(req, res) {
        try {
            // O frontend não precisa mais mandar o "nome" aqui, só o CPF (leitor_id) e telefone
            const { rfid_tag, leitor_id, telefone } = req.body;

            // 1. Verifica se o Livro existe e está disponível
            const livroDb = await livroRepository.buscarPorRfid(rfid_tag);
            if (!livroDb) {
                return res.status(404).json({ erro: 'Livro não encontrado no sistema.' });
            }
            if (livroDb.status !== 'DISPONIVEL') {
                return res.status(400).json({ erro: `Transação negada. O livro já consta como ${livroDb.status}.` });
            }

            // 2. Verifica se o Aluno (Leitor) existe no banco
            // Você precisará ter essa função no seu leitorRepository
            const leitorDb = await leitorRepository.buscarPorCpf(leitor_id);
            if (!leitorDb) {
                // SE O ALUNO NÃO EXISTIR, BARRA A OPERAÇÃO AQUI!
                return res.status(404).json({ erro: 'CPF não encontrado. Cadastre o aluno primeiro.' });
            }

            // 3. Se passou pelas duas verificações, registra o empréstimo
            const novoEmprestimo = new Emprestimo({ 
                livro_id: livroDb.id, 
                leitor_id: leitor_id, 
                telefone: telefone,
                nome: leitorDb.nome // Pega o nome seguro direto do banco de dados!
            });

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