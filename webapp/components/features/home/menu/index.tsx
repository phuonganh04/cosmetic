import Container from "../../../common-component/container"
import { HomeMenuLeft } from "./home-menu-left"
import { HomeMenuRight } from "./home-menu-right"

export const HomeMenu = () => {
  return (
    <div className="shadow-lg shadow-teal-500/10 bg-slate-100">
      <Container className="flex items-center justify-between h-[100px] ">
        <HomeMenuLeft />
        <HomeMenuRight />
      </Container>
    </div>
  )
}
