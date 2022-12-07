/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Input, Modal, Row, Table } from "antd";
import { useCart } from "react-use-cart";
import { ClientLayout } from "../../../pages/layouts/client-layout";
import Container from "../../common-component/container";
import { NumberUtils } from "../../shared/utils/number-utils";
import Link from "next/link";
import { FC, useState } from "react";
import Payment from "../payment";

export const Cart = () => {
  const [visiblePayment, setVisiblePayment] = useState<boolean>(false);

  return (
    <ClientLayout>
      <Container className="my-5">
        <Row gutter={[20, 20]}>
          <Col span={16}>
            <CartProductTable />
          </Col>

          <Col span={8}>
            <Pay {...{setVisiblePayment}} />
          </Col>
        </Row>
      </Container>
      <Modal {...{
        visible: visiblePayment,
        onCancel: () => setVisiblePayment(false),
        title: 'Tiến hành thanh toán',
        footer: null,
        width: '60%',
      }}>
        <Payment {...{setVisiblePayment}}/>
      </Modal>
    </ClientLayout>
  )
}

export default Cart;

export const CartProductTable = () => {
  const { items } = useCart();

  const columns = [
    {
      title: 'SẢN PHẨM',
      key: 'product',
      render: (cartItem: any) => <CartTableProductColumn {...{ ...cartItem }} />
    },
    {
      title: 'GIÁ',
      key: 'price',
      dataIndex: "price",
      render: (price: any) => <strong>{`${NumberUtils.formatNumber(price)} đ`}</strong>
    },
    {
      title: 'SỐ LƯỢNG',
      key: 'quantity',
      render: (cartItem: any) => <CartTableQuantityColumn item={cartItem} />
    },
    {
      title: 'TỔNG CỘNG',
      render: (cartItem: any) => <strong>{`${NumberUtils.formatNumber(cartItem.price * cartItem.quantity)} đ`}</strong>
    },
  ];

  return (
    <Table {...{
      dataSource: items,
      columns,
      pagination: false,
    }} />
  )
}

const CartTableProductColumn = ({
  name,
  quantity,
  price,
  id,
  image
}: any) => {
  const { removeItem } = useCart();
  return (
    <div className="flex item-center gap-5 text-base">
      <CloseCircleOutlined {...{
        className: "cursor-pointer w-[20px] flex items-center",
        style: { fontSize: 20 },
        onClick: () => removeItem(id),
      }} />

      <img className="w-auto max-h-[50px]" src={image || "/assets/images/demo-product.png"} alt="image product" />

      <div className="text-gray-600">
        <Link href={`/product/${id}`}>{name}</Link>
        <div className="flex items-center gap-1">
          {`${quantity} x`}
          <strong>{NumberUtils.formatNumber(price)}đ</strong>
        </div>
      </div>
    </div>
  )
}

export const CartTableQuantityColumn = ({ item, selectedProduct = undefined }: any) => {
  const { updateItemQuantity, addItem } = useCart();
  return (
    <div>
      <Input {...{
        disabled: true,
        addonBefore: (
          <div className="cursor-pointer w-full" onClick={() => {
            if ((item?.quantity || 0) < 1) return;
            updateItemQuantity(item.id, item.quantity - 1)
          }}>
            -
          </div>
        ),
        addonAfter: (
          <div className="cursor-pointer" onClick={() => {
            if (item) {
              updateItemQuantity(item.id, item.quantity + 1)
            } else {
              if (!selectedProduct) return;
              addItem({price: +selectedProduct.price, name: selectedProduct.name, id: selectedProduct.id, image: selectedProduct?.image}, 1)
            }
          }}>
            +
          </div>
        ),
        value: item?.quantity || 0,
        className: "w-[100px]"
      }} />
    </div>
  )
}

interface PayProps {
    setVisiblePayment?: (value: any) => void
}

export const Pay: FC<PayProps> = ({setVisiblePayment}) => {
  const { items } = useCart();
  const totalPrice = items.reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 0), 0)

  return (
    <div className="text-base">
      <p className="font-bold text-base border-b-2 border-gray-400 border-solid pb-2">TỔNG SỐ LƯỢNG</p>

      <p className="flex items-center justify-between mt-5 mb-2">
        <span>Tổng cộng</span>
        <strong>{`${NumberUtils.formatNumber(totalPrice)} đ`}</strong>
      </p>

      <div className="my-1 border-b-2 border-solid border-gray-200" />

      <p className="flex items-center justify-between mt-5 mb-2">
        <span>Shipping</span>
        <strong>Giao hàng miễn phí</strong>
      </p>

      <div className="my-1 border-b-2 border-solid border-gray-200" />

      {setVisiblePayment && items?.length && 
				<Button {...{
				  type: "primary",
				  size: "large",
				  className: "w-full mt-5",
				  danger: true,
				  onClick: () => setVisiblePayment(true),
				}}>Tiến hành thanh toán</Button>
      }
    </div>
  )
}
