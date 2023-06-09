import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async register(dto: RegisterDto) {
    const {
      age,
      calorie_goal,
      gender,
      height_cm,
      password,
      username,
      weight_kg,
    } = dto;

    try {
      let user = await this.prismaService.user.create({
        data: {
          age,
          calorie_goal,
          gender,
          height_cm,
          password,
          username,
          weight_kg,
        },
      });

      return this.validate(user.id);
    } catch (e) {
      throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST);
    }
  }

  async login(dto: LoginDto) {
    const { password, username } = dto;
    try {
      let user = await this.prismaService.user.findFirstOrThrow({
        where: {
          AND: [
            {
              password,
            },
            {
              username,
            },
          ],
        },
      });

      return this.validate(user.id);
    } catch (e) {
      throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST);
    }
  }

  private async validate(id: number) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
}
