import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly userApiService: AppService) { }

  @Get()
  getHello() {
    return this.userApiService.getHello();
  }
}
