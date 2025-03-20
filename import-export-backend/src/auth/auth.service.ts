// src/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/model/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  // Xác thực người dùng khi đăng nhập
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // Không tìm thấy người dùng
    }

    // So sánh mật khẩu (đơn giản, không an toàn)
    if (user.password !== password) {
      throw new UnauthorizedException('Invalid credentials'); // Mật khẩu không đúng
    }

    return user; // Trả về người dùng nếu xác thực thành công
  }

  // Tạo JWT cho người dùng
  async login(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id }; // Tạo payload cho JWT
    return {
      access_token: this.jwtService.sign(payload), // Tạo JWT
    };
  }
}
