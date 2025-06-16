import {
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/users.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async onModuleInit() {
    await this.seedUsersFromEnv();
  }

  private async seedUsersFromEnv() {
    const userSeeds = [
      { key: 'ADMIN', role: 'admin' },
      { key: 'ANDREI', role: 'user' },
      { key: 'ELENA', role: 'user' },
    ];

    const users = userSeeds
      .map(seed => ({
        username: this.configService.get<string>(`${seed.key}_USERNAME`) || '',
        password: this.configService.get<string>(`${seed.key}_PASSWORD`) || '',
        role: seed.role as UserRole,
      }))
      .filter(user => user.username && user.password); // ignoră incomplete

    for (const u of users) {
      const exists = await this.usersService.findByUsername(u.username);
      if (!exists) {
        const hashed = await bcrypt.hash(u.password, 10);
        await this.usersService.create({
          username: u.username,
          password: hashed,
          role: u.role,
        });
        console.log(`✅ Created user '${u.username}'`);
      }
    }
  }

  async register(username: string, password: string) {
    const exists = await this.usersService.findByUsername(username);
    if (exists) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.create({
      username,
      password: hashedPassword,
      role: 'user',
    });

    return { message: 'User registered successfully' };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async deleteUserById(id: number): Promise<{ message: string }> {
    await this.usersService.deleteById(id);
    return { message: 'User deleted successfully' };
  }

  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
