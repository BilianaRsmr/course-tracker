import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { CoursesModule } from '../courses/courses.module';
import { AuthModule} from 'src/auth/auth.module';
@Module({
  imports: [UsersModule, CoursesModule, AuthModule],
  controllers: [AdminController],
})
export class AdminModule {}
