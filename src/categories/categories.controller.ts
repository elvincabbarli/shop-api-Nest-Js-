import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCategories() {
    return this.categoriesService.findAll();
  }

  @Post()
  createCategory(@Body(new ValidationPipe()) body: CreateCategoryDto) {
    return this.categoriesService.create(body.name.trim());
  }

  @Get(':id/products')
  async getCategoryProducts(@Param('id', ParseIntPipe) id: number) {
    const products = await this.categoriesService.findProducts(id);

    if (products === undefined) {
      throw new NotFoundException(`Kateqoriya tapılmadı: ${id}`);
    }

    return products;
  }
}
