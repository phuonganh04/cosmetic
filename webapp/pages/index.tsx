import Head from "next/head";
import { HomeAdv } from "../components/features/home/home-adv";
import { HomeBanner } from "../components/features/home/home-banner";
import { HomeBenefit } from "../components/features/home/home-benefit";
import { HomeHotCategory } from "../components/features/home/home-hot-category";
import { HomeProduct } from "../components/features/home/product/home-product";
import { ClientLayout } from "./layouts/client-layout";

const Home = () => {
  return (
    <ClientLayout>
      <Head>
        <link rel="icon" type="image/png" href="/assets/images/logo.png" />
        <meta name="description" content="Tiệm bí ngô" />
        <title>Tiệm bí ngô</title>
      </Head>
      <HomeBanner />
      <HomeBenefit />
      <HomeHotCategory />
      <HomeAdv />
      <HomeProduct />
    </ClientLayout>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default Home;
