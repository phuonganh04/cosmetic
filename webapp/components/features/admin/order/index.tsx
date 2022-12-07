/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, notification, Popconfirm, Steps, Table } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getStatusByStepOfOrderStatus, mappingOrderStatus, mappingPaymentMethod, mappingStepOfOrderStatus, orderStatus } from "../../../../types";
import axiosClient from "../../../common-component/apis";
import { notificationError, notificationSuccess } from "../../../common-component/notification";
import { CForm } from "../../../shared/common/c-form";
import CSelect from "../../../shared/common/c-select";
import { NumberUtils } from "../../../shared/utils/number-utils";
const {Step} = Steps;

const OrderManagement = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [visibleDestroy, setVisibleDestroy] = useState<boolean>(false);
  const [documentEditing, setDocumentEditing] = useState<any>({});
  const { asPath } = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [formDestroy] = Form.useForm();

  useEffect(() => {
    axiosClient.get("/products").then((response: any) => setProducts(response?.data || []))
  }, [])

  const getDataSource = () => {
    const filter = {
      include: ['createdBy', 'updatedBy', 'customer'],
      order: ["updatedAt DESC"]
    }
    axiosClient.get(`/orders?filter=${JSON.stringify(filter)}`).then(response => setDataSource(response?.data || []));
  }

  useEffect(() => {
    getDataSource();
  }, [asPath])

  const handleEdit = (record: any) => {
    setVisibleDetail(true);
    setDocumentEditing(record);
  }

  const handleSubmitEdit = async (values: any) => {
    if (visibleDetail && documentEditing) {
      axiosClient.put(`/orders/${documentEditing.id}`, values).then(() => {
        setVisibleDetail(false);
        notificationSuccess('Dữ liệu cập nhật thành công');
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
    if (visibleCreate && !documentEditing) {
      axiosClient.post(`/orders`, values).then(() => {
        setVisibleCreate(false);
        notificationSuccess('Dữ liệu cập nhật thành công');
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
  }

  const handleDelete = (record: any) => {
    axiosClient.delete(`/orders/${record.id}`).then(() => {
      setVisibleDetail(false);
      notificationSuccess('Dữ liệu cập nhật thành công');
      getDataSource();
    }).catch(error => {
      notification.error({ message: error.response.data.error.message });
    });
  }

  const columns = [
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => mappingOrderStatus[status]
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer: any) => customer?.name,
    },
    {
      title: 'Tổng giá trị',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: NumberUtils.formatNumber,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (record: any) => (
        <div>
          <a className="mr-[10px]" onClick={() => handleEdit(record)}>
            <EditOutlined />
          </a>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa bản ghi này?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">
              <DeleteOutlined />
            </a>
          </Popconfirm>
        </div>
      )
    }
  ];

  const handleChangeStep = (step: number) => {
    const values = {...documentEditing};
    delete values.customer;
    delete values.updatedBy;
    delete values.createdBy;
    const status = getStatusByStepOfOrderStatus(step);
    if (status === orderStatus.SUCCESSFULLY && !documentEditing?.paid) {
      notification.error({ message: "Thất bại", description: "Đơn hàng chưa thanh toán" });
      return;
    }
		
    axiosClient.put(`/orders/${documentEditing.id}`, {
      ...values, 
      status,
    }).then(() => {
      setVisibleDetail(false);
      notificationSuccess('Dữ liệu cập nhật thành công');
      getDataSource();
    }).catch(error => {
      notification.error({ message: error.response.data.error.message });
    });
  }

  const handlePaidConfirm = () => {
    const values = {...documentEditing};
    delete values.customer;
    delete values.updatedBy;
    delete values.createdBy;
    axiosClient.put(`/orders/${documentEditing.id}`, {
      ...values, 
      paid: true,
    }).then(() => {
      setVisibleDetail(false);
      notificationSuccess('Dữ liệu cập nhật thành công');
      getDataSource();
    }).catch(error => {
      notification.error({ message: error.response.data.error.message });
    });
  }

  const handleDestroyOrder = () => {
    const description = formDestroy?.getFieldValue("description");
    if (!description) {
      notificationError("Vui lòng điền lý do hủy");
      return;
    }
    axiosClient.post(`/orders/destroy/${documentEditing.id}`, {
      status: orderStatus.FAILURE,
      description,
    }).then(() => {
      setVisibleDetail(false);
      notificationSuccess('Dữ liệu cập nhật thành công');
      getDataSource();
    }).catch(error => {
      notification.error({ message: error.response.data.error.message });
    });
  }

  return (
    <>
      <Table dataSource={dataSource || []} columns={columns} />
      <Modal {...{
        visible: visibleCreate || visibleDetail,
        onCancel: () => {
          if (visibleDetail) {
            setVisibleDetail(false)
          }
          if (visibleCreate) {
            setVisibleCreate(false)
          }
        },
        title: "Thông tin chi tiết đơn hàng",
        footer: null,
        destroyOnClose: true,
        width: '60%',
      }}>
        <a 
          onClick={() => {setVisibleDestroy(prev => !prev)}} 
          className="mb-5 block text-red-500 decoration-1 underline cursor-pointer w-fit"
        >
					!!! Hủy đơn hàng
        </a>

        <Modal 
          footer={null} 
          onCancel={() => setVisibleDestroy(false)} 
          open={visibleDestroy} 
          destroyOnClose={true}
        >
          <p className="mb-1">Lý do hủy đơn hàng</p>
          <Form form={formDestroy}>
            <Form.Item name={"description"}>
              <Input />
            </Form.Item>
          </Form>
          <Button type="primary" onClick={handleDestroyOrder} className="w-full">Submit</Button>
        </Modal>
				
        <CForm {...{
          name: "basic",
          initialValues: visibleDetail ? documentEditing : {},
          autoComplete: "off",
          layout: "vertical",
          onFinish: handleSubmitEdit,
          hiddenControlButton: true,
          schema: [
            {
              Component: Steps,
              name: "status",
              colProps: {span: 24},
              componentProps: {
                children: Object.values(orderStatus)
                  .filter((item: any) => item !== orderStatus.FAILURE)
                  .map((status: any) => {
                    if (documentEditing.status === orderStatus.FAILURE) {
                      return <Step status={"error"} key={status} title={mappingOrderStatus[status]}/>
                    }
                    return <Step key={status} title={mappingOrderStatus[status]}/>
                  }),
                current: mappingStepOfOrderStatus[documentEditing?.status],
                onChange: handleChangeStep,
              }
            },
            ...documentEditing.status === orderStatus.FAILURE ? [{
              Component: Input.TextArea,
              label: "Lí do hủy đơn hàng",
              name: "description",
              colProps: {span: 24},
              componentProps: {
                rows: 4
              }
            }] : [],
            {
              Component: CSelect,
              label: 'Khách hàng',
              name: "customerId",
              componentProps: {
                endpoint: 'users'
              }
            },
            {
              Component: InputNumber,
              name: 'totalPrice',
              label: 'Giá trị đơn hàng',
            },
            {
              Component: ({value}: {value: string}) => (
                <div>
                  <Input value={mappingPaymentMethod[value]}/>
                  {documentEditing?.paid ? 
                    <span className="text-green-500 text-xs italic">Đã thanh toán</span>	:
                    <span className="text-blue-500 text-xs italic cursor-pointer" onClick={handlePaidConfirm}>Xác nhận thanh toán</span>
                  }
                </div>
              ),
              label: 'Phương thức thanh toán',
              name: "paymentMethod",
            },
            {
              Component: Input,
              label: 'Địa chỉ nhận hàng',
              name: "address",
            },
            {
              Component: ({value}: {value: any[]}) => {
                for (const product of value) {
                  product.name = products.find(item => item.id === product.id)?.name;
                }
                return (
                  <Table pagination={false} dataSource={value} columns={
                    [
                      {
                        title: 'Tên sản phẩm',
                        dataIndex: 'name',
                        key: 'name',
                      },
                      {
                        title: 'Giá',
                        dataIndex: 'price',
                        key: 'price',
                        render: (price: number) => NumberUtils.formatNumber(price),
                      },
                      {
                        title: 'Số lượng',
                        dataIndex: 'quantity',
                        key: 'quantity',
                      },
                      {
                        title: 'Tổng giá trị',
                        dataIndex: 'priceTotal',
                        key: 'priceTotal',
                        render: NumberUtils.formatNumber,
                      }
                    ]
                  } />
                )
              },
              name: "products",
              colProps: {span: 24}
            }
          ]
        }} />
      </Modal>
    </>
  )
}

export default OrderManagement;
