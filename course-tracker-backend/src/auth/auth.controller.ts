import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.authService.register(body.username, body.password);
  }

@Post('login')
async login(@Body() body: LoginDto) {
  const user = await this.authService.validateUser(body.username, body.password);
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const token = await this.authService.login(user);
  return {
    access_token: token.access_token,
    role: user.role, 
  };
}

}
