# PrepFlow 🚀

### Full-Stack Coding Preparation Platform

PrepFlow is a full-stack platform designed to help developers organize, track, and improve their coding and technical interview preparation in one place.

The project is being developed in multiple phases. **This repository currently contains the PrepFlow Backend V1.0**, which provides the core APIs, authentication, database layer, user management, goals, progress tracking, and an AI-powered assistant.

---

## 📌 Current Version

### PrepFlow Backend V1.0

| Module                     | Status         |
| -------------------------- | -------------- |
| 🔐 Authentication          | ✅ Completed  |
| 🗄️ Database               | ✅ Completed   |
| 👤 Profile                 | ✅ Completed  |
| ⚙️ Settings                | ✅ Completed  |
| 🎯 My Goals                | ✅ Completed  |
| 📈 My Progress             | ✅ Completed  |
| 🤖 My AI Assistant         | 🚧 In Progress|
| 💻 Competitive Programming | 🚧 Upcoming   |

> The Gemini integration for the AI Assistant is currently implemented. Further improvements and personalization are being developed.

---

## ✨ Features

### 🔐 Authentication

Secure user authentication and account management.

* User registration and login
* JWT-based authentication
* Password hashing
* OTP-based verification
* Session management
* Protected routes

### 🗄️ Database

MongoDB is used as the primary database with Mongoose for data modeling and database interaction.

The backend currently manages data for:

* Users
* Sessions
* OTPs
* Goals
* Progress

### 👤 Profile

Users can manage information related to their coding and career preparation.

The profile system stores preparation-related information that can also be used by other PrepFlow features.

### ⚙️ Settings

User-specific settings and preferences are managed through dedicated APIs.

### 🎯 My Goals

The Goals module allows users to create and track coding and preparation goals.

Users can define:

* Goal title
* Description
* Unit
* Current progress
* Target value
* Target date
* Goal status

### 📈 My Progress

The Progress module allows users to track their preparation progress and maintain their development journey over time.

### 🤖 My AI Assistant

PrepFlow includes an AI-powered assistant using **Google Gemini**.

The current implementation integrates Gemini with the backend and is designed to provide personalized assistance using authenticated user context.

The AI Assistant is still under active development, with planned improvements to:

* Personalization
* Response quality
* Preparation-specific guidance
* Context handling
* AI-driven recommendations

### 💻 Competitive Programming

The Competitive Programming section is the next major backend module planned for PrepFlow Backend V1.0.

It will focus on helping users track and manage their competitive programming activity and progress.

---

## 🛠️ Tech Stack

### Backend

* **Node.js** — JavaScript runtime
* **Express.js** — Backend framework
* **MongoDB** — Database
* **Mongoose** — ODM
* **JWT** — Authentication
* **bcrypt** — Password hashing
* **Google Gemini API** — AI Assistant
* **Nodemailer** — Email services

### Development

* Git & GitHub
* VS Code
* Postman

---

## 🏗️ Backend Architecture

PrepFlow follows a modular backend architecture that separates routing, business logic, database models, middleware, configuration, and external services.

```text
                    Client
                      │
                      ▼
                Express Server
                      │
                      ▼
                    Routes
                      │
                      ▼
                 Controllers
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
       Services                Models
          │                       │
    ┌─────┴─────┐                 ▼
    │           │              MongoDB
    ▼           ▼
 Gemini      Email Service
```

### Main Layers

**Routes**

Handle API endpoints and route requests to the appropriate controllers.

**Controllers**

Handle incoming requests, validation, authentication context, and responses.

**Models**

Define MongoDB data structures using Mongoose.

**Middleware**

Handles cross-cutting functionality such as authentication and protected routes.

**Services**

Contains reusable business logic and integrations with external services such as Gemini and email.

**Config**

Contains application configuration and database connection logic.

**Utils**

Contains reusable utility functions.

---

## 📁 Project Structure

