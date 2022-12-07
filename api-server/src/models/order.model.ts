import { belongsTo, model, property } from '@loopback/repository';
import { BaseEntity } from "./base";
import { User, UserWithRelations } from './user.model';

@model()
export class ProductInOrder {
  @property({
    type: "string",
    mongodb: { dataType: "ObjectId" },
    id: true,
  })
  id: string;

  @property({
    type: 'number',
  })
  price: number;

  @property({
    type: 'number',
  })
  priceTotal: number;

  @property({
    type: 'number',
  })
  quantity: number;
}

@model()
export class Order extends BaseEntity {
  @belongsTo(() => User)
  createdById: string;

  @belongsTo(() => User)
  updatedById: string;

  @belongsTo(() => User)
  customerId: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  products: ProductInOrder[];

  @property({
    type: 'string',
    default: Order.STATUS.PREPARING_ORDER,
    required: true,
  })
  status: string;

  @property({
    type: 'string',
    required: true,
  })
  paymentMethod: string;

  @property({
    type: 'number',
    required: true,
  })
  totalPrice: number;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
  })
  description: string;

  @property({
    type: 'boolean',
  })
  paid: boolean;


  static STATUS = {
    PREPARING_ORDER: "preparingOrder", 
    DELIVERING: "delivering",
    SUCCESSFULLY: "successfully",
    FAILURE: "failure",
  }

  static PAYMENT_METHOD = {
    PAY_ONLINE: "payOnline",
    PAYMENT_ON_DELIVERY: "paymentOnDelivery",
  }
  
  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  updatedBy: UserWithRelations,
  createdBy: UserWithRelations,
  customer: UserWithRelations,
}

export type OrderWithRelations = Order & OrderRelations;
