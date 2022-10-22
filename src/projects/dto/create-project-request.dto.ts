import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
