import {belongsTo, Entity, model, property} from '@loopback/repository';
import { BaseEntity } from './base';
import { User } from './user.model';

@model()
export class Banner extends BaseEntity {
  @belongsTo(() => User)
  createdById: string;
  
  @belongsTo(() => User)
  updatedById: string;

  @property({
     type: 'string',
  })
  description: string;

  @property({
     type: 'string'
  })
  image: string;

  @property({
    type: 'string',
    default: Banner.STATUS.INACTIVE
  })
  status: string;

  static STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
  }

  constructor(data?: Partial<Banner>) {
    super(data);
  }
}

export interface BannerRelations {
  // describe navigational properties here
}

export type BannerWithRelations = Banner & BannerRelations;