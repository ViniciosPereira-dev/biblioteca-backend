const { Router } = require('express');
const livroController = require('../controllers/LivroController');

const router = Router();

router.post('/', (req, res) => livroController.cadastrar(req, res));

module.exports = router;