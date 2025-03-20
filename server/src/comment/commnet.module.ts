import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentService } from './comment.service';
import { Product } from 'src/product/entities/product.entity';
import { CommentController } from './comment.controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Product])], // Đảm bảo Comment và Product đều có mặt
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
