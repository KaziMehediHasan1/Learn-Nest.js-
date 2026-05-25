import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('this mail already exists!');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        profile: {
          create: {
            address: null,
            phoneNumber: null,
          },
        },
      },
    });

    return {
      message: 'User created successfully',
      ...newUser,
    };
  }

  async findAll() {
    const result = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          select: { phoneNumber: true, address: true },
        },
      },
    });
    const total = result.length;
    return { result, total, message: 'All Users Fetch Successfully' };
  }

  async findOne(id: string) {
    const result = await this.prisma.user.findUnique({
      where: { id },
    });
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { phoneNumber, address, ...userData } = updateUserDto;
    const updateUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...userData,

        profile: {
          update: {
            ...(phoneNumber !== undefined && { phoneNumber }),
            ...(address !== undefined && { address }),
          },
        },
      },
      include: {
        profile: {
          select: {
            phoneNumber: true,
            address: true,
          },
        },
      },
    });

    return updateUser;
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
