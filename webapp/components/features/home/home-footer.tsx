/* eslint-disable @typescript-eslint/no-explicit-any */
import { Divider } from "antd";
import Link from "next/link";
import { FC, ReactNode, useEffect, useState } from "react";
import axiosClient from "../../common-component/apis";
import Container from "../../common-component/container";

export const HomeFooter = () => {
  const [category, setCategory] = useState<any[]>([])

  useEffect(() => {
    axiosClient.get(`/categories/public?filter=${JSON.stringify({order: ["created DESC"]})}`)
      .then(response => {
        const data = response?.data || []
        if (data.length > 3) {
          setCategory(data.slice(0, 3))
          return;
        }
        
        setCategory(data)
      })
  }, [])

  const listFooterItem: FooterItemProps[] = [
    {
      title: 'THÔNG TIN LIÊN HỆ',
      items: [
        {title: "Địa chỉ", content: "319 C16 Lý Thường Kiệt, Phường 15, Quận 11, Tp.HCM"},
        {title: "SDT", content: "012345678"},
        {title: "Email", content: "demo@gmail.com"}
      ]
    },
    {
      title: "MẠNG XÃ HỘI",
      items: [
        {content: <a href="https://www.facebook.com/profile.php?id=100087804482675" target={'_blank'} rel="noreferrer">Facebook</a>}
      ]
    },
    {
      title: 'ĐIỀU HƯỚNG',
      items: [
        {content: <Link href="/">Trang chủ</Link>},
        {content: <Link href="/contact">Liên hệ</Link>},
        {content: <Link href="/cart">Giỏ hàng</Link>}
      ]
    },
    {
      title: "SẢN PHẨM",
      items: category.map(category => ({content: <Link href={`/category/${category.id}`}>{category?.name}</Link>}))
    }
  ]

  return (
    <Container className="py-4 text-gray-500 mt-20">
      <div className="flex gap-10 justify-between">
        {listFooterItem.map((item: FooterItemProps, i: number) => {
          return <FooterItem key={`footer-item-${i}`} {...item} />
        })}
      </div>
      <Divider/>
      <div>© Bản quyền thuộc về . Thiết kế website Trần Phương Anh</div>
    </Container>
  )
}

export default HomeFooter;

interface FooterItemProps {
  title: string | ReactNode,
  items: FooterItemPropsItem[],
}

interface FooterItemPropsItem {
  title?: string | ReactNode, 
  content?: string | ReactNode
}

const FooterItem: FC<FooterItemProps> = ({
  title,
  items
}) => {
  return (
    <div>
      <div className="font-semibold text-black text-base mb-3">{title}</div>
      <ul>
        {
          items.map((item: FooterItemPropsItem, i: number) => {
            return (
              <li key={`item-footer-${i}`} className="flex mb-2">
                {item?.title && <div className="w-[60px] font-bold">{item.title}:</div>}
                <div>{item.content}</div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}
