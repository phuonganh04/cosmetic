import { authenticate } from '@loopback/authentication';
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
import { Category } from '../models';
import { CategoryRepository } from '../repositories';
import { SecurityBindings, UserProfile } from '@loopback/security';

const ObjectId = require('mongodb').ObjectId

export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) { }

  @authenticate("jwt")
  @post('/categories')
  @response(200, {
    description: 'Category model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Category) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    postData: Omit<Category, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Category> {
    const category = await this.categoryRepository.create({
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: currentUserProfile.id,
      updatedById: currentUserProfile.id
    });
    const { parentId } = postData;
    await this.categoryRepository.getCollectionOf(Category.modelName).updateMany(
      { _id: new ObjectId(parentId) }, 
      { $push: { childrenIds: category.id.toString() } }
    )
    
    return this.categoryRepository.findById(category.id)
  }

  @get('/categories/count')
  @response(200, {
    description: 'Category model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {
    return this.categoryRepository.count(where);
  }

  @get('/categories')
  @response(200, {
    description: 'Array of Category model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Category, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Category) filter?: Filter<Category>,
  ): Promise<Category[]> {
    return this.categoryRepository.find(filter);
  }

  @get('/categories/public')
  @response(200, {
    description: 'Array of Category model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Category, { includeRelations: true }),
        },
      },
    },
  })
  async findPublic(
    @param.filter(Category) filter?: Filter<Category>,
  ): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      ...filter,
      where: {
        ...filter?.where || {},
        parentId: undefined
      }
    })
    return categories
  }

  @patch('/categories')
  @response(200, {
    description: 'Category PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, { partial: true }),
        },
      },
    })
    category: Category,
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {
    return this.categoryRepository.updateAll(category, where);
  }

  @get('/categories/{id}/public')
  @response(200, {
    description: 'Category model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Category, { includeRelations: true }),
      },
    },
  })
  async findByIdPublic(
    @param.path.string('id') id: string,
    @param.filter(Category, { exclude: 'where' }) filter?: FilterExcludingWhere<Category>
  ): Promise<Category> {
    const data = await this.categoryRepository.findById(id, filter)
    return data;
  }

  @get('/categories/{id}')
  @response(200, {
    description: 'Category model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Category, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Category, { exclude: 'where' }) filter?: FilterExcludingWhere<Category>
  ): Promise<Category> {
    return this.categoryRepository.findById(id, filter);
  }

  @patch('/categories/{id}')
  @response(204, {
    description: 'Category PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, { partial: true }),
        },
      },
    })
    category: Category,
  ): Promise<void> {
    await this.categoryRepository.updateById(id, category);
  }

  @authenticate("jwt")
  @put('/categories/{id}')
  @response(204, {
    description: 'Category PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() postData: Category,
  ): Promise<void> {
    const oldCategory = await this.categoryRepository.findById(id)
    await this.categoryRepository.replaceById(id, postData);

    if (oldCategory?.parentId !== postData?.parentId) {
      if (postData?.parentId) {
        await this.categoryRepository.getCollectionOf(Category.modelName).updateMany(
          { _id: new ObjectId(postData.parentId) }, 
          { $push: { childrenIds: id } }
        )
      }

      if (oldCategory?.parentId) {
        await this.categoryRepository.getCollectionOf(Category.modelName).updateMany(
          { _id: new ObjectId(oldCategory.parentId) }, 
          { $pull: { childrenIds: id } }
        )
      }
    }
  }

  @del('/categories/{id}')
  @response(204, {
    description: 'Category DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.categoryRepository.deleteById(id);
  }
}
