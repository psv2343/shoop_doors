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
import { getData, setData } from "../controller/db.controller.js"
import { generateIdFromUrl, getFilterLinksBySKU } from "../helpers/helpers.js"

const SET_PARALLEL = 5
const FILTER_LINK = true
const URL = 'https://shop.za-door.ru/'

const parsePage = async ({document, link}) => {
  if (!document || elementFromSelector(document, '.page_not_found')) {
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
    description: textFromSelector(document, '.detail-text-wrap1')?.split('•'),
    hasData: true
  }
}

const filterLinks = async (links) => {
  if (FILTER_LINK) {
    const db = await getData()
    const filterLinks = await getFilterLinksBySKU(db)
    return links.filter(link => !(filterLinks[link] || !db[generateIdFromUrl(link)]))
  }
  return links
}

const getOptions = async (links) => {
  links = (await filterLinks(links))
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
    await setData(options)
  }
}

export default getOptions
