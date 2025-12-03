export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Author {
  id: string;
  name: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  description?: string;
  publishedAt?: string;
  genre?: string;
  authorId: string;
  author?: Author;
  borrowed?: boolean; // Derived from backend if needed, or check borrowedBooks
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  userId: string;
  borrowedAt: string;
  returnedAt?: string;
  dueDate: string;
  book?: Book;
}

export interface AuthResponse {
  access_token: string;
  user: User; // Assuming backend returns user info on login/signup, if not I'll decode token
}
