import { Controller, Get, Render } from '@nestjs/common';
// import { AppService } from './app.service';

@Controller()
export class AppController {
  @Get('/')
  @Render('index')
  index() {
    const viewData = [];
    viewData['title'] = 'Home Page - Online Store';

    return { viewData: viewData };
  }

  @Get('/about')
  @Render('about')
  about() {
    const viewData = [];
    viewData['title'] = 'About us - Online Store';
    viewData['subtitle'] = 'About us';
    viewData['description'] = 'This is the about page.';
    viewData['author'] = 'Author: Naushad Hossain';

    return { viewData: viewData };
  }
}
