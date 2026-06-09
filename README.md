# 🎓 Learn@Ease — Full Stack E-Learning Platform

> A modern, feature-rich course-selling and e-learning platform built with the MERN stack. Admins can create and manage courses with video lessons, and students can browse, purchase, and learn at their own pace.

![Learn@Ease Banner](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)

---

## ✨ Features

### 👤 User
- 🔐 Secure signup & signin with JWT authentication
- 📚 Browse all available courses
- 🛒 Purchase courses (no payment gateway — instant enrollment)
- 🎬 Watch video lessons after purchase
- ⭐ Leave reviews and ratings on purchased courses
- 👤 Profile card with account details and delete account option
- 📱 Fully responsive on all screen sizes

### 🛠️ Admin
- 🔐 Separate admin authentication system
- ➕ Create, edit, and delete courses
- 📁 Upload course images via URL or local file
- 🎥 Upload video lessons via URL or local file (up to 500MB)
- 📋 Manage lessons per course (preview and delete)
- 🗑️ Delete any user review
- 👤 Profile card with account details and delete account option

### 🌐 Public
- 🏠 Animated homepage with hero section, features, and auto-sliding reviews
- 🎞️ Demo page with a preview lesson video
- 📖 Courses listing page with skeleton loading
- 🔄 Real user reviews rendered in the homepage slider
- 📱 Mobile-responsive navbar with hamburger menu

---

## 🧰 Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM for MongoDB |
| **JSON Web Token (JWT)** | Authentication |
| **bcrypt** | Password hashing |
| **Multer** | File uploads (images & videos) |
| **Zod** | Input validation |
| **dotenv** | Environment variable management |
| **CORS** | Cross-origin resource sharing |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React** | UI library |
| **Vite** | Build tool |
| **Tailwind CSS** | Styling |
| **React Router DOM** | Client-side routing |
| **Framer Motion** | Animations |
| **Zod** | Form validation |
| **react-icons** | Icon library |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or above)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/learn-at-ease.git
cd learn-at-ease
```

### 2️⃣ Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
DATABASE_URL=your_mongodb_connection_string
JWT_USER_SECRET=your_user_jwt_secret
JWT_ADMIN_SECRET=your_admin_jwt_secret
BASE_URL=http://localhost:3000
PORT=3000
```

Start the backend server:

```bash
node index.js
```

The backend will start on `http://localhost:3000`

### 3️⃣ Setup the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:3000
VITE_DEMO_LESSON_ID=your_demo_lesson_id
VITE_DEMO_COURSE_ID=your_demo_course_id
```

Start the frontend dev server:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend `.env`

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MongoDB connection string |
| `JWT_USER_SECRET` | Secret key for signing user tokens |
| `JWT_ADMIN_SECRET` | Secret key for signing admin tokens |
| `BASE_URL` | Backend base URL for file serving |
| `PORT` | Port to run the backend on |

### Frontend `.env`

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_DEMO_LESSON_ID` | MongoDB ObjectId of the demo lesson |
| `VITE_DEMO_COURSE_ID` | MongoDB ObjectId of the demo course |

---

## 📡 API Reference

### 👤 User Routes — `/api/v1/user`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/signup` | ❌ | Register a new user |
| `POST` | `/signin` | ❌ | Login as user |
| `GET` | `/me` | ✅ | Get logged-in user profile |
| `GET` | `/course/bulk` | ❌ | Get all courses |
| `GET` | `/course/:courseId` | ❌ | Get a single course |
| `GET` | `/purchases` | ✅ | Get user's purchased courses |
| `DELETE` | `/delete-account` | ✅ | Delete user account |

### 🛠️ Admin Routes — `/api/v1/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/signup` | ❌ | Register a new admin |
| `POST` | `/signin` | ❌ | Login as admin |
| `GET` | `/me` | ✅ | Get logged-in admin profile |
| `POST` | `/course/create` | ✅ | Create a new course |
| `PUT` | `/course/update` | ✅ | Update an existing course |
| `DELETE` | `/course/delete/:courseId` | ✅ | Delete a course |
| `GET` | `/course/bulk` | ✅ | Get admin's courses |
| `POST` | `/course/:courseId/lesson` | ✅ | Upload a lesson |
| `GET` | `/course/:courseId/lessons` | ✅ | Get lessons for a course |
| `DELETE` | `/course/:courseId/lesson/:lessonId` | ✅ | Delete a lesson |
| `DELETE` | `/delete-account` | ✅ | Delete admin account |

### 📖 Course Routes — `/api/v1/course`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/purchase` | ✅ | Purchase a course |
| `GET` | `/my-courses` | ✅ | Get user's enrolled courses |
| `GET` | `/check-purchase/:courseId` | ✅ | Check if course is purchased |
| `GET` | `/:courseId/lessons` | ✅ | Get lessons (purchased users only) |
| `GET` | `/:courseId/demo-lesson` | ❌ | Get first lesson as demo |
| `GET` | `/:courseId/lesson-count` | ❌ | Get lesson count |

### ⭐ Review Routes — `/api/v1/review`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/add` | ✅ | Add a review (purchased users only) |
| `GET` | `/all` | ❌ | Get all reviews (for homepage) |
| `GET` | `/:courseId` | ❌ | Get reviews for a course |
| `DELETE` | `/:reviewId` | ✅ Admin | Delete a review |

---

## 🗺️ Page Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage |
| `/courses` | Public | All courses listing |
| `/demo` | Public | Demo video preview |
| `/signin` | Public | Sign in page |
| `/signup` | Public | Sign up page |
| `/admin/dashboard` | Admin only | Admin dashboard |
| `/user/dashboard` | User only | User dashboard |
| `/admin/course/:courseId` | Admin only | Course details (admin view) |
| `/user/course/:courseId` | User only | Course details (user view) |
| `/course/:courseId` | Public | Course details (public view) |
| `/user/course/:courseId/learn` | User only | Course video player |
| `/admin/course/:courseId/lessons` | Admin only | Manage course lessons |

---

## 🧩 Key Features In Depth

### 🎬 Video Upload System
Admins can upload lesson videos either via a URL (YouTube, CDN, etc.) or by uploading a local file directly. Local files are stored in `backend/uploads/lessons/` and served statically. File size limit is 500MB and supported formats are MP4, WebM, MKV, and MOV.

### ⭐ Live Review Slider
The homepage fetches real reviews from the database and displays them in an auto-scrolling slider alongside static placeholder reviews. New reviews submitted by students appear on the homepage automatically.

### 🔒 Role-Based Access Control
Two completely separate authentication systems — one for users and one for admins — each with their own JWT secrets, middleware, and protected routes. The frontend uses `ProtectedRoute` to guard pages based on the role stored in `localStorage`.

### 📱 Responsive Design
The entire application is built mobile-first with Tailwind CSS. The navbar includes a hamburger menu on mobile, course grids collapse to single column, and the course player stacks vertically on smaller screens.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "Add amazing feature"

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```


## 👨‍💻 Author

Built with ❤️ by **Arpan Mondal**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/arpam-1010)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/arpan-mondal03/)

---

> 💡 **Note:** This project is intended for educational purposes. A real payment gateway (like Razorpay or Stripe) should be integrated before deploying to production.
