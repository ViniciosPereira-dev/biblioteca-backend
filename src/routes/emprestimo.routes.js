const { Router } = require('express');
const emprestimoController = require('../controllers/EmprestimoController');

const router = Router();

router.post('/', (req, res) => emprestimoController.registrarEmprestimo(req, res));

module.exports = router;