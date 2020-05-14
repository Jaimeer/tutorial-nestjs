import { Repository, EntityRepository, getConnection } from 'typeorm'
import { User } from '../user/user.entity'
import { SignupDto } from './dto'
import { UserDetails } from '../user/user.details.entity'
import { RoleRepository } from '../role/role.repository'
import { Role } from '../role/role.entity'
import { RoleType } from '../role/roletype.enum'
import { hash, genSalt } from 'bcryptjs'

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(signupDto: SignupDto) {
    const { username, email, password } = signupDto
    const user = new User()
    user.username = username
    user.email = email

    const details = new UserDetails()
    user.details = details

    const roleRepository: RoleRepository = await getConnection().getRepository(
      Role,
    )
    const defaultRole: Role = await roleRepository.findOne({
      where: { name: RoleType.GENERAL, status: 'ACTIVE' },
    })
    user.roles = [defaultRole]

    const salt = await genSalt(10)
    user.password = await hash(password, salt)

    await user.save()
  }
}
