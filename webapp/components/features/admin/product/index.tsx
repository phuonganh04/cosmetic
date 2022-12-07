/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, Modal, Popconfirm, Table } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosClient from "../../../common-component/apis";
import { notificationError, notificationSuccess } from "../../../common-component/notification";
import { ValidationMessage } from "../../../common-component/validation-message";
import { CForm } from "../../../shared/common/c-form";
import CSelect from "../../../shared/common/c-select";
import UploadImage from "../../../shared/common/c-upload";
import { NumberUtils } from "../../../shared/utils/number-utils";

const ProductManagement = () => {
  const [dataSource, setDataSource] = useState([]);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [documentEditing, setDocumentEditing] = useState<any>({});
  const { asPath } = useRouter();

  const getDataSource = () => {
    const filter = { include: ['category'] }
    axiosClient.get(`/products?filter=${JSON.stringify(filter)}`).then(response => setDataSource(response?.data || []));
  }

  useEffect(() => {
    getDataSource();
  }, [asPath])

  const handleEdit = (record: any) => {
    setVisibleDetail(true);
    setDocumentEditing(record);
  }

  const handleSubmitEdit = async (values: any) => {
    const image = typeof values?.image === "string" ? values.image : values?.image?.url
    const valuesSubmit = {
      ...values,
      image,
    }
    if (visibleDetail && documentEditing) {
      axiosClient.put(`products/${documentEditing.id}`, valuesSubmit).then(() => {
        setVisibleDetail(false);
        notificationSuccess("Dữ liệu đã được cập nhật")
        getDataSource();
      }).catch(error => {
        notificationError(error.response.data.error.message)
      });
    }
    if (visibleCreate && !documentEditing) {
      axiosClient.post(`products`, valuesSubmit).then(() => {
        setVisibleCreate(false);
        notificationSuccess("Dữ liệu đã được cập nhật")
        getDataSource();
      }).catch(error => {
        notificationError(error.response.data.error.message);
      });
    }
  }

  const handleDelete = (record: any) => {
    axiosClient.delete(`products/${record.id}`).then(() => {
      setVisibleDetail(false);
      notificationSuccess("Dữ liệu đã được cập nhật")
      getDataSource();
    }).catch(error => {
      notificationError(error.response.data.error.message);
    });
  }

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại',
      key: 'category',
      render: (productRecord: any) => productRecord?.category?.name || <></>,
    },
    {
      title: 'Còn lại',
      dataIndex: 'inStock',
      key: 'inStock',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${NumberUtils.formatNumber(price)} VND`
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
        title: 'Thông tin chi tiết sản phẩm',
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
              Component: CSelect,
              label: "Loại sản phẩm",
              name: "categoryId",
              rules: [{ required: true, message: ValidationMessage.error('Loại sản phẩm') }],
              componentProps: {
                endpoint: 'categories'
              }
            },
            {
              Component: Input,
              label: 'Tên',
              name: "name",
              rules: [{ required: true, message: ValidationMessage.error('Tên') }],
            },
            {
              Component: InputNumber,
              name: 'price',
              label: 'Giá',
              rules: [{ required: true, message: ValidationMessage.error('Gía') }],
            },
            {
              Component: InputNumber,
              label: 'Số lượng trong kho',
              name: "inStock",
              rules: [{ required: true, message: ValidationMessage.error('Số lượng') }],
            },
            {
              Component: UploadImage,
              label: 'Hình ảnh',
              name: 'image',
            },
            {
              Component: Input.TextArea,
              label: 'Mô tả',
              name: "description",
              componentProps: {
                rows: 4,
              }
            },
          ]
        }} />
      </Modal>
    </>
  )
}

export default ProductManagement;
