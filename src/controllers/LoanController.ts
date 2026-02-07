import { LoanModel } from '../models/LoanModel';
import { BookModel } from '../models/BookModel';
import { MemberModel } from '../models/MemberModel';
import { LoanView } from '../views/LoanView';
import { BookRepository } from '../database/repositories/BookRepository';
import { MemberRepository } from '../database/repositories/MemberRepository';
import { LoanRepository } from '../database/repositories/LoanRepository';
import type { Context } from 'hono';

export class LoanController {
  constructor(
    private loanRepository: LoanRepository,
    private bookRepository: BookRepository,
    private memberRepository: MemberRepository
  ) {}
  
  async borrowBook(c: Context) {
    try {
      const { bookId, memberId } = await c.req.json();
      
      // Validate input
      if (!bookId || !memberId) {
        return c.json(LoanView.renderError('Book ID and Member ID are required'), 400);
      }
      
      // Get book and check availability
      const bookData = await this.bookRepository.findById(bookId);
      if (!bookData) {
        return c.json(LoanView.renderError('Book not found'), 404);
      }
      
      const book = new BookModel(bookData);
      if (!book.canBeBorrowed()) {
        return c.json(LoanView.renderError('Book is not available'), 400);
      }
      
      // Get member and check loan capacity
      const memberData = await this.memberRepository.findById(memberId);
      if (!memberData) {
        return c.json(LoanView.renderError('Member not found'), 404);
      }
      
      const activeLoans = await this.loanRepository.countActiveLoansForMember(memberId);
      const member = new MemberModel(memberData);
      member.setCurrentLoans(activeLoans);
      
      if (!member.canBorrow()) {
        return c.json(LoanView.renderError(
          member.status !== 'ACTIVE' 
            ? 'Member account is not active' 
            : 'Member has reached loan limit'
        ), 400);
      }
      
      // Create loan (Model handles business logic)
      const loan = LoanModel.create(bookId, memberId);
      const savedLoan = await this.loanRepository.save(loan.getData());
      
      // Update book status (Model notifies observers)
      book.borrow();
      await this.bookRepository.update(bookId, { status: book.getData().status });
      
      return c.json(LoanView.render(new LoanModel(savedLoan)), 201);
    } catch (error) {
      console.error('Borrow error:', error);
      return c.json(LoanView.renderError('Failed to borrow book'), 500);
    }
  }
  
  async returnBook(c: Context) {
    try {
      const loanId = c.req.param('id');
      
      const loanData = await this.loanRepository.findById(loanId);
      if (!loanData) {
        return c.json(LoanView.renderError('Loan not found'), 404);
      }
      
      const loan = new LoanModel(loanData);
      
      if (loan.isReturned) {
        return c.json(LoanView.renderError('Book already returned'), 400);
      }
      
      // Update loan (Model handles business logic)
      loan.return();
      await this.loanRepository.update(loanId, { returnedAt: new Date() });
      
      // Update book status
      const bookData = await this.bookRepository.findById(loan.bookId);
      if (bookData) {
        const book = new BookModel(bookData);
        book.return();
        await this.bookRepository.update(loan.bookId, { status: book.getData().status });
      }
      
      return c.json(LoanView.render(loan));
    } catch (error) {
      return c.json(LoanView.renderError('Failed to return book'), 500);
    }
  }
  
  async renewLoan(c: Context) {
    try {
      const loanId = c.req.param('id');
      
      const loanData = await this.loanRepository.findById(loanId);
      if (!loanData) {
        return c.json(LoanView.renderError('Loan not found'), 404);
      }
      
      const loan = new LoanModel(loanData);
      
      if (!loan.canBeRenewed()) {
        return c.json(LoanView.renderError('Loan cannot be renewed'), 400);
      }
      
      // Renew loan (Model handles business logic)
      loan.renew();
      await this.loanRepository.update(loanId, {
        dueDate: loan.getData().dueDate,
        renewed: true
      });
      
      return c.json(LoanView.render(loan));
    } catch (error) {
      return c.json(LoanView.renderError('Failed to renew loan'), 500);
    }
  }
  
  async getMemberLoans(c: Context) {
    try {
      const memberId = c.req.param('memberId');
      const status = c.req.query('status'); // 'active' | 'returned' | 'overdue'
      
      const loans = await this.loanRepository.findByMemberId(memberId, status);
      const loanModels = loans.map(data => new LoanModel(data));
      
      return c.json(LoanView.renderList(loanModels));
    } catch (error) {
      return c.json(LoanView.renderError('Failed to fetch loans'), 500);
    }
  }
  
  async getOverdueLoans(c: Context) {
    try {
      const loans = await this.loanRepository.findOverdue();
      const loanModels = loans.map(data => new LoanModel(data));
      
      return c.json(LoanView.renderList(loanModels));
    } catch (error) {
      return c.json(LoanView.renderError('Failed to fetch overdue loans'), 500);
    }
  }
  
  async getAllLoans(c: Context) {
    try {
      const loans = await this.loanRepository.findRecent(100);
      const loanModels = loans.map(data => new LoanModel(data));
      
      return c.json(LoanView.renderList(loanModels));
    } catch (error) {
      return c.json(LoanView.renderError('Failed to fetch loans'), 500);
    }
  }
}
