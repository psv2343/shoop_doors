import compose from "./helpers/compose.js"
import getItems from "./method/getItems.js"
import getCatalog from "./method/getCatalog.js"
import getOptions from "./method/getOptions.js"
import createJsonFile from "./method/createJsonFile.js"


const main = async () => {
  await compose(
    createJsonFile,
    getCatalog,
    getOptions,
    getItems,
  )()
}

main()
