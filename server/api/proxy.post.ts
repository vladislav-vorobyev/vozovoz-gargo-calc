import axios from 'axios'
import { AxiosError } from 'axios'

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
  try {
    const { data } = await _axios.post('', body)
    // console.log('#--- response ---\n', data)

    return data
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response) {
        console.log(e.toString())
        // console.log(e.response.data ?? e.response.headers)
      } else {
        console.log(e)
      }
      throw createError({
        statusCode: e.response?.status ?? 500,
        statusMessage: e.response?.statusText ?? e.toString(),
      })
    }

    throw e
  }
})
