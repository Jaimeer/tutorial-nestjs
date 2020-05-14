import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthRepository } from './auth.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { SignupDto, SigninDto } from './dto'
import { compare } from 'bcryptjs'
import { IJwtPayload } from './interfaces/jwt-payload.interface'
import { RoleType } from '../role/roletype.enum'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _autRepository: AuthRepository,
    private readonly _jwtService: JwtService,
  ) {}

  async singup(signupDto: SignupDto): Promise<void> {
    const { username, email } = signupDto
    const userExists = await this._autRepository.findOne({
      where: [{ username }, { email }],
    })
    if (userExists)
      throw new ConflictException('username or email already exists')

    return this._autRepository.signup(signupDto)
  }

  async singin(signinDto: SigninDto): Promise<{ token: string }> {
    const { username, password } = signinDto

    const user = await this._autRepository.findOne({ where: { username } })
    if (!user) throw new NotFoundException('username does not exists')

    const isMatch = await compare(password, user.password)
    if (!isMatch) throw new UnauthorizedException('invalid credentials')

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map(r => r.name as RoleType),
    }

    const token = await this._jwtService.sign(payload)
    return { token }
  }
}
