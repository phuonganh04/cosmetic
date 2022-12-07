import { Button, Checkbox, Form, Input } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../authentication/hooks";
import { signIn } from "./apis";
import styles from "./sign-in.module.scss"

export interface ISignInForm {
    email: string;
    password: string;
    remember: boolean;
}

const SignIn = () => {
  const router = useRouter()
  const authContext = useAuth();

  const onGotSuccess = () => {
    router.push("/")
  }

  const onFinish = async (values: ISignInForm) => {
    await signIn(values, onGotSuccess, authContext);
  }

  return (
    <div className={styles['sign-in']}>
      <Head>
        <link rel="icon" type="image/png" href="/assets/images/logo.png" />
        <meta name="description" content="Tiệm bí ngô" />
        <title>Đăng nhập</title>
      </Head>
      <h2>Đăng nhập</h2>

      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="E-mail"
          name="email"
          rules={[{ required: true, message: 'E-mail là bắt buộc!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Mật khẩu là bắt buộc!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Ghi nhớ</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button className="w-full" type="primary" htmlType="submit">
                        Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center">
        <strong className="mr-2">Bạn chưa có tài khoản?</strong>
        <Link href="/sign-up">Đăng kí</Link>
      </div>
    </div>
  )
}

export default SignIn;
