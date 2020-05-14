import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { RoleService } from './role.service'
import { Role } from './role.entity'

@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get()
  async getRoles(): Promise<Role[]> {
    const roles = await this._roleService.getAll()
    return roles
  }

  @Post()
  async createRole(@Body() role: Role): Promise<Role> {
    const createdRole = await this._roleService.create(role)
    return createdRole
  }

  @Get(':id')
  async getRole(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    const role = await this._roleService.get(id)
    return role
  }

  @Patch(':id')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: Role,
  ): Promise<boolean> {
    await this._roleService.update(id, role)
    return true
  }

  @Delete(':id')
  async deleteRole(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    await this._roleService.delete(id)
    return true
  }
}
