import { notification } from "antd"

export const notificationUtils = {
  success: (content: string) => {
    return notification.success({
      message: 'Thành công',
      description: content
    })
  },
  error: (content: string) => {
    return notification.error({
      message: 'Thất bại',
      description: content
    })
  }
}
