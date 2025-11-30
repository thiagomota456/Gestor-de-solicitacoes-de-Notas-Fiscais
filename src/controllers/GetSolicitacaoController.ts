import { Request, Response } from 'express';
import { prisma } from '../prisma';

export class GetSolicitacaoController {

    async index(req: Request, res: Response) {
        try {
            const solicitacoes = await prisma.solicitacao.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return res.json(solicitacoes);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar dados.' });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const solicitacao = await prisma.solicitacao.findUnique({ where: { id } });

            if (!solicitacao) {
                return res.status(404).json({ error: 'Solicitação não encontrada.' });
            }
            return res.json(solicitacao);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar dado.' });
        }
    }
}