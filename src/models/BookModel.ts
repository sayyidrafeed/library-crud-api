import { BaseModel } from './BaseModel';
import type { BookData, BookStatus } from '../types/book.types';

export class BookModel extends BaseModel<BookData> {
  constructor(data: BookData) {
    super(data);
  }
  
  // Getters
  get id(): string { return this.data.id; }
  get isbn(): string { return this.data.isbn; }
  get title(): string { return this.data.title; }
  get author(): string { return this.data.author; }
  get status(): BookStatus { return this.data.status; }
  
  // Business logic methods
  isAvailable(): boolean {
    return this.data.status === 'AVAILABLE';
  }
  
  canBeBorrowed(): boolean {
    return this.isAvailable();
  }
  
  borrow(): void {
    if (!this.canBeBorrowed()) {
      throw new Error('Book is not available for borrowing');
    }
    this.update({ status: 'BORROWED' });
  }
  
  return(): void {
    if (this.data.status !== 'BORROWED') {
      throw new Error('Book is not currently borrowed');
    }
    this.update({ status: 'AVAILABLE' });
  }
  
  reserve(): void {
    if (this.data.status !== 'AVAILABLE') {
      throw new Error('Book cannot be reserved');
    }
    this.update({ status: 'RESERVED' });
  }
  
  // Validation
  static validateISBN(isbn: string): boolean {
    // Basic ISBN-13 validation
    const cleaned = isbn.replace(/[-\s]/g, '');
    return cleaned.length === 13 && /^\d+$/.test(cleaned);
  }
  
  static validateTitle(title: string): boolean {
    return title.trim().length >= 2 && title.trim().length <= 200;
  }
  
  toJSON(): object {
    return this.getData();
  }
}
