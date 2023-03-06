import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { SignUpInput } from './dto/inputs/sign-up.input';
import { AuthResponse } from './types/auth-response.type';
import { LoginInput } from './dto/inputs/login.input';
import { CryptService } from './crypt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptService: CryptService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const user = await this.usersService.create({
      ...signUpInput,
      password: this.cryptService.hash(signUpInput.password),
    });
    return {
      user,
      token: this.getJwt(user.id),
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findOne({
      email: loginInput.email,
    });
    if (!user) throw new NotFoundException('User not found');
    if (!this.cryptService.compare(loginInput.password, user.password))
      throw new BadRequestException(
        'Email and password combination is incorrect',
      );
    return {
      token: this.getJwt(user.id),
      user,
    };
  }

  renewToken(user: User): AuthResponse {
    return {
      user,
      token: this.getJwt(user.id),
    }
  }

  async validateUser(id: string) {
    const user = await this.usersService.findOne({ id });
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.active) throw new UnauthorizedException('User is not active');
    return user;
  }

  private getJwt(id: string) {
    return this.jwtService.sign({ id });
  }
}
