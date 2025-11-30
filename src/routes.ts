import { Router } from 'express';
import { CreateSolicitacaoController } from './controllers/CreateSolicitacaoController';
import { GetSolicitacaoController } from './controllers/GetSolicitacaoController';
import { EmitirNotaFiscalController } from './controllers/EmitirNotaFiscalController';

const router = Router();

// Instanciando os controllers
const createController = new CreateSolicitacaoController();
const getController = new GetSolicitacaoController();
const emitirController = new EmitirNotaFiscalController();

// Rotas
router.post('/solicitacoes', (req, res) => createController.handle(req, res));
router.get('/solicitacoes', (req, res) => getController.index(req, res));
router.get('/solicitacoes/:id', (req, res) => getController.show(req, res));
router.post('/solicitacoes/:id/emitir', (req, res) => emitirController.handle(req, res));

export { router };
