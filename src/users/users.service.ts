import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, GetUserDto } from './dto';
import {
  UserAlreadyExistsException,
  UserCreationFailedException,
  UserNotFoundException,
} from '../utils/exceptions';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async createUser({ email, hashedPassword }: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) {
      throw new UserAlreadyExistsException();
    }

    const createdUser = await this.prismaService.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    if (!createdUser) throw new UserCreationFailedException();

    return createdUser;
  }

  async getUser({ id, email }: GetUserDto) {
    if (!id && !email) {
      throw new UserNotFoundException();
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [id ? { id } : undefined, email ? { email } : undefined].filter(
          Boolean,
        ),
      },
    });

    return user;
  }
}
