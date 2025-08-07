# 💼 JobShop - Full-Stack MERN Job Portal 🚀

**JobShop** is a full-fledged job portal built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that provides a robust platform for **Admins**, **Companies (Employers)**, and **Users (Applicants)** with dedicated dashboards, real-time notifications, role-based authentication, and a beautiful responsive UI.

![JobShop Screenshot](path/to/your/screenshot.png) <!-- 🔁 Replace this with your actual image path -->

[🔗 **Live Demo**](https://your-live-demo-link.com) <!-- Add your live link here -->

---

## ✨ Features

### 🌐 General
- 🔐 **Role-Based Authentication** – Separate logins for Admins, Companies, and Users.
- 📩 **Real-Time Notifications** – Instant updates using **Socket.IO**.
- 📱 **Responsive Design** – Fully optimized for mobile, tablet, and desktop.
- 🔑 **JWT Auth** – Secure login & route protection using JSON Web Tokens.

---

### 👨‍💼 Admin Dashboard
- 📊 Overview of users, jobs, companies, and applications.
- 👥 Manage all users & companies.
- 💼 Control and monitor all job posts.
- 📄 Review all job applications.

---

### 🏢 Company (Employer) Portal
- 🏢 Create and update company profile.
- 📝 Post, edit, or delete job listings.
- 🗂️ Track all applications received (ATS System).
- 📅 Schedule interviews with applicants.
- 📊 Quick dashboard view for jobs and applicants.

---

### 🧑‍🚀 User (Applicant) Portal
- 🙋 Create a profile with resume, skills, education, and experience.
- 🔍 Browse & filter job listings.
- ⚡ Apply instantly with a single click.
- 📈 Track the status of all your applications.
- 💾 Save jobs for later.

---

## 🛠️ Tech Stack

| Frontend          | Backend          | Database & Auth       |
|-------------------|------------------|------------------------|
| React.js          | Node.js          | MongoDB + Mongoose     |
| React Router      | Express.js       | JWT (JSON Web Token)   |
| Tailwind CSS      | Socket.IO        | bcrypt.js              |
| Axios             | Multer           | dotenv                 |
| React Hook Form   |                  |                        |

---

## ⚙️ Getting Started

### 📌 Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB Atlas URI

---

### 🔧 Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/your-repo-name.git

# 2. Go to backend folder
cd auth-Backend

# 3. Install dependencies
npm install

# 4. Create a .env file and add:
PORT=4002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

# 5. Start backend server
npx nodemon index.js

### 🔧 Frontend Setup
# 1. Navigate to frontend folder
cd ../auth-Frontend

# 2. Install dependencies
npm install

# 3. Run the frontend server
npm run dev
