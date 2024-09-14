import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Render,
  Res,
} from '@nestjs/common';
import { log } from 'console';
import { Product } from '../models/product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  @Render('products/index')
  async index() {
    const viewData = [];
    viewData['title'] = 'Products - Online Store';
    viewData['subtitle'] = 'List of Products';
    viewData['products'] = await this.productsService.findAll();

    return { viewData: viewData };
  }

  @Get('/:id')
  async show(@Param() params, @Res() response) {
    return await this.productsService
      .findOne(params.id)
      .then((product: Product) => {
        const viewData = [];

        viewData['title'] = product.getName() + ' - Online Store';
        viewData['subtitle'] = product.getName() + ' - Product Info';
        viewData['product'] = product;

        return response.render('products/show', { viewData: viewData });
      })
      .catch((exception: NotFoundException) => {
        log(exception);
        return response.redirect('/products'); //Redirect has a conflict with @render(). Thus response.render() is used in return statement.
      });
  }
}
