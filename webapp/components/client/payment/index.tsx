/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, InputNumber, notification, Radio, Select } from "antd";
import { FormInstance } from "antd/es";
import { FC, useMemo, useState } from "react";
import { useCart } from "react-use-cart";
import { orderStatus } from "../../../types";
import { useAuth } from "../../authentication/hooks";
import axiosClient from "../../common-component/apis";
import { notificationError, notificationSuccess } from "../../common-component/notification";
import { ValidationMessage } from "../../common-component/validation-message";
import { CForm } from "../../shared/common/c-form";
import { CartProductTable, Pay } from "../cart";
import { paymentMethodConfig } from "./constants";

interface PaymentProps {
	setVisiblePayment: (value: boolean) => void;
}

export const Payment: FC<PaymentProps> = ({setVisiblePayment}) => {
  const [formPayment] = Form.useForm();
  const {currentUser} = useAuth();
  const {items, emptyCart} = useCart();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(paymentMethodConfig.PAY_ONLINE.value);
  const totalPrice = useMemo(() => items.reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 0), 0), [items])

  const handleBuy = async () => {
    try {
      const valuesPayment = await formPayment?.validateFields();
      if (!address?.trim()) {
        notification.error({message: 'Thất bại', description: 'Vui lòng nhập địa chỉ nhận hàng'})
        return
      }
      if (!paymentMethod?.trim()) {
        notification.error({message: 'Thất bại', description: 'Vui lòng chọn phương thức thanh toán'})
        return
      }

      const isOnlinePayment = valuesPayment && paymentMethod === paymentMethodConfig.PAY_ONLINE.value
      if (isOnlinePayment) {
        axiosClient.post("/create_payment_url", valuesPayment).then(response => {
          const url = response.data;
          if (url) window.open(url)
        })
      }

      axiosClient.post("/orders", {
        products: items.map((item: any) => ({
          id: item.id,
          price: item.price,
          priceTotal: item.itemTotal,
          quantity: item.quantity,
        })),
        customerId: currentUser.id,
        status: orderStatus.PREPARING_ORDER,
        paymentMethod,
        totalPrice,
        address,
      }).then(() => {
        notificationSuccess("Dữ liệu đã được cập nhật")
        emptyCart()
        if (setVisiblePayment) setVisiblePayment(false)
      }).catch(error => {
        notificationError(error.response.data.error.message);
      });
    } catch(e) {
      notification.error({
        message: 'Thất bại',
        description: 'Kiểm tra lại thông tin ngân hàng'
      })
    }
  }

  return (
    <div>
      <CartProductTable />
      <br/><br/>

      <PaymentDetail {...{setPaymentMethod, paymentMethod, formPayment}}/>
      <br/><br/>

      <PaymentAddress {...{address, setAddress}}/>
      <br/><br/>

      <Pay/>
      <br/><br/>

      <div className="flex justify-center">
        <Button {...{
          className: "w-[226px]",
          type: "primary",
          size: "large",
          onClick: handleBuy
        }}>MUA NGAY</Button>
      </div>
    </div>
  )
}

export default Payment;

interface PaymentDetailProps {
  setPaymentMethod: (value: string) => void;
  paymentMethod: string;
  formPayment: FormInstance;
}

export const PaymentDetail: FC<PaymentDetailProps> = ({
  setPaymentMethod,
  paymentMethod,
  formPayment
}) => {
  return (
    <div>
      <p className="font-bold text-base border-b-2 border-gray-400 border-solid pb-2">PHƯƠNG THỨC THANH TOÁN</p>
      <p className="flex items-center justify-between mt-5 mb-2">
        <Radio.Group buttonStyle="solid" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
          <Radio.Button value={paymentMethodConfig.PAY_ONLINE.value}>{paymentMethodConfig.PAY_ONLINE.label}</Radio.Button>
          <Radio.Button value={paymentMethodConfig.PAYMENT_ON_DELIVERY.value}>{paymentMethodConfig.PAYMENT_ON_DELIVERY.label}</Radio.Button>
        </Radio.Group>
      </p>
      {paymentMethod === paymentMethodConfig.PAY_ONLINE.value && (
        <BankInformationForPayingOnline {...{formPayment}} />
      )}
      {paymentMethod === paymentMethodConfig.PAYMENT_ON_DELIVERY.value && (
        <p className="mt-4">Quý khách vui lòng thanh toán khi nhận được hàng</p>
      )}
    </div>
  )
}

