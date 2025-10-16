import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-auth.dto';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    const access_token = await this.jwtSign(user.id, user.email);

    return {
      access_token,
      user,
    };
  }

  async jwtSign(id: string, email: string): Promise<string> {
    const payload = { sub: id, email };
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
