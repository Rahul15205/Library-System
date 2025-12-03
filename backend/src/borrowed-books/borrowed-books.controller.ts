import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BorrowedBooksService } from './borrowed-books.service';
import { BorrowedBookDto, ReturnBookDto } from './borrowed-books.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('borrowed-books')
@UseGuards(JwtAuthGuard)
export class BorrowedBooksController {
  constructor(private readonly borrowedBooksService: BorrowedBooksService) {}

  @Post('borrow')
  borrowBook(@Body() borrowBookDto: BorrowedBookDto) {
    return this.borrowedBooksService.borrowBook(borrowBookDto);
  }

  @Post('return')
  returnBook(@Body() returnBookDto: ReturnBookDto) {
    return this.borrowedBooksService.returnBook(returnBookDto);
  }

  @Get('user/:userId')
  findAllforUser(@Param('userId') userId: string) {
    return this.borrowedBooksService.findAllForUser(userId);
  }

  @Get()
  findAll() {
    return this.borrowedBooksService.findALl();
  }

  @Get(':id')
  findone(@Param('id') id: string) {
    return this.borrowedBooksService.findOne(id);
  }
}
