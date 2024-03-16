import { DataTypes, Model } from 'sequelize'
import { db as sequelize } from '~/utils/db'

class RoleMenu extends Model {}
RoleMenu.init({
  roleId: DataTypes.INTEGER,
  menuId: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'RoleMenu',
});

export default RoleMenu