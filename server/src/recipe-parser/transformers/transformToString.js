import cleanString from '../utils/cleanString'

function transformToString(value) {
  let result
  if (typeof value === 'string') {
    result = value
  }
  if (Array.isArray(value)) {
    result = value[0]
  }
  return cleanString(result)
}

export default transformToString
