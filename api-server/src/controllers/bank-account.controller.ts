import { authenticate } from '@loopback/authentication';
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
import {BankAccount} from '../models';
import {BankAccountRepository} from '../repositories';
import { SecurityBindings, UserProfile } from "@loopback/security";
import { inject } from '@loopback/core';

const ObjectId = require('mongodb').ObjectId
export class BankAccountController {
  constructor(
    @repository(BankAccountRepository)
    public bankAccountRepository : BankAccountRepository,
  ) {}

  @authenticate("jwt")
  @post('/bank-accounts')
  @response(200, {
    description: 'BankAccount model instance',
    content: {'application/json': {schema: getModelSchemaRef(BankAccount)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BankAccount, {
            title: 'NewBankAccount',
            exclude: ['id'],
          }),
        },
      },
    })
    bankAccount: Omit<BankAccount, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<BankAccount> {
    return this.bankAccountRepository.create({
      ...bankAccount,
      createdAt: new Date(),
      createdById: new ObjectId(currentUserProfile.id),
      updatedById: new ObjectId(currentUserProfile.id),
    });
  }

  @get('/bank-accounts/count')
  @response(200, {
    description: 'BankAccount model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(BankAccount) where?: Where<BankAccount>,
  ): Promise<Count> {
    return this.bankAccountRepository.count(where);
  }

  @get('/bank-accounts')
  @response(200, {
    description: 'Array of BankAccount model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(BankAccount, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(BankAccount) filter?: Filter<BankAccount>,
  ): Promise<BankAccount[]> {
    return this.bankAccountRepository.find(filter);
  }

  @patch('/bank-accounts')
  @response(200, {
    description: 'BankAccount PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BankAccount, {partial: true}),
        },
      },
    })
    bankAccount: BankAccount,
    @param.where(BankAccount) where?: Where<BankAccount>,
  ): Promise<Count> {
    return this.bankAccountRepository.updateAll(bankAccount, where);
  }

  @get('/bank-accounts/{id}')
  @response(200, {
    description: 'BankAccount model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(BankAccount, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(BankAccount, {exclude: 'where'}) filter?: FilterExcludingWhere<BankAccount>
  ): Promise<BankAccount> {
    return this.bankAccountRepository.findById(id, filter);
  }

  @patch('/bank-accounts/{id}')
  @response(204, {
    description: 'BankAccount PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BankAccount, {partial: true}),
        },
      },
    })
    bankAccount: BankAccount,
  ): Promise<void> {
    await this.bankAccountRepository.updateById(id, bankAccount);
  }

  @put('/bank-accounts/{id}')
  @response(204, {
    description: 'BankAccount PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() bankAccount: BankAccount,
  ): Promise<void> {
    await this.bankAccountRepository.replaceById(id, bankAccount);
  }

  @del('/bank-accounts/{id}')
  @response(204, {
    description: 'BankAccount DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.bankAccountRepository.deleteById(id);
  }
}
