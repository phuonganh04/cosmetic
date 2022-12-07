/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Form, FormProps, Row } from "antd";
import { FC, ReactNode } from "react";
import cls from "classnames"

interface CFormProps extends FormProps {
    schema: any;
	hiddenControlButton?: boolean;
	submitButtonLabel?: string | ReactNode;
	submitButtonClassName?: string;
}

export const CForm: FC<CFormProps> = (props) => {
  const { 
    schema = [], 
    hiddenControlButton, 
    submitButtonLabel,
    submitButtonClassName,
    ...formProps
	 } = props;
  return (
    <Form {...{ ...formProps }}>
      <Row gutter={[12, 6]}>
        {schema.map((item: any, index: number) => {
          const { componentProps = {}, Component, colProps, ...formItemProps } = item;
          return (
            <Col span={12} key={`${item.label}${index}`} {...{...colProps}}>
              <Form.Item {...{ ...formItemProps }}>
                <Component {...{ ...componentProps }} />
              </Form.Item>
            </Col>
          )
        })}
      </Row>
      {!hiddenControlButton && <Form.Item className="mx-auto w-[150px]">
        <Button className={cls("w-full", submitButtonClassName)} type="primary" htmlType="submit">
          {submitButtonLabel || "Submit"}
        </Button>
      </Form.Item>}
    </Form >
  )
}
