import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { User } from '../users/users.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async findAllForUser(userId: number): Promise<Course[]> {
    return this.courseRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findCompletedForUser(userId: number): Promise<Course[]> {
    return this.courseRepository.find({
      where: { user: { id: userId }, completed: true },
      relations: ['user'],
    });
  }

  async findByPlatformForUser(platform: string, userId: number): Promise<Course[]> {
    return this.courseRepository.find({
      where: { platform, user: { id: userId } },
      relations: ['user'],
    });
  }

  async create(courseData: Partial<Course>, userId: number): Promise<Course> {
    const course = this.courseRepository.create({
      ...courseData,
      user: { id: userId },
    });
    return this.courseRepository.save(course);
  }

  async delete(id: number, userId: number): Promise<void> {
    const course = await this.courseRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
    if (!course) throw new NotFoundException('Course not found');
    await this.courseRepository.remove(course);
  }

  async update(id: number, updatedData: Partial<Course>, userId: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
    if (!course) throw new NotFoundException('Course not found');

    Object.assign(course, updatedData);
    return this.courseRepository.save(course);
  }
}
