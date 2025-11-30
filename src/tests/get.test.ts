import request from 'supertest';
import express from 'express';
import { router } from '../routes';
import { prisma } from '../lib/prisma';

const app = express();
app.use(express.json());
app.use(router);

describe('Feature: Leitura de Solicitações', () => {
    let idCriado: string;

    beforeAll(async () => {
        await prisma.solicitacao.deleteMany();
        const item = await prisma.solicitacao.create({
            data: {
                cnpj: "00000000000191", municipio: "Rio de Janeiro", estado: "RJ",
                valor: 100, dataDesejada: new Date(), descricao: "Seed",
                status: "PENDENTE_EMISSAO"
            }
        });
        idCriado = item.id;
    });

    afterAll(async () => await prisma.$disconnect());

    it('Deve listar todos', async () => {
        const res = await request(app).get('/solicitacoes');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    });

    it('Deve buscar por ID', async () => {
        const res = await request(app).get(`/solicitacoes/${idCriado}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(idCriado);
    });
});