import Role from '~/db/models/role.d'

export default defineEventHandler(async (event) => {
  const roles = await Role.findAll({
    where:{
      deletedAt: null
    }
  })

  return {
    status: 'success',
    data: roles,
  }
})
// import Role from '~/db/models/role'

// export default defineEventHandler(async (event) => {
//   const query = getQuery(event)

//   const roles = await Role.findAll()

//   return {
//     status: 'success',
//     data: roles,
//   }
// })
