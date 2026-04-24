import { Router } from 'express';
import { criar, listar, buscarPorId, atualizar, deletar } from '../controllers/pedidoController.js';

const router = Router();

router.post('/', criar);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

export default router;