```text
Backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── config.js
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── ai.controller.js
│   │   ├── auth.controller.js
│   │   ├── goals.controller.js
│   │   ├── profile.controller.js
│   │   ├── progress.controller.js
│   │   └── setting.controller.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── goal.model.js
│   │   ├── otp.model.js
│   │   ├── progress.model.js
│   │   ├── session.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── ai.routes.js
│   │   ├── auth.routes.js
│   │   ├── goals.routes.js
│   │   ├── profile.routes.js
│   │   ├── progress.routes.js
│   │   └── setting.routes.js
│   │
│   ├── services/
│   │   ├── ai.prompts.txt
│   │   ├── ai.service.js
│   │   └── email.service.js
│   │
│   └── utils/
│       └── util.js
│
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

---

## 🔑 API Modules

The backend currently contains API modules for:

```text
Authentication
      │
      ├── Register
      ├── Login
      ├── OTP Verification
      └── Session Management

Profile
      │
      └── Profile Management

Settings
      │
      └── User Preferences

Goals
      │
      ├── Create Goals
      ├── Track Goals
      └── Update Goal Status

Progress
      │
      └── Preparation Progress

AI Assistant
      │
      └── Gemini-powered assistance

Competitive Programming
      │
      └── Upcoming
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure the following are installed:

* [Node.js](https://nodejs.org/)
* npm
* MongoDB or a MongoDB Atlas database

### 1. Clone the repository

```bash
git clone https://github.com/LLArmanKhan/PrepFlow_.git
cd PrepFlow_
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000

DB_URI=your_mongodb_connection_string

JWT_SECRETKEY=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_ID=your_google_id

GEMINI_API=your_gemini_api_key
```

> **Never commit your `.env` file.** Environment variables contain sensitive credentials and are intentionally excluded from this repository.

### 4. Start the development server

```bash
npm run dev
```

### 5. Start the production server

```bash
npm start
```

The backend runs locally on:

```text
http://localhost:3000
```

---

## 🔐 Security

PrepFlow currently implements several security mechanisms:

* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Session management
* OTP verification
* Environment variables for sensitive credentials
* `.env` excluded from Git tracking

---

## 🧪 Testing APIs

The backend APIs can be tested using tools such as **Postman**.

A typical flow is:

```text
Register
   ↓
OTP Verification
   ↓
Login
   ↓
Receive Authentication Token
   ↓
Access Protected APIs
   ↓
Profile / Settings / Goals / Progress / AI
```

API documentation and a Postman collection will be added as the project progresses.

---

## 🗺️ Development Roadmap

### Phase 1 — Backend V1.0

* [x] Authentication
* [x] MongoDB database integration
* [x] Profile
* [x] Settings
* [x] My Goals
* [x] My Progress
* [x] Gemini integration
* [ ] Improve AI Assistant
* [ ] Competitive Programming section

### Phase 2 — Frontend

The frontend will provide a user-friendly interface for the backend modules.

Planned sections include:

* Authentication
* Dashboard
* Profile
* Settings
* My Goals
* My Progress
* AI Assistant
* Competitive Programming

### Phase 3 — Integration & Deployment

* Connect frontend with backend APIs
* Production deployment
* API documentation
* Testing
* Performance improvements
* Security improvements

---

## 🔮 Future Vision

PrepFlow aims to become a centralized platform for coding and technical interview preparation.

The long-term goal is to bring together:

```text
DSA
│
├── Competitive Programming
├── Progress Tracking
├── Personal Goals
├── Coding Profiles
├── AI Assistance
└── Interview Preparation
```

into a single platform that helps users understand **where they are, what they need to improve, and what they should work on next.**

---

## 👨‍💻 Author

**Arman Khan**

Computer Engineering Student , DBIT , MUMBAI

GitHub: [@LLArmanKhan](https://github.com/LLArmanKhan)

---

## 📌 Project Status

**PrepFlow is actively under development.**

Current focus:

> **Completing PrepFlow Backend V1.0 → Building the Frontend → Full-Stack Integration → Deployment**

---

⭐ If you find the project interesting, feel free to explore the repository and follow its development.
