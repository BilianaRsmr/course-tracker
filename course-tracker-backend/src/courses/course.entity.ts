import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  platform: string;

  @Column()
  duration: number;

  @Column()
  completed: boolean;

  @ManyToOne(() => User, user => user.courses, { onDelete: 'CASCADE' })
  user: User;
}
