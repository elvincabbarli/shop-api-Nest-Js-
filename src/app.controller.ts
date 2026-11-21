import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ProductsService } from './products/products.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('catalog-count')
  async getCatalogCount() {
    const count = await this.productsService.count();

    return { count };
  }

  @Get('catalog-summary')
  getCatalogSummary() {
    return this.productsService.getSummary();
  }

  @Get('store')
  getStore() {
    return {
      name: 'Tech Store',
      currency: 'AZN',
    };
  }
}
