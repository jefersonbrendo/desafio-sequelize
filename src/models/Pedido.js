import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './Usuario.js';
import Produto from './Produto.js';

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Usuario, key: 'id' },
  },
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Produto, key: 'id' },
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
}, {
  tableName: 'pedidos',
  timestamps: true,
});

Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Pedido.belongsTo(Produto, { foreignKey: 'produto_id', as: 'produto' });
Usuario.hasMany(Pedido, { foreignKey: 'usuario_id', as: 'pedidos' });
Produto.hasMany(Pedido, { foreignKey: 'produto_id', as: 'pedidos' });

export default Pedido;