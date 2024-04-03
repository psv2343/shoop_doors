import { JSDOM } from 'jsdom'

const jsdom = (data) => {
  const dom = new JSDOM(data)
  return dom.window.document
}

export default jsdom
