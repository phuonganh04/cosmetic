import ContactBody from "../components/client/contact/contact-body";
import ContactHeader from "../components/client/contact/contact-header";
import Container from "../components/common-component/container";
import { ClientLayout } from "./layouts/client-layout";

const ContactPage = () => {
  return (
    <ClientLayout>
      <ContactHeader/>
      <Container className="my-5">
        <ContactBody/>
      </Container>
    </ClientLayout>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default ContactPage;
