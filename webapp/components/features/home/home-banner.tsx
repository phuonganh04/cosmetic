/* eslint-disable @typescript-eslint/no-explicit-any */
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Carousel } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import axiosClient from "../../common-component/apis";
import Container from "../../common-component/container";
import { STATUS_BANNER } from "../admin/banner/constans";
import styles from "./home-banner.module.scss";

export const HomeBanner = () => {
  const [banners, setBanners] = useState<any>([]);
    
  const filter = {
    where: {
      status: STATUS_BANNER.ACTIVE
    }
  }
  useEffect(() => {
    axiosClient.get(`/banners?filter=${JSON.stringify(filter)}`).then(response => setBanners(response?.data || []));
  }, [])
    
  return (
    <Carousel {...{
      dots: true,
      autoplay: true,
      arrows: true,
      nextArrow: <RightOutlined />,
      prevArrow: <LeftOutlined />,
      className: styles["home-banner"],
    }}>
      {banners.map((item: any, index: number) => (
        <div key={`client-banner-${index}`}>
          <div style={{
            background: `url(${item?.image}) no-repeat center center`,
            backgroundSize: 'cover',
            height: 575,
          }}>
            <Container className="translate-y-[80%]">
              <h1 className="text-[40px]">
                <div className="text-[#cb6916] text-left mt-3 ml-2 max-w-[30%]">{item?.description}</div>
              </h1>
              <Link href="/product">
                <Button {...{
                  type: 'ghost',
                  size: 'large',
                  className: "rounded-[20px] px-4 border-primary-color text-primary-color"
                }}>
                  MUA NGAY
                </Button>
              </Link>
            </Container>
          </div>
        </div>
      ))}
    </Carousel>
  )
}
