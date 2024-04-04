export const textElement= (element = {}) => element?.textContent?.trim().replace(/\s+/g, ' ')

export const attributeElement = (element = {}, attribute = '') => element?.getAttribute(attribute) || ''

export const linkFromSelector = (document = {}, selector = '') => attributeElement(document.querySelector(selector), 'href')

export const textFromArray = (array = []) => array.map(textElement)

export const elementFromSelector = (document = {}, selector = '') => document.querySelector(selector)

export const arrayFromSelector = (document = {}, selector = '') => Array.from(document.querySelectorAll(selector))

export const textFromSelector = (document = {}, selector = '') => textElement(document.querySelector(selector))

export const imageFromSelector = (document = {}, selector = '') => attributeElement(document.querySelector(selector), 'src')

export const attributeFromSelector = (document = {}, selector = '', attribute = '') => attributeElement(document.querySelector(selector), attribute)

export const getElementByAttribute = (document = {}, attribute = '', value = '') => document.querySelector(`[${attribute}="${value}"]`)

export const getElementWithAttribute = (document = {}, selector = '', attribute = '') => document.querySelector(`${selector} [${attribute}]`)
