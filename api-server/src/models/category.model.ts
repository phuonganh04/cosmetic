import { belongsTo, model, property } from '@loopback/repository';
import { BaseEntity } from './base';
import { User } from './user.model';

@model({
  indexes: {
    name: { keys: { name: 1 } }
  }
})
export class Category extends BaseEntity {
  @belongsTo(() => User)
  createdById: string;

  @belongsTo(() => User)
  updatedById: string;

  @belongsTo(() => Category)
  parentId: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  childrenIds: string[];

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  parent: CategoryWithRelations;
}

export type CategoryWithRelations = Category & CategoryRelations;
