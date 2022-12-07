import dynamic from "next/dynamic";
import { ClientLayout } from "../layouts/client-layout";

const ClientProduct = dynamic(
  () => import("../../components/client/product"),
  { ssr: false }
)

export const ClientProductPage = () => {
  return (
    <ClientLayout>
      <ClientProduct />
    </ClientLayout>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default ClientProductPage;
