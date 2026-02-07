import { BookRepository } from '../database/repositories/BookRepository';
import { BookModel } from '../models/BookModel';
import { BookView } from '../views/BookView';
import type { Context } from 'hono';

export class SearchController {
  constructor(private bookRepository: BookRepository) {}
  
  async searchBooks(c: Context) {
    try {
      const query = c.req.query('q') || '';
      const genre = c.req.query('genre');
      const status = c.req.query('status');
      const page = parseInt(c.req.query('page') || '1');
      const pageSize = parseInt(c.req.query('pageSize') || '20');
      
      const filters = {
        search: query,
        genre,
        status: status as any
      };
      
      const { books, total } = await this.bookRepository.findAll(filters, page, pageSize);
      const bookModels = books.map(data => new BookModel(data));
      
      return c.json(BookView.renderList(bookModels, total, page, pageSize));
    } catch (error) {
      return c.json(BookView.renderError('Search failed'), 500);
    }
  }
  
  async searchByGenre(c: Context) {
    try {
      const genre = c.req.param('genre');
      const page = parseInt(c.req.query('page') || '1');
      const pageSize = parseInt(c.req.query('pageSize') || '20');
      
      const { books, total } = await this.bookRepository.findAll({ genre }, page, pageSize);
      const bookModels = books.map(data => new BookModel(data));
      
      return c.json(BookView.renderList(bookModels, total, page, pageSize));
    } catch (error) {
      return c.json(BookView.renderError('Failed to fetch books by genre'), 500);
    }
  }
}
