const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
    res.status(200).json({ 
        status: 'Sucesso', 
        mensagem: 'Servidor rodando' 
    });
});

app.listen(PORT, () => {
    console.log(`[Servidor] Ativo e escutando na porta TCP ${PORT}`);
});

// Endpoint para receber a leitura do RFID (O ESP32 vai chamar essa URL)
app.post('/api/leitura', (req, res) => {
    // req.body contém o JSON que o ESP32 enviou
    const dadosRecebidos = req.body;
    
    // Troubleshooting: Imprime no console do servidor o que chegou pela rede
    console.log('[REDE] Requisição recebida do Hardware!');
    console.log(`[DADOS] Código RFID lido: ${dadosRecebidos.rfid}`);

    // Na próxima etapa, aqui entrará o código do Banco de Dados (SQL)

    // Responde ao ESP32 que recebemos com sucesso (Status 201 Created)
    res.status(201).json({ 
        status: 'Sucesso', 
        mensagem: 'Código RFID recebido pelo servidor!' 
    });
});