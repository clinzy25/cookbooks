import buildRecipeModel from '../transformers/buildRecipeModel'

class Scraper {
  constructor(chtml) {
    this.chtml = chtml

    this.meta = null
    this.recipeItem = null

    if (!this.testForMetadata) {
      throw {
        message: 'testForMetadata function must be implemented by child class',
      }
    }

    if (!this.findRecipeItem) {
      throw {
        message: 'findRecipeItem function must be implemented by child class',
      }
    }
  }

  getRecipe() {
    this.testForMetadata()

    if (!this.meta) {
      throw {
        message: 'no meta data was found',
        type: this.type,
      }
    }

    this.findRecipeItem()
    if (!this.recipeItem) {
      throw {
        message: 'found metadata, but no recipe information',
        type: this.type,
      }
    }

    try {
      this.finalRecipe = buildRecipeModel(this.recipeItem)

      return this.finalRecipe
    } catch (error) {
      throw {
        message: 'found recipe information, there was a problem with mapping the data',
        type: this.type,
      }
    }
  }
}

export default Scraper
