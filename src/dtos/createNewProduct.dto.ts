import { Injectable } from '@nestjs/common';
import { IsNumber, IsPositive, IsString } from 'class-validator';

@Injectable()
export class CreateNewProductDTO {
  @IsString()
  readonly name: string;

  @IsNumber()
  @IsPositive()
  readonly price: number;

  @IsString()
  readonly description: string;
}
