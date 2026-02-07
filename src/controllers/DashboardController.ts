import { BookRepository } from '../database/repositories/BookRepository';
import { MemberRepository } from '../database/repositories/MemberRepository';
import { LoanRepository } from '../database/repositories/LoanRepository';
import { DashboardView } from '../views/DashboardView';
import { BookStatus, MemberStatus } from '@prisma/client';
import type { Context } from 'hono';

export class DashboardController {
  constructor(
    private bookRepository: BookRepository,
    private memberRepository: MemberRepository,
    private loanRepository: LoanRepository
  ) {}
  
  async getStats(c: Context) {
    try {
      const [
        totalBooks,
        availableBooks,
        totalMembers,
        activeMembers,
        totalLoans,
        activeLoans,
        overdueLoans
      ] = await Promise.all([
        this.bookRepository.count(),
        this.bookRepository.countByStatus(BookStatus.AVAILABLE),
        this.memberRepository.count(),
        this.memberRepository.countByStatus(MemberStatus.ACTIVE),
        this.loanRepository.count(),
        this.loanRepository.countActive(),
        this.loanRepository.countOverdue()
      ]);
      
      return c.json(DashboardView.renderStats({
        totalBooks,
        availableBooks,
        borrowedBooks: totalBooks - availableBooks,
        totalMembers,
        activeMembers,
        totalLoans,
        activeLoans,
        overdueLoans
      }));
    } catch (error) {
      return c.json(DashboardView.renderError('Failed to fetch dashboard stats'), 500);
    }
  }
  
  async getRecentActivity(c: Context) {
    try {
      const recentLoans = await this.loanRepository.findRecent(10);
      return c.json(DashboardView.renderRecentActivity(recentLoans));
    } catch (error) {
      return c.json(DashboardView.renderError('Failed to fetch recent activity'), 500);
    }
  }
}
