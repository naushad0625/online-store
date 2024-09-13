import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';
import { HttpExceptionFilter } from './filters/httpException.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  hbs.registerPartials(join(__dirname, '..', 'views/layouts'));
  hbsUtils(hbs).registerWatchedPartials(join(__dirname, '..', 'views/layouts'));

  app.setViewEngine('hbs');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors.map((err) => ({
          property: err.property,
          message: err.constraints[Object.keys(err.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
