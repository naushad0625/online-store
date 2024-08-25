import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsService } from './products/products.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { AdminProductsController } from './admin.products/admin.products.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AdminModule,
  ],
  controllers: [
    AppController,
    ProductsController,
    AdminController,
    AdminProductsController,
  ],
  providers: [AppService, ProductsService],
})
export class AppModule {}
