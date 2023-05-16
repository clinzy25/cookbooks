import { parse } from 'iso8601-duration'
import transformToString from './transformToString'
import transformISOToString from '../utils/transformIsoToString'

function transformToTime(value, key) {
  const time = transformToString(value)
  try {
    const parsedISODuration = parse(time)
    if (parsedISODuration) {
      return transformISOToString(parsedISODuration)
    }
  } catch (e) {
    console.error(e)
  }

  return time
}

export default transformToTime
