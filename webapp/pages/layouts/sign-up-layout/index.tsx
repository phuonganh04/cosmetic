import { Layout } from "antd";
import { Header } from "antd/lib/layout/layout";
import {ReactNode, FC} from "react"
import Container from "../../../components/common-component/container";
import HomeFooter from "../../../components/features/home/home-footer";
import styles from "./sign-up-layout.module.scss";

interface LayoutSignUpProps {
  children: ReactNode;
}

const LayoutSignUp: FC<LayoutSignUpProps> = ({children}) => {
  return (
    <Layout className={styles["sign-up-layout"]}>
      <Header className={styles["sign-up-layout__header"]}>
        <h2>Đăng ký</h2>
      </Header>
      <Layout className={styles["sign-up-layout__content"]}>
        <Container>
          <div className={styles["sign-up-layout__content__main"]}>
            {children}
          </div>
          <HomeFooter/>
        </Container>
      </Layout>
    </Layout>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default LayoutSignUp;
