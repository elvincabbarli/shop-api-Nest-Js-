import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Matches(/\S/, { message: 'Məhsulun adı boş ola bilməz.' })
  name!: string;

  @IsNumber()
  @Min(0, { message: 'Qiymət ən azı 0 olmalıdır.' })
  price!: number;

  @IsInt()
  @Min(0, { message: 'Stok sayı mənfi olmayan tam ədəd olmalıdır.' })
  stock!: number;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Kateqoriya ID-si müsbət tam ədəd olmalıdır.' })
  categoryId?: number;
}
