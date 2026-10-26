const crypto = require('crypto'); // 1. Faltava importar a biblioteca de IDs
const Leitor = require('../domain/entities/Leitor');
const leitorRepository = require('../infra/repositories/LeitorRepository');

class LeitorController {
    
    async cadastrar(req, res) {
        try {
            const { nome, cpf, telefone } = req.body;
            
            // 2. Limpa o CPF para ter certeza absoluta que o banco só recebe os números
            const cpfLimpo = cpf ? cpf.replace(/\D/g, '') : '';

            if (!cpfLimpo || cpfLimpo.length !== 11) {
                return res.status(400).json({ erro: 'CPF inválido. Digite 11 números.' });
            }

            // 3. Cria um ID único para o leitor (A MÁGICA QUE FALTAVA)
            const id = crypto.randomUUID();
            
            // 4. Passa o ID e o CPF limpo para a criação
            const novoLeitor = new Leitor({ id, nome, cpf: cpfLimpo, telefone });
            
            const leitorSalvo = await leitorRepository.salvar(novoLeitor);
            
            return res.status(201).json({
                mensagem: 'Leitor cadastrado com sucesso!',
                leitor: leitorSalvo
            });
        } catch (error) {
            console.error('[CTRL - ERRO] Falha ao cadastrar leitor:', error);
            return res.status(400).json({ erro: error.message });
        }
    }

    async listar(req, res) {
        try {
            const leitores = await leitorRepository.listarTodos();
            return res.status(200).json(leitores);
        } catch (error) {
            console.error('[CTRL - ERRO] Falha ao listar leitores:', error);
            return res.status(500).json({ erro: 'Erro ao buscar leitores.' });
        }
    }
}

module.exports = new LeitorController();