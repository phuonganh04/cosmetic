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
import {Organization} from '../models';
import {OrganizationRepository} from '../repositories';
import { SecurityBindings, UserProfile } from "@loopback/security";

const ObjectId = require('mongodb').ObjectId
export class OrganizationController {
  constructor(
    @repository(OrganizationRepository)
    public organizationRepository : OrganizationRepository,
  ) {}

  @authenticate("jwt")
  @post('/organizations')
  @response(200, {
    description: 'Organization model instance',
    content: {'application/json': {schema: getModelSchemaRef(Organization)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Organization, {
            title: 'NewOrganization',
            exclude: ['id'],
          }),
        },
      },
    })
    organization: Omit<Organization, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Organization> {
    return this.organizationRepository.create({
      ...organization, 
      createdAt: new Date(),
      createdById: new ObjectId(currentUserProfile.id),
      updatedById: new ObjectId(currentUserProfile.id),
    });
  }

  @get('/organizations/count')
  @response(200, {
    description: 'Organization model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Organization) where?: Where<Organization>,
  ): Promise<Count> {
    return this.organizationRepository.count(where);
  }

  @get('/organizations')
  @response(200, {
    description: 'Array of Organization model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Organization, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Organization) filter?: Filter<Organization>,
  ): Promise<Organization[]> {
    return this.organizationRepository.find(filter);
  }

  @patch('/organizations')
  @response(200, {
    description: 'Organization PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Organization, {partial: true}),
        },
      },
    })
    organization: Organization,
    @param.where(Organization) where?: Where<Organization>,
  ): Promise<Count> {
    return this.organizationRepository.updateAll(organization, where);
  }

  @get('/organizations/{id}')
  @response(200, {
    description: 'Organization model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Organization, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Organization, {exclude: 'where'}) filter?: FilterExcludingWhere<Organization>
  ): Promise<Organization> {
    return this.organizationRepository.findById(id, filter);
  }

  @patch('/organizations/{id}')
  @response(204, {
    description: 'Organization PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Organization, {partial: true}),
        },
      },
    })
    organization: Organization,
  ): Promise<void> {
    await this.organizationRepository.updateById(id, organization);
  }

  @put('/organizations/{id}')
  @response(204, {
    description: 'Organization PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() organization: Organization,
  ): Promise<void> {
    await this.organizationRepository.replaceById(id, organization);
  }

  @del('/organizations/{id}')
  @response(204, {
    description: 'Organization DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.organizationRepository.deleteById(id);
  }
}
