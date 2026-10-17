import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/create")
  createUser(@Body() body:CreateUserDto) {
    return this.userService.createUser(body);

  }
}
