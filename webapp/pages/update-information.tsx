import dynamic from "next/dynamic";
import Container from "../components/common-component/container";
import { ClientLayout } from "./layouts/client-layout";

const UpdateUserInformation = dynamic(
  () => import("../components/client/update-user-information"),
  { ssr: false }
)

export const UpdateUserInformationPage = () => {
  return (
    <ClientLayout>
      <Container>
        <UpdateUserInformation />
      </Container>
    </ClientLayout>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default UpdateUserInformationPage;
