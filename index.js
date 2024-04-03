import compose from "./helpers/compose.js"
import getCatalog from "./method/getCatalog.js"


const main = async () => {
  await compose(
    // createXLSX,
    // getOptions,
    // getProduct,
    getCatalog
  )()
}

main()
