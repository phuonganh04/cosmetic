/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Modal, notification, Popconfirm, Radio, Table, Tag } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosClient from "../../../common-component/apis";
import { ValidationMessage } from "../../../common-component/validation-message";
import { CForm } from "../../../shared/common/c-form";
import UploadImage from "../../../shared/common/c-upload";
import { STATUS_BANNER, STATUS_BANNER_MAPPING, STATUS_BANNER_OPTIONS } from "./constans";

const BannerManagement = () => {
  const [dataSource, setDataSource] = useState([]);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [documentEditing, setDocumentEditing] = useState<any>({});
  const { asPath } = useRouter();

  const getDataSource = () => {
    axiosClient.get("/banners").then(response => setDataSource(response?.data || []));
  }

  useEffect(() => {
    getDataSource();
  }, [asPath])

  const handleEdit = (record: any) => {
    setVisibleDetail(true);
    setDocumentEditing(record);
  }

  const handleSubmitEdit = async (values: any) => {
    const valuesSubmit = {
      ...values,
      image: values?.image?.url,
    }
    if (visibleDetail && documentEditing) {
      axiosClient.put(`banners/${documentEditing.id}`, valuesSubmit).then(() => {
        setVisibleDetail(false);
        notification.success({ message: "Dữ liệu đã được cập nhật" });
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
    if (visibleCreate && !documentEditing) {
      axiosClient.post(`banners`, valuesSubmit).then(() => {
        setVisibleCreate(false);
        notification.success({ message: "Dữ liệu đã được cập nhật" });
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
  }

  const handleDelete = (record: any) => {
    axiosClient.delete(`banners/${record.id}`).then(() => {
      setVisibleDetail(false);
      notification.success({ message: "Dữ liệu đã được cập nhật" });
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
      render: (status: any) => (
        <div>
          <Tag color={STATUS_BANNER_MAPPING[status].color}>{STATUS_BANNER_MAPPING[status].label}</Tag>
        </div>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
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
        title: 'Thông tin chi tiết banner',
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
              Component: UploadImage,
              label: 'Hình ảnh',
              rules: [{ required: true, message: ValidationMessage.error('Hình ảnh') }],
              name: 'image',
            },
            {
              Component: TextArea,
              label: 'Mô tả',
              rules: [{ required: true, message: ValidationMessage.error('Mô tả') }],
              name: "description",
            },
            {
              Component: Radio.Group,
              label: 'Trạng thái',
              name: "status",
              initialValue: STATUS_BANNER.INACTIVE,
              componentProps: {
                optionType: "button",
                options: STATUS_BANNER_OPTIONS,
                buttonStyle: "solid",
              }
            },
          ]
        }} />
      </Modal>
    </>
  )
}

export default BannerManagement;
