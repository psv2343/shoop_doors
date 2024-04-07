import { getData, writeJson } from "../controller/db.controller.js"
import compose from "../helpers/compose.js"
import { generateIdFromUrl } from "../helpers/helpers.js"

const formatProduct = ({url, hasData, breadcrumbs, constructor, ...products}) => {
  return {
    parentCategoryId: generateIdFromUrl(breadcrumbs.at(2)?.link),
    categoryId: generateIdFromUrl(breadcrumbs.at(3)?.link),
    subCategoryId: generateIdFromUrl(breadcrumbs.at(4)?.link),
    ...products,
    constructor: constructor.map(({id, quantity}) => ({id: id, quantity: quantity})),
  }
}


const setItems = async ({catalog, info}) => {
  const itemsDb = await getData()
  const products = Object.values(itemsDb)
    .filter(item => item.hasData)
    .map(item => formatProduct(item))

  return {
    catalog: [...catalog],
    products,
    info
  }
}


const createJsonFile = async (data) => {
    await compose(
      writeJson,
      setItems
    )(data)
}

export default createJsonFile
