import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL as string),
    MatchModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
