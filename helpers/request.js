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
    console.log(err)
  }
}

export default request
