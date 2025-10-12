import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  getAll() {
    return this.prisma.user.findMany();
  }

  getOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      // data: {
      //   name: createUserDto.name,
      //   email: createUserDto.email,
      //   password: createUserDto.password,
      // },
      data: createUserDto,
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
