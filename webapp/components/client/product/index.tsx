/* eslint-disable @typescript-eslint/no-explicit-any */
import { Breadcrumb } from "antd";
import Link from "next/link";
import { useFetchCategories } from "../../../api/category";
import { useFetchProduct } from "../../../api/product";
import Container from "../../common-component/container";
import { HomeProductCard } from "../../features/home/product/home-product";

const { Item } = Breadcrumb;

export const ClientProduct = () => {
  return (
    <Container className="py-5">
      <ClientProductHeader />
      <ClientProductBody />
    </Container>
  )
}

export default ClientProduct;

const ClientProductHeader = () => {
  return (
    <div className="my-3 bg-white flex items-center justify-between">
      <Breadcrumb className="font-lg uppercase font-bold">
        <Item>
          <Link href="/">Trang chủ</Link>
        </Item>
        <Item>
          <Link href="/product">Danh sách sản phẩm</Link>
        </Item>
      </Breadcrumb>
    </div>
  )
}

const ClientProductBody = () => {
  const categories = useFetchCategories();
  const products = useFetchProduct();

  return (
    <div>
      {categories.map((category: any) => {
        let productsByCategoryId = products.filter((item: any) => item.categoryId === category.id)
        if (productsByCategoryId.length > 4) {
          productsByCategoryId = productsByCategoryId.splice(0, 4)
        }

        return <ClientProductByItem
          key={category.id}
          {...{
            category,
            products: productsByCategoryId
          }}
        />
      })}
    </div>
  )
}

const ClientProductByItem = ({ category, products }: any) => {
  const totalProduct = products?.length;
  if (!totalProduct) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link href={"/"}>
          <h3 className=" text-base uppercase font-bold cursor-pointer">--- {category.name} ---</h3>
        </Link>

        <Link href={`/category/${category.id}`}>
          <span className="cursor-pointer hover:opacity-70 font-bold">Xem tất cả</span>
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {products.map((product: any) => <HomeProductCard key={product.id} {...{ ...product }} />)}
      </div>
    </div>
  )
}
