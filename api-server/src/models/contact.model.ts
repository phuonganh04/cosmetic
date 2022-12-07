import { User } from '@loopback/authentication-jwt';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import { BaseEntity } from './base';

@model()
export class Contact extends BaseEntity {
  @property({
    type: "string",
  })
  name: string;

  @property({
    type: "string",
  })
  email: string;

  @property({
    type: "string",
  })
  phone: string;

  @property({
    type: "string",
  })
  message: string;
  
  constructor(data?: Partial<Contact>) {
    super(data);
  }
}

export interface ContactRelations {
  // describe navigational properties here
}

export type ContactWithRelations = Contact & ContactRelations;
