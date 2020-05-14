import { IsNumber, IsEmail, IsString } from 'class-validator'
import { ReadUserDetailsDto } from './read-user-details.dto'
import { Type, Exclude, Expose } from 'class-transformer'

@Exclude()
export class ReadUserDto {
  @Expose()
  @IsNumber()
  readonly id: number

  @Expose()
  @IsString()
  readonly username: string

  @Expose()
  @IsEmail()
  readonly email: string

  @Expose()
  @Type(type => ReadUserDetailsDto)
  readonly details: ReadUserDetailsDto
}
