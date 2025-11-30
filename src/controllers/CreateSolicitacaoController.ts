import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { solicitacaoSchema } from '../schemas/solicitacaoSchema';

export class CreateSolicitacaoController {
    async handle(req: Request, res: Response) {
        try {
            const result = solicitacaoSchema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    error: 'Dados inválidos',
                    detalhes: result.error.format()
                });
            }

            const { data } = result;

            const solicitacao = await prisma.solicitacao.create({
                data: {
                    ...data,
                    dataDesejada: new Date(data.dataDesejada),
                    status: 'PENDENTE_EMISSAO'
                }
            });

            return res.status(201).json(solicitacao);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro interno.' });
        }
    }
}
