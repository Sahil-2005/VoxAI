# VoxAI - Intelligent Voice Agents Platform

A premium AI-powered voice agent platform that enables businesses to deploy intelligent voice agents in minutes.

## Features

- 🤖 **AI Voice Agents** - Create and manage intelligent voice agents
- 📞 **Twilio Integration** - Seamless phone call capabilities
- 📊 **Analytics Dashboard** - Track calls, minutes, and performance
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt
- 🎨 **Premium UI** - Modern dark theme with smooth animations

## Tech Stack

### Frontend
- React 19 + Vite
- TailwindCSS 4
- Framer Motion (animations)
- Lucide React (icons)
- React Router DOM
- Axios

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)

## Project Structure

```
VoiceAgent/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── App.jsx         # Main app component
│   └── package.json
│
├── server/                 # Backend Node.js API
│   ├── config/             # Database & constants
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth & error handling
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Twilio Account (optional, for calls)

### Installation

1. **Clone the repository**
```bash
cd VoiceAgent
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Configure environment variables**

Server (.env):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/voxai
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

Client (.env):
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start the development servers**

```bash
# Start backend (from server folder)
npm run dev

# Start frontend (from client folder)
npm run dev
```

5. **Open the application**
Navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/twilio` - Update Twilio config

### Voice Agents (Bots)
- `GET /api/bots` - Get all bots
- `POST /api/bots` - Create new bot
- `GET /api/bots/:id` - Get single bot
- `PUT /api/bots/:id` - Update bot
- `DELETE /api/bots/:id` - Delete bot
- `GET /api/bots/stats/dashboard` - Get dashboard stats

## License

MIT License - © 2026 VoxAI Inc.
