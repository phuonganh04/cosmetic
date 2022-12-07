/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link"
import { FC } from "react"
import styles from "./admin-header.module.scss"
import { UserOnHeader } from "./user/user-on-header"

export const AdminHeader: FC = () => {
  return (
    <div className={styles["admin-header"]}>
      <div className={styles["admin-header__left"]}>
        <Link href="/">
          <div className={"text-white font-base uppercase font-bold cursor-pointer hover:opacity-70 h-[50px]"}>
            			<img className="max-h-[100%] block" src="/assets/images/logo_1.png" />
          </div>
        </Link>
      </div>
      <div className={styles["admin-header__right"]}>
        <div className="text-[#FFFFFF] px-5">|</div>
        <UserOnHeader />
      </div>
    </div>
  )
}
