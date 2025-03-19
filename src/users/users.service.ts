import { Injectable, ConsoleLogger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, GetUserDto } from './dto';
import {
  UserAlreadyExistsException,
  UserCreationFailedException,
  UserNotFoundException,
} from '../utils/exceptions';

@Injectable()
export class UsersService {
  private readonly logger = new ConsoleLogger(UsersService.name);

  constructor(private prismaService: PrismaService) {}

  async createUser({ email, hashedPassword }: CreateUserDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (user) {
        this.logger.warn(`User with email ${email} already exists`);
        throw new UserAlreadyExistsException();
      }

      const createdUser = await this.prismaService.user.create({
        data: {
          email,
          hashedPassword,
        },
      });

      if (!createdUser) {
        this.logger.error(`User creation failed for email ${email}`);
        throw new UserCreationFailedException();
      }

      return createdUser;
    } catch (error) {
      this.logger.error(
        `Failed to create user with email ${email}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getUser({ id, email }: GetUserDto) {
    if (!id && !email) {
      this.logger.error('No ID or email provided for user lookup');
      throw new UserNotFoundException();
    }

    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          OR: [id ? { id } : undefined, email ? { email } : undefined].filter(
            Boolean,
          ),
        },
      });

      if (!user) {
        this.logger.warn(`User not found for ID ${id} or email ${email}`);
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Failed to fetch user with ID ${id} or email ${email}: ${error.message}`,
        error.stack,
      );
      throw new UserNotFoundException();
    }
  }
}
