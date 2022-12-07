/* eslint-disable @typescript-eslint/no-explicit-any */
import { Breadcrumb, Col, Empty, Image, Row } from "antd";
import { Divider } from "antd/es";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useCart } from "react-use-cart";
import axiosClient from "../../common-component/apis";
import Comment from "../../common-component/comment";
import Container from "../../common-component/container";
import { NumberUtils } from "../../shared/utils/number-utils";
import { CartTableQuantityColumn } from "../cart";
import { IBreadcrumb, ListProductClient } from "../product-by-category";
import {useState, useEffect} from "react"
import Head from "next/head";

export const ClientProductDetail = () => {
  const {query, asPath} = useRouter()
  const [product, setProduct] = useState<any>({});
  const id = query.featureNames?.[0]

  useEffect(() => {
    if (!id) {
      setProduct({})
      return;
    }
    const filter = {
      include: [
        {
          relation: 'category',
          scope: {
            include: [{relation: 'parent'}]
          }
        }
      ]
    }
    axiosClient.get(`/products/${id}?filter=${JSON.stringify(filter)}`)
      .then(response => setProduct(response?.data || []));
  }, [id])

  const domain = location.origin
  const {getItem} = useCart();
  const breadcrumbItems: IBreadcrumb[] = useMemo(() => {
    const ans: IBreadcrumb[] = [{label: 'TRANG CHỦ', href: "/"}]
    const category = product.category;
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
    if (product?.id) {
      ans.push({
        label: product.name.toUpperCase(),
        href: `product/${product.id}`
      })
    }
    return ans
  }, [product])
  if (!id || !product) return <Empty />;
  const productInCart = getItem(id);

  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href={product?.image} />
        <meta name="description" content={product?.description} />
        <title>{product?.name}</title>
      </Head>
      <Container type={'small'} className="py-5 flex gap-[30px]">
        <ListProductClient/>
        <div className="w-[calc(100%-315px)]">
          <Row gutter={{xs: 16, md: 24}}>
            <Col {...{xs: 24, md: 12}}>
              <Image {...{src: product?.image}} />
            </Col>
            <Col {...{xs: 24, md: 12}}>
              <Breadcrumb className="text-sm mb-3">
                {breadcrumbItems.map((item: IBreadcrumb) =>
                  <Breadcrumb.Item key={item.href}>
                    <Link href={item?.href || ""}>{item.label}</Link>
                  </Breadcrumb.Item>
                )}
              </Breadcrumb>
              <h2 className="text text-2xl">{product?.name}</h2>
              <Divider />
              <p className="text-xl strong">{`${NumberUtils.formatNumber(product?.price)} vnđ`}</p>
              <CartTableQuantityColumn item={productInCart} selectedProduct={product}  /> <br/>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${domain}${asPath}`}
                target="_blank"
                rel="noreferrer"
              >Share on Facebook</a>
            </Col>
            <div>
              <Divider />
              <h2 className={'font-bold text-base my-5'}>MÔ TẢ</h2>
              <p className="text-justify">{product.description}</p>
            </div>
          </Row>
          <div>
            <Divider />
            <h2 className={'font-bold text-base my-5'}>BÌNH LUẬN</h2>
            <Comment documentId={id} />
          </div>
        </div>
      </Container>
    </>
  )
}

export default ClientProductDetail;
