import axios from "axios"

const request = async (url = '') => {

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {}
  }

  try {
    const response = await axios.request(config)
    return {
      data: response.data,
      link: url
    }
  } catch (err) {
    if (err.response.status === 404) {
      return {
        data: null,
        link: url
      }
    }
    throw new Error(err)
  }
}

export default request
