/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Input, Modal, notification, Popconfirm, Select, Table } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosClient from "../../../common-component/apis";
import { notificationSuccess } from "../../../common-component/notification";
import { ValidationMessage } from "../../../common-component/validation-message";
import { CForm } from "../../../shared/common/c-form";

const CategoryManagement = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [documentEditing, setDocumentEditing] = useState<any>({});
  const { asPath } = useRouter();
  const getDataSource = () => {
    axiosClient.get("/categories").then(response => setDataSource(response?.data || []));
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
      axiosClient.put(`/categories/${documentEditing.id}`, values).then(() => {
        setVisibleDetail(false);
        notificationSuccess('Dữ liệu cập nhật thành công');
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
    if (visibleCreate && !documentEditing) {
      axiosClient.post(`/categories`, values).then(() => {
        setVisibleCreate(false);
        notificationSuccess('Dữ liệu cập nhật thành công');
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
  }

  const handleDelete = (record: any) => {
    axiosClient.delete(`/categories/${record.id}`).then(() => {
      setVisibleDetail(false);
      notificationSuccess('Dữ liệu cập nhật thành công');
      getDataSource();
    }).catch(error => {
      notification.error({ message: error.response.data.error.message });
    });
  }

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục con',
      dataIndex: 'childrenIds',
      key: 'childrenIds',
      render: (childrenIds: string[]) => dataSource?.filter((item: any) => childrenIds?.includes(item.id)).map((item: any) => item.name).join(", ")
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
        title: 'Thông tin chi tiết loại',
        footer: null,
        destroyOnClose: true,
        width: '60%',
      }}>
        <CForm {...{
          name: "basic",
          initialValues: visibleDetail ? documentEditing : {},
          autoComplete: "off",
          layout: "vertical",
          onFinish: handleSubmitEdit,
          schema: [
            {
              Component: Input,
              label: 'Tên',
              name: "name",
              rules: [{ required: true, message: ValidationMessage.error('Tên') }],
            },
            ...documentEditing?.childrenIds?.length ? [] : [
              {
                Component: Select,
                label: "Danh mục cha",
                name: "parentId",
                componentProps: {
                  options: dataSource.filter((item: any) => !item?.parentId).map((item: any) => ({ label: item.name, value: item.id }))
                }
              }
            ],
          ]
        }} />
      </Modal>
    </>
  )
}

export default CategoryManagement;
