import request from 'supertest';
import express from 'express';
import { router } from '../routes';
import { prisma } from '../prisma';

const app = express();
app.use(express.json());
app.use(router);

describe('Feature: Criação de Solicitação', () => {
    const CNPJ_VALIDO = "00.000.000/0001-91";

    beforeAll(async () => await prisma.solicitacao.deleteMany());
    afterAll(async () => await prisma.$disconnect());

    it('Deve criar com sucesso e limpar CNPJ', async () => {
        const res = await request(app).post('/solicitacoes').send({
            cnpj: CNPJ_VALIDO,
            municipio: "São Paulo", estado: "SP", valor: 100,
            dataDesejada: "2024-12-25T00:00:00Z", descricao: "Teste"
        });
        expect(res.status).toBe(201);
        expect(res.body.cnpj).toBe("00000000000191"); // Limpo
    });

    it('Deve barrar dados inválidos (Zod)', async () => {
        const res = await request(app).post('/solicitacoes').send({
            cnpj: "123", // Inválido
        });
        expect(res.status).toBe(400);
        expect(res.body.detalhes.cnpj).toBeDefined();
    });
});