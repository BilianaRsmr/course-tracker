import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { CoursesService } from '../courses/courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/users.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly coursesService: CoursesService,
  ) {}

  @Get('users')
  async getAllUsersWithCourses(@Req() req: Request) {
    const requester = (req as any).user as User;
    if (requester.role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }

    const users = await this.authService.findAll();

    const result = await Promise.all(
      users.map(async (user) => ({
        id: user.id,
        username: user.username,
        role: user.role,
        courses: await this.coursesService.findAllForUser(user.id),
      })),
    );

    return result;
  }

  @Delete('users/:id')
  async deleteUser(@Req() req: Request, @Param('id') id: string) {
    const requester = (req as any).user as User;
    if (requester.role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }

    return this.authService.deleteUserById(+id);
  }
}
