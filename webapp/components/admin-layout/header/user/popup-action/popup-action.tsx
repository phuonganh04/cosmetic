import Link from "next/link";
import { useAuth } from "../../../../authentication/hooks";
import { localStorageUtils } from "../../../../common-component/local-storage";

export const PopupAction = () => {
  const {setCurrentUser, setToken} = useAuth()

  const handleLogout = () => {
    setCurrentUser(undefined)
    setToken(undefined)
    localStorageUtils.setAccessToken('')
  }

  const actions = [
    { content: 'Tài khoản của tôi', href: '/update-information' },
    { content: 'Đơn mua', href: '/cart' },
    { content: 'Đăng xuất', href: '/sign-in', handleClick: handleLogout },
  ]
  return (
    <div className="flex flex-col text-black">
      {actions.map(item => (
        <Link
          key={item.href}
          href={item.href}
        >
          <div onClick={item?.handleClick ? item.handleClick : (() => {console.log("OKE")})} className="p-1 text-black hover:text-teal-700 cursor-pointer">{item.content}</div>
        </Link>
      ))}
    </div>
  );
}
