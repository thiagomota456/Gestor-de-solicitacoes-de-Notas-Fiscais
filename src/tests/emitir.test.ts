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
        expect(res.body.status).toBe("EMITIDA");
        expect(res.body.numeroNF).toBe("999");
    });

    it('Deve tratar erro da API externa', async () => {
        // Recriar um item pendente para falhar
        const itemFalha = await prisma.solicitacao.create({
            data: {
                cnpj: "00000000000191", municipio: "Falha", estado: "SP",
                valor: 10, dataDesejada: new Date(), descricao: "Vai Falhar",
                status: "PENDENTE_EMISSAO"
            }
        });

        mockedAxios.isAxiosError.mockReturnValue(true);
        mockedAxios.post.mockRejectedValueOnce({
            isAxiosError: true,
            response: { status: 502, data: { msg: "Gateway Error" } }
        });

        const res = await request(app).post(`/solicitacoes/${itemFalha.id}/emitir`);

        expect(res.status).toBe(502);
        expect(res.body.error).toBe('Erro na operadora de NF');
    });
});