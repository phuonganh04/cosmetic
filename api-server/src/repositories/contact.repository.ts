import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CosmeticDataSource} from '../datasources';
import {Contact, ContactRelations} from '../models';

export class ContactRepository extends DefaultCrudRepository<
  Contact,
  typeof Contact.prototype.id,
  ContactRelations
> {
  constructor(
    @inject('datasources.cosmetic') dataSource: CosmeticDataSource,
  ) {
    super(Contact, dataSource);
  }
}
