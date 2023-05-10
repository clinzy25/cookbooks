import axios from 'axios'
import cheerio from 'cheerio'
import MicrodataScraper from './scrapers/MicrodataScraper'
import JsonLdScraper from './scrapers/JsonLdScraper'

const errorMessage = 'Could not find recipe data'

export default async function recipeDataScraper(url: string) {
  let chtml
  try {
    const resp = await axios(url)
    chtml = cheerio.load(resp.data)
  } catch (error) {
    throw new Error(errorMessage)
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
  throw new Error(errorMessage)
}
