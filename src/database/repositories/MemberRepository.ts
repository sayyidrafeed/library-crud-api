import { PrismaClient, type Member, type Prisma, MemberStatus } from '@prisma/client';

export interface MemberFilters {
  status?: MemberStatus;
  search?: string;
}

export class MemberRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string): Promise<Member | null> {
    return this.prisma.member.findUnique({ where: { id } });
  }
  
  async findByEmail(email: string): Promise<Member | null> {
    return this.prisma.member.findUnique({ where: { email } });
  }
  
  async findAll(
    filters: MemberFilters,
    page: number,
    pageSize: number
  ): Promise<{ members: Member[]; total: number }> {
    const where: Prisma.MemberWhereInput = {};
    
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    const [members, total] = await Promise.all([
      this.prisma.member.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.member.count({ where })
    ]);
    
    return { members, total };
  }
  
  async create(data: Prisma.MemberCreateInput): Promise<Member> {
    return this.prisma.member.create({ data });
  }
  
  async update(id: string, data: Prisma.MemberUpdateInput): Promise<Member> {
    return this.prisma.member.update({ where: { id }, data });
  }
  
  async delete(id: string): Promise<void> {
    await this.prisma.member.delete({ where: { id } });
  }
  
  async count(): Promise<number> {
    return this.prisma.member.count();
  }
  
  async countByStatus(status: MemberStatus): Promise<number> {
    return this.prisma.member.count({ where: { status } });
  }
}
