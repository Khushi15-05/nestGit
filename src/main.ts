import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.use(cookieParser());
	app.useStaticAssets(join(__dirname, '..', 'public'));

	const configService = app.get(ConfigService);
	await app.listen(process.env.PORT || configService.get('port'));
	console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
