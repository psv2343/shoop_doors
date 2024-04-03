export const copy = (object = {}) => {
  return JSON.parse(JSON.stringify(object))
}
