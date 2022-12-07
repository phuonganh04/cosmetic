/* eslint-disable @typescript-eslint/no-explicit-any */
import Container from "../../common-component/container";

export const HomeBenefit = () => {
  const benefits: any[] = [
    { iconUrl: "/assets/svgs/svgexport-3.svg", title: "MIỄN PHÍ VẬN CHUYỂN", description: "Miễn phí trên toàn thế giới" },
    { iconUrl: "/assets/svgs/svgexport-4.svg", title: "BẢO ĐẢM TÀI CHÍNH", description: "Tiền về trong 30 ngày" },
    { iconUrl: "/assets/svgs/svgexport-5.svg", title: "HỖ TRỢ TRỰC TUYẾN", description: "Online 24/24" },
    { iconUrl: "/assets/svgs/svgexport-6.svg", title: "THANH TOÁN AN TOÀN", description: "Đảm bảo 100%" },
  ];

  return (
    <Container className="py-[80px]">
      <div className="flex justify-between items-center">
        {benefits.map((config: any) => <HomeBenefitItem key={config.iconUrl} {...{ ...config }} />)}
      </div>
    </Container>
  )
}

const HomeBenefitItem = ({
  iconUrl,
  title,
  description,
}: any) => {
  return (
    <div className="flex justify-between items-center">
      <div className="w-[70px] h-[70px] rounded-[50%] border-[#cb6916] border p-3">
        <img src={iconUrl} />
      </div>
      <div className="flex flex-col py-[12px] px-[15px]">
        <h6>{title}</h6>
        <p>{description}</p>
      </div>
    </div>
  )
}
