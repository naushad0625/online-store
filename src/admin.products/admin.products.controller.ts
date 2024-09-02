import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Redirect,
  Render,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { log } from 'console';
import { diskStorage } from 'multer';
import { CreateNewProductDTO } from 'src/dtos/createNewProduct.dto';
import { ProductsService } from 'src/products/products.service';

import { v4 as uuidv4 } from 'uuid';

@Controller('/admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  @Render('admin/products/index')
  async index() {
    const viewData = [];
    viewData['title'] = 'Admin Page - Admin - Online Store';
    viewData['products'] = await this.productsService.findAll();

    return { viewData: viewData };
  }

  @Post('/store')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/img',
        filename: (
          req: any,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const f_name =
            file.fieldname + '_' + uuidv4() + '.' + file.mimetype.split('/')[1];
          log(f_name);
          cb(null, f_name);
        },
      }),
      fileFilter: (
        req: any,
        file: {
          mimetype: string;
          destination: string;
          filename: string;
          path: string;
        },
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype))
          cb(null, true);
        else {
          cb(
            new UnsupportedMediaTypeException(
              'only jpg/png/jpeg files are allowed',
            ),
            false,
          );
        }
      },
    }),
  )
  @Redirect('/admin/products')
  async store(
    @Body() createNewProductDTO: CreateNewProductDTO,
    @UploadedFile() img: Express.Multer.File,
  ) {
    log(img);
    const { filename }: Express.Multer.File = img;
    await this.productsService.createOrUpdate(createNewProductDTO, filename);
  }

  @Post('/:id')
  @Redirect('/admin/products')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productsService.remove(id);
    if (result instanceof NotFoundException) throw result;
  }
}
