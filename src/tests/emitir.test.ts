import request from 'supertest';
import express from 'express';
import { router } from '../routes';
import { prisma } from '../lib/prisma';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const app = express();
app.use(express.json());
app.use(router);

describe('Feature: Emissão de NF', () => {
    let idPend: string;

    beforeAll(async () => {
        await prisma.solicitacao.deleteMany();
        const item = await prisma.solicitacao.create({
            data: {
                cnpj: "00000000000191", municipio: "Rio de Janeiro", estado: "RJ",
                valor: 100, dataDesejada: new Date(), descricao: "Para Emitir",
                status: "PENDENTE_EMISSAO"
            }
        });
        idPend = item.id;
    });

    afterAll(async () => await prisma.$disconnect());

    it('Deve integrar com API externa e atualizar status', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: { numeroNF: "999", dataEmissao: "2025-01-01T00:00:00Z" }
        });

        const res = await request(app).post(`/solicitacoes/${idPend}/emitir`);

        expect(res.status).toBe(200);
        // Valida formato de resposta atualizado
        expect(res.body).toEqual({
            numeroNF: "999",
            dataEmissao: "2025-01-01T00:00:00Z"
        });
    });

    it('Deve tratar erro 500 da API externa', async () => {
        const itemFalha = await prisma.solicitacao.create({
            data: {
                cnpj: "00000000000191", municipio: "Falha 500", estado: "SP",
                valor: 10, dataDesejada: new Date(), descricao: "Vai Falhar 500",
                status: "PENDENTE_EMISSAO"
            }
        });

        mockedAxios.isAxiosError.mockReturnValue(true);
        mockedAxios.post.mockRejectedValueOnce({
            isAxiosError: true,
            response: { status: 500, data: { msg: "Internal Server Error" } }
        });

        const res = await request(app).post(`/solicitacoes/${itemFalha.id}/emitir`);

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Erro interno na operadora de NF. Tente novamente mais tarde.');
    });

    it('Deve tratar erro 401 da API externa', async () => {
        const itemFalha = await prisma.solicitacao.create({
            data: {
                cnpj: "00000000000191", municipio: "Falha 401", estado: "SP",
                valor: 10, dataDesejada: new Date(), descricao: "Vai Falhar 401",
                status: "PENDENTE_EMISSAO"
            }
        });

        mockedAxios.isAxiosError.mockReturnValue(true);
        mockedAxios.post.mockRejectedValueOnce({
            isAxiosError: true,
            response: { status: 401, data: { msg: "Unauthorized" } }
        });

        const res = await request(app).post(`/solicitacoes/${itemFalha.id}/emitir`);

        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Falha de autenticação com a operadora. Token inválido ou expirado.');
    });
});