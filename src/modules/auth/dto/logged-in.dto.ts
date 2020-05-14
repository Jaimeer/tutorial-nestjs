import { IsString } from 'class-validator'
import { Exclude, Expose, Type } from 'class-transformer'
import { ReadUserDto } from 'src/modules/user/dto'

@Exclude()
export class LoggedIdDto {
  @Expose()
  @IsString()
  token: string

  @Expose()
  @Type(type => ReadUserDto)
  user: ReadUserDto
}
