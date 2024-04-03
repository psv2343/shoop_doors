import jsdom from "../helpers/jsdom.js"
import request from "../helpers/request.js"
import compose from "../helpers/compose.js"
import {
  arrayFromSelector,
  linkFromSelector,
  textFromSelector
} from "../helpers/documentFunction.js"

const URL = 'https://shop.za-door.ru/'

const getSubSubCategory = (document) => {
  const subCategory = arrayFromSelector(document, '.menu_item') || []
  return subCategory.map(documentSubSubCategory => ({
      name: textFromSelector(documentSubSubCategory, 'a'),
      link: URL + linkFromSelector(documentSubSubCategory, 'a')
    })
  )
}

const getSubCategory = (document) => {
  const subCategory = arrayFromSelector(document, '.left-menu-wrapper>li')
  return subCategory
    .filter(documentSubCategory => !textFromSelector(documentSubCategory, '.section').includes('оллекци'))
    .map(documentSubCategory => ({
      name: textFromSelector(documentSubCategory, '.section'),
      link: URL + linkFromSelector(documentSubCategory, 'a'),
      subCategory: getSubSubCategory(documentSubCategory)
    })
  )
}

const getCollection = (document) => {
  const subCategory = arrayFromSelector(document, '.left-menu-wrapper>li')
  const collections = []
  subCategory.forEach(documentCollection => {
    if (textFromSelector(documentCollection, '.section').includes('оллекци')) {
      collections.push({
        name: textFromSelector(documentCollection, 'span'),
        link: URL + linkFromSelector(documentCollection, 'a')
      })
      for (let subCollection of arrayFromSelector(documentCollection, '.menu_item')) {
        collections.push({
          name: textFromSelector(subCollection, 'a'),
          link: URL + linkFromSelector(subCollection, 'a')
        })
      }
    }
  })
  return collections
}

const parsePage = (document) => {
  const catalog = arrayFromSelector(document, '.menu.dropdown>li')
  return catalog.map(documentCategory => ({
      parentCategory: textFromSelector(documentCategory, '.name'),
      subCategory: getSubCategory(documentCategory),
      collections: getCollection(documentCategory)
    })
  )
}

const getCatalog = async () => {
  return await compose(
    parsePage,
    jsdom,
    request
  )(URL)
}

export default getCatalog
