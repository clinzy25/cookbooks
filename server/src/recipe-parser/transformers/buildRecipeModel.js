import consolidateRecipeProperties from './consolidateRecipeProperties'
import propertyTransformerMap from './propertyTransformerMap'

const buildRecipeModel = (prospectiveProperties, chtml) => {
  const recipe = consolidateRecipeProperties(prospectiveProperties, chtml)

  // parse and transform the property values
  const transformedRecipe = {}
  Object.entries(recipe).forEach(([key, value]) => {
    const propertyTransformer = propertyTransformerMap[key]
    if (propertyTransformer && value) {
      transformedRecipe[key] = propertyTransformer(value, key, chtml)
    }
  })

  return transformedRecipe
}

export default buildRecipeModel
