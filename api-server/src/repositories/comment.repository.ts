import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
import { CosmeticDataSource } from '../datasources';
import { Comment, CommentRelations, User } from '../models';
import { UserRepository } from "./user.repository";

export class CommentRepository extends DefaultCrudRepository<
  Comment,
  typeof Comment.prototype.id,
  CommentRelations
> {
  public readonly createdBy: BelongsToAccessor<User, typeof Comment.prototype.id>
  public readonly updatedBy: BelongsToAccessor<User, typeof Comment.prototype.id>

  constructor(
    @inject('datasources.cosmetic') dataSource: CosmeticDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Comment, dataSource);

    this.createdBy = this.createBelongsToAccessorFor('createdBy', userRepositoryGetter);
    this.registerInclusionResolver('createdBy', this.createdBy.inclusionResolver);
    this.updatedBy = this.createBelongsToAccessorFor('updatedBy', userRepositoryGetter);
    this.registerInclusionResolver('updatedBy', this.updatedBy.inclusionResolver);
  }
}
