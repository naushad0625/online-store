import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  @Render('products/index')
  async index() {
    const viewdata = [];
    viewdata['title'] = 'Products - Online Store';
    viewdata['subtitle'] = 'List of Products';
    viewdata['products'] = await this.productsService.findAll();

    return { viewdata: viewdata };
  }

  @Get('/:id')
  async show(@Param() params, @Res() response) {
    const product = await this.productsService.findOne(params.id);

    if (product == (undefined || null)) {
      return response.redirect('/products'); //Redirect has a conflict with @render(). Thus response.render() is used in return statement.
    }

    const viewData = [];

    viewData['title'] = product.getName() + ' - Online Store';
    viewData['subtitle'] = product.getName() + ' - Product Info';
    viewData['product'] = product;

    return response.render('products/show', { viewData: viewData });
  }
}
