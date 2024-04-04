import jsdom from "../helpers/jsdom.js"
import request from "../helpers/request.js"
import compose from "../helpers/compose.js"
import {
  arrayFromSelector,
  attributeElement,
  elementFromSelector,
  getElementByAttribute,
  getElementWithAttribute,
  linkFromSelector,
  textFromSelector
} from "../helpers/documentFunction.js"
import { extractOIDFromUrl, extractSKUFromUrl, generateIdFromUrl, getUrl } from "../helpers/helpers.js"

const SET_PARALLEL = 5
const URL = 'https://shop.za-door.ru/'

const defaultParametrs = (link) => {
  return {
    id: generateIdFromUrl(link),
    sku: extractSKUFromUrl(link),
    oid: extractOIDFromUrl(link),
    url: link,
    hasData: false,
  }
}

const getColors = (document) => {
  const item = getElementWithAttribute(document, '.item_wrapper .item.active', 'data-obgi')
  if (!item) return null
  return {
    name: item.getAttribute('title'),
    image: URL + item.getAttribute('data-obgi')
  }
}

const getParametrs = (document) => {
  return arrayFromSelector(document, '.item_wrapper')
    .map((params) => {
      return Object.fromEntries([
        textFromSelector(params, '.bx_item_section_name')?.split('—')
      ])
    })
}

const getProperties = (document) => {
  return arrayFromSelector(document, '.properties__item')
    .map((property) => {
      return {
        name: textFromSelector(property, '.properties__title '),
        value: textFromSelector(property, '.properties__value')
      }
    })
}

const getConstructor = (oid, document) => {
  const constructorDocument = getElementByAttribute(document, 'data-oid', oid)
  if (!constructorDocument) return []
  return arrayFromSelector(constructorDocument, 'tr.bordered')
    .map((constructor) => {
      return {
        id: generateIdFromUrl(URL + attributeElement(constructor, 'data-url')),
        quantity: attributeElement(constructor, 'data-quantity')
      }
    })
}

const getTizers = (document) => {
  return arrayFromSelector(document, '.tizers .item-wrapper')
    .map((tizer) => {
      return textFromSelector(tizer, '.inner-text')
    })
}

const parsePage = async ({document, link}) => {
  if (elementFromSelector(document, '.page_not_found')) {
    return defaultParametrs(link)
  }
  return {
    ...defaultParametrs(link),
    title: textFromSelector(document, '#pagetitle'),
    price: textFromSelector(document, '.price_value'),
    image: URL + linkFromSelector(document, '.product-detail-gallery__link'),
    color: getColors(document),
    quantity: textFromSelector(document, '.quantity_block_wrapper'),
    parametrs: getParametrs(document),
    properties: getProperties(document),
    constructor: getConstructor(extractOIDFromUrl(link), document),
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
