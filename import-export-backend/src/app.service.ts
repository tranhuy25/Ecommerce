import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'CHÀO MỪNG CẤC BẠN ĐÃ ĐẾN VỚI BÀI TẬP LỚN MÔN CƠ SỞ DỮ LIỆU ';
  }
}
