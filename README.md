# 🚀 Full-Stack Web Designer Portfolio

A high-performance, full-stack portfolio and landing page engine built with the **React (Vite), Supabase, and Cloudinary** stack. This project features a custom Admin Panel, User Authentication, and automated media optimization.

![Vercel Deployment](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-1C1C1C?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

- **Dynamic Landing Page:** Optimized for high conversion with modern UI/UX.
- **Full-Stack Blog & Portfolio:** Manage posts and projects via a secure backend.
- **User Authentication:** Secure signup/login powered by **Supabase Auth**.
- **Admin Dashboard:** Private interface to update FAQ, Reviews, and Portfolio items.
- **Automated Media:** Images are hosted and optimized using the **Cloudinary API**.
- **Business Tools:** Built-in Analytics, Contact Forms, and Payment Gateway readiness.

---

## 🛠️ Installation & Local Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository
```bash

git clone [https://github.com/arman-ali-khan/full-stack-web-designer-portfolio.git](https://github.com/arman-ali-khan/full-stack-web-designer-portfolio.git)
cd full-stack-web-designer-portfolio

2. Install Dependencies
Bash

npm install
3. Setup Environment Variables
Create a file named .env in the root directory and add your credentials.

Note: Since this is a Vite project, variables must be prefixed with VITE_ to be accessible in the frontend.

Code snippet

# Supabase Configuration
VITE_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
4. Run Development Server
Bash

npm run dev
The app will be available at http://localhost:5173.

🌍 Deployment (Vercel)
When deploying to Vercel, ensure you add the Environment Variables in the Vercel Dashboard:

Go to Settings > Environment Variables.

Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.

Add VITE_CLOUDINARY_CLOUD_NAME.

Redeploy the project to inject the new variables.

📂 Project Structure
Plaintext

├── src/
│   ├── components/    # Reusable UI components (Navbar, Footer, Button)
│   ├── lib/           # Supabase & Cloudinary client configurations
│   ├── pages/         # Main views (Home, Portfolio, Admin Dashboard)
│   ├── types/         # TypeScript interfaces/types
│   └── assets/        # Static images and icons
├── public/            # Public assets
└── .env               # Environment variables (ignored by git)
🔒 Security (Supabase RLS)
This project uses Row Level Security (RLS). To protect your data:

Enable RLS on all tables (services, skills, testimonials).

Create a policy: Enable read access for all users.

Create a policy: Enable all access for authenticated users only (for Admin updates).

🤝 Contact
Arman Ali Khan 📧 sparmankhan@gmail.com



### Why this is better:
* **Vite Instructions:** Specifically warns users about the `VITE_` prefix and `import.meta.env` requirement.
* **Vercel Guide:** Explicitly mentions the "Redeploy" step, which is where most beginners fail.
* **Visual Hierarchy:** Uses directory trees and code blocks to make it easy for other developers to read.

**Would you like me to create a `supabase_schema.sql` file content that you can include in your repo so users can set up their database with one click?**
