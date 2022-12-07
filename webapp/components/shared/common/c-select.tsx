/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, SelectProps } from "antd";
import { useEffect, useState } from "react";
import axiosClient from "../../common-component/apis";

interface CSelectProps extends SelectProps {
    endpoint: string;
    converterOption?: () => object;
    params?: object;
}

const CSelect = (props: CSelectProps) => {
  const {
    endpoint,
    converterOption = (item: any) => ({}),
    params,
    ...selectProps
  } = props;
  const [options, setOptions] = useState<{ label: string, value: string | number }[]>([]);

  useEffect(() => {
    if (!endpoint) {
      setOptions([]);
      return;
    }

    const finalEndpoint = params ? `${endpoint}?filter=${JSON.stringify(params)}` : endpoint;

    axiosClient.get(finalEndpoint)
      .then((response: any) => {
        const data = response?.data || [];
        setOptions(data.map((item: { name: string, id: string }) => ({ label: item?.name, value: item?.id, ...converterOption(item) })))
      })
      .catch((error) => console.log(JSON.stringify(error, null, 2)));
  }, [endpoint])


  return (
    <Select {...{
      options,
      ...selectProps
    }} />
  )
}

export default CSelect
