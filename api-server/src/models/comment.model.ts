import { belongsTo, model, property } from '@loopback/repository';
import { BaseEntity } from "./base";
import { User, UserWithRelations } from "./user.model";

@model()
export class Comment extends BaseEntity {
  @property({
    type: 'string',
  })
  content?: string;

  @belongsTo(() => User)
  createdById: string;

  @belongsTo(() => User)
  updatedById: string;

  @property({
    type: 'string',
    mongodb: {dataType: 'ObjectID'},
  })
  belongToId: string;

  @property({
    type: 'string',
    mongodb: {dataType: 'ObjectID'},
  })
  replyToId: string;

  @property({
    type: 'string',
  })
  title?: string;

  constructor(data?: Partial<Comment>) {
    super(data);
  }
}

export interface CommentRelations {
  createdBy?: UserWithRelations,
  updatedBy?: UserWithRelations
}

export type CommentWithRelations = Comment & CommentRelations;
