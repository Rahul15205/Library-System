import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthorService } from './author/author.service';
import { AuthorController } from './author/author.controller';
import { AuthorModule } from './author/author.module';
import { BorrowedBooksService } from './borrowed-books/borrowed-books.service';
import { BorrowedBooksController } from './borrowed-books/borrowed-books.controller';
import { BorrowedBooksModule } from './borrowed-books/borrowed-books.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    BooksModule,
    AuthorModule,
    BorrowedBooksModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    AuthorController,
    BorrowedBooksController,
    UsersController,
  ],
  providers: [
    AppService,
    PrismaService,
    AuthorService,
    BorrowedBooksService,
    UsersService,
  ],
})
export class AppModule {}
