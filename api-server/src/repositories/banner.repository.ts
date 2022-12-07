import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CosmeticDataSource} from '../datasources';
import { Banner, BannerRelations } from '../models/banner.model';

export class BannerRepository extends DefaultCrudRepository<
  Banner,
  typeof Banner.prototype.id,
  BannerRelations
> {
  constructor(
    @inject('datasources.cosmetic') dataSource: CosmeticDataSource,
  ) {
    super(Banner, dataSource);
  }
}