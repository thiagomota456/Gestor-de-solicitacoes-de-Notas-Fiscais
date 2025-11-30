import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { solicitacaoSchema } from '../schemas/solicitacaoSchema';
import { logger } from '../utils/logger';

export class CreateSolicitacaoController {
    async handle(req: Request, res: Response) {
        try {
            const result = solicitacaoSchema.safeParse(req.body);

            if (!result.success) {
                logger.warn({ errors: result.error.flatten() }, 'Tentativa de criação com dados inválidos');
                return res.status(400).json({
                    error: 'Dados inválidos',
                    detalhes: result.error.format()
                });
            }

            const { data } = result;

            logger.info({ cnpj: data.cnpj }, 'Criando nova solicitação de NF');

            const solicitacao = await prisma.solicitacao.create({
                data: {
                    ...data,
                    dataDesejada: new Date(data.dataDesejada),
                    status: 'PENDENTE_EMISSAO'
                }
            });

            logger.info({ id: solicitacao.id }, 'Solicitação criada com sucesso');

            return res.status(201).json(solicitacao);
        } catch (error) {
            logger.error({ error }, 'Erro ao criar solicitação');
            return res.status(500).json({ error: 'Erro interno.' });
        }
    }
}
