const express = require('express');
const cors = require('cors');

const criarTabelas = require('./src/infra/database/initTables');
const livroRoutes = require('./src/routes/livro.routes');
const leitorRoutes = require('./src/routes/leitor.routes');
const emprestimoRoutes = require('./src/routes/emprestimo.routes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

criarTabelas();
app.use('/api/livros', livroRoutes);
app.use('/api/leitores', leitorRoutes);
app.use('/api/emprestimos', emprestimoRoutes);


app.get('/api/ping', (req, res) => {
    res.status(200).json({ 
        status: 'Sucesso', 
        mensagem: 'Servidor rodando' 
    });
});


app.listen(PORT, () => {
    console.log(`[Servidor] Ativo e escutando na porta TCP ${PORT}`);
});
