import { Request, Response } from 'express';
import { prisma } from '../prisma';
import axios from 'axios';
import { logger } from '../utils/logger';

export class EmitirNotaFiscalController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const solicitacao = await prisma.solicitacao.findUnique({ where: { id } });

            if (!solicitacao) return res.status(404).json({ error: 'Não encontrado.' });

            if (solicitacao.status !== 'PENDENTE_EMISSAO') {
                return res.status(400).json({ error: `Status inválido: ${solicitacao.status}` });
            }

            logger.info({ solicitacaoId: id }, 'Iniciando integração com Dr. Finanças');
            // Consumo da API Externa
            const response = await axios.post(
                'https://api.drfinancas.com/testes/notas-fiscais',
                {
                    ...solicitacao,
                    dataDesejada: solicitacao.dataDesejada.toISOString() // Garante ISO para o envio
                },
                { headers: { 'Authorization': '87451e7c-48bc-48d1-a038-c16783dd404c' } }
            );

            logger.info({ solicitacaoId: id }, 'Integração com Dr. Finanças concluída');
            const { numeroNF, dataEmissao } = response.data;

            const atualizado = await prisma.solicitacao.update({
                where: { id },
                data: {
                    status: 'EMITIDA',
                    numeroNF,
                    dataEmissao: new Date(dataEmissao)
                }
            });

            logger.info({ solicitacaoId: id }, 'Nota fiscal emitida com sucesso');
            return res.json(atualizado);

        } catch (error: any) {
            logger.error({ error }, 'Erro ao emitir nota fiscal');
            if (axios.isAxiosError(error) && error.response) {
                return res.status(error.response.status).json({
                    error: 'Erro na operadora de NF',
                    detalhes: error.response.data
                });
            }
            return res.status(500).json({ error: 'Erro interno de emissão.' });
        }
    }
}