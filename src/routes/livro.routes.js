const { Router } = require('express');
const livroController = require('../controllers/LivroController');

const router = Router();

router.post('/', (req, res) => livroController.cadastrar(req, res));

router.get('/', (req, res) => livroController.listar(req, res));

router.get('/:rfid', (req, res) => livroController.buscar(req, res));

router.patch('/:id/status', (req, res) => livroController.atualizarStatus(req, res));

module.exports = router;