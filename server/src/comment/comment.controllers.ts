import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment';

@Controller('products/:productId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('binh-luan')
  async createComment(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(productId, dto);
  }

  @Get('many')
  async getComments(@Param('productId', ParseIntPipe) productId: number) {
    return this.commentService.findByProduct(productId);
  }
}
