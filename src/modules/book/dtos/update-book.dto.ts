import { IsString, IsNotEmpty } from 'class-validator'

export class UpdateBookDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @IsString()
  readonly description: string
}
