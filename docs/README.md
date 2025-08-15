# Melbourne Parking Website Documentation

## 📚 Table of Contents

### [Project Overview](./PROJECT_OVERVIEW.md)
- Project description and goals
- Technology stack
- Architecture overview

### [Development Guide](./DEVELOPMENT.md)
- Setup instructions
- Development workflow
- Code standards

### [API Documentation](./API.md)
- Backend API endpoints
- Data models
- Request/response formats

### [Data Integration](./MELBOURNE_DATA_INTEGRATION_PLAN.md)
- Melbourne Open Data integration
- Data sources and APIs
- Integration phases

### [Deployment](./DEPLOYMENT.md)
- Railway deployment guide
- Environment configuration
- Production setup

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Parking-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   npm run dev:all
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
Parking-website/
├── src/                    # Frontend Vue.js application
│   ├── components/         # Vue components
│   ├── config/            # Configuration files
│   ├── constants/         # Application constants
│   └── utils/             # Utility functions
├── backend/               # Node.js/Express.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Backend utilities
│   └── data/              # Static data files
├── public/                # Static assets
├── docs/                  # Documentation
└── deploy/                # Deployment configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:all` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
