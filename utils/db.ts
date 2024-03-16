import { Sequelize } from 'sequelize'

export const db = new Sequelize('frozenfood', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})