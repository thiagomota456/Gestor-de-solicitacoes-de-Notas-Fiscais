import express from 'express';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { CreateSolicitacaoController } from './controllers/CreateSolicitacaoController';
import { GetSolicitacaoController } from './controllers/GetSolicitacaoController';

const app = express();
const prisma = new PrismaClient();
const createSolicitacaoController = new CreateSolicitacaoController();
const getSolicitacaoController = new GetSolicitacaoController();

app.use(express.json());

app.get('/', async (req, res) => {
    res.json({ message: 'API de Notas Fiscais rodando!' });
});

app.post('/solicitacoes', (req, res) => createSolicitacaoController.handle(req, res));
app.get('/solicitacoes', (req, res) => getSolicitacaoController.index(req, res));
app.get('/solicitacoes/:id', (req, res) => getSolicitacaoController.show(req, res));

const PORT = 3120;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
