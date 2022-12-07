/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from "antd";
import { memo, useState, useEffect } from "react";
import { orderStatus } from "../../../../types";
import axiosClient from "../../../common-component/apis";
import { IOrder } from "./statistic-order";

const StatisticProduct = memo(() => {
  const [orders, setOrders] = useState<any[]>([]);
	
  useEffect(() => {
    axiosClient.get("/orders").then(response => setOrders(response?.data || [])).catch(() => setOrders([]))
  }, [])

  return (
    <TableProductStatistics orders={orders}/>
  )
})
StatisticProduct.displayName="StatisticProduct"
export default StatisticProduct

interface ITableProductStatistics {
	name: string;
	sell?: number;
	remain?: number;
}
const TableProductStatistics = memo(({orders}: IOrder) => {
  const [products, setProducts] = useState<any>([]);
	
  useEffect(() => {
    axiosClient.get("/products").then(response => setProducts(response?.data || [])).catch(() => setProducts([]))
  }, [])

  const mappingProduct = (id: string) => {
    return products.find((product: any) => product.id === id);
  }

  const getProductIds = (orders: any[]) => {
    const flags: any = {}
    const ans: ITableProductStatistics[] = []
    const ordersCal = orders.filter((item: any) => item.status !== orderStatus.FAILURE)
    for (const order of ordersCal) {
      if (order?.products?.length) {
        for (const product of order.products) {
          if (!flags[product.id]) {
            flags[product.id] = 1
          } else {
            flags[product.id] += 1
          }
        }
      }
    }
    const keys = Object.keys(flags);
    for (const key of keys) {
      ans.push({name: mappingProduct(key)?.name, sell: flags[key], remain: mappingProduct(key).inStock - flags[key]})
    }
    return ans
  }

  return (
    <div>
      <p className='font-medium text-[18px] mb-5'>THỐNG KÊ SỐ LƯỢNG SẢN PHẨM</p>
      <Table 
        dataSource={(getProductIds(orders) || []).sort((a: any, b: any) => b.sell - a.sell)}
        columns={[
          {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Đã lên đơn',
            dataIndex: 'sell',
            key: 'sell',
          },
          {
            title: 'Còn lại',
            dataIndex: 'remain',
            key: 'remain',
          },
        ]}
		 	/>
    </div>
  )
})
TableProductStatistics.displayName = "TableProductStatistics"
