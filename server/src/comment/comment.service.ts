import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Product } from 'src/product/entities/product.entity';
import { CreateCommentDto } from './dto/create-comment';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(productId: number, dto: CreateCommentDto): Promise<Comment> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const comment = this.commentRepository.create({ ...dto, product });
    return this.commentRepository.save(comment);
  }

  async findByProduct(productId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { product: { id: productId } },
    });
  }
}
