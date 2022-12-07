import { BaseEntity } from '.';
import { belongsTo, model, property } from '@loopback/repository';

@model({
  settings: {
    strict: false,
    indexes: {
      nameSearchIndex: {
        keys: { name: 1 }
      },
      codeSearchIndex: {
        keys: { code: 1 }
      },
      descriptionSearchIndex: {
        keys: { description: 1 }
      },
      locationSearchTextIndex: {
        keys: { name: 'text', code: 'text', description: "text" }
      }
    }
  }
})
export class Location extends BaseEntity {
  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  type: string;

  @property({
    type: 'string',
  })
  description: string;

  @property({
    type: 'object',
  })
  info: any;

  static TYPE = {
    STATE: "STATE",
    DISTRICT: "DISTRICT",
    SUB_DISTRICT: "SUB_DISTRICT"
  }

  @belongsTo(() => Location)
  parentId: string;

  constructor(data?: Partial<Location>) {
    super(data);
  }
}

export interface LocationRelations {
  // describe navigational properties here
  parent?: LocationWithRelations
}

export type LocationWithRelations = Location & LocationRelations;
