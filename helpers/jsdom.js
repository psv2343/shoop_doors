import { JSDOM } from 'jsdom'

const jsdom = ({data, link}) => {
  if (!data) return {document: null, link}
  const dom = new JSDOM(data)
  return {
    document: dom.window.document,
    link: link
  }
}

export default jsdom
