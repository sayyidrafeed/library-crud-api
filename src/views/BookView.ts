import { BookModel } from '../models/BookModel';

export interface BookResponseDTO {
  id: string;
  isbn: string;
  title: string;
  author: string;
  description: string | null;
  genre: string;
  publishedYear: number | null;
  status: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookListResponseDTO {
  books: BookResponseDTO[];
  total: number;
  page: number;
  pageSize: number;
}

export class BookView {
  static render(book: BookModel): BookResponseDTO {
    const data = book.getData();
    return {
      id: data.id,
      isbn: data.isbn,
      title: data.title,
      author: data.author,
      description: data.description,
      genre: data.genre,
      publishedYear: data.publishedYear,
      status: data.status,
      isAvailable: book.isAvailable(),
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString()
    };
  }
  
  static renderList(
    books: BookModel[],
    total: number,
    page: number,
    pageSize: number
  ): BookListResponseDTO {
    return {
      books: books.map(book => this.render(book)),
      total,
      page,
      pageSize
    };
  }
  
  static renderError(message: string): { error: string } {
    return { error: message };
  }
  
  static renderSuccess(message: string): { message: string } {
    return { message };
  }
}
