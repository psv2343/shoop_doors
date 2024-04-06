import convert from 'xml-js'
import compose from "../helpers/compose.js"
import request from "../helpers/request.js"

const links= ['https://shop.za-door.ru/sitemap-iblock-43.xml', 'https://shop.za-door.ru/sitemap-iblock-41.xml']

const getItemLinks = async (sitemap) => {
  return sitemap.urlset.url.map(url => url.loc._text)
}

const xmlToObj = async ({data}) => {
  return convert.xml2js(data, {compact: true, spaces: 4});
}

const getItems = async () => {
  const result = await Promise.all(
    links.map(link => compose(
        getItemLinks,
        xmlToObj,
        request
      )(link)
    ))
  return result.flat()
}

export default getItems
