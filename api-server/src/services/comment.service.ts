import { BindingScope, injectable } from '@loopback/core';
import { Filter, repository } from "@loopback/repository";
import { Comment } from "../models";
import { CommentRepository } from "../repositories";

@injectable({scope: BindingScope.TRANSIENT})
export class CommentService {
  constructor(
    @repository(CommentRepository)
    public commentRepository: CommentRepository
  ) {}

  async find(filter: Filter<Comment>): Promise<any> {
    const data = await this.commentRepository.find(filter)
    return {
      total: data?.length || 0,
      data: this.recursiveComments(data)
    }
  }

  recursiveComments = (comments: any[]) => {
    if (!comments.length) {
      return []
    }
    comments = comments.map((item) =>
      item.toObject()
    );
    comments = comments.map((item) => {
      let parentComment = null;
      if (item?.replyToId) {
        parentComment = comments.find(
          (findItem) =>
            findItem.id.toString() ===
            item?.replyToId.toString()
        );
      }
      if (parentComment) {
        if (!parentComment.reply) {
          parentComment.reply = [];
        }
        parentComment.reply.push(item);
      }
      return item;
    }).filter((item) => !item.replyToId);
    return comments
  }
}
