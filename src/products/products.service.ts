import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const products = await this.prisma.products.findMany({
      orderBy: { id: 'asc' },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price.toNumber(),
      stock: product.stock,
    }));
  }

  async count() {
    return this.prisma.products.count();
  }

  async featuredProduct() {
    const product = await this.prisma.products.findFirst({
      orderBy: { id: 'asc' },
    });

    if (product === null) {
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price.toNumber(),
      stock: product.stock,
    };
  }

  async getSummary() {
    const result = await this.prisma.products.aggregate({
      _count: { _all: true },
      _sum: { price: true },
      _avg: { price: true },
    });

    return {
      count: result._count._all,
      totalPrice: result._sum.price?.toNumber() ?? 0,
      averagePrice: result._avg.price?.toNumber() ?? 0,
    };
  }

  async findById(id: number) {
    const product = await this.prisma.products.findUnique({
      where: { id },
    });

    if (product === null) {
      return undefined;
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price.toNumber(),
      stock: product.stock,
    };
  }

  async findByMaxPrice(maxPrice: number) {
    const products = await this.prisma.products.findMany({
      where: {
        price: {
          lte: maxPrice,
        },
      },
      orderBy: { id: 'asc' },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price.toNumber(),
      stock: product.stock,
    }));
  }

  async create(name: string, price: number, stock: number) {
    const product = await this.prisma.products.create({
      data: {
        name,
        price,
        stock,
      },
    });

    return {
      id: product.id,
      name: product.name,
      price: product.price.toNumber(),
      stock: product.stock,
    };
  }

  async update(id: number, data: { price?: number; stock?: number }) {
    try {
      const product = await this.prisma.products.update({
        where: { id },
        data,
      });

      return {
        id: product.id,
        name: product.name,
        price: product.price.toNumber(),
        stock: product.stock,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return undefined;
      }

      throw error;
    }
  }
  async remove(id: number) {
    try {
      const product = await this.prisma.products.delete({
        where: { id },
      });

      return {
        id: product.id,
        name: product.name,
        price: product.price.toNumber(),
        stock: product.stock,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return undefined;
      }

      throw error;
    }
  }
}
