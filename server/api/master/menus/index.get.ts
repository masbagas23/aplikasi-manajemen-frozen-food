import Menu from "~/db/models/menu.d"
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const menus = await Menu.findAll({
    where: {
      parent_id: null
    },
    include: [
      'children'
    ]
  })

  return {
    status: 'success',
    data: menus
  }
})
