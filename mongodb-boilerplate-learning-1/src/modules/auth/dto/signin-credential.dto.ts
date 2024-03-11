import { IsString } from "class-validator";

export class SignInCredentialDto {
    @IsString()
    email: string;

    @IsString()
    password: string
}