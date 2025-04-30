import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PhishingController } from './phishing/phishing.controller';
import { PhishingModule } from './phishing/phishing.module';
import { UserModule } from './user/user.module';
import { AppLogger } from './app.logger';

/** Root module that bundles all application modules and configurations. */
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    PhishingModule,
  ],
  controllers: [AppController, PhishingController],
  providers: [AppService, AppLogger],
})
export class AppModule {}
