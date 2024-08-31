import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewProductDTO } from 'src/dtos/createNewProduct.dto';
import { Product } from 'src/models/procuct.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOneBy({ id });
  }

  createOrUpdate(
    createNewProductDTO: CreateNewProductDTO,
    filename: string,
  ): Promise<Product> {
    const newProduct = new Product();

    newProduct.setName(createNewProductDTO.name);
    newProduct.setPrice(createNewProductDTO.price);
    newProduct.setDescription(createNewProductDTO.description);
    newProduct.setImage(filename);

    return this.productsRepository.save(newProduct);
  }
}
