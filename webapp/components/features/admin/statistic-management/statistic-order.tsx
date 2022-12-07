/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShoppingCartOutlined, SnippetsOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { Line, Pie } from '@ant-design/plots'
import { FC, Fragment, memo, ReactNode, useEffect, useState } from 'react'
import { mappingOrderStatus, orderStatus } from '../../../../types'
import axiosClient from '../../../common-component/apis'
import { DateTimeUtils } from '../../../shared/utils/number-utils'

const StatisticOrder = memo(() => {
  const [orders, setOrders] = useState<any[]>([]);
	
  useEffect(() => {
    axiosClient.get("/orders").then(response => setOrders(response?.data || [])).catch(() => setOrders([]))
  }, [])

  return (
    <Fragment>
      <GeneralStatistics orders={orders}/>
      <div className='flex justify-between'>
        <TurnoverStatistic orders={orders}/>
        <OrderStatusStatistics orders={orders} />
      </div>
    </Fragment>
  )
})
StatisticOrder.displayName="StatisticOrder"
export default StatisticOrder

interface IGeneralStatisticItem {
	title: string | ReactNode;
	value: number;
	icon: ReactNode;
	color: string;
}

const GeneralStatisticItem: FC<IGeneralStatisticItem> = ({
  title,
  value,
  icon,
  color
}) => {
  return (
    <div className={"w-[calc(100%/3)] flex rounded-lg overflow-hidden"}>
      <div 
        className='w-[100px] h-[100px] text-white text-[40px] flex justify-center items-center' 
        style={{backgroundColor: color}}
      >{icon}</div>
      <div className='bg-[#f2f2f2] w-[calc(100%-100px)] p-2 pl-10'>
        <p className='uppercase'>{title}</p>
        <div className='font-medium text-[40px]'>{value}</div>
      </div>
    </div>	
  )
}
export interface IOrder {
	orders: any;
}
const GeneralStatistics = memo(({orders}: IOrder) => {
  const getProductIds = (orders: any[]) => {
    const productIds: string[] = []
    for (const order of orders) {
      if (order?.products?.length) {
        for (const product of order.products) {
          productIds.push(product.id)
        }
      }
    }
    return productIds
  }
  const generalStatisticsConfig: IGeneralStatisticItem[] = [
    {title: "tổng số đơn hàng", value: orders?.length || 0, icon: <ShoppingCartOutlined />, color: '#ff3f3f'},
    {title: "tổng số khách hàng", value: new Set(orders.map((item: any) => item.userId)).size, icon: <UserSwitchOutlined />, color: '#aa2cae'},
    {title: "tổng số sản phẩm", value: new Set([...getProductIds(orders)]).size, icon: <SnippetsOutlined />, color: '#2cbc0e'}
  ]

  return (
    <div className='flex gap-10 mb-10'>
      {generalStatisticsConfig.map((item: IGeneralStatisticItem, i: number) => (
        <GeneralStatisticItem
          key={`${item.title}-${i}`}
          value={item.value}
          icon={item.icon}
          title={item.title}
          color={item.color}
        />
      ))}
    </div>
  )
})
GeneralStatistics.displayName = 'GeneralStatistics';

interface ITurnoverStatistic {
	createdAt: string;
	totalPrice: number;
}

const TurnoverStatistic = memo(({orders}: IOrder) => {
  const rawData: ITurnoverStatistic[] = orders
    .filter((order: any) => order?.status === orderStatus.SUCCESSFULLY)
    .map((item: ITurnoverStatistic) => ({
      createdAt: DateTimeUtils.dateConverterToString(item.createdAt, "DD/MM/YYYY"),
      totalPrice: item.totalPrice
    }))

  const getDataForLine = (rawData: ITurnoverStatistic[] = []) => {
    const flags: any = {}
    const ans: ITurnoverStatistic[] = []
    for (const i of rawData) {
      if (flags[i.createdAt]) {
        flags[i.createdAt] += i.totalPrice
      } else {
        flags[i.createdAt] = i.totalPrice
      }
    }
    const keys = Object.keys(flags);
    for (const key of keys) {
      ans.push({createdAt: key, totalPrice: flags[key]})
    }
    return ans
  }

  const config = {
    data: (getDataForLine(rawData) || []).reverse(),
    xField: 'createdAt',
    yField: 'totalPrice',
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  }
  return (
    <div className='w-[60%]'>
      <p className='font-medium text-[18px] mb-5'>THỐNG KÊ DOANH SỐ</p>
      <Line {...config} />
    </div>
  )
})
TurnoverStatistic.displayName = 'TurnoverStatistic';

interface IOrderStatusStatistic {
	status: string;
	value?: number;
}
const OrderStatusStatistics = memo(({orders}: IOrder) => {
  const rawData: IOrderStatusStatistic[] = orders
    .map((item: IOrderStatusStatistic) => ({
      status: item.status,
    }))

  const getDataForPie = (rawData: IOrderStatusStatistic[] = []) => {
    const flags: any = {}
    const ans: IOrderStatusStatistic[] = []
    for (const i of rawData) {
      if (flags[i.status]) {
        flags[i.status] += 1
      } else {
        flags[i.status] = 1
      }
    }
    const keys = Object.keys(flags);
    for (const key of keys) {
      ans.push({status: mappingOrderStatus[key], value: flags[key]})
    }
    return ans
  }
  const config = {
    appendPadding: 10,
    data: getDataForPie(rawData),
    angleField: 'value',
    colorField: 'status',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: 'Trạng thái',
      },
    },
  };
  return (
    <div className='w-[36%]'>
      <p className='font-medium text-[18px] mb-5'>THỐNG KÊ TRẠNG THÁI ĐƠN HÀNG</p>
      <Pie {...config} />
    </div>
  )
})
OrderStatusStatistics.displayName = 'OrderStatusStatistics';
