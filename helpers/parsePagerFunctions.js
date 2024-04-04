import {
  arrayFromSelector,
  attributeElement,
  getElementByAttribute,
  getElementWithAttribute,
  textFromSelector
} from "./documentFunction"
import {
  extractOIDFromUrl,
  extractSKUFromUrl,
  generateIdFromUrl
} from "./helpers"

export const defaultParametrs = (link) => {
  return {
    id: generateIdFromUrl(link),
    sku: extractSKUFromUrl(link),
    oid: extractOIDFromUrl(link),
    url: link,
    hasData: false,
  }
}

export const getColors = (url, document) => {
  const item = getElementWithAttribute(document, '.item_wrapper .item.active', 'data-obgi')
  if (!item) return null
  return {
    name: item.getAttribute('title'),
    image: url + item.getAttribute('data-obgi')
  }
}

export const getParametrs = (document) => {
  return arrayFromSelector(document, '.item_wrapper')
    .map((params) => {
      return Object.fromEntries([
        textFromSelector(params, '.bx_item_section_name')?.split('—')
      ])
    })
}

export const getProperties = (document) => {
  return arrayFromSelector(document, '.properties__item')
    .map((property) => {
      return {
        name: textFromSelector(property, '.properties__title '),
        value: textFromSelector(property, '.properties__value')
      }
    })
}

export const getConstructor = (url, link, document) => {
  const oid = extractOIDFromUrl(link)
  const constructorDocument = getElementByAttribute(document, 'data-oid', oid)
  if (!constructorDocument) return []
  return arrayFromSelector(constructorDocument, 'tr.bordered')
    .map((constructor) => {
      return {
        id: generateIdFromUrl(url + attributeElement(constructor, 'data-url')),
        quantity: attributeElement(constructor, 'data-quantity')
      }
    })
}

export const getTizers = (document) => {
  return arrayFromSelector(document, '.tizers .item-wrapper')
    .map((tizer) => {
      return textFromSelector(tizer, '.inner-text')
    })
}
