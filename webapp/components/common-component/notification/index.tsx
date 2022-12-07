import { notification } from "antd"

export const notificationSuccess = (message: string) => notification.success({ message: "Thành công", description: message })
export const notificationError = (message: string) => notification.error({ message: "Thất bại", description: message })
