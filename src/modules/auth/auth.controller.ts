import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { SignupDto, SigninDto, LoggedIdDto } from './dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signup(@Body() signupDto: SignupDto): Promise<void> {
    return this._authService.singup(signupDto)
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  signin(@Body() signinDto: SigninDto): Promise<LoggedIdDto> {
    return this._authService.singin(signinDto)
  }
}
