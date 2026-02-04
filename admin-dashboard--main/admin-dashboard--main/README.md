# Interactive Admin Dashboard

A full-featured admin dashboard with role-based access control, task management, email verification, and beautiful animations.

## 🚀 Features Implemented

### 🔐 Authentication System
- **Login Page**: Email & password authentication with role selection
- **Sign-Up Page**: New user registration with email verification (demo: `123456`)
- **Role-Based Access**: Three roles - Manager, HR, Employee
- **Quick Demo Login**: One-click demo account login for each role
- **Secure Token Storage**: JWT tokens stored in localStorage

### 👥 Role-Specific Permissions

#### Manager
- ✅ Assign tasks to HR and Employees
- ✅ Create new tasks
- ✅ Edit existing tasks
- ✅ Delete tasks (soft delete to trash)
- ✅ View analytics and dashboard
- ✅ Access trash panel

#### HR
- ✅ Assign tasks to Employees
- ✅ Create new tasks
- ✅ Edit existing tasks
- ✅ Delete tasks (soft delete to trash)
- ✅ View analytics
- ✅ Access trash panel

#### Employee
- ✅ View assigned tasks
- ✅ Mark tasks as completed
- ✅ View personal dashboard
- ✅ Cannot manage other tasks

### 📋 Task Management
- **Add Tasks**: Managers and HR can create new tasks with:
  - Title
  - Description
  - Status (To Do, In Progress, Completed)
  - Assignment
- **Edit Tasks**: Update task details and status
- **Assign Tasks**: Assign tasks to specific team members
- **Delete Tasks**: Soft delete moves tasks to trash
- **Mark Complete**: Employees can mark assigned tasks as completed
- **Filter Tasks**: Filter by status (All, To Do, In Progress, Completed)
- **Task Statistics**: Real-time count of tasks in each status

### 🗑️ Trash Management
- **Soft Delete**: Deleted tasks moved to trash, not permanently removed
- **Restore Tasks**: Restore deleted tasks back to active list
- **Permanent Delete**: Permanently remove tasks from trash
- **Trash Panel**: Only accessible to Manager and HR roles

### 🎨 UI/UX Features
- **Light Color Scheme**: Soft blue, indigo, green, and gray gradients
- **Button Transitions**: Smooth hover effects with scale and shadow transitions
- **Animated Notifications**: Toast notifications for success/error messages
- **Snowfall Animation**: Beautiful snowfall effect on dashboard background
- **Responsive Design**: Works on desktop and tablet devices
- **Loading States**: Spinner animation while loading data
- **Modal Forms**: Smooth scale-in animation for modals

### 🎯 Animations & Effects
- **Slide In Down**: Toast notifications slide down smoothly
- **Scale In**: Modals scale up when opened
- **Hover Scale**: Buttons scale up on hover (1.05x)
- **Button Press**: Buttons scale down when clicked (0.98x)
- **Smooth Transitions**: All color and property changes are smooth
- **Snowfall Effect**: Continuous falling snowflakes on dashboard

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          # Login page with role selection
│   │   ├── SignUp.jsx         # Registration with email verification
│   │   ├── Dashboard.jsx      # Main dashboard with snowfall & stats
│   │   ├── Task.jsx           # Task management and filtering
│   │   └── Trash.jsx          # Trash management
│   ├── components/
│   │   ├── sidebar.jsx        # Navigation sidebar with user info
│   │   ├── TaskTabel.jsx      # Task table with actions
│   │   ├── TaskModal.jsx      # Add/Edit task modal
│   │   ├── AssignTaskModal.jsx # Assign task to user
│   │   ├── Toast.jsx          # Notification component
│   │   └── statcard.jsx       # Statistics cards
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context & state
│   ├── app.jsx                # Main app with routing
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind + custom animations
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── index.html

backend/
├── server.js
├── routes/
│   └── taskRoutes.js
├── models/
│   ├── Task.js
│   └── User.js
├── middleware/
│   └── roleAuth.js
├── .env
└── package.json
```

## 🛠️ Tech Stack

### Frontend
- **React 18**: UI framework
- **React Router DOM**: Navigation and routing
- **Tailwind CSS**: Styling and responsive design
- **Lucide React**: Beautiful SVG icons
- **React Snowfall**: Snowfall animation effect
- **Vite**: Fast build tool and dev server

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: Database (optional - demo uses localStorage)
- **JWT**: Authentication tokens

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
Visit: `http://localhost:5174`

#### Backend
```bash
cd backend
npm install
npm start
```
Server runs on: `http://localhost:5000`

## 🔑 Demo Accounts

### Quick Login
Click the role buttons on login page:

**Manager Account**
- Email: `manager@example.com`
- Password: `demo123`
- Role: Manager

**HR Account**
- Email: `hr@example.com`
- Password: `demo123`
- Role: HR

**Employee Account**
- Email: `employee@example.com`
- Password: `demo123`
- Role: Employee

### Sign Up
- Demo verification code: `123456`

## 📊 Features by Role

| Feature | Manager | HR | Employee |
|---------|---------|-----|----------|
| View Dashboard | ✅ | ✅ | ✅ |
| View Tasks | ✅ | ✅ | ✅ |
| Create Task | ✅ | ✅ | ❌ |
| Edit Task | ✅ | ✅ | ❌ |
| Delete Task | ✅ | ✅ | ❌ |
| Assign Task | ✅ | ✅ | ❌ |
| Complete Task | ❌ | ❌ | ✅ |
| View Trash | ✅ | ✅ | ❌ |
| Restore Task | ✅ | ✅ | ❌ |

## 🎨 Color Scheme

- **Primary**: Blue (#3B82F6) & Indigo (#4F46E5)
- **Success**: Green (#10B981) & Emerald (#059669)
- **Warning**: Yellow (#FBBF24) & Orange (#FB923C)
- **Danger**: Red (#EF4444) & Orange (#F97316)
- **Backgrounds**: Light gradients from 50-100 shade

## 🔔 Notifications

- **Success Toast**: Green background with checkmark icon
- **Error Toast**: Red background with alert icon
- **Auto-dismiss**: Toast messages auto-close after 4 seconds
- **Animated**: Slide down animation when appearing

## 🎯 Next Steps (Optional Enhancements)

1. **Backend Integration**: Connect to MongoDB for persistent data
2. **Email Verification**: Implement real email verification
3. **JWT Authentication**: Secure backend API with JWT tokens
4. **Task Filtering**: Advanced filtering options
5. **User Management**: Add user creation and management
6. **Analytics Dashboard**: Detailed analytics and reports
7. **Real-time Updates**: WebSocket for real-time task updates
8. **Export/Import**: Export tasks to CSV/PDF

## 📝 Notes

- All data is stored in localStorage (demo mode)
- Passwords are not actually validated (demo mode)
- Email verification uses demo code `123456`
- For production, implement actual backend integration
- Consider adding form validation and error handling

## 🤝 Contributing

Feel free to enhance the dashboard with additional features and improvements!

## 📄 License

MIT License - feel free to use this project for learning and development.

---

**Made with ❤️ for interactive admin dashboards**
