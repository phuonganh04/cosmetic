import { User, UserWithRelations } from '@loopback/authentication-jwt';
import { belongsTo, model, property } from '@loopback/repository';
import { BaseEntity } from './base';
import { Organization } from './organization.model';

@model()
export class BankAccount extends BaseEntity {
  @belongsTo(() => User) 
  createdById: string;

  @belongsTo(() => User) 
  updatedById: string;

  @belongsTo(() => Organization)
  bankId: string;

  @property({
    type: "string",
  })
  bankAccount: string;

  @property({
    type: "string",
  })
  bankHolder: string;

  @property({
    type: "string",
  })
  bankBranch: string;
  
  constructor(data?: Partial<BankAccount>) {
    super(data);
  }
}

export interface BankAccountRelations {
  updatedBy: UserWithRelations,
  createdBy: UserWithRelations,
}

export type BankAccountWithRelations = BankAccount & BankAccountRelations;
