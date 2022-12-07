/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Input, Modal, notification, Popconfirm, Select, Table } from "antd";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import axiosClient from "../../../common-component/apis";
import { ValidationMessage } from "../../../common-component/validation-message";
import { CForm } from "../../../shared/common/c-form";
import CSelect from "../../../shared/common/c-select";
import { useLocationSelectSchema } from "../../../shared/component/location-select-schema";
import { mappingLabelOfType, USER_TYPE } from "./utils";

const UserManagement = () => {
  const [dataSource, setDataSource] = useState([]);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [documentEditing, setDocumentEditing] = useState<any>({});
  const { asPath } = useRouter();

  const getDataSource = () => {
    axiosClient.get("/users").then(response => setDataSource(response?.data || []));
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
      axiosClient.put(`users/${documentEditing.id}`, values).then(() => {
        setVisibleDetail(false);
        notification.success({ message: "Dữ liệu đã được cập nhật" });
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
    if (visibleCreate && !documentEditing) {
      axiosClient.post(`users`, values).then(() => {
        setVisibleCreate(false);
        notification.success({ message: "Dữ liệu đã được cập nhật" });
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
  }

  const handleDelete = (record: any) => {
    axiosClient.delete(`users/${record.id}`).then(() => {
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
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
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
        title: 'Thông tin chi tiết người dùng',
        footer: null,
        destroyOnClose: true,
        width: '60%',
      }}>
        <UpdateUserInformationForm {...{
          documentEditing,
          visibleDetail,
          handleSubmitEdit,
        }} />
      </Modal>
    </>
  )
}

export default memo(UserManagement);

export const UpdateUserInformationForm = ({
  documentEditing,
  visibleDetail,
  handleSubmitEdit,
}: any) => {
  const locationSchema = useLocationSelectSchema();
  const { asPath } = useRouter();

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
        rules: [{ required: true, message: 'E-mail là bắt buộc!' }],
      },
      ...asPath.split("/").includes("admin") ? [
        {
          Component: Select,
          name: 'type',
          label: 'Loại người dùng',
          rules: [{ required: true, message: 'Loại người dùng là bắt buộc' }],
          componentProps: {
            options: Object.values(USER_TYPE).map(value => ({ value, label: mappingLabelOfType[value] }))
          }
        },
        {
          Component: CSelect,
          label: "Quyền",
          name: "roleIds",
          rules: [{ required: true, message: ValidationMessage.error('Quyền') }],
          componentProps: {
            endpoint: 'roles',
            mode: "multiple"
          }
        },
      ] : [],
      {
        Component: Input,
        label: 'Họ và tên',
        name: "name",
      },
      ...locationSchema,
    ]
  }} />
}
