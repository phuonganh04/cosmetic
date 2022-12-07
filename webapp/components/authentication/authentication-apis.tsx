/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react"
import axiosClient from "../common-component/apis";

export const useFetchUserByAccessToken = (setUser: any) => {
  useEffect(() => {
    axiosClient.get('/me').then(response => setUser(response?.data))
  }, [])
}
