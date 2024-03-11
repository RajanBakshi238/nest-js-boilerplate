import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { User, UserSchema } from "./schemas/user.schema";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema }]),
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            secret: `${process.env.JWT_SECRET}`,
            signOptions: {
                expiresIn: process.env.JWT_EXPIRE ?? "7d"
            }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [JwtStrategy, PassportModule]
})

export class AuthModule {}