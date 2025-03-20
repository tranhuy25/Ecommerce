import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false; // Không có header Authorization
    }

    const token = authHeader.split(' ')[1]; // Lấy token từ header

    try {
      const payload = this.jwtService.verify(token); // Xác thực token
      request.user = payload; // Gán payload cho request
      return true; // Cho phép truy cập
    } catch (error) {
      return false; // Không hợp lệ
    }
  }
}
