import convert from 'xml-js'
import compose from "../helpers/compose.js"
import request from "../helpers/request.js"

const URL= 'https://shop.za-door.ru/sitemap-iblock-43.xml'

const getItemLinks = async (sitemap) => {
  return sitemap.urlset.url.map(url => url.loc._text)
}

const xmlToObj = async ({data}) => {
  return convert.xml2js(data, {compact: true, spaces: 4});
}

const getItems = async () => {
  return await compose(
    getItemLinks,
    xmlToObj,
    request
  )(URL)
}

export default getItems
