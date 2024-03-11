import { Body, Controller, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { SignInCredentialDto } from './dto/signin-credential.dto';

@Controller({
  version: '1',
  path: 'api/v1/auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() signinCredentialDto: SignInCredentialDto,
  ): Promise<{ accessToken: string; id: Types.ObjectId; email: string }> {
    return this.authService.signIn(signinCredentialDto);
  }
}
