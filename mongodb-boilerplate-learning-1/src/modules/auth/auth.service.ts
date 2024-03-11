import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { User } from './schemas/user.schema';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { SignInCredentialDto } from './dto/signin-credential.dto';
import { JWTPayload } from './models/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
    const { password } = authCredentialsDto;
    const user = new this.userModel(authCredentialsDto);
    let salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);

    try {
      await user.save();
    } catch (error) {
      //   console.error(error, 'error occured', Object.keys(error), error.code);
      if (error.code === 11000) {
        throw new ConflictException('Email Already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    signinCredential: SignInCredentialDto,
  ): Promise<{ accessToken: string; id: Types.ObjectId; email: string }> {
    const { email, password } = signinCredential;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credential');
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credential');
    }

    
    const payload: JWTPayload = { email };
    const accessToken =  this.jwtService.sign(payload);
    console.log(passwordMatches)

    return { accessToken, id: user._id, email };
  }
}
