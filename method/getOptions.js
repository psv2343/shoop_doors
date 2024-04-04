import jsdom from "../helpers/jsdom.js"
import request from "../helpers/request.js"
import compose from "../helpers/compose.js"
import {
  elementFromSelector,
  linkFromSelector,
  textFromSelector
} from "../helpers/documentFunction.js"
import {
  defaultParametrs,
  getColors,
  getConstructor,
  getParametrs,
  getProperties,
  getTizers
} from "../helpers/parsePagerFunctions.js"

const SET_PARALLEL = 5
const URL = 'https://shop.za-door.ru/'

const parsePage = async ({document, link}) => {
  if (elementFromSelector(document, '.page_not_found')) {
    return defaultParametrs(link)
  }
  return {
    ...defaultParametrs(link),
    title: textFromSelector(document, '#pagetitle'),
    price: textFromSelector(document, '.price_value'),
    image: URL + linkFromSelector(document, '.product-detail-gallery__link'),
    color: getColors(URL, document),
    quantity: textFromSelector(document, '.quantity_block_wrapper'),
    parametrs: getParametrs(document),
    properties: getProperties(document),
    constructor: getConstructor(URL, link, document),
    tizers: getTizers(document),
    hasData: true
  }
}


const getOptions = async (links = ['https://shop.za-door.ru/catalog/mezhkomnatnye_dveri/vse_dveri/art-lite/30206/?oid=49672', 'https://shop.za-door.ru/catalog/mezhkomnatnye_dveri/vse_dveri/seriya-s-classic/28306/?oid=49583', 'https://shop.za-door.ru/catalog/napolnye_plintusy/51322/?oid=51325']) => {
  for (let iter = 0; iter < links.length; iter += SET_PARALLEL) {
    const linksSet = links.slice(iter, iter + SET_PARALLEL)
    const options = await Promise.all(
      linksSet.map((link) => {
        return compose(
          parsePage,
          jsdom,
          request
        )(link)
      })
    )
    console.log(options)
  }

}

export default getOptions
