import { BaseModel } from './BaseModel';
import type { MemberData } from '../types/member.types';
import { MAX_LOANS_PER_MEMBER } from '../constants/libraryConstants';

export class MemberModel extends BaseModel<MemberData> {
  private currentLoans: number = 0;
  
  constructor(data: MemberData) {
    super(data);
  }
  
  get id(): string { return this.data.id; }
  get email(): string { return this.data.email; }
  get name(): string { return this.data.name; }
  get status(): string { return this.data.status; }
  
  setCurrentLoans(count: number): void {
    this.currentLoans = count;
  }
  
  canBorrow(): boolean {
    return (
      this.data.status === 'ACTIVE' &&
      this.currentLoans < MAX_LOANS_PER_MEMBER
    );
  }
  
  getRemainingLoanCapacity(): number {
    return Math.max(0, MAX_LOANS_PER_MEMBER - this.currentLoans);
  }
  
  suspend(): void {
    this.update({ status: 'SUSPENDED' });
  }
  
  activate(): void {
    this.update({ status: 'ACTIVE' });
  }
  
  toJSON(): object {
    return {
      ...this.getData(),
      currentLoans: this.currentLoans,
      remainingCapacity: this.getRemainingLoanCapacity()
    };
  }
}
