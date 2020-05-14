import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './user.entity'
import { AuthGuard } from '@nestjs/passport'

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(AuthGuard())
  @Get()
  async getUsers(): Promise<User[]> {
    const users = await this._userService.getAll()
    return users
  }

  @Post()
  async createUser(@Body() user: User): Promise<User> {
    const createdUser = await this._userService.create(user)
    return createdUser
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this._userService.get(id)
    return user
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<boolean> {
    await this._userService.update(id, user)
    return true
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    await this._userService.delete(id)
    return true
  }
}