import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const password = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      password,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Doe',
      password,
    },
  });

  console.log({ user1, user2 });

  // Create Authors
  const author1 = await prisma.author.create({
    data: {
      name: 'J.K. Rowling',
      biography: 'British author, best known for the Harry Potter series.',
      nationality: 'British',
      birthDate: new Date('1965-07-31'),
    },
  });

  const author2 = await prisma.author.create({
    data: {
      name: 'George R.R. Martin',
      biography: 'American novelist and short story writer.',
      nationality: 'American',
      birthDate: new Date('1948-09-20'),
    },
  });

  console.log({ author1, author2 });

  // Create Books
  const book1 = await prisma.book.create({
    data: {
      title: 'Harry Potter and the Philosopher\'s Stone',
      isbn: '978-0747532743',
      description: 'The first novel in the Harry Potter series.',
      publishedAt: new Date('1997-06-26'),
      genre: 'Fantasy',
      authorId: author1.id,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'A Game of Thrones',
      isbn: '978-0553103540',
      description: 'The first novel in A Song of Ice and Fire.',
      publishedAt: new Date('1996-08-01'),
      genre: 'Fantasy',
      authorId: author2.id,
    },
  });

  console.log({ book1, book2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
