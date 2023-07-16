export const consolidateRecipeProperties = (prospectiveProperties) => {
  const {
    url,
    name,
    image,
    photo,
    thumbnailUrl,
    description,
    cookTime,
    prepTime,
    totalTime,
    recipeYield,
    yield: rYield,
    recipeIngredients,
    recipeIngredient,
    ingredients,
    ingredient,
    recipeInstructions,
    instructions,
    step,
    recipeCategory,
    recipeCuisine,
    recipeType,
    keywords,
    tag,
  } = prospectiveProperties

  return {
    url,
    name, // string
    image: image || photo || thumbnailUrl, // string
    description, // string
    cookTime, // string
    cookTimeOriginalFormat: cookTime, // string
    prepTime, // string
    prepTimeOriginalFormat: prepTime, // string
    totalTime, // string
    totalTimeOriginalFormat: totalTime, // string
    recipeYield: recipeYield || rYield, // string
    recipeIngredients: recipeIngredient || recipeIngredients || ingredients || ingredient, // array of strings
    recipeInstructions: recipeInstructions || instructions || step, // array of strings
    recipeCategories: recipeCategory, // array of strings
    recipeCuisines: recipeCuisine, // array of strings
    recipeTypes: recipeType, // array of strings
    keywords: keywords || tag, // array of strings
  }
}

export default consolidateRecipeProperties
