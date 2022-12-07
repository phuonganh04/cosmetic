import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import { CategoryRepository } from '.';
import {CosmeticDataSource} from '../datasources';
import {Category, Product, ProductRelations} from '../models';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {
  public readonly category: BelongsToAccessor<
    Category,
    typeof Product.prototype.id
  >;
  
  constructor(
    @inject('datasources.cosmetic') dataSource: CosmeticDataSource,
    @repository.getter('CategoryRepository')
    categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Product, dataSource);

    this.category = this.createBelongsToAccessorFor(
      'category',
      categoryRepositoryGetter,
    );
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
