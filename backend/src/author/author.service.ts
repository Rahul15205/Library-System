import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthorDto, UpdateAuthorDto } from './author.dto';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const { name, biography, birthDate, nationality } = createAuthorDto;

    const author = await this.prisma.author.create({
      data: {
        name,
        biography,
        birthDate: birthDate ? new Date(birthDate) : null,
        nationality,
      },
    });
    return author;
  }

  async findBookByAuthor(bookId: string) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });
    if (!book) {
      throw new NotFoundException('Book Not Found');
    }
    return await this.prisma.book.findMany({
      where: { id: bookId },
    });
  }

  async findAll() {
    return this.prisma.author.findMany({
      include: {
        books: {
          select: {
            id: true,
            title: true,
            isbn: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          select: {
            id: true,
            title: true,
            isbn: true,
            publishedAt: true,
            genre: true,
          },
        },
      },
    });
    if (!author) {
      throw new NotFoundException('Author not found!');
    }
    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const { name, biography, birthDate, nationality } = updateAuthorDto;
    const existingAuthor = await this.prisma.author.findUnique({
      where: { id },
    });
    if (!existingAuthor) {
      throw new NotFoundException('Author not Found!');
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (biography !== undefined) updateData.biography;
    if (birthDate !== undefined) updateData.birthDate;
    if (nationality !== undefined) updateData.nationality;

    const author = await this.prisma.author.update({
      where: { id },
      data: updateData,
    });

    return author;
  }

  async remove(id: string) {
    const existingAuthor = await this.prisma.author.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });
    if (!existingAuthor) {
      throw new NotFoundException('Author Not Found!');
    }
    
    if (existingAuthor.books.length > 0) {
      throw new BadRequestException('Cannot delete author with associated books. Please delete the books first.');
    }

    await this.prisma.author.delete({
      where: { id },
    });
    return { message: 'Author deleted Successfully!' };
  }
}
