import { OrganizationWithRelations } from './organization.model';
import {belongsTo, model, property} from '@loopback/repository';
import { Organization, User, UserWithRelations } from '.';
import { BaseEntity } from './base';

@model({
  settings: {
    strict: false,
    indexes: {
      codeSearchIndex: {
        keys: {
          code: 1,
        },
      },
      searchSearchIndex: {
        keys: {
          name: 1,
        },
      },
      roleSearchTextIndex: {
        keys: {code: 'text', name: 'text'}
      }
    },
  }
})
export class Role extends BaseEntity {
  @belongsTo(() => Organization)
  orgId: string

  @belongsTo(() => User)
  createdById: string

  @belongsTo(() => User)
  updatedById: string

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  org: OrganizationWithRelations,
  createdBy: UserWithRelations,
  updatedBy: UserWithRelations,
}

export type RoleWithRelations = Role & RoleRelations;
