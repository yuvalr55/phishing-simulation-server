import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { PhishingDto } from '../dto/dto.schema';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { Response } from 'express';
import { AppLogger } from '../app.logger';
import * as process from 'node:process';

@Controller('phishing')
export class PhishingController {
  constructor(
    private readonly usersService: PhishingService,
    private readonly logger: AppLogger,
  ) {}

  @Post('send')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async sendPhishingAttempt(@Body() body: PhishingDto) {
    await this.usersService.sendPhishingEmail(body);
    return { message: 'Phishing email sent' };
  }

  @Get('track')
  @HttpCode(302)
  async trackPhishingClick(
    @Query('attackId') attackId: string,
    @Res() res: Response,
  ) {
    try {
      await this.usersService.updateAttackStatus(attackId);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error('Failed to update attack status', err.message);
      } else {
        this.logger.error('Failed to update attack status', String(err));
      }
    }
    return res.redirect(process.env.REDIRECT || 'https://www.google.com');
  }

  @Get('table')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async tablePhishingClick() {
    return await this.usersService.tableAttackStatus();
  }
}
