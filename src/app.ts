import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';

// Repositories
import { BookRepository } from './database/repositories/BookRepository';
import { MemberRepository } from './database/repositories/MemberRepository';
import { LoanRepository } from './database/repositories/LoanRepository';

// Controllers
import { BookController } from './controllers/BookController';
import { MemberController } from './controllers/MemberController';
import { LoanController } from './controllers/LoanController';
import { DashboardController } from './controllers/DashboardController';
import { SearchController } from './controllers/SearchController';

// Routes
import { createBookRoutes } from './routes/bookRoutes';
import { createMemberRoutes } from './routes/memberRoutes';
import { createLoanRoutes } from './routes/loanRoutes';
import { createDashboardRoutes } from './routes/dashboardRoutes';
import { createSearchRoutes } from './routes/searchRoutes';

// Middleware
import { errorHandler } from './middleware/errorHandler';

// Database setup
const prisma = new PrismaClient();

// Repositories
const bookRepository = new BookRepository(prisma);
const memberRepository = new MemberRepository(prisma);
const loanRepository = new LoanRepository(prisma);

// Controllers (MVC Coordination Layer)
const bookController = new BookController(bookRepository);
const memberController = new MemberController(memberRepository, loanRepository);
const loanController = new LoanController(loanRepository, bookRepository, memberRepository);
const dashboardController = new DashboardController(bookRepository, memberRepository, loanRepository);
const searchController = new SearchController(bookRepository);

// Application
const app = new Hono();

// Middleware
app.use('/*', cors());

// Routes
app.route('/api/books', createBookRoutes(bookController));
app.route('/api/members', createMemberRoutes(memberController));
app.route('/api/loans', createLoanRoutes(loanController));
app.route('/api/dashboard', createDashboardRoutes(dashboardController));
app.route('/api/search', createSearchRoutes(searchController));

// Health check
app.get('/health', (c) => c.json({ 
  status: 'ok', 
  timestamp: new Date().toISOString(),
  service: 'library-management-system'
}));

// Error handling
app.onError(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing database connection...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing database connection...');
  await prisma.$disconnect();
  process.exit(0);
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch
};
