import axios from 'axios'
import cheerio from 'cheerio'
import MicrodataScraper from './scrapers/MicrodataScraper'
import JsonLdScraper from './scrapers/JsonLdScraper'
import { RECIPE_NOT_FOUND } from '../utils/utils.errors'

export default async function recipeDataScraper(url) {
  let chtml
  try {
    const resp = await axios(url)
    chtml = cheerio.load(resp.data)
  } catch (error) {
    throw new Error(RECIPE_NOT_FOUND)
  }
  try {
    const jsonLdScraper = new JsonLdScraper(chtml, url)
    const recipe = jsonLdScraper.getRecipe()

    return {
      ...recipe,
      url,
    }
  } catch (e) {
    console.error(e)
  }
  try {
    const microdataScraper = new MicrodataScraper(chtml, url)
    const recipe = microdataScraper.getRecipe()

    return {
      ...recipe,
      url,
    }
  } catch (e) {
    console.error(e)
  }
  throw new Error(RECIPE_NOT_FOUND)
}
