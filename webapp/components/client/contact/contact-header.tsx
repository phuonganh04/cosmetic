import { Breadcrumb } from "antd"
import Link from "next/link"

const ContactHeader = () => {
  return (
    <div className="contact-header bg-[url('/assets/images/contact-bg.png')] text-center py-10">
      <h2 className="text-white my-2 text-[30px] font-semibold">LIÊN HỆ</h2>
      <Breadcrumb 
        separator={<span className="text-white">/</span>} 
        className="text-center flex justify-center my-2 text-[18px] font-light"
      >
        <Breadcrumb.Item>
          <Link href="/">
            <span className="text-white">TRANG CHỦ</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-white font-semibold">LIÊN HỆ</span>
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  )
}

export default ContactHeader
