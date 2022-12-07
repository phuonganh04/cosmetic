import { UserCredentialsRepository, UserServiceBindings } from '@loopback/authentication-jwt';
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, HasOneRepositoryFactory, repository } from '@loopback/repository';
import { CosmeticDataSource } from '../datasources';
import { Location, User, UserCredentials, UserRelations } from '../models';
import { LocationRepository } from './location.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;
  public readonly country: BelongsToAccessor<Location, typeof User.prototype.id>
  public readonly state: BelongsToAccessor<Location, typeof User.prototype.id>
  public readonly district: BelongsToAccessor<Location, typeof User.prototype.id>
  public readonly subDistrict: BelongsToAccessor<Location, typeof User.prototype.id>

  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`) dataSource: CosmeticDataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('LocationRepository')
    protected locationRepositoryGetter: Getter<LocationRepository>,
  ) {
    super(User, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver,
    );
    this.country = this.createBelongsToAccessorFor('country', locationRepositoryGetter);
    this.registerInclusionResolver('country', this.country.inclusionResolver);
    this.state = this.createBelongsToAccessorFor('state', locationRepositoryGetter);
    this.registerInclusionResolver('state', this.state.inclusionResolver);
    this.district = this.createBelongsToAccessorFor('district', locationRepositoryGetter);
    this.registerInclusionResolver('district', this.district.inclusionResolver);
    this.subDistrict = this.createBelongsToAccessorFor('subDistrict', locationRepositoryGetter);
    this.registerInclusionResolver('subDistrict', this.subDistrict.inclusionResolver);
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    return this.userCredentials(userId)
      .get()
      .catch(err => {
        if (err.code === 'ENTITY_NOT_FOUND') return undefined;
        throw err;
      });
  }
}
