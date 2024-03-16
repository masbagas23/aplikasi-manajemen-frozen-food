import { DataTypes, Model } from 'sequelize'
import { db as sequelize } from '~/utils/db'

class User extends Model {}
User.init(
  {
    fullName: {
      type: DataTypes.STRING,
    },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    avaUrl: { type: DataTypes.STRING },
    roleId: { type: DataTypes.INTEGER },
    deletedAt: { type: DataTypes.DATE },
  },
  {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['deletedAt', 'createdAt'],
      },
    },
  }
)

export default User
