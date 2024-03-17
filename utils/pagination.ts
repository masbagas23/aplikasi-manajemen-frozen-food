export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 10
  const offset = page ? (page - 1) * limit : 0

  return { limit, offset }
}

export const getPagingData = (
  models: { [key: string]: any },
  page: number,
  limit: number
) => {
  const { count: total, rows: data } = models
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(total / limit)
  const startItem = page > 1 ? page * limit + 1 : 1
  const endItem = (startItem - 1) + total
  return {
    data,
    pagination: {
      total,
      totalPages,
      currentPage,
      startItem,
      endItem,
    },
  }
}
