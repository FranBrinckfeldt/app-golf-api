const getStatusColor = (statusCode: number) : number => {
  if (statusCode >= 200 && statusCode < 300) return 32
  if (statusCode >= 300 && statusCode < 400) return 36
  if (statusCode >= 400 && statusCode < 500) return 33
  if (statusCode >= 500 && statusCode < 600) return 31
  return 0
}

export default getStatusColor
