function transformImage(value) {
  if (typeof value === 'string') {
    return value
  }

  if (value.url) {
    return value.url
  }

  if (Array.isArray(value)) {
    return value[0].url ||  value[0]
  }

  return value
}

export default transformImage
