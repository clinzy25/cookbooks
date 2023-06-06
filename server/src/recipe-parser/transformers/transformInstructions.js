import cleanString from '../utils/cleanString'

function transformInstructions(value) {
  if (typeof value === 'string') {
    const cleanedValue = cleanString(value)
    if (cleanedValue.includes('.,')) {
      // special case for kingarthurflour.com
      return cleanedValue.split('.,').map(item => item.trim())
    }

    return [cleanedValue]
  }

  if (Array.isArray(value)) {
    // microdata
    const firstItem = value[0]
    if (typeof firstItem === 'string') {
      return value.map(item => {
        return {
          type: 'HowToStep',
          text: cleanString(item),
        }
      })
    }

    // json ld
    return value.map(item => {
      if (item['@type'] === 'HowToStep') {
        if (item.text) {
          return {
            type: item['@type'],
            text: cleanString(item.text),
          }
        }
      } else if (item['@type'] === 'HowToSection') {
        return {
          type: item['@type'],
          name: item.name,
          instructions: item.itemListElement.map(item => {
            if (item.text) {
              return {
                type: item['@type'],
                text: cleanString(item.text),
              }
            }
          }),
        }
      }
    })
  }
}

export default transformInstructions
