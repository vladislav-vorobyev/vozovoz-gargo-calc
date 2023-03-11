import axios from 'axios'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Prepare axios
  let _axios = axios.create({
    baseURL: config.CARGO_API_URL,
    headers: {
      'Content-type': 'application/json',
      Authorization: 'Basic ' + config.CARGO_API_AUTH,
    },
  })

  // Prepare request body
  const body = await readBody(event)
  // console.log('#--- request body ---\n', body)

  // Request to target system
  const { data } = await _axios.post('', body)
  // console.log('#--- response ---\n', data)

  return data
})
