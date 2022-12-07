/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select } from "antd";
import { useEffect, useState } from "react";
import axiosClient from "../../common-component/apis";
import { LOCATION_TYPE } from "../../types";

export const useLocationSelectSchema = () => {
  const [locations, setLocations] = useState<any>({});

  useEffect(() => {
    axiosClient.get(`/locations`).then(response => {
      const data = response.data;
      setLocations({
        [LOCATION_TYPE.STATE]: data.filter((item: any) => item.type === LOCATION_TYPE.STATE),
        [LOCATION_TYPE.DISTRICT]: data.filter((item: any) => item.type === LOCATION_TYPE.DISTRICT),
        [LOCATION_TYPE.SUB_DISTRICT]: data.filter((item: any) => item.type === LOCATION_TYPE.SUB_DISTRICT),
      });
    })
  }, [])

  return [
    {
      Component: Select,
      label: 'Tỉnh/ Thành phố',
      name: 'stateId',
      componentProps: {
        options: locations?.[LOCATION_TYPE.STATE]?.map((item: any) => ({ value: item.id, label: item.name })),
      }
    },
    {
      Component: Select,
      label: 'Quận/huyện',
      name: 'districtId',
      componentProps: {
        options: locations?.[LOCATION_TYPE.DISTRICT]?.map((item: any) => ({ value: item.id, label: item.name })),
      }
    },
    {
      Component: Select,
      name: 'subDistrictId',
      label: 'Xã/phường',
      componentProps: {
        options: locations?.[LOCATION_TYPE.SUB_DISTRICT]?.map((item: any) => ({ value: item.id, label: item.name })),
      }
    },
  ]
}
