import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
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
            const response = await axios.post(
                'https://api.drfinancas.com/testes/notas-fiscais',
                {
                    ...solicitacao,
                    dataDesejada: solicitacao.dataDesejada.toISOString() // Garante ISO para o envio
                },
                { headers: { 'Authorization': process.env.EXTERNAL_API_TOKEN } }
            );

            logger.info({ solicitacaoId: id }, 'Integração com Dr. Finanças concluída');
            const { numeroNF, dataEmissao } = response.data;

            await prisma.solicitacao.update({
                where: { id },
                data: {
                    status: 'EMITIDA',
                    numeroNF,
                    dataEmissao: new Date(dataEmissao)
                }
            });

            logger.info({ solicitacaoId: id }, 'Nota fiscal emitida com sucesso');
            // Retorna apenas os campos solicitados
            return res.json({ numeroNF, dataEmissao });

        } catch (error: any) {
            logger.error({ error }, 'Erro ao emitir nota fiscal');

            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                let message = 'Erro na operadora de NF';

                switch (status) {
                    case 400:
                        message = 'Dados inválidos para emissão. Verifique os campos da solicitação.';
                        break;
                    case 401:
                        message = 'Falha de autenticação com a operadora. Token inválido ou expirado.';
                        break;
                    case 500:
                        message = 'Erro interno na operadora de NF. Tente novamente mais tarde.';
                        break;
                }

                return res.status(status).json({
                    error: message,
                    detalhes: error.response.data
                });
            }

            return res.status(500).json({ error: 'Erro interno de emissão.' });
        }
    }
}