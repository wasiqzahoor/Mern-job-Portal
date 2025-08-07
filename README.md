# Mern-job-Portal
A full-stack MERN job portal with roles for Admin, Company, and User.

🔑 Key Features
🌐 General Features
Role-Based Authentication: Har user (Admin, Company, Applicant) ke liye alag-alag signup, login, aur protected routes.
Real-Time Notifications: Socket.IO ka istemal karke users ko foran notifications milte hain (e.g., job application submitted, status updated, interview scheduled).
Responsive Design: Poora application mobile, tablet, aur desktop, teeno par a-one kaam karta hai.
JWT Authentication: Secure authentication ke liye JSON Web Tokens ka istemal.
👨‍💼 Admin Panel
Complete Dashboard: Users, companies, jobs, aur applications ka poora overview.
User Management: Saare users aur companies ko dekhna, manage karna, aur delete karna.
Job Management: Platform par post ki hui saari jobs ko dekhna aur manage karna.
Application Oversight: Saari job applications ko review karna.
🏢 Company (Employer) Portal
Company Profile: Company apni profile (logo, details, etc.) bana aur update kar sakti hai.
Job Management: Apni jobs ko post, edit, aur delete karna.
Application Tracking System (ATS): Apni jobs par aayi hui saari applications ko dekhna, filter karna, aur unka status update karna (e.g., reviewed, rejected, hired).
Interview Scheduling: Applicants ke liye interview schedule karna.
Dedicated Dashboard: Apni jobs aur recent applications ka ek quick overview.
🧑‍🚀 User (Applicant) Portal
User Profile: Ek detailed profile banana jismein resume, profile picture, skills, experience, aur education shaamil hai.
Job Browsing & Searching: Saari available jobs ko browse, search, aur filter karna.
Easy Apply: Sirf ek click se jobs ke liye apply karna.
Application Tracking: Apni saari applications ka status track karna.
Saved Jobs: Jobs ko baad mein apply karne ke liye save karna.
💻 Technology Stack
Frontend	Backend	Database & Authentication
React.js	Node.js	MongoDB with Mongoose
React Router	Express.js	JSON Web Tokens (JWT)
Tailwind CSS	Socket.IO	bcrypt.js (Password Hashing)
Axios	Multer (File Uploads)	Dotenv
React Hook Form	Mongoose	
Socket.IO Client		
