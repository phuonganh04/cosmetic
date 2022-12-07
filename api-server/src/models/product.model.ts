import { belongsTo, model, property } from '@loopback/repository';
import { Category, CategoryWithRelations } from '.';
import { BaseEntity } from './base';
import { User } from './user.model';

@model({
  indexes: {
    name: { keys: { name: 1 } }
  }
})
export class Product extends BaseEntity {
  @belongsTo(() => User)
  createdById: string;

  @belongsTo(() => User)
  updatedById: string;

  @belongsTo(() => Category)
  categoryId: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'number',
    required: true,
  })
  inStock: number;

  @property({
    type: 'string',
    default: "/assets/images/demo-product.png"
  })
  image: string;

  @property({
    type: 'string',
  })
  description: string;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  category: CategoryWithRelations
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
