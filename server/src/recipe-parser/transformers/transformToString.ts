function transformToString(value, key) {
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}

export default transformToString
