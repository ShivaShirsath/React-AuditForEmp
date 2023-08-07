import React, { useState } from 'react';
import api from '../utils/api';
import { useEffect } from 'react';

function EmployeeDetails() {
  const id=3002;
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    async function fetchEmployee() {
      const response = await api.get(`/emp/${id}`);
      setEmployee(response.data);
      console.log(response.data)
    }
    fetchEmployee();
  }, [id]);

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Employee Details</h1>
      <p>Name: {employee.name}</p>
      <p>Phone: {employee.phone}</p>
      <p>City: {employee.address.city}</p>
      <p>State: {employee.address.state}</p>
      <p>Zip Code: {employee.address.zipCode}</p>
      <p>Country: {employee.address.country}</p>
    </div>
  );
}

export default EmployeeDetails;
