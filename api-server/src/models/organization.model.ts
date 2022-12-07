import { Location, LocationWithRelations } from './location.model';
import { belongsTo, model, property } from '@loopback/repository';
import { User, UserWithRelations } from '.';
import { BaseEntity } from './base';

@model()
export class Organization extends BaseEntity {
  @belongsTo(() => User) 
  createdById: string;

  @belongsTo(() => User) 
  updatedById: string;

  @property({
    type: "string",
  })
  email: string;

  @property({
    type: "string",
  })
  name: string;

  @property({
    type: "string",
    required: true,
    unique: true,
  })
  code: string;

  constructor(data?: Partial<Organization>) {
    super(data);
  }
}

export interface OrganizationRelations {
  updatedBy: UserWithRelations,
  createdBy: UserWithRelations,
}

export type OrganizationWithRelations = Organization & OrganizationRelations;
