/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, notification } from "antd";
import { FC } from "react";
import axiosClient from "../../common-component/apis";
import { ValidationMessage } from "../../common-component/validation-message";
import { CForm } from "../../shared/common/c-form";

const ContactBody = () => {
  const contactInfos: ContactItemProps[] = [
    {iconUrl: "/assets/svgs/location.svg", content: "122 Hoàng Quốc Việt, Cổ Nhuế, Cầu Giấy, Hà Nội"},
    {iconUrl: "/assets/svgs/phone.svg", content: "0123456789"},
    {iconUrl: "/assets/svgs/mail.svg", content: "admin@gmail.com"},
  ]
  return (
    <div>
      <h3 className="mb-3 text-gray-700 font-semibold text-[30px]">TIỆM BÍ NGÔ</h3>
      <div className="">
        {contactInfos.map((item: ContactItemProps) => (
          <ContactItem key={item.iconUrl} {...{...item}}/>
        ))}
      </div>
      <ContactForm/>
    </div>
  )
}

export default ContactBody

interface ContactItemProps {
	iconUrl: string;
	content: string;
}

const ContactItem: FC<ContactItemProps> = ({
  iconUrl,
  content
}) => {
  return (
    <div className="flex items-center mb-3">
      <div className="w-[30px] h-[30px] mr-2">
        <img src={iconUrl} />
      </div>
      <div className="text-lg text-[#aa5811]">{content}</div>
    </div>
  )
}

const ContactForm = () => {
  const [form] = Form.useForm();
  const handleSubmit = (values: any) => {
    axiosClient.post(`/contacts`, values).then(() => {
      notification.success({ message: "Dữ liệu đã được cập nhật" })
      form.resetFields()
    }).catch(error => {
      notification.error({ message: error.response.data.error.message })
    });
  }

  return (
    <div className="mt-10">
      <h3 className="text-gray-700 font-semibold text-[20px] mb-5">LIÊN HỆ VỚI CHÚNG TÔI</h3>
      <CForm {...{
        name: "basic",
        layout: "vertical",
        submitButtonLabel: "GỬI",
        submitButtonClassName: "bg-[#cb6916] border-none",
        onFinish: handleSubmit,
        form,
        schema: [
          {
            Component: Input,
            name: 'name',
            label: 'Họ và tên',
            rules: [{ required: true, message: ValidationMessage.error('Họ và tên') }],
            componentProps: {
              placeholder: "Họ và tên",
              size: "large"
            }
          },
          {
            Component: Input,
            name: 'email',
            label: 'Email',
            rules: [{ required: true, message: ValidationMessage.error('Email') }],
            componentProps: {
              placeholder: "Email",
              size: "large"
            }
          },
          {
            Component: Input,
            name: 'phone',
            label: 'Số điện thoại',
            rules: [{ required: true, message: ValidationMessage.error('Số điện thoại') }],
            componentProps: {
              placeholder: "Số điện thoại",
              size: "large"
            }
          },
          {
            Component: Input.TextArea,
            name: 'message',
            label: 'Lời nhắn',
            colProps: {span: 24},
            rules: [{ required: true, message: ValidationMessage.error('Lời nhắn') }],
            componentProps: {
              placeholder: "Lời nhắn",
              rows: 4,
              size: "large"
            }
          },
        ]
      }} />
    </div>
  )
}
