import { JSDOM } from 'jsdom'

const jsdom = ({data, link}) => {
  const dom = new JSDOM(data)
  return {
    document: dom.window.document,
    link: link
  }
}

export default jsdom
