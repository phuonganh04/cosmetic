/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "antd"
import classNames from "classnames";
import Link from "next/link";
import Container from "../../common-component/container"
import styles from "./home-hot-category.module.scss";

export const HomeHotCategory = () => {
  const hotCategories: any[] = [
    {title: "Chăm sóc da", description: "Chăm sóc da mặt đúng cách sẽ giúp chị em sở hữu làn da khỏe mạnh, tươi sáng và chống lão hóa.", image: "https://product.hstatic.net/1000361746/product/e-by-mi-aha-bha-pha-30-days-miracle-acne-clear-body-cleanser-1-700x700_c5434f1d6d3f48f1a6906e275ab4a241_1024x1024.jpg"},
    {title: "Trang điểm", description: "Để trở nên xinh đẹp và lộng lẫy hơn, những món đồ trang điểm là “bảo bối” không thể thiếu của các nàng.", image: "https://cdn.shopify.com/s/files/1/0341/3498/2789/products/C034900947sq_360x.jpg?v=1663153743"},
    {title: "Thực phẩm chức năng", description: "Thực phẩm chức năng giúp dưỡng sáng da mịn màng, cải thiện vóc sáng, ngăn lão hóa sớm.", image: "https://product.hstatic.net/200000286351/product/1-hop-white_44113f38965f42eab494b0eedcc1c230_master.jpg"},
  ]
  return (
    <Container className={classNames("flex flex-col items-center text-center mb-[50px]", styles["home-hot-category"])}>
      <div className="w-[calc(100%/3*2)] py-[30px] px-[15px] pt-[0]">
        <h3 className="mb-[30px]">
          <span className="text-primary-color text-[40px]">Danh mục HOT trong ngày</span>
        </h3>
        <p className="text-[17px]">Với phương châm ”Chất lượng thật - Giá trị thật”, Tiệm bí ngô luôn nỗ lực không ngừng nhằm nâng cao chất lượng sản phẩm & dịch vụ để khách hàng có được những trải nghiệm mua sắm tốt nhất.</p>
      </div>
      <div className="flex justify-between w-full">
        {hotCategories.map((config: any) => <HotCategoryItem key={config.image} {...{...config}} />)}
      </div>
    </Container>
  )
}

const HotCategoryItem = ({
  title,
  description,
  image
}: {title: string, description: string, image: string}) => {
  return (
    <div>
      <div className="flex justify-center">
        <div className={"border-4 border-primary-color w-[327px] h-[327px] rounded-[50%] p-[1px] overflow-hidden "}>
          <img src={image} />
        </div>
      </div>
      <div className="text-center p-[10px]">
        <div className={'text-center'}>
          <h3 className={"text-primary-color my-[30px]"}><span className="text-[24px]">{title}</span></h3>
          <p>{description}</p>
        </div>
        <Link href="/product">
          <Button className="rounded-[20px] border-2 border-primary-color font-semibold color-primary-color mt-[16px]">MUA NGAY</Button>
        </Link>
      </div>
    </div>
  )
}
