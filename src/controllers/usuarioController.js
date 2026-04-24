import Usuario from '../models/Usuario.js';

export const criar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha)
      return res.status(400).json({ erro: 'nome, email e senha são obrigatórios' });

    const usuario = await Usuario.create({ nome, email, senha });
    res.status(201).json(usuario);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({ erro: 'Email já cadastrado' });
    if (err.name === 'SequelizeValidationError')
      return res.status(400).json({ erro: err.errors.map(e => e.message) });
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const listar = async (_req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['senha'] } });
    res.json(usuarios);
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['senha'] },
    });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(usuario);
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const atualizar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const { nome, email, senha } = req.body;
    await usuario.update({ nome, email, senha });
    res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({ erro: 'Email já cadastrado' });
    if (err.name === 'SequelizeValidationError')
      return res.status(400).json({ erro: err.errors.map(e => e.message) });
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const deletar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    await usuario.destroy();
    res.status(204).send();
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
