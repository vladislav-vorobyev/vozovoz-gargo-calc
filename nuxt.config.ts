// https://nuxt.com/docs/api/configuration/nuxt-config
// import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  /* alias: {
    images: fileURLToPath(new URL("./assets/images", import.meta.url)),
    style: fileURLToPath(new URL("./assets/style", import.meta.url)),
  }, */

  modules: ['@element-plus/nuxt'],

  css: [
    // SCSS file in the project
    '@/assets/css/main.scss',
  ],

  app: {
    head: {
      title: 'Калькулятор груза',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Vozovoz Калькулятор груза',
        },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  runtimeConfig: {
    // The private keys which are only available within server-side
    CARGO_API_URL: process.env.CARGO_API_URL,
    CARGO_API_AUTH: process.env.CARGO_API_AUTH,
    // Keys within public, will be also exposed to the client-side
    public: {},
  },
})
