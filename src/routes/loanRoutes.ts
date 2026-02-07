import { Hono } from 'hono';
import { LoanController } from '../controllers/LoanController';
import { validateBorrowRequest } from '../middleware/validation';

export function createLoanRoutes(controller: LoanController): Hono {
  const routes = new Hono();
  
  routes.get('/', (c) => controller.getAllLoans(c));
  routes.post('/borrow', validateBorrowRequest, (c) => controller.borrowBook(c));
  routes.post('/:id/return', (c) => controller.returnBook(c));
  routes.post('/:id/renew', (c) => controller.renewLoan(c));
  routes.get('/member/:memberId', (c) => controller.getMemberLoans(c));
  routes.get('/overdue', (c) => controller.getOverdueLoans(c));
  
  return routes;
}
