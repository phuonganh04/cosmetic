/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Input, Modal, notification, Popconfirm, Table } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosClient from "../../../common-component/apis";
import { CForm } from "../../../shared/common/c-form";

const BankManagement = () => {
  const [dataSource, setDataSource] = useState([]);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [documentEditing, setDocumentEditing] = useState<any>({});
  const { asPath } = useRouter();

  const getDataSource = () => {
    axiosClient.get("/organizations").then(response => setDataSource(response?.data || []));
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
      axiosClient.put(`organizations/${documentEditing.id}`, values).then(() => {
        setVisibleDetail(false);
        notification.success({ message: "Dữ liệu đã được cập nhật" });
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
    if (visibleCreate && !documentEditing) {
      axiosClient.post(`organizations`, values).then(() => {
        setVisibleCreate(false);
        notification.success({ message: "Dữ liệu đã được cập nhật" });
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
  }

  const handleDelete = (record: any) => {
    axiosClient.delete(`organizations/${record.id}`).then(() => {
      setVisibleDetail(false);
      notification.success({ message: "Dữ liệu đã được cập nhật" });
      getDataSource();
    }).catch(error => {
      notification.error({ message: error.response.data.error.message });
    });
  }

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
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

  const handleCreate = () => {
    setVisibleCreate(true);
    setDocumentEditing(undefined);
  }

  return (
    <>
      <Button onClick={handleCreate} className="mb-5 flex items-center gap-1" type="primary"><PlusSquareOutlined />Tạo mới</Button>
      <Table dataSource={dataSource} columns={columns} />
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
        title: 'Thông tin chi tiết ngân hàng',
        footer: null,
        destroyOnClose: true,
        width: '60%',
      }}>
        <UpdateBankInformationForm {...{
          documentEditing,
          visibleDetail,
          handleSubmitEdit,
        }} />
      </Modal>
    </>
  )
}

export default BankManagement;

export const UpdateBankInformationForm = ({
  documentEditing,
  visibleDetail,
  handleSubmitEdit,
}: any) => {
  return <CForm {...{
    name: "basic",
    initialValues: visibleDetail ? documentEditing : {},
    autoComplete: "off",
    layout: "vertical",
    onFinish: handleSubmitEdit,
    schema: [
      {
        Component: Input,
        label: 'E-mail',
        name: "email",
      },
      {
        Component: Input,
        label: 'Tên',
        name: "name",
      },
      {
        Component: Input,
        label: 'Mã',
        name: "code",
      },
    ]
  }} />
}
