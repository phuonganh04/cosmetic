import { Popover } from "antd";
import Link from "next/link";
import { useAuth } from "../../authentication/hooks";
import Container from "../../common-component/container";
import cls from "classnames";
import styles from "./home-header.module.scss";
import { useContext } from "react";
import { AuthContext } from "../../authentication/context";
import { localStorageUtils } from "../../common-component/local-storage";

export const HomeHeader = () => {
  const authContext = useAuth();
  const currentUser = authContext.currentUser;
  const { name, id } = currentUser || {};

  return (
    <div className="bg-primary-color">
      <Container>
        <div className="flex items-center justify-between text-white py-3">
          <div className="flex items-center gap-2 text-xs">
            <span>
              <strong className="mr-1">Liên hệ:</strong>
              <a className="text-white">012345678</a>
            </span>
            <span>
              <strong className="mr-1">Email:</strong>
              <a className="text-white">demo@gmail.com</a>
            </span>
          </div>
          <div className={cls(styles.link, "flex items-center gap-1 text-xs text-white")}>
            {id ? (
              <>
                <Popover content={<DropdownBodyUpdateUserInformation />} placement="bottomLeft">
                  <span className="cursor-pointer">{name || 'Chưa cập nhật thông tin cá nhân'}</span>
                </Popover>
              </>
            ) : (
              <>
                <Link className={'cursor-pointer text-white'} href="/sign-in">
                  Đăng nhập
                </Link>

                <span>/</span>

                <Link className="ml-1 cursor-pointer text-white link" href="sign-up">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

const DropdownBodyUpdateUserInformation = () => {
  const authContext = useAuth();
  const currentUser = authContext.currentUser;
  const setCurrentUser = useContext(AuthContext).setCurrentUser
  const setToken = useContext(AuthContext).setToken

  return (
    <div className="flex justify-center flex-col">
      {["ADMIN", "STAFF"].includes(currentUser?.type) &&
        <Link className="" href="/admin">
        	<div className="p-1 text-black hover:text-teal-700 cursor-pointer">Dashboard</div>
        </Link>
      }

      <Link href="/update-information">
        <div className="p-1 text-black hover:text-teal-700 cursor-pointer">Cập nhật thông tin cá nhân</div>
      </Link>

      {currentUser?.id && <a 
        onClick={() => {
          setCurrentUser(undefined)
          setToken(undefined)
          localStorageUtils.setAccessToken('')
        }}
      >
        <div className="p-1 text-black hover:text-teal-700 cursor-pointer">Đăng xuất</div>
      </a>}
    </div>
  )
}
