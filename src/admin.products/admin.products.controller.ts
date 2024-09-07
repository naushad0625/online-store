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
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { log } from 'console';
import { diskStorage } from 'multer';
import { CreateNewProductDTO } from 'src/dtos/createNewProduct.dto';
import { UpdateProductDTO } from 'src/dtos/updateProduct.dto';
import { ProductsService } from 'src/products/products.service';

import { v4 as uuidv4 } from 'uuid';

const options: MulterOptions = {
  storage: diskStorage({
    destination: './public/img',
    filename: (
      req: any,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      if (file == null) {
        cb(new NotFoundException('No image uplopaded'), '');
      } else {
        const f_name =
          file.fieldname + '_' + uuidv4() + '.' + file.mimetype.split('/')[1];
        cb(null, f_name);
      }
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
};

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
  @UseInterceptors(FileInterceptor('image', options))
  @Redirect('/admin/products')
  async store(
    @Body() createNewProductDTO: CreateNewProductDTO,
    @UploadedFile() img: Express.Multer.File,
  ) {
    log(img);
    const { filename }: Express.Multer.File = img;
    await this.productsService.create(createNewProductDTO, filename);
  }

  @Get('/create')
  @Render('admin/products/create')
  async create() {
    const viewData = [];
    viewData['title'] = 'Admin Page - Create Product - Online Store';
    return { viewData: viewData };
  }

  @Get('/:id')
  @Render('admin/products/edit')
  async edit(@Param('id', ParseIntPipe) id: number) {
    const viewData = [];
    viewData['title'] = 'Admin Page - Edit Product - Online Store';
    viewData['product'] = await this.productsService.findOne(id);

    return {
      viewData: viewData,
    };
  }

  @Post('/:id')
  @Redirect('/admin/products')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productsService.remove(id);
    return result;
  }

  @Post('/:id/update')
  @UseInterceptors(FileInterceptor('image', options))
  @Redirect('/admin/products')
  async update(
    @Body() updateProductDTO: UpdateProductDTO,
    @UploadedFile() img: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (img == null) {
      return await this.productsService.update(id, updateProductDTO);
    }
    const filename: string = img.filename;
    return await this.productsService.update(id, updateProductDTO, filename);
  }
}
