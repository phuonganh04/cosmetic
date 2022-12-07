/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import classNames from "classnames";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useFetchCategories } from "../../../../api/category";
import styles from "./home-menu.module.scss";

const { Item, SubMenu } = Menu;

const MenuCart = dynamic(() => import("../../../client/home/menu-cart"), { ssr: false })

export const HomeMenuRight = () => {
  const categories = useFetchCategories();
  const categoriesMain = categories.filter((category: any) => !category.parentId);

  const renderMenuFromCategories = (categoriesMain: any) => {
    return categoriesMain?.map((category: any) => {
      const { childrenIds } = category;

      if (childrenIds?.length) {
        return (
          <SubMenu 
            key={category.id} 
            title={(
              <div className="flex justify-center items-center font-extrabold">
                {category.name.toUpperCase()}
                <DownOutlined className="ml-1" style={{fontSize: 10,}} />
              </div>
            )}
          >
            {categories.filter((item: any) => childrenIds?.includes(item.id)).map((item: any) =>
              <Item key={item.id}>
                <Link href={`/category/${item.id}`}>
                  {item.name}
                </Link>
              </Item>
            )}
          </SubMenu>
        )
      }

      return <Item key={category.id}>
        <Link href={`/category/${category.id}`}>{category.name.toUpperCase()}</Link>
      </Item>
    })
  }

  return (
    <div className="w-[calc(100%-200px)] flex items-center justify-between bg-slate-100">
      <Menu
        mode="horizontal"
        defaultSelectedKeys={['home']}
        className={classNames(styles["home-menu__right"], "w-full home-menu font-semibold border-b-0 text-base bg-slate-100")}
      >
        <Menu.Item key="home">
          <Link href="/">TRANG CHỦ</Link>
        </Menu.Item>
        {renderMenuFromCategories(categoriesMain)}
        <Menu.Item key="contact">
          <Link href="/contact">LIÊN HỆ</Link>
        </Menu.Item>
      </Menu >

      <MenuCart />
    </div>
  )
}
