# Frontend - Project Management System

A modern React frontend for managing projects with role-based access (Admin, Project Manager, Employee).

## Features

- **Authentication**: JWT-based login system
- **Role-based Dashboard**: Different views for Admin, Project Manager, and Employee
- **Project Management**: Create and view projects
- **Responsive Design**: Clean and intuitive UI

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── context/         # React context for state management
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── styles/          # CSS files
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build

```bash
npm run build
```

## Configuration

The frontend is configured to proxy API calls to `http://localhost:5000` by default. Update `vite.config.js` if your backend runs on a different port.

## Environment Variables

No environment variables are required for basic setup. The backend URL is configured in `vite.config.js`.
