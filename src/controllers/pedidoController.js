import sequelize from '../config/database.js';
import Pedido from '../models/Pedido.js';
import Usuario from '../models/Usuario.js';
import Produto from '../models/Produto.js';

export const criar = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { usuario_id, produto_id, quantidade } = req.body;
    if (!usuario_id || !produto_id || !quantidade)
      return res.status(400).json({ erro: 'usuario_id, produto_id e quantidade são obrigatórios' });

    const usuario = await Usuario.findByPk(usuario_id, { transaction: t });
    if (!usuario) { await t.rollback(); return res.status(404).json({ erro: 'Usuário não encontrado' }); }

    const produto = await Produto.findByPk(produto_id, { transaction: t, lock: true });
    if (!produto) { await t.rollback(); return res.status(404).json({ erro: 'Produto não encontrado' }); }

    if (produto.estoque < quantidade) {
      await t.rollback();
      return res.status(400).json({ erro: `Estoque insuficiente. Disponível: ${produto.estoque}` });
    }

    await produto.update({ estoque: produto.estoque - quantidade }, { transaction: t });
    const pedido = await Pedido.create({ usuario_id, produto_id, quantidade }, { transaction: t });

    await t.commit();
    res.status(201).json(pedido);
  } catch (err) {
    await t.rollback();
    if (err.name === 'SequelizeValidationError')
      return res.status(400).json({ erro: err.errors.map(e => e.message) });
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const listar = async (_req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        { model: Produto, as: 'produto', attributes: ['id', 'nome', 'preco'] },
      ],
    });
    res.json(pedidos);
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        { model: Produto, as: 'produto', attributes: ['id', 'nome', 'preco'] },
      ],
    });
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    res.json(pedido);
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const atualizar = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const pedido = await Pedido.findByPk(req.params.id, { transaction: t });
    if (!pedido) { await t.rollback(); return res.status(404).json({ erro: 'Pedido não encontrado' }); }

    const { quantidade } = req.body;
    if (quantidade === undefined) { await t.rollback(); return res.status(400).json({ erro: 'quantidade é obrigatória' }); }

    const produto = await Produto.findByPk(pedido.produto_id, { transaction: t, lock: true });
    const diff = quantidade - pedido.quantidade;

    if (diff > 0 && produto.estoque < diff) {
      await t.rollback();
      return res.status(400).json({ erro: `Estoque insuficiente. Disponível: ${produto.estoque}` });
    }

    await produto.update({ estoque: produto.estoque - diff }, { transaction: t });
    await pedido.update({ quantidade }, { transaction: t });

    await t.commit();
    res.json(pedido);
  } catch (err) {
    await t.rollback();
    if (err.name === 'SequelizeValidationError')
      return res.status(400).json({ erro: err.errors.map(e => e.message) });
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const deletar = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const pedido = await Pedido.findByPk(req.params.id, { transaction: t });
    if (!pedido) { await t.rollback(); return res.status(404).json({ erro: 'Pedido não encontrado' }); }

    const produto = await Produto.findByPk(pedido.produto_id, { transaction: t, lock: true });
    await produto.update({ estoque: produto.estoque + pedido.quantidade }, { transaction: t });
    await pedido.destroy({ transaction: t });

    await t.commit();
    res.status(204).send();
  } catch {
    await t.rollback();
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
