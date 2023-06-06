export default function transformISOToString(dateObj) {
  let result = ''
  if (dateObj.days) {
    result += `${dateObj.days} days `
  }
  if (dateObj.hours) {
    result += `${dateObj.hours} hr `
  }
  if (dateObj.minutes) {
    if (dateObj.minutes > 60) {
      result += `${Math.floor(dateObj.minutes / 60)}h ${dateObj.minutes % 60}m`
    } else {
      result += `${dateObj.minutes}m `
    }
  }

  return result.trim()
}
