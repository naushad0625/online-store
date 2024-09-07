import { PartialType } from '@nestjs/mapped-types';
import { CreateNewProductDTO } from './createNewProduct.dto';

export class UpdateProductDTO extends PartialType(CreateNewProductDTO) {}
