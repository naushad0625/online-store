import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { unlink } from 'fs/promises';
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

  async createOrUpdate(
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

  async remove(id: number): Promise<string | NotFoundException> {
    const product: Product = await this.findOne(id);

    if (product === undefined || product === null) {
      return new NotFoundException(
        `Product with provided id(id=${id}) does not exist.`,
      );
    }

    const image = product.getImage();

    await this.productsRepository
      .createQueryBuilder()
      .delete()
      .from(Product)
      .where('id = :id', { id: id })
      .execute()
      .then(() => unlink('./public/img/' + image))
      .catch((err: Error) => log(err));

    return image;
  }
}
