import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    try {
      return await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, 10),
        },
        select: {
          id: true,
          email: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException('Email already existis.');
      }

      throw new InternalServerErrorException('Internal server error.');
    }
  }
}
