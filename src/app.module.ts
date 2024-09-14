import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminProductsController } from './admin.products/admin.products.controller';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AdminModule,
    AuthModule,
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
