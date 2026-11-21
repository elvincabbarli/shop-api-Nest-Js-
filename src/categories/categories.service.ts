import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      productCount: category._count.products,
    }));
  }

  async create(name: string) {
    const category = await this.prisma.category.create({
      data: { name },
    });

    return {
      id: category.id,
      name: category.name,
    };
  }

  async findProducts(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        products: {
          orderBy: { id: 'asc' },
        },
      },
    });

    if (category === null) {
      return undefined;
    }

    return category.products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price.toNumber(),
      stock: product.stock,
      categoryId: product.categoryId,
    }));
  }
}
