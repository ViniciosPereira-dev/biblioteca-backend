const Emprestimo = require('../domain/entities/Emprestimo');
const emprestimoRepository = require('../infra/repositories/EmprestimoRepository');
const livroRepository = require('../infra/repositories/LivroRepository');
const leitorRepository = require('../infra/repositories/LeitorRepository');

class EmprestimoController {
    
async registrarEmprestimo(req, res) {
    try {
        // CORREÇÃO 1: Mapeado para 'leitor_id' para casar com o JSON enviado pelo App React Native
        const { livro_id, leitor_id, data_devolucao } = req.body;

        // 1. Verifica se o Livro existe e está disponível
        const livroDb = await livroRepository.buscarPorId(livro_id);
        if (!livroDb) {
            return res.status(404).json({ erro: 'Livro não encontrado no sistema.' });
        }
        if (livroDb.status !== 'DISPONIVEL') {
            return res.status(400).json({ erro: `Transação negada. O livro já consta como ${livroDb.status}.` });
        }

        // 2. Verifica se o Aluno (Leitor) existe no banco pelo CPF (que veio na variável leitor_id do app)
        const leitorDb = await leitorRepository.buscarPorCpf(leitor_id);
        if (!leitorDb) {
            return res.status(404).json({ erro: 'Usuário não encontrado no sistema. Por favor, cadastre o leitor primeiro.' });
        }

        // 3. Registra o empréstimo
        const novoEmprestimo = new Emprestimo({ 
            livro_id: livroDb.id, 
            leitor_id: leitorDb.cpf,
            telefone: leitorDb.telefone,
            nome: leitorDb.nome, 
            data_devolucao: data_devolucao 
        }); 

        const emprestimoSalvo = await emprestimoRepository.salvar(novoEmprestimo);
        
        // 4. Atualiza o livro para EMPRESTADO
        await livroRepository.atualizarStatus(livroDb.id, 'EMPRESTADO');

        return res.status(201).json({
            mensagem: 'Empréstimo registrado com sucesso!',
            emprestimo: emprestimoSalvo
        });

    } catch (error) {
        console.error('[CTRL - ERRO] Falha ao registrar empréstimo:', error);
        return res.status(500).json({ erro: error.message });
    }
}

    async devolverLivro(req, res) {
        try {
            // ALINHAMENTO COM O APP: O app vai mandar o ID do livro direto
            const { livro_id } = req.body;

            const livroDb = await livroRepository.buscarPorId(livro_id);
            if (!livroDb) {
                return res.status(404).json({ erro: 'Livro não encontrado no sistema.' });
            }

            // 1. Encerra o empréstimo na tabela de empréstimos (Baixa na pendência do aluno)
            await emprestimoRepository.encerrarEmprestimo(livroDb.id);

            // 2. Muda o status do livro no banco para 'DISPONIVEL'
            await livroRepository.atualizarStatus(livroDb.id, 'DISPONIVEL');

            return res.status(200).json({ mensagem: 'Livro devolvido com sucesso!' });
            
        } catch (erro) {
            console.error('[CTRL - ERRO] Falha ao devolver livro:', erro);
            return res.status(500).json({ erro: 'Erro interno ao devolver o livro.' });
        }
    }
}

module.exports = new EmprestimoController();