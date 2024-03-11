import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User } from './schemas/user.schema';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
    const { password } = authCredentialsDto;
    const user = new this.userModel(authCredentialsDto);
    let salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);

    try {
      await user.save();
    } catch (error) {
      console.error(error, 'error occured');
      if (error.code === '23505') {
        throw new ConflictException('Email Already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
