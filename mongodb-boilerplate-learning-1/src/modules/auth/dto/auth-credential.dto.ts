import { Transform } from 'class-transformer';
import {
  IsDate,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @Matches(/^(?=.*\d).{5,20}$/, {
    message: 'password too weak',
  })
  password: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dob: Date;

  @IsString()
  role: string;
}
