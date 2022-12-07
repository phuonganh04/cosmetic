import { inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { SecurityBindings, UserProfile } from "@loopback/security";
import { authenticate } from '@loopback/authentication';
import { BannerRepository } from '../repositories/banner.repository';
import { Banner } from '../models/banner.model';

const ObjectId = require('mongodb').ObjectId
export class BannerController {
  constructor(
    @repository(BannerRepository)
    public bannerRepository : BannerRepository,
  ) {}

  @authenticate("jwt")
  @post('/banners')
  @response(200, {
    description: 'Banner model instance',
    content: {'application/json': {schema: getModelSchemaRef(Banner)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Banner, {
            title: 'NewBanner',
            exclude: ['id'],
          }),
        },
      },
    })
    banner: Omit<Banner, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Banner> {
    return this.bannerRepository.create({
      ...banner, 
      createdAt: new Date(),
      createdById: new ObjectId(currentUserProfile.id),
      updatedById: new ObjectId(currentUserProfile.id),
    });
  }

  @get('/banners/count')
  @response(200, {
    description: 'Banner model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Banner) where?: Where<Banner>,
  ): Promise<Count> {
    return this.bannerRepository.count(where);
  }

  @get('/banners')
  @response(200, {
    description: 'Array of Banner model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Banner, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Banner) filter?: Filter<Banner>,
  ): Promise<Banner[]> {
    return this.bannerRepository.find(filter);
  }

  @authenticate("jwt")
  @patch('/banners')
  @response(200, {
    description: 'Banner PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Banner, {partial: true}),
        },
      },
    })
    banner: Banner,
    @param.where(Banner) where?: Where<Banner>,
  ): Promise<Count> {
    return this.bannerRepository.updateAll(banner, where);
  }

  @authenticate("jwt")
  @get('/banners/{id}')
  @response(200, {
    description: 'Banner model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Banner, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Banner, { exclude: 'where' }) filter?: FilterExcludingWhere<Banner>
    ): Promise<Banner> {
      return this.bannerRepository.findById(id, filter);
    }
    @patch('/banners/{id}')
    @response(204, {
      description: 'Banner PATCH success',
    })
    async updateById(
      @param.path.string('id') id: string,
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Banner, {partial: true}),
          },
        },
      })
      banner: Banner,
    ): Promise<void> {
      await this.bannerRepository.updateById(id, banner);
    }
  
    @put('/banners/{id}')
    @response(204, {
      description: 'Banner PUT success',
    })
    async replaceById(
      @param.path.string('id') id: string,
      @requestBody() banner: Banner,
    ): Promise<void> {
      await this.bannerRepository.replaceById(id, banner);
    }
  
    @del('/banners/{id}')
    @response(204, {
      description: 'Organization DELETE success',
    })
    async deleteById(@param.path.string('id') id: string): Promise<void> {
      await this.bannerRepository.deleteById(id);
    }
  }
  