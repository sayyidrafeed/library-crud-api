import { MemberModel } from '../models/MemberModel';

export interface MemberResponseDTO {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  status: string;
  currentLoans: number;
  remainingCapacity: number;
  createdAt: string;
}

export class MemberView {
  static render(member: MemberModel): MemberResponseDTO {
    const data = member.getData();
    const jsonData = member.toJSON() as MemberResponseDTO;
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      address: data.address,
      status: data.status,
      currentLoans: jsonData.currentLoans || 0,
      remainingCapacity: member.getRemainingLoanCapacity(),
      createdAt: data.createdAt.toISOString()
    };
  }
  
  static renderList(members: MemberModel[]): MemberResponseDTO[] {
    return members.map(member => this.render(member));
  }
  
  static renderError(message: string): { error: string } {
    return { error: message };
  }
}
