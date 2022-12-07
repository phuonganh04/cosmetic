/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient, { StorageKeys } from './../../common-component/apis/index';
import { notificationUtils } from './../../common-component/apis/notification';
import { ISignInForm } from "."
import { endpoints } from "../../common-component/apis/utils"

export const signIn = async (values: ISignInForm, cb: any, authContext: any) => {
  const response = await fetch(endpoints.endpointWithApiDomain('/login'), {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(values),
  })
  const json = await response.json();
  if (response.status === 200) {
    notificationUtils.success('')
    localStorage.setItem(StorageKeys.ACCESS_TOKEN, json.accessToken)
    localStorage.setItem(StorageKeys.REFRESH_TOKEN, json.refreshToken)
    localStorage.setItem(StorageKeys.EXPIRES_IN, json.refreshToken)
    axiosClient.get('/me').then(response => authContext.setCurrentUser(response?.data));
    cb()
  } else if (response.status === 401) {
    notificationUtils.error('E-mail/mật khẩu không chính xác!')
  } else {
    notificationUtils.error(response.statusText)
  }
}
