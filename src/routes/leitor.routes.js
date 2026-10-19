const { Router } = require('express');
const leitorController = require('../controllers/LeitorController');

const router = Router();

router.post('/', (req, res) => leitorController.cadastrar(req, res));
router.get('/', (req, res) => leitorController.listar(req, res));

module.exports = router;