import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Controller('products')
export class ProductsController {
  private productsService: ProductsService;

  constructor(productsService: ProductsService) {
    this.productsService = productsService;
  }

  @Get('info')
  getInfo() {
    return {
      description: 'Mağazanın məhsul kataloqu',
      currency: 'AZN',
    };
  }

  @Get('status')
  getStatus() {
    return {
      status: 'active',
      available: true,
    };
  }

  @Get('featured')
  getFeaturedProduct() {
    return this.productsService.featuredProduct();
  }

  @Get('count')
  async getCount() {
    const count = await this.productsService.count();

    return { count };
  }

  @Get('summary')
  getSummary() {
    return this.productsService.getSummary();
  }

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findById(id);

    if (product === undefined) {
      throw new NotFoundException({
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
        message: `Məhsul tapılmadı: ${id}`,
      });
    }

    return product;
  }

  @Get()
  listProducts(@Query('maxPrice') maxPrice?: string) {
    if (maxPrice === undefined) {
      return this.productsService.findAll();
    }

    if (typeof maxPrice !== 'string' || maxPrice.trim() === '') {
      throw new BadRequestException('maxPrice mənfi olmayan ədəd olmalıdır.');
    }

    const priceLimit = Number(maxPrice);

    if (!Number.isFinite(priceLimit) || priceLimit < 0) {
      throw new BadRequestException('maxPrice mənfi olmayan ədəd olmalıdır.');
    }

    return this.productsService.findByMaxPrice(priceLimit);
  }

  @Post()
  createProduct(@Body(new ValidationPipe()) body: CreateProductDto) {
    const name = body?.name;
    const price = body?.price;
    const stock = body?.stock;

    if (typeof name !== 'string' || name.trim() === '') {
      throw new BadRequestException('Məhsulun adı boş ola bilməz.');
    }

    if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
      throw new BadRequestException('Qiymət mənfi olmayan ədəd olmalıdır.');
    }

    return this.productsService.create(name.trim(), price, stock);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) body: UpdateProductDto,
  ) {
    const data: { price?: number; stock?: number } = {};

    if (body.price !== undefined) data.price = body.price;
    if (body.stock !== undefined) data.stock = body.stock;

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('Qiymət və ya stok göndərilməlidir.');
    }

    const product = await this.productsService.update(id, data);

    if (product === undefined) {
      throw new NotFoundException(`Məhsul tapılmadı: ${id}`);
    }

    return product;
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.remove(id);

    if (product === undefined) {
      throw new NotFoundException({
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
        message: `Məhsul tapılmadı: ${id}`,
      });
    }

    return product;
  }
}
