# Library Management System - Backend

A full-featured Library Management System backend implementing the **Model-View-Controller (MVC)** architecture pattern using Bun, Hono, Prisma, and PostgreSQL.

## Architecture Overview

This project follows the **MVC (Model-View-Controller)** architectural pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                        │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      CONTROLLER                             │
│  • Receives HTTP requests                                   │
│  • Validates input format                                   │
│  • Coordinates Model and View                               │
└─────────────────────────────────────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│        MODEL            │◄────┤    Observes changes     │
│  • Business logic       │     │    (Notification)       │
│  • Data validation      │     └─────────────────────────┘
│  • State management     │
│  • Notifies observers   │
└─────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        VIEW                                 │
│  • Formats data for API responses                           │
│  • Transforms models to DTOs                                │
│  • Handles serialization                                    │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Files |
|-----------|---------------|-------|
| **Model** | Data & Business Logic | `src/models/*.ts` |
| **View** | API Response Formatters | `src/views/*.ts` |
| **Controller** | Request Handling & Coordination | `src/controllers/*.ts` |
| **Repository** | Data Persistence | `src/database/repositories/*.ts` |

## Tech Stack

- **Runtime**: Bun v1.3.8
- **Framework**: Hono v4.11.8
- **ORM**: Prisma with PostgreSQL
- **Validation**: Zod
- **Language**: TypeScript

## Project Structure

```
backend/
├── src/
│   ├── models/              # Model Layer - Data & Business Logic
│   │   ├── BaseModel.ts     # Observable pattern base class
│   │   ├── BookModel.ts     # Book entity with business rules
│   │   ├── MemberModel.ts   # Member entity with loan limits
│   │   └── LoanModel.ts     # Loan entity with due dates
│   │
│   ├── views/               # View Layer - API Response Formatters
│   │   ├── BookView.ts      # Book DTO formatting
│   │   ├── MemberView.ts    # Member DTO formatting
│   │   ├── LoanView.ts      # Loan DTO formatting
│   │   └── DashboardView.ts # Dashboard stats formatting
│   │
│   ├── controllers/         # Controller Layer - Request Handlers
│   │   ├── BookController.ts
│   │   ├── MemberController.ts
│   │   ├── LoanController.ts
│   │   ├── DashboardController.ts
│   │   └── SearchController.ts
│   │
│   ├── routes/              # Route Definitions
│   │   ├── bookRoutes.ts
│   │   ├── memberRoutes.ts
│   │   ├── loanRoutes.ts
│   │   └── dashboardRoutes.ts
│   │
│   ├── middleware/          # HTTP Middleware
│   │   ├── validation.ts    # Zod validation schemas
│   │   └── errorHandler.ts  # Global error handling
│   │
│   ├── database/            # Data Persistence
│   │   └── repositories/    # Prisma repositories
│   │
│   ├── types/               # Shared Types
│   ├── utils/               # Utility Functions
│   ├── constants/           # Application Constants
│   └── app.ts               # Application Entry Point
│
├── prisma/
│   └── schema.prisma        # Database Schema
│
├── docker-compose.yml       # PostgreSQL & pgAdmin
└── package.json
```

## Quick Start

### 1. Install Dependencies

```bash
cd backend
bun install
```

### 2. Start PostgreSQL

```bash
# Start PostgreSQL and pgAdmin in Docker
bun run db:up
```

### 3. Setup Database

```bash
# Run migrations
bun run db:migrate

# Generate Prisma client
bun run db:generate
```

### 4. Run the Application

```bash
# Development mode with hot reload
bun run dev

# Or production mode
bun run start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Books
- `GET /api/books` - List all books (with pagination & filters)
- `GET /api/books/search?q={query}` - Search books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book
- `PATCH /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Members
- `GET /api/members` - List all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create new member
- `PATCH /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member
- `POST /api/members/:id/suspend` - Suspend member
- `POST /api/members/:id/activate` - Activate member

### Loans
- `GET /api/loans` - List all loans
- `POST /api/loans/borrow` - Borrow a book
- `POST /api/loans/:id/return` - Return a book
- `POST /api/loans/:id/renew` - Renew a loan
- `GET /api/loans/member/:memberId` - Get member's loans
- `GET /api/loans/overdue` - Get overdue loans

### Dashboard
- `GET /api/dashboard/stats` - Get library statistics
- `GET /api/dashboard/activity` - Get recent activity

### Search
- `GET /api/search?q={query}` - Search books
- `GET /api/search/genre/:genre` - Search by genre

### Health
- `GET /health` - Health check

## Business Rules

1. **Loan Limits**: Members can borrow maximum 5 books at a time
2. **Loan Period**: 14 days, renewable once if not reserved
3. **Overdue Blocking**: Overdue books block new borrowing
4. **Book Status**: AVAILABLE → BORROWED → AVAILABLE
5. **Member Status**: ACTIVE, SUSPENDED, INACTIVE

## Database Schema

### Book
- `id`: UUID (PK)
- `isbn`: String (Unique)
- `title`: String
- `author`: String
- `description`: String (Optional)
- `genre`: String
- `publishedYear`: Int (Optional)
- `status`: BookStatus (AVAILABLE, BORROWED, RESERVED)

### Member
- `id`: UUID (PK)
- `email`: String (Unique)
- `name`: String
- `phone`: String (Optional)
- `address`: String (Optional)
- `status`: MemberStatus (ACTIVE, SUSPENDED, INACTIVE)
- `maxLoans`: Int (Default: 5)

### Loan
- `id`: UUID (PK)
- `bookId`: UUID (FK)
- `memberId`: UUID (FK)
- `borrowedAt`: DateTime
- `dueDate`: DateTime
- `returnedAt`: DateTime (Optional)
- `renewed`: Boolean (Default: false)

## Observable Pattern

The Model layer implements the Observer pattern:

```typescript
// Models notify observers when data changes
class BookModel extends BaseModel<BookData> {
  borrow(): void {
    if (!this.canBeBorrowed()) {
      throw new Error('Book is not available');
    }
    this.update({ status: 'BORROWED' }); // Notifies observers
  }
}

// Controllers can subscribe to changes
const unsubscribe = bookModel.subscribe((data) => {
  console.log('Book updated:', data);
});
```

## Development Commands

```bash
# Start development server
bun run dev

# Run database migrations
bun run db:migrate

# Open Prisma Studio
bun run db:studio

# Run tests
bun run test

# Type checking
bun run lint
```

## Docker Services

- **PostgreSQL**: Port 5432
  - Database: `library_db`
  - User: `library`
  - Password: `library_pass`
  
- **pgAdmin**: Port 5050
  - Email: `admin@library.com`
  - Password: `admin`

## License

MIT
