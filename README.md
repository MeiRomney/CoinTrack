# CoinTrack 🪙

A full-stack cryptocurrency tracking dashboard built with modern web technologies. Track your crypto portfolio, monitor market trends, and manage your investments in one place.

---
<img width="1900" height="902" alt="image" src="https://github.com/user-attachments/assets/45e36a6f-3c7a-43ed-916b-1d5477a2f6e8" />

---

<img width="1902" height="903" alt="image" src="https://github.com/user-attachments/assets/c02f41fe-cdf9-48ff-b093-a702adea96b1" />

---

## ✨ Features

### 📊 Dashboard & Analytics

- **Real-time Crypto Data** - Track top cryptocurrencies by market cap
- **Portfolio Tracking** - Monitor your holdings and asset allocation
- **Interactive Charts** - Visualize price trends and portfolio performance with Recharts
- **Market Insights** - 24h and 7d price changes, market data analysis

### 👤 User Management

- **Authentication** - OAuth 2.0 support with Mock Provider for testing
- **User Profiles** - Manage personal information and preferences
- **Account Settings** - Customize application preferences and notifications
- **Secure API** - Token-based authentication with JWT validation

### 🌐 Web3 Integration

- **Web3 Support** - Ethers.js and Viem integration for blockchain interaction
- **Wallet Integration** - RainbowKit and Wagmi for wallet connections
- **Crypto APIs** - CoinGecko integration for real-time market data

### 📱 User Experience

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **PWA Ready** - Progressive Web App capabilities
- **Hot Reload** - Fast development experience with Vite HMR
- **Component Library** - 20+ reusable UI components
- **Dark Mode Ready** - Theme context support

## 🛠️ Technology Stack

### Backend

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js 5.x
- **Database:** Supabase (PostgreSQL)
- **Storage:** AWS S3
- **Caching:** Redis with ioredis
- **Security:** Helmet, CORS, Rate Limiting
- **APIs:** CoinGecko, OAuth providers
- **Validation:** Zod schema validation
- **Documentation:** Swagger/OpenAPI with swagger-ui-express
- **Web3:** Ethers.js, Web3.js

### Frontend

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **State Management:** React Context API, TanStack Query
- **Routing:** React Router 7
- **Forms:** React Hook Form
- **Charts:** Recharts
- **UI Components:** Headless UI, Heroicons, Lucide React
- **Animations:** Framer Motion
- **Web3:** RainbowKit, Wagmi, Viem, Ethers.js
- **HTTP Client:** Axios with interceptors

## 📋 Prerequisites

- **Node.js:** 18.0.0 or higher
- **npm:** 9.0.0 or higher
- **Git:** For version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cointrack.git
cd cointrack
```

### 2. Environment Setup

Create `.env` files in both backend and frontend directories:

**Backend (`.env`):**

```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
REDIS_URL=redis://localhost:6379
```

**Frontend (`.env`):**

```env
VITE_API_URL=http://localhost:3001
VITE_COINGECKO_API=https://api.coingecko.com/api/v3
```

### 3. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:3001`

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📁 Project Structure

```
cointrack/
├── backend/                          # Express.js server
│   ├── src/
│   │   ├── auth/                     # OAuth & authentication
│   │   ├── routes/                   # API endpoints
│   │   │   ├── account-routes.ts     # Account management
│   │   │   ├── wallet-routes.ts      # Wallet operations
│   │   │   ├── routes-crypto.ts      # Crypto data
│   │   │   └── routes-portfolio.ts   # Portfolio endpoints
│   │   ├── services/                 # Business logic
│   │   ├── middleware/               # Express middleware
│   │   ├── config/                   # Configuration files
│   │   ├── utils/                    # Helper utilities
│   │   └── index.ts                  # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/                         # React + Vite app
│   ├── src/
│   │   ├── components/               # React components
│   │   ├── pages/                    # Page components
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── services/                 # API services
│   │   ├── contexts/                 # React contexts
│   │   ├── api/                      # HTTP client
│   │   └── App.tsx                   # Main app component
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md                         # This file
```

