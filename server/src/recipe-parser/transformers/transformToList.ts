function transformToList(value, key) {
  if (typeof value === 'string') {
    if (value.includes(',')) {
      return value.split(',').map(item => item.trim())
    }

    return [value]
  }
  if (Array.isArray(value)) {
    return value
  }
  return value
}

export default transformToList
