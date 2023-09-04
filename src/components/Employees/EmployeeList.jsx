import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { Loader } from "../../assets/Loader";
import Toggle from 'react-bootstrap-toggle';
/*
 * Component displaying a list of employees.
 * Fetches employee data from the API and provides actions like creating, editing and deleting.
 */
function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssending, setIsAssending] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch employees on component mount

  async function fetchEmployees() {
    setIsLoading(true);
    const response = await api.get(`/emp?page=${currentPage}`);
    setEmployees(response.data.data);
    setTotalPages(response.data.totalPages);
    setTimeout(() => {
      document.querySelector("dialog").close();
      setIsLoading(false);
    }, 1500);
  }

  useEffect(() => {
    if (currentPage === 0) {
      setCurrentPage(1);
    } else {
      fetchEmployees();
    }
  }, [currentPage]);

  useEffect(() => {
    setEmployees(employees.slice()
      .reverse())
  }, [isAssending]);
  // Delete employee by ID
  const handleDelete = async (id) => {
    if (confirm("Do you want to delete this Employee")) {
      setIsLoading(true);
      try {
        const response = await api.get(`/emp/${id}`);
        await api.delete(`/emp/${id}`, { data: response.data });
        window.location.reload();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <dialog open>
      <Loader />
    </dialog>
  ) : (
    <>
      <div style={{ textAlign: 'right' }}>
        <Toggle
          onClick={() => {
            setIsAssending(!isAssending);
          }}
          on={'Assending'}
          off={'Decending'}
          size="xs"
          offstyle="danger"
          active={isAssending}
        />
      </div>
      <h2>
        Employees{" "}
        <Link to={"add"} className="btn btn-success btn-sm text-white ms-3">
          <i className="bi bi-person-plus"></i> Create
        </Link>
      </h2>
      {!(employees.length === 0) ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>
                  ID
                </th>
                <th>Name</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employeeId}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.name}</td>
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "1dvmin"
                    }}
                  >
                    <Link
                      to={"edit/" + employee.employeeId}
                      className="btn btn-sm btn-primary text-white"
                    >
                      <i className="bi bi-pencil-square"></i> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(employee.employeeId)}
                      className="btn btn-sm btn-danger text-white"
                    >
                      <i className="bi bi-person-x"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <div className="pagination">
              <button
                className="btn btn-primary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-primary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <>Employess Not Available !</>
      )}
    </>
  );
}

export default EmployeeList;
