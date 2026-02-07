export interface BookData {
  id: string;
  isbn: string;
  title: string;
  author: string;
  description: string | null;
  genre: string;
  publishedYear: number | null;
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type BookStatus = 'AVAILABLE' | 'BORROWED' | 'RESERVED';

export interface CreateBookRequest {
  isbn: string;
  title: string;
  author: string;
  description?: string;
  genre: string;
  publishedYear?: number;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  description?: string;
  genre?: string;
  publishedYear?: number;
}
