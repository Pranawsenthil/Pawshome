# 🐾 PawsHome - Pet Adoption Platform

## About
PawsHome is a comprehensive full-stack MERN platform built to streamline the pet adoption lifecycle. Our mission is to seamlessly connect rescues and lovingly curated shelters with eager adopters through highly targeted recommendation schemas and fluid real-time applications.

## Features
- 🛡️ **Role-Based Workflows**: Distinctly segmented `adopter` vs. `shelter-admin` dashboards.
- ✨ **Dynamic Application Tracking**: Full visual multi-step forms mapping into timeline-tracked dashboards.
- 🐶 **Intelligent Pet Matching**: Activity and preference-oriented trait-matching quiz analyzing and sorting data via adaptive algorithms.
- ❤️ **Real-time Stateful Operations**: Watchlist interactions, smooth Framer Motion interfaces, and Rechart analytical visualizations.
- 📱 **Robust Responsiveness**: Desktop-first and mobile-responsive collapsible navigation structures.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts, Axios, React Router v6.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, BcryptJS.
- **External Integrations**: Cloudinary (Image Processing), Nodemailer (Status Alerts).

## Getting Started
### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a valid `MONGO_URI`
- Cloudinary credentials & Gmail App Password for SMTP configuration.

### Installation
```bash
# Clone repo
git clone https://github.com/pawshome/pawshome.git

# Install server dependencies
cd server && npm install

# Install client dependencies  
cd ../client && npm install

# Seed database with sample shelters and pets
cd ../server && node seed.js

# Run backend (dev server runs on :5000)
node server.js

# Run frontend (new terminal, runs on :3000)
cd ../client && npm run dev
```

## Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Adopter | test@test.com | test123 |
| Shelter Admin | admin@happypaws.com | admin123 |

## API Endpoints
| HTTP Method | Route | Description | Auth Required |
|-------------|-------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Authenticate user | No |
| GET | `/api/auth/me` | Fetch logged-in context | Yes |
| GET | `/api/pets` | Fetch filtered pets | No |
| GET | `/api/pets/match` | Compute weighted quiz matches | No |
| GET | `/api/pets/mine` | Fetch logged-in shelter's listing | Shelter Admin |
| GET | `/api/pets/:id` | Specific pet details | No |
| POST | `/api/pets` | Create a new pet listing | Shelter Admin |
| POST | `/api/applications` | Create adoption form submission | Adopter |
| GET | `/api/applications/mine` | Retrieve personal applications | Adopter |
| GET | `/api/applications/shelter` | Retrieve applications to admin's shelter | Shelter Admin |
| PUT | `/api/applications/:id/stage` | Push application states structurally | Shelter Admin |
| POST/DEL| `/api/watchlist/:id` | Toggle watchlist properties | Yes |
