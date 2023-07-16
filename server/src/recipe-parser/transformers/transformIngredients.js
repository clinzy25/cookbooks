import cleanIngredientAmounts from '../utils/cleanIngredientAmounts'
import cleanString from '../utils/cleanString'

const transformIngredients = (value, _, $) => {
  const hasIngredientCategories = $('.wprm-recipe-ingredient-group')

  if (hasIngredientCategories) {
    const ingredients = []
    let index = 0
    $('.wprm-recipe-ingredient-group')
      .toArray()
      .forEach((el, i) => {
        const header = $(el).find('.wprm-recipe-group-name').text().trim()
        const numIngredients = $(el).find('.wprm-recipe-ingredient').toArray().length
        const ingredientsGroup = value
          .slice(index, index + numIngredients)
          .map(item => cleanString(cleanIngredientAmounts(item)))
        ingredients.push({ [header]: ingredientsGroup })
        index = numIngredients
      })
    return ingredients
  } else {
    // jsonld
    if (value && typeof value[0] === 'string') {
      return value.map(item => cleanString(cleanIngredientAmounts(item)))
    }
  }

  // array of objects (microdata)
  const mappedItems = []

  Object.entries(value).forEach(([, item]) => {
    if (item.properties) {
      const { name, amount } = item.properties
      if (name || amount) {
        const _name = name && name[0]
        const _amount = amount && amount[0]
        const singleLine = _amount ? `${_amount} ${_name}` : _name
        mappedItems.push(cleanString(cleanIngredientAmounts(singleLine)))
      }
    }
  })
  // log issue
  if (mappedItems.length) {
    return mappedItems
  }

  return []
}

export default transformIngredients
