import dynamic from "next/dynamic";
import Head from "next/head";
import { ClientLayout } from "../layouts/client-layout";

const ProductByCategory = dynamic(
  () => import('../../components/client/product-by-category'), 
  { ssr: false }
)

const ProductByCategoryPage = () => (
  <>
    <Head>
      <link rel="icon" type="image/png" href="/assets/images/logo.png" />
      <meta name="description" content="Tiệm bí ngô" />
      <title>Danh mục sản phẩm</title>
    </Head>
      
    <ClientLayout>
      <ProductByCategory/>
    </ClientLayout>
  </>
)

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default ProductByCategoryPage;
