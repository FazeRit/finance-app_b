import { Injectable, BadRequestException } from '@nestjs/common';
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
    if (!id && !email)
      throw new BadRequestException(
        'Please provide either id or email to search for a user.',
      );

    const uniqueQuery = id ? { id } : { email };

    const user = await this.prismaService.user.findUnique({
      where: uniqueQuery,
    });

    if (!user) throw new UserNotFoundException();

    return user;
  }
}
