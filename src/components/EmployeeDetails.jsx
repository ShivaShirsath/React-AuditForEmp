import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams, Navigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await api.get(`/emp/${id}`);
        setEmployee(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching employee:", error.response.data.title);
        setError('Employee: ' + error.response.data.title);
        toast.error(error);
      }
    }
    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/emp/${id}`);
      toast((t) => (
        <span>
          Employee Removed !
          <button style={{
            border: 'none',
            backgroundColor: 'transparent'
          }} onClick={() => {
            toast.dismiss(t.id);
          }}
          >
            ❌
          </button>
        </span>
      ));
      setIsDeleted(true);
    } catch (error) {
      console.error("Error deleting employee:", error.response.data.title);
      setError('Error deleting employee: ' + error.response.data.title);
      toast.error(error);
    }
  };

  if (!employee) {
    return <div>{error}</div>;
  }

  if (isDeleted) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h3>Employee Details</h3>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{employee.name}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{employee.phone}</td>
          </tr>
          <tr>
            <th>City</th>
            <td>{employee.address.city}</td>
          </tr>
          <tr>
            <th>State</th>
            <td>{employee.address.state}</td>
          </tr>
          <tr>
            <th>Zip Code</th>
            <td>{employee.address.zipCode}</td>
          </tr>
          <tr>
            <th>Country</th>
            <td>{employee.address.country}</td>
          </tr>
          <tr>
            <th>
              <Link to={'/'} className="m-2 p-0 w-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-left-square" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                </svg>
              </Link>
            </th>
            <th>
              <button onClick={handleDelete} className="text-danger m-2 p-0 w-2" style={{ border: 'none', background: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-x" viewBox="0 0 16 16">
                  <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z" />
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708Z" />
                </svg>
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeDetails;
