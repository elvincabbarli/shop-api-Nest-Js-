import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Qiymət ən azı 0 olmalıdır.' })
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Stok sayı mənfi olmayan tam ədəd olmalıdır.' })
  stock?: number;
}