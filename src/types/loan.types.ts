export interface LoanData {
  id: string;
  bookId: string;
  memberId: string;
  borrowedAt: Date;
  dueDate: Date;
  returnedAt: Date | null;
  renewed: boolean;
}

export interface CreateLoanRequest {
  bookId: string;
  memberId: string;
}

export interface LoanWithDetails {
  id: string;
  bookId: string;
  memberId: string;
  borrowedAt: Date;
  dueDate: Date;
  returnedAt: Date | null;
  renewed: boolean;
  book: {
    title: string;
    author: string;
  };
  member: {
    name: string;
    email: string;
  };
}
