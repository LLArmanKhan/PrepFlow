# 🚀 PrepFlow

### Your Intelligent Placement & Learning Companion

> **One workspace. One roadmap. One step closer to your dream placement.**

PrepFlow is an all-in-one interview preparation platform built for students and aspiring software engineers. It brings **coding progress, personalized goals, CS fundamentals, AI-powered learning, and placement preparation** into one focused dashboard.

Stop jumping between spreadsheets, coding platforms, notes, and scattered resources. **PrepFlow keeps your entire preparation journey in one place.**

---

## ✨ Why PrepFlow?

Preparing for placements isn't just about solving more problems.

You need to:

* 🧑‍💻 Stay consistent with coding
* 🎯 Set realistic and measurable goals
* 📚 Strengthen core CS fundamentals
* 🤖 Get answers to technical doubts
* 🧠 Test your understanding
* 📈 Know exactly where you need improvement

**PrepFlow combines all of these into a single intelligent workspace.**

---

## 🌟 Key Features

### 🤖 AI Interview Mentor

Powered by **Google Gemini**, the built-in AI assistant acts as your personal technical mentor.

* 💬 Ask technical questions
* 📖 Generate concept summaries
* 🧠 Get topic-wise explanations
* 🎤 Practice interview-style Q&A
* 📝 Take AI-generated mock assessments
* 💡 Receive actionable revision feedback

---

### 🔥 Coding & Streak Analytics

Stay consistent with your competitive programming journey.

* 🔗 Sync your GeeksforGeeks profile
* 🔥 Track POTD streaks
* ✅ Monitor solved problems
* 📊 Analyze difficulty distribution
* 📈 Visualize your coding progress

> Turn daily problem solving into a habit — and your habit into interview readiness.

---

### 🎯 Personalized Goal Management

Create preparation goals that actually fit **your placement timeline**.

Examples:

```text
🎯 Solve 150 LeetCode Medium Problems
🎯 Complete 30 DBMS Concepts
🎯 Finish Operating Systems Revision
🎯 Solve 100 DSA Problems Before Placement Season
```

Each goal supports:

* 🎨 Custom accent colors
* 📅 Target deadlines
* 📊 Real-time progress tracking
* 🔄 Progress updates
* 🏆 Milestone-based preparation

---

### 📚 Subject-Wise Progress Tracker

Master the CS fundamentals that frequently appear in technical interviews.

Currently covering:

| Subject              | Tracking              |
| -------------------- | --------------------- |
| 💻 Operating Systems | Chapters + completion |
| 🗄️ DBMS             | Concepts + completion |
| 🌐 Computer Networks | Chapters + completion |
| 🧩 OOPs              | Concepts + completion |

Mark chapters as completed and track your overall subject readiness from a single dashboard.

---

### 🧠 AI Skill Validation

Don't just read concepts — **test whether you actually understand them.**

PrepFlow can generate intelligent assessments based on your preparation and provide:

* 📋 Topic-wise questions
* 🎯 Readiness evaluation
* ❌ Weak-area identification
* 💡 Personalized feedback
* 🔄 Recommended revision areas

---

### 🔐 Secure Authentication

PrepFlow follows a layered backend architecture with security in mind.

* 🔑 JWT authentication
* ♻️ Access/refresh token rotation
* 🍪 Secure cookie handling
* 🛡️ Request validation middleware
* 🔒 Password encryption
* 🚨 Centralized error handling
* 🌐 Configurable CORS

---

### 🌓 Modern & Responsive UI

Designed to keep your preparation distraction-free.

* 🌙 Dark mode
* ☀️ Light mode
* 📱 Responsive layouts
* 🎨 Tailwind CSS
* ⚡ Vite-powered frontend
* ✨ Lucide icons
* 🧩 Reusable React components

---

# 🖥️ Dashboard

> Add screenshots/GIFs of your application here.

