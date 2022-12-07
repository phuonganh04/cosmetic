import { FC, ReactNode } from "react";
import { Breadcrumb, Layout } from "antd";
import Head from "next/head";
import { AdminHeader } from "../../components/admin-layout/header/admin.header";
import { AdminLeftMenu } from "../../components/admin-layout/left-menu/admin.left-menu";
import  styles from "./layout.module.scss";

interface LayoutAdminProp {
  children?: ReactNode;
}

const LayoutAdmin: FC<LayoutAdminProp> = ({children}) => {
	return (
		<div>
			<Head>
				<link rel="icon" type="image/png" href="/assets/images/logo.png" />
				<meta name="description" content="Tiệm bí ngô" />
				<title>Tiệm bí ngô</title>
			</Head>
			<Layout>
				<AdminHeader />
				<div className={styles["admin-content"]}>
					<AdminLeftMenu />
					<div className={styles["admin-content__right"]}>
						<Breadcrumb />
						<>{children}</>
					</div>
				</div>
			</Layout>
		</div>
	)
}

export default LayoutAdmin;
