import { MailOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutAdmin from "../../layouts/admin";
import { AdminContent } from "./content/admin.content";

const AdminPage = () => {
  return (
    <BrowserRouter>
      <LayoutAdmin>
        <AdminContent>
          <Routes>
            {menusAdmin.map((item: IMenuAdminItem) => {
              if (item?.children) {
                return item.children.map((menuItem: IMenuAdminItem, i: number) => (
                  <Route key={`${menuItem.path}-${i}`} element={menuItem.element} path={menuItem.path} />
                ))
              }
              return <Route key={item.path} element={item.element} path={item.path} />
            })}
          </Routes>
        </AdminContent>
      </LayoutAdmin>
    </BrowserRouter>
  )
}

export default AdminPage;

const UserManagement = dynamic(
  () => import("../features/admin/user-management"),
  {ssr: false}
)
const BankAccount = dynamic(
  () => import("../features/admin/bank-account"),
  {ssr: false}
)
const BankManagement = dynamic(
  () => import("../features/admin/bank"),
  {ssr: false}
)
const CategoryManagement = dynamic(
  () => import("../features/admin/category"),
  {ssr: false}
)
const ProductManagement = dynamic(
  () => import("../features/admin/product"),
  {ssr: false}
)
const OrderManagement = dynamic(
  () => import("../features/admin/order"),
  {ssr: false}
)
const BannerManagement = dynamic(
  () => import("../features/admin/banner"),
  {ssr: false}
)
const ContactManagement = dynamic(
  () => import("../features/admin/contact-management"),
  {ssr: false}
)
const StatisticOrderManagement = dynamic(
  () => import("../features/admin/statistic-management/statistic-order"),
  {ssr: false}
)
const StatisticProductManagement = dynamic(
  () => import("../features/admin/statistic-management/statistic-product"),
  {ssr: false}
)

export interface IMenuAdminItem {
	label?: string | ReactNode;
	icon?: string | ReactNode;
	path: string;
	element?: ReactNode;
  roles?: string | string[];
	children?: IMenuAdminItem[];
}

export const menusAdmin: IMenuAdminItem[] = [
  {
    label: 'Ng?????i d??ng',
    icon: <MailOutlined />,
    path: '/admin/user',
    roles: ['ADMIN'],
    children: [
      {
        label: 'Ng?????i d??ng',
        icon: <MailOutlined />,
        path: '/admin/user',
        element: <UserManagement/>
      },
      {
        label: 'T??i kho???n ng??n h??ng',
        icon: <MailOutlined />,
        path: '/admin/user/bank-account',
        element: <BankAccount/>
      },
      {
        label: 'Ng??n h??ng',
        icon: <MailOutlined />,
        path: '/admin/user/bank',
        element: <BankManagement/>
      },
    ]
  },
  {
    label: 'S???n ph???m',
    icon: <MailOutlined />,
    path: '/admin/product',
    roles: ['ADMIN', 'STAFF'],
    children: [
      {
        label: 'S???n ph???m',
        icon: <MailOutlined />,
        path: '/admin/product',
        element: <ProductManagement/>,
      },
      {
        label: 'Lo???i s???n ph???m',
        icon: <MailOutlined />,
        path: '/admin/product/category',
        element: <CategoryManagement/>,
      },
    ]
  },
  {
    label: 'Banner',
    icon: <MailOutlined />,
    path: '/admin/banner',
    element: <BannerManagement/>,
    roles: ['ADMIN', 'STAFF'],
  },
  {
    label: '????n h??ng',
    icon: <MailOutlined />,
    path: '/admin/order',
    roles: ['ADMIN', 'STAFF'],
    children: [
      {
        label: '????n h??ng',
        icon: <MailOutlined />,
        path: '/admin/order',
        element: <OrderManagement/>,
      },
    ]
  },
  {
    label: 'Th???ng k??',
    icon: <MailOutlined />,
    path: '/admin/statistical',
    roles: ['ADMIN'],
    children: [
      {
        label: '????n h??ng',
        icon: <MailOutlined />,
        path: '/admin/statistical',
        element: <StatisticOrderManagement/>,
      },
      {
        label: 'S???n ph???m',
        icon: <MailOutlined />,
        path: '/admin/statistical/product',
        element: <StatisticProductManagement/>,
      },
    ]
  },
  {
    label: 'Li??n h???',
    icon: <MailOutlined />,
    path: '/admin/contact',
    roles: ['ADMIN', 'STAFF'],
    children: [
      {
        label: 'Li??n h???',
        icon: <MailOutlined />,
        path: '/admin/contact',
        element: <ContactManagement/>,
      },
    ]
  }
]
