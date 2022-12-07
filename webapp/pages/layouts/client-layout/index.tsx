import { ReactNode } from "react"
import HomeFooter from "../../../components/features/home/home-footer"
import { HomeHeader } from "../../../components/features/home/home-header"
import { HomeMenu } from "../../../components/features/home/menu"

export const ClientLayout = ({ children }: {children: ReactNode}) => {
  return (
    <>
      <div className="sticky top-0 z-10">
        <HomeHeader />
        <HomeMenu />
      </div>
      {children}
      <HomeFooter/>
    </>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default ClientLayout