## 🔗 API Endpoints

### Health & Status

```
GET  /health                  # Server health check
```

### Authentication

```
GET  /api/test/anonymous      # Public endpoint (no auth)
GET  /api/test/authenticated  # Requires valid token
GET  /api/test/authorized     # Requires specific scope
```

### Cryptocurrency Data

```
GET  /api/crypto/top?limit=10 # Top cryptos by market cap
```

**Query Parameters:**

- `limit` (1-100, default: 10) - Number of results

### Portfolio

```
GET  /api/portfolio           # User portfolio holdings
```

### Account Management (Requires Authentication)

```
GET    /api/account/profile         # Fetch user profile
PUT    /api/account/profile         # Update profile
GET    /api/account/preferences     # Fetch preferences
PUT    /api/account/preferences     # Update preferences
POST   /api/account/deactivate      # Deactivate account
```

### Wallets

```
GET    /api/wallet                  # List user wallets
POST   /api/wallet                  # Create wallet
PUT    /api/wallet/:id              # Update wallet
DELETE /api/wallet/:id              # Delete wallet
```

## 🔐 Authentication

The application supports OAuth 2.0 with a mock provider for development:

- **OAuth Provider Factory** - Supports multiple OAuth providers
- **Token Validation** - JWT token validation middleware
- **PKCE Support** - Proof Key for Code Exchange implementation
- **Mock Provider** - Testing without external OAuth provider

### Using Auth in Components

```typescript
import { useAuth } from './contexts/auth-context';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
```

## 🎨 Available Pages

- **Landing Page** (`/`) - Marketing overview
- **Dashboard** (`/dashboard`) - Main crypto dashboard
- **Portfolio** (`/portfolio`) - Portfolio management
- **Crypto** (`/crypto`) - Market data explorer
- **Pricing** (`/pricing`) - Subscription plans
- **Profile** (`/profile`) - User profile editor
- **Settings** (`/settings`) - User preferences

## 📦 Build & Deployment

### Backend Build

```bash
cd backend
npm run build        # Compile TypeScript
npm run start        # Run compiled code
```

### Frontend Build

```bash
cd frontend
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🧪 Development

### Backend Development

```bash
cd backend
npm run dev          # Start with auto-reload (nodemon + tsx)
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start with HMR
npm run lint         # Run ESLint
```

## 🔄 API Client Usage

The frontend includes a pre-configured Axios client with auth interceptor:

```typescript
import { apiClient } from "./api/client";

// Authenticated requests automatically include token
const { data } = await apiClient.get("/api/account/profile");

// POST example
const response = await apiClient.post("/api/portfolio", portfolioData);
```

## 🎯 Key Features Implemented

✅ Full TypeScript support (backend & frontend)  
✅ OAuth 2.0 authentication  
✅ Real-time crypto market data  
✅ Portfolio tracking with visualization  
✅ User account management  
✅ Responsive design  
✅ Error handling & logging  
✅ Rate limiting & security headers  
✅ CORS configuration  
✅ PWA support  
✅ Web3 wallet integration  
✅ Swagger API documentation

## 📝 API Documentation

Swagger documentation is available at `http://localhost:3001/api-docs` when running the backend.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Backend won't start

- Ensure port 3001 is available
- Check `.env` file is properly configured
- Verify Node.js version is 18+

### Frontend won't compile

- Delete `node_modules` and run `npm install` again
- Clear Vite cache: `rm -rf .vite`
- Check TypeScript errors: `tsc --noEmit`

### API requests failing

- Verify backend is running on port 3001
- Check browser console for CORS errors
- Ensure `.env` variables are set correctly
- Verify authentication token is valid

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/)
- [CoinGecko API](https://docs.coingecko.com/reference/introduction)
- [Wagmi Documentation](https://wagmi.sh/)
- [Ethers.js Documentation](https://docs.ethers.org/)

## 📧 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for crypto enthusiasts**
