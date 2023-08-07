import React, { useEffect, useState } from 'react';
import api from '../utils/api';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function fetchEmployees() {
      const response = await api.get('/emp');
      setEmployees(response.data);
      console.log(response.data)
    }
    fetchEmployees();
  }, []);

  return (
    <div>
      <h1>Employee List</h1>
      <ul>
        {employees.map((employee) => (
          <li key={employee.employeeId}>
            {employee.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeList;
