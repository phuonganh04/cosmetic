import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {CosmeticDataSource} from '../datasources';
import {Order, OrderRelations, User} from '../models';
import { UserRepository } from './user.repository';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {
  public readonly createdBy: BelongsToAccessor<User, typeof Order.prototype.id>
  public readonly updatedBy: BelongsToAccessor<User, typeof Order.prototype.id>
  public readonly customer: BelongsToAccessor<User, typeof Order.prototype.id>

  constructor(
    @inject('datasources.cosmetic') dataSource: CosmeticDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Order, dataSource);
    this.createdBy = this.createBelongsToAccessorFor('createdBy', userRepositoryGetter);
    this.registerInclusionResolver('createdBy', this.createdBy.inclusionResolver);
    this.updatedBy = this.createBelongsToAccessorFor('updatedBy', userRepositoryGetter);
    this.registerInclusionResolver('updatedBy', this.updatedBy.inclusionResolver);
    this.customer = this.createBelongsToAccessorFor('customer', userRepositoryGetter);
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
  }
}
