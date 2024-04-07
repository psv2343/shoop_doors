export const copy = (object = {}) => {
  return JSON.parse(JSON.stringify(object))
}

export const getUrl = (str) => {
  const regex = /url\('(.+?)'\)/;
  const match = str.match(regex);
  const link = match ? match[1] : null
  return link
}


export function generateIdFromUrl(url) {
  let hash = 0
  if (!url || url?.length === 0) return hash
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash &= hash
  }
  return Math.abs(hash)
}

export function extractSKUFromUrl(url) {
  const match = url.match(/\/(\d+)/);
  if (match) {
      return parseInt(match[1]);
  } else {
      return null;
  }
}

export function extractOIDFromUrl(url) {
  const match = url.match(/\?oid=(\d+)/);
  if (match) {
      return parseInt(match[1]);
  } else {
      return 0;
  }
}

export const getFilterLinksBySKU = async (db) => {
  return Object.fromEntries(Object.values(db).reduce((acc, value) => {
    if (value.hasData === false) {
      acc.push([value.url, true])
    }
    return acc
  }, []))
}
