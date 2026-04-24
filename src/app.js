import 'dotenv/config';
import express from 'express';
import sequelize from './config/database.js';

import usuariosRouter from './routes/usuarios.js';
import produtosRouter from './routes/produtos.js';
import pedidosRouter from './routes/pedidos.js';

import './models/Usuario.js';
import './models/Produto.js';
import './models/Pedido.js';

const app = express();
app.use(express.json());

app.use('/usuarios', usuariosRouter);
app.use('/produtos', produtosRouter);
app.use('/pedidos', pedidosRouter);

app.get('/', (_req, res) => res.json({ message: 'API Desafio Sequelize funcionando!' }));

const PORT = 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco de dados sincronizado.');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch(err => {
    console.error('Erro ao conectar com o banco de dados:', err.message);
    process.exit(1);
  });

export default app;
