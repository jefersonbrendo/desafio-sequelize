import Produto from '../models/Produto.js';

export const criar = async (req, res) => {
  try {
    const { nome, preco, estoque } = req.body;
    if (!nome || preco === undefined)
      return res.status(400).json({ erro: 'nome e preco são obrigatórios' });

    const produto = await Produto.create({ nome, preco, estoque: estoque ?? 0 });
    res.status(201).json(produto);
  } catch (err) {
    if (err.name === 'SequelizeValidationError')
      return res.status(400).json({ erro: err.errors.map(e => e.message) });
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const listar = async (_req, res) => {
  try {
    const produtos = await Produto.findAll();
    res.json(produtos);
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(produto);
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const atualizar = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

    const { nome, preco, estoque } = req.body;
    await produto.update({ nome, preco, estoque });
    res.json(produto);
  } catch (err) {
    if (err.name === 'SequelizeValidationError')
      return res.status(400).json({ erro: err.errors.map(e => e.message) });
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const deletar = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    await produto.destroy();
    res.status(204).send();
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
