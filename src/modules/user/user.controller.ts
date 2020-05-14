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
import { Roles } from '../role/decorators/role.decorator'
import { RoleGuard } from '../role/guards/role.guard'
import { RoleType } from '../role/roletype.enum'

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
  // @Roles(RoleType.ADMIN, RoleType.AUTHOR)
  // @UseGuards(AuthGuard(), RoleGuard)
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

  @Post('/set-role/:userId/:roleId')
  async setRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this._userService.setRoleToUser(userId, roleId)
  }
}
