import { getData, writeJson } from "../controller/db.controller.js"
import compose from "../helpers/compose.js"
import { transformJson } from "../helpers/transformJson.js"

const formatProduct = ({url, hasData, breadcrumbs, constructor, ...products}) => {
  return {
    parentCategory: breadcrumbs.at(2)?.name,
    category: breadcrumbs.at(3)?.name,
    subCategory: breadcrumbs.at(4)?.name,
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
    ...catalog,
    products,
    info
  }
}


const createJsonFile = async (data) => {
    await compose(
      writeJson,
      setItems,
      transformJson
    )(data)
}

export default createJsonFile
