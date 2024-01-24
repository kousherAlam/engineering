import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly userApiService: AppService) { }

  @Get()
  getHello() {
    return this.userApiService.getHello();
  }


  sum(a: number, b: number) {
    return a + b;
  }

  sumWith10pVat(a: number, b: number) {
    return a + b * .1;
  }
}
