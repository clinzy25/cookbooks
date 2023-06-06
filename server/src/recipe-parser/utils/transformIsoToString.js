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
      const hours = Math.floor(dateObj.minutes / 60)
      const minutes = dateObj.minutes % 60 > 0 ? `${dateObj.minutes % 60}m` : ''
      result += `${hours}h ${minutes}`
    } else {
      result += `${dateObj.minutes}m `
    }
  }

  return result.trim()
}
