/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel } from 'antd';
import classNames from 'classnames';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import axiosClient from '../../../common-component/apis';
import Container from '../../../common-component/container';
import { NumberUtils } from '../../../shared/utils/number-utils';
import styles from "./home-product.module.scss";

export const HomeProduct = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    axiosClient.get(`/products/public`).then(response => setProducts(response?.data || []));
  }, [])

  return (
    <Container className={classNames(styles['home-product'], 'mb-[50px]')}>
      <h2 className='text-center text-3xl block mb-5 text-primary-color'>SẢN PHẨM NỔI BẬT</h2>
      <Carousel {...{
        dots: true,
        autoplay: true,
        arrows: true,
        nextArrow: <RightOutlined />,
        prevArrow: <LeftOutlined />,
        className: styles["home-banner"],
        slidesToShow: 4,
        slidesToScroll: 1
      }}>
        {products.map((product) => (
          <HomeProductCard key={product.id} {...{ ...product }} />
        ))}
      </Carousel>

      <div className="float-right">
        <Link href="/product">
          <span className='cursor-pointer font-bold text-base text-primary-color'>Xem tất cả</span>
        </Link>
      </div>
    </Container >
  )
}

interface HomeProductCardProps {
    image: string;
    price: string|number;
    name: string;
    id: string;
    className: string;
}

export const HomeProductCard: FC<HomeProductCardProps> = ({
  image,
  price,
  name,
  id,
  className
}) => {
  const { addItem, getItem, updateItemQuantity } = useCart();

  const handleAddToCart = () => {
    const itemInCart = getItem(id);
    if (itemInCart) {
      updateItemQuantity(id, itemInCart.quantity + 1);
    } else {
      addItem({ price: +price, name, id, image  }, 1)
    }
  }

  return (
    <div className={classNames("border-[5px] border-[#f1f1f1] m-3 bg-white", className)}>
      <div className={classNames("h-auto min-h-[276px]")}>
        <img className='w-[100%] object-cover' src={image || "/assets/images/demo-product.png"} />
      </div>
      <div className='text-center'>
        <h4>
          <span className='text-primary-color text-[16px]'>
            <Link href={`/product/${id}`}>
              <div className='two-line'>
                {name}
              </div>
            </Link>
          </span>
        </h4>
        <p className='text-[#000] font-bold'>{NumberUtils.formatNumber(price)} đ</p>
      </div>
      <div className='my-[20px] flex justify-center text-[12px]'>
        <button onClick={handleAddToCart} className='font-semibold text-white px-[15px] py-[5px] bg-primary-color transition-all hover:bg-[#aa5811]'>THÊM VÀO GIỎ</button>
      </div>
    </div>
  )
}
