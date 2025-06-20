import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/Users';

@Controller('user')
export class UserController {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  @Get()
  async getAllUsers() {
    return await this.userModel.findAll();
  }

  @Post()
  async createUser(@Body() data: Partial<User>) {
    return await this.userModel.create(data);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() data: Partial<User>) {
    return await this.userModel.update(data, { where: { id } });
  }
  // Add this in user.controller.ts
  @Put('by-email/:email')
  async updateUserByEmail(@Param('email') email: string, @Body() data: Partial<User>) {
    return await this.userModel.update(data, {
      where: { email }
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return await this.userModel.destroy({ where: { id } });
  }
}
