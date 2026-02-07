import { PrismaClient, type Book, type Prisma, BookStatus } from '@prisma/client';

export interface BookFilters {
  genre?: string;
  status?: BookStatus;
  search?: string;
}

export class BookRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string): Promise<Book | null> {
    return this.prisma.book.findUnique({ where: { id } });
  }
  
  async findAll(
    filters: BookFilters,
    page: number,
    pageSize: number
  ): Promise<{ books: Book[]; total: number }> {
    const where: Prisma.BookWhereInput = {};
    
    if (filters.genre) where.genre = filters.genre;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { author: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.book.count({ where })
    ]);
    
    return { books, total };
  }
  
  async search(
    query: string,
    page: number,
    pageSize: number
  ): Promise<{ books: Book[]; total: number }> {
    return this.findAll({ search: query }, page, pageSize);
  }
  
  async create(data: Prisma.BookCreateInput): Promise<Book> {
    return this.prisma.book.create({ data });
  }
  
  async update(id: string, data: Prisma.BookUpdateInput): Promise<Book> {
    return this.prisma.book.update({ where: { id }, data });
  }
  
  async delete(id: string): Promise<void> {
    await this.prisma.book.delete({ where: { id } });
  }
  
  async count(): Promise<number> {
    return this.prisma.book.count();
  }
  
  async countByStatus(status: BookStatus): Promise<number> {
    return this.prisma.book.count({ where: { status } });
  }
}
