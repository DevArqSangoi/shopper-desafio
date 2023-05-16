// server/src/utils/sequelize.ts - Back-end
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('shopper_teste', 'root', 'abluble', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;