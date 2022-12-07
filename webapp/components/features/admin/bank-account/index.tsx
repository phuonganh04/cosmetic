/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Input, Modal, notification, Popconfirm, Table } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosClient from "../../../common-component/apis";
import { ValidationMessage } from "../../../common-component/validation-message";
import { CForm } from "../../../shared/common/c-form";
import CSelect from "../../../shared/common/c-select";

const BankAccountManagement = () => {
  const [dataSource, setDataSource] = useState([]);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [documentEditing, setDocumentEditing] = useState<any>({});
  const { asPath } = useRouter();

  const getDataSource = () => {
    const filter = {
      include: ['bank']
    }
    axiosClient.get(`/bank-accounts?filter=${JSON.stringify(filter)}`).then(response => setDataSource(response?.data || []));
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
      axiosClient.put(`bank-accounts/${documentEditing.id}`, values).then(() => {
        setVisibleDetail(false);
        notification.success({ message: "Dữ liệu đã được cập nhật" });
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
    if (visibleCreate && !documentEditing) {
      axiosClient.post(`bank-accounts`, values).then(() => {
        setVisibleCreate(false);
        notification.success({ message: "Dữ liệu đã được cập nhật" });
        getDataSource();
      }).catch(error => {
        notification.error({ message: error.response.data.error.message });
      });
    }
  }

  const handleDelete = (record: any) => {
    axiosClient.delete(`bank-accounts/${record.id}`).then(() => {
      setVisibleDetail(false);
      notification.success({ message: "Dữ liệu đã được cập nhật" });
      getDataSource();
    }).catch(error => {
      notification.error({ message: error.response.data.error.message });
    });
  }

  const columns = [
    {
      title: 'Ngân hàng',
      dataIndex: 'bank',
      key: 'bank',
      render: (bank: any) => bank?.name,
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
        title: 'Thông tin chi tiết tài khoản ngân hàng',
        footer: null,
        destroyOnClose: true,
        width: '60%',
      }}>
        <UpdateBankAccountInformationForm {...{
          documentEditing,
          visibleDetail,
          handleSubmitEdit,
        }} />
      </Modal>
    </>
  )
}

export default BankAccountManagement;

export const UpdateBankAccountInformationForm = ({
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
        Component: CSelect,
        label: "Ngân hàng",
        name: "bankId",
        rules: [{ required: true, message: ValidationMessage.error('Ngân hàng') }],
        componentProps: {
          endpoint: 'organizations'
        }
      },
      {
        Component: Input,
        label: 'STK',
        name: "bankAccount",
        rules: [{ required: true, message: 'STK là bắt buộc!' }],
      },
      {
        Component: Input,
        label: 'Người sở hữu',
        name: "bankHolder",
        rules: [{ required: true, message: 'Người sở hữu là bắt buộc!' }],
      },
      {
        Component: Input,
        label: 'Tên chi nhánh',
        name: "bankBranch",
        rules: [{ required: true, message: 'Tên chi nhánh là bắt buộc!' }],
      },
    ]
  }} />
}
