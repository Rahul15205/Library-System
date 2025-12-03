import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BorrowedBookDto, ReturnBookDto } from './borrowed-books.dto';

@Injectable()
export class BorrowedBooksService {
  constructor(private prisma: PrismaService) {}

  async borrowBook(borrowBookDto: BorrowedBookDto) {
    const { userId, bookId, dueDate } = borrowBookDto;

    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });
    if (!book) {
      throw new NotFoundException('Book not found!');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const existingBorrowing = await this.prisma.borrowedBook.findFirst({
      where: {
        bookId,
        returnedAt: null,
      },
    });
    if (existingBorrowing) {
      throw new ConflictException('Book is already borrowed');
    }

    const userBorrowing = await this.prisma.borrowedBook.findFirst({
      where: {
        userId,
        bookId,
        returnedAt: null,
      },
    });

    if (userBorrowing) {
      throw new ConflictException('User has already borrowed this book');
    }

    const borrowedAt = new Date();
    const finalDueDate = dueDate ? new Date(dueDate) : new Date();
    if (!dueDate) {
      finalDueDate.setDate(borrowedAt.getDate() + 14);
    }

    if (finalDueDate <= borrowedAt) {
      throw new BadRequestException('Due date must be after borrowed date');
    }

    const borrowedBook = await this.prisma.borrowedBook.create({
      data: {
        bookId,
        userId,
        dueDate: finalDueDate,
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            isbn: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return borrowedBook;
  }

  async returnBook(returnBookDto: ReturnBookDto) {
    const { borrowedBookId } = returnBookDto;
    const borrowedBook = await this.prisma.borrowedBook.findUnique({
      where: { id: borrowedBookId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            isbn: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!borrowedBook) {
      throw new NotFoundException('Borrowing record not found');
    }

    if (borrowedBook.returnedAt) {
      throw new BadRequestException('Book has Already been returned');
    }

    const updateBorrowedBook = await this.prisma.borrowedBook.update({
      where: { id: borrowedBookId },
      data: {
        returnedAt: new Date(),
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            isbn: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return updateBorrowedBook;
  }

  async findAllForUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not Found');
    }

    return this.prisma.borrowedBook.findMany({
      where: { userId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            isbn: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });
  }

  async findALl() {
    return this.prisma.borrowedBook.findMany({
      include: {
        book: {
          select: {
            id: true,
            title: true,
            isbn: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const borrowedBook = await this.prisma.borrowedBook.findUnique({
      where: { id },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            isbn: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!borrowedBook) {
      throw new NotFoundException('Borrowing Record Not Found');
    }

    return borrowedBook;
  }
}
