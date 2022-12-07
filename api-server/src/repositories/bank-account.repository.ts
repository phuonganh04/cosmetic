import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {CosmeticDataSource} from '../datasources';
import {BankAccount, BankAccountRelations, Organization} from '../models';
import { OrganizationRepository } from './organization.repository';

export class BankAccountRepository extends DefaultCrudRepository<
  BankAccount,
  typeof BankAccount.prototype.id,
  BankAccountRelations
> {
  public readonly bank: BelongsToAccessor<Organization, typeof BankAccount.prototype.id>

  constructor(
    @inject('datasources.cosmetic') dataSource: CosmeticDataSource,
    @repository.getter('OrganizationRepository')
    protected organizationRepositoryGetter: Getter<OrganizationRepository>,
  ) {
    super(BankAccount, dataSource);
    this.bank = this.createBelongsToAccessorFor('bank', organizationRepositoryGetter);
    this.registerInclusionResolver('bank', this.bank.inclusionResolver);
  }
}
