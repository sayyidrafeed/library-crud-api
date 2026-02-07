import { PrismaClient, type Loan, type Prisma } from '@prisma/client';

export class LoanRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string): Promise<Loan | null> {
    return this.prisma.loan.findUnique({ 
      where: { id },
      include: { book: true, member: true }
    });
  }
  
  async findByMemberId(memberId: string, status?: string): Promise<Loan[]> {
    const where: Prisma.LoanWhereInput = { memberId };
    
    if (status === 'active') {
      where.returnedAt = null;
    } else if (status === 'returned') {
      where.returnedAt = { not: null };
    } else if (status === 'overdue') {
      where.returnedAt = null;
      where.dueDate = { lt: new Date() };
    }
    
    return this.prisma.loan.findMany({
      where,
      include: { book: true, member: true },
      orderBy: { borrowedAt: 'desc' }
    });
  }
  
  async findByBookId(bookId: string): Promise<Loan[]> {
    return this.prisma.loan.findMany({
      where: { bookId },
      include: { book: true, member: true },
      orderBy: { borrowedAt: 'desc' }
    });
  }
  
  async findOverdue(): Promise<Loan[]> {
    return this.prisma.loan.findMany({
      where: {
        returnedAt: null,
        dueDate: { lt: new Date() }
      },
      include: { book: true, member: true },
      orderBy: { dueDate: 'asc' }
    });
  }
  
  async findRecent(limit: number): Promise<Array<Loan & { book: { title: string }, member: { name: string } }>> {
    return this.prisma.loan.findMany({
      include: { book: true, member: true },
      orderBy: { borrowedAt: 'desc' },
      take: limit
    }) as any;
  }
  
  async save(data: { id: string; bookId: string; memberId: string; borrowedAt: Date; dueDate: Date; returnedAt: Date | null; renewed: boolean }): Promise<Loan> {
    return this.prisma.loan.create({ 
      data: {
        id: data.id,
        bookId: data.bookId,
        memberId: data.memberId,
        borrowedAt: data.borrowedAt,
        dueDate: data.dueDate,
        returnedAt: data.returnedAt,
        renewed: data.renewed
      }
    });
  }
  
  async update(id: string, data: Prisma.LoanUpdateInput): Promise<Loan> {
    return this.prisma.loan.update({ where: { id }, data });
  }
  
  async count(): Promise<number> {
    return this.prisma.loan.count();
  }
  
  async countActive(): Promise<number> {
    return this.prisma.loan.count({ where: { returnedAt: null } });
  }
  
  async countOverdue(): Promise<number> {
    return this.prisma.loan.count({
      where: {
        returnedAt: null,
        dueDate: { lt: new Date() }
      }
    });
  }
  
  async countActiveLoansForMember(memberId: string): Promise<number> {
    return this.prisma.loan.count({
      where: {
        memberId,
        returnedAt: null
      }
    });
  }
}
