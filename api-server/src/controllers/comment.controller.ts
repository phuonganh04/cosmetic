import { Filter, FilterExcludingWhere, repository, } from '@loopback/repository';
import { del, get, getModelSchemaRef, param, post, requestBody, response, } from '@loopback/rest';
import { Comment } from '../models';
import { CommentRepository } from '../repositories';
import { authenticate } from "@loopback/authentication";
import { inject } from "@loopback/core";
import { SecurityBindings, UserProfile } from "@loopback/security";

const ObjectId = require('mongodb').ObjectId

export class CommentController {
  constructor(
    @repository(CommentRepository)
    public commentRepository : CommentRepository,
  ) {}

  @authenticate("jwt")
  @post('/comments')
  @response(200, {
    description: 'Comment model instance',
    content: {'application/json': {schema: getModelSchemaRef(Comment)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Comment, {
            title: 'NewComment',
            exclude: ['id'],
          }),
        },
      },
    })
    comment: Omit<Comment, 'id'>,
    @inject(SecurityBindings.USER)
      currentUserProfile: UserProfile,
  ): Promise<Comment> {
    return this.commentRepository.create({
      ...comment,
      createdById: new ObjectId(currentUserProfile.id),
      updatedById: new ObjectId(currentUserProfile.id),
      belongToId: new ObjectId(comment.belongToId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  @get('/comments')
  @response(200, {
    description: 'Array of Comment model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Comment, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Comment) filter?: Filter<Comment>,
  ): Promise<Comment[]> {
    return this.commentRepository.find(filter);
  }

  @get('/comments/{id}')
  @response(200, {
    description: 'Comment model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Comment, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Comment, {exclude: 'where'}) filter?: FilterExcludingWhere<Comment>
  ): Promise<Comment> {
    return this.commentRepository.findById(id, filter);
  }

  @del('/comments/{id}')
  @response(204, {
    description: 'Comment DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.commentRepository.deleteById(id);
  }
}
