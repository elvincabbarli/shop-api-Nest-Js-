import { IsInt, IsNumber, IsString, Matches, Min } from 'class-validator';

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
}
