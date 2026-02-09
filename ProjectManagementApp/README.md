# Project Management Application

A full-stack Project Management application built using the MERN stack (MongoDB, Express.js, React, Node.js). This application is designed to help teams collaborate, track tasks, and manage projects efficiently.

## 📂 Project Structure

The project is divided into two main components:

### 1. `backend/`
The backend is built with **Node.js** and **Express.js**, connected to a **MongoDB** database. It handles API requests, authentication, and data management.

**Key Directories & Files:**
- `models/`: Mongoose schemas for data models (Users, Projects, Tasks, etc.).
- `routes/`: API route definitions.
- `controllers/`: Logic for handling API requests.
- `middleware/`: Custom middleware (e.g., authentication).
- `utils/`: Utility functions.
- `server.js`: Entry point for the backend server.
- `seed.js`: Script to seed the database with initial data.

### 2. `frontend/`
The frontend is built with **React** and powered by **Vite** for fast development. It provides a responsive user interface for interacting with the application.

**Key Directories:**
- `src/`: Source code for the React application.
- `public/`: Static assets.
- `vite.config.js`: Configuration for Vite.

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running (or a MongoDB Atlas connection string)

### Installation & Running

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in a `.env` file (refer to `.env.example` if available, or configure `PORT` and `MONGO_URI`).
4. Start the server:
   ```bash
   npm run dev
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## ✨ Features
- **User Authentication**: Secure login for Admins, Project Managers, and Employees.
- **Project Management**: Create, update, and manage projects.
- **Task Tracking**: Assign tasks, set deadlines, and track progress.
- **Dashboard**: specialized dashboards for different user roles.
