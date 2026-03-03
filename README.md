<div align="center">
  # 🎙️ VoxAI
  ### *Intelligent Voice Agents Platform*

  **[🚀 Live Demo](https://voxai-client.vercel.app/)**

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
  [![React Version](https://img.shields.io/badge/React-19-61DAFB.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)

  **A premium AI-powered voice agent platform enabling businesses to deploy intelligent voice agents in seconds.**
</div>

---

## ✨ Features

- 🤖 **AI Voice Agents** — Create, customize, and deploy intelligent voice agents powered by modern LLMs.
- 📞 **Seamless Connectivity** — Integrated with Twilio for crystalline phone call capabilities.
- 📊 **Real-time Analytics** — Professional dashboard to monitor calls, usage, and performance metrics.
- 🔐 **Enterprise Security** — Secure JWT-based authentication with bcrypt password hashing.
- 🎨 **Premium Experience** — Modern, high-performance dark theme with smooth GSAP & Framer Motion animations.

## 🛠️ Tech Stack

<details open>
<summary><b>Frontend</b></summary>

- **Core:** React 19, Vite 6
- **Styling:** TailwindCSS 4
- **Animations:** Framer Motion, GSAP, Lenis (Smooth Scroll)
- **Icons:** Lucide React
- **State/Routing:** React Context API, React Router DOM
</details>

<details open>
<summary><b>Backend</b></summary>

- **Core:** Node.js, Express 5
- **Database:** MongoDB + Mongoose
- **Auth:** JWT, bcryptjs
- **Services:** Twilio API
</details>

---

## 📂 Project Structure

```bash
VoiceAgent/
├── client/                 # Frontend React application (Vite)
│   ├── src/
│   │   ├── components/     # High-end UI components
│   │   ├── context/        # Auth & Application State
│   │   ├── pages/          # Landing, Dashboard, Profile
│   │   └── services/       # API integration layer
├── server/                 # Backend Node.js API
│   ├── config/             # DB & Environment config
│   ├── controllers/        # Business logic
│   ├── models/             # Schema definitions
│   └── routes/             # RESTful endpoints
```

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js** 18.x or higher
- **MongoDB** (Local instance or Atlas)
- **Twilio Account** (For voice agent capabilities)

### ⚙️ Twilio Configuration

> [!IMPORTANT]
> To enable voice capabilities, you must configure your Twilio credentials.

1.  **Sign Up**: Create an account at [Twilio](https://www.twilio.com/try-twilio).
2.  **Get a Number**: Provision a phone number with Voice capabilities.
3.  **Credentials**: Retrieve your `Account SID` and `Auth Token`.
4.  **Verified Caller IDs**: On trial accounts, verify the recipient number in the [Twilio Console](https://console.twilio.com/us1/develop/phone-numbers/manage/verified).

### 🛠️ Installation & Setup

1. **Clone & Navigate**
   ```bash
   git clone <repository-url>
   cd VoxAi
   ```

2. **Environment Configuration**

   Create a `.env` in both `/server` and `/client`:

   **Server (`/server/.env`):**
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   CLIENT_URL=http://localhost:5173
   ```

   **Client (`/client/.env`):**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Install & Launch**
   ```bash
   # In root
   npm install # if using workspaces, or install individually:
   cd server && npm install && npm run dev
   # In a new terminal
   cd client && npm install && npm run dev
   ```

---

## 🌐 API Reference

### 🔐 Authentication
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Create a new user account |
| `/api/auth/login` | `POST` | Authenticate and get JWT |
| `/api/auth/me` | `GET` | Retrieve current user profile |

### 🤖 Voice Agents
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/bots` | `GET` | List all available agents |
| `/api/bots` | `POST` | Deploy a new intelligent agent |
| `/api/bots/:id` | `PUT` | Update agent configuration |
| `/api/bots/stats/dashboard` | `GET` | Fetch performance analytics |

---


## 👨‍💻 Author

<div align="center">
  <h3>Sahil Gawade</h3>

  <p>
    <a href="https://github.com/Sahil-2005"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
    <a href="https://www.linkedin.com/in/sahil-gawade-920a0a242/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
    <a href="mailto:gawadesahil.dev@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"></a>
    <a href="https://sahil-gawade.vercel.app/"><img src="https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio"></a>
  </p>
</div>

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

© 2026 **VoxAI Inc.**
