/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { CloseCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Badge, Button, Popover } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";
import { useCart } from "react-use-cart";
import { NumberUtils } from "../../shared/utils/number-utils";

export const MenuCart = () => {
  const {
    totalUniqueItems,
    items,
  } = useCart();
  const { asPath } = useRouter();

  const totalPrice = useMemo(() => items.reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 0), 0), [items])

  if (asPath.split("/").includes("cart")) {
    return (
      <div className="flex items-center justify-center gap-1 min-w-fit font-bold text-[16px] cursor-pointer">
        <span>GIỎ HÀNG</span>
        <span>/</span>
        <span>{NumberUtils.formatNumber(totalPrice)} VND</span>
        <Badge {...{
          count: totalUniqueItems,
          size: "small"
        }} >
          <ShoppingCartOutlined style={{ fontSize: 20 }} />
        </Badge>
      </div>
    )
  }

  return (
    <Popover {...{
      content: <MenuCardBody {...{ totalPrice }} />,
      className: 'min-w-fit font-bold text-[16px]',
      placement: 'bottomLeft'
    }}>
      <div className="flex items-center justify-center gap-1 min-w-fit font-bold text-[16px] cursor-pointer">
        <span>GIỎ HÀNG</span>
        <span>/</span>
        <span>{NumberUtils.formatNumber(totalPrice)} VND</span>
        <Badge {...{
          count: totalUniqueItems,
          size: "small"
        }} >
          <ShoppingCartOutlined style={{ fontSize: 20 }} />
        </Badge>
      </div>
    </Popover>
  )
}

export default MenuCart;

const MenuCardBody = ({ totalPrice }: any) => {
  const { items } = useCart();
  return (
    <div className="w-[300px]">
      <div className="grid grid-cols-1 ">
        {items.map((product: any) => (
          <>
            <MenuCardItem key={product.id} {...{ ...product }} />
            <div className="my-2 border-b border-solid border-gray-100" />
          </>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-base">
        TỔNG CỘNG:
        <strong>{NumberUtils.formatNumber(totalPrice)} đ</strong>
      </div>

      <div className="my-3 border-b-2 border-solid border-gray-200" />

      <div className="flex gap-2 flex-col items-center">
        <Link href="/cart">
          <Button {...{
            ghost: true,
            type: "primary",
            className: "w-full font-bold",
            size: 'large'
          }}>XEM GIỎ HÀNG</Button>
        </Link>

        <Link href="/cart">
          <Button {...{
            danger: true,
            type: "primary",
            className: "w-full font-bold",
            size: 'large'
          }}>THANH TOÁN</Button>
        </Link>
      </div>
    </div>
  )
}

interface MenuCartItemProps {
    name: string;
    price: number;
    quantity: number;
    id: string;
    image: string;
}

export const MenuCardItem: FC<MenuCartItemProps> = ({
  name,
  price,
  quantity,
  image,
  id
}) => {
  const { removeItem } = useCart();

  return (
    <div className="flex item-center justify-between gap-1 text-base">
      <img className="max-w-[30%]" src={image || "/assets/images/demo-product.png"} alt="image product" />
      <div className="w-[50%] text-gray-600">
        <p>{name}</p>
        <div className="flex items-center gap-1">
          {`${quantity} x`}
          <strong>{NumberUtils.formatNumber(price)}đ</strong>
        </div>
      </div>
      <CloseCircleOutlined {...{
        className: "cursor-pointer w-[10%]",
        style: { fontSize: 20 },
        onClick: () => removeItem(id),
      }} />
    </div>
  )
}
