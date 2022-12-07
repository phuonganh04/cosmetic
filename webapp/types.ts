export const orderStatus = {
  PREPARING_ORDER: "preparingOrder", 
  DELIVERING: "delivering",
  SUCCESSFULLY: "successfully",
  FAILURE: "failure",
}

export const mappingOrderStatus = {
  [orderStatus.PREPARING_ORDER]: "Đang chuẩn bị đơn hàng",
  [orderStatus.DELIVERING]: "Đang giao hàng",
  [orderStatus.SUCCESSFULLY]: "Thành công",
  [orderStatus.FAILURE]: "Thất bại",
}

export const mappingStepOfOrderStatus = {
  [orderStatus.PREPARING_ORDER]: 0,
  [orderStatus.DELIVERING]: 1,
  [orderStatus.SUCCESSFULLY]: 2,
  [orderStatus.FAILURE]: -1,
}

export const getStatusByStepOfOrderStatus = (step: number) => {
  const labels = Object.keys(mappingOrderStatus);
  let status = "";
  for(const label of labels) {
    if (mappingStepOfOrderStatus[label] === step) {
      status = label;
      break;
    }
  }
  return status;
}
export const paymentMethod = {
  PAY_ONLINE: "payOnline",
  PAYMENT_ON_DELIVERY: "paymentOnDelivery",
}

export const mappingPaymentMethod = {
  [paymentMethod.PAYMENT_ON_DELIVERY]: "Thanh toán sau khi nhận được hàng",
  [paymentMethod.PAY_ONLINE]: "Thanh toán online",
}
