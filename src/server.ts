import express from 'express';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', async (req, res) => {
    res.json({ message: 'API de Notas Fiscais rodando!' });
});

const PORT = 3120;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
