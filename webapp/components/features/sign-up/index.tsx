/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Divider, Form, Input } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signUp } from "./apis";
import styles from "./sign-up.module.scss";

export interface ISignUpValues {
    email: string;
    password: string;
    rePassword: string | undefined;
}

const SignUp = () => {
  const router = useRouter();
  const { push } = router;

  const onFinish = async (values: ISignUpValues) => {
    await signUp({ ...values, rePassword: undefined }, push);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles["sign-up"]}>
      <Head>
        <link rel="icon" type="image/png"  href="/assets/images/logo.png" />
        <meta name="description" content="Tiệm bí ngô" />
        <title>Đăng ký</title>
      </Head>
      <h2>Đăng ký</h2>
      <Form
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "E-mail không hợp lệ!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            () => ({
              validator(_, value) {
                if (value.length < 8) {
                  return Promise.reject('Mật khẩu phải có trên 8 ký tự!');
                }
                return Promise.resolve();
              },
            }),
            {
              required: true,
              message: "Mật khẩu là bắt buộc!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Nhập lại mật khẩu"
          name="rePassword"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value !== getFieldValue("password")) {
                  return Promise.reject('Mật khẩu không chính xác!');
                }
                return Promise.resolve();
              },
            }),
            {
              required: true,
              message: "Mật khẩu là bắt buộc!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button className="w-full" type="primary" htmlType="submit">
                        Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <div className="text-center">
        <strong className="mr-2">Bạn đã có tài khoản?</strong>
        <Link href="/sign-in">Đăng nhập</Link>
      </div>
    </div >
  )
}

export default SignUp
