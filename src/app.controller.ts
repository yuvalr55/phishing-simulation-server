import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  /** Returns a greeting message from the AppService. */
  getHello(): string {
    return this.appService.getHello();
  }
}
