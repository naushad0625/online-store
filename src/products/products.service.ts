import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { CreateNewProductDTO } from 'src/dtos/createNewProduct.dto';
import { UpdateProductDTO } from 'src/dtos/updateProduct.dto';
import { Product } from 'src/models/product.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product: Product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(
        `Product with given ID (id= ${id}) does not exist.`,
      );
    }
    return product;
  }

  async create(
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

  async update(
    id: number,
    updateProductDTO: UpdateProductDTO,
    filename?: string,
  ): Promise<UpdateResult> {
    const product = await this.findOne(id);

    if (product instanceof NotFoundException) {
      throw product;
    }

    const { name, price, description } = updateProductDTO;
    const update_set: Partial<Product> = {};

    if (name) update_set['name'] = name;
    if (price) update_set['price'] = price;
    if (description) update_set['description'] = description;
    if (filename) update_set['image'] = filename;

    return this.productsRepository
      .createQueryBuilder()
      .update(Product)
      .set(update_set)
      .where('id = :id', { id: id })
      .execute();
  }

  async remove(id: number): Promise<string> {
    let imagefileName: string;
    return this.findOne(id)
      .then((product) => {
        if (product instanceof NotFoundException) {
          throw product;
        }
        imagefileName = product.getImage();
        return this.productsRepository
          .createQueryBuilder()
          .delete()
          .from(Product)
          .where('id = :id', { id: id })
          .execute();
      })
      .then(() => {
        const imagePath = join(process.cwd(), 'public', 'img', imagefileName);
        return unlink(imagePath);
      })
      .then(() => {
        return imagefileName;
      });
  }
}
