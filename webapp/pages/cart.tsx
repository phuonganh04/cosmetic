import dynamic from "next/dynamic";
import Head from "next/head";

const CartManagement = dynamic(
  () => import("../components/client/cart"), 
  { ssr: false }
)

const Cart = () => {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/assets/images/logo.png" />
        <meta name="description" content="Tiệm bí ngô" />
        <title>Giỏ hàng</title>
      </Head>
      <CartManagement />
    </>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Cart;
