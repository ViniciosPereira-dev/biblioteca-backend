const { Router } = require('express');
const emprestimoController = require('../controllers/EmprestimoController');

const router = Router();

router.post('/', (req, res) => emprestimoController.registrarEmprestimo(req, res));
router.post('/devolucao', (req, res) => emprestimoController.devolverLivro(req, res));

module.exports = router;