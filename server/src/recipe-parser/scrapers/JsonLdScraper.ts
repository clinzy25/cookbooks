import Scraper from './Scraper'

class JsonLdScraper extends Scraper {
  constructor(chtml) {
    super(chtml)
    this.type = 'jsonld'
  }

  testForMetadata() {
    var json = []
    const jsonLdFromHtml = this.chtml('script[type="application/ld+json"]')

    Object.entries(jsonLdFromHtml).forEach(([, item]) => {
      let contents
      try {
        if (item && item.children && item.children[0] && item.children[0].data) {
          contents = JSON.parse(item.children[0].data)
        }
      } catch (e) {
        return
      }
      if (contents) {
        json.push(contents)
      }
    })

    if (json.length === 0) {
      return
    }

    this.meta = json.length > 1 ? json : json[0]
  }

  findRecipeItem() {
    if (this.meta['@type'] === 'Recipe') {
      // nytimes, food.com, bonappetite, ohsheglows, simplyrecipes
      this.recipeItem = this.meta
      return
    }
    // @graph: king arthur, 12tomatoes, sallysbaking, cookie&kate
    // other: martha stewart, foodnetwork, eatingwell, allrecipes, myrecipes, seriouseats, skinnytaste
    const graphLevel = this.meta['@graph'] || this.meta
    this.recipeItem = Object.values(graphLevel).find(item => item['@type'] === 'Recipe')
  }
}

export default JsonLdScraper
