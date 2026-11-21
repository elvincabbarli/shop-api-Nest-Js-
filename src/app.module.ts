import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductsModule } from './products/products.module.js';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module.js';

@Module({
  imports: [ConfigModule.forRoot(), ProductsModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
