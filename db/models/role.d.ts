import { DataTypes, Model } from 'sequelize'
import { db as sequelize } from '~/utils/db'

class Role extends Model {}
Role.init(
  {
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'Role',
    defaultScope: {
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt'],
      },
    },
  }
)

export default Role
