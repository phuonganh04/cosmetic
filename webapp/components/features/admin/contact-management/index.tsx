/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Input, Modal, notification, Popconfirm, Table } from "antd";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import axiosClient from "../../../common-component/apis";
import { CForm } from "../../../shared/common/c-form";

const ContactManagement = () => {
  const [dataSource, setDataSource] = useState([]);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [documentEditing, setDocumentEditing] = useState<any>({});
  const { asPath } = useRouter();

  const getDataSource = () => {
    axiosClient.get("/contacts").then(response => setDataSource(response?.data || []));
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
      axiosClient.put(`/contacts/${documentEditing.id}`, values).then(() => {
        setVisibleDetail(false);
        notification.success({ message: "Dữ liệu đã được cập nhật" });
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
    if (visibleCreate && !documentEditing) {
      axiosClient.post(`/contacts`, values).then(() => {
        setVisibleCreate(false);
        notification.success({ message: "Dữ liệu đã được cập nhật" });
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
  }

  const handleDelete = (record: any) => {
    axiosClient.delete(`/contacts/${record.id}`).then(() => {
      setVisibleDetail(false);
      notification.success({ message: "Dữ liệu đã được cập nhật" });
      getDataSource();
    }).catch(error => {
      notification.error({ message: error.response.data.error.message });
    });
  }

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
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

  return (
    <>
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
        title: 'Thông tin chi tiết liên hệ',
        footer: null,
        destroyOnClose: true,
        width: '60%',
      }}>
        <ViewContactInformationForm {...{
          documentEditing,
          visibleDetail,
          handleSubmitEdit,
        }} />
      </Modal>
    </>
  )
}

export default memo(ContactManagement);

export const ViewContactInformationForm = ({
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
    hiddenControlButton: true,
    schema: [
      {
        Component: Input,
        label: 'E-mail',
        name: "email",
      },
      {
        Component: Input,
        label: 'Số điện thoại',
        name: "phone",
      },
      {
        Component: Input,
        label: 'Tên',
        name: "name",
      },
      {
        Component: Input.TextArea,
        label: 'Lời nhắn',
        name: "message",
        componentProps: {
          rows: 4,
        }
      },
    ]
  }} />
}
