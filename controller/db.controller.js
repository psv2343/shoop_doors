import { JSONFilePreset } from 'lowdb/node'

const getDatabase = async (path = './db/products.json', defaultData = {}) => {
  return await JSONFilePreset(path, defaultData)
}

export const setData = async (data = []) => {
  try {
    const db = await getDatabase()
    await db.update((items) => {
      for (const item of data) {
        items[item.id] = item
      }
    })
  } catch (err) {
    console.log(`Error in setData: ${err.message}`)
  }
}

export const getData = async () => {
  try {
    const db = await getDatabase()
    return db.data
  } catch (err) {
    console.log(`Error in getData: ${err.message}`)
  }
}
