export interface DashboardStatsDTO {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  totalMembers: number;
  activeMembers: number;
  totalLoans: number;
  activeLoans: number;
  overdueLoans: number;
}

export interface RecentActivityDTO {
  id: string;
  bookTitle: string;
  memberName: string;
  action: 'borrowed' | 'returned';
  date: string;
}

export class DashboardView {
  static renderStats(stats: DashboardStatsDTO) {
    return {
      books: {
        total: stats.totalBooks,
        available: stats.availableBooks,
        borrowed: stats.borrowedBooks
      },
      members: {
        total: stats.totalMembers,
        active: stats.activeMembers
      },
      loans: {
        total: stats.totalLoans,
        active: stats.activeLoans,
        overdue: stats.overdueLoans
      }
    };
  }
  
  static renderRecentActivity(loans: Array<{
    id: string;
    book: { title: string };
    member: { name: string };
    borrowedAt: Date;
    returnedAt: Date | null;
  }>) {
    return {
      activities: loans.map(loan => ({
        id: loan.id,
        bookTitle: loan.book.title,
        memberName: loan.member.name,
        action: loan.returnedAt ? 'returned' : 'borrowed',
        date: (loan.returnedAt || loan.borrowedAt).toISOString()
      }))
    };
  }
  
  static renderError(message: string): { error: string } {
    return { error: message };
  }
}
