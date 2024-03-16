import { reactive } from 'vue'
import User from '~/db/models/user.d'
import { Op } from 'sequelize'
import _ from 'lodash'
import { getPagination, getPagingData } from '~/utils/pagination'

interface paramObject {
  limit: string
  page: string
  col: string // Sort By Colomn Name
  asc: string // true ASC | false DESC
  q: string // query
}

export default defineEventHandler(async (event) => {
  try {
    const params = getQuery(event) as paramObject
    let whereClause: { [key: string]: any } = {} // Define the structure

    if (params.q) {
      whereClause.fullName = {
        [Op.like]: `%${params.q}%`,
      }
    }
    const { limit, offset } = getPagination(
      parseInt(params.page),
      parseInt(params.limit)
    )
    const users: { [key: string]: any } = await User.findAndCountAll({
      order: [[params.col, params.asc == 'true' ? 'ASC' : 'DESC']],
      limit: limit,
      offset: offset,
      where: whereClause,
    })
    return {
      status: 'success',
      data: getPagingData(users, limit, offset),
    }
  } catch (e: unknown) {
    return e
  }
})
