const Livro = require('../domain/entities/Livro');
const livroRepository = require('../infra/repositories/LivroRepository');

class LivroController {
    
    async cadastrar(req, res) {
        try {

            const { rfid_tag, titulo, autor, genero } = req.body;

            const novoLivro = new Livro({ rfid_tag, titulo, autor, genero });

            const livroSalvo = await livroRepository.salvar(novoLivro);

            return res.status(201).json({
                mensagem: 'Livro cadastrado com sucesso!',
                livro: livroSalvo
            });

        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = new LivroController();