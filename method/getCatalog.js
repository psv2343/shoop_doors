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
import { generateIdFromUrl } from "../helpers/helpers.js"

const URL = 'https://shop.za-door.ru'
const WRITE_CATALOG = true

const getSubCategory = (document, parentCategoryId, categoryId) => {
  const subCategory = arrayFromSelector(document, '.menu_item') || []
  return subCategory.map(documentSubSubCategory => {
    const link = linkFromSelector(documentSubSubCategory, 'a')
    return {
      name: textFromSelector(documentSubSubCategory, 'a'),
      id: generateIdFromUrl(link),
      categoryId: categoryId,
      parentCategoryId: parentCategoryId,
    }
  })
}

const getCategory = (document, parentCategoryId) => {
  const subCategory = arrayFromSelector(document, '.left-menu-wrapper>li')
  return subCategory
    .map(documentSubCategory => {
      const link = linkFromSelector(documentSubCategory, 'a')
      const categoryId = generateIdFromUrl(link)
      return {
        name: textFromSelector(documentSubCategory, '.section'),
        id: categoryId,
        parentCategoryId: parentCategoryId,
        subCategory: getSubCategory(documentSubCategory, parentCategoryId, categoryId)
      }
    })
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
  })).filter(({title}) => title)
}

const parsePage = async ({document}) => {
  const catalog = arrayFromSelector(document, '.menu.dropdown>li')
  const catalogInfo = {
    catalog: catalog.map(documentCategory => {
      const link = linkFromSelector(documentCategory, 'a')
      const id = generateIdFromUrl(link)
      return {
        parentCategory: textFromSelector(documentCategory, '.name'),
        id: id,
        category: getCategory(documentCategory, id)
      }
    }),
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
