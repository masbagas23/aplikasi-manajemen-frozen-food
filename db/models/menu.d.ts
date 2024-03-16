import { DataTypes, Model } from 'sequelize'
import { db as sequelize } from '~/utils/db'

class Menu extends Model { }
Menu.init({
  name: DataTypes.STRING,
  url: DataTypes.STRING,
  icon: DataTypes.STRING,
  parent_id: DataTypes.INTEGER,
  deletedAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'Menu',
  defaultScope: {
    attributes: {
      exclude: ['deletedAt', 'createdAt', 'updatedAt']
    },
  },
});

Menu.hasMany(Menu, {
  foreignKey: {
    name: 'parent_id'
  },
  as: 'children'
})

Menu.belongsTo(Menu, {
  foreignKey: {
    name: 'parent_id'
  },
  as: 'parent'
})

export default Menu