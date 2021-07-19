import getRedisClient from '../lib/getRedisClient'

export interface QueryProps {
  orderBy?: 'createdBy',
  dir?: 'ASC' | 'DESC',
  page?: number,
  limit?: number
}

export interface PaginatedData<T> {
  content: T,
  count: number,
  pages: number
}

export const joinRedisKeys = (keys: string[]) : string => keys.join(':')

export const findSortAndPaginate = async (
  parentKey: string,
  props?: QueryProps
): Promise<PaginatedData<string[]>> => {
  const propsWithDefaults = {
    orderBy: 'createdAt',
    dir: 'ASC',
    page: 1,
    limit: 10,
    ...props
  }
  const zsetKey = `${parentKey}:zset-${propsWithDefaults.orderBy}`
  const keys = await getRedisClient()[propsWithDefaults.dir === 'ASC' ? 'zrange' : 'zrevrange'](
    zsetKey,
    (propsWithDefaults.page - 1) * propsWithDefaults.limit,
    propsWithDefaults.page * (propsWithDefaults.limit - 1)
  ) as string[]
  const count = await getRedisClient().zcount(zsetKey, '-inf', '+inf')
  return {
    content: keys,
    count,
    pages: Math.ceil(count / (propsWithDefaults.limit || 10))
  }
}
