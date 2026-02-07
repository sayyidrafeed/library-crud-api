import { BaseModel } from './BaseModel';
import type { LoanData } from '../types/loan.types';
import { LOAN_PERIOD_DAYS, MAX_RENEWALS } from '../constants/libraryConstants';
import { addDays, isOverdue } from '../utils/dateUtils';

export class LoanModel extends BaseModel<LoanData> {
  constructor(data: LoanData) {
    super(data);
  }
  
  get id(): string { return this.data.id; }
  get bookId(): string { return this.data.bookId; }
  get memberId(): string { return this.data.memberId; }
  get dueDate(): Date { return this.data.dueDate; }
  get isReturned(): boolean { return this.data.returnedAt !== null; }
  
  static create(bookId: string, memberId: string): LoanModel {
    const now = new Date();
    const dueDate = addDays(now, LOAN_PERIOD_DAYS);
    
    return new LoanModel({
      id: crypto.randomUUID(),
      bookId,
      memberId,
      borrowedAt: now,
      dueDate,
      returnedAt: null,
      renewed: false
    });
  }
  
  isOverdue(): boolean {
    if (this.isReturned) return false;
    return isOverdue(this.data.dueDate);
  }
  
  canBeRenewed(): boolean {
    return !this.isReturned && !this.data.renewed && !this.isOverdue();
  }
  
  renew(): void {
    if (!this.canBeRenewed()) {
      throw new Error('Loan cannot be renewed');
    }
    
    const newDueDate = addDays(this.data.dueDate, LOAN_PERIOD_DAYS);
    this.update({
      dueDate: newDueDate,
      renewed: true
    });
  }
  
  return(): void {
    if (this.isReturned) {
      throw new Error('Book already returned');
    }
    this.update({ returnedAt: new Date() });
  }
  
  toJSON(): object {
    return {
      ...this.getData(),
      isOverdue: this.isOverdue(),
      canRenew: this.canBeRenewed()
    };
  }
}
