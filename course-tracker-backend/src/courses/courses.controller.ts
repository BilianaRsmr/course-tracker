import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Delete,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './course.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getAll(@Request() req): Promise<Course[]> {
    return await this.coursesService.findAllForUser(req.user.userId);
  }

  @Get('completed')
  async getCompleted(@Request() req): Promise<Course[]> {
    return await this.coursesService.findCompletedForUser(req.user.userId);
  }

  @Get('platform')
  async getByPlatform(
    @Query('platform') platform: string,
    @Request() req,
  ): Promise<Course[]> {
    return await this.coursesService.findByPlatformForUser(platform, req.user.userId);
  }

  @Post()
  async createCourse(@Body() course: Partial<Course>, @Request() req): Promise<Course> {
    return await this.coursesService.create(course, req.user.userId);
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: number, @Request() req): Promise<void> {
    return await this.coursesService.delete(+id, req.user.userId);
  }

  @Patch(':id')
  async updateCourse(
    @Param('id') id: number,
    @Body() updateData: Partial<Course>,
    @Request() req,
  ): Promise<Course> {
    return await this.coursesService.update(+id, updateData, req.user.userId);
  }
}
