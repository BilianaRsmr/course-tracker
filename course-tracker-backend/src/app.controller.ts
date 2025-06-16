import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth/auth.service'; // ajustează calea dacă este diferită
import { User } from './users/users.entity'; // dacă vrei să tipizezi rezultatul


@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.authService.findAll();
  }
}
