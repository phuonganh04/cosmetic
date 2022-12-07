import dynamic from "next/dynamic";
import { ClientLayout } from "../layouts/client-layout";

const ClientProductDetail = dynamic(
  () => import("../../components/client/product/client-product-detail"),
  { ssr: false }
)

export const ClientProductPage = () => {
  return (
    <ClientLayout>
      <ClientProductDetail />
    </ClientLayout>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default ClientProductPage;
