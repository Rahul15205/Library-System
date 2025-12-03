import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BooksQueryDto, CreateBookDto, UpdateBookDto } from './book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}
  async create(createBookDto: CreateBookDto) {
    const { title, isbn, description, publishedAt, genre, authorId } =
      createBookDto;

    const existingBook = await this.prisma.book.findUnique({
      where: { isbn },
    });

    if (existingBook) {
      throw new ConflictException('Book with this ISBN already exists');
    }

    const author = await this.prisma.author.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const book = await this.prisma.book.create({
      data: {
        title,
        isbn,
        description,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        genre,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            nationality: true,
          },
        },
      },
    });
    return book;
  }

  async findAll(query: BooksQueryDto) {
    const { authorId, borrowed } = query;
    const where: any = {};
    if (authorId) {
      where.authorId = authorId;
    }

    if (borrowed !== undefined) {
      const isBorrowed = borrowed === 'true';
      if (isBorrowed) {
        where.borrowedBooks = {
          some: {
            returnedAt: null,
          },
        };
      } else {
        where.borrowedBooks = {
          none: {
            returnedAt: null,
          },
        };
      }
    }
    return this.prisma.book.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            nationality: true,
          },
        },
        borrowedBooks: {
          where: {
            returnedAt: null,
          },
          select: {
            id: true,
            borrowedAt: true,
            dueDate: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            biography: true,
            nationality: true,
            birthDate: true,
          },
        },
        borrowedBooks: {
          select: {
            id: true,
            borrowedAt: true,
            returnedAt: true,
            dueDate: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException('Book not Found');
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const { title, isbn, description, publishedAt, genre, authorId } =
      updateBookDto;
    const existingBook = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      throw new NotFoundException('Book not Found');
    }

    if (isbn && isbn !== existingBook.isbn) {
      const isbnExists = await this.prisma.book.findUnique({
        where: { isbn },
      });
      if (isbnExists) {
        throw new ConflictException('Book with ISBN exists');
      }
    }
    const updateData: any = {};
    if (title) updateData.title = title;
    if (isbn) updateData.isbn = isbn;
    if (description !== undefined) updateData.description = description;
    if (publishedAt !== undefined)
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    if (genre !== undefined) updateData.genre = genre;
    if (authorId) updateData.authorId = authorId;

    const book = await this.prisma.book.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            nationality: true,
          },
        },
      },
    });
    return book;
  }

  async remove(id: string) {
    const existingBook = await this.prisma.book.findUnique({
      where: { id },
    });
    if (!existingBook) {
      throw new NotFoundException('Book Not FOund');
    }
    await this.prisma.book.delete({
      where: { id },
    });

    return { message: 'Book deleted Successfully' };
  }

  async findByAuthor(authorId: string) {
    const author = await this.prisma.author.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new NotFoundException('Author not Found');
    }

    return await this.prisma.author.findMany({
      where: { id: authorId },
    });
  }
}
