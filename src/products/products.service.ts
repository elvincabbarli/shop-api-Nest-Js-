import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number, limit: number, search?: string) {
    const where: Prisma.productsWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [products, total] = await Promise.all([
      this.prisma.products.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.products.count({ where }),
    ]);

    return {
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price.toNumber(),
        stock: product.stock,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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

async findByMaxPrice(
  maxPrice: number,
  page: number,
  limit: number,
  search?: string,
) {
  const where: Prisma.productsWhereInput = {
    price: { lte: maxPrice },
  };

  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const [products, total] = await Promise.all([
    this.prisma.products.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
    }),
    this.prisma.products.count({ where }),
  ]);

  return {
    data: products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price.toNumber(),
      stock: product.stock,
    })),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

  async create(
    name: string,
    price: number,
    stock: number,
    categoryId?: number,
  ) {
    const product = await this.prisma.products.create({
      data: {
        name,
        price,
        stock,
        ...(categoryId === undefined
          ? {}
          : { category: { connect: { id: categoryId } } }),
      },
    });

    return {
      id: product.id,
      name: product.name,
      price: product.price.toNumber(),
      stock: product.stock,
      categoryId: product.categoryId,
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
