import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';

export class GetSolicitacaoController {

    async index(req: Request, res: Response) {
        try {
            logger.info('Buscando todas as solicitações');
            const solicitacoes = await prisma.solicitacao.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return res.json(solicitacoes);
        } catch (error) {
            logger.error({ error }, 'Erro ao buscar dados');
            return res.status(500).json({ error: 'Erro ao buscar dados.' });
        }
    }

    async show(req: Request, res: Response) {
        try {
            logger.info('Buscando solicitação por ID');
            const { id } = req.params;
            const solicitacao = await prisma.solicitacao.findUnique({ where: { id } });

            if (!solicitacao) {
                logger.warn({ id }, 'Solicitação não encontrada');
                return res.status(404).json({ error: 'Solicitação não encontrada.' });
            }
            return res.json(solicitacao);
        } catch (error) {
            logger.error({ error }, 'Erro ao buscar dado');
            return res.status(500).json({ error: 'Erro ao buscar dado.' });
        }
    }
}