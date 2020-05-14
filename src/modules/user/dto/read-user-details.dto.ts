import { IsString } from 'class-validator'
import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class ReadUserDetailsDto {
  @Expose()
  @IsString()
  readonly name: string

  @Expose()
  @IsString()
  readonly lastName: string
}
