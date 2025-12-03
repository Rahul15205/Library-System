import { Module } from '@nestjs/common';
import { BorrowedBooksController } from './borrowed-books.controller';
import { BorrowedBooksService } from './borrowed-books.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BorrowedBooksController],
  providers: [BorrowedBooksService, PrismaService],
  exports: [BorrowedBooksService],
})
export class BorrowedBooksModule {}
