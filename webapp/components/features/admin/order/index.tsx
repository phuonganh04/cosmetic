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
        notificationSuccess('D??? li???u c???p nh???t th??nh c??ng');
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
    if (visibleCreate && !documentEditing) {
      axiosClient.post(`/orders`, values).then(() => {
        setVisibleCreate(false);
        notificationSuccess('D??? li???u c???p nh???t th??nh c??ng');
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
  }

  const handleDelete = (record: any) => {
    axiosClient.delete(`/orders/${record.id}`).then(() => {
      setVisibleDetail(false);
      notificationSuccess('D??? li???u c???p nh???t th??nh c??ng');
      getDataSource();
    }).catch(error => {
      notification.error({ message: error.response.data.error.message });
    });
  }

  const columns = [
    {
      title: 'Tr???ng th??i',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => mappingOrderStatus[status]
    },
    {
      title: 'T??n kh??ch h??ng',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer: any) => customer?.name,
    },
    {
      title: 'T???ng gi?? tr???',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: NumberUtils.formatNumber,
    },
    {
      title: 'H??nh ?????ng',
      key: 'action',
      render: (record: any) => (
        <div>
          <a className="mr-[10px]" onClick={() => handleEdit(record)}>
            <EditOutlined />
          </a>
          <Popconfirm
            title="B???n ch???c ch???n mu???n x??a b???n ghi n??y?"
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
      notification.error({ message: "Th???t b???i", description: "????n h??ng ch??a thanh to??n" });
      return;
    }
		
    axiosClient.put(`/orders/${documentEditing.id}`, {
      ...values, 
      status,
    }).then(() => {
      setVisibleDetail(false);
      notificationSuccess('D??? li???u c???p nh???t th??nh c??ng');
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
      notificationSuccess('D??? li???u c???p nh???t th??nh c??ng');
      getDataSource();
    }).catch(error => {
      notification.error({ message: error.response.data.error.message });
    });
  }

  const handleDestroyOrder = () => {
    const description = formDestroy?.getFieldValue("description");
    if (!description) {
      notificationError("Vui l??ng ??i???n l?? do h???y");
      return;
    }
    axiosClient.post(`/orders/destroy/${documentEditing.id}`, {
      status: orderStatus.FAILURE,
      description,
    }).then(() => {
      setVisibleDetail(false);
      notificationSuccess('D??? li???u c???p nh???t th??nh c??ng');
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
        title: "Th??ng tin chi ti???t ????n h??ng",
        footer: null,
        destroyOnClose: true,
        width: '60%',
      }}>
        <a 
          onClick={() => {setVisibleDestroy(prev => !prev)}} 
          className="mb-5 block text-red-500 decoration-1 underline cursor-pointer w-fit"
        >
					!!! H???y ????n h??ng
        </a>

        <Modal 
          footer={null} 
          onCancel={() => setVisibleDestroy(false)} 
          open={visibleDestroy} 
          destroyOnClose={true}
        >
          <p className="mb-1">L?? do h???y ????n h??ng</p>
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
              label: "L?? do h???y ????n h??ng",
              name: "description",
              colProps: {span: 24},
              componentProps: {
                rows: 4
              }
            }] : [],
            {
              Component: CSelect,
              label: 'Kh??ch h??ng',
              name: "customerId",
              componentProps: {
                endpoint: 'users'
              }
            },
            {
              Component: InputNumber,
              name: 'totalPrice',
              label: 'Gi?? tr??? ????n h??ng',
            },
            {
              Component: ({value}: {value: string}) => (
                <div>
                  <Input value={mappingPaymentMethod[value]}/>
                  {documentEditing?.paid ? 
                    <span className="text-green-500 text-xs italic">???? thanh to??n</span>	:
                    <span className="text-blue-500 text-xs italic cursor-pointer" onClick={handlePaidConfirm}>X??c nh???n thanh to??n</span>
                  }
                </div>
              ),
              label: 'Ph????ng th???c thanh to??n',
              name: "paymentMethod",
            },
            {
              Component: Input,
              label: '?????a ch??? nh???n h??ng',
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
                        title: 'T??n s???n ph???m',
                        dataIndex: 'name',
                        key: 'name',
                      },
                      {
                        title: 'Gi??',
                        dataIndex: 'price',
                        key: 'price',
                        render: (price: number) => NumberUtils.formatNumber(price),
                      },
                      {
                        title: 'S??? l?????ng',
                        dataIndex: 'quantity',
                        key: 'quantity',
                      },
                      {
                        title: 'T???ng gi?? tr???',
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
