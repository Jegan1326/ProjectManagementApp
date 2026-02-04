import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/taskassignment.css';

export const TaskAssignment = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user?.role !== 'PROJECT_MANAGER') {
    return (
      <div className="task-assignment-container">
        <div className="permission-denied">
          <p>⛔ Only PROJECT_MANAGER can access this page.</p>
          <button onClick={() => navigate('/')} className="back-btn">← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-assignment-container">
    </div>
  );
};

export default TaskAssignment;
