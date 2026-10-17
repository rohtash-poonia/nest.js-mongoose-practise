import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema.js';
import { Model } from 'mongoose';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createUser(data: CreateUserDto) {
    const newUser = await this.userModel.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role,
      age: data.age,
    });
    return newUser;
  }
}
