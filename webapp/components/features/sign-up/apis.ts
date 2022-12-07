/* eslint-disable @typescript-eslint/no-explicit-any */
import { notificationUtils } from './../../common-component/apis/notification';
import { endpoints } from '../../common-component/apis/utils';
import { ISignUpValues } from './index';

export const signUp = async (values: ISignUpValues, push: any) => {
  const res = await fetch(endpoints.endpointWithApiDomain('/signup'), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values)
  });

  if (res.status === 200) {
    notificationUtils.success('Đăng ký thành công!')
    push('/sign-in')
  } else if (res.status === 409) {
    notificationUtils.error('Đã có E-mail này trong hệ thống!')
  } else {
    notificationUtils.error(res.statusText)
  }
}
