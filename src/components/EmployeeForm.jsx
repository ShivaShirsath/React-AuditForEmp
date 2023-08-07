import React, { useState } from 'react';
import api from '../utils/api';

function EmployeeForm() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await api.post('/emp', formData);
    if (response.status === 200) {
    }
  }

  return (
    <div>
      <h1>Add Employee</h1>
      <form onSubmit={handleSubmit}>
        {/* Input fields for employee data */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EmployeeForm;
