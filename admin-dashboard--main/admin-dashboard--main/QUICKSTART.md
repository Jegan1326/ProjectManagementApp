# Quick Start Guide

## 🚀 Start the Application

### 1. Start Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### 2. Start Frontend Development Server
```bash
cd frontend
npm run dev
# Visit http://localhost:5174
```

## 📱 How to Use

### 1. Login
- Click on one of the quick demo login buttons (Manager, HR, Employee)
- Or enter credentials manually:
  - Email: `manager@example.com`
  - Password: `demo123`
  - Role: Select from dropdown

### 2. Dashboard
- View your role and permissions
- See task statistics
- Beautiful snowfall animation in background

### 3. Tasks (if Manager/HR)
- Click "Add Task" button
- Fill in task details
- Assign to team member
- Edit task by clicking edit icon
- Assign task by clicking send icon
- Delete task by clicking trash icon

### 4. Tasks (if Employee)
- View tasks assigned to you
- Mark as completed using checkmark button
- View your task progress

### 5. Trash (if Manager/HR)
- View all deleted tasks
- Restore tasks back to active list
- Permanently delete tasks

## 🎯 Key Features to Try

1. **Try Different Roles**: Log in as Manager, HR, and Employee to see different features
2. **Create Tasks**: Add new tasks with descriptions
3. **Assign Tasks**: Assign tasks to different employees
4. **Update Status**: Change task status as work progresses
5. **Delete & Restore**: Move tasks to trash and restore them
6. **Filter Tasks**: Click filter buttons to view specific task statuses
7. **Notifications**: Every action shows a success notification

## 🎨 UI Features

- **Light Color Scheme**: Soft blues, greens, and gradients
- **Smooth Animations**: Hover effects on all interactive elements
- **Snowfall Effect**: Falling snowflakes on dashboard
- **Responsive Buttons**: Scale up on hover, down on click
- **Toast Notifications**: Popup alerts for actions

## 📋 Demo Accounts

```
Manager:
  Email: manager@example.com
  Password: demo123

HR:
  Email: hr@example.com
  Password: demo123

Employee:
  Email: employee@example.com
  Password: demo123
```

## 🔧 Troubleshooting

### Port Already in Use
If port 5173/5174 is in use, Vite will automatically try the next available port.

### Module Not Found
Make sure you ran `npm install` in both frontend and backend directories.

### Refresh Data
- Local storage is used for demo - data persists on refresh
- Clear localStorage to reset: Open DevTools → Application → Clear All

## 📚 File Reference

- **Login/SignUp**: `frontend/src/pages/Login.jsx`, `SignUp.jsx`
- **Task Management**: `frontend/src/pages/Task.jsx`
- **Dashboard**: `frontend/src/pages/Dashboard.jsx`
- **Components**: `frontend/src/components/`
- **Styling**: `frontend/src/index.css`
- **Authentication**: `frontend/src/context/AuthContext.jsx`

## ✨ Next Time You Open

1. Frontend keeps running: `npm run dev`
2. Backend keeps running: `npm start`
3. Visit `http://localhost:5174`
4. Login with demo account

That's it! You now have a fully functional interactive admin dashboard! 🎉
