import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { User, UserSchema } from '../app.schema';
import { UserAttacked, UserAttackedSchema } from '../user/user.schema';
import { PhishingService } from './phishing.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UpdateAttackStatusQueries } from './phishing.query';
import { EmailContext } from './phishing.content';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // חשוב מאוד!
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          pool: true,
          host: configService.get<string>('MAIL_HOST'),
          port: Number(configService.get<string>('MAIL_PORT')),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"Phishing Simulation" <${configService.get<string>('MAIL_USER')}>`,
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserAttacked.name, schema: UserAttackedSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          /** Token expiration time loaded from environment configuration. */
          expiresIn: `${configService.get<string>('TOKEN_EXPIRES')}`,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: 'UpdateAttackStatusQueries',
      useValue: UpdateAttackStatusQueries,
    },
    {
      provide: 'EmailContext',
      useValue: EmailContext,
    },
    PhishingService,
    JwtAuthGuard,
  ],
  exports: [PhishingService, JwtAuthGuard, JwtModule],
})
export class PhishingModule {}
