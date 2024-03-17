import User from '~/db/models/user.d'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const user = await User.findOne({
    where: {
      id: id,
    },
  })
  return {
    status: 'success',
    data: user,
  }
})
