/* eslint-disable @typescript-eslint/no-explicit-any */
import Menu from "antd/es/menu";
import { useRouter } from "next/router";
import { FC, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IMenuAdminItem, menusAdmin } from "..";
import { AuthContext } from "../../authentication/context";
import axiosClient from "../../common-component/apis";

interface User {
  roles?: Role[]
}

interface Role {
  code?: string;
  id?: string;
}

export const AdminLeftMenu: FC = () => {
  const {query, push} = useRouter()
  const featureName = query?.featureNames?.[0]
  const currentUser = useContext(AuthContext).currentUser
  const [me, setMe] = useState<User>()
  console.log(me)
  useEffect(() => {
    if (!featureName) {
      push("admin/user")
    }
  }, [])

  useEffect(() => {
    if (!currentUser?.id) {
      setMe(undefined)
      return
    }

    axiosClient.get('/me-with-roles')
      .then(response => {
        const data = response?.data || []
        setMe(data)
      })
      .catch(() => {
        setMe(undefined)
      })
  }, [currentUser])

  return (
    <Menu {...{
      className: "w-[256px] overflow-y-auto overflow-x-hidden",
      mode: "inline",
      defaultSelectedKeys: [`/admin/${featureName}`],
      defaultOpenKeys: menusAdmin.map((item: IMenuAdminItem) => {
        if (item?.children) return item.path;
        return '';
      }),
    }}>
      {menusAdmin.map((item: IMenuAdminItem) => {
        const rolesOfMenuItem = item.roles || [];
        let rightPermission = false
        const roles = me?.roles || []
        for (const role of roles) {
          const code = role.code as string;
          if (rolesOfMenuItem.includes(code)) {
            rightPermission = true
            break;
          }
        }

        if (!rightPermission) return null

        if (item?.children) {
          return (
            <Menu.SubMenu 
              title={item.label} 
              icon={item.icon} 
              key={item.path}
            >
              {item.children.map((menuItem: IMenuAdminItem, i: number) => (
                <Menu.Item key={`${menuItem.path}-${i}`}>
                  <Link to={menuItem.path}>{menuItem.label}</Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          )
        }
        return (
          <Menu.Item key={item.path} icon={item.icon}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        )
      })}
    </Menu>
  )
}
