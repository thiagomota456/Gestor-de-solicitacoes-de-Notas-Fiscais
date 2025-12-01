import express from 'express';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { router } from './routes';
import { pinoHttp } from 'pino-http';
import { logger } from './utils/logger';

const app = express();
const prisma = new PrismaClient();

app.use(pinoHttp({
    logger,
    autoLogging: {
        ignore: (req) => req.url === '/health',
    },
    serializers: {
        req: (req) => ({
            method: req.method,
            url: req.url,
        }),
    }
}));

app.use(express.json());
app.use(router);

app.get('/', async (req, res) => {
    res.json({ message: 'API de Notas Fiscais rodando!' });
});

const PORT = process.env.PORT || 3120;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
