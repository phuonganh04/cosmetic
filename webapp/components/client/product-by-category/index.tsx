/* eslint-disable @typescript-eslint/no-explicit-any */
import { Breadcrumb, Select, Slider } from "antd";
import { debounce } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../common-component/apis";
import Container from "../../common-component/container";
import { HomeProductCard } from "../../features/home/product/home-product";
import { NumberUtils } from "../../shared/utils/number-utils";

const {Item} = Breadcrumb

export interface IBreadcrumb {
  label: string,
  href?: string,
}

const ProductByCategory = () => {
  const {query} = useRouter()
  const categoryId = query?.featureNames?.[0]
  const [products, setProducts] = useState<any[]>([])
  const [category, setCategory] = useState<any>({})
  const [filterProduct, setFilterProduct] = useState<object>({})
  const [priceRange, setPriceRange] = useState<number[]>([])

  useEffect(() => {
    axiosClient.get(`/categories/${categoryId}/public?filter=${JSON.stringify({include: ['parent']})}`)
      .then(response => {
        setCategory(response?.data || [])
      })
  }, [categoryId])

  useEffect(() => {
    const filter: any = {
      where: {
        categoryId,
      },
      ...filterProduct,
    }
    
    if (priceRange.length) {
      filter.where.price = {between: priceRange}
    }

    axiosClient.get(`/products/public?filter=${JSON.stringify(filter)}`)
      .then(response => {
        setProducts(response?.data || [])
      })
  }, [filterProduct, categoryId, priceRange])

  const breadcrumbItems: IBreadcrumb[] = useMemo(() => {
    const ans: IBreadcrumb[] = [{label: 'TRANG CHỦ', href: "/"}]
    const parent = category?.parent;
    if (parent?.id) {
      ans.push({
        label: parent?.name?.toUpperCase(),
        href: `/category/${parent?.id}`
      })
    }
    if (category?.id) {
      ans.push({
        label: category?.name?.toUpperCase(),
        href: `/category/${category?.id}`
      })
    }
    return ans
  }, [category])
  const formatter = (value: number | undefined) => `${NumberUtils.formatNumber(value)} vnđ`

  return (
    <Container className="py-[30px]">
      <div className="flex justify-between items-center">
        <Breadcrumb className="text-lg mb-5">
          {breadcrumbItems.map((item: IBreadcrumb) => {
            return (
              <Item key={item.href}>
                <Link href={item?.href || ""}>{item.label}</Link>
              </Item>
            )
          })}
        </Breadcrumb>

        <div className="flex">
          <div className="flex items-center">
            Lọc theo giá:
            <Slider {...{
              range: true,
              defaultValue: [0, 1000000],
              className: "w-[160px] mr-10 ml-5",
              min: 0,
              max: 1000000,
              tooltip: { formatter },
              onChange: debounce((values: number[]) => {
                setPriceRange(values);
              }, 2000)
            }}/>
          </div>
          <Select {...{
            options: optionsSortProduct,
            defaultValue: 'default',
            onSelect: (value: string) => {
              const optionSortProduct = optionsSortProduct.find((item: IOptionSortProduct) => item.value === value)
              if (!optionSortProduct) return;
              setFilterProduct(optionSortProduct.filter)
            },
            className: "w-[160px]"
          }}/>
        </div>
      </div>

      <div className="flex justify-between">
        <ListProductClient/>
        <div className="w-[calc(100%-300px)] grid grid-cols-3 gap-5">
          {products.map((product: any) => (
            <HomeProductCard key={product.id} {...{ ...product }} />
          ))}
        </div>
      </div>
    </Container>
  )
}

export default ProductByCategory;

interface IOptionSortProduct {
  filter: object,
  label: string,
  value: string,
}

export const optionsSortProduct: IOptionSortProduct[] = [
  {filter: {}, label: 'Thứ tự mặc định', value: 'default'},
  {filter: {order: ["price DESC"]}, label: 'Giá từ cao -> thấp', value: 'priceDecrease'},
  {filter: {order: ["price ASC"]}, label: 'Giá từ thấp -> cao', value: 'priceIncrease'},
  {filter: {order: ["createdAt DESC"]}, label: 'Mới nhất', value: 'newest'},
]

export const ListProductClient = () => {
  const [randomProducts, setRandomProducts] = useState<any[]>([]);
  useEffect(() => {
    const filter = {
      order: ["createdAt DESC"]
    }
    axiosClient.get(`/products/public?filter=${JSON.stringify(filter)}`).then(response => {
      const data = response?.data || []
      if (data.length > 5) {
        setRandomProducts(data.slice(0, 5))
        return
      }

      setRandomProducts(data)
    })
  }, [])
  return (
    <div className="w-[275px]">
      <h2 className="text-[18px]">SẢN PHẨM</h2>
      <div className="border rounded bg-gray-200 p-5">
        {randomProducts.map((randomProduct: any, i: number) => {
          return <ProductClientItem key={`product-client-${i}`} randomProduct={randomProduct} />
        })}
      </div>
    </div>
  )
}

export const ProductClientItem = ({randomProduct}: any) => {
  const {name, price, image} = randomProduct
  return (
    <div className="py-2 border-b-2 border-dotted border-gray-300">
      <div className="flex item-center justify-between gap-1 text-base">
        <img className="max-w-[30%] object-cover max-h-[69px]" src={image || "/assets/images/demo-product.png"} alt="image product" />
        <div className="w-[60%] text-gray-600">
          <Link href={`/product/${randomProduct.id}`}>
            <div className="two-line">
              {name}
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <strong>{NumberUtils.formatNumber(price)}đ</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
