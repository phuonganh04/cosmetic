/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, UploadProps } from "antd"
import { UploadChangeParam, UploadFile } from "antd/lib/upload";
import { FC, useState } from "react";
import { endpoints } from "../../common-component/apis/utils";

interface UploadImageProps extends UploadProps {
	value?: string;
}

const UploadImage: FC<UploadImageProps> = ({
  onChange = (f=>f),
  value = '',
  ...restProps
}) => {
  const [imageUrl, setImageUrl] = useState<string>(value);
  const [loading, setLoading] = useState<boolean>(false);
    
  const handleChange = ({file, fileList}: UploadChangeParam<UploadFile<any>>) => {
    if (file.status === 'uploading') {
      setLoading(true);
      return;
    }
    const files: any = fileList.filter(file => file?.status === "done" && !!file?.response).map(item => item?.response?.files);
    onChange(files[0][0])
    setImageUrl(files[0][0]?.url)
    setLoading(false)
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload {...{
      showUploadList: false,
      ...restProps,
      name: "avatar",
      listType: "picture-card",
      className: "avatar-uploader",
      onChange: handleChange,
      action: endpoints.endpointWithApiDomain("/files"),
    }}>
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ maxHeight: 102 }} /> : uploadButton}
    </Upload>
  )
}

export default UploadImage;