export const BankInformationForPayingOnline = ({formPayment}: any) => {
  const {
    items,
  } = useCart();

  const totalPrice = useMemo(() => items.reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 0), 0), [items])

  return (
    <CForm {...{
      name: "basic",
      form: formPayment,
      layout: "vertical",
      hiddenControlButton: true,
      initialValues: {
        amount: totalPrice,
      },
      schema: [
        {
          Component: Select,
          name: 'bankCode',
          label: 'Ngân hàng',
          rules: [{ required: true, message: ValidationMessage.error('Ngân hàng') }],
          componentProps: {
            placeholder: "Ngân hàng",
            size: "large",
            options: [
              {value: 'VNPAYQR',label: "Ngân hàng VNPAYQR"},
              {value: 'NCB',label: "Ngân hàng NCB"},
              {value: 'SCB',label: "Ngân hàng SCB"},
              {value: 'SACOMBANK',label: "Ngân hàng SACOMBANK"},
              {value: 'EXIMBANK',label: "Ngân hàng EXIMBANK"},
              {value: 'MSBANK',label: "Ngân hàng MSBANK"},
              {value: 'NAMABANK',label: "Ngân hàng NAMABANK"},
              {value: 'VISA',label: "Ngân hàng VISA"},
              {value: 'VNMART',label: "Ngân hàng VNMART"},
              {value: 'VIETINBANK',label: "Ngân hàng VIETINBANK"},
              {value: 'VIETCOMBANK',label: "Ngân hàng VIETCOMBANK"},
              {value: 'HDBANK',label: "Ngân hàng HDBANK"},
              {value: 'DONGABANK',label: "Ngân hàng Dong A"},
              {value: 'TPBANK',label: "Ngân hàng Tp Bank"},
              {value: 'OJB',label: "Ngân hàng OceanBank"},
              {value: 'BIDV',label: "Ngân hàng BIDV"},
              {value: 'TECHCOMBANK',label: "Ngân hàng Techcombank"},
              {value: 'VPBANK',label: "Ngân hàng VPBank"},
              {value: 'AGRIBANK',label: "Ngân hàng AGRIBANK"},
              {value: 'MBBANK',label: "Ngân hàng MBBank"},
              {value: 'ACB',label: "Ngân hàng ACB"},
              {value: 'OCB',label: "Ngân hàng OCB"},
              {value: 'SHB',label: "Ngân hàng SHB"},
              {value: 'IVB',label: "Ngân hàng IVB"},
            ]
          }
        },
        {
          Component: InputNumber,
          name: 'amount',
          label: 'Số tiền (vnd)',
          rules: [{ required: true, message: ValidationMessage.error('Số tiền') }],
          componentProps: {
            placeholder: "Số tiền",
            size: "large",
            disabled: true,
          }
        },
        {
          Component: Input.TextArea,
          name: 'orderInfo',
          label: 'Nội dung thanh toán',
          colProps: {span: 24},
          rules: [{ required: true, message: ValidationMessage.error('Nội dung thanh toán') }],
          componentProps: {
            placeholder: "Nội dung thanh toán",
            rows: 2,
            size: "large"
          }
        },
      ]
    }} />
  )
}

export const ItemViewer = ({
  value = "",
  label = ""
}) => {
  return (
    <div className="mt-1">
      <strong>{label}:</strong>
      <span className="ml-4">{value}</span>
    </div>
  )
}

export const PaymentAddress = ({
  setAddress = (f: any) => f,
  address = ''
}) => {
  return (
    <div>
      <p className="font-bold text-base border-b-2 border-gray-400 border-solid pb-2 mb-3">ĐỊA CHỈ NHẬN HÀNG</p>
      <Input {...{
        value: address,
        onChange: e=>setAddress(e?.target?.value)
      }} />
    </div>
  )
}
