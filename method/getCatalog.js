import jsdom from "../helpers/jsdom.js"
import request from "../helpers/request.js"
import compose from "../helpers/compose.js"
import {
  arrayFromSelector,
  attributeElement,
  linkFromSelector,
  textFromArray,
  textFromSelector
} from "../helpers/documentFunction.js"
import { setCatalog } from "../controller/db.controller.js"

const URL = 'https://shop.za-door.ru'
const WRITE_CATALOG = false

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
    // .filter(documentSubCategory => !textFromSelector(documentSubCategory, '.section').includes('оллекци'))
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

const getInformation = (document) => {
  const info = {
    sizePosts: 'Замер',
    deliveryPosts: 'Доставка и подъем',
    installationPosts: 'Установка',
    moscowPosts: 'Москва и область',
    russiaPosts: 'Регионы России',
  }
  return arrayFromSelector(document, '.tab-pane').map(documentInfo => ({
    title: info[attributeElement(documentInfo, 'id')],
    content: textFromArray(arrayFromSelector(documentInfo, 'p'))
  }))
}

const parsePage = async ({document}) => {
  const catalog = arrayFromSelector(document, '.menu.dropdown>li')
  const catalogInfo = {
    catalog: catalog.map(documentCategory => ({
      parentCategory: textFromSelector(documentCategory, '.name'),
      subCategory: getSubCategory(documentCategory),
      collections: getCollection(documentCategory),
    })),
    info: getInformation(document)
  }
  WRITE_CATALOG && await setCatalog(catalogInfo)
  return catalogInfo
}

const getCatalog = async () => {
  return await compose(
    parsePage,
    jsdom,
    request
  )(URL +'/help/delivery-payment/')
}

export default getCatalog
