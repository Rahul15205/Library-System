import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksQueryDto, CreateBookDto, UpdateBookDto } from './book.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get('author/:authorId')
  findAuthorsByBook(@Param('authorId') authorId: string) {
    return this.booksService.findByAuthor(authorId);
  }

  @Get()
  findAll(@Query() booksqueryDto: BooksQueryDto) {
    return this.booksService.findAll(booksqueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
