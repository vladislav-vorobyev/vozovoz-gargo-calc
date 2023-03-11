import axios from 'axios'

// define a point location type for price request
type LocationPoint = { location: string; terminal: string } | { location: string }

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  // define axios
  let _axios = axios.create({
    baseURL: '/api/proxy',
    headers: {
      'Content-type': 'application/json',
    },
  })

  let api = {
    // axios object to make requests
    axios: _axios,

    // API version
    getVersion: () => {
      return _axios.post('/', {
        object: 'version',
        action: 'get',
      })
    },

    // Location
    getLocation: (offset: number, limit: number, search: string = '') => {
      if (search === '')
        return _axios.post('/', {
          object: 'location',
          action: 'get',
          params: {
            offset: offset,
            limit: limit,
            hasTerminals: true,
          },
        })
      else
        return _axios.post('/', {
          object: 'location',
          action: 'get',
          params: {
            offset: offset,
            limit: limit,
            search: search,
          },
        })
    },

    // Price
    getPrice: (
      volume: number,
      weight: number,
      from: string,
      fromTerminal: boolean,
      to: string,
      toTerminal: boolean
    ) => {
      const dispatchPoint = fromTerminal
        ? { location: from, terminal: 'default' } // терминал по умолчанию
        : { location: from }
      const destinationPoint = toTerminal
        ? { location: to, terminal: 'default' } // терминал по умолчанию
        : { location: to }
      const body = {
        object: 'price',
        action: 'get',
        params: {
          cargo: {
            dimension: {
              // габариты
              quantity: 1, // количество мест
              volume: volume, // общий объем
              weight: weight, // общий вес
            },
          },
          gateway: {
            // откуда
            dispatch: {
              point: dispatchPoint,
            },
            destination: {
              // куда
              point: destinationPoint,
            },
          },
        },
      }
      return _axios.post('/', body)
    },
  }

  return {
    provide: {
      api: api,
    },
  }
})
