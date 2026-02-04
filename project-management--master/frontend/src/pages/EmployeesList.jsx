import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/employees.css';

const HARDCODED_EMPLOYEES = [
  { id: 'emp1', name: 'EMP1' },
  { id: 'emp2', name: 'EMP2' },
  { id: 'emp3', name: 'EMP3' },
  { id: 'emp4', name: 'EMP4' },
];

export const EmployeesList = () => {
  const { user } = useContext(AuthContext);

  if (user?.role !== 'PROJECT_MANAGER') {
    return null;
  }

  return (
    <div className="employees-container">
      <h2>Team Employees</h2>
      <div className="employees-grid">
        {HARDCODED_EMPLOYEES.map((emp) => (
          <div key={emp.id} className="employee-card">
            <div className="employee-avatar">{emp.name.charAt(0)}</div>
            <div className="employee-info">
              <h3>{emp.name}</h3>
              <p>{emp.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
