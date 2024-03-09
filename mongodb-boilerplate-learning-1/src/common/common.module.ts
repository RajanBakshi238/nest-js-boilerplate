import { Module } from '@nestjs/common'          
import { ConfigModule } from '@nestjs/config' 

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      // load,
      isGlobal: true,
      envFilePath: ['.env']
    }),
    
  ],
})
export class CommonModule {}
