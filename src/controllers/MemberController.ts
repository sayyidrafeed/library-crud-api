import { MemberModel } from '../models/MemberModel';
import { MemberView } from '../views/MemberView';
import { MemberRepository } from '../database/repositories/MemberRepository';
import { LoanRepository } from '../database/repositories/LoanRepository';
import type { Context } from 'hono';

export class MemberController {
  constructor(
    private memberRepository: MemberRepository,
    private loanRepository: LoanRepository
  ) {}
  
  async getAll(c: Context) {
    try {
      const query = c.req.query();
      const page = parseInt(query.page || '1');
      const pageSize = parseInt(query.pageSize || '20');
      const filters = {
        status: query.status as any,
        search: query.search
      };
      
      const { members, total } = await this.memberRepository.findAll(filters, page, pageSize);
      
      // Enrich with loan data
      const memberModels = await Promise.all(
        members.map(async (data) => {
          const member = new MemberModel(data);
          const activeLoans = await this.loanRepository.countActiveLoansForMember(data.id);
          member.setCurrentLoans(activeLoans);
          return member;
        })
      );
      
      return c.json({
        members: MemberView.renderList(memberModels),
        total,
        page,
        pageSize
      });
    } catch (error) {
      return c.json(MemberView.renderError('Failed to fetch members'), 500);
    }
  }
  
  async getById(c: Context) {
    try {
      const id = c.req.param('id');
      const memberData = await this.memberRepository.findById(id);
      
      if (!memberData) {
        return c.json(MemberView.renderError('Member not found'), 404);
      }
      
      const member = new MemberModel(memberData);
      const activeLoans = await this.loanRepository.countActiveLoansForMember(id);
      member.setCurrentLoans(activeLoans);
      
      return c.json(MemberView.render(member));
    } catch (error) {
      return c.json(MemberView.renderError('Failed to fetch member'), 500);
    }
  }
  
  async create(c: Context) {
    try {
      const body = await c.req.json();
      
      if (!body.email || !body.name) {
        return c.json(MemberView.renderError('Email and name are required'), 400);
      }
      
      const memberData = await this.memberRepository.create(body);
      const member = new MemberModel(memberData);
      
      return c.json(MemberView.render(member), 201);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return c.json(MemberView.renderError('Member with this email already exists'), 409);
      }
      return c.json(MemberView.renderError('Failed to create member'), 500);
    }
  }
  
  async update(c: Context) {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      
      const existingData = await this.memberRepository.findById(id);
      if (!existingData) {
        return c.json(MemberView.renderError('Member not found'), 404);
      }
      
      const updatedData = await this.memberRepository.update(id, body);
      const member = new MemberModel(updatedData);
      const activeLoans = await this.loanRepository.countActiveLoansForMember(id);
      member.setCurrentLoans(activeLoans);
      
      return c.json(MemberView.render(member));
    } catch (error) {
      return c.json(MemberView.renderError('Failed to update member'), 500);
    }
  }
  
  async delete(c: Context) {
    try {
      const id = c.req.param('id');
      await this.memberRepository.delete(id);
      return c.json({ message: 'Member deleted successfully' });
    } catch (error) {
      return c.json(MemberView.renderError('Failed to delete member'), 500);
    }
  }
  
  async suspend(c: Context) {
    try {
      const id = c.req.param('id');
      
      const memberData = await this.memberRepository.findById(id);
      if (!memberData) {
        return c.json(MemberView.renderError('Member not found'), 404);
      }
      
      const updatedData = await this.memberRepository.update(id, { status: 'SUSPENDED' });
      const member = new MemberModel(updatedData);
      const activeLoans = await this.loanRepository.countActiveLoansForMember(id);
      member.setCurrentLoans(activeLoans);
      
      return c.json(MemberView.render(member));
    } catch (error) {
      return c.json(MemberView.renderError('Failed to suspend member'), 500);
    }
  }
  
  async activate(c: Context) {
    try {
      const id = c.req.param('id');
      
      const memberData = await this.memberRepository.findById(id);
      if (!memberData) {
        return c.json(MemberView.renderError('Member not found'), 404);
      }
      
      const updatedData = await this.memberRepository.update(id, { status: 'ACTIVE' });
      const member = new MemberModel(updatedData);
      const activeLoans = await this.loanRepository.countActiveLoansForMember(id);
      member.setCurrentLoans(activeLoans);
      
      return c.json(MemberView.render(member));
    } catch (error) {
      return c.json(MemberView.renderError('Failed to activate member'), 500);
    }
  }
}
