export interface MemberData {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  status: MemberStatus;
  maxLoans: number;
  createdAt: Date;
  updatedAt: Date;
}

export type MemberStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

export interface CreateMemberRequest {
  email: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface UpdateMemberRequest {
  name?: string;
  phone?: string;
  address?: string;
}
