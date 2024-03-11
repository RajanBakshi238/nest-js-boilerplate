import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { DATABASE_CONNECTION_NAME } from './database/constants/database.constants';
import configs from 'src/configs';
import { DatabaseOptionsModule } from './database/database.options.module';
import { DatabaseOptionsService } from './database/services/database.options.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    // FIXME : commented as internals are not clear to me.

    // MongooseModule.forRootAsync({              
    //   connectionName: DATABASE_CONNECTION_NAME,
    //   imports: [DatabaseOptionsModule],
    //   inject: [DatabaseOptionsService],
    //   useFactory: async (databaseOptionsService: DatabaseOptionsService) => {
    //     return databaseOptionsService.createOptions();
    //   },
    // }),

    MongooseModule.forRoot(process.env.DATABASE),
    AuthModule
  ],
})
export class CommonModule {}
