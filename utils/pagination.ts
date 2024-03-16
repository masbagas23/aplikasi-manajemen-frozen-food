export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 10
  const offset = page ? page * limit : 0

  return { limit, offset }
}

export const getPagingData = (
  models: { [key: string]: any },
  page: number,
  limit: number
) => {
  const { count: total, rows: data } = models
  const currentPage = page ? +page : 0
  const currentPageFront = page ? +page + Number(1) : Number(1)
  const totalPages = Math.ceil(total / limit - Number(1))
  const totalPagesFront = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      total,
      totalPages,
      totalPagesFront,
      currentPage,
      currentPageFront,
    },
  }
}