```text
┌─────────────────────────────────────────────────────────────┐
│                         PREPFLOW                            │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  Dashboard   │   🔥 Coding Streak      🎯 Goals            │
│              │                                              │
│  Goals       │   ┌──────────────┐     ┌──────────────┐     │
│              │   │     42 🔥    │     │    72%       │     │
│  CP Tracker  │   │   Day Streak │     │   Progress   │     │
│              │   └──────────────┘     └──────────────┘     │
│  Progress    │                                              │
│              │   📚 Subject Progress   🤖 AI Mentor        │
│  AI Mentor   │                                              │
│              │   OS   ███████░░░ 70%                       │
│              │   DBMS █████████░ 90%                       │
│              │   CN   ██████░░░░ 60%                       │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

| Technology           | Purpose                     |
| -------------------- | --------------------------- |
| ⚛️ React.js 18+      | UI development              |
| 🎨 Tailwind CSS      | Styling                     |
| 🧠 React Context API | Global state management     |
| ✨ Lucide React       | Icons                       |
| ⚡ Vite               | Development & build tooling |
| 🌐 Axios             | API communication           |

## Backend

| Technology             | Purpose              |
| ---------------------- | -------------------- |
| 🟢 Node.js             | Runtime              |
| 🚂 Express.js          | REST API             |
| 🧠 Google Gemini API   | AI assistant         |
| 🔐 JWT                 | Authentication       |
| 🍪 Cookie Parser       | Cookie handling      |
| 🛡️ Request Validation | API security         |
| 🏗️ MVC Architecture   | Backend organization |

---

# 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │     PREPFLOW     │
                         │    React + Vite  │
                         └────────┬─────────┘
                                  │
                             REST API
                                  │
                         ┌────────▼─────────┐
                         │    Express.js    │
                         │   MVC Backend    │
                         └────────┬─────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
       ┌─────▼─────┐       ┌──────▼──────┐      ┌────▼─────┐
       │   Auth    │       │    Goals    │      │ Progress │
       │   APIs    │       │    APIs     │      │   APIs   │
       └───────────┘       └─────────────┘      └──────────┘
             │                    │                    │
             └────────────────────┼────────────────────┘
                                  │
                         ┌────────▼────────┐
                         │    Services     │
                         ├─────────────────┤
                         │ Gemini AI       │
                         │ GFG Integration │
                         └─────────────────┘
```

---

# 📂 Project Structure

```text
PrepFlow/
│
├── 📁 Backend/
│   ├── 📁 src/
│   │   ├── 📁 config/          # Database & environment configuration
│   │   ├── 📁 controllers/     # Business logic & request handlers
│   │   ├── 📁 middlewares/     # Authentication & error handling
│   │   ├── 📁 models/          # Database schemas/models
│   │   ├── 📁 routes/          # REST API routes
│   │   ├── 📁 services/        # Gemini AI & GFG integrations
│   │   ├── 📁 utils/           # Helper functions
│   │   ├── 📁 validators/      # Request validation
│   │   └── 📄 app.js           # Express application
│   │
│   ├── 📄 server.js            # Server entry point
│   ├── 📄 .env.example         # Environment template
│   └── 📄 package.json
│
└── 📁 Frontend/
    ├── 📁 src/
    │   ├── 📁 components/      # Reusable UI components
    │   ├── 📁 context/         # Auth & application state
    │   ├── 📁 pages/           # Application pages
    │   ├── 📁 services/        # API service modules
    │   ├── 📄 App.jsx          # Root component
    │   └── 📄 main.jsx         # Application entry
    │
    ├── 📄 index.html
    └── 📄 package.json
```

---

# ⚡ Getting Started

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/LLArmanKhan/PrepFlow.git
cd PrepFlow
```

## 2️⃣ Setup the Backend

```bash
cd Backend
npm install

cp .env.example .env
```

Configure your `.env` file:

```env
PORT=5000
CLIENT_URL=http://localhost:3000

JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the development server:

```bash
npm run dev
```

---

## 3️⃣ Setup the Frontend

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

🎉 **You're ready to start your placement journey!**

---

# 🧭 How to Use PrepFlow

### Step 1 — Create Your Profile

Sign up with:

* Name
* Target role
* College year
* Other required details

Example:

```text
Target Role: SDE Intern
Year: 3rd Year
```

### Step 2 — Connect Your Coding Profile

Add your **GeeksforGeeks username** to sync your coding statistics and POTD streak.

### Step 3 — Create Your Goals

Head to **Goals** and create measurable preparation targets.

```text
Solve 150 DSA Problems
        ↓
██████████████░░░░░░ 72%
```

### Step 4 — Track CS Fundamentals

Use the **Progress** section to work through:

```text
Operating Systems
Database Management Systems
Computer Networks
Object-Oriented Programming
```

### Step 5 — Learn With AI

Use the **AI Assistant** to:

* Ask doubts
* Summarize concepts
* Generate questions
* Practice interviews
* Validate your preparation

---

# 🔌 Core API Endpoints

## 🔐 Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login`    | Authenticate user   |
| `POST` | `/api/auth/logout`   | Logout user         |

## 🎯 Goals

| Method   | Endpoint                | Description   |
| -------- | ----------------------- | ------------- |
| `GET`    | `/api/goals/getAll`     | Get all goals |
| `POST`   | `/api/goals/create`     | Create a goal |
| `PUT`    | `/api/goals/update/:id` | Update a goal |
| `DELETE` | `/api/goals/delete/:id` | Delete a goal |

## 🔥 Coding Progress

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| `POST` | `/api/cp/gfgData` | Sync GFG statistics |

## 🤖 AI Mentor

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| `POST` | `/api/ai/chat` | Chat with AI mentor |

## 📚 Progress

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| `GET`  | `/api/progress/getAll`      | Fetch learning progress |
| `POST` | `/api/progress/addManually` | Add/update progress     |

---

# 🔒 Security

PrepFlow implements multiple layers of backend security:

```text
Client Request
      │
      ▼
┌───────────────────┐
│ Request Validation │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Authentication     │
│ JWT Verification   │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Controller         │
│ Business Logic     │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Service / Database │
└───────────────────┘
```

---

# 🗺️ Roadmap

* [x] 🔐 Authentication system
* [x] 🎯 Goal management
* [x] 📚 Subject progress tracking
* [x] 🤖 AI mentor
* [x] 🔥 GFG progress integration
* [x] 🌓 Dark/light theme
* [ ] 📊 Advanced preparation analytics
* [ ] 🏆 Gamification & achievement badges
* [ ] 📅 AI-powered study planner
* [ ] 🎤 AI mock interviews
* [ ] 📈 Placement readiness score
* [ ] 🏢 Company-specific preparation tracks
* [ ] 📱 Progressive Web App support

---


# 💡 Future Vision

PrepFlow aims to become more than a preparation tracker.

The long-term goal is to create an **AI-powered placement companion** that understands:

```text
Your Skills
     +
Your Goals
     +
Your Coding History
     +
Your CS Knowledge
     +
Your Target Companies
     ↓
Personalized Preparation Roadmap
```

From your first DSA problem to your final technical interview, **PrepFlow is designed to guide the entire journey.**

---

# ❤️ Built For Students, By Student

PrepFlow was created with one simple idea:

> **Your preparation shouldn't feel scattered. Your progress should be visible.**

Whether you're preparing for your first internship, an SDE role, or your dream company, PrepFlow helps you **plan → learn → practice → track → improve**.

---

## ⭐ Support the Project

If PrepFlow helped you with your placement preparation, consider giving the repository a ⭐.

It helps the project reach more students and motivates continued development.

### 🚀 Prepare Smarter. Stay Consistent. Get Placed.

**Built with ❤️ for students and aspiring Software Engineers.**
