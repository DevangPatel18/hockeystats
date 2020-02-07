import { setup } from 'axios-cache-adapter'
import localforage from 'localforage'
import memoryDriver from 'localforage-memoryStorageDriver'

// 'async' wrapper to configure 'localforage' and instantiate 'axios' with 'axios-cache-adapter'
const configure = async () => {
  // Register the custom 'memoryDriver' to 'localforage'
  await localforage.defineDriver(memoryDriver)

  // Create 'localforage' instance
  const store = localforage.createInstance({
    // List of drivers used
    driver: [
      localforage.INDEXEDDB,
      localforage.LOCALSTORAGE,
      memoryDriver._driver,
    ],
    // Prefix all storage keys to prevent conflicts
    name: 'my-cache',
  })

  // Create 'axios' instance with pre-configured 'axios-cache-adapter' using a 'localforage' store
  return setup({
    // 'axios' options
    ...(process.env.NODE_ENV === 'production' && {
      baseURL: process.env.GATSBY_PROXY_URL,
    }),
    // 'axios-cache-adapter' options
    cache: {
      maxAge: 12 * 60 * 60 * 1000,
      store, // Pass 'localforage' store to 'axios-cache-adapter'
      exclude: {
        query: false,
      },
    },
  })
}

export default configure
