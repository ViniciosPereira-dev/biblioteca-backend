const Leitor = require('../domain/entities/Leitor');
const leitorRepository = require('../infra/repositories/LeitorRepository');

class LeitorController {
    
    async cadastrar(req, res) {
        try {
            const { nome, cpf, telefone } = req.body;
            
            const novoLeitor = new Leitor({ nome, cpf, telefone });
            const leitorSalvo = await leitorRepository.salvar(novoLeitor);
            
            return res.status(201).json({
                mensagem: 'Leitor cadastrado com sucesso!',
                leitor: leitorSalvo
            });
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }

    async listar(req, res) {
        try {
            const leitores = await leitorRepository.listarTodos();
            return res.status(200).json(leitores);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao buscar leitores.' });
        }
    }
}

module.exports = new LeitorController();