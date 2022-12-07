import { StorageKeys } from "../apis"

export const localStorageUtils = {
  getAccessToken: () => {
    return window.localStorage.getItem(StorageKeys.ACCESS_TOKEN,)
  },
  setAccessToken: (token: string) => {
    window.localStorage.setItem(StorageKeys.ACCESS_TOKEN, token)
  }
    
}
