import express from 'express';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { CreateSolicitacaoController } from './controllers/CreateSolicitacaoController';

const app = express();
const prisma = new PrismaClient();
const createSolicitacaoController = new CreateSolicitacaoController();

app.use(express.json());

app.get('/', async (req, res) => {
    res.json({ message: 'API de Notas Fiscais rodando!' });
});

app.post('/solicitacoes', (req, res) => createSolicitacaoController.handle(req, res));

const PORT = 3120;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
