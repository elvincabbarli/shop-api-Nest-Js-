import { IsString, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Matches(/\S/, { message: 'Kateqoriyanın adı boş ola bilməz.' })
  name!: string;
}
