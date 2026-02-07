import { BookModel } from '../models/BookModel';
import { BookView } from '../views/BookView';
import { BookRepository } from '../database/repositories/BookRepository';
import type { Context } from 'hono';

export class BookController {
  constructor(private bookRepository: BookRepository) {}
  
  async getAll(c: Context) {
    try {
      const query = c.req.query();
      const page = parseInt(query.page || '1');
      const pageSize = parseInt(query.pageSize || '20');
      const filters = {
        genre: query.genre,
        status: query.status as any,
        search: query.search
      };
      
      const { books, total } = await this.bookRepository.findAll(filters, page, pageSize);
      const bookModels = books.map(data => new BookModel(data));
      
      return c.json(BookView.renderList(bookModels, total, page, pageSize));
    } catch (error) {
      return c.json(BookView.renderError('Failed to fetch books'), 500);
    }
  }
  
  async getById(c: Context) {
    try {
      const id = c.req.param('id');
      const bookData = await this.bookRepository.findById(id);
      
      if (!bookData) {
        return c.json(BookView.renderError('Book not found'), 404);
      }
      
      const book = new BookModel(bookData);
      return c.json(BookView.render(book));
    } catch (error) {
      return c.json(BookView.renderError('Failed to fetch book'), 500);
    }
  }
  
  async create(c: Context) {
    try {
      const body = await c.req.json();
      
      // Input validation (not business logic)
      if (!body.isbn || !body.title || !body.author || !body.genre) {
        return c.json(BookView.renderError('Missing required fields'), 400);
      }
      
      if (!BookModel.validateISBN(body.isbn)) {
        return c.json(BookView.renderError('Invalid ISBN format'), 400);
      }
      
      if (!BookModel.validateTitle(body.title)) {
        return c.json(BookView.renderError('Invalid title'), 400);
      }
      
      const bookData = await this.bookRepository.create(body);
      const book = new BookModel(bookData);
      
      return c.json(BookView.render(book), 201);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return c.json(BookView.renderError('Book with this ISBN already exists'), 409);
      }
      return c.json(BookView.renderError('Failed to create book'), 500);
    }
  }
  
  async update(c: Context) {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      
      const existingData = await this.bookRepository.findById(id);
      if (!existingData) {
        return c.json(BookView.renderError('Book not found'), 404);
      }
      
      const updatedData = await this.bookRepository.update(id, body);
      const book = new BookModel(updatedData);
      
      return c.json(BookView.render(book));
    } catch (error) {
      return c.json(BookView.renderError('Failed to update book'), 500);
    }
  }
  
  async delete(c: Context) {
    try {
      const id = c.req.param('id');
      await this.bookRepository.delete(id);
      return c.json(BookView.renderSuccess('Book deleted successfully'));
    } catch (error) {
      return c.json(BookView.renderError('Failed to delete book'), 500);
    }
  }
  
  async search(c: Context) {
    try {
      const query = c.req.query('q') || '';
      const page = parseInt(c.req.query('page') || '1');
      const pageSize = parseInt(c.req.query('pageSize') || '20');
      
      const { books, total } = await this.bookRepository.search(query, page, pageSize);
      const bookModels = books.map(data => new BookModel(data));
      
      return c.json(BookView.renderList(bookModels, total, page, pageSize));
    } catch (error) {
      return c.json(BookView.renderError('Search failed'), 500);
    }
  }
}
