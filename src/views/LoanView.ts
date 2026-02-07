import { LoanModel } from '../models/LoanModel';

export interface LoanResponseDTO {
  id: string;
  bookId: string;
  memberId: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  renewed: boolean;
  isOverdue: boolean;
  canRenew: boolean;
}

export interface LoanWithDetailsDTO extends LoanResponseDTO {
  book: {
    title: string;
    author: string;
  };
  member: {
    name: string;
    email: string;
  };
}

export class LoanView {
  static render(loan: LoanModel): LoanResponseDTO {
    const data = loan.getData();
    return {
      id: data.id,
      bookId: data.bookId,
      memberId: data.memberId,
      borrowedAt: data.borrowedAt.toISOString(),
      dueDate: data.dueDate.toISOString(),
      returnedAt: data.returnedAt?.toISOString(),
      renewed: data.renewed,
      isOverdue: loan.isOverdue(),
      canRenew: loan.canBeRenewed()
    };
  }
  
  static renderWithDetails(
    loan: LoanModel,
    bookTitle: string,
    bookAuthor: string,
    memberName: string,
    memberEmail: string
  ): LoanWithDetailsDTO {
    return {
      ...this.render(loan),
      book: { title: bookTitle, author: bookAuthor },
      member: { name: memberName, email: memberEmail }
    };
  }
  
  static renderList(loans: LoanModel[]): LoanResponseDTO[] {
    return loans.map(loan => this.render(loan));
  }
  
  static renderError(message: string): { error: string } {
    return { error: message };
  }
}
