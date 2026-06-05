# Sunshine Liquor Store - Server

Express.js + TypeScript + Prisma backend for bottle deposit management system.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL (via Prisma ORM)
- **Validation**: Zod

## Project Structure

```
server/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Route handlers
│   │   ├── deposits.controller.ts
│   │   ├── returns.controller.ts
│   │   ├── customers.controller.ts
│   │   └── stats.controller.ts
│   ├── middleware/            # Express middleware
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   ├── routes/                # API routes
│   │   ├── deposits.ts
│   │   ├── returns.ts
│   │   ├── customers.ts
│   │   └── stats.ts
│   ├── lib/                   # Utilities
│   │   └── prisma.ts          # Prisma client
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   ├── index.ts               # App entry point
│   ├── .env                   # Environment variables
│   └── .env.example           # Example env file
├── package.json
├── tsconfig.json
└── .gitignore
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp src/.env.example src/.env
   # Edit src/.env with your database credentials
   ```

3. **Setup database**:
   ```bash
   npm run prisma:push
   npm run prisma:generate
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm run prisma:push` - Push schema changes to database
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:studio` - Open Prisma Studio GUI

## API Endpoints

### Deposits
- `GET /api/deposits` - Get all deposits
- `POST /api/deposits` - Create new deposit(s)

### Returns
- `PATCH /api/deposits/:id/return` - Mark bottles as returned

### Customers
- `GET /api/customers/search?q={query}` - Search customers by name/phone

### Stats
- `GET /api/stats` - Get dashboard statistics

### Health
- `GET /api/health` - Server health check

## Environment Variables

```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL="mysql://user:password@localhost:3306/sunshine_liquor"
```

## Database Schema

The database uses a single `Deposit` model with the following key fields:

- `transactionId` - Groups multiple items in same transaction
- `fullName`, `phoneNumber` - Customer information
- `itemType`, `bottlesTaken` - Item details
- `depositPerBottle`, `totalDeposit` - Deposit amounts
- `returned`, `returnedDate` - Return tracking
- `regularCustomer` - Customer status flag

## Development Notes

- TypeScript strict mode enabled
- Prisma handles all database operations
- CORS configured for client communication
- Error handling middleware for consistent error responses
- Zod validation on critical endpoints
