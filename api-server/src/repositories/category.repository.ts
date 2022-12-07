import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
import { CosmeticDataSource } from '../datasources';
import { Category, CategoryRelations } from '../models';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {
  public readonly parent: BelongsToAccessor<Category, typeof Category.prototype.id>
  
  constructor(
    @inject('datasources.cosmetic') dataSource: CosmeticDataSource,
  ) {
    super(Category, dataSource);
    this.parent = this.createBelongsToAccessorFor('parent', Getter.fromValue(this));
    this.registerInclusionResolver('parent', this.parent.inclusionResolver);
  }

  getCollectionOf(modelName: string): any {
    return ((this as any).dataSource.connector as any).collection(modelName)
  }
}
