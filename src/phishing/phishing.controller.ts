import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { PhishingDto } from '../dto/dto.schema';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller('phishing')
export class PhishingController {
  constructor(private readonly usersService: PhishingService) {}

  @Post('send')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async sendPhishingAttempt(@Body() body: PhishingDto) {
    await this.usersService.sendPhishingEmail(body);
    return { message: 'Phishing email sent' };
  }

  @Get('track')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async trackPhishingClick(@Query('attackId') attackId: string) {
    await this.usersService.updateAttackStatus(attackId);
    return { message: 'Status updated' };
  }

  @Get('table')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async tablePhishingClick() {
    return await this.usersService.tableAttackStatus();
  }
}
